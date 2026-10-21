import { spawn } from 'child_process';

async function testSeek() {
  const chrome = spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', [
    '--headless=new',
    '--window-size=1920,1080',
    '--remote-debugging-port=9259',
    'http://localhost:4321/'
  ]);

  try {
    await new Promise((r) => setTimeout(r, 2500));
    const res = await fetch('http://localhost:9259/json/list');
    const targets = await res.json();
    const target = targets.find((t) => t.type === 'page');
    if (!target) throw new Error('Target page not found');

    const ws = new WebSocket(target.webSocketDebuggerUrl);
    await new Promise((r) => (ws.onopen = r));

    let id = 1;
    const send = (method, params = {}) =>
      new Promise((resolve) => {
        const i = id++;
        const h = (e) => {
          const m = JSON.parse(e.data);
          if (m.id === i) {
            ws.removeEventListener('message', h);
            resolve(m.result);
          }
        };
        ws.addEventListener('message', h);
        ws.send(JSON.stringify({ id: i, method, params }));
      });

    await send('Runtime.enable');

    const evalJS = async (exp) => {
      const r = await send('Runtime.evaluate', { expression: exp, returnByValue: true, awaitPromise: true });
      return r.result?.value;
    };

    // Test a newly created <video> element with metodo-montanha-opt.mp4 to isolate from GSAP
    const result = await evalJS(`(async () => {
      const v = document.createElement('video');
      v.src = '/videos/metodo-montanha-opt.mp4';
      v.muted = true;
      v.playsInline = true;
      v.preload = 'auto';
      document.body.appendChild(v);

      await new Promise((resolve) => {
        if (v.readyState >= 1) resolve();
        else v.onloadedmetadata = resolve;
      });

      const initialDuration = v.duration;
      const initialReadyState = v.readyState;

      // Now seek to 3.5s
      const seekPromise = new Promise((resolve) => {
        v.onseeked = () => resolve('seeked_fired');
        setTimeout(() => resolve('timeout'), 2000);
      });

      v.currentTime = 3.5;
      const seekResult = await seekPromise;

      const afterSeekTime = v.currentTime;
      const afterSeekReadyState = v.readyState;

      v.remove();

      return {
        initialDuration,
        initialReadyState,
        seekResult,
        afterSeekTime,
        afterSeekReadyState
      };
    })()`);

    console.log('Isolated video seek test on metodo-montanha-opt.mp4:', result);

    // Also test metodo-montanha.mp4 (the fallback)
    const resultFallback = await evalJS(`(async () => {
      const v = document.createElement('video');
      v.src = '/videos/metodo-montanha.mp4';
      v.muted = true;
      v.playsInline = true;
      v.preload = 'auto';
      document.body.appendChild(v);

      await new Promise((resolve) => {
        if (v.readyState >= 1) resolve();
        else v.onloadedmetadata = resolve;
      });

      const initialDuration = v.duration;
      const initialReadyState = v.readyState;

      // Now seek to 3.5s
      const seekPromise = new Promise((resolve) => {
        v.onseeked = () => resolve('seeked_fired');
        setTimeout(() => resolve('timeout'), 2000);
      });

      v.currentTime = 3.5;
      const seekResult = await seekPromise;

      const afterSeekTime = v.currentTime;
      const afterSeekReadyState = v.readyState;

      v.remove();

      return {
        initialDuration,
        initialReadyState,
        seekResult,
        afterSeekTime,
        afterSeekReadyState
      };
    })()`);

    console.log('Isolated video seek test on metodo-montanha.mp4:', resultFallback);

    // Also test hero-desktop-intra-opt.mp4
    const resultHero = await evalJS(`(async () => {
      const v = document.createElement('video');
      v.src = '/videos/hero-desktop-intra-opt.mp4';
      v.muted = true;
      v.playsInline = true;
      v.preload = 'auto';
      document.body.appendChild(v);

      await new Promise((resolve) => {
        if (v.readyState >= 1) resolve();
        else v.onloadedmetadata = resolve;
      });

      const initialDuration = v.duration;
      const initialReadyState = v.readyState;

      // Now seek to 3.5s
      const seekPromise = new Promise((resolve) => {
        v.onseeked = () => resolve('seeked_fired');
        setTimeout(() => resolve('timeout'), 2000);
      });

      v.currentTime = 3.5;
      const seekResult = await seekPromise;

      const afterSeekTime = v.currentTime;
      const afterSeekReadyState = v.readyState;

      v.remove();

      return {
        initialDuration,
        initialReadyState,
        seekResult,
        afterSeekTime,
        afterSeekReadyState
      };
    })()`);

    console.log('Isolated video seek test on hero-desktop-intra-opt.mp4:', resultHero);

    ws.close();
  } finally {
    chrome.kill();
  }
}

testSeek().catch(console.error);
