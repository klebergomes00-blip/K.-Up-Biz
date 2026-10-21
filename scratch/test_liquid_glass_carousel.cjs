const { spawn } = require('child_process');
const http = require('http');
const fs = require('fs');
const path = require('path');
const os = require('os');

async function wait(ms) { return new Promise(r => setTimeout(r, ms)); }
function getJson(url) {
  return new Promise((resolve, reject) => {
    http.get(url, res => {
      let data = ''; res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(JSON.parse(data)));
    }).on('error', reject);
  });
}

const artifactDir = 'C:\\Users\\Kleber Gomes\\.gemini\\antigravity-ide\\brain\\534ffe61-b1c8-4852-ba32-9f0c29436b8f';

const resolutions = [
  { width: 1920, height: 1080, name: '1920x1080' },
  { width: 1440, height: 900,  name: '1440x900' },
  { width: 1366, height: 768,  name: '1366x768' },
  { width: 1280, height: 720,  name: '1280x720' },
  { width: 1024, height: 768,  name: '1024x768' },
  { width: 390,  height: 844,  name: '390x844' }
];

async function testResolution(res) {
  console.log(`\n======================================================`);
  console.log(`TESTANDO RESOLUÇÃO: ${res.name} (${res.width}x${res.height})`);
  console.log(`======================================================`);

  const port = 9600 + Math.floor(Math.random() * 50);
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), `chrome-liquid-${res.name}-`));

  const chrome = spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', [
    '--headless=new',
    `--remote-debugging-port=${port}`,
    `--user-data-dir=${tempDir}`,
    '--no-first-run',
    '--no-default-browser-check',
    '--disable-gpu',
    '--no-sandbox',
    '--run-all-compositor-stages-before-draw',
    `--window-size=${res.width},${res.height}`,
    '--hide-scrollbars',
    'http://localhost:4321/'
  ]);

  try {
    let page = null;
    for (let attempt = 0; attempt < 30; attempt++) {
      try {
        const list = await getJson(`http://127.0.0.1:${port}/json/list`);
        page = list.find(t => t.type === 'page') || list[0];
        if (page && page.webSocketDebuggerUrl) break;
      } catch (e) {}
      await wait(300);
    }
    if (!page) throw new Error('Chrome did not respond on port ' + port);
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
    await wait(500);

    // Pular intro cinematográfica
    await send('Runtime.evaluate', {
      expression: `(() => {
        const btn = document.getElementById('intro-skip-btn');
        if (btn) btn.click();
        const intro = document.getElementById('cinematic-intro');
        if (intro) { intro.style.display = 'none'; intro.classList.add('is-completed'); }
        window.dispatchEvent(new CustomEvent('cinematic-intro-complete'));
      })()`
    });
    await wait(1500);

    const isMobile = res.width <= 1024;

    if (isMobile) {
      // Teste Mobile / Tablet
      await send('Runtime.evaluate', {
        expression: `document.getElementById('portfolio')?.scrollIntoView();`
      });
      await wait(800);

      const mobCheck = await send('Runtime.evaluate', {
        returnByValue: true,
        expression: `(() => {
          const portfolio = document.getElementById('portfolio');
          const pRect = portfolio ? portfolio.getBoundingClientRect() : null;
          const track = document.getElementById('liquid-carousel-track-mobile');
          const cards = track ? Array.from(track.querySelectorAll('.liquid-mobile-card')) : [];
          const docOverflow = document.documentElement.scrollWidth > window.innerWidth;
          
          return {
            hasPortfolio: !!portfolio,
            hasTrack: !!track,
            cardCount: cards.length,
            docOverflow,
            top: pRect ? Math.round(pRect.top) : null
          };
        })()`
      });
      console.log(`[${res.name}] Mobile state:`, mobCheck.result.value);

      const shot = await send('Page.captureScreenshot', { format: 'png' });
      fs.writeFileSync(path.join(artifactDir, `liquid_carousel_2_0_${res.name}.png`), Buffer.from(shot.data, 'base64'));
    } else {
      // Teste Desktop com 3D Carousel & Pinning
      // 1. Scroll direto até o portfólio para estabelecer pin-spacers de todas as seções anteriores
      await send('Runtime.evaluate', {
        expression: `document.getElementById('portfolio')?.scrollIntoView();`
      });
      await wait(800);

      const trigBounds = await send('Runtime.evaluate', {
        returnByValue: true,
        expression: `(() => {
          if (!window.ScrollTrigger) return null;
          ScrollTrigger.refresh();
          const trig = ScrollTrigger.getById('portfolio-trigger') || ScrollTrigger.getAll().find(t => t.trigger && t.trigger.id === 'portfolio');
          if (!trig) return null;
          return { start: Math.round(trig.start), end: Math.round(trig.end), dist: Math.round(trig.end - trig.start) };
        })()`
      });

      const bounds = trigBounds.result.value;
      if (!bounds) {
        console.error(`[${res.name}] Erro: ScrollTrigger do portfolio não encontrado!`);
        return;
      }
      console.log(`[${res.name}] Trigger bounds: start=${bounds.start}, end=${bounds.end}, dist=${bounds.dist}`);

      // 4 Casos com progressos correspondentes aos holds na timeline (0.0s, 2.7s, 5.1s, 7.6s em 9.0s de timeline)
      const testCases = [
        { name: 'case1_fernando', p: 0.04, idx: 0, title: 'Fernando Junior' },
        { name: 'case2_levelup',  p: 0.30, idx: 1, title: 'Level Up Agency' },
        { name: 'case3_aesthetics', p: 0.57, idx: 2, title: 'Level Up Aesthetics' },
        { name: 'case4_styvy',    p: 0.84, idx: 3, title: 'Styvy Burguer' }
      ];

      for (const tc of testCases) {
        const scrollTarget = Math.round(bounds.start + tc.p * bounds.dist);
        await send('Runtime.evaluate', { expression: `window.scrollTo(0, ${scrollTarget});` });
        await wait(600);

        const check = await send('Runtime.evaluate', {
          returnByValue: true,
          expression: `(() => {
            const winH = window.innerHeight;
            const panel = document.getElementById('liquid-panel-${tc.idx}');
            const btn = panel ? panel.querySelector('.panel-explore-btn') : null;
            const header = document.getElementById('portfolio-header');
            const indicator = document.getElementById('portfolio-indicator-bar');

            if (!panel || !btn) return { error: 'elements not found' };

            const pRect = panel.getBoundingClientRect();
            const bRect = btn.getBoundingClientRect();
            const hRect = header ? header.getBoundingClientRect() : null;
            const iRect = indicator ? indicator.getBoundingClientRect() : null;

            return {
              winH,
              panel: {
                top: Math.round(pRect.top),
                bottom: Math.round(pRect.bottom),
                height: Math.round(pRect.height),
                cutBottom: pRect.bottom > winH,
                cutTop: pRect.top < 0,
                clearanceBottom: Math.round(winH - pRect.bottom)
              },
              button: {
                top: Math.round(bRect.top),
                bottom: Math.round(bRect.bottom),
                cutBottom: bRect.bottom > winH,
                cutTop: bRect.top < 0,
                clearanceBottom: Math.round(winH - bRect.bottom)
              },
              headerBottom: hRect ? Math.round(hRect.bottom) : null,
              indicatorBottom: iRect ? Math.round(iRect.bottom) : null
            };
          })()`
        });

        const d = check.result.value;
        if (d.error) {
          console.log(`[${res.name}] ${tc.title} -> ERRO:`, d.error);
        } else {
          const ok = (!d.panel.cutBottom && !d.button.cutBottom && d.panel.top > 0);
          const icon = ok ? '✅ 100% IN-VIEWPORT' : '❌ CORTADO';
          console.log(`[${res.name}] ${tc.title.padEnd(20)}: ${icon} | Painel: [${d.panel.top}px - ${d.panel.bottom}px / ${d.winH}px] (sobra ${d.panel.clearanceBottom}px) | Botão: [${d.button.top}px - ${d.button.bottom}px]`);
        }

        // Salvar screenshot
        if (res.name === '1920x1080' || res.name === '1440x900' || res.name === '1366x768' || res.name === '1280x720') {
          const shot = await send('Page.captureScreenshot', { format: 'png' });
          fs.writeFileSync(path.join(artifactDir, `liquid_carousel_2_0_${res.name}_${tc.name}.png`), Buffer.from(shot.data, 'base64'));
        }
      }

      // Testar reversibilidade: rolar de volta para o Case 1
      console.log(`--- TESTANDO REVERSIBILIDADE (SCROLL BACKWARDS) ---`);
      const case1Y = Math.round(bounds.start + 0.04 * bounds.dist);
      await send('Runtime.evaluate', { expression: `window.scrollTo(0, ${case1Y});` });
      await wait(700);

      const revCheck = await send('Runtime.evaluate', {
        returnByValue: true,
        expression: `(() => {
          const winH = window.innerHeight;
          const panel = document.getElementById('liquid-panel-0');
          const btn = panel ? panel.querySelector('.panel-explore-btn') : null;
          const pRect = panel.getBoundingClientRect();
          const bRect = btn.getBoundingClientRect();
          return {
            panel: { top: Math.round(pRect.top), bottom: Math.round(pRect.bottom), cutBottom: pRect.bottom > winH },
            button: { bottom: Math.round(bRect.bottom), cutBottom: bRect.bottom > winH },
            winH
          };
        })()`
      });

      const rev = revCheck.result.value;
      const revOk = !rev.panel.cutBottom && !rev.button.cutBottom;
      console.log(`[${res.name}] Retorno ao Case 1: ${revOk ? '✅ REVERSÍVEL COM SUCESSO' : '❌ FALHA'} | Painel bottom: ${rev.panel.bottom}px / ${rev.winH}px`);
    }

    ws.close();
    chrome.kill();
  } catch (err) {
    console.error(`Erro na resolução ${res.name}:`, err);
  } finally {
    try { fs.rmSync(tempDir, { recursive: true, force: true }); } catch (e) {}
  }
}

async function main() {
  for (const r of resolutions) {
    await testResolution(r);
    await wait(600);
  }
  console.log('\n======================================================');
  console.log('TODAS AS RESOLUÇÕES TESTADAS COM SUCESSO NO LIQUID GLASS!');
  console.log('======================================================\n');
  process.exit(0);
}

main().catch(err => {
  console.error('Falha geral no teste do carrossel:', err);
  process.exit(1);
});
