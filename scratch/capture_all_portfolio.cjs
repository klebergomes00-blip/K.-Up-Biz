const { spawn } = require('child_process');
const http = require('http');
const fs = require('fs');
const path = require('path');
const os = require('os');

const cases = [
  {
    id: 'fernando-junior',
    name: 'Fernando Junior (Imobiliário Premium)',
    url: 'https://fernandocorretor-six.vercel.app/'
  },
  {
    id: 'level-up-agency',
    name: 'Level Up Agency (Marketing & Presença Digital)',
    url: 'https://level-up-agency-astro.vercel.app/'
  },
  {
    id: 'level-up-aesthetics',
    name: 'Level Up Aesthetics (Estética & Bem-estar)',
    url: 'https://clinicaestetica-xi.vercel.app/'
  },
  {
    id: 'styvy-burguer',
    name: 'Styvy Burguer (Gastronomia)',
    url: 'https://styviburguer.vercel.app/'
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

async function captureOneSite(c, index, total) {
  console.log(`\n======================================================`);
  console.log(`[${index + 1}/${total}] Processando: ${c.name}`);
  console.log(`URL: ${c.url}`);
  console.log(`======================================================`);

  const port = 9370 + index;
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), `chrome-portfolio-${c.id}-`));

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
    c.url
  ]);

  try {
    // Aguardar inicialização e renderização completa da página
    console.log('Aguardando carregamento da página...');
    await wait(6000);

    const list = await getJson(`http://127.0.0.1:${port}/json/list`);
    const page = list.find(t => t.type === 'page') || list[0];
    const ws = new WebSocket(page.webSocketDebuggerUrl);
    await new Promise(r => ws.onopen = r);

    let msgId = 1;
    const send = (method, params = {}) => new Promise((resolve, reject) => {
      const id = msgId++;
      const timer = setTimeout(() => reject(new Error('Timeout ' + method)), 20000);
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

    const outDir = path.resolve(__dirname, '..', 'public', 'imagens', 'portfolio');
    if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

    // 1. Capturar WebP otimizado (alta qualidade 90%)
    console.log(`Capturando WebP para ${c.id}...`);
    const shotWebp = await send('Page.captureScreenshot', { format: 'webp', quality: 90 });
    const outWebp = path.join(outDir, `${c.id}.webp`);
    fs.writeFileSync(outWebp, Buffer.from(shotWebp.data, 'base64'));
    console.log(`-> Salvo WebP: ${outWebp} (${(fs.statSync(outWebp).size / 1024).toFixed(1)} KB)`);

    // 2. Capturar PNG para máxima fidelidade
    console.log(`Capturando PNG para ${c.id}...`);
    const shotPng = await send('Page.captureScreenshot', { format: 'png' });
    const outPng = path.join(outDir, `${c.id}.png`);
    fs.writeFileSync(outPng, Buffer.from(shotPng.data, 'base64'));
    console.log(`-> Salvo PNG: ${outPng} (${(fs.statSync(outPng).size / 1024).toFixed(1)} KB)`);

    ws.close();
  } finally {
    chrome.kill();
    try { fs.rmSync(tempDir, { recursive: true, force: true }); } catch (e) {}
  }
}

async function main() {
  console.log('Iniciando captura dos 4 projetos reais da K. Up Biz...');
  for (let i = 0; i < cases.length; i++) {
    await captureOneSite(cases[i], i, cases.length);
    await wait(1500);
  }
  console.log('\n======================================================');
  console.log('TODAS AS 4 CAPTURAS CONCLUÍDAS COM SUCESSO!');
  console.log('======================================================');
  process.exit(0);
}

main().catch(err => {
  console.error('Erro na execução:', err);
  process.exit(1);
});
