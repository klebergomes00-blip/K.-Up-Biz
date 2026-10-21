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

async function measure() {
  const port = 9485;
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'chrome-geom-'));

  const chrome = spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', [
    '--headless=new',
    `--remote-debugging-port=${port}`,
    `--user-data-dir=${tempDir}`,
    '--no-first-run',
    '--no-default-browser-check',
    '--disable-gpu',
    '--no-sandbox',
    '--run-all-compositor-stages-before-draw',
    '--window-size=1366,768',
    '--hide-scrollbars',
    'http://localhost:4321/'
  ]);

  await wait(3500);
  const list = await getJson(`http://127.0.0.1:${port}/json/list`);
  const page = list.find(t => t.type === 'page') || list[0];
  const ws = new WebSocket(page.webSocketDebuggerUrl);
  await new Promise(r => ws.onopen = r);

  let id = 1;
  const send = (method, params = {}) => new Promise((resolve, reject) => {
    const curId = id++;
    const timer = setTimeout(() => reject(new Error('Timeout ' + method)), 15000);
    const handler = (e) => {
      const msg = JSON.parse(e.data);
      if (msg.id === curId) {
        clearTimeout(timer);
        ws.removeEventListener('message', handler);
        if (msg.error) reject(msg.error);
        else resolve(msg.result);
      }
    };
    ws.addEventListener('message', handler);
    ws.send(JSON.stringify({ id: curId, method, params }));
  });

  await send('Page.enable');
  await send('Runtime.enable');
  await wait(1000);

  // Skip intro
  await send('Runtime.evaluate', {
    expression: `(() => {
      const btn = document.getElementById('intro-skip-btn');
      if (btn) btn.click();
      const intro = document.getElementById('cinematic-intro');
      if (intro) { intro.style.display = 'none'; intro.classList.add('is-completed'); }
      window.dispatchEvent(new CustomEvent('cinematic-intro-complete'));
    })()`
  });
  await wait(1200);

  const secInfo = await send('Runtime.evaluate', {
    returnByValue: true,
    expression: `(() => {
      const s = document.getElementById('portfolio');
      const r = s.getBoundingClientRect();
      return r.top + window.scrollY;
    })()`
  });
  const startY = secInfo.result.value;

  // Scroll to Case 1 hold
  await send('Runtime.evaluate', { expression: `window.scrollTo(0, ${startY + 850});` });
  await wait(1000);

  const geom = await send('Runtime.evaluate', {
    returnByValue: true,
    expression: `(() => {
      const winH = window.innerHeight;
      const winW = window.innerWidth;
      const header = document.getElementById('portfolio-header').getBoundingClientRect();
      const stage = document.getElementById('portfolio-stage-container').getBoundingClientRect();
      const frame = document.getElementById('panoramic-frame').getBoundingClientRect();
      const card = document.getElementById('portfolio-card-0').getBoundingClientRect();
      const btn = document.getElementById('btn-explore-fernando-junior').getBoundingClientRect();

      return {
        viewport: { width: winW, height: winH },
        header: { top: header.top, bottom: header.bottom, height: header.height },
        stage: { top: stage.top, bottom: stage.bottom, height: stage.height },
        frame: { top: frame.top, bottom: frame.bottom, height: frame.height, cutOffBottom: frame.bottom > winH },
        card: { top: card.top, bottom: card.bottom, height: card.height },
        button: { top: btn.top, bottom: btn.bottom, cutOffBottom: btn.bottom > winH }
      };
    })()`
  });

  console.log('Geometry at 1366x768:\n', JSON.stringify(geom.result.value, null, 2));

  ws.close();
  chrome.kill();
  try { fs.rmSync(tempDir, { recursive: true, force: true }); } catch (e) {}
  process.exit(0);
}

measure().catch(console.error);
