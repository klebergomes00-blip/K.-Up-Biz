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

async function main() {
  const port = 9410;
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'chrome-convert-'));
  const localFile = 'file:///' + path.resolve(__dirname, '..', 'public', 'images', 'cases', 'case-fernando-corretor.png').replace(/\\/g, '/');

  const chrome = spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', [
    '--headless=new',
    `--remote-debugging-port=${port}`,
    `--user-data-dir=${tempDir}`,
    '--disable-gpu',
    '--no-sandbox',
    '--window-size=1600,1000',
    localFile
  ]);

  await wait(3000);
  const list = await getJson(`http://127.0.0.1:${port}/json/list`);
  const page = list.find(t => t.type === 'page') || list[0];
  const ws = new WebSocket(page.webSocketDebuggerUrl);
  await new Promise(r => ws.onopen = r);

  let id = 1;
  const send = (method, params = {}) => new Promise((resolve, reject) => {
    const curId = id++;
    const timer = setTimeout(() => reject(new Error('Timeout ' + method)), 10000);
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
  await wait(500);

  const shot = await send('Page.captureScreenshot', { format: 'webp', quality: 92 });
  const outWebp = path.resolve(__dirname, '..', 'public', 'imagens', 'portfolio', 'fernando-junior.webp');
  fs.writeFileSync(outWebp, Buffer.from(shot.data, 'base64'));
  console.log('Saved converted fernando-junior.webp:', fs.statSync(outWebp).size, 'bytes');

  ws.close();
  chrome.kill();
  try { fs.rmSync(tempDir, { recursive: true, force: true }); } catch (e) {}
  process.exit(0);
}

main().catch(console.error);
