/* Interactive, animated labs for the Learning page. Vanilla JS and inline SVG, no dependencies, works from file://.
   Every model here is a deliberately simplified teaching model. Numbers are illustrative unless a source is stated. */
(function () {
  "use strict";
  const loops = [];
  const reduceMotion = () => window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const fmt = (n, d = 0) => Number(n).toLocaleString("en-GB", { minimumFractionDigits: d, maximumFractionDigits: d });
  const money = (n, d = 2) => "$" + fmt(n, d);
  const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
  const h = (html) => { const t = document.createElement("template"); t.innerHTML = html.trim(); return t.content.firstElementChild; };

  function loop(fn) {
    const state = { on: true };
    let last = performance.now();
    const tick = (now) => { if (!state.on) return; const dt = clamp((now - last) / 1000, 0, 0.1); last = now; fn(dt, now); requestAnimationFrame(tick); };
    requestAnimationFrame(tick);
    loops.push(state);
  }
  function stopAll() { while (loops.length) loops.pop().on = false; }

  function slider(host, { label, min, max, step, value, format, hint }) {
    const id = "lab-" + Math.random().toString(36).slice(2, 9);
    const row = h(`<div class="lab-control"><label for="${id}"><span>${label}</span><output></output></label><input id="${id}" type="range" min="${min}" max="${max}" step="${step}" value="${value}">${hint ? `<small>${hint}</small>` : ""}</div>`);
    const input = row.querySelector("input"), out = row.querySelector("output");
    const show = () => { out.textContent = format(Number(input.value)); };
    input.addEventListener("input", show); show();
    host.appendChild(row);
    return input;
  }
  function chips(host, label, options, value) {
    const row = h(`<div class="lab-control"><span class="lab-label">${label}</span><div class="lab-chips" role="group" aria-label="${label}"></div></div>`);
    const box = row.querySelector(".lab-chips");
    options.forEach(([key, text]) => { const b = h(`<button type="button" class="lab-chip" data-v="${key}">${text}</button>`); box.appendChild(b); });
    const api = { value, el: box, onChange: null };
    const paint = () => box.querySelectorAll(".lab-chip").forEach(b => b.classList.toggle("on", b.dataset.v === api.value));
    box.addEventListener("click", e => { const b = e.target.closest(".lab-chip"); if (!b) return; api.value = b.dataset.v; paint(); if (api.onChange) api.onChange(); });
    paint(); host.appendChild(row);
    return api;
  }
  function frame(root, title) {
    root.innerHTML = "";
    const wrap = h(`<div class="lab"><div class="lab-title"><span class="lab-dot"></span>${title}</div><div class="lab-body"><div class="lab-controls"></div><div class="lab-visual"></div></div></div>`);
    root.appendChild(wrap);
    return { controls: wrap.querySelector(".lab-controls"), visual: wrap.querySelector(".lab-visual"), wrap };
  }

  /* 1. Unit economics: cost per token versus price, with Mistral's published tier multipliers */
  function unitEconomics(root) {
    const { controls, visual } = frame(root, "Lab · cost to serve versus price");
    const gpu = slider(controls, { label: "GPU cost per hour", min: 0.5, max: 12, step: 0.1, value: 3, format: v => money(v), hint: "Rent or depreciation plus power and hosting, per GPU." });
    const tps = slider(controls, { label: "Tokens per second per GPU", min: 200, max: 20000, step: 100, value: 3000, format: v => fmt(v), hint: "Input and output tokens across the whole batch. Measure it, it varies hugely by model." });
    const util = slider(controls, { label: "Utilisation", min: 5, max: 100, step: 1, value: 60, format: v => v + "%", hint: "Share of paid GPU time doing billable work." });
    const ratio = slider(controls, { label: "Input tokens per output token", min: 0, max: 10, step: 0.5, value: 3, format: v => fmt(v, 1) + " : 1", hint: "Chat with RAG is often input heavy." });
    const pin = slider(controls, { label: "List price, input per M", min: 0.05, max: 5, step: 0.05, value: 0.7, format: v => money(v) });
    const pout = slider(controls, { label: "List price, output per M", min: 0.05, max: 10, step: 0.05, value: 2.1, format: v => money(v), hint: "Defaults are Mistral Large 4 list prices, 2 Nov 2026." });
    const tier = chips(controls, "Service tier", [["1", "Standard"], ["1.1", "Regional ×1.1"], ["1.75", "Priority ×1.75"]], "1");
    visual.innerHTML = `
      <div class="lab-kpis">
        <div><small>Cost to serve per M tokens</small><strong data-k="cost"></strong></div>
        <div><small>Blended price per M tokens</small><strong data-k="price"></strong></div>
        <div class="lab-kpi-hero"><small>Gross margin</small><strong data-k="margin"></strong></div>
      </div>
      <svg class="lab-svg" viewBox="0 0 520 120" aria-label="Cost versus price bars">
        <text x="0" y="20" class="lab-t">Cost</text><rect x="70" y="8" height="22" rx="4" class="bar-cost" data-k="costbar"></rect>
        <text x="0" y="62" class="lab-t">Price</text><rect x="70" y="50" height="22" rx="4" class="bar-price" data-k="pricebar"></rect>
        <line x1="70" x2="70" y1="0" y2="84" class="lab-axis"></line>
        <text x="70" y="104" class="lab-s" data-k="note"></text>
      </svg>
      <p class="lab-caption">Margin across utilisation, with the current point</p>
      <svg class="lab-svg" viewBox="0 0 520 150" aria-label="Margin against utilisation">
        <line x1="40" x2="510" y1="75" y2="75" class="lab-axis"></line>
        <text x="4" y="14" class="lab-s">+100%</text><text x="4" y="79" class="lab-s">0%</text><text x="4" y="146" class="lab-s">−100%</text>
        <path class="lab-curve" data-k="curve"></path>
        <line class="lab-guide" data-k="be" y1="5" y2="145"></line>
        <circle r="6" class="lab-point" data-k="pt"></circle>
        <text x="470" y="146" class="lab-s">100% util</text>
      </svg>
      <p class="lab-caption">One GPU hour, sped up. Busy time makes tokens. Idle time still costs money.</p>
      <svg class="lab-svg" viewBox="0 0 560 130" aria-label="Animated GPU hour">
        <circle cx="66" cy="64" r="48" class="hour-track"></circle>
        <path data-k="busy" class="hour-busy"></path>
        <line data-k="hand" x1="66" y1="64" x2="66" y2="20" class="hour-hand"></line><circle cx="66" cy="64" r="4" fill="#e8eef5"></circle>
        <text x="66" y="126" class="lab-s" text-anchor="middle" data-k="state">busy</text>
        <text x="150" y="26" class="lab-s">Tokens made this hour</text>
        <rect x="150" y="34" width="290" height="30" rx="8" class="bucket"></rect><rect data-k="fill" x="150" y="34" height="30" rx="8" class="bucket-fill"></rect>
        <text x="434" y="54" class="lab-t" text-anchor="end" data-k="tok"></text>
        <text x="150" y="88" class="lab-s">GPU cost so far</text>
        <rect x="150" y="96" width="290" height="14" rx="5" class="bucket"></rect><rect data-k="cfill" x="150" y="96" height="14" rx="5" class="bucket-cost"></rect>
        <text x="460" y="54" class="lab-s" data-k="tokr"></text><text x="460" y="108" class="lab-s" data-k="costr"></text>
        <g data-k="emit"></g>
      </svg>`;
    const q = k => visual.querySelector(`[data-k="${k}"]`);
    const update = () => {
      const m = Number(tier.value);
      const r = Number(ratio.value);
      const blended = (r * Number(pin.value) + Number(pout.value)) / (r + 1) * m;
      const costAt = u => Number(gpu.value) / (Number(tps.value) * 3600 * (u / 100)) * 1e6;
      const cost = costAt(Number(util.value));
      const margin = (blended - cost) / blended;
      const beUtil = Number(gpu.value) * 1e6 / (Number(tps.value) * 3600 * blended) * 100;
      q("cost").textContent = money(cost, 3); q("price").textContent = money(blended, 3);
      q("margin").textContent = (margin * 100).toFixed(0) + "%";
      q("margin").parentElement.classList.toggle("neg", margin < 0);
      const scale = 430 / Math.max(cost, blended, 0.0001);
      q("costbar").setAttribute("width", Math.max(2, cost * scale)); q("pricebar").setAttribute("width", Math.max(2, blended * scale));
      q("note").textContent = beUtil <= 100 ? `Break even at ${beUtil.toFixed(0)}% utilisation. Every $1 of revenue costs ${money(cost / blended, 2)} in GPU time.` : `Cannot break even at this price, even at 100% utilisation.`;
      let d = "";
      for (let u = 5; u <= 100; u += 1) { const mg = clamp((blended - costAt(u)) / blended, -1, 1); const x = 40 + (u - 5) / 95 * 470; const y = 75 - mg * 70; d += (u === 5 ? "M" : "L") + x.toFixed(1) + " " + y.toFixed(1); }
      q("curve").setAttribute("d", d);
      const cu = Number(util.value), cm = clamp(margin, -1, 1);
      q("pt").setAttribute("cx", 40 + (cu - 5) / 95 * 470); q("pt").setAttribute("cy", 75 - cm * 70);
      const bx = 40 + (clamp(beUtil, 5, 100) - 5) / 95 * 470; q("be").setAttribute("x1", bx); q("be").setAttribute("x2", bx); q("be").style.opacity = beUtil <= 100 ? 1 : 0;
    };
    [gpu, tps, util, ratio, pin, pout].forEach(i => i.addEventListener("input", update)); tier.onChange = update; update();
    const arc = f => { if (f <= 0) return ""; if (f >= 1) return "M66 16 A48 48 0 1 1 65.99 16Z"; const a = f * Math.PI * 2 - Math.PI / 2, x = 66 + 48 * Math.cos(a), y = 64 + 48 * Math.sin(a); return `M66 64 L66 16 A48 48 0 ${f > 0.5 ? 1 : 0} 1 ${x.toFixed(1)} ${y.toFixed(1)}Z`; };
    let hf = 0, emitT = 0; const drops = [], emitG = q("emit");
    const drawHour = () => {
      const u = Number(util.value) / 100, busyNow = hf < u, made = Math.min(hf, u) * Number(tps.value) * 3600;
      q("busy").setAttribute("d", arc(u));
      const a = hf * Math.PI * 2 - Math.PI / 2; q("hand").setAttribute("x2", 66 + 44 * Math.cos(a)); q("hand").setAttribute("y2", 64 + 44 * Math.sin(a));
      q("hand").classList.toggle("idle", !busyNow); q("state").textContent = busyNow ? "busy: making tokens" : "idle: still paying";
      q("fill").setAttribute("width", Math.max(0, 290 * Math.min(hf, u))); q("cfill").setAttribute("width", 290 * hf);
      q("tok").textContent = made >= 1e6 ? fmt(made / 1e6, 2) + " M" : fmt(made);
      q("tokr").textContent = `of ${fmt(Number(tps.value) * 3600 * u / 1e6, 2)} M`; q("costr").textContent = `${money(Number(gpu.value) * hf)} of ${money(Number(gpu.value))}`;
      return busyNow;
    };
    if (reduceMotion()) { hf = 0.999; drawHour(); return; }
    loop(dt => {
      hf += dt / 7; if (hf >= 1) { hf = 0; }
      const busyNow = drawHour();
      emitT += dt;
      if (busyNow && emitT > 0.07) { emitT = 0; const c = document.createElementNS("http://www.w3.org/2000/svg", "circle"); c.setAttribute("r", 3); c.setAttribute("class", "spark green"); emitG.appendChild(c); drops.push({ el: c, t: 0, y: 40 + Math.random() * 18 }); }
      for (let k = drops.length - 1; k >= 0; k--) { const d = drops[k]; d.t += dt / 0.6; const x = 118 + (150 + 290 * Math.min(hf, Number(util.value) / 100) - 118) * d.t; d.el.setAttribute("cx", x); d.el.setAttribute("cy", 64 + (d.y - 64) * d.t); d.el.setAttribute("opacity", 1 - d.t * 0.6); if (d.t >= 1) { d.el.remove(); drops.splice(k, 1); } }
    });
  }

  /* 2. Utilisation across a day: provisioned capacity, idle cost, unmet demand, batch fill */
  function utilisationDay(root) {
    const { controls, visual } = frame(root, "Lab · a day of demand on fixed capacity");
    const cap = slider(controls, { label: "Capacity, as % of daily peak", min: 30, max: 130, step: 1, value: 100, format: v => v + "%", hint: "GPUs you have committed to, whether busy or not." });
    const batch = chips(controls, "Idle time", [["off", "Left idle"], ["on", "Filled with batch work"]], "off");
    const gauss = (x, m, s) => Math.exp(-((x - m) ** 2) / (2 * s * s));
    const raw = Array.from({ length: 97 }, (_, i) => { const t = i / 4; return 0.22 + 0.62 * gauss(t, 10.5, 2.3) + 0.5 * gauss(t, 15.5, 2.1) + 0.08 * gauss(t, 20.5, 1.5); });
    const peak = Math.max(...raw); const demand = raw.map(v => v / peak);
    visual.innerHTML = `
      <div class="lab-kpis"><div><small>Utilisation</small><strong data-k="u"></strong></div><div><small>Demand you could not serve</small><strong data-k="miss"></strong></div><div><small>Paid but idle GPU time</small><strong data-k="idle"></strong></div></div>
      <svg class="lab-svg" viewBox="0 0 520 220" aria-label="Demand across 24 hours against capacity">
        <path data-k="idleA" class="area-idle"></path><path data-k="servedA" class="area-served"></path><path data-k="missA" class="area-miss"></path>
        <path data-k="dline" class="lab-curve thin"></path><line data-k="cline" x1="20" x2="510" class="cap-line"></line>
        <line data-k="now" y1="10" y2="200" class="lab-guide"></line><circle data-k="nowpt" r="5" class="lab-point" style="transition:none"></circle>
        <text x="20" y="215" class="lab-s">00:00</text><text x="250" y="215" class="lab-s">12:00</text><text x="478" y="215" class="lab-s">24:00</text>
        <text data-k="clabel" x="514" class="lab-s" text-anchor="end">capacity</text>
      </svg>
      <div class="lab-legend"><span class="lg served"></span>served <span class="lg idle"></span>idle, paid for <span class="lg miss"></span>unserved demand</div>
      <div class="rack-wrap"><div class="rack-time"><small>Now</small><strong data-k="clock"></strong></div><div class="gpu-row" data-k="rack"></div></div>`;
    const q = k => visual.querySelector(`[data-k="${k}"]`);
    const X = i => 20 + i / 96 * 490, Y = v => 200 - v * 170;
    let t = 0;
    const update = () => {
      const c = Number(cap.value) / 100, fill = batch.value === "on";
      let served = 0, idle = 0, miss = 0, total = 0;
      let dS = "", dI = "", dM = "", dL = "";
      demand.forEach((d, i) => { const s = Math.min(d, c); served += s; total += d; miss += d - s; idle += c - s; });
      const batchFill = fill ? idle * 0.8 : 0;
      const u = (served + batchFill) / (c * demand.length);
      q("u").textContent = (u * 100).toFixed(0) + "%"; q("miss").textContent = (miss / total * 100).toFixed(0) + "%"; q("idle").textContent = ((idle - batchFill) / (c * demand.length) * 100).toFixed(0) + "%";
      dL = demand.map((d, i) => (i ? "L" : "M") + X(i) + " " + Y(d)).join("");
      const servedTop = demand.map((d, i) => [X(i), Y(Math.min(d, c))]);
      dS = "M" + X(0) + " " + Y(0) + servedTop.map(p => "L" + p[0] + " " + p[1]).join("") + "L" + X(96) + " " + Y(0) + "Z";
      dI = "M" + X(0) + " " + Y(c) + demand.map((d, i) => "L" + X(i) + " " + Y(c)).join("") + servedTop.slice().reverse().map(p => "L" + p[0] + " " + p[1]).join("") + "Z";
      dM = "M" + servedTop.map(p => p[0] + " " + p[1]).join("L") + demand.slice().reverse().map((d, j) => "L" + X(96 - j) + " " + Y(d)).join("") + "Z";
      q("dline").setAttribute("d", dL); q("servedA").setAttribute("d", dS); q("idleA").setAttribute("d", dI); q("missA").setAttribute("d", dM);
      q("idleA").classList.toggle("filled", fill);
      q("cline").setAttribute("y1", Y(c)); q("cline").setAttribute("y2", Y(c)); q("clabel").setAttribute("y", Y(c) - 5);
    };
    cap.addEventListener("input", () => { update(); lastI = -1; drawNow(); }); batch.onChange = () => { update(); lastI = -1; drawNow(); }; update();
    let lastI = -1;
    const drawNow = () => { const i = Math.floor(t) % 97; q("now").setAttribute("x1", X(i)); q("now").setAttribute("x2", X(i)); q("nowpt").setAttribute("cx", X(i)); q("nowpt").setAttribute("cy", Y(demand[i]));
      if (i === lastI) return; lastI = i;
      const c = Number(cap.value) / 100, d = demand[i], fill = batch.value === "on";
      const capT = Math.round(c * 20), servedT = Math.min(capT, Math.round(d * 20)), missT = Math.max(0, Math.round(d * 20) - capT), batchT = fill ? Math.round((capT - servedT) * 0.8) : 0;
      const hh = String(Math.floor(i / 4) % 24).padStart(2, "0"), mm = String((i % 4) * 15).padStart(2, "0");
      q("clock").textContent = `${hh}:${mm}`;
      q("rack").innerHTML = Array.from({ length: capT }, (_, k) => `<i class="${k < servedT ? "busy" : k < servedT + batchT ? "batch" : "idle"}"></i>`).join("") + Array.from({ length: missT }, () => `<i class="miss"></i>`).join("");
    };
    drawNow();
    if (reduceMotion()) { t = 42; drawNow(); } else loop(dt => { t = (t + dt * 9) % 97; drawNow(); });
  }

  /* 3. Prefill then decode: why time to first token and output speed are different problems */
  function prefillDecode(root) {
    const { controls, visual } = frame(root, "Lab · one request, from prompt to last token");
    const steps = [100, 500, 1000, 2000, 4000, 8000, 16000, 32000, 64000, 128000];
    const p = slider(controls, { label: "Prompt length (tokens)", min: 0, max: steps.length - 1, step: 1, value: 3, format: v => fmt(steps[v]), hint: "System prompt, chat history and retrieved documents all count." });
    const o = slider(controls, { label: "Answer length (tokens)", min: 20, max: 2000, step: 10, value: 300, format: v => fmt(v) });
    const PREFILL = 8000, DECODE = 60, QUEUE = 0.15;
    controls.appendChild(h(`<p class="lab-note">Illustrative speeds for one request on a busy GPU: prefill ${fmt(PREFILL)} tokens per second, decode ${DECODE} tokens per second, 150 ms queueing.</p>`));
    const play = h(`<button type="button" class="button lab-play">▶ Send the request</button>`); controls.appendChild(play);
    visual.innerHTML = `
      <div class="lab-kpis"><div><small>Time to first token</small><strong data-k="ttft"></strong></div><div><small>Time for the full answer</small><strong data-k="total"></strong></div><div><small>Output speed</small><strong>${DECODE} tok/s</strong></div></div>
      <div class="pd-stage"><div class="pd-label">Prompt, processed in parallel</div><div class="pd-grid" data-k="pg"></div><div class="pd-label">Answer, one token at a time</div><div class="pd-grid out" data-k="og"></div></div>
      <svg class="lab-svg" viewBox="0 0 520 70" aria-label="Request timeline">
        <rect x="10" y="18" height="24" rx="4" class="seg-q" data-k="sq"></rect><rect y="18" height="24" rx="4" class="seg-p" data-k="sp"></rect><rect y="18" height="24" rx="4" class="seg-d" data-k="sd"></rect>
        <line data-k="ttfl" y1="8" y2="52" class="lab-guide"></line><text data-k="ttft2" y="64" class="lab-s"></text>
        <rect data-k="cursor" x="10" y="14" width="3" height="32" class="lab-cursor"></rect>
      </svg>
      <div class="lab-legend"><span class="lg q"></span>queue <span class="lg p"></span>prefill <span class="lg d"></span>decode</div>`;
    const q = k => visual.querySelector(`[data-k="${k}"]`);
    let anim = null;
    const layout = () => {
      const P = steps[Number(p.value)], O = Number(o.value);
      const tPre = P / PREFILL, ttft = QUEUE + tPre, tDec = O / DECODE, total = ttft + tDec;
      q("ttft").textContent = ttft < 1 ? fmt(ttft * 1000) + " ms" : fmt(ttft, 1) + " s"; q("total").textContent = fmt(total, 1) + " s";
      const W = 500, s = W / total;
      q("sq").setAttribute("width", Math.max(2, QUEUE * s)); q("sp").setAttribute("x", 10 + QUEUE * s); q("sp").setAttribute("width", Math.max(2, tPre * s));
      q("sd").setAttribute("x", 10 + ttft * s); q("sd").setAttribute("width", Math.max(2, tDec * s));
      q("ttfl").setAttribute("x1", 10 + ttft * s); q("ttfl").setAttribute("x2", 10 + ttft * s);
      q("ttft2").setAttribute("x", Math.min(10 + ttft * s + 4, 400)); q("ttft2").textContent = "first token";
      const pc = Math.min(120, Math.max(6, Math.round(Math.log2(P) * 8))), oc = Math.min(120, Math.max(6, Math.round(O / 17)));
      q("pg").innerHTML = "<i></i>".repeat(pc); q("og").innerHTML = "<i></i>".repeat(oc);
      return { ttft, total, s, pc, oc };
    };
    let L = layout();
    [p, o].forEach(i => i.addEventListener("input", () => { if (anim) anim.on = false; L = layout(); clearTimeout(again); again = setTimeout(() => play.click(), 500); }));
    let again = null;
    play.addEventListener("click", () => {
      if (anim) anim.on = false;
      clearTimeout(again);
      L = layout();
      const cells = q("pg").children, outs = q("og").children;
      const speed = 2.6 / L.total; let t = 0;
      if (reduceMotion()) { [...cells].forEach(c => c.classList.add("on")); [...outs].forEach(c => c.classList.add("on")); return; }
      anim = { on: true }; loops.push(anim); const me = anim;
      let last = performance.now();
      const step = now => { if (!me.on) return; t += Math.max(0, (now - last) / 1000) / speed; last = now;
        q("cursor").setAttribute("x", 10 + Math.min(t, L.total) * L.s);
        const preDone = t >= L.ttft; const qEnd = 0.15;
        q("sq").classList.toggle("active", t < qEnd); q("sp").classList.toggle("active", t >= qEnd && !preDone); q("sd").classList.toggle("active", preDone && t < L.total);
        [...cells].forEach((c, i) => c.classList.toggle("on", t > qEnd && (preDone || i / cells.length < (t - qEnd) / (L.ttft - qEnd))));
        const k = preDone ? Math.floor((t - L.ttft) / (L.total - L.ttft) * outs.length) : -1;
        [...outs].forEach((c, i) => c.classList.toggle("on", i <= k));
        if (t < L.total + 0.4) requestAnimationFrame(step);
        else again = setTimeout(() => { if (me.on && document.body.contains(play)) play.click(); }, 1600); };
      requestAnimationFrame(step);
    });
    setTimeout(() => { if (document.body.contains(play)) play.click(); }, 400);
  }

  /* 4. GPU memory: weights plus KV cache decide how many requests fit */
  function gpuMemory(root) {
    const { controls, visual } = frame(root, "Lab · fit a model and its users onto GPUs");
    const models = { s: { n: "about 7B, 32 layers", p: 7.3, L: 32 }, m: { n: "about 24B, 40 layers", p: 24, L: 40 }, l: { n: "about 123B, 88 layers", p: 123, L: 88 } };
    const gpus = { h100: ["H100, 80 GB", 80], h200: ["H200, 141 GB", 141], b300: ["B300, 288 GB", 288] };
    const model = chips(controls, "Model size (dense, 8 KV heads of 128)", [["s", "~7B"], ["m", "~24B"], ["l", "~123B"]], "s");
    const gpu = chips(controls, "GPU", Object.entries(gpus).map(([k, v]) => [k, v[0]]), "h100");
    const count = chips(controls, "Number of GPUs", [["1", "1"], ["2", "2"], ["4", "4"], ["8", "8"]], "1");
    const wp = chips(controls, "Weight precision", [["2", "FP16"], ["1", "FP8"], ["0.5", "INT4"]], "2");
    const kp = chips(controls, "KV cache precision", [["2", "FP16"], ["1", "FP8"]], "2");
    const ctxSteps = [1024, 2048, 4096, 8192, 16384, 32768, 65536, 131072];
    const ctx = slider(controls, { label: "Context per request (tokens)", min: 0, max: ctxSteps.length - 1, step: 1, value: 5, format: v => fmt(ctxSteps[v]) });
    const users = slider(controls, { label: "Requests running at once", min: 1, max: 256, step: 1, value: 16, format: v => fmt(v) });
    visual.innerHTML = `
      <div class="lab-kpis"><div><small>KV cache per token</small><strong data-k="kvt"></strong></div><div><small>KV cache per request</small><strong data-k="kvr"></strong></div><div class="lab-kpi-hero"><small>Max requests that fit</small><strong data-k="max"></strong></div></div>
      <svg class="lab-svg" viewBox="0 0 520 90" aria-label="GPU memory">
        <rect x="10" y="20" width="500" height="34" rx="6" class="mem-bg"></rect>
        <rect y="20" height="34" class="mem-w" data-k="w"></rect><rect y="20" height="34" class="mem-kv" data-k="kv"></rect><rect y="20" height="34" class="mem-o" data-k="o"></rect>
        <rect y="20" height="34" class="mem-over" data-k="over"></rect>
        <text x="10" y="14" class="lab-s" data-k="cap"></text><text x="10" y="74" class="lab-s" data-k="msg"></text>
      </svg>
      <div class="lab-legend"><span class="lg w"></span>weights <span class="lg kv"></span>KV cache <span class="lg o"></span>runtime overhead <span class="lg over"></span>does not fit</div>
      <p class="lab-caption">Each square is one request. Red ones would not fit.</p><div class="slots" data-k="slots"></div>`;
    const q = k => visual.querySelector(`[data-k="${k}"]`);
    const update = () => {
      const M = models[model.value], G = gpus[gpu.value][1] * Number(count.value);
      const weights = M.p * Number(wp.value);
      const kvTokB = 2 * M.L * 8 * 128 * Number(kp.value);
      const kvReqGB = kvTokB * ctxSteps[Number(ctx.value)] / 1e9;
      const overhead = G * 0.1, U = Number(users.value);
      const free = G - weights - overhead; const maxReq = free > 0 ? Math.floor(free / kvReqGB) : 0;
      const kvUsed = kvReqGB * U, used = weights + overhead + kvUsed;
      q("kvt").textContent = fmt(kvTokB / 1024, 0) + " KB"; q("kvr").textContent = kvReqGB < 1 ? fmt(kvReqGB * 1000, 0) + " MB" : fmt(kvReqGB, 1) + " GB";
      q("max").textContent = free > 0 ? fmt(maxReq) : "model does not fit"; q("max").parentElement.classList.toggle("neg", maxReq < U);
      const S = 500 / Math.max(G, used);
      let x = 10; const put = (k, v) => { q(k).setAttribute("x", x); q(k).setAttribute("width", Math.max(0, v * S)); x += v * S; };
      put("w", Math.min(weights, G)); put("o", Math.min(overhead, Math.max(0, G - weights)));
      put("kv", Math.min(kvUsed, Math.max(0, G - weights - overhead)));
      const over = Math.max(0, used - G); q("over").setAttribute("x", 10 + G * S); q("over").setAttribute("width", over * S);
      q("cap").textContent = `${fmt(G)} GB of GPU memory across ${count.value} GPU${count.value === "1" ? "" : "s"}`;
      q("msg").textContent = used <= G ? `${fmt(used, 0)} GB used. Room for ${fmt(Math.max(0, maxReq - U))} more requests at this context.` : `Over by ${fmt(over, 0)} GB. Shorten context, quantise, add GPUs or cap concurrency.`;
      const n = Math.min(U, 256), sig = n + ":" + maxReq;
      if (q("slots").dataset.sig !== sig) { q("slots").dataset.sig = sig; q("slots").innerHTML = Array.from({ length: n }, (_, i) => `<i class="${i < maxReq ? "ok" : "bad"}" style="--i:${Math.min(i, 60)}"></i>`).join(""); }
    };
    [ctx, users].forEach(i => i.addEventListener("input", update)); [model, gpu, count, wp, kp].forEach(c => c.onChange = update); update();
  }

  /* 5. Batching: throughput versus per-user speed */
  function batching(root) {
    const { controls, visual } = frame(root, "Lab · how big should the batch be?");
    const steps = [1, 2, 4, 8, 16, 32, 64, 128, 256];
    const b = slider(controls, { label: "Requests decoded together (batch)", min: 0, max: steps.length - 1, step: 1, value: 4, format: v => fmt(steps[v]) });
    const gpu = slider(controls, { label: "GPU cost per hour", min: 0.5, max: 12, step: 0.1, value: 3, format: v => money(v) });
    controls.appendChild(h(`<p class="lab-note">Teaching model: each decode step reads all the weights once (about 10 ms here) and gets slower as the batch grows because each request adds its own KV cache to read.</p>`));
    const T0 = 10, SAT = 48;
    const stepMs = n => T0 * (1 + n / SAT);
    visual.innerHTML = `
      <div class="lab-kpis"><div><small>Speed each user sees</small><strong data-k="user"></strong></div><div><small>Total tokens per second</small><strong data-k="tput"></strong></div><div class="lab-kpi-hero"><small>Cost per M output tokens</small><strong data-k="cost"></strong></div></div>
      <svg class="lab-svg" viewBox="0 0 520 200" aria-label="Throughput and per-user speed as batch grows">
        <line x1="40" x2="510" y1="170" y2="170" class="lab-axis"></line>
        <path data-k="ct" class="lab-curve"></path><path data-k="cu" class="lab-curve alt"></path>
        <circle data-k="pt" r="6" class="lab-point"></circle><circle data-k="pu" r="6" class="lab-point alt"></circle>
        <text x="40" y="190" class="lab-s">batch 1</text><text x="480" y="190" class="lab-s">256</text>
        <text x="200" y="84" class="lab-s lab-acc">total throughput ↑</text><text x="200" y="100" class="lab-s lab-alt">speed per user ↓</text>
      </svg>
      <p class="lab-caption" data-k="busl"></p>
      <svg class="lab-svg engine" viewBox="0 0 760 300" aria-label="Animated decode steps" data-k="eng">
        <defs><linearGradient id="scanG" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="#ff7a45" stop-opacity="0"/><stop offset=".5" stop-color="#ffb08a"/><stop offset="1" stop-color="#ff7a45" stop-opacity="0"/></linearGradient></defs>
        <text x="20" y="18" class="lab-s">Model weights</text>
        <g data-k="layers"></g>
        <rect data-k="scan" x="16" y="28" width="108" height="26" rx="4" fill="url(#scanG)" opacity=".95"></rect>
        <text x="70" y="292" class="lab-s" text-anchor="middle">read once per step</text>
        <circle cx="190" cy="150" r="34" class="ring-track"></circle><path data-k="ring" class="ring-arc"></path>
        <text x="190" y="146" class="lab-t" text-anchor="middle" data-k="stepn">0</text><text x="190" y="164" class="lab-s" text-anchor="middle">step</text>
        <text x="190" y="206" class="lab-s" text-anchor="middle" data-k="stepms"></text>
        <text x="270" y="18" class="lab-s" data-k="lanehdr">Requests in the batch, one new token each per step</text>
        <g data-k="lanes"></g><g data-k="sparks"></g>
      </svg>
      <div class="lab-legend"><span class="lg kv"></span>token made this request <span class="lg join"></span>request just joined <span class="lg served"></span>finished, slot freed at once</div>`;
    const q = k => visual.querySelector(`[data-k="${k}"]`);
    const X = n => 40 + (n - 1) / 255 * 470;
    const maxT = 256 * 1000 / stepMs(256);
    let ct = "", cu = "";
    for (let n = 1; n <= 256; n += 1) { const t = n * 1000 / stepMs(n), u = 1000 / stepMs(n); ct += (n > 1 ? "L" : "M") + X(n).toFixed(1) + " " + (170 - t / maxT * 150).toFixed(1); cu += (n > 1 ? "L" : "M") + X(n).toFixed(1) + " " + (170 - u / (1000 / stepMs(1)) * 150).toFixed(1); }
    q("ct").setAttribute("d", ct); q("cu").setAttribute("d", cu);
    let phase = 0;
    const SVGNS = "http://www.w3.org/2000/svg";
    const mk = (tag, attrs, parent) => { const n = document.createElementNS(SVGNS, tag); Object.entries(attrs).forEach(([k2, v]) => n.setAttribute(k2, v)); parent.appendChild(n); return n; };
    const layersG = q("layers");
    for (let l = 0; l < 14; l++) mk("rect", { x: 20, y: 30 + l * 17.5, width: 100, height: 13, rx: 3, class: "w-layer" }, layersG);
    const CELLS = 24, CW = 18, X0 = 300, ROWMAX = 16;
    let rows = [], stepCount = 0, lanesFor = -1;
    const newRow = () => ({ len: 6 + Math.floor(Math.random() * (CELLS - 6)), filled: 0, joined: 1, done: 0 });
    const buildLanes = n => {
      const R = Math.min(n, ROWMAX), lanes = q("lanes"); lanes.innerHTML = ""; rows = [];
      const rh = Math.min(16, 260 / R);
      for (let r = 0; r < R; r++) {
        const y = 30 + r * rh + (260 - R * rh) / 2, row = newRow(); row.filled = Math.floor(Math.random() * row.len * 0.6);
        row.y = y; row.h = Math.max(6, rh - 4);
        mk("text", { x: 270, y: y + row.h - 1, class: "lab-s lane-id" }, lanes).textContent = R < n ? `×${n / R}` : `U${r + 1}`;
        row.cells = Array.from({ length: CELLS }, (_, c) => mk("rect", { x: X0 + c * CW, y, width: CW - 4, height: row.h, rx: 2, class: "t-cell" }, lanes));
        rows.push(row);
      }
      q("lanehdr").textContent = R < n ? `${fmt(n)} requests in the batch, each row stands for ${n / R}` : `${fmt(n)} request${n > 1 ? "s" : ""} in the batch, one new token each per step`;
      paintRows(); lanesFor = n;
    };
    const paintRows = () => rows.forEach(row => row.cells.forEach((cell, c) => {
      cell.setAttribute("class", "t-cell" + (row.done ? (c < row.len ? " done" : "") : c < row.filled ? (c === 0 && row.joined ? " join" : " on") : c < row.len ? " pending" : ""));
    }));
    const sparks = q("sparks"); let flying = [];
    const commitStep = () => {
      stepCount++; q("stepn").textContent = fmt(stepCount);
      rows.forEach(row => {
        if (row.done) { Object.assign(row, newRow(), { y: row.y, h: row.h, cells: row.cells }); return; }
        row.filled++; if (row.filled > 1) row.joined = 0;
        if (row.filled >= row.len) row.done = 1;
        const c = mk("circle", { r: 3.5, class: "spark" }, sparks); flying.push({ el: c, t: 0, x2: X0 + (row.filled - 1) * CW + (CW - 4) / 2, y2: row.y + row.h / 2 });
      });
      paintRows();
    };
    const ringPath = f => { const a = f * Math.PI * 2 - Math.PI / 2, r = 34, x = 190 + r * Math.cos(a), y = 150 + r * Math.sin(a); return f <= 0 ? "" : `M190 116 A34 34 0 ${f > 0.5 ? 1 : 0} 1 ${x.toFixed(1)} ${y.toFixed(1)}`; };
    const update = () => {
      const i = Number(b.value), n = steps[i], t = n * 1000 / stepMs(n), u = 1000 / stepMs(n);
      q("user").textContent = fmt(u) + " tok/s"; q("tput").textContent = fmt(t);
      q("cost").textContent = money(Number(gpu.value) / (t * 3600) * 1e6, 2);
      q("pt").setAttribute("cx", X(n)); q("pt").setAttribute("cy", 170 - t / maxT * 150); q("pu").setAttribute("cx", X(n)); q("pu").setAttribute("cy", 170 - u / (1000 / stepMs(1)) * 150);
      q("busl").textContent = `Slowed right down: each step really takes ${fmt(stepMs(n), 1)} ms and gives ${fmt(n)} token${n > 1 ? "s" : ""}, one per request. Bigger batches mean longer steps but far more tokens per step.`;
      q("stepms").textContent = `${fmt(stepMs(n), 1)} ms in real life`;
      if (lanesFor !== n) buildLanes(n);
    };
    [b, gpu].forEach(x => x.addEventListener("input", update)); update();
    if (reduceMotion()) { q("scan").setAttribute("y", 150); return; }
    loop(dt => {
      const n = steps[Number(b.value)], dur = 0.45 + (stepMs(n) - 10.2) / 53 * 1.5;
      phase += dt / dur;
      const sweep = Math.min(phase / 0.8, 1);
      q("scan").setAttribute("y", 22 + sweep * 236);
      layersG.querySelectorAll("rect").forEach((r, l) => r.classList.toggle("lit", Math.abs(30 + l * 17.5 - (22 + sweep * 236)) < 18));
      q("ring").setAttribute("d", ringPath(Math.min(phase, 0.999)));
      if (phase >= 1) { phase = 0; commitStep(); }
      for (let k = flying.length - 1; k >= 0; k--) {
        const s = flying[k]; s.t += dt / 0.45; const e = 1 - Math.pow(1 - Math.min(s.t, 1), 3);
        s.el.setAttribute("cx", 225 + (s.x2 - 225) * e); s.el.setAttribute("cy", 150 + (s.y2 - 150) * e); s.el.setAttribute("opacity", 1 - Math.max(0, s.t - 0.8) * 5);
        if (s.t >= 1) { s.el.remove(); flying.splice(k, 1); }
      }
    });
  }

  /* 6. Speculative decoding */
  function speculative(root) {
    const { controls, visual } = frame(root, "Lab · a small model drafts, the big model checks");
    const a = slider(controls, { label: "Acceptance rate (how often the draft is right)", min: 0.3, max: 0.95, step: 0.01, value: 0.75, format: v => Math.round(v * 100) + "%" });
    const k = slider(controls, { label: "Draft tokens proposed each round", min: 1, max: 8, step: 1, value: 4, format: v => v });
    const c = slider(controls, { label: "Draft model cost, relative to the big model", min: 0, max: 0.3, step: 0.01, value: 0.05, format: v => Math.round(v * 100) + "%" });
    visual.innerHTML = `
      <div class="lab-kpis"><div><small>Tokens per big model pass</small><strong data-k="e"></strong></div><div class="lab-kpi-hero"><small>Expected speed up</small><strong data-k="s"></strong></div><div><small>Observed in this animation</small><strong data-k="obs"></strong></div></div>
      <div class="spec-row"><span class="spec-tag">draft</span><div class="spec-tokens" data-k="row"></div></div>
      <p class="lab-caption" data-k="msg">Watch the big model check the draft left to right. It keeps tokens until the first miss, then adds one of its own.</p>`;
    const q = k2 => visual.querySelector(`[data-k="${k2}"]`);
    let produced = 0, passes = 0, timer = 0, stage = 0, plan = [];
    const update = () => {
      const A = Number(a.value), K = Number(k.value), C = Number(c.value);
      const E = (1 - Math.pow(A, K + 1)) / (1 - A);
      q("e").textContent = fmt(E, 2); q("s").textContent = fmt(E / (K * C + 1), 2) + "×";
    };
    const newRound = () => {
      const A = Number(a.value), K = Number(k.value); plan = []; let ok = true;
      for (let i = 0; i < K; i++) { const acc = ok && Math.random() < A; plan.push(acc ? "acc" : (ok ? "rej" : "skip")); if (!acc) ok = false; }
      q("row").innerHTML = plan.map(() => `<i class="draft"></i>`).join("") + `<i class="tgt pending"></i>`; stage = 0;
    };
    [a, k, c].forEach(x => x.addEventListener("input", () => { update(); produced = 0; passes = 0; q("obs").textContent = "–"; newRound(); }));
    update(); newRound(); q("obs").textContent = "–";
    if (reduceMotion()) return;
    loop(dt => {
      timer += dt; if (timer < 0.45) return; timer = 0;
      const cells = q("row").children;
      if (stage < plan.length) { const s = plan[stage]; cells[stage].className = s === "acc" ? "ok" : s === "rej" ? "bad" : "skip"; stage++; if (s !== "acc") { while (stage < plan.length) { cells[stage].className = "skip"; stage++; } } return; }
      if (stage === plan.length) { cells[plan.length].className = "tgt"; produced += plan.filter(x => x === "acc").length + 1; passes++; q("obs").textContent = fmt(produced / passes, 2) + " avg"; stage++; return; }
      newRound();
    });
  }

  /* 7. The product surface: request flow through gateway, router, pools and metering */
  function requestFlow(root) {
    const { controls, visual, wrap } = frame(root, "Lab · follow requests through an inference platform");
    wrap.classList.add("lab-wide");
    const types = {
      free: { label: "Free tier", color: "var(--lab-c5)", path: ["client", "gw", "router", "shared", "meter"], block: 0.35 },
      std: { label: "Standard", color: "var(--lab-c1)", path: ["client", "gw", "router", "shared", "meter"] },
      pri: { label: "Priority ×1.75", color: "var(--lab-c3)", path: ["client", "gw", "router", "shared", "meter"], fast: true },
      eu: { label: "EU regional ×1.1", color: "var(--lab-c4)", path: ["client", "gw", "router", "region", "meter"] },
      batch: { label: "Batch, 24 h", color: "var(--lab-c2)", path: ["client", "gw", "router", "batch", "meter"], slow: true },
      ded: { label: "Dedicated endpoint", color: "var(--lab-c6)", path: ["client", "gw", "ded", "meter"] }
    };
    const pick = chips(controls, "Send traffic of type", Object.entries(types).map(([k, v]) => [k, v.label]), "std");
    controls.appendChild(h(`<p class="lab-note">Click any box to see what the product manager decides there.</p>`));
    const nodes = {
      client: [62, 120, "Developer or app"], gw: [180, 120, "API gateway"], router: [300, 120, "Router and queues"],
      shared: [440, 50, "Shared GPU pool"], region: [440, 110, "EU region pool"], batch: [440, 170, "Batch capacity"], ded: [440, 230, "Dedicated endpoint"], meter: [575, 140, "Metering and billing"]
    };
    const info = {
      client: "Who the customer is decides almost everything else: an AI native startup testing on the free tier, a scale-up on standard, an enterprise needing an SLA, a regulated buyer needing EU processing.",
      gw: "Authentication, API keys, rate limits and quotas. Free tier abuse is stopped here: verification, credit caps, anomaly detection. The PM decides how much friction genuine developers will accept.",
      router: "Chooses the queue and the replica. Mistral's Priority Tier queues ahead of Standard under load and falls back to Standard when limits are exceeded. Routing to replicas that already hold a prompt prefix makes cached input cheap.",
      shared: "Serverless, pay per token. The provider carries the utilisation risk, so margin depends on keeping these GPUs busy across many customers.",
      region: "Regional endpoints keep inference processing in the EU or US for data location and latency. Mistral charges 1.1× for this. The control plane is not made regional.",
      batch: "Work that can wait up to 24 hours. It soaks up idle capacity between peaks, which is why batch can be priced lower.",
      ded: "Capacity reserved for one customer. Predictable latency and isolation. The customer carries the utilisation risk, so it is priced on capacity, not tokens.",
      meter: "Counts input, cached input and output tokens, applies tier and region multipliers and caching discounts, and reports the tier that actually served each request. This is where pricing becomes revenue."
    };
    const links = [["client", "gw"], ["gw", "router"], ["router", "shared"], ["router", "region"], ["router", "batch"], ["gw", "ded"], ["shared", "meter"], ["region", "meter"], ["batch", "meter"], ["ded", "meter"]];
    visual.innerHTML = `<svg class="lab-svg flow" viewBox="0 0 640 270" aria-label="Inference platform request flow">
      ${links.map(([a2, b2]) => `<line x1="${nodes[a2][0] + 52}" y1="${nodes[a2][1]}" x2="${nodes[b2][0] - 52}" y2="${nodes[b2][1]}" class="flow-link"></line>`).join("")}
      ${Object.entries(nodes).map(([key, [x, y, t]]) => `<g class="flow-node" data-node="${key}" tabindex="0" role="button" aria-label="${t}"><rect x="${x - 54}" y="${y - 18}" width="108" height="36" rx="8"></rect><text x="${x}" y="${y + 4}" text-anchor="middle">${t}</text></g>`).join("")}
      <g data-k="packets"></g></svg>
      <div class="flow-info" data-k="info"><strong>API gateway</strong><p>${info.gw}</p></div>`;
    const q = k2 => visual.querySelector(`[data-k="${k2}"]`);
    visual.querySelectorAll(".flow-node").forEach(n => { const show = () => { visual.querySelectorAll(".flow-node").forEach(m => m.classList.toggle("on", m === n)); q("info").innerHTML = `<strong>${nodes[n.dataset.node][2]}</strong><p>${info[n.dataset.node]}</p>`; }; n.addEventListener("click", show); n.addEventListener("keydown", e => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); show(); } }); });
    const pt = key => ({ x: nodes[key][0], y: nodes[key][1] });
    const packets = []; let spawn = 0;
    const g = q("packets");
    if (reduceMotion()) return;
    loop(dt => {
      spawn += dt; const T = types[pick.value];
      if (spawn > (T.slow ? 1.2 : 0.55)) { spawn = 0; const blocked = T.block && Math.random() < T.block; const el = document.createElementNS("http://www.w3.org/2000/svg", "circle"); el.setAttribute("r", 6); el.style.fill = T.color; g.appendChild(el); packets.push({ el, path: T.path.map(pt), seg: 0, f: 0, speed: T.fast ? 1.9 : T.slow ? 0.55 : 1.1, blocked, wait: T.slow ? 1 : 0 }); }
      for (let i = packets.length - 1; i >= 0; i--) {
        const p2 = packets[i];
        if (p2.blocked && p2.seg === 1 && p2.f > 0.05) { p2.el.classList.add("blocked"); p2.dead = (p2.dead || 0) + dt; if (p2.dead > 0.6) { p2.el.remove(); packets.splice(i, 1); } continue; }
        if (p2.wait > 0 && p2.seg === 3) { p2.wait -= dt; continue; }
        p2.f += dt * p2.speed;
        if (p2.f >= 1) { p2.f = 0; p2.seg++; if (p2.seg >= p2.path.length - 1) { p2.el.remove(); packets.splice(i, 1); continue; } }
        const A = p2.path[p2.seg], B = p2.path[p2.seg + 1];
        p2.el.setAttribute("cx", A.x + (B.x - A.x) * p2.f); p2.el.setAttribute("cy", A.y + (B.y - A.y) * p2.f);
      }
    });
  }

  /* 8. Customisation: prompt, retrieval, fine tune, distil, with multi-adapter serving */
  function finetune(root) {
    const { controls, visual } = frame(root, "Lab · choose how to customise");
    const qs = [
      ["know", "Does it need facts that change, or the customer's own documents?"],
      ["style", "Is the gap behaviour, format, tone or domain language, even with good prompts?"],
      ["cost", "Is the main problem cost or latency at high volume?"]
    ];
    const answers = {}; const groups = {};
    qs.forEach(([key, text]) => { groups[key] = chips(controls, text, [["no", "No"], ["yes", "Yes"]], "no"); answers[key] = "no"; groups[key].onChange = () => { answers[key] = groups[key].value; update(); }; });
    const rungs = [["prompt", "Better prompting", "Cheapest and fastest. Always first."], ["rag", "Retrieval (RAG)", "Brings in knowledge that changes. No retraining."], ["lora", "Fine tune with LoRA", "Teaches behaviour and style. Small adapters on a frozen base."], ["distil", "Distil to a smaller model", "Trains a small model on a big model's outputs to cut cost per token."]];
    visual.innerHTML = `<div class="ladder">${rungs.map(([k2, t, d]) => `<div class="rung" data-r="${k2}"><strong>${t}</strong><span>${d}</span></div>`).join("")}</div>
      <p class="lab-caption" data-k="rec"></p>
      <p class="lab-caption">Multi-adapter serving: one base model in GPU memory, many customers' LoRA adapters swapped in per request.</p>
      <div class="lora"><div class="lora-base">Base model<br><small>loaded once</small></div><div class="lora-adapters"><i>Bank</i><i>Insurer</i><i>Retailer</i><i>Ministry</i></div></div>`;
    const update = () => {
      const on = new Set(["prompt"]);
      if (answers.know === "yes") on.add("rag");
      if (answers.style === "yes") on.add("lora");
      if (answers.cost === "yes") on.add("distil");
      visual.querySelectorAll(".rung").forEach(r => r.classList.toggle("on", on.has(r.dataset.r)));
      const list = rungs.filter(r => on.has(r[0])).map(r => r[1]);
      visual.querySelector('[data-k="rec"]').textContent = `Recommendation: ${list.join(", then ")}. Evaluate after each step before adding the next.`;
    };
    update();
  }

  /* 10. Fair evaluation: averages hide the segments that matter */
  function evalStrata(root) {
    const { controls, visual } = frame(root, "Lab · the average hides where the value is");
    const types = [["Clean digital PDFs", 96, 55], ["Structured forms", 91, 22], ["Noisy scans", 79, 15], ["Handwritten", 72, 8]];
    const lift = slider(controls, { label: "Improvement on weak document types", min: 0, max: 20, step: 1, value: 12, format: v => "+" + v + " points", hint: "Applied only to types currently under 85%." });
    const weight = chips(controls, "Overall score weighted by", [["vol", "Document volume"], ["equal", "Each type equally"]], "vol");
    controls.appendChild(h(`<p class="lab-note">Illustrative document mix and accuracies. The point is the pattern, not the numbers.</p>`));
    visual.innerHTML = `<div class="lab-kpis"><div><small>Overall accuracy before</small><strong data-k="b"></strong></div><div><small>Overall accuracy after</small><strong data-k="a"></strong></div><div class="lab-kpi-hero"><small>Weakest type, before → after</small><strong data-k="w"></strong></div></div>
      <div class="strata">${types.map(([n, acc, vol], i) => `<div class="stratum"><span class="s-name">${n}<small>${vol}% of volume</small></span><div class="s-track"><div class="s-base" style="width:${acc}%"></div><div class="s-lift" data-i="${i}"></div><i class="s-target"></i></div><b data-v="${i}"></b></div>`).join("")}</div>
      <div class="lab-legend"><span class="lg w"></span>today <span class="lg kv"></span>improvement <span class="lg target"></span>85% line</div>`;
    const q = k => visual.querySelector(`[data-k="${k}"]`);
    const update = () => {
      const L = Number(lift.value), byVol = weight.value === "vol";
      let wb = 0, wa = 0, wsum = 0;
      types.forEach(([, acc, vol], i) => {
        const add = acc < 85 ? Math.min(L, 100 - acc) : 0, w = byVol ? vol : 1;
        wb += acc * w; wa += (acc + add) * w; wsum += w;
        const bar = visual.querySelector(`.s-lift[data-i="${i}"]`); bar.style.left = acc + "%"; bar.style.width = add + "%";
        visual.querySelector(`[data-v="${i}"]`).textContent = (acc + add) + "%";
      });
      q("b").textContent = (wb / wsum).toFixed(1) + "%"; q("a").textContent = (wa / wsum).toFixed(1) + "%";
      q("w").textContent = `72% → ${Math.min(100, 72 + L)}%`;
    };
    lift.addEventListener("input", update); weight.onChange = update; update();
  }

  /* 11. Voice agent latency budget */
  function latencyBudget(root) {
    const { controls, visual } = frame(root, "Lab · a voice agent has to answer inside a second");
    const s = {
      vad: slider(controls, { label: "Detecting the caller has stopped", min: 100, max: 800, step: 10, value: 300, format: v => v + " ms" }),
      stt: slider(controls, { label: "Speech to text, final words", min: 50, max: 600, step: 10, value: 150, format: v => v + " ms" }),
      rag: slider(controls, { label: "Retrieval", min: 0, max: 800, step: 10, value: 200, format: v => v + " ms" }),
      ttft: slider(controls, { label: "LLM time to first token", min: 50, max: 1500, step: 10, value: 350, format: v => v + " ms" }),
      dec: slider(controls, { label: "LLM output speed", min: 20, max: 200, step: 5, value: 60, format: v => v + " tok/s" }),
      tts: slider(controls, { label: "Text to speech, first audio", min: 50, max: 600, step: 10, value: 150, format: v => v + " ms" }),
      budget: slider(controls, { label: "Target, end of speech to first audio", min: 500, max: 2500, step: 50, value: 1000, format: v => v + " ms" })
    };
    const stream = chips(controls, "Speech starts", [["first", "After the first sentence"], ["full", "After the whole answer"]], "first");
    controls.appendChild(h(`<p class="lab-note">Illustrative timings. First sentence about 15 tokens, whole answer about 80.</p>`));
    const segs = [["vad", "Turn detection", "#9aa7b4"], ["stt", "Speech to text", "#6fb6ff"], ["rag", "Retrieval", "#7a5cd6"], ["llm", "LLM until speakable text", "#ff7a45"], ["tts", "First audio", "#5fe0a8"]];
    visual.innerHTML = `<div class="lab-kpis"><div><small>Caller waits</small><strong data-k="tot"></strong></div><div><small>Against target</small><strong data-k="gap"></strong></div><div class="lab-kpi-hero"><small>Biggest single delay</small><strong data-k="big"></strong></div></div>
      <svg class="lab-svg" viewBox="0 0 520 200" aria-label="Latency waterfall">
        ${segs.map(([k, n], i) => `<text x="0" y="${28 + i * 32}" class="lab-s">${n}</text><rect data-r="${k}" y="${14 + i * 32}" height="20" rx="4" fill="${segs[i][2]}" class="wf"></rect>`).join("")}
        <line data-k="bl" y1="4" y2="176" class="cap-line"></line><text data-k="bt" y="194" class="lab-s">target</text>
        <rect data-k="ph" y="4" width="2" height="172" class="lab-cursor"></rect>
      </svg>
      <div class="call-strip"><div class="call-who caller"><span class="wave" data-k="wcaller"><i></i><i></i><i></i><i></i><i></i></span><small>Caller</small></div>
        <div class="call-mid"><strong data-k="nowstage">Caller speaking</strong><small data-k="nowms"></small></div>
        <div class="call-who agent"><span class="wave" data-k="wagent"><i></i><i></i><i></i><i></i><i></i></span><small>Agent</small></div></div>`;
    const q = k => visual.querySelector(`[data-k="${k}"]`);
    const X0 = 150, W = 360;
    let total = 0, scale = 1, ph = 0, bounds = [];
    const update = () => {
      const v = Object.fromEntries(Object.entries(s).map(([k, el]) => [k, Number(el.value)]));
      const tokens = stream.value === "first" ? 15 : 80;
      const parts = { vad: v.vad, stt: v.stt, rag: v.rag, llm: v.ttft + tokens / v.dec * 1000, tts: v.tts };
      total = Object.values(parts).reduce((a, b) => a + b, 0); scale = W / Math.max(total, v.budget) ;
      let x = X0, acc = 0; bounds = [];
      segs.forEach(([k, n]) => { const r = visual.querySelector(`[data-r="${k}"]`); r.setAttribute("x", x); r.setAttribute("width", Math.max(2, parts[k] * scale)); x += parts[k] * scale; bounds.push([k, n, acc, acc + parts[k]]); acc += parts[k]; });
      const bx = X0 + v.budget * scale; q("bl").setAttribute("x1", bx); q("bl").setAttribute("x2", bx); q("bt").setAttribute("x", bx - 18);
      q("tot").textContent = fmt(total) + " ms";
      const gap = total - v.budget; q("gap").textContent = (gap > 0 ? "+" : "−") + fmt(Math.abs(gap)) + " ms"; q("gap").parentElement.classList.toggle("neg", gap > 0);
      const big = segs.reduce((a, c) => parts[c[0]] > parts[a[0]] ? c : a); q("big").textContent = big[1];
    };
    Object.values(s).forEach(el => el.addEventListener("input", update)); stream.onChange = update; update();
    const draw = () => {
      q("ph").setAttribute("x", X0 + clamp(ph, 0, total) * scale);
      const cur = bounds.find(b2 => ph >= b2[2] && ph < b2[3]);
      segs.forEach(([k]) => visual.querySelector(`[data-r="${k}"]`).classList.toggle("active", !!cur && cur[0] === k));
      const speaking = ph < 0, answering = ph >= total;
      q("wcaller").classList.toggle("on", speaking); q("wagent").classList.toggle("on", answering);
      q("nowstage").textContent = speaking ? "Caller speaking" : answering ? "Agent speaking" : `Silence: ${cur ? cur[1].toLowerCase() : ""}`;
      q("nowms").textContent = speaking ? "" : `caller has waited ${fmt(Math.min(Math.max(ph, 0), total))} ms`;
    };
    if (reduceMotion()) { ph = total; draw(); } else loop(dt => { ph += dt * 1000 * 0.55; if (ph > total + 1200) ph = -1200; draw(); });
  }

  /* 12. Guardrail threshold: false negatives versus false positives */
  function guardrail(root) {
    const { controls, visual } = frame(root, "Lab · tune a safety classifier");
    const prev = slider(controls, { label: "Share of prompts that are actually unsafe", min: 1, max: 30, step: 1, value: 5, format: v => v + "%" });
    const sep = slider(controls, { label: "How well the classifier separates safe from unsafe", min: 0.5, max: 4, step: 0.1, value: 2.2, format: v => v < 1.5 ? "weak" : v < 2.8 ? "good" : "excellent" });
    const thr = slider(controls, { label: "Block when unsafe score is above", min: 0.05, max: 0.95, step: 0.01, value: 0.5, format: v => v.toFixed(2), hint: "Classifiers such as Mistral's Shieldstral return a score you set a threshold on." });
    const allow = h(`<button type="button" class="button lab-play">Try: a guardrail that allows everything</button>`); controls.appendChild(allow);
    const N = 10000;
    const erf = x => { const t = 1 / (1 + 0.3275911 * Math.abs(x)); const y = 1 - (((((1.061405429 * t - 1.453152027) * t) + 1.421413741) * t - 0.284496736) * t + 0.254829592) * t * Math.exp(-x * x); return x >= 0 ? y : -y; };
    const cdf = (x, m, sd) => 0.5 * (1 + erf((x - m) / (sd * Math.SQRT2)));
    visual.innerHTML = `<div class="cm"><div></div><div class="cm-h">Blocked</div><div class="cm-h">Allowed</div>
        <div class="cm-h side">Unsafe</div><div class="cm-c good" data-k="tp"></div><div class="cm-c bad" data-k="fn"></div>
        <div class="cm-h side">Safe</div><div class="cm-c warn" data-k="fp"></div><div class="cm-c good" data-k="tn"></div></div>
      <div class="lab-kpis four"><div><small>Accuracy</small><strong data-k="acc"></strong></div><div><small>Unsafe caught (recall)</small><strong data-k="rec"></strong></div><div><small>Blocks that were right (precision)</small><strong data-k="pre"></strong></div><div><small>Genuine users blocked</small><strong data-k="fpr"></strong></div></div>
      <svg class="lab-svg" viewBox="0 0 520 130" aria-label="Score distributions and threshold">
        <path data-k="ds" class="dist safe"></path><path data-k="du" class="dist unsafe"></path>
        <line data-k="tl" y1="6" y2="112" class="cap-line"></line><line x1="10" x2="510" y1="112" y2="112" class="lab-axis"></line>
        <text x="10" y="126" class="lab-s">score 0, looks safe</text><text x="400" y="126" class="lab-s">score 1, looks unsafe</text>
        <g data-k="rain"></g>
      </svg><div class="lab-legend"><span class="lg served"></span>safe prompts <span class="lg miss"></span>unsafe prompts <span class="lg target"></span>threshold, 10,000 prompts <span class="lg ring"></span>blocked as it lands</div>
      <div class="live-tally"><span>Live stream (unsafe shown more often so you can see them):</span><b class="good" data-k="lc">0</b> caught <b class="bad" data-k="lm">0</b> missed <b class="warn" data-k="lb">0</b> genuine users blocked</div>`;
    const q = k => visual.querySelector(`[data-k="${k}"]`);
    const pdf = (x, m, sd) => Math.exp(-((x - m) ** 2) / (2 * sd * sd));
    let forced = null;
    const update = () => {
      const p = Number(prev.value) / 100, d = Number(sep.value), t = forced ?? Number(thr.value);
      const sd = 0.12, ms = 0.5 - d * sd / 2, mu = 0.5 + d * sd / 2;
      const U = N * p, S = N - U;
      const tp = Math.round(U * (1 - cdf(t, mu, sd))), fn = Math.round(U) - tp, fp = Math.round(S * (1 - cdf(t, ms, sd))), tn = Math.round(S) - fp;
      q("tp").textContent = fmt(tp); q("fn").textContent = fmt(fn); q("fp").textContent = fmt(fp); q("tn").textContent = fmt(tn);
      q("acc").textContent = ((tp + tn) / N * 100).toFixed(1) + "%"; q("rec").textContent = (U ? tp / U * 100 : 0).toFixed(0) + "%";
      q("pre").textContent = tp + fp ? (tp / (tp + fp) * 100).toFixed(0) + "%" : "–"; q("fpr").textContent = (fp / S * 100).toFixed(1) + "%";
      q("rec").parentElement.classList.toggle("neg", tp / U < 0.8); q("fpr").parentElement.classList.toggle("neg", fp / S > 0.05);
      let a = "", b = "";
      for (let i = 0; i <= 100; i++) { const x = i / 100, X = 10 + x * 500; a += (i ? "L" : "M") + X + " " + (112 - pdf(x, ms, sd) * 95 * (1 - p) * 1.4); b += (i ? "L" : "M") + X + " " + (112 - pdf(x, mu, sd) * 95 * Math.max(p, 0.08) * 1.4); }
      q("ds").setAttribute("d", a + "L510 112L10 112Z"); q("du").setAttribute("d", b + "L510 112L10 112Z");
      const tx = 10 + Math.min(1, t) * 500; q("tl").setAttribute("x1", tx); q("tl").setAttribute("x2", tx);
    };
    [prev, sep, thr].forEach(el => el.addEventListener("input", () => { forced = null; allow.textContent = "Try: a guardrail that allows everything"; update(); resetTally(); }));
    allow.addEventListener("click", () => { forced = forced === null ? 1.01 : null; allow.textContent = forced === null ? "Try: a guardrail that allows everything" : "Back to the real classifier"; update(); resetTally(); });
    update();
    const tally = { c: 0, m: 0, b: 0 }, drops = [], rainG = q("rain");
    const resetTally = () => { tally.c = tally.m = tally.b = 0; paintTally(); };
    const paintTally = () => { q("lc").textContent = tally.c; q("lm").textContent = tally.m; q("lb").textContent = tally.b; };
    const gaussR = () => { let u = 0, v = 0; while (!u) u = Math.random(); while (!v) v = Math.random(); return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v); };
    if (reduceMotion()) return;
    let spawn = 0;
    loop(dt => {
      spawn += dt;
      if (spawn > 0.09) {
        spawn = 0;
        const p = Number(prev.value) / 100, d = Number(sep.value), sd = 0.12, ms = 0.5 - d * sd / 2, mu = 0.5 + d * sd / 2;
        const unsafe = Math.random() < Math.max(p, 0.04) * 1.6, score = clamp((unsafe ? mu : ms) + gaussR() * sd, 0.01, 0.99);
        const c = document.createElementNS("http://www.w3.org/2000/svg", "circle");
        c.setAttribute("r", 4); c.setAttribute("cx", 10 + score * 500); c.setAttribute("cy", -6); c.setAttribute("class", "rain " + (unsafe ? "u" : "s"));
        rainG.appendChild(c); drops.push({ el: c, t: 0, unsafe, score, landed: false });
      }
      const thrNow = forced ?? Number(thr.value);
      for (let k = drops.length - 1; k >= 0; k--) {
        const r = drops[k]; r.t += dt / 0.9;
        const e = Math.min(r.t, 1); r.el.setAttribute("cy", -6 + 112 * e * e);
        if (!r.landed && r.t >= 1) {
          r.landed = true; const blocked = r.score > thrNow;
          if (blocked) { r.el.classList.add("hit"); if (r.unsafe) tally.c++; else tally.b++; } else if (r.unsafe) { tally.m++; r.el.classList.add("miss"); }
          paintTally();
        }
        if (r.t > 1) r.el.setAttribute("opacity", Math.max(0, 1 - (r.t - 1) * 3));
        if (r.t > 1.35) { r.el.remove(); drops.splice(k, 1); }
      }
    });
  }

  /* Shared polish: KPI numbers count to their new value, curves draw in on open. */
  function enhance(node) {
    node.querySelectorAll(".lab-curve").forEach(p => { p.setAttribute("pathLength", "1"); p.classList.add("draw-in"); });
    if (reduceMotion() || !window.MutationObserver) return;
    node.querySelectorAll(".lab-kpis strong, .cm-c").forEach(el => {
      let busy = false, prev = el.textContent, raf = 0;
      const parse = s => { const m = s.match(/-?[\d,]*\.?\d+/g); return m && m.length === 1 ? m[0] : null; };
      new MutationObserver(() => {
        if (busy) return;
        const next = el.textContent, a = parse(prev), b = parse(next);
        if (a === null || b === null || prev.replace(a, "") !== next.replace(b, "")) { prev = next; return; }
        const from = Number(a.replace(/,/g, "")), to = Number(b.replace(/,/g, "")), dec = (b.split(".")[1] || "").length, comma = b.includes(",") || Math.abs(to) >= 1000;
        if (from === to) { prev = next; return; }
        cancelAnimationFrame(raf); const start = performance.now(), dur = 380;
        const tick = now => {
          const f = Math.min(1, (now - start) / dur), e = 1 - Math.pow(1 - f, 3), v = from + (to - from) * e;
          const txt = comma ? v.toLocaleString("en-GB", { minimumFractionDigits: dec, maximumFractionDigits: dec }) : v.toFixed(dec);
          busy = true; el.textContent = next.replace(b, txt); busy = false;
          if (f < 1) raf = requestAnimationFrame(tick); else { busy = true; el.textContent = next; busy = false; prev = next; }
        };
        raf = requestAnimationFrame(tick);
      }).observe(el, { childList: true, characterData: true, subtree: true });
    });
  }

  const LABS = { "unit-economics": unitEconomics, "utilisation-day": utilisationDay, "prefill-decode": prefillDecode, "gpu-memory": gpuMemory, batching, speculative, "request-flow": requestFlow, finetune, "eval-strata": evalStrata, "latency-budget": latencyBudget, guardrail };
  window.LearningLabs = {
    mount(container) {
      stopAll();
      container.querySelectorAll("[data-lab]").forEach(node => {
        const fn = LABS[node.dataset.lab];
        if (!fn) return;
        try { fn(node); enhance(node); } catch (error) { node.innerHTML = `<p class="lab-note">This lab could not load: ${error.message}</p>`; }
      });
    },
    stop: stopAll
  };
})();
