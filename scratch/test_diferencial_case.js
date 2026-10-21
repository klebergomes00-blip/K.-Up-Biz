const { spawn } = require('child_process');
const http = require('http');
const fs = require('fs');
const path = require('path');

async function wait(ms) {
  return new Promise(r => setTimeout(r, ms));
}

async function getJson(url) {
  return new Promise((resolve, reject) => {
    http.get(url, res => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(JSON.parse(data)));
    }).on('error', reject);
  });
}

async function runTest(viewport = { width: 1440, height: 900 }, isMobile = false) {
  console.log(`\n=== TESTING NOSSO DIFERENCIAL CASE (${viewport.width}x${viewport.height}) ===`);
  const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
  const chromeProcess = spawn(chromePath, [
    '--headless=new',
    '--remote-debugging-port=9225',
    '--disable-gpu',
    '--no-sandbox',
    `--window-size=${viewport.width},${viewport.height}`,
    '--autoplay-policy=no-user-gesture-required',
    'http://localhost:4321/'
  ]);

  await wait(3000);
  const list = await getJson('http://127.0.0.1:9225/json/list');
  const page = list.find(t => t.url.includes('localhost:4321')) || list[0];
  const ws = new WebSocket(page.webSocketDebuggerUrl);

  let msgId = 1;
  const pending = new Map();
  const consoleErrors = [];

  ws.onmessage = (event) => {
    const data = JSON.parse(event.data);
    if (data.method === 'Runtime.consoleAPICalled') {
      if (data.params.type === 'error') {
        consoleErrors.push(data.params.args.map(a => a.value || a.description).join(' '));
      }
    }
    if (data.id && pending.has(data.id)) {
      const { resolve, reject } = pending.get(data.id);
      pending.delete(data.id);
      if (data.error) reject(data.error);
      else resolve(data.result);
    }
  };

  await new Promise(r => ws.onopen = r);
  function send(method, params = {}) {
    return new Promise((resolve, reject) => {
      const id = msgId++;
      pending.set(id, { resolve, reject });
      ws.send(JSON.stringify({ id, method, params }));
    });
  }

  await send('Page.enable');
  await send('Runtime.enable');
  await send('Console.enable');

  await wait(1500);

  // Skip intro
  await send('Runtime.evaluate', {
    expression: `(() => {
      const skipBtn = document.getElementById('intro-skip-btn');
      if (skipBtn) skipBtn.click();
      const intro = document.getElementById('cinematic-intro');
      if (intro) {
        intro.style.display = 'none';
        intro.classList.add('is-completed');
      }
      window.dispatchEvent(new CustomEvent('cinematic-intro-complete'));
      if (window.ScrollTrigger) window.ScrollTrigger.refresh();
    })()`
  });

  await wait(1200);

  const artifactDir = path.resolve(__dirname, '..');

  async function takeScreenshot(name) {
    const res = await send('Page.captureScreenshot', { format: 'png' });
    const fullPath = path.join(artifactDir, name);
    fs.writeFileSync(fullPath, Buffer.from(res.data, 'base64'));
    console.log(`Saved screenshot: ${name}`);
  }

  // Get ScrollTrigger info
  const info = await send('Runtime.evaluate', {
    returnByValue: true,
    awaitPromise: true,
    expression: `(() => {
      const sec = document.getElementById('diferencial');
      if (!sec) return null;
      const rect = sec.getBoundingClientRect();
      const allTriggers = window.ScrollTrigger ? window.ScrollTrigger.getAll().map(st => ({
        triggerId: st.trigger ? st.trigger.id : null,
        start: st.start,
        end: st.end,
        pin: !!st.pin
      })) : [];
      return {
        top: rect.top + window.scrollY,
        height: rect.height,
        triggers: allTriggers
      };
    })()`
  });

  const secInfo = info.result?.value;
  console.log('Section Info:', secInfo);

  if (!isMobile) {
    const difTrigger = secInfo.triggers.find(t => t.triggerId === 'diferencial');
    const startY = difTrigger ? difTrigger.start : secInfo.top;
    const endY = difTrigger ? difTrigger.end : startY + 1800;
    const dist = endY - startY;

    // Fase 1: Entrada (10% of pin)
    const f1Y = startY + Math.round(dist * 0.12);
    await send('Runtime.evaluate', { expression: `window.scrollTo(0, ${f1Y});` });
    await wait(800);
    await takeScreenshot('case_fase01_entrada.png');

    // Fase 2: Revelação (42% of pin)
    const f2Y = startY + Math.round(dist * 0.45);
    await send('Runtime.evaluate', { expression: `window.scrollTo(0, ${f2Y});` });
    await wait(800);
    await takeScreenshot('case_fase02_revelacao.png');

    // Fase 3: Apresentação (72% of pin)
    const f3Y = startY + Math.round(dist * 0.72);
    await send('Runtime.evaluate', { expression: `window.scrollTo(0, ${f3Y});` });
    await wait(800);
    await takeScreenshot('case_fase03_apresentacao.png');

    // Fase 4: Fechamento (96% of pin)
    const f4Y = startY + Math.round(dist * 0.96);
    await send('Runtime.evaluate', { expression: `window.scrollTo(0, ${f4Y});` });
    await wait(800);
    await takeScreenshot('case_fase04_fechamento.png');

    // Reverse Scroll: Voltar para Fase 2
    await send('Runtime.evaluate', { expression: `window.scrollTo(0, ${f2Y});` });
    await wait(800);
    await takeScreenshot('case_fase02_reversa.png');

    // Testar se NossoMetodo (Quarta Dobra) continua funcionando
    const metodoTrigger = secInfo.triggers.find(t => t.triggerId === 'metodo');
    if (metodoTrigger) {
      const midMetodo = (metodoTrigger.start + metodoTrigger.end) / 2;
      await send('Runtime.evaluate', { expression: `window.scrollTo(0, ${midMetodo});` });
      await wait(800);
      const videoState = await send('Runtime.evaluate', {
        returnByValue: true,
        expression: `(() => {
          const v = document.getElementById('metodo-video');
          return v ? { currentTime: v.currentTime, duration: v.duration, readyState: v.readyState } : null;
        })()`
      });
      console.log('Metodo mountain video state at 50% scroll:', videoState.result?.value);
    }
  } else {
    // Mobile test
    await send('Runtime.evaluate', {
      expression: `(() => {
        const sec = document.getElementById('diferencial');
        if (sec) sec.scrollIntoView({ behavior: 'instant', block: 'start' });
      })()`
    });
    await wait(1000);
    await takeScreenshot('case_mobile_view.png');

    // Check horizontal overflow
    const overflow = await send('Runtime.evaluate', {
      returnByValue: true,
      expression: `document.documentElement.scrollWidth > window.innerWidth`
    });
    console.log('Mobile horizontal overflow exists:', overflow.result?.value);
  }

  console.log('Console errors:', consoleErrors);
  chromeProcess.kill();
}

async function main() {
  await runTest({ width: 1440, height: 900 }, false);
  await wait(1000);
  await runTest({ width: 375, height: 812 }, true);
  console.log('ALL TESTS FINISHED.');
  process.exit(0);
}

main().catch(e => {
  console.error('Fatal test error:', e);
  process.exit(1);
});
