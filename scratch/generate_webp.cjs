const { spawn } = require('child_process');
const http = require('http');
const fs = require('fs');
const path = require('path');

const portfolioDir = path.resolve(__dirname, '..', 'public', 'imagens', 'portfolio');

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
  const port = 9272;
  console.log(`Iniciando Chrome para captura em formato WEBP...`);
  const chrome = spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', [
    '--headless=new',
    `--remote-debugging-port=${port}`,
    '--disable-gpu',
    '--no-sandbox',
    '--window-size=1600,1000',
    '--hide-scrollbars',
    'about:blank'
  ]);

  await wait(3000);
  const list = await getJson(`http://127.0.0.1:${port}/json/list`);
  const target = list[0];
  const ws = new WebSocket(target.webSocketDebuggerUrl);
  await new Promise(r => ws.onopen = r);

  let msgId = 1;
  const send = (method, params = {}) => new Promise((resolve, reject) => {
    const id = msgId++;
    const timeout = setTimeout(() => reject(new Error(`Timeout ${method}`)), 20000);
    const handler = (evt) => {
      const msg = JSON.parse(evt.data);
      if (msg.id === id) {
        clearTimeout(timeout);
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
    deviceScaleFactor: 1.25,
    mobile: false
  });

  const cases = [
    { id: 'fernando-junior', url: 'https://fernandocorretor-six.vercel.app/' },
    { id: 'level-up-agency', url: 'https://level-up-agency-astro.vercel.app/' },
    { id: 'level-up-aesthetics', url: 'https://clinicaestetica-xi.vercel.app/' },
    { id: 'styvy-burguer', url: 'https://styviburguer.vercel.app/' }
  ];

  for (const c of cases) {
    console.log(`Navegando: ${c.url}...`);
    await send('Page.navigate', { url: c.url });
    await wait(4500);

    const shot = await send('Page.captureScreenshot', { format: 'webp', quality: 90 });
    const outFile = path.join(portfolioDir, `${c.id}.webp`);
    fs.writeFileSync(outFile, Buffer.from(shot.data, 'base64'));
    console.log(`Salvo WebP: ${outFile} (${(fs.statSync(outFile).size / 1024).toFixed(1)} KB)`);
  }

  ws.close();
  chrome.kill();
  console.log('WEBP gerado com sucesso!');
  process.exit(0);
}

main().catch(e => { console.error(e); process.exit(1); });
