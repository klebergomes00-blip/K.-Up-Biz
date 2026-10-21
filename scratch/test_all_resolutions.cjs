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

const resolutions = [
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

  const port = 9520 + Math.floor(Math.random() * 50);
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
    await wait(800);

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

    const cases = [
      { name: 'case1_fernando', offset: 1000, cardIdx: 0 },
      { name: 'case2_levelup', offset: 2300, cardIdx: 1 },
      { name: 'case3_aesthetics', offset: 3300, cardIdx: 2 },
      { name: 'case4_styvy', offset: 4100, cardIdx: 3 }
    ];

    for (const c of cases) {
      await send('Runtime.evaluate', { expression: `window.scrollTo(0, ${startY + c.offset});` });
      await wait(800);

      const check = await send('Runtime.evaluate', {
        returnByValue: true,
        expression: `(() => {
          try {
            const winH = window.innerHeight;
            const frame = document.getElementById('panoramic-frame');
            const card = document.getElementById('portfolio-card-${c.cardIdx}');
            const btn = card ? card.querySelector('.case-explore-btn') : null;

            if (!frame || !card || !btn) {
              return { error: 'elements not found', hasFrame: !!frame, hasCard: !!card, hasBtn: !!btn };
            }

            const frameRect = frame.getBoundingClientRect();
            const btnRect = btn.getBoundingClientRect();

            return {
              winH,
              frame: {
                top: Math.round(frameRect.top),
                bottom: Math.round(frameRect.bottom),
                height: Math.round(frameRect.height),
                cutOffBottom: frameRect.bottom > winH,
                cutOffTop: frameRect.top < 0
              },
              button: {
                top: Math.round(btnRect.top),
                bottom: Math.round(btnRect.bottom),
                cutOffBottom: btnRect.bottom > winH,
                cutOffTop: btnRect.top < 0
              }
            };
          } catch(err) {
            return { error: err.message };
          }
        })()`
      });

      const resData = check.result.value;
      if (resData.error) {
        console.log(`[${res.name}] ${c.name} -> ERRO:`, resData);
      } else {
        console.log(`[${res.name}] ${c.name} -> Frame: [top ${resData.frame.top}, bottom ${resData.frame.bottom} / winH ${resData.winH}] | Cortado: ${resData.frame.cutOffBottom} | Botão cortado: ${resData.button.cutOffBottom}`);
      }

      if (res.name === '1366x768' || res.name === '1280x720') {
        const shot = await send('Page.captureScreenshot', { format: 'png' });
        const outShot = path.join(artifactDir, `portfolio_${res.name}_${c.name}.png`);
        fs.writeFileSync(outShot, Buffer.from(shot.data, 'base64'));
      }
    }

    ws.close();
    chrome.kill();
  } finally {
    try { fs.rmSync(tempDir, { recursive: true, force: true }); } catch(e){}
  }
}

async function main() {
  for (const r of resolutions) {
    await testResolution(r);
    await wait(800);
  }
  console.log('\n======================================================');
  console.log('TODAS AS RESOLUÇÕES FORAM TESTADAS COM SUCESSO!');
  console.log('======================================================');
  process.exit(0);
}

main().catch(err => {
  console.error('Falha geral no teste de resoluções:', err);
  process.exit(1);
});
