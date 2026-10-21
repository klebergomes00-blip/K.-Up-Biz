const { spawn } = require('child_process');
const http = require('http');
const fs = require('fs');
const path = require('path');

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

async function testDesktop() {
  console.log('\n=== TESTING VIDEO FRAMING (DESKTOP 1440x900) ===');
  const chromeProc = spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', [
    '--headless=new',
    '--remote-debugging-port=9232',
    '--disable-gpu',
    '--no-sandbox',
    '--window-size=1440,900',
    '--autoplay-policy=no-user-gesture-required',
    'http://localhost:4321/'
  ]);
  await wait(3000);
  const list = await getJson('http://127.0.0.1:9232/json/list');
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
    ws.send(JSON.stringify({ id, method, params }));
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
  await wait(1200);

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
  // Scroll to Fase 3 where tablet is frontal, stabilized, badge and caption are visible
  const scrollTarget = startY + 1550;
  await send('Runtime.evaluate', { expression: `window.scrollTo(0, ${scrollTarget});` });
  await wait(1000);

  // Set video to 2 seconds to inspect hero section
  await send('Runtime.evaluate', {
    expression: `(() => {
      const v = document.getElementById('tablet-case-video');
      if (v) { v.currentTime = 1.5; }
    })()`
  });
  await wait(600);

  const artifactDir = 'C:\\Users\\Kleber Gomes\\.gemini\\antigravity-ide\\brain\\534ffe61-b1c8-4852-ba32-9f0c29436b8f';

  // Take screenshot 1: at 1.5s
  let shot = await send('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync(path.join(artifactDir, 'framing_test_hero.png'), Buffer.from(shot.data, 'base64'));
  console.log('Saved framing_test_hero.png');

  // Set video to 6 seconds to inspect properties section
  await send('Runtime.evaluate', {
    expression: `(() => {
      const v = document.getElementById('tablet-case-video');
      if (v) { v.currentTime = 6.0; }
    })()`
  });
  await wait(600);

  // Take screenshot 2: at 6s
  shot = await send('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync(path.join(artifactDir, 'framing_test_content.png'), Buffer.from(shot.data, 'base64'));
  console.log('Saved framing_test_content.png');

  // Verify dimensions and bounds
  const dims = await send('Runtime.evaluate', {
    returnByValue: true,
    expression: `(() => {
      const v = document.getElementById('tablet-case-video');
      const screen = document.querySelector('.tablet-screen');
      const vRect = v.getBoundingClientRect();
      const sRect = screen.getBoundingClientRect();
      const computed = window.getComputedStyle(v);
      return {
        videoRect: { width: vRect.width, height: vRect.height, top: vRect.top, left: vRect.left },
        screenRect: { width: sRect.width, height: sRect.height, top: sRect.top, left: sRect.left },
        objectFit: computed.objectFit,
        objectPosition: computed.objectPosition
      };
    })()`
  });
  console.log('Video framing dimensions:', JSON.stringify(dims.result.value, null, 2));

  chromeProc.kill();
}

async function testMobile() {
  console.log('\n=== TESTING VIDEO FRAMING (MOBILE 375x812) ===');
  const chromeProc = spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', [
    '--headless=new',
    '--remote-debugging-port=9233',
    '--disable-gpu',
    '--no-sandbox',
    '--window-size=375,812',
    '--autoplay-policy=no-user-gesture-required',
    'http://localhost:4321/'
  ]);
  await wait(3000);
  const list = await getJson('http://127.0.0.1:9233/json/list');
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
    ws.send(JSON.stringify({ id, method, params }));
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
  await wait(1200);

  // Scroll to diferencial
  await send('Runtime.evaluate', {
    expression: `(() => {
      const sec = document.getElementById('diferencial');
      if (sec) sec.scrollIntoView({ behavior: 'instant', block: 'start' });
    })()`
  });
  await wait(1500);

  // Set video to 1.5s
  await send('Runtime.evaluate', {
    expression: `(() => {
      const v = document.getElementById('tablet-case-video');
      if (v) { v.currentTime = 1.5; }
    })()`
  });
  await wait(600);

  const artifactDir = 'C:\\Users\\Kleber Gomes\\.gemini\\antigravity-ide\\brain\\534ffe61-b1c8-4852-ba32-9f0c29436b8f';
  const shot = await send('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync(path.join(artifactDir, 'framing_test_mobile.png'), Buffer.from(shot.data, 'base64'));
  console.log('Saved framing_test_mobile.png');

  const overflow = await send('Runtime.evaluate', {
    returnByValue: true,
    expression: `document.documentElement.scrollWidth > window.innerWidth`
  });
  console.log('Mobile horizontal overflow:', overflow.result.value);

  chromeProc.kill();
}

async function main() {
  await testDesktop();
  await wait(1000);
  await testMobile();
  console.log('\n=== ALL FRAMING TESTS COMPLETE ===');
  process.exit(0);
}

main().catch(e => { console.error(e); process.exit(1); });
