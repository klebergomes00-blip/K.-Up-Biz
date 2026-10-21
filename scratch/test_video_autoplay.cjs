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

async function main() {
  console.log('=== TESTING AUTO-PLAY VIDEO IN NOSSO DIFERENCIAL ===');
  const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
  const chromeProcess = spawn(chromePath, [
    '--headless=new',
    '--remote-debugging-port=9227',
    '--disable-gpu',
    '--no-sandbox',
    '--window-size=1440,900',
    '--autoplay-policy=no-user-gesture-required',
    'http://localhost:4321/'
  ]);

  await wait(3000);
  const list = await getJson('http://127.0.0.1:9227/json/list');
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

  await wait(1500);

  const artifactDir = 'C:\\Users\\Kleber Gomes\\.gemini\\antigravity-ide\\brain\\534ffe61-b1c8-4852-ba32-9f0c29436b8f';

  async function takeScreenshot(name) {
    const res = await send('Page.captureScreenshot', { format: 'png' });
    const fullPath = path.join(artifactDir, name);
    fs.writeFileSync(fullPath, Buffer.from(res.data, 'base64'));
    console.log(`Saved screenshot: ${name}`);
  }

  // 1. Get initial video state while at top of page (should be paused because section not visible)
  const topVideoState = await send('Runtime.evaluate', {
    returnByValue: true,
    expression: `(() => {
      const v = document.getElementById('tablet-case-video');
      return v ? { paused: v.paused, currentTime: v.currentTime, loop: v.loop, muted: v.muted } : null;
    })()`
  });
  console.log('Video state at page top (outside fold 5):', topVideoState.result?.value);

  // 2. Scroll to fold 5
  console.log('Scrolling to fold 5 (NossoDiferencial)...');
  await send('Runtime.evaluate', {
    expression: `(() => {
      const sec = document.getElementById('diferencial');
      if (sec) sec.scrollIntoView({ behavior: 'instant', block: 'center' });
    })()`
  });

  await wait(1500);

  // 3. Check if video is playing
  const t1 = await send('Runtime.evaluate', {
    returnByValue: true,
    expression: `(() => {
      const v = document.getElementById('tablet-case-video');
      return v ? { paused: v.paused, currentTime: v.currentTime, duration: v.duration, readyState: v.readyState } : null;
    })()`
  });
  console.log('Video state after entering fold 5 (t1):', t1.result?.value);

  // Wait 2.5 seconds to verify normal playback speed
  await wait(2500);

  const t2 = await send('Runtime.evaluate', {
    returnByValue: true,
    expression: `(() => {
      const v = document.getElementById('tablet-case-video');
      return v ? { paused: v.paused, currentTime: v.currentTime } : null;
    })()`
  });
  console.log('Video state after 2.5s (t2):', t2.result?.value);
  const timeAdvanced = t2.result?.value?.currentTime > t1.result?.value?.currentTime;
  console.log('Time advanced normally in real-time:', timeAdvanced, `(${t1.result?.value?.currentTime.toFixed(2)}s -> ${t2.result?.value?.currentTime.toFixed(2)}s)`);

  // Capture screenshot of video playing inside the tablet
  await takeScreenshot('case_video_playing.png');

  // 4. Verify the link "EXPLORAR PROJETO ↗"
  const linkInfo = await send('Runtime.evaluate', {
    returnByValue: true,
    expression: `(() => {
      const a = document.querySelector('.tablet-case-link');
      return a ? { text: a.innerText.trim(), href: a.href, target: a.target, rel: a.rel } : null;
    })()`
  });
  console.log('Case project link info:', linkInfo.result?.value);

  // 5. Scroll away back to top to verify pause on exit
  console.log('Scrolling away from fold 5 back to top...');
  await send('Runtime.evaluate', { expression: `window.scrollTo(0, 0);` });
  await wait(1000);

  const pausedState = await send('Runtime.evaluate', {
    returnByValue: true,
    expression: `(() => {
      const v = document.getElementById('tablet-case-video');
      return v ? { paused: v.paused, currentTime: v.currentTime } : null;
    })()`
  });
  console.log('Video state when scrolled away (should be paused):', pausedState.result?.value);

  // 6. Scroll back to fold 5 to verify resume
  console.log('Scrolling back to fold 5 to verify resume...');
  await send('Runtime.evaluate', {
    expression: `(() => {
      const sec = document.getElementById('diferencial');
      if (sec) sec.scrollIntoView({ behavior: 'instant', block: 'center' });
    })()`
  });
  await wait(1200);

  const resumeState = await send('Runtime.evaluate', {
    returnByValue: true,
    expression: `(() => {
      const v = document.getElementById('tablet-case-video');
      return v ? { paused: v.paused, currentTime: v.currentTime } : null;
    })()`
  });
  console.log('Video state on return (should be playing):', resumeState.result?.value);

  // 7. Verify mountain video in NossoMetodo is intact
  const metodoVideo = await send('Runtime.evaluate', {
    returnByValue: true,
    expression: `(() => {
      const v = document.getElementById('metodo-video');
      return v ? { exists: true, duration: v.duration, readyState: v.readyState } : null;
    })()`
  });
  console.log('NossoMetodo mountain video intact:', metodoVideo.result?.value);

  console.log('Console errors:', consoleErrors);
  chromeProcess.kill();
  console.log('=== TEST COMPLETED ===');
  process.exit(0);
}

main().catch(e => {
  console.error('Test error:', e);
  process.exit(1);
});
