import { spawn } from 'child_process';

async function measure() {
  const viewports = [
    { name: '1920x1080', width: 1920, height: 1080 },
    { name: '1440x900', width: 1440, height: 900 },
    { name: '1366x768', width: 1366, height: 768 },
    { name: '1280x800', width: 1280, height: 800 },
    { name: '1024x768', width: 1024, height: 768 },
    { name: '768x1024', width: 768, height: 1024 },
    { name: '375x812', width: 375, height: 812 }
  ];

  for (const vp of viewports) {
    const chrome = spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', [
      '--headless=new',
      `--window-size=${vp.width},${vp.height}`,
      '--remote-debugging-port=9255',
      'http://localhost:4321'
    ]);

    try {
      await new Promise((r) => setTimeout(r, 2000));
      const res = await fetch('http://localhost:9255/json/list');
      const targets = await res.json();
      const target = targets.find((t) => t.type === 'page');
      if (!target) continue;

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
        const r = await send('Runtime.evaluate', { expression: exp, returnByValue: true });
        return r.result?.value;
      };

      // Skip intro
      await evalJS(`(() => {
        const btn = document.getElementById('intro-skip-btn');
        if (btn) btn.click();
      })()`);
      await new Promise((r) => setTimeout(r, 800));

      // Scroll to #metodo
      await evalJS(`(() => {
        const s = document.getElementById('metodo');
        if (s) s.scrollIntoView({ behavior: 'instant', block: 'start' });
      })()`);
      await new Promise((r) => setTimeout(r, 800));

      const metrics = await evalJS(`(() => {
        const s = document.getElementById('metodo');
        const grid = s.querySelector('.metodo-grid');
        const leftCol = s.querySelector('.metodo-sticky-col');
        const rightCol = s.querySelector('.metodo-steps-col');
        const rail = s.querySelector('.metodo-timeline-rail');
        const node = s.querySelector('.step-node');
        const title = s.querySelector('.step-title');
        const wrap = s.querySelector('.metodo-wrap');

        const gR = grid ? grid.getBoundingClientRect() : {};
        const lR = leftCol ? leftCol.getBoundingClientRect() : {};
        const rR = rightCol ? rightCol.getBoundingClientRect() : {};
        const railR = rail ? rail.getBoundingClientRect() : {};
        const nodeR = node ? node.getBoundingClientRect() : {};
        const titleR = title ? title.getBoundingClientRect() : {};
        const wR = wrap ? wrap.getBoundingClientRect() : {};

        const csRight = rightCol ? window.getComputedStyle(rightCol) : {};
        const csGrid = grid ? window.getComputedStyle(grid) : {};

        return {
          windowWidth: window.innerWidth,
          wrapLeft: Math.round(wR.left),
          wrapWidth: Math.round(wR.width),
          gridLeft: Math.round(gR.left),
          gridWidth: Math.round(gR.width),
          gridGap: csGrid.gap,
          leftColRight: Math.round(lR.right),
          leftColWidth: Math.round(lR.width),
          gapBetweenCols: Math.round(rR.left - lR.right),
          rightColLeft: Math.round(rR.left),
          rightColMarginLeft: csRight.marginLeft,
          rightColPaddingLeft: csRight.paddingLeft,
          rightColWidth: Math.round(rR.width),
          railLeft: Math.round(railR.left),
          nodeLeft: Math.round(nodeR.left),
          titleLeft: Math.round(titleR.left),
          rightColRight: Math.round(rR.right),
          overflowRight: Math.round(rR.right - window.innerWidth)
        };
      })()`);

      console.log(`Viewport ${vp.name}:`, JSON.stringify(metrics, null, 2));

      ws.close();
    } catch (e) {
      console.error(vp.name, e.message);
    } finally {
      chrome.kill();
    }
  }
}

measure().catch(console.error);
