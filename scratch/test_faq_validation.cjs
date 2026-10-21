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

async function main() {
  console.log('--- TESTE COMPLETO DE VALIDAÇÃO: PERGUNTAS FREQUENTES & REGRESSÃO ---');

  const port = 9695;
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'chrome-faq-main-'));

  const chrome = spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', [
    '--headless=new',
    `--remote-debugging-port=${port}`,
    `--user-data-dir=${tempDir}`,
    '--no-first-run',
    '--no-default-browser-check',
    '--window-size=1920,1080',
    'http://localhost:4321/'
  ]);

  try {
    let list;
    for (let i = 0; i < 20; i++) {
      try {
        list = await getJson(`http://127.0.0.1:${port}/json/list`);
        if (list && list.length > 0) break;
      } catch (e) {}
      await wait(500);
    }

    const page = list.find(t => t.type === 'page') || list[0];
    const ws = new WebSocket(page.webSocketDebuggerUrl);
    await new Promise(r => ws.onopen = r);

    let id = 1;
    const send = (method, params = {}) => new Promise((resolve, reject) => {
      const curId = id++;
      const handler = (e) => {
        const msg = JSON.parse(e.data);
        if (msg.id === curId) {
          ws.removeEventListener('message', handler);
          if (msg.error) reject(msg.error);
          else resolve(msg.result);
        }
      };
      ws.addEventListener('message', handler);
      ws.send(JSON.stringify({ id: curId, method, params }));
    });

    await send('Runtime.enable');
    await send('Page.enable');
    await send('Emulation.setFocusEmulationEnabled', { enabled: true });

    // Skip cinematic intro
    await send('Runtime.evaluate', {
      expression: `(() => {
        const btn = document.getElementById('intro-skip-btn');
        if (btn) btn.click();
        const intro = document.getElementById('cinematic-intro');
        if (intro) {
          intro.classList.add('is-completed');
          intro.style.display = 'none';
        }
        window.dispatchEvent(new CustomEvent('cinematic-intro-complete'));
      })()`
    });
    await wait(1000);

    // TESTE MOBILE 390x844
    console.log('\n--- EXECUTANDO TESTE MOBILE (390x844) ---');
    await send('Emulation.setDeviceMetricsOverride', {
      width: 390,
      height: 844,
      deviceScaleFactor: 2,
      mobile: true
    });
    await wait(800);

    // Scroll to FAQ in Mobile
    await send('Runtime.evaluate', {
      expression: `(() => {
        const intro = document.getElementById('cinematic-intro');
        if (intro) intro.remove();
        const faq = document.getElementById('faq');
        if (faq) {
          faq.scrollIntoView({ behavior: 'instant', block: 'start' });
        }
      })()`
    });
    await wait(1200);

    // Check overflow & mobile layout
    const mobileCheck = await send('Runtime.evaluate', {
      expression: `(() => {
        const faq = document.getElementById('faq');
        const hasOverflow = document.documentElement.scrollWidth > window.innerWidth;
        const item1 = document.getElementById('faq-item-01');
        const item1Open = item1?.classList.contains('is-open');
        const btn1Aria = document.getElementById('faq-btn-01')?.getAttribute('aria-expanded');

        return {
          hasOverflow,
          item1Open,
          btn1Aria,
          scrollWidth: document.documentElement.scrollWidth,
          innerWidth: window.innerWidth
        };
      })()`,
      returnByValue: true
    });
    console.log('Mobile layout check:', JSON.stringify(mobileCheck.result.value, null, 2));

    const ssMobile1 = await send('Page.captureScreenshot', { format: 'png' });
    const ssMobile1Path = path.join(artifactDir, 'faq_mobile_default.png');
    fs.writeFileSync(ssMobile1Path, Buffer.from(ssMobile1.data, 'base64'));
    console.log(`Screenshot Mobile salvo: ${ssMobile1Path}`);

    // Mobile click item 03
    const mobileClick = await send('Runtime.evaluate', {
      expression: `(() => {
        const btn3 = document.getElementById('faq-btn-03');
        if (btn3) btn3.click();
        const item1 = document.getElementById('faq-item-01');
        const item3 = document.getElementById('faq-item-03');
        return {
          item1Open: item1?.classList.contains('is-open'),
          item3Open: item3?.classList.contains('is-open'),
          item3Aria: btn3?.getAttribute('aria-expanded')
        };
      })()`,
      returnByValue: true
    });
    console.log('Mobile click item 03:', JSON.stringify(mobileClick.result.value, null, 2));
    await wait(600);

    const ssMobile3 = await send('Page.captureScreenshot', { format: 'png' });
    const ssMobile3Path = path.join(artifactDir, 'faq_mobile_item3_open.png');
    fs.writeFileSync(ssMobile3Path, Buffer.from(ssMobile3.data, 'base64'));
    console.log(`Screenshot Mobile (item 3 aberto) salvo: ${ssMobile3Path}`);

    // TESTE DE REGRESSÃO DAS 6 DOBRAS ANTERIORES
    console.log('\n--- VERIFICAÇÃO DE INTEGRIDADE DAS 6 DOBRAS ANTERIORES ---');
    await send('Emulation.clearDeviceMetricsOverride');
    await wait(600);

    const regression = await send('Runtime.evaluate', {
      expression: `(() => {
        const hero = document.getElementById('hero-scroll-wrapper') || document.querySelector('.hero-scroll-wrapper');
        const visao = document.getElementById('visao') || document.querySelector('.visao-section');
        const shelf = document.getElementById('shelf') || document.querySelector('.digital-shelf-section');
        const metodo = document.getElementById('metodo') || document.querySelector('.metodo-section');
        const diferencial = document.getElementById('diferencial') || document.querySelector('.diferencial-section');
        const projetos = document.getElementById('projetos') || document.querySelector('.portfolio-section');
        const faq = document.getElementById('faq');

        const videoTablet = document.querySelector('video source[src*="fernando-corretor-demo.mp4"], video[src*="fernando-corretor-demo.mp4"]');
        const carouselCards = document.querySelectorAll('.liquid-glass-card, .portfolio-card, [data-case-id]');

        return {
          dobra1_Hero: !!hero,
          dobra2_NossaVisao: !!visao,
          dobra3_DigitalShelf: !!shelf,
          dobra4_NossoMetodo: !!metodo,
          dobra5_NossoDiferencial: !!diferencial,
          dobra6_ProjetosSelecionados: !!projetos,
          dobra7_PerguntasFrequentes: !!faq,
          videoTabletPresent: !!videoTablet,
          carouselCardsCount: carouselCards.length
        };
      })()`,
      returnByValue: true
    });
    console.log('Resultado da regressão:', JSON.stringify(regression.result.value, null, 2));

    ws.close();
  } finally {
    chrome.kill();
    try { fs.rmSync(tempDir, { recursive: true, force: true }); } catch (e) {}
  }
}

main().catch(err => {
  console.error('Erro na validação:', err);
  process.exit(1);
});
