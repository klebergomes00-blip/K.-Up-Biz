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
  console.log('--- CAPTURA DIRETA MOBILE FAQ (390x844) ---');

  const port = 9710;
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'chrome-mobile-faq-'));

  const chrome = spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', [
    '--headless=new',
    `--remote-debugging-port=${port}`,
    `--user-data-dir=${tempDir}`,
    '--no-first-run',
    '--no-default-browser-check',
    '--window-size=390,844',
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

    // Wait 2s for initial load, then remove intro and fire event
    await wait(2000);
    await send('Runtime.evaluate', {
      expression: `(() => {
        const intro = document.getElementById('cinematic-intro');
        if (intro) intro.remove();
        window.dispatchEvent(new CustomEvent('cinematic-intro-complete'));
      })()`
    });
    await wait(1000);

    // Scroll down to FAQ
    await send('Runtime.evaluate', {
      expression: `(() => {
        const faq = document.getElementById('faq');
        if (faq) {
          faq.scrollIntoView({ behavior: 'instant', block: 'start' });
        }
      })()`
    });
    await wait(1500);

    // Check overflow and state
    const info = await send('Runtime.evaluate', {
      expression: `(() => {
        const faq = document.getElementById('faq');
        const rect = faq ? faq.getBoundingClientRect() : null;
        return {
          scrollWidth: document.documentElement.scrollWidth,
          innerWidth: window.innerWidth,
          hasOverflow: document.documentElement.scrollWidth > window.innerWidth,
          faqTop: rect ? rect.top : null,
          faqHeight: rect ? rect.height : null
        };
      })()`,
      returnByValue: true
    });
    console.log('Mobile FAQ state:', JSON.stringify(info.result.value, null, 2));

    const ss = await send('Page.captureScreenshot', { format: 'png' });
    const ssPath = path.join(artifactDir, 'faq_mobile_view.png');
    fs.writeFileSync(ssPath, Buffer.from(ss.data, 'base64'));
    console.log(`Screenshot Mobile salvo em: ${ssPath}`);

    // Click item 2
    await send('Runtime.evaluate', {
      expression: `(() => {
        const btn2 = document.getElementById('faq-btn-02');
        if (btn2) btn2.click();
      })()`
    });
    await wait(800);

    const ss2 = await send('Page.captureScreenshot', { format: 'png' });
    const ss2Path = path.join(artifactDir, 'faq_mobile_item2_open.png');
    fs.writeFileSync(ss2Path, Buffer.from(ss2.data, 'base64'));
    console.log(`Screenshot Mobile (item 2 aberto) salvo em: ${ss2Path}`);

    ws.close();
  } finally {
    chrome.kill();
    try { fs.rmSync(tempDir, { recursive: true, force: true }); } catch (e) {}
  }
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
