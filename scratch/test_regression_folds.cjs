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

async function run() {
  console.log('--- TESTE DE REGRESSÃO DAS 5 DOBRAS ANTERIORES ---');
  const port = 9655;
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'chrome-regress-'));

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
    await wait(3000);
    const list = await getJson(`http://127.0.0.1:${port}/json/list`);
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
    await send('Runtime.evaluate', {
      expression: `(() => {
        const btn = document.getElementById('intro-skip-btn');
        if (btn) btn.click();
        window.dispatchEvent(new CustomEvent('cinematic-intro-complete'));
      })()`
    });
    await wait(1500);

    const regression = await send('Runtime.evaluate', {
      returnByValue: true,
      expression: `(() => {
        // 1. Hero
        const heroWrapper = document.getElementById('hero-scroll-wrapper');
        const heroTitle = document.querySelector('.hero-title');

        // 2. Nossa Visao
        const visao = document.getElementById('nossa-visao');

        // 3. Digital Shelf
        const shelf = document.getElementById('digital-shelf-track') || document.querySelector('.shelf-track');

        // 4. Nosso Metodo (mountain video)
        const metodo = document.getElementById('metodo');
        const mountainVideo = metodo ? metodo.querySelector('video') : null;

        // 5. Nosso Diferencial (Fernando Junior tablet video)
        const diferencial = document.getElementById('diferencial');
        const tabletVideo = diferencial ? diferencial.querySelector('video') : null;

        return {
          hero: { exists: !!heroWrapper, hasTitle: !!heroTitle },
          visao: { exists: !!visao },
          shelf: { exists: !!shelf },
          metodo: {
            exists: !!metodo,
            hasVideo: !!mountainVideo,
            videoSrc: mountainVideo ? mountainVideo.currentSrc || mountainVideo.src : null,
            readyState: mountainVideo ? mountainVideo.readyState : null
          },
          diferencial: {
            exists: !!diferencial,
            hasVideo: !!tabletVideo,
            videoSrc: tabletVideo ? tabletVideo.currentSrc || tabletVideo.src : null,
            autoplay: tabletVideo ? tabletVideo.autoplay : null,
            muted: tabletVideo ? tabletVideo.muted : null,
            loop: tabletVideo ? tabletVideo.loop : null
          }
        };
      })()`
    });

    console.log('Resultado da Regressão:', JSON.stringify(regression.result.value, null, 2));

    ws.close();
    chrome.kill();
  } catch(e) {
    console.error('Erro na regressão:', e);
  } finally {
    try { fs.rmSync(tempDir, { recursive: true, force: true }); } catch(e){}
  }
}
run();
