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

async function test() {
  const port = 9360;
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'chrome-headless-'));
  console.log('Using temp user-data-dir:', tempDir);

  const chrome = spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', [
    '--headless=new',
    `--remote-debugging-port=${port}`,
    `--user-data-dir=${tempDir}`,
    '--no-first-run',
    '--no-default-browser-check',
    '--disable-gpu',
    '--no-sandbox',
    '--run-all-compositor-stages-before-draw',
    '--disable-background-timer-throttling',
    '--disable-renderer-backgrounding',
    '--window-size=1600,1000',
    '--hide-scrollbars',
    'https://level-up-agency-astro.vercel.app/'
  ]);

  await wait(6000);
  const list = await getJson(`http://127.0.0.1:${port}/json/list`);
  console.log('Tabs:', list.map(t => ({ url: t.url, type: t.type })));
  const page = list.find(t => t.type === 'page');
  const ws = new WebSocket(page.webSocketDebuggerUrl);
  await new Promise(r => ws.onopen = r);

  let msgId = 1;
  const send = (method, params = {}) => new Promise((resolve, reject) => {
    const id = msgId++;
    const timer = setTimeout(() => reject(new Error('Timeout ' + method)), 15000);
    const handler = (e) => {
      const msg = JSON.parse(e.data);
      if (msg.id === id) {
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
  await wait(1000);

  console.log('Calling Page.captureScreenshot...');
  const shot = await send('Page.captureScreenshot', { format: 'png' });
  console.log('Captured screenshot! Length:', shot.data.length);

  const outPath = path.resolve(__dirname, '..', 'public', 'imagens', 'portfolio', 'level-up-agency.png');
  fs.writeFileSync(outPath, Buffer.from(shot.data, 'base64'));
  console.log('SUCCESS! File written to', outPath, 'Size:', fs.statSync(outPath).size);

  ws.close();
  chrome.kill();
  try { fs.rmSync(tempDir, { recursive: true, force: true }); } catch(e){}
  process.exit(0);
}

test().catch(e => {
  console.error('FAILED:', e);
  process.exit(1);
});
