import { spawn } from 'child_process';

async function diagnose() {
  console.log('Launching Chrome for video diagnosis...');
  const chrome = spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', [
    '--headless=new',
    '--window-size=1920,1080',
    '--remote-debugging-port=9254',
    'http://localhost:4321'
  ]);

  try {
    await new Promise((r) => setTimeout(r, 2200));
    const res = await fetch('http://localhost:9254/json/list');
    const targets = await res.json();
    const target = targets.find((t) => t.type === 'page' && t.url.includes('localhost:4321')) || targets.find((t) => t.type === 'page');
    if (!target) throw new Error('Target not found');

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
    await send('Page.enable');

    const consoleLogs = [];
    ws.addEventListener('message', (e) => {
      const m = JSON.parse(e.data);
      if (m.method === 'Runtime.consoleAPICalled') {
        consoleLogs.push({
          type: m.params.type,
          args: m.params.args.map((a) => a.value || a.description).join(' ')
        });
      }
    });

    const evalJS = async (exp) => {
      const res = await send('Runtime.evaluate', { expression: exp, returnByValue: true });
      return res.result?.value;
    };

    // Skip intro
    await evalJS(`(() => {
      const btn = document.getElementById('intro-skip-btn');
      if (btn) btn.click();
    })()`);
    await new Promise((r) => setTimeout(r, 1200));

    // Initial state of video before scrolling to metodo
    const preState = await evalJS(`(() => {
      const v = document.getElementById('metodo-video');
      const p = document.getElementById('metodo-poster-layer');
      return {
        videoFound: !!v,
        currentSrc: v ? v.currentSrc : null,
        readyState: v ? v.readyState : null,
        networkState: v ? v.networkState : null,
        paused: v ? v.paused : null,
        currentTime: v ? v.currentTime : null,
        duration: v ? v.duration : null,
        error: v && v.error ? { code: v.error.code, message: v.error.message } : null,
        posterHidden: p ? p.classList.contains('is-hidden') : null
      };
    })()`);
    console.log('Pre-scroll Video State:', JSON.stringify(preState, null, 2));

    // Scroll to #metodo top
    console.log('Scrolling to #metodo...');
    await evalJS(`(() => {
      const s = document.getElementById('metodo');
      if (s) s.scrollIntoView({ behavior: 'instant', block: 'start' });
    })()`);
    await new Promise((r) => setTimeout(r, 1500));

    // Check ScrollTrigger & video state at top of metodo
    const topState = await evalJS(`(() => {
      const v = document.getElementById('metodo-video');
      const p = document.getElementById('metodo-poster-layer');
      const triggers = window.ScrollTrigger ? window.ScrollTrigger.getAll().map(st => ({
        id: st.vars?.id || st.trigger?.id || st.trigger?.className,
        start: st.start,
        end: st.end,
        progress: st.progress,
        isActive: st.isActive
      })) : 'ScrollTrigger not global';

      return {
        triggers,
        readyState: v ? v.readyState : null,
        currentTime: v ? v.currentTime : null,
        posterHidden: p ? p.classList.contains('is-hidden') : null,
        scrollY: window.scrollY
      };
    })()`);
    console.log('Top of Metodo State:', JSON.stringify(topState, null, 2));

    // Now scroll down by 1000px inside the pin
    console.log('Scrolling down by 1000px...');
    await evalJS(`(() => {
      window.scrollBy({ top: 1000, behavior: 'instant' });
    })()`);
    await new Promise((r) => setTimeout(r, 1500));

    const scrolledState1 = await evalJS(`(() => {
      const v = document.getElementById('metodo-video');
      const p = document.getElementById('metodo-poster-layer');
      const triggers = window.ScrollTrigger ? window.ScrollTrigger.getAll().map(st => ({
        trigger: st.trigger?.id || st.trigger?.className,
        progress: st.progress,
        isActive: st.isActive
      })) : null;

      return {
        triggers,
        readyState: v ? v.readyState : null,
        currentTime: v ? v.currentTime : null,
        seeking: v ? v.seeking : null,
        posterHidden: p ? p.classList.contains('is-hidden') : null,
        scrollY: window.scrollY
      };
    })()`);
    console.log('Scrolled +1000px State:', JSON.stringify(scrolledState1, null, 2));

    // Scroll down another 1500px
    console.log('Scrolling down by another 1500px...');
    await evalJS(`(() => {
      window.scrollBy({ top: 1500, behavior: 'instant' });
    })()`);
    await new Promise((r) => setTimeout(r, 1500));

    const scrolledState2 = await evalJS(`(() => {
      const v = document.getElementById('metodo-video');
      return {
        currentTime: v ? v.currentTime : null,
        scrollY: window.scrollY
      };
    })()`);
    console.log('Scrolled +2500px State:', JSON.stringify(scrolledState2, null, 2));

    // Scroll BACK UP by 1500px
    console.log('Scrolling back up by 1500px...');
    await evalJS(`(() => {
      window.scrollBy({ top: -1500, behavior: 'instant' });
    })()`);
    await new Promise((r) => setTimeout(r, 1500));

    const scrolledBack = await evalJS(`(() => {
      const v = document.getElementById('metodo-video');
      return {
        currentTime: v ? v.currentTime : null,
        scrollY: window.scrollY
      };
    })()`);
    console.log('Scrolled Back Up State:', JSON.stringify(scrolledBack, null, 2));

    console.log('Console Logs Captured:', JSON.stringify(consoleLogs, null, 2));

    ws.close();
  } finally {
    chrome.kill();
  }
}

diagnose().catch(console.error);
