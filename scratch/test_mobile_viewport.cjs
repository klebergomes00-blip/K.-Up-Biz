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

async function main() {
  const port = 9450;
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'chrome-mobile-'));

  const chrome = spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', [
    '--headless=new',
    `--remote-debugging-port=${port}`,
    `--user-data-dir=${tempDir}`,
    '--no-first-run',
    '--no-default-browser-check',
    '--disable-gpu',
    '--no-sandbox',
    '--run-all-compositor-stages-before-draw',
    '--window-size=390,844',
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
    ws.send(JSON.stringify({ id, method, params }));
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

  // Scroll to portfolio section on mobile
  await send('Runtime.evaluate', { expression: `window.scrollTo(0, ${startY + 50});` });
  await wait(1500);

  const shot = await send('Page.captureScreenshot', { format: 'png' });
  const outPath = path.join(artifactDir, 'portfolio_mobile_390x844.png');
  fs.writeFileSync(outPath, Buffer.from(shot.data, 'base64'));
  console.log('Saved mobile screenshot:', outPath);

  // Check overflow on mobile
  const overflow = await send('Runtime.evaluate', {
    returnByValue: true,
    expression: `(() => {
      return {
        scrollWidth: document.documentElement.scrollWidth,
        innerWidth: window.innerWidth,
        hasOverflow: document.documentElement.scrollWidth > window.innerWidth
      };
    })()`
  });
  console.log('Mobile overflow check:', overflow.result.value);

  ws.close();
  chrome.kill();
  try { fs.rmSync(tempDir, { recursive: true, force: true }); } catch (e) {}
  process.exit(0);
}

main().catch(console.error);
