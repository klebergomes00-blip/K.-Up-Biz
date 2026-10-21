const { spawn } = require('child_process');
const http = require('http');
const fs = require('fs');

async function wait(ms) { return new Promise(r => setTimeout(r, ms)); }
async function getJson(url) {
  return new Promise((resolve, reject) => {
    http.get(url, res => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(JSON.parse(data)));
    }).on('error', reject);
  });
}

async function run() {
  const chromeProc = spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', [
    '--headless=new',
    '--remote-debugging-port=9231',
    '--disable-gpu',
    '--no-sandbox',
    '--window-size=1440,900',
    '--autoplay-policy=no-user-gesture-required',
    'http://localhost:4321/'
  ]);
  await wait(3000);
  const list = await getJson('http://127.0.0.1:9231/json/list');
  const page = list.find(t => t.url.includes('localhost:4321')) || list[0];
  const ws = new WebSocket(page.webSocketDebuggerUrl);
  await new Promise(r => ws.onopen = r);

  let id = 1;
  const send = (method, params = {}) => new Promise((res, rej) => {
    const curId = id++;
    const handler = (e) => {
      const msg = JSON.parse(e.data);
      if (msg.id === curId) {
        ws.removeEventListener('message', handler);
        if (msg.error) rej(msg.error);
        else res(msg.result);
      }
    };
    ws.addEventListener('message', handler);
    ws.send(JSON.stringify({ id: curId, method, params }));
  });

  await send('Page.enable');
  await send('Runtime.enable');
  await wait(1500);

  // Skip intro
  await send('Runtime.evaluate', {
    expression: `(() => {
      const skipBtn = document.getElementById('intro-skip-btn');
      if (skipBtn) skipBtn.click();
      const intro = document.getElementById('cinematic-intro');
      if (intro) { intro.style.display = 'none'; intro.classList.add('is-completed'); }
      window.dispatchEvent(new CustomEvent('cinematic-intro-complete'));
    })()`
  });
  await wait(1500);

  const secInfo = await send('Runtime.evaluate', {
    returnByValue: true,
    expression: `(() => {
      const sec = document.getElementById('diferencial');
      if (!sec) return null;
      const rect = sec.getBoundingClientRect();
      return { top: rect.top + window.scrollY, height: rect.height };
    })()`
  });

  const startY = secInfo.result.value.top;
  const scrollTarget = startY + 1550; // Fase 3: Apresentação (Badge + Video + Link visíveis)
  console.log('Scrolling to target Fase 3:', scrollTarget);
  await send('Runtime.evaluate', { expression: `window.scrollTo(0, ${scrollTarget});` });
  await wait(2500);

  const videoData = await send('Runtime.evaluate', {
    returnByValue: true,
    expression: `(() => {
      const v = document.getElementById('tablet-case-video');
      return v ? { paused: v.paused, currentTime: v.currentTime, readyState: v.readyState } : null;
    })()`
  });
  console.log('Video data at scrollTarget:', videoData.result.value);

  const shot = await send('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync('C:\\Users\\Kleber Gomes\\.gemini\\antigravity-ide\\brain\\534ffe61-b1c8-4852-ba32-9f0c29436b8f\\case_video_fase3_complete.png', Buffer.from(shot.data, 'base64'));
  console.log('Saved case_video_fase3_complete.png successfully.');

  chromeProc.kill();
  process.exit(0);
}

run().catch(e => { console.error(e); process.exit(1); });
