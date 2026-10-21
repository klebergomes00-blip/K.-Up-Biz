import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';

const artifactsDir = 'C:\\Users\\Kleber Gomes\\.gemini\\antigravity-ide\\brain\\534ffe61-b1c8-4852-ba32-9f0c29436b8f';

async function runValidation() {
  console.log('=== INICIANDO VALIDAÇÃO COMPLETA DA QUARTA DOBRA ===\n');

  const chrome = spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', [
    '--headless=new',
    '--window-size=1920,1080',
    '--remote-debugging-port=9256',
    'http://localhost:4321'
  ]);

  try {
    await new Promise((r) => setTimeout(r, 2500));
    const res = await fetch('http://localhost:9256/json/list');
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
    await send('Page.enable');

    const evalJS = async (exp) => {
      const r = await send('Runtime.evaluate', { expression: exp, returnByValue: true });
      return r.result?.value;
    };

    const takeScreenshot = async (filename) => {
      const { data } = await send('Page.captureScreenshot', { format: 'png' });
      const buffer = Buffer.from(data, 'base64');
      const filePath = path.join(artifactsDir, filename);
      fs.writeFileSync(filePath, buffer);
      console.log(`[Screenshot salvo] ${filename}`);
    };

    // 1. Pular intro cinematográfica
    console.log('1. Pulando CinematicIntro...');
    await evalJS(`(() => {
      const btn = document.getElementById('intro-skip-btn');
      if (btn) btn.click();
    })()`);
    await new Promise((r) => setTimeout(r, 1200));

    // 2. Navegar até a quarta dobra (#metodo)
    console.log('2. Navegando até a quarta dobra (#metodo)...');
    await evalJS(`(() => {
      const s = document.getElementById('metodo');
      if (s) s.scrollIntoView({ behavior: 'instant', block: 'start' });
    })()`);
    await new Promise((r) => setTimeout(r, 1500));

    // Medir estado no topo do método
    const stateAtTop = await evalJS(`(() => {
      const v = document.getElementById('metodo-video');
      const p = document.getElementById('metodo-poster-layer');
      const s = document.getElementById('metodo');
      const rightCol = s.querySelector('.metodo-steps-col');
      const leftCol = s.querySelector('.metodo-sticky-col');
      const rail = s.querySelector('.metodo-timeline-rail');
      const node = s.querySelector('.step-node');
      const rR = rightCol.getBoundingClientRect();
      const lR = leftCol.getBoundingClientRect();
      const railR = rail.getBoundingClientRect();
      const cs = window.getComputedStyle(rightCol);

      return {
        scrollY: window.scrollY,
        currentTime: v ? v.currentTime : null,
        duration: v ? v.duration : null,
        readyState: v ? v.readyState : null,
        paused: v ? v.paused : null,
        posterHidden: p ? p.classList.contains('is-hidden') : false,
        posterOpacity: p ? window.getComputedStyle(p).opacity : null,
        rightColMarginLeft: cs.marginLeft,
        gapBetweenCols: Math.round(rR.left - lR.right),
        railLeft: Math.round(railR.left)
      };
    })()`);
    console.log('Estado inicial no topo de #metodo:', JSON.stringify(stateAtTop, null, 2));
    await takeScreenshot('metodo_val_01_top.png');

    // 3. Rolar para baixo para Fase 1
    console.log('\n3. Rolando para baixo +600px (Fase 1)...');
    await evalJS(`window.scrollBy({ top: 600, behavior: 'instant' });`);
    await new Promise((r) => setTimeout(r, 1500));

    const stateFase1 = await evalJS(`(() => {
      const v = document.getElementById('metodo-video');
      const p = document.getElementById('metodo-poster-layer');
      const steps = Array.from(document.querySelectorAll('.metodo-step')).map(s => ({
        active: s.classList.contains('is-active'),
        past: s.classList.contains('is-past'),
        upcoming: s.classList.contains('is-upcoming')
      }));
      return {
        scrollY: window.scrollY,
        currentTime: v ? v.currentTime : null,
        posterHidden: p ? p.classList.contains('is-hidden') : false,
        posterOpacity: p ? window.getComputedStyle(p).opacity : null,
        steps
      };
    })()`);
    console.log('Estado Fase 1:', JSON.stringify(stateFase1, null, 2));
    await takeScreenshot('metodo_val_02_fase1.png');

    // 4. Rolar para baixo para Fase 2 (+700px)
    console.log('\n4. Rolando para baixo +700px (Fase 2)...');
    await evalJS(`window.scrollBy({ top: 700, behavior: 'instant' });`);
    await new Promise((r) => setTimeout(r, 1500));

    const stateFase2 = await evalJS(`(() => {
      const v = document.getElementById('metodo-video');
      const steps = Array.from(document.querySelectorAll('.metodo-step')).map(s => ({
        active: s.classList.contains('is-active'),
        past: s.classList.contains('is-past')
      }));
      return {
        scrollY: window.scrollY,
        currentTime: v ? v.currentTime : null,
        steps
      };
    })()`);
    console.log('Estado Fase 2:', JSON.stringify(stateFase2, null, 2));
    await takeScreenshot('metodo_val_03_fase2.png');

    // 5. Rolar para baixo para Fase 3 (+700px)
    console.log('\n5. Rolando para baixo +700px (Fase 3)...');
    await evalJS(`window.scrollBy({ top: 700, behavior: 'instant' });`);
    await new Promise((r) => setTimeout(r, 1500));

    const stateFase3 = await evalJS(`(() => {
      const v = document.getElementById('metodo-video');
      const steps = Array.from(document.querySelectorAll('.metodo-step')).map(s => ({
        active: s.classList.contains('is-active'),
        past: s.classList.contains('is-past')
      }));
      return {
        scrollY: window.scrollY,
        currentTime: v ? v.currentTime : null,
        steps
      };
    })()`);
    console.log('Estado Fase 3:', JSON.stringify(stateFase3, null, 2));
    await takeScreenshot('metodo_val_04_fase3.png');

    // 6. Rolar para baixo para Fase 4 (+700px)
    console.log('\n6. Rolando para baixo +700px (Fase 4)...');
    await evalJS(`window.scrollBy({ top: 700, behavior: 'instant' });`);
    await new Promise((r) => setTimeout(r, 1500));

    const stateFase4 = await evalJS(`(() => {
      const v = document.getElementById('metodo-video');
      const railProg = document.getElementById('metodo-rail-progress');
      const steps = Array.from(document.querySelectorAll('.metodo-step')).map(s => ({
        active: s.classList.contains('is-active'),
        past: s.classList.contains('is-past')
      }));
      return {
        scrollY: window.scrollY,
        currentTime: v ? v.currentTime : null,
        railTransform: railProg ? window.getComputedStyle(railProg).transform : null,
        steps
      };
    })()`);
    console.log('Estado Fase 4:', JSON.stringify(stateFase4, null, 2));
    await takeScreenshot('metodo_val_05_fase4.png');

    // 7. ROLAR DE VOLTA PARA CIMA (-1400px) - REVERSÃO DO VÍDEO
    console.log('\n7. Rolando para cima -1400px (Reversão do vídeo para Fase 2)...');
    await evalJS(`window.scrollBy({ top: -1400, behavior: 'instant' });`);
    await new Promise((r) => setTimeout(r, 1500));

    const stateReversed = await evalJS(`(() => {
      const v = document.getElementById('metodo-video');
      const steps = Array.from(document.querySelectorAll('.metodo-step')).map(s => ({
        active: s.classList.contains('is-active'),
        past: s.classList.contains('is-past')
      }));
      return {
        scrollY: window.scrollY,
        currentTime: v ? v.currentTime : null,
        steps
      };
    })()`);
    console.log('Estado ao retroceder o scroll:', JSON.stringify(stateReversed, null, 2));
    await takeScreenshot('metodo_val_06_reversed.png');

    // 8. Rolar de volta ao topo de #metodo
    console.log('\n8. Rolando de volta ao topo de #metodo...');
    await evalJS(`window.scrollBy({ top: -1300, behavior: 'instant' });`);
    await new Promise((r) => setTimeout(r, 1500));

    const stateBackAtTop = await evalJS(`(() => {
      const v = document.getElementById('metodo-video');
      return {
        scrollY: window.scrollY,
        currentTime: v ? v.currentTime : null
      };
    })()`);
    console.log('Estado de volta ao topo:', JSON.stringify(stateBackAtTop, null, 2));

    ws.close();
  } finally {
    chrome.kill();
  }

  // 9. VALIDAÇÃO DE RESPONSIVIDADE E DESLOCAMENTO HORIZONTAL
  console.log('\n9. Testando Responsividade & Medição do Deslocamento em diferentes larguras...');
  const testViewports = [
    { name: '1920x1080', width: 1920, height: 1080 },
    { name: '1440x900', width: 1440, height: 900 },
    { name: '1280x800', width: 1280, height: 800 },
    { name: '1024x768', width: 1024, height: 768 },
    { name: '768x1024', width: 768, height: 1024 },
    { name: '375x812', width: 375, height: 812 }
  ];

  for (const vp of testViewports) {
    const c = spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', [
      '--headless=new',
      `--window-size=${vp.width},${vp.height}`,
      '--remote-debugging-port=9257',
      'http://localhost:4321'
    ]);

    try {
      await new Promise((r) => setTimeout(r, 2200));
      const res = await fetch('http://localhost:9257/json/list');
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
      await send('Page.enable');

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

      const report = await evalJS(`(() => {
        const s = document.getElementById('metodo');
        const grid = s.querySelector('.metodo-grid');
        const leftCol = s.querySelector('.metodo-sticky-col');
        const rightCol = s.querySelector('.metodo-steps-col');
        const rail = s.querySelector('.metodo-timeline-rail');
        const wrap = s.querySelector('.metodo-wrap');
        const video = s.querySelector('#metodo-video');

        const gR = grid ? grid.getBoundingClientRect() : {};
        const lR = leftCol ? leftCol.getBoundingClientRect() : {};
        const rR = rightCol ? rightCol.getBoundingClientRect() : {};
        const railR = rail ? rail.getBoundingClientRect() : {};
        const wR = wrap ? wrap.getBoundingClientRect() : {};
        const csRight = rightCol ? window.getComputedStyle(rightCol) : {};

        const docScrollWidth = document.documentElement.scrollWidth;
        const winWidth = window.innerWidth;
        const hasHorizontalOverflow = docScrollWidth > winWidth;

        return {
          windowWidth: winWidth,
          rightColMarginLeft: csRight.marginLeft,
          gapBetweenCols: Math.round(rR.left - lR.right),
          railLeft: Math.round(railR.left),
          rightColRight: Math.round(rR.right),
          hasHorizontalOverflow,
          videoReady: video ? video.readyState : null,
          videoDuration: video ? video.duration : null
        };
      })()`);

      console.log(`[Viewport ${vp.name}]`, JSON.stringify(report, null, 2));

      const { data } = await send('Page.captureScreenshot', { format: 'png' });
      const buffer = Buffer.from(data, 'base64');
      const filename = `metodo_responsive_${vp.width}.png`;
      fs.writeFileSync(path.join(artifactsDir, filename), buffer);
      console.log(`[Screenshot salvo] ${filename}`);

      ws.close();
    } catch (e) {
      console.error(vp.name, e.message);
    } finally {
      c.kill();
    }
  }

  console.log('\n=== VALIDAÇÃO COMPLETA CONCLUÍDA COM SUCESSO ===');
}

runValidation().catch(console.error);
