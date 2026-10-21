const { spawn } = require('child_process');
const http = require('http');
const fs = require('fs');
const path = require('path');

const portfolioDir = path.resolve(__dirname, '..', 'public', 'imagens', 'portfolio');
if (!fs.existsSync(portfolioDir)) fs.mkdirSync(portfolioDir, { recursive: true });

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
  const port = 9280;
  const chrome = spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', [
    '--headless=new',
    `--remote-debugging-port=${port}`,
    '--disable-gpu',
    '--no-sandbox',
    '--window-size=1600,1000',
    '--hide-scrollbars',
    'about:blank'
  ]);

  await wait(2500);
  const list = await getJson(`http://127.0.0.1:${port}/json/list`);
  const target = list[0];
  const ws = new WebSocket(target.webSocketDebuggerUrl);
  await new Promise(r => ws.onopen = r);

  let msgId = 1;
  const send = (method, params = {}) => new Promise((resolve, reject) => {
    const id = msgId++;
    const handler = (evt) => {
      const msg = JSON.parse(evt.data);
      if (msg.id === id) {
        ws.removeEventListener('message', handler);
        if (msg.error) reject(new Error(msg.error.message || JSON.stringify(msg.error)));
        else resolve(msg.result);
      }
    };
    ws.addEventListener('message', handler);
    ws.send(JSON.stringify({ id, method, params }));
  });

  await send('Page.enable');
  await send('Emulation.setDeviceMetricsOverride', {
    width: 1600,
    height: 1000,
    deviceScaleFactor: 1,
    mobile: false
  });

  const urls = [
    { id: 'level-up-agency', url: 'https://level-up-agency-astro.vercel.app/' },
    { id: 'level-up-aesthetics', url: 'https://clinicaestetica-xi.vercel.app/' },
    { id: 'styvy-burguer', url: 'https://styviburguer.vercel.app/' }
  ];

  for (const item of urls) {
    console.log(`Navigating to ${item.url}...`);
    await send('Page.navigate', { url: item.url });
    await wait(6000);
    console.log(`Taking screenshot for ${item.id}...`);
    const shot = await send('Page.captureScreenshot', { format: 'png' });
    const outPng = path.join(portfolioDir, `${item.id}.png`);
    fs.writeFileSync(outPng, Buffer.from(shot.data, 'base64'));
    console.log(`Saved ${outPng}: ${fs.statSync(outPng).size} bytes`);
  }

  ws.close();
  chrome.kill();
  console.log('Done!');
  process.exit(0);
}

main().catch(e => { console.error(e); process.exit(1); });
