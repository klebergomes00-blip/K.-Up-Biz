import { spawn } from 'child_process';

async function diagnoseDev() {
  console.log('--- DIAGNÓSTICO ETAPA 1 (ASTRO DEV) ---');

  const chrome = spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', [
    '--headless=new',
    '--window-size=1920,1080',
    '--remote-debugging-port=9258',
    'http://localhost:4321/'
  ]);

  try {
    await new Promise((r) => setTimeout(r, 2500));
    const res = await fetch('http://localhost:9258/json/list');
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

    const consoleLogs = [];
    ws.addEventListener('message', (e) => {
      const m = JSON.parse(e.data);
      if (m.method === 'Runtime.consoleAPICalled') {
        consoleLogs.push({
          type: m.params.type,
          text: m.params.args.map((a) => a.value || a.description).join(' ')
        });
      }
      if (m.method === 'Runtime.exceptionThrown') {
        consoleLogs.push({
          type: 'EXCEPTION',
          text: m.params.exceptionDetails?.text + ' ' + (m.params.exceptionDetails?.exception?.description || '')
        });
      }
    });

    const evalJS = async (exp) => {
      const r = await send('Runtime.evaluate', { expression: exp, returnByValue: true });
      return r.result?.value;
    };

    // 1. Skip intro
    console.log('Pulando intro...');
    await evalJS(`(() => {
      const btn = document.getElementById('intro-skip-btn');
      if (btn) btn.click();
    })()`);
    await new Promise((r) => setTimeout(r, 1200));

    // 2. Diagnóstico 1, 2, 3, 4:
    console.log('Checando propriedades nativas do elemento <video>...');
    const videoProps = await evalJS(`(() => {
      const v = document.getElementById('metodo-video');
      const p = document.getElementById('metodo-poster-layer');
      if (!v) return { error: 'Elemento #metodo-video não encontrado no DOM' };

      const seekableRanges = [];
      for (let i = 0; i < v.seekable.length; i++) {
        seekableRanges.push({ start: v.seekable.start(i), end: v.seekable.end(i) });
      }

      return {
        tagName: v.tagName,
        src: v.src,
        currentSrc: v.currentSrc,
        readyState: v.readyState,
        networkState: v.networkState,
        paused: v.paused,
        muted: v.muted,
        duration: v.duration,
        currentTime: v.currentTime,
        videoWidth: v.videoWidth,
        videoHeight: v.videoHeight,
        error: v.error ? { code: v.error.code, message: v.error.message } : null,
        seekableRanges,
        preload: v.preload,
        posterOpacity: p ? window.getComputedStyle(p).opacity : null,
        posterHidden: p ? p.classList.contains('is-hidden') : null
      };
    })()`);
    console.log('Propriedades do vídeo:', JSON.stringify(videoProps, null, 2));

    // Teste de alteração manual de currentTime
    console.log('\nTestando alteração manual de video.currentTime = 3.5s...');
    const manualSeek = await evalJS(`(() => {
      const v = document.getElementById('metodo-video');
      if (!v) return null;
      v.currentTime = 3.5;
      return {
        seeking: v.seeking,
        currentTimeAfterAssign: v.currentTime
      };
    })()`);
    console.log('Resultado após assign manual:', manualSeek);
    await new Promise((r) => setTimeout(r, 500));

    const currentTimeAfterDelay = await evalJS(`(() => {
      const v = document.getElementById('metodo-video');
      return { currentTime: v ? v.currentTime : null };
    })()`);
    console.log('CurrentTime 500ms após assign manual:', currentTimeAfterDelay);

    // 3. Inspecionar ScrollTriggers
    console.log('\nInspecionando ScrollTriggers...');
    const triggers = await evalJS(`(() => {
      if (!window.ScrollTrigger) return 'ScrollTrigger not global';
      return window.ScrollTrigger.getAll().map(st => ({
        id: st.vars?.id || st.trigger?.id || st.trigger?.className,
        start: st.start,
        end: st.end,
        progress: st.progress,
        isActive: st.isActive,
        pin: !!st.pin
      }));
    })()`);
    console.log('Triggers:', JSON.stringify(triggers, null, 2));

    // 4. Scrollar até #metodo
    console.log('\nScrollando até #metodo...');
    await evalJS(`(() => {
      const s = document.getElementById('metodo');
      if (s) s.scrollIntoView({ behavior: 'instant', block: 'start' });
    })()`);
    await new Promise((r) => setTimeout(r, 1200));

    const stateAtMetodo = await evalJS(`(() => {
      const v = document.getElementById('metodo-video');
      const p = document.getElementById('metodo-poster-layer');
      return {
        scrollY: window.scrollY,
        currentTime: v ? v.currentTime : null,
        posterOpacity: p ? window.getComputedStyle(p).opacity : null,
        posterHidden: p ? p.classList.contains('is-hidden') : null
      };
    })()`);
    console.log('Estado em #metodo:', JSON.stringify(stateAtMetodo, null, 2));

    // 5. Scrollar incrementalmente dentro do pin e verificar onUpdate
    console.log('\nScrollando +800px...');
    await evalJS(`window.scrollBy({ top: 800, behavior: 'instant' });`);
    await new Promise((r) => setTimeout(r, 800));

    const stateAfterScroll1 = await evalJS(`(() => {
      const v = document.getElementById('metodo-video');
      return {
        scrollY: window.scrollY,
        currentTime: v ? v.currentTime : null
      };
    })()`);
    console.log('Após +800px:', JSON.stringify(stateAfterScroll1, null, 2));

    console.log('\nScrollando +1200px adicionais...');
    await evalJS(`window.scrollBy({ top: 1200, behavior: 'instant' });`);
    await new Promise((r) => setTimeout(r, 800));

    const stateAfterScroll2 = await evalJS(`(() => {
      const v = document.getElementById('metodo-video');
      return {
        scrollY: window.scrollY,
        currentTime: v ? v.currentTime : null
      };
    })()`);
    console.log('Após +1200px:', JSON.stringify(stateAfterScroll2, null, 2));

    console.log('\nScrollando -1000px de volta...');
    await evalJS(`window.scrollBy({ top: -1000, behavior: 'instant' });`);
    await new Promise((r) => setTimeout(r, 800));

    const stateAfterScrollBack = await evalJS(`(() => {
      const v = document.getElementById('metodo-video');
      return {
        scrollY: window.scrollY,
        currentTime: v ? v.currentTime : null
      };
    })()`);
    console.log('Após -1000px:', JSON.stringify(stateAfterScrollBack, null, 2));

    console.log('\nConsole Logs capturados:', JSON.stringify(consoleLogs, null, 2));

    ws.close();
  } finally {
    chrome.kill();
  }
}

diagnoseDev().catch(console.error);
