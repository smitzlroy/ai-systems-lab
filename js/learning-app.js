(() => {
  "use strict";
  const KEY = "inference-learning-lab";
  const THEME_KEY = `${KEY}-theme`;
  const $ = selector => document.querySelector(selector);
  const escape = value => String(value ?? "").replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
  const storageWarning = error => {
    $("#storage-notice").hidden = false;
    $("#storage-notice").textContent = `Browser storage could not be used: ${error.message}. Changes may last only for this visit.`;
  };
  const store = {
    get(key, fallback) { try { return localStorage.getItem(key) ?? fallback; } catch (error) { storageWarning(error); return fallback; } },
    set(key, value) { try { localStorage.setItem(key, value); return true; } catch (error) { storageWarning(error); return false; } },
    remove(key) { try { localStorage.removeItem(key); return true; } catch (error) { storageWarning(error); return false; } }
  };
  let progress = (() => { try {
    const v = JSON.parse(store.get(KEY, "{}"));
    if (!v || typeof v !== "object" || Array.isArray(v)) throw new Error("Invalid saved progress");
    return v;
  } catch (error) { storageWarning(error); return {}; } })();
  let current = store.get(`${KEY}-lesson`, "request");
  let topic = "inference";
  let scenarioId = "";
  let sovereigntyPage = "learn";
  const topics = window.LEARNING_TOPICS;
  let toastTimer;

  function notify(message) {
    clearTimeout(toastTimer);
    $("#toast").textContent = message;
    $("#toast").hidden = false;
    toastTimer = setTimeout(() => { $("#toast").hidden = true; }, 4000);
  }
  function save() { if (!store.set(KEY, JSON.stringify(progress))) notify("Progress is kept for this visit only."); }

  function hero(item) {
    return `<section class="topic-hero"><div><p class="eyebrow">${escape(item.code)} / ${escape(item.title)}</p><h1>${escape(item.heading)}</h1><p>${escape(item.intro)}</p><div class="hero-tags"><span>${item.id === "inference" ? "8 interactive lessons" : "Curriculum outline"}</span><span>Systems + product + decisions</span><span>Public sources only</span></div></div><div class="system-art" aria-hidden="true">${item.layers.map(layer => `<div class="system-plane">${escape(layer)}</div>`).join("")}</div></section>`;
  }

  function resourceCards(items) {
    return items.map(r => `<article class="resource-card" data-provider="${escape(r.provider)}" data-topics="${escape(r.topics.join(" "))}" data-search="${escape([r.title,r.provider,r.why,r.task].join(" ").toLowerCase())}">
      <p class="eyebrow">${escape(r.provider)} / ${escape(r.kind)}</p><h3><a href="${escape(r.url)}" target="_blank" rel="noopener noreferrer">${escape(r.title)} ↗</a></h3>
      <p>${escape(r.why)}</p><p class="resource-task"><b>Do something with it</b> ${escape(r.task)}</p><small>${escape(r.access)}</small></article>`).join("");
  }

  function recommended(id, lesson) {
    const all = window.LEARNING_RESEARCH?.resources || [];
    const items = all.filter(r => lesson ? (r.lessons || []).includes(lesson) : r.topics.includes(id)).slice(0, lesson ? 3 : 6);
    if (!items.length) return "";
    return `<section class="recommended section-space"><div class="section-title"><h2>Go deeper, with a purpose</h2><a href="#library">Full source library</a></div><div class="resource-grid">${resourceCards(items)}</div></section>`;
  }

  function scenarioCards(items) {
    return items.map(s=>`<article class="scenario-card"><p class="eyebrow">APPLIED SCENARIO / SYNTHETIC DATA</p><h3><a href="#practice/${escape(s.id)}">${escape(s.title)}</a></h3><p>${escape(s.short)}</p><p><b>The decision</b> ${escape(s.decision)}</p><a class="button" href="#practice/${escape(s.id)}">Work through the scenario</a></article>`).join("");
  }

  function practiceLinks(id, lesson) {
    const items = (window.APPLIED_SCENARIOS || []).filter(s=>lesson?s.lessons.includes(lesson):s.topics.includes(id));
    if (!items.length) return "";
    return `<section class="section-space"><div class="section-title"><h2>Put the theory to work</h2><a href="#practice">All applied scenarios</a></div><p class="muted">Fictional workflows and synthetic data. Practise a decision without using customer records.</p><div class="scenario-grid">${scenarioCards(items)}</div></section>`;
  }

  function practice() {
    const scenarios = window.APPLIED_SCENARIOS;
    if (!scenarios) return `<h1>Scenarios could not load</h1><p>Check that the scenario data script is present.</p>`;
    const boundary = `<aside class="scenario-boundary"><strong>Fictional scenarios. Synthetic data. No customer results.</strong><p>Names, records, figures and outputs here are invented for learning. These workflows illustrate common enterprise problems; they do not describe a particular organisation's deployment, targets or measured outcomes.</p></aside>`;
    if (!scenarioId) {
      return `<section class="library-heading"><p class="eyebrow">APPLIED SCENARIOS</p><h1>Make the theory earn its place.</h1><p>Follow a practical workflow, inspect a small synthetic dataset, diagnose the failure and decide what evidence you would need next.</p></section>${boundary}
        <div class="scenario-grid">${scenarioCards(scenarios)}</div>
        <section class="research-bridge"><h2>Keep four things separate</h2><ol><li><b>Requirement:</b> the outcome a service needs.</li><li><b>Hypothesis:</b> why a proposed change might help.</li><li><b>Measurement:</b> what a controlled test actually observed.</li><li><b>Decision:</b> whether the evidence is sufficient to move forward.</li></ol><p>A proposed target is not an achieved result. A successful demonstration is not proof of production scale, safety or compliance.</p></section>`;
    }
    const scenario = scenarios.find(s=>s.id===scenarioId);
    if (!scenario) return `<h1>Scenario not found</h1><p>This scenario link is not available.</p><a href="#practice">Browse the applied scenarios</a>`;
    return `<a class="scenario-back" href="#practice">← All applied scenarios</a>
      <nav class="scenario-nav" aria-label="Applied scenarios">${scenarios.map(s=>`<a href="#practice/${escape(s.id)}"${s.id===scenarioId?' aria-current="page"':""}>${escape(s.label)}</a>`).join("")}</nav>
      <section class="library-heading"><p class="eyebrow">APPLIED SCENARIO / ${escape(scenario.short)}</p><h1>${escape(scenario.title)}</h1><p>${escape(scenario.problem)}</p></section>${boundary}
      <section class="research-bridge"><h2>The decision to make</h2><p>${escape(scenario.decision)}</p></section>
      <section aria-label="Scenario workflow"><div data-diagram="case-${escape(scenario.id)}"></div></section>
      <section class="section-space"><h2>Connect it to the theory</h2><div class="scenario-concepts">${scenario.concepts.map(([title,text])=>`<article class="roadmap-card"><h3>${escape(title)}</h3><p>${escape(text)}</p></article>`).join("")}</div></section>
      <section class="panel section-space"><h2>Inspect the synthetic data</h2><div class="scenario-table" role="region" aria-label="Synthetic scenario data" tabindex="0"><table><caption>${escape(scenario.data.caption)}</caption><thead><tr>${scenario.data.columns.map(c=>`<th scope="col">${escape(c)}</th>`).join("")}</tr></thead><tbody>${scenario.data.rows.map(row=>`<tr>${row.map((cell,i)=>i===0?`<th scope="row">${escape(cell)}</th>`:`<td>${escape(cell)}</td>`).join("")}</tr>`).join("")}</tbody></table></div>
      <h3 class="section-space">What this example tells you</h3><ol class="scenario-explanation">${scenario.worked.map(t=>`<li>${escape(t)}</li>`).join("")}</ol></section>
      <section class="panel section-space"><fieldset class="scenario-question"><legend>Decision checkpoint</legend><p>${escape(scenario.question)}</p>${scenario.choices.map((choice,i)=>`<label class="scenario-option"><input type="radio" name="scenario-answer" data-scenario-choice="${i}" value="${i}"><span>${escape(choice.text)}</span></label>`).join("")}</fieldset><div id="scenario-feedback" class="scenario-feedback" role="status" hidden></div></section>
      <section class="panel section-space"><h2>Before you call this a successful test</h2><ul class="scenario-explanation">${scenario.evaluate.map(t=>`<li>${escape(t)}</li>`).join("")}</ul><p class="muted">The synthetic exercise does not satisfy this checklist. It shows what a real evaluation would need to establish.</p></section>
      <section class="research-bridge"><p class="eyebrow">CONTROL &amp; SOVEREIGNTY</p><h2>Follow more than the model</h2><p>${escape(scenario.control)}</p><a href="#sovereignty">Explore sovereignty across EMEA</a></section>
      <section class="panel section-space"><h2>Return to the underlying lessons</h2><div class="scenario-lesson-links">${scenario.lessons.map(id=>{const lesson=window.LEARNING_PLAN.lessons.find(l=>l.id===id);return `<a class="button" href="#inference/${escape(id)}">${escape(lesson.title)}</a>`;}).join("")}</div><p class="muted">The diagrams and labs teach relationships; none of their numbers should be read as this scenario's observed performance.</p></section>`;
  }

  function roadmap(item) {
    return hero(item) + `<div class="roadmap-intro"><span class="roadmap-state">PLANNED</span><span>These are the next learning modules, not finished lessons. Start with the curated sources below while the interactive content grows.</span></div>
      <section class="roadmap-grid" aria-label="Planned modules">${item.modules.map(([title,text],i) => `<article class="roadmap-card"><span class="module-number">MODULE ${String(i+1).padStart(2,"0")}</span><h2>${escape(title)}</h2><p>${escape(text)}</p></article>`).join("")}</section>
      <section class="planned-lab"><h2>Build towards an experiment</h2><p>${escape(item.experiment)}</p></section>
      ${item.sources ? `<section class="official-sources"><h2>Start with the primary sources</h2><p>This is a learning syllabus, not legal advice or a compliance assessment. Applicability, implementation dates and national rules need checking for each use case.</p><ul>${item.sources.map(([label,url])=>`<li><a href="${escape(url)}" target="_blank" rel="noopener noreferrer">${escape(label)}</a></li>`).join("")}</ul></section>` : ""}
      ${practiceLinks(item.id)}${recommended(item.id)}`;
  }

  function sovereigntySources(sources) {
    return `<ul class="sovereignty-sources">${sources.map(([label,url])=>`<li><a href="${escape(url)}" target="_blank" rel="noopener noreferrer">${escape(label)} ↗</a></li>`).join("")}</ul>`;
  }

  function sovereignty() {
    const data = window.SOVEREIGNTY;
    if (!data) return `<h1>Sovereignty content could not load</h1><p>Check that the sovereignty data script is present.</p>`;
    const pages = [
      {id:"learn",label:"Start here",heading:"Sovereignty is a set of decisions, not a postcode.",intro:"A plain-English guide to control, responsibility and trust across Europe, the Middle East and Africa. No engineering background required."},
      {id:"atlas",label:"EMEA guide",heading:"Different places. Different rulebooks.",intro:"Find the legal questions that matter before selecting a deployment. Each entry separates the instrument, its status, its practical meaning and the next question to ask."},
      {id:"standards",label:"Badges & evidence",heading:"Read the scope behind the badge.",intro:"A law creates obligations. A standard describes requirements or practices. A certificate, qualification or assurance report provides a particular kind of evidence. None is a universal permission to use AI."},
      {id:"providers",label:"Provider positions",heading:"Translate the sovereignty pitch into questions.",intro:"What Mistral, Microsoft and other providers say, what their offers aim to address, and what a buyer still needs to establish. Different approaches, not a league table."},
      {id:"practice",label:"Decision practice",heading:"Make the case without hiding the unknowns.",intro:"Three fictional business situations. Choose the most useful next step, then practise building an evidence-led recommendation."}
    ];
    const active = pages.find(p=>p.id===sovereigntyPage);
    if (!active) return `<h1>Sovereignty page not found</h1><p>This section link is not available.</p><a href="#sovereignty">Return to the learning guide</a>`;
    const header = `<nav class="scenario-nav sovereignty-nav" aria-label="Sovereignty sections">${pages.map(p=>`<a href="#sovereignty/${p.id}"${p.id===active.id?' aria-current="page"':""}>${escape(p.label)}</a>`).join("")}</nav>
      <section class="library-heading"><p class="eyebrow">EMEA SOVEREIGNTY / ${escape(active.label)}</p><h1>${escape(active.heading)}</h1><p>${escape(active.intro)}</p></section>
      <aside class="sovereignty-note"><strong>Learning, not legal clearance.</strong> Research reviewed ${escape(data.reviewed)}. Summaries are selective; verify current law, applicability and contract terms with qualified advisers. Sources include legislation, regulator guidance, standards-body summaries and clearly labelled vendor positions. Full standards may require purchase.</aside>`;
    let body;
    if (active.id === "learn") {
      body = `<section class="sovereignty-path"><h2>A useful first hour</h2><ol><li><b>Understand the language.</b> Read the four distinctions below and work through the six short lessons.</li><li><b>Choose a place.</b> Open one relevant entry in the <a href="#sovereignty/atlas">EMEA guide</a>; identify what you would need to verify.</li><li><b>Challenge a claim.</b> Compare two <a href="#sovereignty/providers">provider positions</a>, then try the <a href="#sovereignty/practice">decision exercises</a>.</li></ol><p>Leave with a one-page recommendation, not a memorised list of laws.</p></section>
        <section class="section-space"><h2>Four words that are not interchangeable</h2><div class="sovereignty-lenses">${data.lenses.map(([title,text],i)=>`<article><span class="module-number">0${i+1}</span><h3>${escape(title)}</h3><p>${escape(text)}</p></article>`).join("")}</div></section>
        <details class="sovereignty-detail"><summary><span>A small plain-English glossary</span><small>${data.glossary.length} terms you will meet in the guide</small></summary><dl class="sovereignty-glossary">${data.glossary.map(([term,text])=>`<div><dt>${escape(term)}</dt><dd>${escape(text)}</dd></div>`).join("")}</dl></details>
        <section class="section-space"><h2>Learn to lead the conversation</h2><p class="muted">Open a lesson, read the example and complete the short task. There is no technical setup.</p>${data.lessons.map((lesson,i)=>`<details class="sovereignty-detail"${i===0?" open":""}><summary><span>${i+1}. ${escape(lesson.title)}</span><small>${escape(lesson.time)}</small></summary><div class="sovereignty-detail-body"><p class="sovereignty-point">${escape(lesson.point)}</p>${lesson.paragraphs.map(p=>`<p>${escape(p)}</p>`).join("")}<aside class="sovereignty-example">${escape(lesson.example)}</aside><p class="sovereignty-task"><b>Your next useful output</b> ${escape(lesson.task)}</p>${sovereigntySources(lesson.sources)}</div></details>`).join("")}</section>
        <section class="research-bridge"><h2>Control is also an economic choice</h2><p>Ask what local capability, competition, skills, language support and continuity the investment creates. Compare that benefit with cost, service limitations and the responsibilities your organisation takes on. National industrial policy, organisational autonomy and legal compliance overlap, but they are not the same objective.</p><a href="#sovereignty/providers">Explore the different provider approaches</a></section>${practiceLinks("sovereignty")}`;
    } else if (active.id === "atlas") {
      body = `<section class="sovereignty-scope"><h2>What this guide covers</h2><p>${escape(data.scope)}</p><p>Each regime has its own reach: the customer's establishment, people affected, intended use and market served may matter as well as the hosting location. For countries outside this selection, start with the local regulator, official legislation and sector authority; do not extend a neighbouring country's rules by analogy.</p></section>
        <div class="library-filters sovereignty-filters"><label>Find a country or instrument<input id="sovereignty-search" type="search" placeholder="Try PDPL, Kenya, finance or transfer"></label><label>Region<select id="sovereignty-region"><option value="">All regions</option><option>Europe</option><option>Middle East</option><option>Africa</option></select></label></div>
        <p id="sovereignty-count" role="status">${data.countries.length} of ${data.countries.length} guides</p>
        <section aria-label="Country and regional guides">${data.countries.map(country=>`<details class="sovereignty-detail sovereignty-country" data-region="${escape(country.region)}" data-search="${escape(JSON.stringify(country).toLowerCase())}"><summary><span>${escape(country.name)}</span><small>${escape(country.region)} / ${country.rules.length} entries</small></summary><div class="sovereignty-detail-body"><p class="sovereignty-point">${escape(country.hook)}</p>${country.rules.map(rule=>`<article class="sovereignty-rule"><p class="eyebrow">${escape(rule.type)}</p><h3>${escape(rule.title)}</h3><p class="sovereignty-status"><b>Status / scope:</b> ${escape(rule.status)}</p><p>${escape(rule.meaning)}</p><p><b>What to do with this:</b> ${escape(rule.action)}</p>${sovereigntySources(rule.sources)}</article>`).join("")}<aside class="sovereignty-example"><b>Do not overlook:</b> ${escape(country.watch)}</aside><p class="sovereignty-task"><b>Try explaining this:</b> ${escape(country.task)}</p></div></details>`).join("")}</section>
        <p id="sovereignty-empty" hidden>No matching guides. Try another term or choose all regions. An absent country is outside this guide's coverage, not free of obligations.</p>
        <section class="section-space"><h2>Watch next - not a list of current obligations</h2><div class="sovereignty-cards">${data.watchlist.map(item=>`<article class="roadmap-card"><p class="eyebrow">${escape(item.status)}</p><h3>${escape(item.title)}</h3><p>${escape(item.text)}</p>${sovereigntySources(item.sources)}</article>`).join("")}</div></section>`;
    } else if (active.id === "standards") {
      body = `<section class="sovereignty-path"><h2>Use five checks before trusting a badge</h2><ol><li><b>Issuer:</b> who assessed it, and under which scheme?</li><li><b>Object:</b> the organisation, management system, hosting offer or AI application?</li><li><b>Scope:</b> exactly which services, activities, locations and exclusions?</li><li><b>Time:</b> current validity or reporting period, plus changes since assessment?</li><li><b>Your part:</b> which duties and control settings remain with the customer?</li></ol></section>
        <div class="sovereignty-cards section-space">${data.standards.map(s=>`<article class="roadmap-card"><p class="eyebrow">${escape(s.type)}</p><h2>${escape(s.title)}</h2><p><b>What it can support:</b> ${escape(s.proves)}</p><p><b>What it does not establish:</b> ${escape(s.not)}</p><p class="sovereignty-task"><b>Ask for evidence:</b> ${escape(s.ask)}</p>${sovereigntySources(s.sources)}</article>`).join("")}</div>
        <section class="research-bridge"><h2>National rules may require different evidence</h2><p>Saudi NCA controls, Morocco's DGSSI cloud qualification and other national or sector frameworks need their own scope checks. An ISO certificate does not replace them. The EUCS material linked in the watchlist is a candidate document, not evidence that a provider holds a current certificate.</p><a href="#sovereignty/atlas">Return to the country guide and watchlist</a></section>`;
    } else if (active.id === "providers") {
      body = `<aside class="scenario-boundary"><strong>Vendor statements, not independent assurance.</strong><p>These are original summaries of public provider materials, not endorsements, legal conclusions or confirmation of every feature's availability. Compare the exact service, geography, legal entity and contract. No provider is declared universally sovereign or compliant.</p></aside>
        <div class="sovereignty-cards">${data.providers.map(p=>`<article class="roadmap-card sovereignty-provider"><p class="eyebrow">PUBLIC PROVIDER POSITION</p><h2>${escape(p.name)}</h2><h3>${escape(p.lens)}</h3><p>${escape(p.position)}</p><p><b>Published offer:</b> ${escape(p.offers)}</p><p><b>When this lens is useful:</b> ${escape(p.useful)}</p><p><b>Do not assume:</b> ${escape(p.limits)}</p><h4>Three questions to take into the conversation</h4><ol>${p.questions.map(q=>`<li>${escape(q)}</li>`).join("")}</ol>${sovereigntySources(p.sources)}</article>`).join("")}</div>
        <section class="research-bridge"><h2>Use the same comparison for every supplier</h2><p>Compare location and access; legal entities and duties; scope of assurance; control of models and adaptations; continuity and exit; cost and skills. A local operator can use foreign technology; a global supplier can offer local controls. Investigate the actual arrangement rather than treating nationality as the answer.</p><a href="#sovereignty/practice">Practise the decision</a></section>`;
    } else {
      body = `<p class="muted">Every case is fictional. Answers stay on this page, are not saved and do not produce a compliance score.</p>${data.exercises.map(ex=>`<section class="panel section-space"><h2>${escape(ex.title)}</h2><p>${escape(ex.story)}</p><fieldset class="scenario-question"><legend>${escape(ex.question)}</legend>${ex.choices.map(([text],i)=>`<label class="scenario-option"><input type="radio" name="sovereignty-${escape(ex.id)}" data-sovereignty-exercise="${escape(ex.id)}" data-sovereignty-answer="${i}" value="${i}"><span>${escape(text)}</span></label>`).join("")}</fieldset><div id="sovereignty-feedback-${escape(ex.id)}" class="scenario-feedback" role="status" hidden></div><p><b>Keep in mind:</b> ${escape(ex.takeaway)}</p><div class="scenario-lesson-links">${ex.links.map(([text,url])=>`<a href="${escape(url)}">${escape(text)}</a>`).join("")}</div></section>`).join("")}
        <section class="panel section-space"><h2>Your one-page decision brief</h2><p>Use a fictional service. Tick a question when you can explain what evidence you would seek, not when you think compliance has been achieved. Do not enter real customer or personal information here.</p>${data.evidence.map(([title,text],i)=>`<label class="scenario-option"><input type="checkbox" data-sovereignty-evidence="${i}"><span><b>${escape(title)}</b><br>${escape(text)}</span></label>`).join("")}<p id="sovereignty-evidence-count" role="status">0 of ${data.evidence.length} questions considered. Not an approval or compliance assessment.</p><p class="muted">Nothing is submitted, uploaded or saved. In a real process, keep the evidence and approvals in your organisation's authorised system.</p></section>`;
    }
    return header + body;
  }

  function filterSovereignty() {
    const needle = $("#sovereignty-search").value.trim().toLowerCase();
    const region = $("#sovereignty-region").value;
    const cards = [...document.querySelectorAll(".sovereignty-country")];
    let shown = 0;
    cards.forEach(card=>{
      const hit = (!needle || card.dataset.search.includes(needle)) && (!region || card.dataset.region === region);
      card.hidden = !hit;
      if (hit) shown++;
    });
    $("#sovereignty-count").textContent = `${shown} of ${cards.length} guides`;
    $("#sovereignty-empty").hidden = shown > 0;
  }

  function library() {
    const research = window.LEARNING_RESEARCH;
    if (!research) return `<h1>Research could not load</h1><p>Check that the research data script is present.</p>`;
    const providers = [...new Set(research.resources.map(r=>r.provider))];
    return `<section class="library-heading"><p class="eyebrow">STUDY PATH / SOURCE LIBRARY</p><h1>Learn the system, not just the tool.</h1><p>For infrastructure-minded builders connecting technical depth with product decisions, economics and governance. Start with inference; use foundations to fill gaps rather than beginning with a generic AI overview.</p><p class="muted">Research reviewed ${escape(research.reviewed)}. A curated cross-provider selection, not an exhaustive catalogue. Links are references, not endorsements; courses and API usage may require accounts or payment.</p></section>
      <section class="study-path"><h2>A practical route through the material</h2><ol>${research.path.map(s=>`<li><a href="#${escape(s.to)}">${escape(s.title)}</a><p>${escape(s.output)}</p></li>`).join("")}</ol></section>
      <section class="research-bridge"><h2>Sovereignty across EMEA</h2><p>Go beyond the EU syllabus: plain-English lessons, country-specific legal questions, qualifications and provider positions, with primary sources alongside each topic.</p><a href="#sovereignty">Open the sovereignty learning guide</a></section>
      <section class="section-space"><h2>The themes shaping this curriculum</h2><div class="roadmap-grid">${research.themes.map(t=>`<article class="roadmap-card"><h3>${escape(t.title)}</h3><p>${escape(t.text)}</p><p><a href="${escape(t.url)}" target="_blank" rel="noopener noreferrer">Read the primary source ↗</a></p></article>`).join("")}</div></section>
      <section class="section-space"><h2>Choose your next useful resource</h2><div class="library-filters"><input id="resource-search" type="search" aria-label="Search resources" placeholder="Search KV cache, agents, evaluation..."><select id="resource-provider" aria-label="Filter by provider"><option value="">All providers</option>${providers.map(p=>`<option>${escape(p)}</option>`).join("")}</select><select id="resource-topic" aria-label="Filter by topic"><option value="">All topics</option>${topics.map(t=>`<option value="${escape(t.id)}">${escape(t.title)}</option>`).join("")}</select></div><p id="resource-count" role="status">${research.resources.length} resources</p><div class="resource-grid" id="resource-list">${resourceCards(research.resources)}</div><p id="resource-empty" hidden>No matching resources. Try another topic or provider.</p></section>`;
  }

  function view() {
    if (topic === "practice") return practice();
    if (topic === "library") return library();
    if (topic === "sovereignty") return sovereignty();
    const selected = topics.find(t=>t.id === topic);
    if (topic !== "inference") return roadmap(selected);
    const plan = window.LEARNING_PLAN;
    if (!plan || !plan.lessons) return `<div class="empty-state"><h3>Lessons did not load</h3><p>Check that the js folder sits next to index.html.</p></div>`;
    const extras = window.LEARNING_EXTRAS || {};
    const order = ["request","memory","batching","economics","speed","platform","customise","proving"];
    const lessons = [...plan.lessons].sort((a,b)=>order.indexOf(a.id)-order.indexOf(b.id));
    const tabs = [...lessons.map(l => ({ id: l.id, title: l.title, short: l.short, minutes: l.minutes })), { id: "glossary", title: "Glossary", short: "Every term, searchable", minutes: 0 }];
    if (!tabs.some(t => t.id === current)) current = "request";
    const counted = tabs.filter(t => t.id !== "glossary");
    const done = counted.filter(t => progress[`lesson-${t.id}`]).length;
    const percent = Math.round(done / counted.length * 100);
    const index = tabs.findIndex(t => t.id === current);
    const termCards = terms => `<div class="term-grid">${terms.map(term => `<article class="term-card" data-term="${escape((term.t + " " + term.what + " " + term.why + " " + term.like).toLowerCase())}"><h4>${escape(term.t)}</h4><p>${escape(term.what)}</p><p class="term-why"><b>Why it matters</b> ${escape(term.why)}</p><p class="term-like"><b>Think of it like</b> ${escape(term.like)}</p></article>`).join("")}</div>`;
    const pager = `<div class="lesson-pager">${index > 0 ? `<button class="button" data-lesson="${tabs[index - 1].id}">← ${escape(tabs[index - 1].title)}</button>` : "<span></span>"}${index < tabs.length - 1 ? `<button class="button primary" data-lesson="${tabs[index + 1].id}">${escape(tabs[index + 1].title)} →</button>` : ""}</div>`;
    const doneBox = id => `<label class="lesson-done"><input class="check-action" type="checkbox" data-learn="lesson-${escape(id)}" ${progress[`lesson-${id}`] ? "checked" : ""}> I've done this lesson and can explain it without notes</label>`;
    let body;
    if (current === "glossary") {
      const all = plan.lessons.flatMap(l => ((extras[l.id] || {}).terms || [])).sort((a, b) => a.t.localeCompare(b.t));
      body = `<section class="panel lesson-panel"><p class="eyebrow">GLOSSARY · ${all.length} TERMS</p><h2>Every term, in plain English</h2><p class="muted">Each one says what it is, why it matters, and what it is like in infrastructure terms.</p>
        <input id="glossary-filter" class="glossary-filter" type="search" placeholder="Filter terms, for example KV cache, precision, recall" aria-label="Filter glossary">
        ${termCards(all)}<p class="muted glossary-empty" hidden>No matching terms.</p></section>`;
    } else {
      const lesson = plan.lessons.find(l => l.id === current);
      const extra = extras[lesson.id] || {};
      const extension = window.LEARNING_RESEARCH?.extensions[lesson.id];
      const hasDiagram = window.LEARNING_DIAGRAMS && window.LEARNING_DIAGRAMS[lesson.id];
      const n = hasDiagram ? 1 : 0;
      body = `<section class="panel lesson-panel"><p class="eyebrow">LESSON ${index + 1} · ${lesson.minutes} MINUTES</p><h2>${escape(lesson.title)}</h2><p class="muted">${escape(lesson.short)}</p>
        ${hasDiagram ? `<div class="lesson-step"><span class="step-n">1</span><div><h3>Follow the system</h3><p class="muted">Watch the flow, then select a component to understand its role. Pause to explore at your own pace.</p></div></div><div data-diagram="${escape(lesson.id)}"></div>` : ""}
        <div class="lesson-step"><span class="step-n">${1 + n}</span><div><h3>Now change something</h3><ol>${lesson.doThis.map(i => `<li>${escape(i)}</li>`).join("")}</ol></div></div>
        ${lesson.labs.map(lab => `<div class="lab-mount" data-lab="${escape(lab)}"></div>`).join("")}
        ${extra.terms ? `<details class="terms-box" open><summary>What the controls and terms mean <span>${extra.terms.length} terms</span></summary>${termCards(extra.terms)}</details>` : ""}
        <div class="lesson-step"><span class="step-n">${2 + n}</span><div><h3>What you should have noticed</h3><ul>${lesson.notice.map(i => `<li>${escape(i)}</li>`).join("")}</ul></div></div>
        <div class="lesson-step"><span class="step-n">${3 + n}</span><div><h3>What's going on</h3>${lesson.explain.map(i => `<p>${escape(i)}</p>`).join("")}</div></div>
        ${extra.worked ? `<div class="worked"><p class="eyebrow">WORKED EXAMPLE · ${escape(extra.worked.title.toUpperCase())}</p><ol>${extra.worked.steps.map(i => `<li>${escape(i)}</li>`).join("")}</ol></div>` : ""}
        <div class="lesson-step"><span class="step-n">${4 + n}</span><div><h3>Check yourself</h3>${lesson.check.map(i => `<details class="learn-details"><summary>${escape(i.q)}</summary><p>${escape(i.a)}</p></details>`).join("")}</div></div>
        ${extension ? `<aside class="research-bridge"><p class="eyebrow">FROM THE RESEARCH / TAKE IT ONE LEVEL DEEPER</p><h3>${escape(extension.title)}</h3><p>${escape(extension.text)}</p><p><b>Try explaining this:</b> ${escape(extension.task)}</p></aside>` : ""}
        <div class="lesson-sources"><h3>Cross-check with the sources</h3><ul>${lesson.sources.map(i => `<li><a href="${escape(i.u)}" target="_blank" rel="noopener noreferrer">${escape(i.t)}</a><span>${escape(i.n)}</span></li>`).join("")}</ul></div>
        ${doneBox(lesson.id)}</section>${practiceLinks("inference",lesson.id)}${recommended("inference",lesson.id)}`;
    }
    return hero(selected) + `<div class="inference-tools"><p>Recommended order: request → memory → batching → economics → optimisation → platform → customisation → evaluation.</p><button class="button quiet" data-learn-reset>Reset progress</button></div>
      <section class="panel"><div class="learn-progress" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${percent}" aria-label="Lessons completed"><span style="width:${percent}%"></span></div>
        <p class="muted">${done} of ${counted.length} lessons done · progress is saved in this browser only</p>
        <div class="lesson-tabs" id="lesson-tabs">${tabs.map((t, i) => `<button type="button" class="lesson-tab${t.id === current ? " on" : ""}${progress[`lesson-${t.id}`] ? " done" : ""}" data-lesson="${escape(t.id)}"><span class="lesson-num">${t.id === "glossary" ? "A–Z" : progress[`lesson-${t.id}`] ? "✓" : i + 1}</span><strong>${escape(t.title)}</strong><small>${escape(t.short)}${t.minutes ? ` · ${t.minutes} min` : ""}</small></button>`).join("")}</div></section>
      <p class="draft-note">Teaching models, not measured benchmarks. Model names, prices and service terms are illustrative snapshots, not current product guidance. Check the linked official sources before making a real decision.</p>
      <div class="section-space">${body}</div>${pager}`;
  }

  function render() {
    const main = $("#main");
    if (window.LearningLabs) window.LearningLabs.stop();
    if (window.LearningDiagrams) window.LearningDiagrams.stop();
    $("#topic-nav").innerHTML = [...topics,{id:"practice",title:"Applied scenarios",code:"08"},{id:"library",title:"Study path & sources",code:"↗"}].map(t=>`<a class="topic-link" href="#${escape(t.id)}"${t.id===topic?' aria-current="page"':""}><small>${escape(t.code)}</small>${escape(t.title)}</a>`).join("");
    document.title = `${topic === "practice" ? "Applied scenarios" : topic === "library" ? "Study path" : topics.find(t=>t.id===topic).title} · AI Systems Lab`;
    main.innerHTML = view();
    if (window.LearningLabs) window.LearningLabs.mount(main);
    if (window.LearningDiagrams) window.LearningDiagrams.mount(main);
  }

  function setTheme(theme) {
    document.body.dataset.theme = theme;
    const next = theme === "dark" ? "light" : "dark";
    $("#theme-toggle").setAttribute("aria-label", `Switch to ${next} theme`);
    store.set(THEME_KEY, theme);
  }

  document.addEventListener("click", event => {
    const target = event.target.closest("button");
    if (!target) return;
    if (target.id === "theme-toggle") setTheme(document.body.dataset.theme === "dark" ? "light" : "dark");
    if (target.hasAttribute("data-lesson")) {
      store.set(`${KEY}-lesson`, target.dataset.lesson);
      location.hash = `inference/${target.dataset.lesson}`;
    }
    if (target.hasAttribute("data-learn-reset") && confirm("Clear every lesson tick in this browser?")) {
      if (store.remove(KEY)) { progress = {}; render(); notify("Progress reset."); }
    }
  });
  document.addEventListener("input", event => {
    if (event.target.id === "resource-search") filterResources();
    if (event.target.id === "sovereignty-search") filterSovereignty();
    if (event.target.id !== "glossary-filter") return;
    const needle = event.target.value.trim().toLowerCase();
    let shown = 0;
    document.querySelectorAll(".term-card").forEach(card => { const hit = !needle || card.dataset.term.includes(needle); card.hidden = !hit; if (hit) shown++; });
    const none = document.querySelector(".glossary-empty");
    if (none) none.hidden = shown > 0;
  });
  document.addEventListener("change", event => {
    const target = event.target;
    if (target.id === "sovereignty-region") filterSovereignty();
    if (target.hasAttribute("data-sovereignty-answer")) {
      const exercise = window.SOVEREIGNTY?.exercises.find(e=>e.id===target.dataset.sovereigntyExercise);
      const choice = exercise?.choices[Number(target.dataset.sovereigntyAnswer)];
      const feedback = exercise ? $(`#sovereignty-feedback-${exercise.id}`) : null;
      if (!choice || !feedback) { notify("This exercise could not be loaded. Reopen the sovereignty section and try again."); return; }
      feedback.textContent = choice[2];
      feedback.dataset.correct = String(choice[1]);
      feedback.hidden = false;
    }
    if (target.hasAttribute("data-sovereignty-evidence")) {
      const considered = document.querySelectorAll("[data-sovereignty-evidence]:checked").length;
      $("#sovereignty-evidence-count").textContent = `${considered} of ${window.SOVEREIGNTY.evidence.length} questions considered. Not an approval or compliance assessment.`;
    }
    if (target.hasAttribute("data-scenario-choice")) {
      const choice = window.APPLIED_SCENARIOS.find(s=>s.id===scenarioId)?.choices[Number(target.dataset.scenarioChoice)];
      const feedback = $("#scenario-feedback");
      if (!choice || !feedback) { notify("This checkpoint could not be loaded. Reopen the scenario and try again."); return; }
      feedback.textContent = choice.feedback;
      feedback.dataset.correct = String(choice.correct);
      feedback.hidden = false;
    }
    if (["resource-provider","resource-topic"].includes(target.id)) filterResources();
    if (!target.hasAttribute("data-learn")) return;
    if (target.checked) progress[target.dataset.learn] = true; else delete progress[target.dataset.learn];
    save(); render();
  });

  function filterResources() {
    const needle = $("#resource-search").value.trim().toLowerCase();
    const provider = $("#resource-provider").value, selectedTopic = $("#resource-topic").value;
    let count = 0;
    document.querySelectorAll("#resource-list .resource-card").forEach(card=>{
      const hit = (!needle || card.dataset.search.includes(needle)) && (!provider || provider===card.dataset.provider) && (!selectedTopic || card.dataset.topics.split(" ").includes(selectedTopic));
      card.hidden = !hit; if (hit) count++;
    });
    $("#resource-count").textContent = `${count} resources`;
    $("#resource-empty").hidden = count > 0;
  }

  function route() {
    if (location.hash === "#main") return;
    const previousTopic = topic, previousLesson = current, previousScenario = scenarioId, previousSovereignty = sovereigntyPage;
    const [id, lesson] = location.hash.slice(1).split("/");
    topic = ["library","practice"].includes(id) || topics.some(t=>t.id===id) ? id : "inference";
    scenarioId = topic === "practice" ? lesson || "" : "";
    sovereigntyPage = topic === "sovereignty" ? lesson || "learn" : "learn";
    if (topic === "inference" && lesson) current = lesson;
    render();
    if (previousTopic !== topic || previousScenario !== scenarioId || previousSovereignty !== sovereigntyPage) window.scrollTo({top:0,behavior:"instant"});
    else if (previousLesson !== current) $("#lesson-tabs")?.scrollIntoView({block:"start",behavior:"instant"});
  }
  window.addEventListener("hashchange", route);
  setTheme(store.get(THEME_KEY, "dark"));
  route();
})();
