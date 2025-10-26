// script.js
document.addEventListener('DOMContentLoaded', () => {
  // Set "from"
  const fromEl = document.getElementById('from');
  if (fromEl) fromEl.textContent = 'Mahra';

  // ===== Confetti =====
  (function(){
    const BASE_SPEED = 1.5, IS_MOBILE = /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
    const SPEED = BASE_SPEED * (IS_MOBILE ? 1.6 : 1), TWO_PI = Math.PI * 2;
    const canvas = document.getElementById('confetti'), ctx = canvas.getContext('2d');
    let w,h,particles=[],running=false,onDoneCb=null;
    function resize(){ w = canvas.width = window.innerWidth; h = canvas.height = window.innerHeight; }
    window.addEventListener('resize', resize); resize();
    const rand=(min,max)=>Math.random()*(max-min)+min;
    
    function spawnFalling(n = IS_MOBILE ? 160 : 220){
      particles.length = 0;
      for(let i=0;i<n;i++){
        particles.push({ 
          x:rand(0,w), y:-10, r:rand(4,8),
          vx:rand(-0.5,0.5)*SPEED, vy:rand(1.0,2.2)*SPEED,
          rot:rand(0,TWO_PI), rotSpd:rand(-0.05,0.05)*SPEED,
          col:`hsl(${Math.floor(rand(0,360))} 90% 60%)`,
          shape: Math.random()<0.5?'rect':'circ',
          gravity: 0.01*SPEED
        });
      }
    }

    function spawnBurst(x, y, n = IS_MOBILE ? 200 : 280){
      particles.length = 0;
      for(let i=0;i<n;i++){
        const angle = rand(0, TWO_PI);
        const velocity = rand(3, 8) * SPEED;
        particles.push({ 
          x: x, 
          y: y, 
          r:rand(4,8),
          vx: Math.cos(angle) * velocity,
          vy: Math.sin(angle) * velocity - rand(1, 3) * SPEED,
          rot:rand(0,TWO_PI), 
          rotSpd:rand(-0.08,0.08)*SPEED,
          col:`hsl(${Math.floor(rand(0,360))} 90% 60%)`,
          shape: Math.random()<0.5?'rect':'circ',
          gravity: 0.015*SPEED
        });
      }
    }

    let lastTime = 0;
    function step(now){
      if(!running) return;
      if(!lastTime) lastTime = now;
      let dt = (now - lastTime) / (1000/60); dt = Math.min(dt, 3); lastTime = now;
      ctx.clearRect(0,0,w,h); let alive=false;
      
      for(const p of particles){
        p.x += p.vx*dt; p.y += p.vy*dt; p.rot += p.rotSpd*dt; p.vy += p.gravity*dt;
        if(p.y < h + 30) alive = true;
        ctx.save(); ctx.translate(p.x,p.y); ctx.rotate(p.rot); ctx.fillStyle=p.col;
        if(p.shape==='rect'){ ctx.fillRect(-p.r,-p.r,p.r*2,p.r*2*0.6); }
        else { ctx.beginPath(); ctx.arc(0,0,p.r,0,Math.PI*2); ctx.fill(); }
        ctx.restore();
      }
      if(alive){ requestAnimationFrame(step); }
      else { running=false; const cb=onDoneCb; onDoneCb=null; if(typeof cb==='function') cb(); }
    }
    
    window.Confetti = {
      burst({count,onDone} = {}){ 
        if(running) return; 
        running=true; 
        onDoneCb=onDone||null; 
        spawnFalling(count??undefined); 
        lastTime=0; 
        requestAnimationFrame(step); 
      },
      burstFrom({x, y, count, onDone} = {}){
        if(running) return; 
        running=true; 
        onDoneCb=onDone||null; 
        spawnBurst(x, y, count??undefined); 
        lastTime=0; 
        requestAnimationFrame(step);
      }
    };
  })();

  // ===== Small style for mic prompt (injected so HTML stays clean) =====
  (function injectMicPromptStyle(){
    const css = `
      .mic-prompt{
        position: absolute;
        left: 0; right: 0;
        bottom: clamp(5px, -30vw, 63px);
        text-align: center;
        padding: 0;
        background: transparent;
        border: none;
        color: #fff;
        font-family: "Sora", system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif;
        font-weight: 600;
        font-size: clamp(12px, 2.8vw, 16px);
        letter-spacing: .2px;
        text-shadow: 0 2px 8px rgba(0,0,0,.45);
        z-index: 3;
        pointer-events: none;
        animation: fadeIn .25s ease-out both;
      }
      .mic-prompt.hide{
        opacity: 0;
        transform: translateY(4px);
        transition: opacity .22s ease, transform .22s ease;
      }
    `;
    const s = document.createElement('style');
    s.textContent = css;
    document.head.appendChild(s);
  })();

  // ===== Gift / Cake flow (+ mic hook using your found snippet logic) =====
  (function(){
    const img = document.getElementById('giftImage');
    const headline = document.getElementById('headline');
    let opened = false;

    function makeSvgFlame(className){
      const ns = "http://www.w3.org/2000/svg";
      const g = document.createElementNS(ns, "g");
      g.setAttribute("class", `svg-flame ${className||""}`);

      const defs = document.createElementNS(ns,"defs");
      const grad = document.createElementNS(ns,"radialGradient");
      const gid = "flg"+Math.random().toString(36).slice(2);
      grad.setAttribute("id", gid);
      grad.setAttribute("cx","50%"); grad.setAttribute("cy","30%"); grad.setAttribute("r","65%");
      const s1 = document.createElementNS(ns,"stop"); s1.setAttribute("offset","0%");   s1.setAttribute("stop-color","#fff8a8");
      const s2 = document.createElementNS(ns,"stop"); s2.setAttribute("offset","55%");  s2.setAttribute("stop-color","#ffd36b");
      const s3 = document.createElementNS(ns,"stop"); s3.setAttribute("offset","100%"); s3.setAttribute("stop-color","#ff7a2c");
      grad.append(s1,s2,s3); defs.appendChild(grad); g.appendChild(defs);

      const outer = document.createElementNS(ns,"path");
      outer.setAttribute("d","M0,-22 C6,-11 9,-4 9,2 C9,12 4,18 0,20 C-4,18 -9,12 -9,2 C-9,-4 -6,-11 0,-22 Z");
      outer.setAttribute("fill", `url(#${gid})`);
      outer.setAttribute("class","core");

      const inner = document.createElementNS(ns,"path");
      inner.setAttribute("d","M0,-14 C3,-8 4.5,-4 4.5,0 C4.5,6 2,9 0,10 C-2,9 -4.5,6 -4.5,0 C-4.5,-4 -3,-8 0,-14 Z");
      inner.setAttribute("fill","#fff4b0"); inner.setAttribute("opacity","0.9");

      g.append(outer, inner);
      return g;
    }

    function openGiftOnce(){
      if(opened) return; opened = true;
      if(window.Confetti && typeof window.Confetti.burst==='function'){
        window.Confetti.burst({
          count: 220,
          onDone: async () => {
            // Build cake
            const cakeContainer = document.createElement("div");
            cakeContainer.className = "pop-in cake-wrap";
            cakeContainer.setAttribute("aria-label","Birthday Cake");

            const cakeTitle = document.createElement("h2");
            cakeTitle.className = "cake-title";
            cakeTitle.textContent = "Happy Birthday";
            cakeContainer.appendChild(cakeTitle);

            // Inline SVG
            const svgText = await fetch("Cake 2 Candles.svg").then(r => r.text());
            const holder = document.createElement("div");
            holder.innerHTML = svgText.trim();
            const cakeSvg = holder.querySelector("svg");
            cakeSvg.setAttribute("viewBox", "0 0 1080 1080");
            cakeContainer.appendChild(cakeSvg);

            // Add flames
            const left = { x: 496.00, y: 132.72 };
            const right= { x: 554.36, y: 132.72 };
            const lift = -40;
            const flameScale = 1.0;
            const f1 = makeSvgFlame("");
            f1.style.transform = `translate(${left.x}px, ${left.y + lift}px) scale(${flameScale})`;
            const f2 = makeSvgFlame("fl2");
            f2.style.transform = `translate(${right.x}px, ${right.y + lift}px) scale(${flameScale})`;
            cakeSvg.appendChild(f1);
            cakeSvg.appendChild(f2);

            // Mic prompt (injected)
            const micPrompt = document.createElement("div");
            micPrompt.className = "mic-prompt";
            micPrompt.setAttribute("aria-live","polite");
            micPrompt.innerHTML = 'Blow into the mic to blow out the candles';
            cakeContainer.appendChild(micPrompt);

            // Swap image -> cake
            img.replaceWith(cakeContainer);
            if (headline) headline.remove();

            // Extinguish logic
            let blown = false;
            function puffAt(pt){
              const px = (pt.x / 1080) * 100;
              const py = (pt.y / 1080) * 100;
              for (let i=0;i<2;i++){
                const puff = document.createElement("div");
                puff.className = "puff";
                puff.style.setProperty("--x", px + "%");
                puff.style.setProperty("--y", py + "%");
                cakeContainer.appendChild(puff);
                setTimeout(()=>puff.remove(), 800);
              }
            }

            function extinguish(){
              if (blown) return; 
              blown = true;

              if (micPrompt) { micPrompt.classList.add("hide"); setTimeout(()=>micPrompt.remove(), 240); }

              f1.classList.add("extinguish");
              f2.classList.add("extinguish");
              setTimeout(()=>{ f1.remove(); f2.remove(); }, 420);

              puffAt(left); 
              puffAt(right);

              stopMic();

              try {
                const rect = cakeSvg.getBoundingClientRect();
                const cx = rect.left + ((left.x + right.x) / 2 / 1080) * rect.width;
                const cy = rect.top + ((left.y - 20) / 1080) * rect.height;
                window.Confetti.burstFrom({ x: cx, y: cy, count: 280 });
                setTimeout(() => {
                  const letterEmoji = document.createElement("div");
                  letterEmoji.className = "letter-emoji";
                  letterEmoji.setAttribute("role", "button");
                  letterEmoji.setAttribute("tabindex", "0");
                  letterEmoji.setAttribute("aria-label", "Open birthday message");
                  letterEmoji.innerHTML = `
                    <span class="emoji-letter" aria-label="love letter" role="img">💌</span>
                    <span class="emoji-hand" aria-hidden="true">👈🏼</span>
                  `;
                  cakeContainer.appendChild(letterEmoji);

                  function showPopup() {
                    const PAGES = [
                      { text: "I would have gotten you a real present..." },
                      { text: "but unfortunately, I’m broke", img: "no_money_cat.jpg" },
                      { text: "So you’ll have to settle for this card" },
                      { text: "Hope it made you smile (and if it didn’t… you better start smiling now)" },
                      { text: "I love you ❤️" }
                    ];
                    let idx = 0;
                    const wrap = document.createElement("div");
                    wrap.innerHTML = `
                      <div style="position:fixed; inset:0; display:flex; align-items:center; justify-content:center;
                                  background:rgba(0,0,0,.4); backdrop-filter:blur(3px); z-index:6;">
                        <div role="dialog" aria-modal="true" aria-label="Birthday message"
                            style="background:#fff; color:#0f172a; border-radius:18px; padding:22px 26px;
                                    box-shadow:0 24px 60px rgba(0,0,0,0.55); text-align:center;
                                    max-width:min(420px,90vw);">
                          <h3 id="popup-header" style="font:800 20px/1.25 'Outfit',system-ui;margin:0 0 6px;">Happy Birthday My Love !!</h3>
                          <p id="popup-body" style="font:500 16px/1.45 Inter,system-ui;margin:0;white-space:pre-line;"></p>

                          <div style="display:flex; gap:8px; justify-content:center; margin-top:14px;">
                            <button id="btn-back"
                                    style="background:#e5e7eb; color:#0f172a; border:none; border-radius:10px;
                                          padding:8px 14px; cursor:pointer; min-width:84px;">Back</button>
                            <button id="btn-next"
                                    style="background:#0f172a; color:#fff; border:none; border-radius:10px;
                                          padding:8px 14px; cursor:pointer; min-width:84px;">Next</button>
                            <button id="btn-close"
                                    style="display:none; background:#0f172a; color:#fff; border:none; border-radius:10px;
                                          padding:8px 14px; cursor:pointer; min-width:84px;">Close</button>
                          </div>
                        </div>
                      </div>`;
                    document.body.appendChild(wrap);

                    const overlay = wrap.firstElementChild;
                    const bodyEl  = overlay.querySelector("#popup-body");
                    const header  = overlay.querySelector("#popup-header");
                    const backBtn = overlay.querySelector("#btn-back");
                    const nextBtn = overlay.querySelector("#btn-next");
                    const closeBtn= overlay.querySelector("#btn-close");

                    const close = () => wrap.remove();
                    function updateView() {
                      const current = PAGES[idx];
                      let html = `<p>${current.text || current}</p>`;
                      if (current.img) {
                        html += `<img src="${current.img}" alt="" 
                                  style="display:block;margin:14px auto 0 auto;
                                          max-width:220px;width:70%;border-radius:12px;">`;
                      }
                      bodyEl.innerHTML = html;
                      header.style.display = idx === 0 ? "block" : "none";
                      const isLast = idx === PAGES.length - 1;
                      backBtn.style.display = (idx === 0) ? "none" : "inline-block";
                      nextBtn.style.display  = isLast ? "none" : "inline-block";
                      closeBtn.style.display = isLast ? "inline-block" : "none";
                      (isLast ? closeBtn : nextBtn).focus();
                    }

                    backBtn.addEventListener("click", () => { if (idx > 0) { idx--; updateView(); } });
                    nextBtn.addEventListener("click", () => { if (idx < PAGES.length - 1) { idx++; updateView(); } });
                    closeBtn.addEventListener("click", close);
                    overlay.addEventListener("click", e => { if (e.target === overlay) close(); });

                    function onKey(e) {
                      if (e.key === "Escape") return close();
                      if (e.key === "ArrowLeft" || e.key === "Backspace") {
                        if (idx > 0) { idx--; updateView(); }
                      } else if (e.key === "ArrowRight" || e.key === "Enter" || e.key === " ") {
                        const isLast = idx === PAGES.length - 1;
                        if (isLast) close();
                        else { idx++; updateView(); }
                      }
                    }
                    document.addEventListener("keydown", onKey);

                    const obs = new MutationObserver(() => {
                      if (!document.body.contains(wrap)) {
                        document.removeEventListener("keydown", onKey);
                        obs.disconnect();
                      }
                    });
                    obs.observe(document.body, { childList: true });

                    updateView();
                    (nextBtn.offsetParent ? nextBtn : closeBtn).focus();
                  }

                  // open popup on click/keyboard
                  letterEmoji.addEventListener("click", showPopup);
                  letterEmoji.addEventListener("keydown", e => {
                    if (e.key === "Enter" || e.key === " ") { e.preventDefault(); showPopup(); }
                  });
                }, 1300);
              } catch(e) {
                console.warn("Confetti burst error:", e);
              }
            }

            // Click / Space / B fallback
            cakeContainer.addEventListener("click", extinguish);
            window.addEventListener("keydown", e => {
              if (e.key === " " || e.key.toLowerCase() === "b") { e.preventDefault(); extinguish(); }
            });

            // ====== Microphone detection (based on your found snippet) ======
            let audioContext, analyser, microphone, freqArray, blowInterval;

            function isBlowing() {
              if (!analyser) return false;
              const bufferLength = analyser.frequencyBinCount;
              if (!freqArray || freqArray.length !== bufferLength) {
                freqArray = new Uint8Array(bufferLength);
              }
              analyser.getByteFrequencyData(freqArray);

              let sum = 0;
              for (let i = 0; i < bufferLength; i++) sum += freqArray[i];
              const average = sum / bufferLength;

              // Chrome desktop tends to sit ~5–20 at rest; mobile Safari can be noisier.
              // Start with 40 (from your snippet). Lower a bit on iOS.
              const isiOS = /iPad|iPhone|iPod/.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
              const threshold = isiOS ? 30 : 40;
              return average > threshold;
            }

            function startMic(){
              // Must be called after a user gesture (we are inside onDone of a click flow)
              if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
                console.log("getUserMedia not supported on this browser");
                return;
              }
              navigator.mediaDevices.getUserMedia({ audio: true }).then(stream => {
                audioContext = new (window.AudioContext || window.webkitAudioContext)();
                analyser = audioContext.createAnalyser();
                microphone = audioContext.createMediaStreamSource(stream);
                microphone.connect(analyser);
                analyser.fftSize = 256;

                // poll like the example (every 200ms)
                blowInterval = setInterval(() => {
                  if (isBlowing()) {
                    extinguish();
                  }
                }, 200);
              }).catch(err => {
                console.log("Unable to access microphone:", err);
              });
            }

            function stopMic(){
              if (blowInterval) { clearInterval(blowInterval); blowInterval = null; }
              try { microphone && microphone.mediaStream.getTracks().forEach(t => t.stop()); } catch {}
              try { audioContext && audioContext.close(); } catch {}
              analyser = null; microphone = null; audioContext = null; freqArray = null;
            }

            // Kick off mic after cake appears
            startMic();
          }
        });
      }
    }

    if (img) {
      img.addEventListener('click', openGiftOnce);
      img.addEventListener('keydown', (e)=>{ if(e.key==='Enter'||e.key===' '){ e.preventDefault(); openGiftOnce(); }});
    }
  })();
});
