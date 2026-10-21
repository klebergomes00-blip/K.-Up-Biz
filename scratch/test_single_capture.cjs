const { spawn } = require('child_process');
const http = require('http');
const fs = require('fs');
const path = require('path');

const portfolioDir = path.resolve(__dirname, '..', 'public', 'imagens', 'portfolio');
if (!fs.existsSync(portfolioDir)) {
  fs.mkdirSync(portfolioDir, { recursive: true });
}

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

async function captureUrl(ws, send, url, name, outputFile) {
  console.log(`[1/4] Navegando para ${name}: ${url}...`);
  await send('Page.navigate', { url });
  await wait(5000);

  console.log(`[2/4] Verificando estado da página...`);
  try {
    await send('Runtime.evaluate', {
      expression: `(() => {
        return {
          title: document.title,
          readyState: document.readyState
        };
      })()`,
      returnByValue: true
    });
  } catch (e) {
    console.log('Erro ao avaliar página:', e.message);
  }

  console.log(`[3/4] Capturando screenshot...`);
  const shot = await send('Page.captureScreenshot', { format: 'png' });
  console.log(`[4/4] Salvando arquivo (${shot.data.length} bytes base64)...`);
  fs.writeFileSync(outputFile, Buffer.from(shot.data, 'base64'));
  console.log(`Sucesso: ${outputFile} salvo (${(fs.statSync(outputFile).size / 1024).toFixed(1)} KB)`);
}

async function main() {
  const port = 9260;
  console.log(`Iniciando Chrome em --remote-debugging-port=${port}...`);
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
    const timeout = setTimeout(() => {
      reject(new Error(`Timeout ao executar CDP ${method}`));
    }, 20000);
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
  await send('Runtime.enable');
  await send('Emulation.setDeviceMetricsOverride', {
    width: 1600,
    height: 1000,
    deviceScaleFactor: 1.5,
    mobile: false
  });

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

  for (const c of cases) {
    const outFile = path.join(portfolioDir, `${c.id}.png`);
    await captureUrl(ws, send, c.url, c.name, outFile);
  }

  console.log('TODAS AS CAPTURAS CONCLUÍDAS!');
  ws.close();
  chrome.kill();
  process.exit(0);
}

main().catch(err => {
  console.error('Falha geral:', err);
  process.exit(1);
});
