import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';

const ARTIFACTS_DIR = 'C:\\Users\\Kleber Gomes\\.gemini\\antigravity-ide\\brain\\a4e87674-7b63-4492-bd3c-60bbcb27495a';

async function runTest() {
  console.log('=== TESTE DE ANIMAÇÕES SVG PREMIUM — DIGITAL SHELF ===');
  const chrome = spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', [
    '--headless=new',
    '--window-size=1920,1080',
    '--remote-debugging-port=9245',
    'http://localhost:4321'
  ]);

  await new Promise((r) => setTimeout(r, 2200));
  const res = await fetch('http://localhost:9245/json/list');
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

    // 2. Rolar até a terceira dobra #solucoes
    console.log('2. Rolando até a terceira dobra #solucoes...');
    await evalJS(`(() => {
      const s = document.getElementById('solucoes');
      if (s) {
        s.scrollIntoView({ behavior: 'instant', block: 'center' });
        s.classList.add('is-shelf-visible');
      }
    })()`);
    await new Promise((r) => setTimeout(r, 1000));

    // 3. Inspecionar estrutura SVG interna dos três cards
    console.log('3. Inspecionando estrutura interna dos 3 SVGs...');
    const svgInspection = await evalJS(`(() => {
      const webSvg = document.querySelector('.card-logo-web');
      const localSvg = document.querySelector('.card-logo-local');
      const reachSvg = document.querySelector('.card-logo-reach');

      return {
        web: {
          exists: !!webSvg,
          viewBox: webSvg?.getAttribute('viewBox'),
          hasBorderSheen: !!webSvg?.querySelector('.svg-web-border-sheen'),
          hasDots: webSvg?.querySelectorAll('.svg-web-dot').length,
          hasCodeGroup: !!webSvg?.querySelector('.svg-web-code-sheen-group'),
          codeLeft: !!webSvg?.querySelector('.svg-web-code-left'),
          codeSlash: !!webSvg?.querySelector('.svg-web-code-slash'),
          codeRight: !!webSvg?.querySelector('.svg-web-code-right'),
          borderAnimation: getComputedStyle(webSvg?.querySelector('.svg-web-border-sheen') || document.body).animationName,
          dot1Animation: getComputedStyle(webSvg?.querySelector('.svg-web-dot-1') || document.body).animationName,
          codeSweepAnimation: getComputedStyle(webSvg?.querySelector('.svg-web-code-left') || document.body).animationName,
        },
        local: {
          exists: !!localSvg,
          viewBox: localSvg?.getAttribute('viewBox'),
          ripplesCount: localSvg?.querySelectorAll('.svg-local-ripple').length,
          hasPin: !!localSvg?.querySelector('.svg-local-pin'),
          hasStar: !!localSvg?.querySelector('.svg-local-star'),
          hasBase: !!localSvg?.querySelector('.svg-local-base'),
          ripple1Animation: getComputedStyle(localSvg?.querySelector('.svg-local-ripple-1') || document.body).animationName,
          starAnimation: getComputedStyle(localSvg?.querySelector('.svg-local-star') || document.body).animationName,
        },
        reach: {
          exists: !!reachSvg,
          viewBox: reachSvg?.getAttribute('viewBox'),
          barsCount: reachSvg?.querySelectorAll('.svg-reach-bar').length,
          hasTrajectory: !!reachSvg?.querySelector('.svg-reach-trajectory'),
          hasArrow: !!reachSvg?.querySelector('.svg-reach-arrow'),
          hasArrowSheen: !!reachSvg?.querySelector('.svg-reach-arrow-sheen'),
          hasParticle: !!reachSvg?.querySelector('.svg-reach-particle'),
          hasAnimateMotion: !!reachSvg?.querySelector('animateMotion'),
          bar1Animation: getComputedStyle(reachSvg?.querySelector('.svg-reach-bar-1') || document.body).animationName,
          arrowSheenAnimation: getComputedStyle(reachSvg?.querySelector('.svg-reach-arrow-sheen') || document.body).animationName,
        }
      };
    })()`);

    console.log('Inspeção dos SVGs:', JSON.stringify(svgInspection, null, 2));

    await capture('shelf_svg_normal_state');

    // 4. Testar Hover no Card Web
    console.log('4. Testando Hover no Card Web (Construção Digital)...');
    await evalJS(`(() => {
      const a = document.querySelector('[data-service-id="web"]');
      if (a) a.classList.add('is-hover-simulated');
    })()`);
    await new Promise((r) => setTimeout(r, 600));
    await capture('shelf_svg_hover_web');

    // 5. Testar Hover no Card Local
    console.log('5. Testando Hover no Card Local (Descoberta)...');
    await evalJS(`(() => {
      document.querySelector('[data-service-id="web"]')?.classList.remove('is-hover-simulated');
      document.querySelector('[data-service-id="local"]')?.classList.add('is-hover-simulated');
    })()`);
    await new Promise((r) => setTimeout(r, 600));
    await capture('shelf_svg_hover_local');

    // 6. Testar Hover no Card Reach
    console.log('6. Testando Hover no Card Reach (Crescimento)...');
    await evalJS(`(() => {
      document.querySelector('[data-service-id="local"]')?.classList.remove('is-hover-simulated');
      document.querySelector('[data-service-id="reach"]')?.classList.add('is-hover-simulated');
    })()`);
    await new Promise((r) => setTimeout(r, 600));
    await capture('shelf_svg_hover_reach');

    // Limpar simulação de hover
    await evalJS(`(() => {
      document.querySelectorAll('.shelf-card-anchor').forEach(a => a.classList.remove('is-hover-simulated'));
    })()`);

    // 7. Testar Abertura FLIP do Card Web
    console.log('7. Abrindo Card Web...');
    await evalJS(`document.getElementById('open-btn-web')?.click()`);
    await new Promise((r) => setTimeout(r, 1200));

    const modalWebCheck = await evalJS(`(() => {
      const modal = document.getElementById('shelf-modal-overlay');
      const clone = document.getElementById('flying-card-instance');
      const cloneSvg = clone?.querySelector('.card-logo-web');
      const hasDuplicateId = !!document.querySelectorAll('#grad-shelf-web').length > 1;
      return {
        modalActive: modal?.classList.contains('is-active'),
        cloneExists: !!clone,
        cloneSvgExists: !!cloneSvg,
        hasDuplicateId,
        title: document.getElementById('modal-title')?.textContent,
      };
    })()`);
    console.log('Modal Web Check:', modalWebCheck);
    await capture('shelf_svg_modal_web_open');

    // Fechar modal
    console.log('Fechando modal...');
    await evalJS(`document.getElementById('modal-close-btn')?.click()`);
    await new Promise((r) => setTimeout(r, 900));

    // 8. Testar Abertura FLIP do Card Local
    console.log('8. Abrindo Card Local...');
    await evalJS(`document.getElementById('open-btn-local')?.click()`);
    await new Promise((r) => setTimeout(r, 1200));
    await capture('shelf_svg_modal_local_open');
    await evalJS(`document.getElementById('modal-close-btn')?.click()`);
    await new Promise((r) => setTimeout(r, 900));

    // 9. Testar Abertura FLIP do Card Reach
    console.log('9. Abrindo Card Reach...');
    await evalJS(`document.getElementById('open-btn-reach')?.click()`);
    await new Promise((r) => setTimeout(r, 1200));
    await capture('shelf_svg_modal_reach_open');
    await evalJS(`document.getElementById('modal-close-btn')?.click()`);
    await new Promise((r) => setTimeout(r, 900));

    // 10. Testar prefers-reduced-motion
    console.log('10. Testando prefers-reduced-motion...');
    await send('Emulation.setEmulatedMedia', {
      features: [{ name: 'prefers-reduced-motion', value: 'reduce' }]
    });
    await new Promise((r) => setTimeout(r, 500));
    const reducedMotionCheck = await evalJS(`(() => {
      const webBorder = document.querySelector('.svg-web-border-sheen');
      const reachParticle = document.querySelector('.svg-reach-particle');
      return {
        borderDisplay: getComputedStyle(webBorder || document.body).display,
        particleAnimation: getComputedStyle(reachParticle || document.body).animationName,
      };
    })()`);
    console.log('Reduced Motion Check:', reducedMotionCheck);

    // 11. Testar Mobile Viewport (375x812)
    console.log('11. Testando Mobile Viewport (375x812)...');
    await send('Emulation.setDeviceMetricsOverride', {
      width: 375,
      height: 812,
      deviceScaleFactor: 2,
      mobile: true,
    });
    await send('Emulation.setEmulatedMedia', { features: [] }); // reset reduced motion
    await evalJS(`(() => {
      const s = document.getElementById('solucoes');
      if (s) s.scrollIntoView({ behavior: 'instant', block: 'center' });
    })()`);
    await new Promise((r) => setTimeout(r, 800));
    await capture('shelf_svg_mobile_view');

    console.log('Console Errors acumulados:', consoleErrors);
    console.log('=== TESTE CONCLUÍDO COM SUCESSO ===');
  } catch (err) {
    console.error('Erro durante o teste:', err);
  } finally {
    ws.close();
    chrome.kill();
  }
}

runTest();
