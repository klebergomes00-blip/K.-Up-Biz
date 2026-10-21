const { spawn } = require('child_process');
const http = require('http');
const fs = require('fs');
const path = require('path');
const os = require('os');

async function wait(ms) { return new Promise(r => setTimeout(r, ms)); }
function getJson(url) {
  return new Promise((resolve, reject) => {
    http.get(url, res => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(JSON.parse(data)));
    }).on('error', reject);
  });
}

async function run() {
  const port = 9556;
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'chrome-diag-'));
  const chrome = spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', [
    '--headless=new',
    '--remote-debugging-port=' + port,
    '--user-data-dir=' + tempDir,
    '--no-first-run',
    '--window-size=1920,1080',
    'http://localhost:4321/'
  ]);

  try {
    await wait(3000);
    const list = await getJson('http://127.0.0.1:' + port + '/json/list');
    const ws = new WebSocket((list.find(t => t.type === 'page') || list[0]).webSocketDebuggerUrl);
    await new Promise(r => ws.onopen = r);

    let id = 1;
    const send = (method, params = {}) => new Promise((res, rej) => {
      const curId = id++;
      const handler = (e) => {
        const msg = JSON.parse(e.data);
        if (msg.id === curId) {
          ws.removeEventListener('message', handler);
          res(msg.result);
        }
      };
      ws.addEventListener('message', handler);
      ws.send(JSON.stringify({ id: curId, method, params }));
    });

    await send('Runtime.enable');
    await send('Runtime.evaluate', {
      expression: `(() => {
        const b = document.getElementById('intro-skip-btn');
        if (b) b.click();
        const intro = document.getElementById('cinematic-intro');
        if (intro) { intro.style.display = 'none'; intro.classList.add('is-completed'); }
        window.dispatchEvent(new CustomEvent('cinematic-intro-complete'));
      })()`
    });
    await wait(2000);

    const stInfo = await send('Runtime.evaluate', {
      returnByValue: true,
      expression: `(() => {
        const triggers = (window.ScrollTrigger ? ScrollTrigger.getAll() : []).map(t => ({
          id: t.vars.id || t.trigger?.id || (t.trigger?.className ? String(t.trigger.className).substring(0, 30) : 'unknown'),
          start: Math.round(t.start),
          end: Math.round(t.end),
          pin: !!t.pin
        }));
        const s = document.getElementById('portfolio');
        const r = s ? s.getBoundingClientRect() : null;
        return { triggers, portfolioRect: r ? { top: Math.round(r.top), bottom: Math.round(r.bottom), height: Math.round(r.height) } : null, scrollY: window.scrollY };
      })()`
    });
    console.log('ScrollTriggers & Portfolio info:', JSON.stringify(stInfo.result.value, null, 2));

    // Now let's find the portfolio trigger
    const evalPortfolio = await send('Runtime.evaluate', {
      returnByValue: true,
      expression: `(() => {
        const portfolioTrig = ScrollTrigger.getAll().find(t => t.trigger && t.trigger.id === 'portfolio');
        if (!portfolioTrig) return { error: 'No portfolio ScrollTrigger found' };
        
        return {
          start: Math.round(portfolioTrig.start),
          end: Math.round(portfolioTrig.end),
          totalDist: Math.round(portfolioTrig.end - portfolioTrig.start)
        };
      })()`
    });
    console.log('Portfolio ScrollTrigger exact bounds:', evalPortfolio.result.value);

    const bounds = evalPortfolio.result.value;
    if (bounds.start) {
      // Test progress at 0.1, 0.22, 0.35, 0.55, 0.8, 0.95
      const progresses = [0.05, 0.15, 0.23, 0.35, 0.55, 0.8, 0.95];
      for (const p of progresses) {
        const targetScroll = Math.round(bounds.start + p * (bounds.end - bounds.start));
        await send('Runtime.evaluate', { expression: `window.scrollTo(0, ${targetScroll});` });
        await wait(500);

        const state = await send('Runtime.evaluate', {
          returnByValue: true,
          expression: `(() => {
            const winH = window.innerHeight;
            const frame = document.getElementById('panoramic-frame');
            const header = document.getElementById('portfolio-editorial-header');
            const hRect = header ? header.getBoundingClientRect() : null;
            const fRect = frame ? frame.getBoundingClientRect() : null;
            const activeCard = Array.from(document.querySelectorAll('.portfolio-case-card')).find(c => {
              const op = window.getComputedStyle(c).opacity;
              return parseFloat(op) > 0.5;
            });
            const cRect = activeCard ? activeCard.getBoundingClientRect() : null;
            const btn = activeCard ? activeCard.querySelector('.case-explore-btn') : null;
            const bRect = btn ? btn.getBoundingClientRect() : null;

            return {
              p: ${p},
              winH,
              headerHeight: hRect ? Math.round(hRect.height) : null,
              headerBottom: hRect ? Math.round(hRect.bottom) : null,
              frame: fRect ? { top: Math.round(fRect.top), bottom: Math.round(fRect.bottom), height: Math.round(fRect.height), cutBottom: fRect.bottom > winH, cutTop: fRect.top < 0 } : null,
              card: cRect ? { id: activeCard.id, top: Math.round(cRect.top), bottom: Math.round(cRect.bottom) } : null,
              button: bRect ? { top: Math.round(bRect.top), bottom: Math.round(bRect.bottom), cutBottom: bRect.bottom > winH } : null
            };
          })()`
        });
        console.log(`Progress ${p}:`, state.result.value);
      }
    }

    ws.close();
    chrome.kill();
  } catch(e) {
    console.error('Error:', e);
  } finally {
    try { fs.rmSync(tempDir, { recursive: true, force: true }); } catch(e){}
  }
}
run();
