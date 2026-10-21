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

const artifactDir = 'C:\\Users\\Kleber Gomes\\.gemini\\antigravity-ide\\brain\\534ffe61-b1c8-4852-ba32-9f0c29436b8f';

const desktopResolutions = [
  { width: 1920, height: 1080, name: '1920x1080' },
  { width: 1440, height: 900,  name: '1440x900' },
  { width: 1366, height: 768,  name: '1366x768' },
  { width: 1280, height: 720,  name: '1280x720' },
  { width: 1024, height: 768,  name: '1024x768' }
];

async function testResolution(res) {
  console.log(`\n======================================================`);
  console.log(`TESTANDO RESOLUÇÃO: ${res.name} (${res.width}x${res.height})`);
  console.log(`======================================================`);

  const port = 9560 + Math.floor(Math.random() * 30);
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), `chrome-test-${res.name}-`));

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

    // Rolar até o portfólio para estabelecer e acomodar todos os pin-spacers das seções anteriores
    await send('Runtime.evaluate', {
      expression: `(() => {
        const p = document.getElementById('portfolio');
        if (p) p.scrollIntoView();
      })()`
    });
    await wait(800);

    // Obter limites exatos e estabilizados do portfolio-trigger
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

    console.log(`[${res.name}] Bounds estabilizados do ScrollTrigger: start=${bounds.start}, end=${bounds.end}, dist=${bounds.dist}`);

    // Os 4 cases com seus respectivos pontos centrais no timeline GSAP
    const caseCheckpoints = [
      { name: 'case1_fernando', p: 0.24, cardIdx: 0, title: 'Fernando Junior' },
      { name: 'case2_levelup',  p: 0.44, cardIdx: 1, title: 'Level Up Agency' },
      { name: 'case3_aesthetics', p: 0.64, cardIdx: 2, title: 'Level Up Aesthetics' },
      { name: 'case4_styvy',    p: 0.84, cardIdx: 3, title: 'Styvy Burguer' }
    ];

    console.log(`--- TESTANDO ROLAGEM PARA BAIXO (FORWARD) ---`);
    for (const c of caseCheckpoints) {
      const scrollY = Math.round(bounds.start + c.p * bounds.dist);
      await send('Runtime.evaluate', { expression: `window.scrollTo(0, ${scrollY});` });
      await wait(600);

      const check = await send('Runtime.evaluate', {
        returnByValue: true,
        expression: `(() => {
          const winH = window.innerHeight;
          const frame = document.getElementById('panoramic-frame');
          const card = document.getElementById('portfolio-card-${c.cardIdx}');
          const btn = card ? card.querySelector('.case-explore-btn') : null;
          const nameEl = card ? card.querySelector('.case-name') : null;

          if (!frame || !card || !btn) {
            return { error: 'elements missing' };
          }

          const fRect = frame.getBoundingClientRect();
          const bRect = btn.getBoundingClientRect();
          const cRect = card.getBoundingClientRect();

          return {
            winH,
            frame: {
              top: Math.round(fRect.top),
              bottom: Math.round(fRect.bottom),
              height: Math.round(fRect.height),
              cutOffBottom: fRect.bottom > winH,
              cutOffTop: fRect.top < 0,
              clearanceBottom: Math.round(winH - fRect.bottom)
            },
            button: {
              top: Math.round(bRect.top),
              bottom: Math.round(bRect.bottom),
              cutOffBottom: bRect.bottom > winH,
              cutOffTop: bRect.top < 0,
              clearanceBottom: Math.round(winH - bRect.bottom)
            },
            cardName: nameEl ? nameEl.textContent.trim() : ''
          };
        })()`
      });

      const d = check.result.value;
      if (d.error) {
        console.log(`[${res.name}] ${c.title} -> ERRO:`, d.error);
      } else {
        const status = (!d.frame.cutOffBottom && !d.button.cutOffBottom) ? '✅ 100% IN-VIEWPORT' : '❌ CORTADO';
        console.log(`[${res.name}] ${c.title.padEnd(20)}: ${status} | Frame: [${d.frame.top}px - ${d.frame.bottom}px / ${d.winH}px] (sobram ${d.frame.clearanceBottom}px) | Botão: [${d.button.top}px - ${d.button.bottom}px] (sobram ${d.button.clearanceBottom}px)`);
      }

      // Captura de tela para resoluções de referência e verificação visual
      if (res.name === '1366x768' || res.name === '1280x720') {
        const shot = await send('Page.captureScreenshot', { format: 'png' });
        const outShot = path.join(artifactDir, `portfolio_${res.name}_${c.name}.png`);
        fs.writeFileSync(outShot, Buffer.from(shot.data, 'base64'));
      }
    }

    // Testar reversibilidade: rolar de volta para o case 1
    console.log(`--- TESTANDO REVERSIBILIDADE (SCROLL BACKWARDS PARA CASE 1) ---`);
    const case1Y = Math.round(bounds.start + 0.24 * bounds.dist);
    await send('Runtime.evaluate', { expression: `window.scrollTo(0, ${case1Y});` });
    await wait(700);

    const revCheck = await send('Runtime.evaluate', {
      returnByValue: true,
      expression: `(() => {
        const winH = window.innerHeight;
        const frame = document.getElementById('panoramic-frame');
        const card = document.getElementById('portfolio-card-0');
        const btn = card ? card.querySelector('.case-explore-btn') : null;
        const fRect = frame.getBoundingClientRect();
        const bRect = btn.getBoundingClientRect();

        return {
          winH,
          frame: { top: Math.round(fRect.top), bottom: Math.round(fRect.bottom), cutOffBottom: fRect.bottom > winH },
          button: { top: Math.round(bRect.top), bottom: Math.round(bRect.bottom), cutOffBottom: bRect.bottom > winH }
        };
      })()`
    });

    const rev = revCheck.result.value;
    const revStatus = (!rev.frame.cutOffBottom && !rev.button.cutOffBottom) ? '✅ REVERSÍVEL COM SUCESSO' : '❌ FALHA NA REVERSÃO';
    console.log(`[${res.name}] Retorno ao Case 1: ${revStatus} | Frame bottom: ${rev.frame.bottom}px / ${rev.winH}px | Botão bottom: ${rev.button.bottom}px`);

    ws.close();
    chrome.kill();
  } catch (err) {
    console.error(`Erro na resolução ${res.name}:`, err);
  } finally {
    try { fs.rmSync(tempDir, { recursive: true, force: true }); } catch (e) {}
  }
}

async function main() {
  for (const r of desktopResolutions) {
    await testResolution(r);
    await wait(600);
  }
  console.log('\n======================================================');
  console.log('FINALIZADA A BATERIA DE TESTES DE TODAS AS RESOLUÇÕES!');
  console.log('======================================================\n');
  process.exit(0);
}

main().catch(err => {
  console.error('Falha geral no teste:', err);
  process.exit(1);
});
