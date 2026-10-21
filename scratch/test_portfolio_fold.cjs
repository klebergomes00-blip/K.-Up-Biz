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

async function run() {
  console.log('=== TESTE VISUAL E FUNCIONAL DA SEXTA DOBRA: PROJETOS SELECIONADOS ===');
  const port = 9390;
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'chrome-portfolio-test-'));

  const chrome = spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', [
    '--headless=new',
    `--remote-debugging-port=${port}`,
    `--user-data-dir=${tempDir}`,
    '--no-first-run',
    '--no-default-browser-check',
    '--disable-gpu',
    '--no-sandbox',
    '--run-all-compositor-stages-before-draw',
    '--window-size=1440,900',
    '--hide-scrollbars',
    'http://localhost:4321/'
  ]);

  await wait(3500);
  const list = await getJson(`http://127.0.0.1:${port}/json/list`);
  const page = list.find(t => t.type === 'page') || list[0];
  const ws = new WebSocket(page.webSocketDebuggerUrl);
  await new Promise(r => ws.onopen = r);

  let id = 1;
  const consoleErrors = [];
  ws.onmessage = (e) => {
    const msg = JSON.parse(e.data);
    if (msg.method === 'Runtime.consoleAPICalled' && msg.params.type === 'error') {
      consoleErrors.push(msg.params.args.map(a => a.value || a.description).join(' '));
    }
  };

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
  await send('Runtime.enable');
  await wait(1000);

  // Skip cinematic intro
  console.log('1. Pulando Intro Cinematográfica...');
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

  // Localizar a seção #portfolio
  console.log('2. Localizando seção #portfolio...');
  const portfolioInfo = await send('Runtime.evaluate', {
    returnByValue: true,
    expression: `(() => {
      const sec = document.getElementById('portfolio');
      if (!sec) return null;
      const rect = sec.getBoundingClientRect();
      return {
        top: rect.top + window.scrollY,
        height: rect.height,
        offsetTop: sec.offsetTop
      };
    })()`
  });

  console.log('Info da seção #portfolio:', portfolioInfo.result.value);
  const startY = portfolioInfo.result.value.top;

  // Teste 1: ATO 00 / Início do Case 1 (Fernando Junior)
  console.log('3. Rolando para início da Sexta Dobra (Case 01 Fernando Junior)...');
  await send('Runtime.evaluate', { expression: `window.scrollTo(0, ${startY + 200});` });
  await wait(1500);

  let shot = await send('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync(path.join(artifactDir, 'portfolio_case1_fernando.png'), Buffer.from(shot.data, 'base64'));
  console.log('-> Salvo: portfolio_case1_fernando.png');

  // Teste 2: Case 02 (Level Up Agency)
  console.log('4. Rolando para Case 02 (Level Up Agency)...');
  await send('Runtime.evaluate', { expression: `window.scrollTo(0, ${startY + 1400});` });
  await wait(1500);

  shot = await send('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync(path.join(artifactDir, 'portfolio_case2_levelup.png'), Buffer.from(shot.data, 'base64'));
  console.log('-> Salvo: portfolio_case2_levelup.png');

  // Teste 3: Case 03 (Level Up Aesthetics)
  console.log('5. Rolando para Case 03 (Level Up Aesthetics)...');
  await send('Runtime.evaluate', { expression: `window.scrollTo(0, ${startY + 2500});` });
  await wait(1500);

  shot = await send('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync(path.join(artifactDir, 'portfolio_case3_aesthetics.png'), Buffer.from(shot.data, 'base64'));
  console.log('-> Salvo: portfolio_case3_aesthetics.png');

  // Teste 4: Case 04 (Styvy Burguer)
  console.log('6. Rolando para Case 04 (Styvy Burguer)...');
  await send('Runtime.evaluate', { expression: `window.scrollTo(0, ${startY + 3500});` });
  await wait(1500);

  shot = await send('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync(path.join(artifactDir, 'portfolio_case4_styvy.png'), Buffer.from(shot.data, 'base64'));
  console.log('-> Salvo: portfolio_case4_styvy.png');

  // Teste 5: Encerramento (ATO 05)
  console.log('7. Rolando para o Encerramento da Sexta Dobra...');
  await send('Runtime.evaluate', { expression: `window.scrollTo(0, ${startY + 4300});` });
  await wait(1500);

  shot = await send('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync(path.join(artifactDir, 'portfolio_case5_encerramento.png'), Buffer.from(shot.data, 'base64'));
  console.log('-> Salvo: portfolio_case5_encerramento.png');

  // Teste 6: Reversibilidade (rolar de volta para Case 02 e depois topo)
  console.log('8. Testando rolagem reversa (voltando para Case 02)...');
  await send('Runtime.evaluate', { expression: `window.scrollTo(0, ${startY + 1400});` });
  await wait(1200);

  const reverseState = await send('Runtime.evaluate', {
    returnByValue: true,
    expression: `(() => {
      const step = document.getElementById('portfolio-step-indicator');
      const activeCard = document.querySelector('.portfolio-info-card.is-active');
      const activeTitle = activeCard ? activeCard.querySelector('.case-name').textContent : null;
      return {
        stepText: step ? step.textContent : null,
        activeTitle
      };
    })()`
  });
  console.log('Estado na rolagem reversa (esperado Case 2):', reverseState.result.value);

  // Verificar ausência de overflow horizontal
  const overflowCheck = await send('Runtime.evaluate', {
    returnByValue: true,
    expression: `(() => {
      return {
        docScrollWidth: document.documentElement.scrollWidth,
        windowInnerWidth: window.innerWidth,
        hasHorizontalOverflow: document.documentElement.scrollWidth > window.innerWidth
      };
    })()`
  });
  console.log('Verificação de overflow horizontal:', overflowCheck.result.value);

  console.log('Erros no console durante os testes:', consoleErrors);

  ws.close();
  chrome.kill();
  try { fs.rmSync(tempDir, { recursive: true, force: true }); } catch(e){}
  console.log('=== TESTES DA SEXTA DOBRA CONCLUÍDOS COM SUCESSO! ===');
  process.exit(0);
}

run().catch(e => {
  console.error('Falha no teste:', e);
  process.exit(1);
});
