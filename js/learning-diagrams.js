/* Animated, self-building system diagrams for the Learning page.
   Vanilla SVG with SMIL motion along edges. No dependencies, works from file://, respects reduced motion.
   Spec: { w, h, nodes:[{id,x,y,w,h,label,sub,icon,tone,at}], edges:[{id,from,to,label,bend,at,tone}],
           steps:[{caption, flow:[edgeIds], focus:[nodeIds], subs:{nodeId:text}}] } */
(function () {
  "use strict";
  const NS = "http://www.w3.org/2000/svg";
  const reduce = () => window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const TONES = { blue: "#6fb6ff", orange: "#ff7a45", green: "#5fe0a8", purple: "#a98bff", yellow: "#ffd166", red: "#ff6b6b", grey: "#9aa7b4", teal: "#3ad1c7" };
  const ICONS = {
    user: '<circle cx="12" cy="8" r="4"/><path d="M4 21c0-4 4-6 8-6s8 2 8 6"/>',
    gateway: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="M8 12h8M13 9l3 3-3 3"/>',
    router: '<circle cx="12" cy="12" r="3"/><path d="M12 3v6M12 15v6M3 12h6M15 12h6"/>',
    gpu: '<rect x="3" y="7" width="18" height="10" rx="2"/><path d="M7 7V4M11 7V4M15 7V4M7 20v-3M11 20v-3M15 20v-3"/><rect x="8" y="10" width="8" height="4"/>',
    memory: '<rect x="3" y="6" width="18" height="12" rx="1"/><path d="M7 6v12M11 6v12M15 6v12M19 6v12"/>',
    db: '<ellipse cx="12" cy="6" rx="8" ry="3"/><path d="M4 6v12c0 1.7 3.6 3 8 3s8-1.3 8-3V6M4 12c0 1.7 3.6 3 8 3s8-1.3 8-3"/>',
    model: '<path d="M12 3l8 4.5v9L12 21l-8-4.5v-9z"/><path d="M12 12l8-4.5M12 12v9M12 12L4 7.5"/>',
    doc: '<path d="M6 3h9l4 4v14H6z"/><path d="M14 3v5h5M9 13h7M9 17h5"/>',
    money: '<circle cx="12" cy="12" r="9"/><path d="M15 9c-.5-1-1.6-1.5-3-1.5-1.8 0-3 .9-3 2.2 0 3 6 1.6 6 4.6 0 1.3-1.3 2.2-3 2.2-1.5 0-2.7-.6-3.2-1.7M12 6v1.5M12 16.5V18"/>',
    clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
    queue: '<rect x="3" y="8" width="4" height="8" rx="1"/><rect x="10" y="8" width="4" height="8" rx="1"/><rect x="17" y="8" width="4" height="8" rx="1"/>',
    shield: '<path d="M12 3l8 3v6c0 5-4 8-8 9-4-1-8-4-8-9V6z"/><path d="M8.5 12l2.5 2.5 4.5-5"/>',
    meter: '<path d="M4 18a8 8 0 1 1 16 0"/><path d="M12 18l4-6"/><circle cx="12" cy="18" r="1.5"/>',
    mic: '<rect x="9" y="3" width="6" height="11" rx="3"/><path d="M5 11a7 7 0 0 0 14 0M12 18v3"/>',
    speaker: '<path d="M4 10h4l5-4v12l-5-4H4z"/><path d="M16 9a4 4 0 0 1 0 6M18.5 6.5a8 8 0 0 1 0 11"/>',
    search: '<circle cx="11" cy="11" r="6"/><path d="M20 20l-4.5-4.5"/>',
    layers: '<path d="M12 3l9 5-9 5-9-5z"/><path d="M3 13l9 5 9-5"/>',
    check: '<circle cx="12" cy="12" r="9"/><path d="M8 12l3 3 5-6"/>',
    globe: '<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c3 3.5 3 14.5 0 18M12 3c-3 3.5-3 14.5 0 18"/>',
    bolt: '<path d="M13 3L5 13h6l-1 8 8-10h-6z"/>',
    plug: '<path d="M9 3v5M15 3v5M7 8h10v4a5 5 0 0 1-10 0zM12 17v4"/>'
  };
  const el = (tag, attrs = {}, parent) => { const n = document.createElementNS(NS, tag); for (const [k, v] of Object.entries(attrs)) n.setAttribute(k, v); if (parent) parent.appendChild(n); return n; };

  function anchor(n, tx, ty) {
    const cx = n.x, cy = n.y, dx = tx - cx, dy = ty - cy;
    if (dx === 0 && dy === 0) return [cx, cy];
    const sx = Math.abs(dx) > 0 ? (n.w / 2) / Math.abs(dx) : Infinity, sy = Math.abs(dy) > 0 ? (n.h / 2) / Math.abs(dy) : Infinity;
    const s = Math.min(sx, sy);
    return [cx + dx * s, cy + dy * s];
  }

  function render(host, spec, title) {
    spec.nodes.forEach(n => { n.w = n.w || 180; n.h = n.h || 58; });
    host.innerHTML = "";
    const wrap = document.createElement("div");
    wrap.className = "dg";
    wrap.innerHTML = `<div class="dg-head"><span class="dg-badge">How it works</span><span class="dg-title">${title || ""}</span><span class="dg-count"></span></div>
      <div class="dg-stage" tabindex="0" role="region" aria-label="Architecture diagram. Scroll horizontally on small screens."></div>
      <div class="dg-caption" aria-live="polite"><span class="dg-n"></span><p></p></div>
      <div class="dg-controls"><button type="button" class="dg-btn" data-a="prev" aria-label="Previous step">◀</button><button type="button" class="dg-btn dg-play" data-a="play">Pause</button><button type="button" class="dg-btn" data-a="next" aria-label="Next step">▶</button><div class="dg-dots"></div><button type="button" class="dg-btn dg-replay" data-a="replay">Replay</button></div>
      <div class="dg-inspector" aria-live="polite"><strong>Explore the components</strong><p>Select a node to read its part in the flow. Dimmed nodes come later in the walkthrough.</p></div>
      <p class="dg-hint">Glowing paths show the current flow, not measured traffic. Select a step to pause and inspect it.</p>`;
    host.appendChild(wrap);
    const stage = wrap.querySelector(".dg-stage");
    const left = Math.min(0, ...spec.nodes.map(n => n.x - n.w / 2)) - 18;
    const top = Math.min(0, ...spec.nodes.map(n => n.y - n.h / 2)) - 18;
    const right = Math.max(spec.w, ...spec.nodes.map(n => n.x + n.w / 2)) + 18;
    const bottom = Math.max(spec.h, ...spec.nodes.map(n => n.y + n.h / 2 + 7)) + 18;
    const svg = el("svg", { viewBox: `${left} ${top} ${right-left} ${bottom-top}`, class: "dg-svg", role: "group", "aria-label": title || "Animated diagram" }, stage);
    const defs = el("defs", {}, svg);
    const uid = "dg" + Math.random().toString(36).slice(2, 9);
    const glow = el("filter", { id: uid + "-glow", x: "-100%", y: "-100%", width: "300%", height: "300%" }, defs);
    el("feGaussianBlur", { stdDeviation: "4", result: "b" }, glow);
    const merge = el("feMerge", {}, glow); el("feMergeNode", { in: "b" }, merge); el("feMergeNode", { in: "SourceGraphic" }, merge);
    const marker = el("marker", { id: uid + "-arrow", viewBox: "0 0 10 10", refX: "9", refY: "5", markerWidth: "7", markerHeight: "7", orient: "auto-start-reverse" }, defs);
    el("path", { d: "M0 0L10 5L0 10z", fill: "#5d7186" }, marker);

    const gEdges = el("g", {}, svg), gNodes = el("g", {}, svg), gFlow = el("g", {}, svg);
    const nodes = Object.fromEntries(spec.nodes.map(n => [n.id, n]));
    const edgeEls = {};
    spec.edges.forEach(e => {
      const a = nodes[e.from], b = nodes[e.to];
      const [x1, y1] = anchor(a, b.x, b.y), [x2, y2] = anchor(b, a.x, a.y);
      const mx = (x1 + x2) / 2, my = (y1 + y2) / 2, bend = e.bend || 0;
      const nx = -(y2 - y1), ny = x2 - x1, len = Math.hypot(nx, ny) || 1;
      const cx = mx + nx / len * bend, cy = my + ny / len * bend;
      const d = bend ? `M${x1} ${y1} Q${cx} ${cy} ${x2} ${y2}` : `M${x1} ${y1} L${x2} ${y2}`;
      const g = el("g", { class: "dg-edge", "data-id": e.id, style: `--edge-tone:${TONES[e.tone || "teal"]}` }, gEdges);
      const p = el("path", { d, id: `${uid}-${e.id}`, class: "dg-path", pathLength: "1", "marker-end": `url(#${uid}-arrow)` }, g);
      el("path", { d, class: "dg-flowline", pathLength: "1" }, g);
      if (e.label) { const t = el("text", { x: bend ? (mx + cx) / 2 : mx, y: (bend ? (my + cy) / 2 : my) - 7, class: "dg-elabel", "text-anchor": "middle" }, g); t.textContent = e.label; }
      edgeEls[e.id] = { g, p, spec: e, length: Math.hypot(x2 - x1, y2 - y1) + Math.abs(bend) };
    });
    const nodeEls = {};
    spec.nodes.forEach(n => {
      const tone = TONES[n.tone || "blue"];
      const gradient = el("linearGradient", { id: `${uid}-fill-${n.id}`, x2: "0.85", y2: "1" }, defs);
      el("stop", { offset: "0", "stop-color": tone, "stop-opacity": ".22" }, gradient);
      el("stop", { offset: "1", "stop-color": "#111b2e" }, gradient);
      const g = el("g", { class: "dg-node", "data-id": n.id, style: `--tone:${tone};--node-fill:url(#${uid}-fill-${n.id})`, tabindex: "0", role: "button", "aria-label": `Inspect ${n.label}`, "aria-pressed": "false" }, gNodes);
      el("rect", { x: n.x - n.w / 2 + 3, y: n.y - n.h / 2 + 7, width: n.w - 6, height: n.h, rx: 12, class: "dg-plinth" }, g);
      el("rect", { x: n.x - n.w / 2, y: n.y - n.h / 2, width: n.w, height: n.h, rx: 12, class: "dg-box" }, g);
      el("path", { d: `M${n.x - n.w / 2 + 14} ${n.y - n.h / 2 + 1}h${n.w - 28}`, class: "dg-capline" }, g);
      const hasIcon = n.icon && ICONS[n.icon];
      if (hasIcon) { const ic = el("g", { transform: `translate(${n.x - n.w / 2 + 12} ${n.y - 12})`, class: "dg-icon", stroke: tone }, g); ic.innerHTML = ICONS[n.icon]; }
      const tx = hasIcon ? n.x - n.w / 2 + 44 : n.x, anchorText = hasIcon ? "start" : "middle";
      const lab = el("text", { x: tx, y: n.sub ? n.y - 3 : n.y + 5, class: "dg-label", "text-anchor": anchorText }, g); lab.textContent = n.label;
      const sub = el("text", { x: tx, y: n.y + 15, class: "dg-sub", "text-anchor": anchorText }, g); sub.textContent = n.sub || "";
      const available = n.w - (hasIcon ? 56 : 24);
      if (lab.getComputedTextLength() > available) { lab.setAttribute("textLength", available); lab.setAttribute("lengthAdjust", "spacingAndGlyphs"); }
      nodeEls[n.id] = { g, sub, base: n.sub || "" };
    });

    const steps = spec.steps; let i = 0, playing = !reduce(), timer = null;
    const dots = wrap.querySelector(".dg-dots");
    dots.innerHTML = steps.map((_, k) => `<button type="button" class="dg-dot" data-k="${k}" aria-label="Step ${k + 1}"></button>`).join("");
    const playBtn = wrap.querySelector(".dg-play");

    function show(k) {
      i = (k + steps.length) % steps.length;
      const s = steps[i];
      spec.nodes.forEach(n => {
        const ne = nodeEls[n.id], vis = (n.at || 0) <= i;
        ne.g.classList.toggle("in", vis); ne.g.classList.toggle("future", !vis);
        ne.g.classList.toggle("focus", vis && (s.focus || []).includes(n.id));
        ne.sub.textContent = (s.subs && s.subs[n.id]) ?? ne.base;
        ne.sub.removeAttribute("textLength"); ne.sub.removeAttribute("lengthAdjust");
        const available = n.w - (n.icon && ICONS[n.icon] ? 56 : 24);
        if (ne.sub.getComputedTextLength() > available) { ne.sub.setAttribute("textLength", available); ne.sub.setAttribute("lengthAdjust", "spacingAndGlyphs"); }
      });
      spec.edges.forEach(e => { const ee = edgeEls[e.id]; const vis = (e.at || 0) <= i && (nodes[e.from].at || 0) <= i && (nodes[e.to].at || 0) <= i; ee.g.classList.toggle("in", vis); ee.g.classList.toggle("live", vis && (s.flow || []).includes(e.id)); });
      gFlow.innerHTML = "";
      if (!reduce()) (s.flow || []).forEach(id => {
        const ee = edgeEls[id]; if (!ee) return;
        const tone = TONES[ee.spec.tone || s.tone || "orange"];
        const dur = Math.max(0.9, ee.length / 160);
        const count = ee.spec.dots || s.dots || 3;
        for (let c = 0; c < count; c++) {
          [[s.big ? 7 : 5, 0.95, 0], [3.4, 0.5, 0.07], [2.4, 0.28, 0.14]].forEach(([r, op, lag]) => {
            const dot = el("circle", { r, fill: tone, opacity: op, filter: lag ? "" : `url(#${uid}-glow)`, class: "dg-particle" }, gFlow);
            const am = el("animateMotion", { dur: dur + "s", repeatCount: "indefinite", begin: (svg.getCurrentTime() + c * dur / count - lag) + "s", rotate: "auto" }, dot);
            el("mpath", { href: `#${uid}-${id}` }, am);
          });
        }
      });
      const cap = wrap.querySelector(".dg-caption");
      cap.classList.remove("swap"); void cap.offsetWidth; cap.classList.add("swap");
      cap.querySelector(".dg-n").textContent = i + 1;
      cap.querySelector("p").textContent = s.caption;
      wrap.querySelector(".dg-count").textContent = `Step ${i + 1} of ${steps.length}`;
      dots.querySelectorAll(".dg-dot").forEach((d, j) => { d.classList.toggle("on", j === i); d.classList.toggle("past", j < i); d.setAttribute("aria-current", j === i ? "step" : "false"); });
    }
    let visible = true;
    function schedule() { clearTimeout(timer); if (playing && visible && !document.hidden) timer = setTimeout(() => { if (!document.body.contains(wrap)) return; if (i === steps.length - 1) { setPlay(false); return; } show(i + 1); schedule(); }, steps[i].ms || 6500); }
    function syncMotion() {
      const moving = playing && visible && !document.hidden;
      wrap.classList.toggle("paused", !moving);
      if (moving && !reduce()) svg.unpauseAnimations(); else svg.pauseAnimations();
      schedule();
    }
    function setPlay(on) {
      playing = on; playBtn.textContent = on ? "Pause" : "Play";
      playBtn.setAttribute("aria-label", on ? "Pause diagram animation" : "Play diagram animation");
      wrap.querySelector(".dg-caption").setAttribute("aria-live", on ? "off" : "polite");
      syncMotion();
    }
    function inspect(id) {
      const node = nodes[id];
      setPlay(false);
      Object.entries(nodeEls).forEach(([key, value]) => { value.g.classList.toggle("selected", key === id); value.g.setAttribute("aria-pressed", String(key === id)); });
      const panel = wrap.querySelector(".dg-inspector");
      panel.querySelector("strong").textContent = node.label;
      const explanations = steps.filter(s => (s.focus || []).includes(id)).map(s => s.caption);
      panel.querySelector("p").textContent = explanations.join(" ") || node.sub || "Follow the connected paths to see this component's role.";
    }
    wrap.addEventListener("click", e => {
      const node = e.target.closest(".dg-node"); if (node) { inspect(node.dataset.id); return; }
      const b = e.target.closest("button"); if (!b) return;
      if (b.dataset.k !== undefined) { show(Number(b.dataset.k)); setPlay(false); return; }
      if (b.dataset.a === "prev") { show(i - 1); setPlay(false); }
      if (b.dataset.a === "next") { show(i + 1); setPlay(false); }
      if (b.dataset.a === "play") setPlay(!playing);
      if (b.dataset.a === "replay") { show(0); setPlay(true); }
    });
    wrap.addEventListener("keydown", e => {
      const node = e.target.closest(".dg-node");
      if (node && (e.key === "Enter" || e.key === " ")) { e.preventDefault(); inspect(node.dataset.id); }
    });
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const motionChanged = () => { setPlay(false); show(i); };
    media.addEventListener("change", motionChanged);
    document.addEventListener("visibilitychange", syncMotion);
    const observer = new IntersectionObserver(entries => { visible = entries[0].isIntersecting; syncMotion(); });
    observer.observe(wrap);
    show(0); setPlay(playing);
    return { stop: () => { clearTimeout(timer); svg.pauseAnimations(); observer.disconnect(); media.removeEventListener("change", motionChanged); document.removeEventListener("visibilitychange", syncMotion); } };
  }

  const live = [];
  window.LearningDiagrams = {
    mount(container) { this.stop(); container.querySelectorAll("[data-diagram]").forEach(node => { const spec = (window.LEARNING_DIAGRAMS || {})[node.dataset.diagram]; if (spec) { try { live.push(render(node, spec, spec.title)); } catch (err) { node.textContent = "Diagram could not load: " + err.message; } } }); },
    stop() { while (live.length) live.pop().stop(); }
  };
})();
