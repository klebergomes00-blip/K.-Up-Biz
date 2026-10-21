const { spawn } = require('child_process');
const http = require('http');
const fs = require('fs');
const path = require('path');

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

async function captureSite(url, outFilename) {
  const port = 9330 + Math.floor(Math.random() * 50);
  console.log(`Starting Chrome on port ${port} directly loading ${url}...`);
  const chrome = spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', [
    '--headless=new',
    `--remote-debugging-port=${port}`,
    '--disable-gpu',
    '--no-sandbox',
    '--window-size=1600,1000',
    '--hide-scrollbars',
    url
  ]);

  await wait(5000);
  const list = await getJson(`http://127.0.0.1:${port}/json/list`);
  const page = list[0];
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
  await wait(1500);

  console.log('Capturing screenshot...');
  const shot = await send('Page.captureScreenshot', { format: 'png' });
  console.log('Got screenshot! Size:', shot.data.length);

  const outDir = path.resolve(__dirname, '..', 'public', 'imagens', 'portfolio');
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });
  const outPath = path.join(outDir, outFilename);
  fs.writeFileSync(outPath, Buffer.from(shot.data, 'base64'));
  console.log(`Successfully saved: ${outPath} (${fs.statSync(outPath).size} bytes)`);

  ws.close();
  chrome.kill();
}

async function run() {
  await captureSite('https://level-up-agency-astro.vercel.app/', 'level-up-agency.png');
}

run().catch(e => { console.error('Failed:', e); process.exit(1); });
