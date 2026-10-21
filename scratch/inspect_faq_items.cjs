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
  const port = 9799;
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'chrome-inspect-'));

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
      })()`
    });
    await wait(1000);

    // Scroll directly to FAQ
    await send('Runtime.evaluate', {
      expression: `(() => {
        const faq = document.getElementById('faq');
        if (faq) faq.scrollIntoView({ behavior: 'instant', block: 'start' });
      })()`
    });
    await wait(1000);

    const data = await send('Runtime.evaluate', {
      expression: `(() => {
        const faq = document.getElementById('faq');
        const grid = faq.querySelector('.faq-grid');
        const colLeft = faq.querySelector('.faq-visual-col');
        const colRight = faq.querySelector('.faq-accordion-col');
        const firstItem = faq.querySelector('.faq-item');
        const firstBtn = faq.querySelector('.faq-trigger');
        const firstQuestion = faq.querySelector('.faq-question');

        function getInfo(el) {
          if (!el) return null;
          const r = el.getBoundingClientRect();
          const s = window.getComputedStyle(el);
          return {
            rect: { top: r.top, left: r.left, width: r.width, height: r.height },
            opacity: s.opacity,
            visibility: s.visibility,
            display: s.display,
            color: s.color,
            zIndex: s.zIndex,
            transform: s.transform
          };
        }

        return {
          grid: getInfo(grid),
          colLeft: getInfo(colLeft),
          colRight: getInfo(colRight),
          firstItem: getInfo(firstItem),
          firstBtn: getInfo(firstBtn),
          firstQuestion: getInfo(firstQuestion),
          faqHTML: colRight ? colRight.outerHTML.slice(0, 500) : 'none'
        };
      })()`,
      returnByValue: true
    });

    console.log('DATA:', JSON.stringify(data.result.value, null, 2));

    ws.close();
  } finally {
    chrome.kill();
    try { fs.rmSync(tempDir, { recursive: true, force: true }); } catch (e) {}
  }
}

run().catch(console.error);
