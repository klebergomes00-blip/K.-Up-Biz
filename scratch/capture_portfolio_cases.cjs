const { spawn } = require('child_process');
const http = require('http');
const fs = require('fs');
const path = require('path');

const portfolioDir = path.join(__dirname, '..', 'public', 'imagens', 'portfolio');
if (!fs.existsSync(portfolioDir)) {
  fs.mkdirSync(portfolioDir, { recursive: true });
}

const cases = [
  {
    id: 'fernando-junior',
    url: 'https://fernandocorretor-six.vercel.app/',
    name: 'Fernando Junior'
  },
  {
    id: 'level-up-agency',
    url: 'https://level-up-agency-astro.vercel.app/',
    name: 'Level Up Agency'
  },
  {
    id: 'level-up-aesthetics',
    url: 'https://clinicaestetica-xi.vercel.app/',
    name: 'Level Up Aesthetics'
  },
  {
    id: 'styvy-burguer',
    url: 'https://styviburguer.vercel.app/',
    name: 'Styvy Burguer'
  }
];

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

async function run() {
  console.log('Iniciando Chrome Headless para capturar os 4 projetos reais...');
  const chromeProc = spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', [
    '--headless=new',
    '--remote-debugging-port=9244',
    '--disable-gpu',
    '--no-sandbox',
    '--window-size=1600,1000',
    '--hide-scrollbars',
    'about:blank'
  ]);

  await wait(3000);
  const list = await getJson('http://127.0.0.1:9244/json/list');
  const page = list[0];
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

  await send('Page.enable');
  await send('Runtime.enable');
  await send('Emulation.setDeviceMetricsOverride', {
    width: 1600,
    height: 1000,
    deviceScaleFactor: 1.5,
    mobile: false
  });

  for (const item of cases) {
    console.log(`\nNavegando para: ${item.name} (${item.url})...`);
    await send('Page.navigate', { url: item.url });
    // Esperar carregamento completo dos assets, fontes e renderização
    await wait(6000);

    // Avaliar e aguardar document.fonts.ready
    await send('Runtime.evaluate', {
      expression: `(() => {
        if (document.fonts) return document.fonts.ready;
      })()`,
      awaitPromise: true
    });
    await wait(1500);

    console.log(`Capturando screenshot de ${item.name}...`);
    const shot = await send('Page.captureScreenshot', {
      format: 'png',
      captureBeyondViewport: false
    });

    const filePathPng = path.join(portfolioDir, `${item.id}.png`);
    fs.writeFileSync(filePathPng, Buffer.from(shot.data, 'base64'));
    console.log(`Salvo: ${filePathPng} (${(shot.data.length * 0.75 / 1024).toFixed(1)} KB)`);
  }

  console.log('\nTodas as 4 capturas foram concluídas com sucesso!');
  ws.close();
  chromeProc.kill();
  process.exit(0);
}

run().catch(err => {
  console.error('Erro na captura:', err);
  process.exit(1);
});
