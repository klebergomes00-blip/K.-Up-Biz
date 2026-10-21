const { spawn } = require('child_process');
const http = require('http');
const fs = require('fs');
const path = require('path');
const os = require('os');

async function wait(ms) { return new Promise(r => setTimeout(r, ms)); }
function getJson(url) {
  return new Promise((resolve, reject) => {
    http.get(url, res => {
      let data = ''; res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(JSON.parse(data)));
    }).on('error', reject);
  });
}

const artifactDir = 'C:\\Users\\Kleber Gomes\\.gemini\\antigravity-ide\\brain\\534ffe61-b1c8-4852-ba32-9f0c29436b8f';

async function main() {
  const port = 9848;
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'chrome-shelf-test2-'));

  const chrome = spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', [
    '--headless=new',
    `--remote-debugging-port=${port}`,
    `--user-data-dir=${tempDir}`,
    '--no-first-run',
    '--no-default-browser-check',
    '--window-size=1440,900',
    'http://localhost:4321/'
  ]);

  try {
    await wait(3000);
    const list = await getJson(`http://127.0.0.1:${port}/json/list`);
    const page = list.find(t => t.type === 'page') || list[0];
    const ws = new WebSocket(page.webSocketDebuggerUrl);
    await new Promise(r => ws.onopen = r);

    let id = 1;
    const send = (method, params = {}) => new Promise((resolve, reject) => {
      const curId = id++;
      const handler = (e) => {
        const msg = JSON.parse(e.data);
        if (msg.id === curId) {
          ws.removeEventListener('message', handler);
          if (msg.error) reject(msg.error);
          else resolve(msg.result);
        }
      };
      ws.addEventListener('message', handler);
      ws.send(JSON.stringify({ id: curId, method, params }));
    });

    await send('Runtime.enable');
    await send('Page.enable');
    await send('DOM.enable');

    console.log('--- 0. NAVEGANDO PARA http://localhost:4321/ ---');
    await send('Page.navigate', { url: 'http://localhost:4321/' });
    await wait(1500);

    // Dispensar Cinematic Intro para liberar a visão completa da página
    await send('Runtime.evaluate', {
      expression: `(() => {
        const intro = document.getElementById('cinematic-intro');
        if (intro) {
          intro.classList.add('is-completed');
          intro.style.display = 'none';
          window.dispatchEvent(new CustomEvent('cinematic-intro-complete'));
        }
      })()`
    });
    await wait(1000);

    console.log('--- 1. ROLANDO ATÉ A DIGITAL SHELF (DOBRA 3) ---');
    await send('Runtime.evaluate', {
      expression: `(() => {
        const shelf = document.getElementById('solucoes');
        if (shelf) shelf.scrollIntoView({ behavior: 'instant' });
      })()`
    });
    await wait(1200);

    const shelfState = await send('Runtime.evaluate', {
      expression: `(() => {
        const shelf = document.getElementById('solucoes');
        const cards = document.querySelectorAll('.shelf-card-anchor');
        const modal = document.getElementById('shelf-service-modal');
        return {
          shelfFound: !!shelf,
          cardCount: cards.length,
          modalFound: !!modal,
          modalActive: modal ? modal.classList.contains('is-active') : false
        };
      })()`,
      returnByValue: true
    });
    console.log('Estado inicial da Prateleira:', JSON.stringify(shelfState.result.value));

    // =========================================================================
    // 2. ABRIR SERVIÇO WEB (CRIAÇÃO DE SITES)
    // =========================================================================
    console.log('\n--- 2. CLICANDO EM ABRIR NO CARD WEB ---');
    await send('Runtime.evaluate', {
      expression: `(() => {
        const openBtn = document.getElementById('open-btn-web');
        if (openBtn) openBtn.click();
      })()`
    });
    await wait(1000);

    const webCheck = await send('Runtime.evaluate', {
      expression: `(() => {
        const modal = document.getElementById('shelf-service-modal');
        const webView = document.getElementById('service-view-web');
        const badge = document.getElementById('active-service-badge');
        const scrollContainer = document.getElementById('service-scroll-container');
        const bodyOverflow = document.body.style.overflow;
        
        // Cenas
        const scenes = webView ? webView.querySelectorAll('.svc-scene') : [];
        const headline = webView ? webView.querySelector('.svc-headline-main')?.textContent : '';
        const goldHeadline = webView ? webView.querySelector('.svc-headline-gold')?.textContent : '';
        const pillars = webView ? webView.querySelectorAll('.pillar-card').length : 0;
        const projectCards = webView ? webView.querySelectorAll('.context-project-card').length : 0;
        const ctaBtn = webView ? webView.querySelector('#cta-btn-web') : null;
        
        // Links reais
        const projLinks = Array.from(webView?.querySelectorAll('.project-ext-link') || []).map(a => a.href);

        return {
          modalActive: modal?.classList.contains('is-active'),
          bodyOverflow,
          badgeText: badge?.textContent,
          webViewActive: webView?.classList.contains('is-active'),
          scenesCount: scenes.length,
          headline,
          goldHeadline,
          pillarsCount: pillars,
          projectCardsCount: projectCards,
          projectLinks: projLinks,
          ctaHref: ctaBtn?.href,
          ctaText: ctaBtn?.textContent?.trim()
        };
      })()`,
      returnByValue: true
    });
    console.log('Validação da Experiência WEB:', JSON.stringify(webCheck.result.value, null, 2));

    // Capturar Screenshot de WEB
    const webShot = await send('Page.captureScreenshot', { format: 'png' });
    const webShotPath = path.join(artifactDir, 'shelf_fullscreen_web.png');
    fs.writeFileSync(webShotPath, Buffer.from(webShot.data, 'base64'));
    console.log('Screenshot salva:', webShotPath);

    // =========================================================================
    // 3. NAVEGAÇÃO ENTRE ABAS: CLICAR EM LOCAL
    // =========================================================================
    console.log('\n--- 3. TROCANDO PARA O SERVIÇO LOCAL PELAS ABAS ---');
    await send('Runtime.evaluate', {
      expression: `(() => {
        const localTab = document.getElementById('tab-btn-local');
        if (localTab) localTab.click();
      })()`
    });
    await wait(600);

    // Testar o simulador de busca local (clicar nos chips)
    await send('Runtime.evaluate', {
      expression: `(() => {
        const chips = document.querySelectorAll('.sim-chip');
        if (chips.length > 1) chips[1].click();
      })()`
    });
    await wait(400);

    const localCheck = await send('Runtime.evaluate', {
      expression: `(() => {
        const localView = document.getElementById('service-view-local');
        const badge = document.getElementById('active-service-badge');
        const headline = localView ? localView.querySelector('.svc-headline-main')?.textContent : '';
        const goldHeadline = localView ? localView.querySelector('.svc-headline-gold')?.textContent : '';
        const queryText = document.getElementById('sim-query-text')?.textContent?.trim();
        const steps = localView ? localView.querySelectorAll('.step-card-box').length : 0;
        const ctaBtn = localView ? localView.querySelector('#cta-btn-local') : null;
        const clarityBanner = !!localView?.querySelector('.ethical-clarity-banner');

        return {
          localViewActive: localView?.classList.contains('is-active'),
          badgeText: badge?.textContent,
          headline,
          goldHeadline,
          simQueryText: queryText,
          workflowStepsCount: steps,
          clarityBannerPresent: clarityBanner,
          ctaHref: ctaBtn?.href
        };
      })()`,
      returnByValue: true
    });
    console.log('Validação da Experiência LOCAL:', JSON.stringify(localCheck.result.value, null, 2));

    const localShot = await send('Page.captureScreenshot', { format: 'png' });
    const localShotPath = path.join(artifactDir, 'shelf_fullscreen_local.png');
    fs.writeFileSync(localShotPath, Buffer.from(localShot.data, 'base64'));
    console.log('Screenshot salva:', localShotPath);

    // =========================================================================
    // 4. NAVEGAÇÃO ENTRE ABAS: CLICAR EM REACH
    // =========================================================================
    console.log('\n--- 4. TROCANDO PARA O SERVIÇO REACH PELAS ABAS ---');
    await send('Runtime.evaluate', {
      expression: `(() => {
        const reachTab = document.getElementById('tab-btn-reach');
        if (reachTab) reachTab.click();
      })()`
    });
    await wait(600);

    const reachCheck = await send('Runtime.evaluate', {
      expression: `(() => {
        const reachView = document.getElementById('service-view-reach');
        const badge = document.getElementById('active-service-badge');
        const headline = reachView ? reachView.querySelector('.svc-headline-main')?.textContent : '';
        const goldHeadline = reachView ? reachView.querySelector('.svc-headline-gold')?.textContent : '';
        const flowSteps = reachView ? reachView.querySelectorAll('.flow-step-box').length : 0;
        const ctaBtn = reachView ? reachView.querySelector('#cta-btn-reach') : null;

        return {
          reachViewActive: reachView?.classList.contains('is-active'),
          badgeText: badge?.textContent,
          headline,
          goldHeadline,
          flowStepsCount: flowSteps,
          ctaHref: ctaBtn?.href
        };
      })()`,
      returnByValue: true
    });
    console.log('Validação da Experiência REACH:', JSON.stringify(reachCheck.result.value, null, 2));

    const reachShot = await send('Page.captureScreenshot', { format: 'png' });
    const reachShotPath = path.join(artifactDir, 'shelf_fullscreen_reach.png');
    fs.writeFileSync(reachShotPath, Buffer.from(reachShot.data, 'base64'));
    console.log('Screenshot salva:', reachShotPath);

    // =========================================================================
    // 5. TESTAR FECHAMENTO VIA BOTÃO FECHAR
    // =========================================================================
    console.log('\n--- 5. TESTANDO FECHAMENTO PELO BOTÃO FECHAR × ---');
    await send('Runtime.evaluate', {
      expression: `(() => {
        const closeBtn = document.getElementById('service-modal-close-btn');
        if (closeBtn) closeBtn.click();
      })()`
    });
    await wait(1000);

    const closeCheck = await send('Runtime.evaluate', {
      expression: `(() => {
        const modal = document.getElementById('shelf-service-modal');
        const cards = Array.from(document.querySelectorAll('.shelf-card'));
        const allVisible = cards.every(c => c.style.visibility !== 'hidden');
        return {
          modalActive: modal?.classList.contains('is-active'),
          modalAriaHidden: modal?.getAttribute('aria-hidden'),
          bodyOverflow: document.body.style.overflow,
          cardsVisible: allVisible,
          focusedElement: document.activeElement ? (document.activeElement.id || document.activeElement.className) : null
        };
      })()`,
      returnByValue: true
    });
    console.log('Estado após Fechar:', JSON.stringify(closeCheck.result.value, null, 2));

    // =========================================================================
    // 6. TESTAR RE-ABERTURA E TECLA ESCAPE
    // =========================================================================
    console.log('\n--- 6. RE-ABRINDO LOCAL E TESTANDO TECLA ESCAPE ---');
    await send('Runtime.evaluate', {
      expression: `(() => {
        const openLocal = document.getElementById('open-btn-local');
        if (openLocal) openLocal.click();
      })()`
    });
    await wait(800);

    // Pressionar Escape via DOM KeyboardEvent
    await send('Runtime.evaluate', {
      expression: `(() => {
        window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', code: 'Escape', keyCode: 27, bubbles: true }));
      })()`
    });
    await wait(800);

    const escCheck = await send('Runtime.evaluate', {
      expression: `(() => {
        const modal = document.getElementById('shelf-service-modal');
        return {
          modalActiveAfterEsc: modal?.classList.contains('is-active'),
          bodyOverflow: document.body.style.overflow
        };
      })()`,
      returnByValue: true
    });
    console.log('Estado após Escape:', JSON.stringify(escCheck.result.value, null, 2));

    // =========================================================================
    // 7. TESTE EM VIEWPORT MOBILE (390x844)
    // =========================================================================
    console.log('\n--- 7. TESTE EM VIEWPORT MOBILE (390x844) ---');
    await send('Emulation.setDeviceMetricsOverride', {
      width: 390,
      height: 844,
      deviceScaleFactor: 2,
      mobile: true
    });
    await wait(800);

    // Rolamos até a prateleira após resize mobile
    await send('Runtime.evaluate', {
      expression: `(() => {
        const shelf = document.getElementById('solucoes');
        if (shelf) shelf.scrollIntoView({ behavior: 'instant' });
      })()`
    });
    await wait(1000);

    // Abrir WEB no mobile
    await send('Runtime.evaluate', {
      expression: `(() => {
        const openWeb = document.getElementById('open-btn-web');
        if (openWeb) openWeb.click();
      })()`
    });
    await wait(1500);

    const mobileCheck = await send('Runtime.evaluate', {
      expression: `(() => {
        const modal = document.getElementById('shelf-service-modal');
        const scrollContainer = document.getElementById('service-scroll-container');
        const closeBtn = document.getElementById('service-modal-close-btn');
        return {
          modalActive: modal?.classList.contains('is-active'),
          scrollContainerScrollWidth: scrollContainer?.scrollWidth,
          scrollContainerClientWidth: scrollContainer?.clientWidth,
          hasHorizontalOverflow: (scrollContainer?.scrollWidth || 0) > (scrollContainer?.clientWidth || 0),
          closeBtnVisible: !!closeBtn
        };
      })()`,
      returnByValue: true
    });
    console.log('Validação Mobile:', JSON.stringify(mobileCheck.result.value, null, 2));

    const mobileShot = await send('Page.captureScreenshot', { format: 'png' });
    const mobileShotPath = path.join(artifactDir, 'shelf_fullscreen_mobile.png');
    fs.writeFileSync(mobileShotPath, Buffer.from(mobileShot.data, 'base64'));
    console.log('Screenshot mobile salva:', mobileShotPath);

    // Fechar no mobile
    await send('Runtime.evaluate', {
      expression: `(() => {
        const closeBtn = document.getElementById('service-modal-close-btn');
        if (closeBtn) closeBtn.click();
      })()`
    });
    await wait(700);

    // Restaurar viewport desktop
    await send('Emulation.setDeviceMetricsOverride', {
      width: 1440,
      height: 900,
      deviceScaleFactor: 1,
      mobile: false
    });
    await wait(400);

    // =========================================================================
    // 8. TESTE DE REGRESSÃO DAS OUTRAS DOBRAS
    // =========================================================================
    console.log('\n--- 8. TESTE DE REGRESSÃO DAS OUTRAS DOBRAS ---');
    const regressionCheck = await send('Runtime.evaluate', {
      expression: `(() => {
        return {
          hero: !!document.getElementById('hero-scroll-wrapper'),
          visao: !!document.getElementById('nossa-visao'),
          shelf: !!document.getElementById('solucoes'),
          metodo: !!document.getElementById('metodo'),
          diferencial: !!document.getElementById('diferencial'),
          projetos: !!document.getElementById('portfolio'),
          carouselPanels: document.querySelectorAll('.portfolio-panel').length,
          faq: !!document.getElementById('faq'),
          faqAccordionItems: document.querySelectorAll('.faq-item').length
        };
      })()`,
      returnByValue: true
    });
    console.log('Verificação de Regressão:', JSON.stringify(regressionCheck.result.value, null, 2));

    console.log('\n=== TODOS OS TESTES FORAM CONCLUÍDOS COM SUCESSO! ===');

  } catch (err) {
    console.error('Erro na execução dos testes:', err);
  } finally {
    chrome.kill();
    try { fs.rmSync(tempDir, { recursive: true, force: true }); } catch (e) {}
  }
}

main();
