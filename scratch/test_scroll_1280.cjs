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
      res.on('end', () => resolve(JSON.parse(data)));
    }).on('error', reject);
  });
}

async function run() {
  const port = 9588;
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'chrome-test-1280-'));
  const chrome = spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', [
    '--headless=new',
    '--remote-debugging-port=' + port,
    '--user-data-dir=' + tempDir,
    '--window-size=1280,720',
    'http://localhost:4321/'
  ]);

  await wait(3000);
  const list = await getJson('http://127.0.0.1:' + port + '/json/list');
  const ws = new WebSocket((list.find(t => t.type === 'page') || list[0]).webSocketDebuggerUrl);
  await new Promise(r => ws.onopen = r);

  let id = 1;
  const send = (method, params = {}) => new Promise((res, rej) => {
    const curId = id++;
    const handler = (e) => {
      const msg = JSON.parse(e.data);
      if (msg.id === curId) { ws.removeEventListener('message', handler); res(msg.result); }
    };
    ws.addEventListener('message', handler);
    ws.send(JSON.stringify({ id: curId, method, params }));
  });

  await send('Page.enable');
  await send('Runtime.enable');
  await send('Runtime.evaluate', {
    expression: `(() => {
      const b = document.getElementById('intro-skip-btn');
      if (b) b.click();
      window.dispatchEvent(new CustomEvent('cinematic-intro-complete'));
    })()`
  });
  await wait(1500);

  const res1 = await send('Runtime.evaluate', {
    returnByValue: true,
    expression: `(() => {
      const p = document.getElementById('portfolio');
      const r = p.getBoundingClientRect();
      return { top: r.top, scrollY: window.scrollY, naturalTop: r.top + window.scrollY };
    })()`
  });
  console.log('Before scrollIntoView:', res1.result.value);

  await send('Runtime.evaluate', {
    expression: `(() => {
      document.getElementById('portfolio').scrollIntoView();
    })()`
  });
  await wait(800);

  const res2 = await send('Runtime.evaluate', {
    returnByValue: true,
    expression: `(() => {
      const p = document.getElementById('portfolio');
      const r = p.getBoundingClientRect();
      const trig = ScrollTrigger.getById('portfolio-trigger');
      return {
        top: r.top,
        scrollY: window.scrollY,
        trigStart: trig ? Math.round(trig.start) : null,
        trigEnd: trig ? Math.round(trig.end) : null,
        trigProgress: trig ? trig.progress : null
      };
    })()`
  });
  console.log('After scrollIntoView:', res2.result.value);

  // Now, what happens if we set trig.progress = 0.24, 0.44, 0.64, 0.84 directly or scroll to trig.start + p * dist?
  const trig = res2.result.value;
  const dist = trig.trigEnd - trig.trigStart;

  const cases = [
    { name: 'case1_fernando', p: 0.24 },
    { name: 'case2_levelup', p: 0.44 },
    { name: 'case3_aesthetics', p: 0.64 },
    { name: 'case4_styvy', p: 0.84 }
  ];

  for (const c of cases) {
    const targetY = Math.round(trig.trigStart + c.p * dist);
    await send('Runtime.evaluate', { expression: `window.scrollTo(0, ${targetY});` });
    await wait(600);

    const check = await send('Runtime.evaluate', {
      returnByValue: true,
      expression: `(() => {
        const frame = document.getElementById('panoramic-frame');
        const card0 = document.getElementById('portfolio-card-0');
        const card1 = document.getElementById('portfolio-card-1');
        const winH = window.innerHeight;
        const fRect = frame.getBoundingClientRect();
        return {
          case: '${c.name}',
          scrollY: window.scrollY,
          frame: { top: Math.round(fRect.top), bottom: Math.round(fRect.bottom), height: Math.round(fRect.height), cutBottom: fRect.bottom > winH },
          card0Opacity: card0 ? window.getComputedStyle(card0).opacity : null,
          card1Opacity: card1 ? window.getComputedStyle(card1).opacity : null
        };
      })()`
    });
    console.log(check.result.value);

    // Save screenshot
    const shot = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(`C:\\Users\\Kleber Gomes\\.gemini\\antigravity-ide\\brain\\534ffe61-b1c8-4852-ba32-9f0c29436b8f\\test_diag_${c.name}.png`, Buffer.from(shot.data, 'base64'));
  }

  ws.close();
  chrome.kill();
  fs.rmSync(tempDir, { recursive: true, force: true });
}
run();
