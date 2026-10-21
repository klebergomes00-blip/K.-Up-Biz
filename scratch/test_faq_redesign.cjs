const { spawn } = require('child_process');
const http = require('http');
const fs = require('fs');
const path = require('path');
const os = require('os');

async function wait(ms) { return new Promise(r => setTimeout(r, ms)); }
function getJson(url) {
  return new Promise((resolve, reject) => {
    http.get(url, res => {
      let data = ''; res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try { resolve(JSON.parse(data)); } catch (e) { resolve(null); }
      });
    }).on('error', reject);
  });
}

const artifactDir = 'C:\\Users\\Kleber Gomes\\.gemini\\antigravity-ide\\brain\\534ffe61-b1c8-4852-ba32-9f0c29436b8f';

async function testResolution(width, height, deviceName) {
  console.log(`\n======================================================`);
  console.log(`TESTANDO RESOLUÇÃO: ${deviceName} (${width}x${height})`);
  console.log(`======================================================`);

  const port = 9740 + Math.floor(Math.random() * 50);
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), `chrome-faq-redesign-${width}-`));

  const chrome = spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', [
    '--headless=new',
    `--remote-debugging-port=${port}`,
    `--user-data-dir=${tempDir}`,
    '--no-first-run',
    '--no-default-browser-check',
    `--window-size=${width},${height}`,
    'http://localhost:4321/'
  ]);

  try {
    let list = null;
    for (let i = 0; i < 25; i++) {
      try {
        list = await getJson(`http://127.0.0.1:${port}/json/list`);
        if (list && Array.isArray(list) && list.length > 0) break;
      } catch (e) {}
      await wait(400);
    }

    if (!list || !list[0]) {
      throw new Error(`Não foi possível conectar ao Chrome na porta ${port}`);
    }

    const page = list.find(t => t.type === 'page') || list[0];
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

    await send('Runtime.enable');
    await send('Page.enable');
    await send('Emulation.setFocusEmulationEnabled', { enabled: true });

    // Skip cinematic intro completely
    await wait(1200);
    await send('Runtime.evaluate', {
      expression: `(() => {
        const intro = document.getElementById('cinematic-intro');
        if (intro) intro.remove();
        window.dispatchEvent(new CustomEvent('cinematic-intro-complete'));
      })()`
    });
    await wait(800);

    // Scroll directly to FAQ section
    await send('Runtime.evaluate', {
      expression: `(() => {
        const faq = document.getElementById('faq');
        if (faq) {
          faq.scrollIntoView({ behavior: 'instant', block: 'start' });
          window.dispatchEvent(new Event('scroll'));
        }
      })()`
    });
    await wait(1800);

    // Validate elements & layout
    const info = await send('Runtime.evaluate', {
      expression: `(() => {
        const faq = document.getElementById('faq');
        if (!faq) return { found: false };

        const eyebrow = faq.querySelector('.eyebrow-text')?.textContent?.trim();
        const headline = faq.querySelector('.headline-line')?.textContent?.trim();
        const highlight = faq.querySelector('.headline-highlight')?.textContent?.trim();
        const desc = faq.querySelector('.faq-description')?.textContent?.trim();
        const sculpture = !!faq.querySelector('#sculpture-core');
        const halo = !!faq.querySelector('#sculpture-halo');
        const ringsCount = faq.querySelectorAll('.orbital-ring').length;
        const items = faq.querySelectorAll('.faq-item');

        const item01Open = items[0]?.classList.contains('is-open');
        const item01Aria = items[0]?.querySelector('.faq-trigger')?.getAttribute('aria-expanded');

        const hasOverflow = document.documentElement.scrollWidth > window.innerWidth;

        return {
          found: true,
          eyebrow,
          headline,
          highlight,
          desc,
          sculpturePresent: sculpture,
          haloPresent: halo,
          ringsCount,
          totalQuestions: items.length,
          item01Open,
          item01Aria,
          hasOverflow,
          scrollWidth: document.documentElement.scrollWidth,
          innerWidth: window.innerWidth
        };
      })()`,
      returnByValue: true
    });
    console.log('Validação da 7ª dobra:', JSON.stringify(info.result.value, null, 2));

    // Capture initial screenshot (item 01 open)
    const ss1 = await send('Page.captureScreenshot', { format: 'png' });
    const ss1Path = path.join(artifactDir, `faq_redesign_${width}x${height}_default.png`);
    fs.writeFileSync(ss1Path, Buffer.from(ss1.data, 'base64'));
    console.log(`Screenshot inicial salvo em: ${ss1Path}`);

    // Click question 02, verify reaction
    const click2 = await send('Runtime.evaluate', {
      expression: `(() => {
        const btn2 = document.getElementById('faq-btn-02');
        if (btn2) btn2.click();

        const item1 = document.getElementById('faq-item-01');
        const item2 = document.getElementById('faq-item-02');

        return {
          item1Closed: !item1?.classList.contains('is-open'),
          item2Open: item2?.classList.contains('is-open'),
          item2Aria: btn2?.getAttribute('aria-expanded')
        };
      })()`,
      returnByValue: true
    });
    console.log('Interação ao clicar no item 02:', JSON.stringify(click2.result.value, null, 2));
    await wait(600);

    // Keyboard focus & click question 04
    const keyb4 = await send('Runtime.evaluate', {
      expression: `(() => {
        const btn4 = document.getElementById('faq-btn-04');
        if (btn4) {
          btn4.focus();
          btn4.click();
        }
        const item2 = document.getElementById('faq-item-02');
        const item4 = document.getElementById('faq-item-04');
        return {
          item2Closed: !item2?.classList.contains('is-open'),
          item4Open: item4?.classList.contains('is-open'),
          item4Aria: btn4?.getAttribute('aria-expanded'),
          focusedElementId: document.activeElement?.id
        };
      })()`,
      returnByValue: true
    });
    console.log('Navegação por teclado no item 04:', JSON.stringify(keyb4.result.value, null, 2));
    await wait(600);

    // Capture screenshot with question 04 open
    const ss2 = await send('Page.captureScreenshot', { format: 'png' });
    const ss2Path = path.join(artifactDir, `faq_redesign_${width}x${height}_item4.png`);
    fs.writeFileSync(ss2Path, Buffer.from(ss2.data, 'base64'));
    console.log(`Screenshot item 04 salvo em: ${ss2Path}`);

    ws.close();
  } finally {
    chrome.kill();
    try { fs.rmSync(tempDir, { recursive: true, force: true }); } catch (e) {}
  }
}

async function main() {
  await testResolution(1440, 900, 'Desktop 1440p');
  await testResolution(1366, 768, 'Desktop 1366p');
  await testResolution(1280, 720, 'Desktop 1280p (HD)');
  await testResolution(390, 844, 'Mobile iPhone');
  console.log('\nTODOS OS TESTES DE RESOLUÇÃO FINALIZADOS COM SUCESSO!');
}

main().catch(err => {
  console.error('Falha nos testes:', err);
  process.exit(1);
});
