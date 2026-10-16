import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';

const ARTIFACTS_DIR = 'C:\\Users\\Kleber Gomes\\.gemini\\antigravity-ide\\brain\\a4e87674-7b63-4492-bd3c-60bbcb27495a';

async function runTest() {
  console.log('=== TESTE DE LED INFERIOR & ZOOM 3D CINEMATOGRÁFICO ===');
  const chrome = spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', [
    '--headless=new',
    '--window-size=1920,1080',
    '--remote-debugging-port=9246',
    'http://localhost:4321'
  ]);

  await new Promise((r) => setTimeout(r, 2200));
  const res = await fetch('http://localhost:9246/json/list');
  const targets = await res.json();
  const target = targets.find((t) => t.type === 'page' && t.url.includes('localhost:4321')) || targets.find((t) => t.type === 'page');
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

  const consoleErrors = [];
  ws.addEventListener('message', (e) => {
    const m = JSON.parse(e.data);
    if (m.method === 'Runtime.consoleAPICalled' && m.params.type === 'error') {
      consoleErrors.push(m.params.args.map((a) => a.value || a.description).join(' '));
    }
  });

  const evalJS = async (exp) => {
    const res = await send('Runtime.evaluate', { expression: exp, returnByValue: true });
    return res.result?.value;
  };

  const capture = async (name) => {
    const res = await send('Page.captureScreenshot', { format: 'png' });
    const p = path.join(ARTIFACTS_DIR, `${name}.png`);
    fs.writeFileSync(p, Buffer.from(res.data, 'base64'));
    console.log(`[Screenshot salvo]: ${name}.png`);
  };

  try {
    // 1. Pular Intro
    console.log('1. Pulando intro...');
    await evalJS(`(() => {
      const btn = document.getElementById('intro-skip-btn');
      if (btn) btn.click();
    })()`);
    await new Promise((r) => setTimeout(r, 1200));

    // 2. Rolar até a terceira dobra
    console.log('2. Rolando até a terceira dobra #solucoes...');
    await evalJS(`(() => {
      const s = document.getElementById('solucoes');
      if (s) {
        s.scrollIntoView({ behavior: 'instant', block: 'center' });
        s.classList.add('is-shelf-visible');
      }
    })()`);
    await new Promise((r) => setTimeout(r, 1000));

    // 3. Validar Iluminação LED Inferior da Prateleira
    console.log('3. Validando Iluminação LED Inferior...');
    const ledCheck = await evalJS(`(() => {
      const underglow = document.querySelector('.shelf-led-underglow');
      const strip = document.querySelector('.shelf-led-strip');
      const cast = document.querySelector('.shelf-led-cast');
      const ambient = document.querySelector('.shelf-led-ambient');
      const shadow = document.querySelector('.shelf-under-shadow');

      return {
        underglowExists: !!underglow,
        stripExists: !!strip,
        stripBg: getComputedStyle(strip || document.body).backgroundImage.slice(0, 40) + '...',
        castExists: !!cast,
        castFilter: getComputedStyle(cast || document.body).filter,
        ambientExists: !!ambient,
        ambientFilter: getComputedStyle(ambient || document.body).filter,
        shadowExists: !!shadow,
      };
    })()`);
    console.log('LED Check:', JSON.stringify(ledCheck, null, 2));

    await capture('shelf_led_underglow_normal');

    // 4. Testar Zoom 3D no Card 1 (Web)
    console.log('4. Testando Zoom 3D no Card 1 (Web)...');
    await evalJS(`(() => {
      const a = document.querySelector('[data-service-id="web"]');
      if (a) a.classList.add('is-hover-simulated');
    })()`);
    await new Promise((r) => setTimeout(r, 650));

    const webHoverMetrics = await evalJS(`(() => {
      const anchorWeb = document.querySelector('[data-service-id="web"]');
      const cardWeb = anchorWeb?.querySelector('.shelf-card');
      const pillWeb = anchorWeb?.querySelector('.card-open-pill-btn');
      const anchorLocal = document.querySelector('[data-service-id="local"]');
      const anchorReach = document.querySelector('[data-service-id="reach"]');

      const rectWeb = cardWeb?.getBoundingClientRect();
      const rectLocal = anchorLocal?.querySelector('.shelf-card')?.getBoundingClientRect();

      return {
        anchorZIndex: getComputedStyle(anchorWeb || document.body).zIndex,
        cardTransform: getComputedStyle(cardWeb || document.body).transform,
        pillOpacity: getComputedStyle(pillWeb || document.body).opacity,
        pillPointerEvents: getComputedStyle(pillWeb || document.body).pointerEvents,
        siblingLocalOpacity: getComputedStyle(anchorLocal || document.body).opacity,
        siblingReachOpacity: getComputedStyle(anchorReach || document.body).opacity,
        distanceBetweenWebAndLocal: rectLocal.left - rectWeb.right,
      };
    })()`);
    console.log('Web Hover Metrics:', JSON.stringify(webHoverMetrics, null, 2));
    await capture('shelf_zoom_card1_web');

    // 5. Testar Zoom 3D no Card 2 (Local)
    console.log('5. Testando Zoom 3D no Card 2 (Local)...');
    await evalJS(`(() => {
      document.querySelector('[data-service-id="web"]')?.classList.remove('is-hover-simulated');
      document.querySelector('[data-service-id="local"]')?.classList.add('is-hover-simulated');
    })()`);
    await new Promise((r) => setTimeout(r, 650));
    await capture('shelf_zoom_card2_local');

    // 6. Testar Zoom 3D no Card 3 (Reach)
    console.log('6. Testando Zoom 3D no Card 3 (Reach)...');
    await evalJS(`(() => {
      document.querySelector('[data-service-id="local"]')?.classList.remove('is-hover-simulated');
      document.querySelector('[data-service-id="reach"]')?.classList.add('is-hover-simulated');
    })()`);
    await new Promise((r) => setTimeout(r, 650));
    await capture('shelf_zoom_card3_reach');

    // 7. Testar Abertura FLIP a partir do Hover Ampliado no Card 2
    console.log('7. Testando Abertura FLIP com o card em zoom...');
    await evalJS(`(() => {
      document.querySelector('[data-service-id="reach"]')?.classList.remove('is-hover-simulated');
      document.querySelector('[data-service-id="local"]')?.classList.add('is-hover-simulated');
    })()`);
    await new Promise((r) => setTimeout(r, 300));
    await evalJS(`document.getElementById('open-btn-local')?.click()`);
    await new Promise((r) => setTimeout(r, 1200));

    const flipFromZoomCheck = await evalJS(`(() => {
      const modal = document.getElementById('shelf-modal-overlay');
      const clone = document.getElementById('flying-card-instance');
      return {
        modalActive: modal?.classList.contains('is-active'),
        cloneRendered: !!clone,
        title: document.getElementById('modal-title')?.textContent,
      };
    })()`);
    console.log('FLIP from Zoom Check:', flipFromZoomCheck);
    await capture('shelf_modal_open_from_zoom');

    // Fechar modal
    console.log('Fechando modal...');
    await evalJS(`document.getElementById('modal-close-btn')?.click()`);
    await new Promise((r) => setTimeout(r, 900));

    // Limpar estados simulados
    await evalJS(`(() => {
      document.querySelectorAll('.shelf-card-anchor').forEach(a => a.classList.remove('is-hover-simulated'));
    })()`);

    // 8. Testar Mobile Viewport (375x812)
    console.log('8. Testando Mobile Viewport (375x812)...');
    await send('Emulation.setDeviceMetricsOverride', {
      width: 375,
      height: 812,
      deviceScaleFactor: 2,
      mobile: true,
    });
    await evalJS(`(() => {
      const s = document.getElementById('solucoes');
      if (s) s.scrollIntoView({ behavior: 'instant', block: 'center' });
    })()`);
    await new Promise((r) => setTimeout(r, 800));

    // Primeiro toque no card 1 mobile
    await evalJS(`(() => {
      const a = document.querySelector('[data-service-id="web"]');
      if (a) a.classList.add('is-touch-active');
    })()`);
    await new Promise((r) => setTimeout(r, 400));
    await capture('shelf_mobile_touch_active');

    // Clicar no botão abrir mobile
    await evalJS(`document.getElementById('open-btn-web')?.click()`);
    await new Promise((r) => setTimeout(r, 1100));
    await capture('shelf_mobile_modal_open');
    await evalJS(`document.getElementById('modal-close-btn')?.click()`);
    await new Promise((r) => setTimeout(r, 800));

    console.log('Console Errors acumulados:', consoleErrors);
    console.log('=== TESTE CONCLUÍDO COM SUCESSO ===');
  } catch (err) {
    console.error('Erro no teste:', err);
  } finally {
    ws.close();
    chrome.kill();
  }
}

runTest();
