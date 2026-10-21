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
  const port = 9811;
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'chrome-test4-'));

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
    await wait(2500);
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
        const faq = document.getElementById('faq');
        if (faq) faq.scrollIntoView({ behavior: 'instant', block: 'start' });
      })()`
    });
    await wait(2000);

    // Click item 4
    await send('Runtime.evaluate', {
      expression: `(() => {
        const btn4 = document.getElementById('faq-btn-04');
        if (btn4) btn4.click();
      })()`
    });
    await wait(1000);

    const res = await send('Runtime.evaluate', {
      expression: `(() => {
        const item4 = document.getElementById('faq-item-04');
        const btn4 = document.getElementById('faq-btn-04');
        const q4 = item4.querySelector('.faq-question');
        const a4 = item4.querySelector('.faq-answer');
        const num4 = item4.querySelector('.faq-number');

        const sItem = window.getComputedStyle(item4);
        const sBtn = window.getComputedStyle(btn4);
        const sQ = window.getComputedStyle(q4);
        const sA = window.getComputedStyle(a4);

        return {
          itemInline: item4.getAttribute('style'),
          itemOpacity: sItem.opacity,
          itemBg: sItem.backgroundColor,
          btnColor: sBtn.color,
          qColor: sQ.color,
          qFontWeight: sQ.fontWeight,
          aColor: sA.color,
          aOpacity: sA.opacity,
          isOpen: item4.classList.contains('is-open')
        };
      })()`,
      returnByValue: true
    });
    console.log('ITEM 4 STATUS:', JSON.stringify(res.result.value, null, 2));

    const ss = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync('C:\\Users\\Kleber Gomes\\.gemini\\antigravity-ide\\brain\\534ffe61-b1c8-4852-ba32-9f0c29436b8f\\test_item4_clean.png', Buffer.from(ss.data, 'base64'));

    ws.close();
  } finally {
    chrome.kill();
    try { fs.rmSync(tempDir, { recursive: true, force: true }); } catch (e) {}
  }
}

run().catch(console.error);
