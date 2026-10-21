import { spawn } from 'child_process';

async function inspectTriggers() {
  const chrome = spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', [
    '--headless=new',
    '--window-size=1920,1080',
    '--remote-debugging-port=9260',
    'http://localhost:4321/'
  ]);

  try {
    await new Promise((r) => setTimeout(r, 2500));
    const res = await fetch('http://localhost:9260/json/list');
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

    // Skip intro
    await evalJS(`(() => {
      const btn = document.getElementById('intro-skip-btn');
      if (btn) btn.click();
    })()`);
    await new Promise((r) => setTimeout(r, 1200));

    // Expose gsap & ScrollTrigger globally if they aren't already
    const triggerData = await evalJS(`(() => {
      // Find ScrollTrigger instances from document elements or window
      const allST = [];
      // Check if gsap or ScrollTrigger is accessible
      // We can inspect elements that have _gsap or triggers
      const sections = ['hero-scroll-wrapper', 'nossa-visao', 'solucoes', 'metodo'];
      const sectionRects = {};
      sections.forEach(id => {
        const el = document.getElementById(id);
        if (el) {
          const r = el.getBoundingClientRect();
          sectionRects[id] = {
            top: Math.round(r.top + window.scrollY),
            height: Math.round(r.height),
            bottom: Math.round(r.bottom + window.scrollY)
          };
        }
      });

      return {
        sectionRects,
        totalScrollHeight: document.documentElement.scrollHeight,
        viewportHeight: window.innerHeight
      };
    })()`);

    console.log('Section geometry:', JSON.stringify(triggerData, null, 2));

    ws.close();
  } finally {
    chrome.kill();
  }
}

inspectTriggers().catch(console.error);
