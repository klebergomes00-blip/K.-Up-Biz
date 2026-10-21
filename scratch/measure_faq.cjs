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
  const port = 9760;
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'chrome-diag-'));

  const chrome = spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', [
    '--headless=new',
    `--remote-debugging-port=${port}`,
    `--user-data-dir=${tempDir}`,
    '--no-first-run',
    '--no-default-browser-check',
    '--window-size=1440,900',
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
    await send('Page.enable');

    await send('Runtime.evaluate', {
      expression: `(() => {
        const intro = document.getElementById('cinematic-intro');
        if (intro) intro.remove();
        window.dispatchEvent(new CustomEvent('cinematic-intro-complete'));
      })()`
    });
    await wait(1000);

    const diag = await send('Runtime.evaluate', {
      expression: `(() => {
        const faq = document.getElementById('faq');
        const grid = faq.querySelector('.faq-grid');
        const colLeft = faq.querySelector('.faq-visual-col');
        const colRight = faq.querySelector('.faq-accordion-col');
        const firstItem = faq.querySelector('.faq-item');

        const colRightStyle = window.getComputedStyle(colRight);
        const firstItemStyle = window.getComputedStyle(firstItem);

        return {
          gridRect: grid.getBoundingClientRect(),
          colLeftRect: colLeft.getBoundingClientRect(),
          colRightRect: colRight.getBoundingClientRect(),
          firstItemRect: firstItem.getBoundingClientRect(),
          colRightDisplay: colRightStyle.display,
          colRightOpacity: colRightStyle.opacity,
          colRightVisibility: colRightStyle.visibility,
          firstItemOpacity: firstItemStyle.opacity,
          firstItemInlineStyle: firstItem.getAttribute('style'),
          firstItemHeight: firstItem.offsetHeight
        };
      })()`,
      returnByValue: true
    });
    console.log('DIAGNOSTICO:', JSON.stringify(diag.result.value, null, 2));

    ws.close();
  } finally {
    chrome.kill();
    try { fs.rmSync(tempDir, { recursive: true, force: true }); } catch (e) {}
  }
}

run().catch(console.error);
