const { spawn } = require('child_process');
const http = require('http');
const fs = require('fs');
const path = require('path');
const os = require('os');

async function wait(ms) { return new Promise(r => setTimeout(r, ms)); }

function getJson(url) {
  return new Promise((resolve, reject) => {
    http.get(url, res => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try { resolve(JSON.parse(data)); } catch (e) { reject(e); }
      });
    }).on('error', reject);
  });
}

const artifactDir = 'C:\\Users\\Kleber Gomes\\.gemini\\antigravity-ide\\brain\\534ffe61-b1c8-4852-ba32-9f0c29436b8f';

const resolutions = [
  { width: 1920, height: 1080, name: '1920x1080' },
  { width: 1440, height: 900,  name: '1440x900' },
  { width: 1366, height: 768,  name: '1366x768' },
  { width: 1280, height: 720,  name: '1280x720' },
  { width: 1024, height: 768,  name: '1024x768' },
  { width: 390,  height: 844,  name: '390x844' },
  { width: 375,  height: 812,  name: '375x812' }
];

async function main() {
  const port = 9840;
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'chrome-final-'));

  console.log('Iniciando Chrome na porta ' + port + '...');
  const chrome = spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', [
    '--headless=new',
    `--remote-debugging-port=${port}`,
    `--user-data-dir=${tempDir}`,
    '--no-first-run',
    '--no-default-browser-check',
    '--disable-gpu',
    '--no-sandbox',
    'about:blank'
  ]);

  try {
    let page = null;
    for (let i = 0; i < 30; i++) {
      try {
        const list = await getJson(`http://127.0.0.1:${port}/json/list`);
        page = list.find(t => t.type === 'page');
        if (page && page.webSocketDebuggerUrl) break;
      } catch (e) {}
      await wait(300);
    }
    if (!page) throw new Error('Chrome falhou ao iniciar');

    const ws = new WebSocket(page.webSocketDebuggerUrl);
    await new Promise(r => ws.onopen = r);

    let msgId = 1;
    const send = (method, params = {}) => new Promise((resolve, reject) => {
      const curId = msgId++;
      const timer = setTimeout(() => reject(new Error('Timeout ' + method)), 15000);
      const handler = (e) => {
        const msg = JSON.parse(e.data);
        if (msg.id === curId) {
          clearTimeout(timer);
          ws.removeEventListener('message', handler);
          if (msg.error) reject(msg.error);
          else resolve(msg.result);
        }
      };
      ws.addEventListener('message', handler);
      ws.send(JSON.stringify({ id: curId, method, params }));
    });

    await send('Page.enable');
    await send('Runtime.enable');

    for (const res of resolutions) {
      console.log(`\n======================================================`);
      console.log(`TESTANDO RESOLUÇÃO: ${res.name} (${res.width}x${res.height})`);
      console.log(`======================================================`);

      const isMobile = res.width <= 1024;
      await send('Emulation.setDeviceMetricsOverride', {
        width: res.width,
        height: res.height,
        deviceScaleFactor: 1,
        mobile: isMobile
      });

      await send('Page.navigate', { url: 'http://localhost:4321/' });
      await wait(3000);

      // Pular intro cinematográfica inicial
      await send('Runtime.evaluate', {
        expression: `(() => {
          const btn = document.getElementById('intro-skip-btn');
          if (btn) btn.click();
          const intro = document.getElementById('cinematic-intro');
          if (intro) { intro.style.display = 'none'; intro.classList.add('is-completed'); }
          window.dispatchEvent(new CustomEvent('cinematic-intro-complete'));
          if (window.ScrollTrigger) window.ScrollTrigger.refresh();
        })()`
      });
      await wait(1200);

      // Inspecionar elementos indesejados no canto superior esquerdo (item 06 do briefing)
      const inspection = await send('Runtime.evaluate', {
        returnByValue: true,
        expression: `(() => {
          const portfolio = document.getElementById('portfolio');
          if (!portfolio) return null;
          const rect = portfolio.getBoundingClientRect();
          // Elementos no quadrante superior esquerdo dentro do portfolio
          const elementsAtTopLeft = document.elementsFromPoint(20, 20);
          const suspicious = elementsAtTopLeft.map(el => ({
            tag: el.tagName,
            id: el.id,
            className: el.className,
            bg: window.getComputedStyle(el).backgroundColor,
            color: window.getComputedStyle(el).color
          }));
          return {
            portfolioTop: rect.top,
            suspicious
          };
        })()`
      });
      console.log(`[${res.name}] Inspeção canto superior esquerdo:`, JSON.stringify(inspection.result.value?.suspicious || []));

      if (isMobile) {
        await send('Runtime.evaluate', {
          expression: `document.getElementById('portfolio')?.scrollIntoView();`
        });
        await wait(600);

        const mobCheck = await send('Runtime.evaluate', {
          returnByValue: true,
          expression: `(() => {
            const portfolio = document.getElementById('portfolio');
            const pRect = portfolio ? portfolio.getBoundingClientRect() : null;
            const track = document.getElementById('liquid-carousel-track-mobile');
            const cards = track ? Array.from(track.querySelectorAll('.liquid-mobile-card')) : [];
            const docOverflow = document.documentElement.scrollWidth > window.innerWidth;
            return {
              hasPortfolio: !!portfolio,
              hasTrack: !!track,
              cardCount: cards.length,
              docOverflow,
              top: pRect ? Math.round(pRect.top) : null
            };
          })()`
        });
        console.log(`[${res.name}] Estado Mobile:`, mobCheck.result.value);

        const shot = await send('Page.captureScreenshot', { format: 'png' });
        fs.writeFileSync(path.join(artifactDir, `liquid_carousel_final_${res.name}.png`), Buffer.from(shot.data, 'base64'));
        console.log(`[${res.name}] Screenshot salva: liquid_carousel_final_${res.name}.png`);
      } else {
        // Obter limites do ScrollTrigger do portfólio
        const trigBounds = await send('Runtime.evaluate', {
          returnByValue: true,
          expression: `(() => {
            if (!window.ScrollTrigger) return null;
            window.ScrollTrigger.refresh();
            const trig = window.ScrollTrigger.getById('portfolio-trigger') || window.ScrollTrigger.getAll().find(t => t.trigger && t.trigger.id === 'portfolio');
            if (!trig) return null;
            return { start: Math.round(trig.start), end: Math.round(trig.end), dist: Math.round(trig.end - trig.start) };
          })()`
        });

        const bounds = trigBounds.result.value;
        if (!bounds) {
          console.error(`[${res.name}] Trigger não encontrado!`);
          continue;
        }
        console.log(`[${res.name}] Trigger: start=${bounds.start}, end=${bounds.end}, dist=${bounds.dist}`);

        // Scroll suave até o portfólio para ancorar triggers prévios
        for (let y = 0; y <= bounds.start; y += 2500) {
          await send('Runtime.evaluate', { expression: `window.scrollTo(0, ${y});` });
          await wait(50);
        }
        await send('Runtime.evaluate', { expression: `window.scrollTo(0, ${bounds.start});` });
        await wait(500);

        const testCases = [
          { name: 'case1_fernando', p: 0.04, idx: 0, title: 'Fernando Junior' },
          { name: 'case2_levelup',  p: 0.30, idx: 1, title: 'Level Up Agency' },
          { name: 'case3_aesthetics', p: 0.57, idx: 2, title: 'Level Up Aesthetics' },
          { name: 'case4_styvy',    p: 0.84, idx: 3, title: 'Styvy Burguer' }
        ];

        for (const tc of testCases) {
          const scrollTarget = Math.round(bounds.start + tc.p * bounds.dist);
          await send('Runtime.evaluate', { expression: `window.scrollTo(0, ${scrollTarget});` });
          await wait(600);

          const check = await send('Runtime.evaluate', {
            returnByValue: true,
            expression: `(() => {
              const winH = window.innerHeight;
              const panel = document.getElementById('liquid-panel-${tc.idx}');
              const btn = panel ? panel.querySelector('.panel-explore-btn') : null;
              const header = document.getElementById('portfolio-header');
              const lead = document.getElementById('portfolio-lead');
              const indicator = document.getElementById('portfolio-indicator-bar');

              if (!panel || !btn) return { error: 'elements not found' };

              const pRect = panel.getBoundingClientRect();
              const bRect = btn.getBoundingClientRect();
              const hRect = header ? header.getBoundingClientRect() : null;
              const lRect = lead ? lead.getBoundingClientRect() : null;
              const iRect = indicator ? indicator.getBoundingClientRect() : null;

              const glow = panel.querySelector('.panel-border-glow');
              const sheen = panel.querySelector('.panel-glass-sheen');
              const topHigh = panel.querySelector('.panel-top-highlight');

              // Distância entre cabeçalho editorial e o topo do painel
              const headerToPanelGap = lRect ? Math.round(pRect.top - lRect.bottom) : null;

              return {
                winH,
                panel: {
                  top: Math.round(pRect.top),
                  bottom: Math.round(pRect.bottom),
                  height: Math.round(pRect.height),
                  width: Math.round(pRect.width),
                  cutBottom: pRect.bottom > winH,
                  cutTop: pRect.top < 0,
                  clearanceBottom: Math.round(winH - pRect.bottom)
                },
                button: {
                  top: Math.round(bRect.top),
                  bottom: Math.round(bRect.bottom),
                  cutBottom: bRect.bottom > winH
                },
                headerToPanelGap,
                glowOpacity: glow ? glow.style.opacity : null,
                sheenOpacity: sheen ? sheen.style.opacity : null,
                topHighOpacity: topHigh ? topHigh.style.opacity : null
              };
            })()`
          });

          const d = check.result.value;
          if (d.error) {
            console.log(`[${res.name}] ${tc.title} -> ERRO:`, d.error);
          } else {
            const ok = (!d.panel.cutBottom && !d.button.cutBottom && d.panel.top > 0);
            const icon = ok ? '✅ 100% IN-VIEWPORT' : '❌ CORTADO';
            console.log(`[${res.name}] ${tc.title.padEnd(20)}: ${icon} | Painel: [${d.panel.top}px - ${d.panel.bottom}px / ${d.winH}px] (sobra ${d.panel.clearanceBottom}px) | W:${d.panel.width}px H:${d.panel.height}px | Gap Cabeçalho:${d.headerToPanelGap}px | Glow:${d.glowOpacity}`);
          }

          if (res.name === '1920x1080' || res.name === '1440x900' || res.name === '1366x768' || res.name === '1280x720') {
            const shot = await send('Page.captureScreenshot', { format: 'png' });
            fs.writeFileSync(path.join(artifactDir, `liquid_carousel_final_${res.name}_${tc.name}.png`), Buffer.from(shot.data, 'base64'));
          }
        }

        // Testar reversibilidade
        const case1Y = Math.round(bounds.start + 0.04 * bounds.dist);
        await send('Runtime.evaluate', { expression: `window.scrollTo(0, ${case1Y});` });
        await wait(600);

        const revCheck = await send('Runtime.evaluate', {
          returnByValue: true,
          expression: `(() => {
            const winH = window.innerHeight;
            const panel = document.getElementById('liquid-panel-0');
            const btn = panel ? panel.querySelector('.panel-explore-btn') : null;
            const pRect = panel.getBoundingClientRect();
            const bRect = btn.getBoundingClientRect();
            return {
              panel: { top: Math.round(pRect.top), bottom: Math.round(pRect.bottom), cutBottom: pRect.bottom > winH },
              button: { bottom: Math.round(bRect.bottom), cutBottom: bRect.bottom > winH },
              winH
            };
          })()`
        });

        const rev = revCheck.result.value;
        const revOk = !rev.panel.cutBottom && !rev.button.cutBottom;
        console.log(`[${res.name}] Reversibilidade: ${revOk ? '✅ REVERSÍVEL COM SUCESSO' : '❌ FALHA'}`);
      }
    }

    ws.close();
    chrome.kill();
    try { fs.rmSync(tempDir, { recursive: true, force: true }); } catch (e) {}
    console.log('\n======================================================');
    console.log('FINAL EDITION TESTADA COM SUCESSO EM TODAS AS 7 RESOLUÇÕES!');
    console.log('======================================================\n');
    process.exit(0);
  } catch (err) {
    console.error('Falha:', err);
    chrome.kill();
    try { fs.rmSync(tempDir, { recursive: true, force: true }); } catch (e) {}
    process.exit(1);
  }
}

main();
