/* RPhdle app logic. Depends on DRUGS (js/drugs.js) and CASES (js/cases.js). */
(() => {
  "use strict";

  const MAX_GUESSES = 6;
  const $ = id => document.getElementById(id);
  const DRUG_MAP = Object.fromEntries(DRUGS.map(d => [d[0].toLowerCase(), d]));
  const isTouch = window.matchMedia("(pointer: coarse)").matches;
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- Session storage (with in-memory fallback) ---------- */
  // Progress lasts for the browser session: it survives reloads but clears when the tab is closed.
  const PREFIX = "rphdle:";
  const mem = {};
  const store = {
    get(k) {
      if (k in mem) return mem[k];
      try { const v = sessionStorage.getItem(PREFIX + k); return v === null ? null : (mem[k] = JSON.parse(v)); }
      catch { return null; }
    },
    set(k, v) {
      mem[k] = v;
      try { sessionStorage.setItem(PREFIX + k, JSON.stringify(v)); } catch { /* storage unavailable */ }
    },
    clear() {
      Object.keys(mem).forEach(k => delete mem[k]);
      try { Object.keys(sessionStorage).filter(k => k.startsWith(PREFIX)).forEach(k => sessionStorage.removeItem(k)); } catch { /* ignore */ }
    }
  };

  const blankState = () => ({ guesses: [], finished: false, won: false, callPick: null, calcAnswer: null, calcRight: null });
  const getState = c => Object.assign(blankState(), store.get("case:" + c.id) || {});

  let caseIdx = null;
  let state = null;
  const currentCase = () => CASES[caseIdx];
  const saveState = () => store.set("case:" + currentCase().id, state);

  /* ---------- Helpers ---------- */
  function hashStr(s) { let h = 2166136261; for (const ch of s) { h ^= ch.charCodeAt(0); h = Math.imul(h, 16777619); } return h >>> 0; }

  // Display order of Round 2 options: wrong answers shuffled per case, correct answer placed at its slot.
  function optionOrder(c) {
    let seed = hashStr(c.id) || 1;
    const rand = () => { seed ^= seed << 13; seed ^= seed >>> 17; seed ^= seed << 5; return (seed >>> 0) / 4294967296; };
    const wrong = c.call.options.map((_, i) => i).filter(i => i !== c.call.correct);
    for (let i = wrong.length - 1; i > 0; i--) { const j = Math.floor(rand() * (i + 1)); [wrong[i], wrong[j]] = [wrong[j], wrong[i]]; }
    const slot = Number.isInteger(c.call.slot) ? c.call.slot : hashStr(c.id) % c.call.options.length;
    wrong.splice(slot, 0, c.call.correct);
    return wrong;
  }

  const callOk = (c, s) => s.callPick === c.call.correct;
  const caseDone = s => s.finished && s.callPick !== null && s.calcAnswer !== null;
  const caseScore = (c, s) => (s.won ? 1 : 0) + (callOk(c, s) ? 1 : 0) + (s.calcRight ? 1 : 0);
  const fmt = n => Number.isInteger(n) ? n.toLocaleString() : (+n.toFixed(3)).toLocaleString();

  function scrollToEl(el, block = "start") {
    if (!el) return;
    el.scrollIntoView({ behavior: reducedMotion ? "auto" : "smooth", block });
  }

  let toastTimer;
  function toast(msg, kind = "") {
    document.querySelectorAll(".toast").forEach(t => t.remove());
    const t = document.createElement("div");
    t.className = "toast " + kind;
    t.setAttribute("role", "status");
    t.textContent = msg;
    document.body.appendChild(t);
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => t.remove(), 2000);
  }

  function shake(el, msg) {
    el.classList.remove("shake"); void el.offsetWidth; el.classList.add("shake");
    setTimeout(() => el.classList.remove("shake"), 400);
    toast(msg, "warn");
  }

  function vibrate(pattern) { if (isTouch && navigator.vibrate) { try { navigator.vibrate(pattern); } catch { /* ignore */ } } }

  /* ---------- Routing: #case-N opens a case, anything else is the list ---------- */
  function route() {
    const m = location.hash.match(/^#case-(\d+)$/);
    const idx = m ? +m[1] - 1 : -1;
    if (idx >= 0 && idx < CASES.length) openCase(idx);
    else showHome();
  }
  function goHome() {
    if (location.hash.startsWith("#case-")) location.hash = "cases";
    else showHome();
  }
  function goCase(i) { location.hash = "case-" + (i + 1); }

  /* ---------- Home ---------- */
  function showHome() {
    caseIdx = null;
    closeSuggest();
    $("viewCase").classList.add("hidden");
    $("viewHome").classList.remove("hidden");
    renderHome();
    window.scrollTo(0, 0);
  }

  function renderHome() {
    let done = 0, points = 0;
    $("caseGrid").innerHTML = CASES.map((c, i) => {
      const s = getState(c);
      const started = s.guesses.length > 0;
      const complete = caseDone(s);
      if (complete) { done++; points += caseScore(c, s); }
      const dot = (played, ok) => `<i class="${played ? (ok ? "ok" : "bad") : ""}"></i>`;
      const status = complete ? `${caseScore(c, s)}/3 points` : started ? "In progress" : "Not started";
      return `<button class="case-tile ${complete ? "complete" : ""}" data-case="${i}">
        <span class="t">Case ${i + 1}</span>
        <span class="dots" aria-hidden="true">${dot(s.finished, s.won)}${dot(s.callPick !== null, callOk(c, s))}${dot(s.calcAnswer !== null, s.calcRight)}</span>
        <span class="s">${status}</span>
      </button>`;
    }).join("");
    $("sessionSummary").innerHTML = done
      ? `<b>${done}</b> of ${CASES.length} done · <b>${points}</b>/${done * 3} points`
      : `${CASES.length} cases · start anywhere`;
    $("resetBtn").classList.toggle("hidden", !anyPlayed());
  }

  function anyPlayed() { return CASES.some(c => getState(c).guesses.length > 0); }

  /* ---------- Case view ---------- */
  function openCase(i) {
    caseIdx = i;
    state = getState(currentCase());
    $("calcInput").value = "";
    $("guessInput").value = "";
    closeSuggest();
    $("viewHome").classList.add("hidden");
    $("viewCase").classList.remove("hidden");
    render();
    window.scrollTo(0, 0);
  }

  function render(opts = {}) {
    const c = currentCase();
    $("caseLabel").textContent = `Case ${caseIdx + 1} of ${CASES.length}`;

    const callDone = state.callPick !== null, calcDone = state.calcAnswer !== null;
    $("p1").className = state.finished ? (state.won ? "ok" : "bad") : "on";
    $("p2").className = callDone ? (callOk(c, state) ? "ok" : "bad") : (state.finished ? "on" : "");
    $("p3").className = calcDone ? (state.calcRight ? "ok" : "bad") : (callDone ? "on" : "");

    // Clues
    const shown = state.finished ? MAX_GUESSES : Math.min(state.guesses.length + 1, MAX_GUESSES);
    const locked = c.clues.length - shown;
    $("clues").innerHTML = c.clues.slice(0, shown).map((cl, i) =>
      `<li class="clue ${opts.freshClue === i ? "fresh" : ""}" id="clue-${i}"><div class="n">${i + 1}</div><div><span class="tag">${cl[0]}</span><div>${cl[1]}</div></div></li>`
    ).join("") + (locked > 0
      ? `<li class="clue locked"><div class="n">🔒</div><div>${locked} more clue${locked === 1 ? "" : "s"} locked. Each miss unlocks one.</div></li>`
      : "");

    $("slots").innerHTML = Array.from({ length: MAX_GUESSES }, (_, i) => {
      const g = state.guesses[i];
      return `<div class="slot ${!g ? "" : (g === c.answer ? "win" : "used")}"></div>`;
    }).join("");

    $("guesses").innerHTML = state.guesses.map((g, i) => {
      const fb = feedback(g);
      const fresh = opts.freshGuess && i === state.guesses.length - 1 ? "fresh" : "";
      return `<div class="g ${fb.cls} ${fresh}">${g}<small>${fb.label}</small></div>`;
    }).join("");

    $("guessArea").classList.toggle("hidden", state.finished);

    // Reveal + Round 2
    $("reveal").classList.toggle("hidden", !state.finished);
    $("roundTwo").classList.toggle("hidden", !state.finished);
    if (state.finished) {
      const d = DRUG_MAP[c.answer.toLowerCase()];
      $("resultBanner").textContent = state.won ? `✓ Verified in ${state.guesses.length}/${MAX_GUESSES}` : "✕ Out of guesses. The drug was:";
      $("resultBanner").className = "result-banner " + (state.won ? "win" : "lose");
      $("answerName").textContent = c.answer;
      $("answerClass").textContent = `${d[1]} · ${d[2]}`;
      $("pearl").innerHTML = `<b>Pharmacist pearl:</b> ${c.pearl}`;
      renderCall();
    }

    // Round 3
    $("roundThree").classList.toggle("hidden", !callDone);
    if (callDone) renderCalc();

    // Done
    const allDone = callDone && calcDone;
    $("done").classList.toggle("hidden", !allDone);
    if (allDone) {
      const score = caseScore(c, state);
      $("doneTitle").textContent = ["Rough case, but now you know", "Case complete", "Solid work", "Clean sweep. Nothing got past you."][score];
      $("doneScore").textContent = `${score}/3`;
      $("doneSub").textContent = `Drug ID ${state.won ? state.guesses.length + "/6" : "X/6"} · The Call ${callOk(c, state) ? "✓" : "✕"} · The Math ${state.calcRight ? "✓" : "✕"}`;
      const next = nextUnfinished();
      $("nextBtn").textContent = next === null ? "Back to all cases" : `Next: Case ${next + 1} →`;
    }
  }

  // Next case after this one that isn't complete; wraps around. null if all complete.
  function nextUnfinished() {
    for (let k = 1; k <= CASES.length; k++) {
      const i = (caseIdx + k) % CASES.length;
      if (i !== caseIdx && !caseDone(getState(CASES[i]))) return i;
    }
    return null;
  }

  function feedback(g) {
    const ans = DRUG_MAP[currentCase().answer.toLowerCase()];
    const d = DRUG_MAP[g.toLowerCase()];
    if (g === currentCase().answer) return { cls: "correct", label: "Correct" };
    if (d[1] === ans[1]) return { cls: "class", label: "Same class: " + d[1] };
    if (d[2] === ans[2]) return { cls: "system", label: "Same area: " + d[2] };
    return { cls: "miss", label: d[2] };
  }

  function renderCall() {
    const c = currentCase(), call = c.call;
    const order = optionOrder(c);
    $("scenario").innerHTML = call.scenario;
    const picked = state.callPick;
    $("options").innerHTML = order.map((orig, pos) => {
      let cls = "";
      if (picked !== null) cls = orig === call.correct ? "right" : orig === picked ? "wrong" : "dim";
      return `<button class="opt ${cls}" data-i="${orig}" ${picked !== null ? "disabled" : ""}><b>${"ABCD"[pos]}</b><span>${call.options[orig]}</span></button>`;
    }).join("");
    if (picked !== null) {
      const ok = picked === call.correct;
      const letter = "ABCD"[order.indexOf(call.correct)];
      $("explain").innerHTML = `<h3 class="${ok ? "ok" : "bad"}">${ok ? "✓ Good call" : "✕ Not quite. Best answer: " + letter}</h3>${call.why}`;
      $("explain").classList.remove("hidden");
    } else {
      $("explain").classList.add("hidden");
    }
  }

  function renderCalc() {
    const calc = currentCase().calc;
    $("calcPrompt").innerHTML = calc.prompt;
    $("calcUnit").textContent = calc.unit;
    const answered = state.calcAnswer !== null;
    $("calcForm").classList.toggle("hidden", answered);
    if (answered) {
      const ok = state.calcRight;
      $("calcExplain").innerHTML =
        `<h3 class="${ok ? "ok" : "bad"}">${ok ? "✓ Correct" : "✕ Not quite"}: you entered ${fmt(state.calcAnswer)}; the answer is ${fmt(calc.answer)} ${calc.unit}</h3>
         <div class="work">${calc.work}</div>`;
      $("calcExplain").classList.remove("hidden");
    } else {
      $("calcExplain").classList.add("hidden");
    }
  }

  /* ---------- Round 1: guessing ---------- */
  let activeSug = -1;
  let sugItems = [];

  function closeSuggest() { $("suggest").style.display = "none"; sugItems = []; activeSug = -1; }

  function updateSuggest() {
    const q = $("guessInput").value.trim().toLowerCase();
    if (!q) { closeSuggest(); return; }
    const used = new Set(state.guesses.map(g => g.toLowerCase()));
    const starts = [], contains = [];
    for (const d of DRUGS) {
      const n = d[0].toLowerCase();
      if (used.has(n)) continue;
      if (n.startsWith(q)) starts.push(d);
      else if (n.includes(q)) contains.push(d);
    }
    sugItems = [...starts.sort((a, b) => a[0].localeCompare(b[0])), ...contains].slice(0, 8);
    activeSug = sugItems.length ? 0 : -1;
    drawSuggest();
  }

  function drawSuggest() {
    const box = $("suggest");
    box.innerHTML = sugItems.length
      ? sugItems.map((d, i) => `<div role="option" class="${i === activeSug ? "active" : ""}" data-name="${d[0]}">${d[0]}</div>`).join("")
      : `<div style="cursor:default;color:var(--muted)">No match in the formulary</div>`;
    box.style.display = "block";
    const act = box.querySelector(".active");
    if (act) act.scrollIntoView({ block: "nearest" });
  }

  function submitGuess(name) {
    if (state.finished) return;
    const input = $("guessInput");
    const raw = (name ?? input.value).trim();
    let d = DRUG_MAP[raw.toLowerCase()];
    if (!d && raw && sugItems.length && activeSug >= 0) d = sugItems[activeSug];
    if (!d) { shake(input, raw ? "Pick a drug from the list" : "Type a drug name first"); return; }
    if (state.guesses.includes(d[0])) { shake(input, "Already guessed"); return; }

    state.guesses.push(d[0]);
    const c = currentCase();
    const correct = d[0] === c.answer;
    if (correct) { state.finished = true; state.won = true; }
    else if (state.guesses.length >= MAX_GUESSES) { state.finished = true; state.won = false; }

    input.value = "";
    closeSuggest();
    saveState();

    const fb = feedback(d[0]);
    const freshClue = !state.finished ? state.guesses.length : undefined;
    render({ freshGuess: true, freshClue });

    if (correct) {
      toast(`✓ ${c.answer}! Verified in ${state.guesses.length}`, "ok");
      vibrate(40);
    } else if (state.finished) {
      toast("Out of guesses", "bad");
      vibrate([60, 60, 60]);
    } else {
      const hint = { class: "🟨 Same class", system: "🟧 Same area", miss: "⬜ Not close" }[fb.cls];
      toast(`${hint}. Clue ${state.guesses.length + 1} unlocked`, fb.cls === "miss" ? "" : "warn");
      vibrate(25);
    }

    if (state.finished) {
      input.blur();
      setTimeout(() => scrollToEl($("reveal")), 120);
    } else if (isTouch) {
      // On phones, drop the keyboard so the newly unlocked clue is actually visible.
      input.blur();
      setTimeout(() => scrollToEl($("clue-" + freshClue), "center"), 120);
    } else {
      input.focus();
    }
  }

  /* ---------- Rounds 2 + 3 ---------- */
  function pickCall(i) {
    if (state.callPick !== null) return;
    state.callPick = i;
    saveState();
    render();
    const ok = callOk(currentCase(), state);
    toast(ok ? "✓ Good call" : "✕ Not quite", ok ? "ok" : "bad");
    vibrate(ok ? 40 : [60, 60, 60]);
    setTimeout(() => scrollToEl($("explain")), 120);
  }

  function submitCalc() {
    if (state.calcAnswer !== null) return;
    const input = $("calcInput");
    const raw = input.value.replace(/[,\s]/g, "");
    if (!/^-?(\d+\.?\d*|\.\d+)$/.test(raw)) { shake(input, "Enter a number"); return; }
    const val = parseFloat(raw);
    const calc = currentCase().calc;
    state.calcAnswer = val;
    state.calcRight = Math.abs(val - calc.answer) <= calc.tol + 1e-9;
    saveState();
    input.blur();
    render();
    toast(state.calcRight ? "✓ Correct" : "✕ Not quite", state.calcRight ? "ok" : "bad");
    vibrate(state.calcRight ? 40 : [60, 60, 60]);
    setTimeout(() => scrollToEl($("calcExplain")), 120);
  }

  /* ---------- Stats (whole session, all cases) ---------- */
  const pct = (a, b) => b ? Math.round(100 * a / b) : 0;

  function showStats() {
    let played = 0, wins = 0, calls = 0, callsRight = 0, calcs = 0, calcsRight = 0, completed = 0, points = 0;
    const dist = [0, 0, 0, 0, 0, 0];
    for (const c of CASES) {
      const s = getState(c);
      if (s.finished) { played++; if (s.won) { wins++; dist[s.guesses.length - 1]++; } }
      if (s.callPick !== null) { calls++; if (callOk(c, s)) callsRight++; }
      if (s.calcAnswer !== null) { calcs++; if (s.calcRight) calcsRight++; }
      if (caseDone(s)) { completed++; points += caseScore(c, s); }
    }
    $("statsGrid").innerHTML = `
      <div><b>${completed}/${CASES.length}</b><span>Cases done</span></div>
      <div><b>${pct(wins, played)}</b><span>Drug ID %</span></div>
      <div><b>${pct(callsRight, calls)}</b><span>Call %</span></div>
      <div><b>${pct(calcsRight, calcs)}</b><span>Math %</span></div>`;
    const max = Math.max(1, ...dist);
    $("dist").innerHTML = dist.map((n, i) =>
      `<div class="dist-row"><b>${i + 1}</b><div class="dist-bar" style="width:${Math.max(7, 100 * n / max)}%">${n}</div></div>`
    ).join("");
    $("callStat").textContent = played
      ? `Drug ID: ${wins}/${played} solved · Pharmacist's Call: ${callsRight}/${calls} · Math: ${calcsRight}/${calcs}`
      : "No cases played yet this session.";
    $("calcStat").textContent = completed ? `Total score: ${points}/${completed * 3} points across ${completed} completed case${completed === 1 ? "" : "s"}` : "";
    $("statsResetBtn").classList.toggle("hidden", !played && !anyPlayed());
    openModal("statsModal");
  }

  function resetSession() {
    if (!confirm("Clear all progress and stats for this session?")) return;
    store.clear();
    closeModals();
    toast("Session reset");
    goHome();
    renderHome();
  }

  /* ---------- Share ---------- */
  function shareText() {
    const c = currentCase();
    const squares = state.guesses.map(g => ({ correct: "🟩", class: "🟨", system: "🟧", miss: "⬜" })[feedback(g).cls]).join("");
    return `RPhdle · Case ${caseIdx + 1} ℞\nDrug ID ${state.won ? state.guesses.length : "X"}/6 ${squares}\nThe Call ${callOk(c, state) ? "✅" : "❌"} · The Math ${state.calcRight ? "✅" : "❌"}`;
  }
  async function share() {
    const text = shareText();
    if (isTouch && navigator.share) {
      try { await navigator.share({ text }); return; } catch (e) { if (e && e.name === "AbortError") return; }
    }
    try { await navigator.clipboard.writeText(text); toast("✓ Copied to clipboard", "ok"); }
    catch { prompt("Copy your result:", text); }
  }

  /* ---------- Modals ---------- */
  function openModal(id) { $(id).classList.remove("hidden"); document.body.classList.add("modal-open"); }
  function closeModals() {
    document.querySelectorAll(".modal-bg").forEach(m => m.classList.add("hidden"));
    document.body.classList.remove("modal-open");
  }

  /* ---------- Events ---------- */
  const gi = $("guessInput");
  gi.addEventListener("input", updateSuggest);
  gi.addEventListener("focus", () => {
    if (gi.value) updateSuggest();
    // On phones, lift the input toward the top so the suggestion list fits above the keyboard.
    if (isTouch) setTimeout(() => scrollToEl($("guessArea")), 300);
  });
  gi.addEventListener("keydown", e => {
    if (e.key === "ArrowDown" && sugItems.length) { e.preventDefault(); activeSug = (activeSug + 1) % sugItems.length; drawSuggest(); }
    else if (e.key === "ArrowUp" && sugItems.length) { e.preventDefault(); activeSug = (activeSug - 1 + sugItems.length) % sugItems.length; drawSuggest(); }
    else if (e.key === "Enter") {
      e.preventDefault();
      const exact = DRUG_MAP[gi.value.trim().toLowerCase()];
      submitGuess(exact ? exact[0] : (activeSug >= 0 && sugItems[activeSug] ? sugItems[activeSug][0] : gi.value));
    }
    else if (e.key === "Escape") closeSuggest();
  });
  // pointerdown (not click) so the choice registers before the input loses focus on touch devices
  $("suggest").addEventListener("pointerdown", e => {
    const el = e.target.closest("[data-name]");
    if (el) { e.preventDefault(); submitGuess(el.dataset.name); }
  });
  document.addEventListener("pointerdown", e => {
    if (!e.target.closest(".guess-wrap")) closeSuggest();
  });
  $("guessBtn").addEventListener("click", () => submitGuess());

  $("options").addEventListener("click", e => {
    const b = e.target.closest(".opt");
    if (b && !b.disabled) pickCall(+b.dataset.i);
  });
  $("calcBtn").addEventListener("click", submitCalc);
  $("calcInput").addEventListener("keydown", e => { if (e.key === "Enter") { e.preventDefault(); submitCalc(); } });

  $("caseGrid").addEventListener("click", e => {
    const b = e.target.closest("[data-case]");
    if (b) goCase(+b.dataset.case);
  });
  $("nextBtn").addEventListener("click", () => {
    const next = nextUnfinished();
    if (next === null) goHome(); else goCase(next);
  });
  $("replayBtn").addEventListener("click", () => {
    state = blankState();
    saveState();
    $("calcInput").value = "";
    render();
    window.scrollTo({ top: 0, behavior: reducedMotion ? "auto" : "smooth" });
    toast("Case reset");
  });
  $("shareBtn").addEventListener("click", share);
  $("backBtn").addEventListener("click", goHome);
  $("homeLogo").addEventListener("click", goHome);
  $("btnCases").addEventListener("click", goHome);
  $("btnHelp").addEventListener("click", () => openModal("helpModal"));
  $("btnStats").addEventListener("click", showStats);
  $("resetBtn").addEventListener("click", resetSession);
  $("statsResetBtn").addEventListener("click", resetSession);

  document.querySelectorAll(".modal-bg").forEach(bg => {
    bg.addEventListener("click", e => { if (e.target === bg || e.target.closest("[data-close]")) closeModals(); });
  });
  document.addEventListener("keydown", e => { if (e.key === "Escape") closeModals(); });
  window.addEventListener("hashchange", route);

  /* ---------- Init ---------- */
  route();
})();
