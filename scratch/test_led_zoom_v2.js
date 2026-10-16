import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';

const ARTIFACTS_DIR = 'C:\\Users\\Kleber Gomes\\.gemini\\antigravity-ide\\brain\\a4e87674-7b63-4492-bd3c-60bbcb27495a';

async function runTest() {
  console.log('=== TESTE RIGOROSO V2: LED INFERIOR & ZOOM 3D CINEMATOGRÁFICO ===');
  const chrome = spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', [
    '--headless=new',
    '--window-size=1920,1080',
    '--remote-debugging-port=9250',
    'http://localhost:4321'
  ]);

  await new Promise((r) => setTimeout(r, 2200));
  const res = await fetch('http://localhost:9250/json/list');
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
    await new Promise((r) => setTimeout(r, 1200));

    // 3. Validar Iluminação LED Inferior da Prateleira
    console.log('3. Validando Iluminação LED Inferior...');
    const ledMetrics = await evalJS(`(() => {
      const underglow = document.querySelector('.shelf-led-underglow');
      const strip = document.querySelector('.shelf-led-strip');
      const cast = document.querySelector('.shelf-led-cast');
      const ambient = document.querySelector('.shelf-led-ambient');

      return {
        underglowHeight: getComputedStyle(underglow).height,
        stripBoxShadow: getComputedStyle(strip).boxShadow,
        castHeight: getComputedStyle(cast).height,
        castBlendMode: getComputedStyle(cast).mixBlendMode,
        ambientHeight: getComputedStyle(ambient).height,
        ambientBlendMode: getComputedStyle(ambient).mixBlendMode
      };
    })()`);
    console.log('LED Metrics:', JSON.stringify(ledMetrics, null, 2));
    await capture('test_01_shelf_led_underglow');

    // 4. Card WEB em estado normal (medição antes do hover)
    console.log('4. Medindo Card WEB em repouso...');
    const normalMetrics = await evalJS(`(() => {
      const card = document.querySelector('[data-service-id="web"] .shelf-card');
      const rect = card.getBoundingClientRect();
      return {
        width: rect.width,
        height: rect.height,
        top: rect.top,
        left: rect.left,
        transform: getComputedStyle(card).transform
      };
    })()`);
    console.log('Normal Metrics WEB:', JSON.stringify(normalMetrics, null, 2));
    await capture('test_02_card_web_normal');

    // 5. Testar Hover no Card WEB
    console.log('5. Disparando hover no Card WEB...');
    await evalJS(`(() => {
      const anchor = document.querySelector('[data-service-id="web"]');
      if (anchor && anchor.__triggerHover) anchor.__triggerHover(true);
    })()`);
    await new Promise((r) => setTimeout(r, 650));

    const webHoverMetrics = await evalJS(`(() => {
      const anchor = document.querySelector('[data-service-id="web"]');
      const card = anchor.querySelector('.shelf-card');
      const pill = anchor.querySelector('.card-open-pill-btn');
      const otherLocal = document.querySelector('[data-service-id="local"]');
      const otherReach = document.querySelector('[data-service-id="reach"]');
      const rect = card.getBoundingClientRect();

      return {
        width: rect.width,
        height: rect.height,
        top: rect.top,
        left: rect.left,
        transform: getComputedStyle(card).transform,
        zIndex: anchor.style.zIndex,
        pillOpacity: getComputedStyle(pill).opacity,
        pillPointerEvents: getComputedStyle(pill).pointerEvents,
        siblingLocalOpacity: otherLocal.style.opacity,
        siblingReachOpacity: otherReach.style.opacity
      };
    })()`);
    console.log('Hover Metrics WEB:', JSON.stringify(webHoverMetrics, null, 2));

    const widthIncreasePct = ((webHoverMetrics.width - normalMetrics.width) / normalMetrics.width) * 100;
    const heightIncreasePct = ((webHoverMetrics.height - normalMetrics.height) / normalMetrics.height) * 100;
    console.log(`>>> AUMENTO NUMÉRICO WEB: Largura +${widthIncreasePct.toFixed(2)}%, Altura +${heightIncreasePct.toFixed(2)}% <<<`);
    await capture('test_03_card_web_hover');

    // 6. Testar Hover no Card LOCAL
    console.log('6. Disparando hover no Card LOCAL...');
    await evalJS(`(() => {
      const web = document.querySelector('[data-service-id="web"]');
      if (web && web.__triggerHover) web.__triggerHover(false);
      const local = document.querySelector('[data-service-id="local"]');
      if (local && local.__triggerHover) local.__triggerHover(true);
    })()`);
    await new Promise((r) => setTimeout(r, 650));

    const localHoverMetrics = await evalJS(`(() => {
      const anchor = document.querySelector('[data-service-id="local"]');
      const card = anchor.querySelector('.shelf-card');
      const rect = card.getBoundingClientRect();
      return {
        width: rect.width,
        height: rect.height,
        transform: getComputedStyle(card).transform,
        zIndex: anchor.style.zIndex
      };
    })()`);
    console.log('Hover Metrics LOCAL:', JSON.stringify(localHoverMetrics, null, 2));
    await capture('test_04_card_local_hover');

    // 7. Testar Hover no Card REACH
    console.log('7. Disparando hover no Card REACH...');
    await evalJS(`(() => {
      const local = document.querySelector('[data-service-id="local"]');
      if (local && local.__triggerHover) local.__triggerHover(false);
      const reach = document.querySelector('[data-service-id="reach"]');
      if (reach && reach.__triggerHover) reach.__triggerHover(true);
    })()`);
    await new Promise((r) => setTimeout(r, 650));

    const reachHoverMetrics = await evalJS(`(() => {
      const anchor = document.querySelector('[data-service-id="reach"]');
      const card = anchor.querySelector('.shelf-card');
      const rect = card.getBoundingClientRect();
      return {
        width: rect.width,
        height: rect.height,
        transform: getComputedStyle(card).transform,
        zIndex: anchor.style.zIndex
      };
    })()`);
    console.log('Hover Metrics REACH:', JSON.stringify(reachHoverMetrics, null, 2));
    await capture('test_05_card_reach_hover');

    // 8. Testar Abertura FLIP a partir do Hover Ampliado
    console.log('8. Testando Abertura FLIP a partir do Card REACH ampliado...');
    await evalJS(`(() => {
      const openBtn = document.querySelector('[data-service-id="reach"] .card-open-pill-btn');
      if (openBtn) openBtn.click();
    })()`);
    await new Promise((r) => setTimeout(r, 900));

    const modalCheck = await evalJS(`(() => {
      const modal = document.getElementById('shelf-modal-overlay');
      const clone = document.getElementById('flying-card-instance');
      const title = document.getElementById('modal-title');
      return {
        modalActive: modal?.classList.contains('is-active'),
        cloneExists: !!clone,
        title: title?.textContent?.trim()
      };
    })()`);
    console.log('Modal Check:', JSON.stringify(modalCheck, null, 2));
    await capture('test_06_modal_open_from_zoom');

    // 9. Fechar modal e verificar retorno à prateleira
    console.log('9. Fechando modal via botão FECHAR...');
    await evalJS(`(() => {
      const closeBtn = document.getElementById('modal-close-btn');
      if (closeBtn) closeBtn.click();
    })()`);
    await new Promise((r) => setTimeout(r, 800));

    const afterCloseCheck = await evalJS(`(() => {
      const modal = document.getElementById('shelf-modal-overlay');
      const clone = document.getElementById('flying-card-instance');
      const reachCard = document.querySelector('[data-service-id="reach"] .shelf-card');
      return {
        modalActive: modal?.classList.contains('is-active'),
        cloneRemoved: !clone,
        cardVisible: reachCard?.style.visibility !== 'hidden',
        bodyScrollUnlocked: document.body.style.overflow === ''
      };
    })()`);
    console.log('After Close Check:', JSON.stringify(afterCloseCheck, null, 2));
    await capture('test_07_after_modal_close');

    // 10. Testar Mobile Viewport
    console.log('10. Testando Mobile Viewport (390x844)...');
    await send('Emulation.setDeviceMetricsOverride', {
      width: 390,
      height: 844,
      deviceScaleFactor: 2,
      mobile: true
    });
    await new Promise((r) => setTimeout(r, 500));

    await evalJS(`(() => {
      const s = document.getElementById('solucoes');
      if (s) s.scrollIntoView({ behavior: 'instant', block: 'center' });
    })()`);
    await new Promise((r) => setTimeout(r, 600));

    // Toque no Card WEB
    await evalJS(`(() => {
      const card = document.querySelector('[data-service-id="web"] .shelf-card');
      if (card) card.click();
    })()`);
    await new Promise((r) => setTimeout(r, 500));

    const mobileTouchCheck = await evalJS(`(() => {
      const anchor = document.querySelector('[data-service-id="web"]');
      const pill = anchor?.querySelector('.card-open-pill-btn');
      return {
        touchActive: anchor?.classList.contains('is-touch-active'),
        pillOpacity: getComputedStyle(pill).opacity
      };
    })()`);
    console.log('Mobile Touch Check:', JSON.stringify(mobileTouchCheck, null, 2));
    await capture('test_08_mobile_tap_active');

    // 2º toque no botão ABRIR para abrir modal
    await evalJS(`(() => {
      const pill = document.querySelector('[data-service-id="web"] .card-open-pill-btn');
      if (pill) pill.click();
    })()`);
    await new Promise((r) => setTimeout(r, 900));

    const mobileModalCheck = await evalJS(`(() => {
      const modal = document.getElementById('shelf-modal-overlay');
      return {
        modalActive: modal?.classList.contains('is-active')
      };
    })()`);
    console.log('Mobile Modal Check:', JSON.stringify(mobileModalCheck, null, 2));
    await capture('test_09_mobile_modal_open');

    console.log('Console Errors acumulados:', consoleErrors);
    console.log('=== TESTE CONCLUÍDO COM ÊXITO TOTAL ===');

  } catch (err) {
    console.error('Erro no teste:', err);
  } finally {
    ws.close();
    chrome.kill();
  }
}

runTest();
