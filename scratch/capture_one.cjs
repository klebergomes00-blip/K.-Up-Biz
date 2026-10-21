const { spawn } = require('child_process');
const http = require('http');
const fs = require('fs');
const path = require('path');

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

async function testOne() {
  const port = 9311;
  const tempProfile = path.join(__dirname, 'chrome-temp-profile-' + Date.now());
  console.log('Spawning Chrome on port', port);
  const chrome = spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', [
    '--headless=new',
    `--remote-debugging-port=${port}`,
    `--user-data-dir=${tempProfile}`,
    '--no-first-run',
    '--no-default-browser-check',
    '--window-size=1600,1000',
    'about:blank'
  ]);

  await wait(2500);
  const list = await getJson(`http://127.0.0.1:${port}/json/list`);
  const ws = new WebSocket(list[0].webSocketDebuggerUrl);
  await new Promise(r => ws.onopen = r);

  let id = 1;
  function send(method, params = {}) {
    return new Promise((resolve, reject) => {
      const curId = id++;
      const timer = setTimeout(() => reject(new Error('Timeout ' + method)), 15000);
      const onMsg = (e) => {
        const msg = JSON.parse(e.data);
        if (msg.id === curId) {
          clearTimeout(timer);
          ws.removeEventListener('message', onMsg);
          if (msg.error) reject(msg.error);
          else resolve(msg.result);
        }
      };
      ws.addEventListener('message', onMsg);
      ws.send(JSON.stringify({ id: curId, method, params }));
    });
  }

  console.log('Enabling Page & Runtime...');
  await send('Page.enable');
  await send('Runtime.enable');

  const targetUrl = 'https://level-up-agency-astro.vercel.app/';
  console.log('Navigating to', targetUrl);
  await send('Page.navigate', { url: targetUrl });
  console.log('Waiting 4s for render...');
  await wait(4000);

  console.log('Calling Page.captureScreenshot...');
  const shot = await send('Page.captureScreenshot', { format: 'png' });
  console.log('Screenshot received! Size in base64 chars:', shot.data.length);

  const outPath = path.join(__dirname, '..', 'public', 'imagens', 'portfolio', 'level-up-agency.png');
  fs.writeFileSync(outPath, Buffer.from(shot.data, 'base64'));
  console.log('Saved to', outPath, fs.statSync(outPath).size, 'bytes');

  ws.close();
  chrome.kill();
  try { fs.rmSync(tempProfile, { recursive: true, force: true }); } catch(e){}
  process.exit(0);
}

testOne().catch(e => {
  console.error('Test failed:', e);
  process.exit(1);
});
