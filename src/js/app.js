(function() {
  const $ = sel => document.querySelector(sel);
  const $$ = sel => document.querySelectorAll(sel);
  const Z = window.Zero1Matrix;

  const STORAGE_KEY = "zero1matrix_history";
  const SETTINGS_KEY = "zero1matrix_settings";
  const DAILY_KEY = "zero1matrix_daily";
  const DAILY_ALGORITHM_VERSION = 3;

  let currentReading = null;

  function getSettings() {
    try {
      return JSON.parse(localStorage.getItem(SETTINGS_KEY)) || { soundEnabled: false, fastMode: false };
    } catch (e) {
      return { soundEnabled: false, fastMode: false };
    }
  }

  function saveSettings(settings) {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  }

  function getDailySeed() {
    const today = new Date();
    return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
  }

  function seededRandom(seed) {
    let h = 2166136261;
    for (let i = 0; i < seed.length; i++) {
      h ^= seed.charCodeAt(i);
      h = Math.imul(h, 16777619) >>> 0;
    }
    return function() {
      h = (h + 0x6D2B79F5) >>> 0;
      let value = h;
      value = Math.imul(value ^ (value >>> 15), value | 1);
      value ^= value + Math.imul(value ^ (value >>> 7), value | 61);
      return ((value ^ (value >>> 14)) >>> 0) / 4294967296;
    };
  }

  function getDailyValuesForSeed(seed) {
    const rand = seededRandom(seed);
    const values = [];
    for (let i = 0; i < 6; i++) {
      const value = rand();
      if (value < 0.125) values.push(6);
      else if (value < 0.5) values.push(7);
      else if (value < 0.875) values.push(8);
      else values.push(9);
    }
    return values;
  }

  function getCachedDailyHexagram(seed) {
    try {
      const cached = JSON.parse(localStorage.getItem(DAILY_KEY));
      if (cached && cached.seed === seed && cached.version === DAILY_ALGORITHM_VERSION &&
          Array.isArray(cached.values) && cached.values.length === 6 &&
          cached.values.every(value => [6, 7, 8, 9].includes(value))) return cached;
    } catch (e) {}
    return null;
  }

  function cacheDailyHexagram(seed, values) {
    localStorage.setItem(DAILY_KEY, JSON.stringify({ seed, version: DAILY_ALGORITHM_VERSION, values }));
  }

  function generateId() {
    return "reading_" + Date.now().toString(36) + "_" + Math.random().toString(36).slice(2, 8);
  }

  function saveReading(reading) {
    const record = {
      id: reading.id || generateId(),
      createdAt: new Date().toISOString(),
      method: reading.method || "coin",
      category: reading.categoryId,
      categoryName: getCategoryName(reading.categoryId),
      casts: reading.values,
      originalHexagramId: reading.originalHex.id,
      changedHexagramId: reading.changedHex.id,
      originalHexagramName: reading.originalHex.fullName,
      changedHexagramName: reading.changedHex.fullName,
      symbol: reading.originalHex.symbol,
      changingLines: reading.changingLines,
      readingMode: "standard",
      oneLine: reading.oneLine,
      scores: reading.scores,
      simple: reading.simple,
      deep: reading.deep
    };
    reading.id = record.id;
    const history = getHistory();
    history.unshift(record);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
    return record;
  }

  function getHistory() {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || []; }
    catch (e) { return []; }
  }

  function getCategoryName(categoryId) {
    const cats = window.Zero1MatrixData.categories;
    const cat = cats.find(c => c.id === categoryId);
    return cat ? cat.name : categoryId;
  }

  function showToast(msg) {
    let toast = $(".toast");
    if (!toast) {
      toast = document.createElement("div");
      toast.className = "toast";
      document.body.appendChild(toast);
    }
    toast.textContent = msg;
    toast.classList.add("show");
    setTimeout(() => toast.classList.remove("show"), 2000);
  }

  function playSound(name) {
    const settings = getSettings();
    if (!settings.soundEnabled) return;
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      gain.gain.value = 0.08;
      if (name === "throw") {
        osc.frequency.value = 280 + Math.random() * 120;
        osc.type = "triangle";
        osc.start();
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.18);
        osc.stop(ctx.currentTime + 0.2);
      } else if (name === "settle") {
        osc.frequency.value = 440;
        osc.type = "sine";
        osc.start();
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);
        osc.stop(ctx.currentTime + 0.35);
      } else if (name === "done") {
        osc.frequency.value = 660;
        osc.type = "sine";
        osc.start();
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5);
        osc.stop(ctx.currentTime + 0.55);
      }
    } catch (e) {}
  }

  function renderScoreBar(value) {
    const color = value >= 70 ? "var(--goldBright)" : value >= 40 ? "var(--gold)" : "var(--goldDim)";
    return `<div class="score-bar"><div class="score-bar-fill" style="width:${value}%;background:${color}"></div></div>`;
  }

  function renderScores(scores) {
    const labels = {
      clarity: "局勢明朗度",
      action: "行動適合度",
      risk: "風險壓力度",
      change: "變化強度",
      support: "人和支援度",
      timing: "時機成熟度"
    };
    return Object.keys(labels).map(k => `
      <div class="score">
        <span>${labels[k]}</span>
        <b>${scores[k]}</b>
        ${renderScoreBar(scores[k])}
      </div>
    `).join("");
  }

  function renderLineScoreAdjust(scoreAdjust) {
    if (!scoreAdjust) return "";
    const labels = { clarity: "明朗", action: "行動", risk: "風險", change: "變化", support: "支援", timing: "時機" };
    return Object.keys(labels).filter(key => Number.isFinite(scoreAdjust[key])).map(key =>
      `<span class="line-score-chip">${labels[key]} ${scoreAdjust[key] >= 0 ? "+" : ""}${scoreAdjust[key]}</span>`
    ).join("");
  }

  function renderChangingLineCategories(details) {
    if (!details || !details.length) return "";
    return `<section class="card">
      <h3>動爻分類解讀</h3>
      <div class="moving-line-list">${details.map(detail => `
        <article class="moving-line-card">
          <h4>${detail.position}${detail.value === 6 ? "六" : "九"} · ${detail.text}</h4>
          ${detail.plain ? `<p class="muted">${detail.plain}</p>` : ""}
          <div class="moving-line-section"><b>分類解讀（${detail.categoryName}）</b><p>${detail.categoryMeaning || detail.meaning}</p></div>
          <div class="moving-line-section advice"><b>行動建議</b><p>${detail.categoryAdvice || detail.advice}</p></div>
          <div class="moving-line-section warning"><b>風險提醒</b><p>${detail.categoryWarning || detail.warning}</p></div>
          ${detail.categoryBasis && detail.categoryBasis.length ? `<div class="moving-line-basis"><span>解讀依據</span>${detail.categoryBasis.map(item => `<span class="badge">${item}</span>`).join("")}</div>` : ""}
          ${detail.categoryScoreAdjust ? `<div class="line-score-adjust">${renderLineScoreAdjust(detail.categoryScoreAdjust)}</div>` : ""}
        </article>`).join("")}</div>
    </section>`;
  }

  function renderHexagramLines(values) {
    const positionNames = ["初", "二", "三", "四", "五", "上"];
    const html = [];
    for (let i = 5; i >= 0; i--) {
      const val = values[i];
      const isYin = val === 6 || val === 8;
      const isChanging = val === 6 || val === 9;
      const displayVal = val === 6 || val === 9 ? (val === 6 ? "六" : "九") : (val === 7 ? "九" : "六");
      const cls = isYin ? "yin" : "yang";
      const chgCls = isChanging ? " changing" : "";
      html.push(`<div class="hexagram-line">
        <span class="line-label">${positionNames[i]}${displayVal}</span>
        <span class="hexagram-line-bar ${cls}${chgCls}">${isYin ? "<span></span><span></span>" : ""}</span>
        ${isChanging ? '<span class="line-arrow">→</span>' : '<span class="line-arrow"></span>'}
      </div>`);
    }
    return html.join("");
  }

  function renderReading(r) {
    const isSelfChanging = r.changingLines.length > 0 && r.originalHex.id === r.changedHex.id;

    let html = `
      <section class="card">
        <div class="card-header">
          <h2>${r.originalHex.symbol} ${r.originalHex.fullName}</h2>
          ${r.changingLines.length > 0 ? `<span class="badge changing">${r.changingLines.length} 爻動</span>` : `<span class="badge">靜卦</span>`}
        </div>
        <div class="muted">${r.upperTrigram}上${r.lowerTrigram}下</div>
        <div class="hexagram-display">
          ${renderHexagramLines(r.values)}
        </div>
        <p style="margin-top:12px;font-family:var(--font-serif);font-size:15px;color:var(--gold)">${r.oneLine}</p>
        ${r.changingLines.length > 0 && !isSelfChanging ? `
          <div style="margin-top:10px">
            <span class="muted">變卦：</span><span style="color:var(--gold)">${r.changedHex.symbol} ${r.changedHex.fullName}</span>
          </div>
        ` : ""}
        <div class="hexagram-badges">
          <span class="badge">${r.originalHex.tone}</span>
          ${r.originalHex.keywords.map(k => `<span class="badge">${k}</span>`).join("")}
        </div>
      </section>

      ${renderClassicFocus(r.interpretationFocus)}

      <section class="card">
        <h3>現代應用層：多維度卦象分數</h3>
        <div class="score-grid">${renderScores(r.scores)}</div>
      </section>

      <section class="card">
        <h3>簡解</h3>
        <div class="pre-wrap">${r.simple.replaceAll("\n", "<br>").replaceAll("建議：", '<br><strong style="color:var(--gold)">建議：</strong>').replaceAll("提醒：", '<br><strong style="color:var(--redMuted)">提醒：</strong>')}</div>
      </section>

      <section class="card">
        <h3>深解</h3>
        <div class="pre-wrap">${r.deep.replaceAll("\n", "<br>")}</div>
      </section>
      ${renderChangingLineCategories(r.changingLineDetails)}
    `;

    if (r.nuclearHex || r.oppositeHex || r.reversedHex) {
      html += `
        <section class="card">
          <button class="toggle-btn" onclick="this.nextElementSibling.classList.toggle('open');this.querySelector('.toggle-arrow').textContent=this.nextElementSibling.classList.contains('open')?'▼':'▶'">
            <span class="toggle-arrow">▶</span> 進階卦象關係
          </button>
          <div class="toggle-content">
            ${r.nuclearHex ? `<p><span class="muted">互卦：</span>${r.nuclearHex.symbol} ${r.nuclearHex.fullName} - ${r.nuclearHex.tone}</p>` : ""}
            ${r.oppositeHex ? `<p><span class="muted">錯卦：</span>${r.oppositeHex.symbol} ${r.oppositeHex.fullName} - ${r.oppositeHex.tone}</p>` : ""}
            ${r.reversedHex ? `<p><span class="muted">綜卦：</span>${r.reversedHex.symbol} ${r.reversedHex.fullName} - ${r.reversedHex.tone}</p>` : ""}
          </div>
        </section>
      `;
    }

    if (r.originalHex.judgement || r.originalHex.image) {
      html += `
        <section class="card">
          <h3>原文資料</h3>
          <p><span class="muted">卦辭：</span>${r.originalHex.judgement}</p>
          <p><span class="muted">象辭：</span>${r.originalHex.image}</p>
          <p class="muted text-sm">底本狀態：64 卦／384 爻已完成修訂號固定的機器交叉核對；權威底本逐葉人工校勘仍明確標為待審。</p>
          ${r.originalHex.goodFor && r.originalHex.goodFor.length ? `<p><span class="muted">宜：</span>${r.originalHex.goodFor.join("、")}</p>` : ""}
          ${r.originalHex.notGoodFor && r.originalHex.notGoodFor.length ? `<p><span class="muted">不宜：</span>${r.originalHex.notGoodFor.join("、")}</p>` : ""}
        </section>
      `;
    }

    html += `
      <section class="card">
        <h3>行動建議</h3>
        <p>${r.originalHex.coreAdvice}</p>
        ${r.pairInterpretation ? `<p style="margin-top:8px"><span class="muted">變化建議：</span>${r.pairInterpretation.advice}</p>` : ""}
        ${getActionSuggestion(r.originalHex.id, r.categoryId)}
        ${getRiskWarning(r.originalHex.id, r.categoryId)}
      </section>
    `;

    html += `
      <section class="card">
        <h3>反思問題</h3>
        <p class="muted">${getReflectionQuestion(r.originalHex.id, r.categoryId)}</p>
      </section>
    `;

    html += `
      <section class="card" style="display:flex;gap:12px;flex-wrap:wrap;justify-content:center">
        <button onclick="window.Zero1MatrixApp.saveCurrentReading()">儲存紀錄</button>
        <button onclick="window.Zero1MatrixApp.exportReadingHTML()" class="secondary">匯出 HTML 報告</button>
        <button onclick="window.Zero1MatrixApp.exportReadingJSON()" class="secondary">匯出 JSON</button>
      </section>
    `;

    const resultEl = $("#result");
    resultEl.innerHTML = html;
    resultEl.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function renderClassicFocus(focus) {
    if (!focus) return "";
    const primary = focus.primary.map(item => `
      <li${item.isPrimary ? ' class="classic-primary"' : ""}>
        <strong>${item.label}${item.isPrimary ? "（主）" : ""}</strong>：${item.text}
      </li>
    `).join("");
    const secondary = focus.secondary.map(item => `<li><strong>${item.label}</strong>：${item.text}</li>`).join("");
    return `
      <section class="card classic-layer">
        <div class="card-header">
          <h3>經典層：判讀主軸</h3>
          <span class="badge">${focus.methodName}</span>
        </div>
        <p class="muted text-sm">${focus.rule}</p>
        <ul class="classic-focus-list">${primary}</ul>
        ${secondary ? `<details><summary>次要參照</summary><ul class="classic-focus-list">${secondary}</ul></details>` : ""}
        <p class="muted text-sm">經典原文優先；分類、分數、行動與風險內容均屬現代應用第二層。</p>
      </section>
    `;
  }

  function getActionSuggestion(hexagramId, categoryId) {
    const item = Z.getActionSuggestion(hexagramId, categoryId);
    if (!item) return "";
    return `<p style="margin-top:8px"><span class="muted">建議：</span>${item.text}</p>`;
  }

  function getRiskWarning(hexagramId, categoryId) {
    const item = Z.getRiskWarning(hexagramId, categoryId);
    if (!item) return "";
    return `<p style="margin-top:4px"><span class="muted">提醒：</span>${item.text}</p>`;
  }

  function getReflectionQuestion(hexagramId, categoryId) {
    const data = window.Zero1MatrixData.reflectionQuestions;
    if (!data || !data.length) return "在「" + getCategoryName(categoryId) + "」這件事上，我現在最需要看清的是時機、風險，還是自己的執念？";
    const filtered = Z.getReflectionQuestions(hexagramId, categoryId);
    if (!filtered.length) return "在「" + getCategoryName(categoryId) + "」這件事上，我現在最需要看清的是時機、風險，還是自己的執念？";
    const q = filtered[Math.floor(Math.random() * filtered.length)];
    return q.question || q.text;
  }

  async function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  function initCategories(selectId) {
    const el = $(selectId);
    if (!el) return;
    el.innerHTML = "";
    window.Zero1MatrixData.categories.forEach(c => {
      const opt = document.createElement("option");
      opt.value = c.id;
      opt.textContent = c.name;
      el.appendChild(opt);
    });
  }

  function saveCurrentReading() {
    if (!currentReading) return;
    saveReading(currentReading);
    showToast("已儲存歷史紀錄");
  }

  function exportReadingHTML() {
    if (!currentReading) return;
    const r = currentReading;
    const html = generateHTMLReport(r);
    downloadFile("yigua-report.html", html, "text/html");
  }

  function exportReadingJSON() {
    if (!currentReading) return;
    const record = {
      id: currentReading.id || generateId(),
      createdAt: new Date().toISOString(),
      method: currentReading.method || "coin",
      category: currentReading.categoryId,
      categoryName: getCategoryName(currentReading.categoryId),
      casts: currentReading.values,
      originalHexagramId: currentReading.originalHex.id,
      changedHexagramId: currentReading.changedHex.id,
      originalHexagramName: currentReading.originalHex.fullName,
      changedHexagramName: currentReading.changedHex.fullName,
      symbol: currentReading.originalHex.symbol,
      changingLines: currentReading.changingLines,
      scores: currentReading.scores,
      oneLine: currentReading.oneLine,
      simple: currentReading.simple,
      deep: currentReading.deep,
      sourceTrace: currentReading.sourceTrace
    };
    downloadFile("yigua-reading.json", JSON.stringify(record, null, 2), "application/json");
  }

  function generateHTMLReport(r) {
    return `<!DOCTYPE html>
<html lang="zh-Hant">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>易卦 解卦報告 - ${r.originalHex.fullName}</title>
  <style>
    :root { --bg: #080706; --panel: rgba(28,23,18,0.88); --text: #f3ead8; --muted: #b9a98d; --gold: #c9a45c; --red: #9f2f24; --line: rgba(201,164,92,.28); --font-serif: "Songti TC","Noto Serif TC","PMingLiU",serif; }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { background: #0b0908; color: var(--text); font-family: "Microsoft JhengHei", sans-serif; line-height: 1.65; max-width: 800px; margin: 0 auto; padding: 32px 16px; }
    h1, h2, h3 { font-family: var(--font-serif); color: var(--gold); margin: 16px 0 8px; }
    .card { border: 1px solid var(--line); background: var(--panel); border-radius: 16px; padding: 20px; margin: 14px 0; }
    .score-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; }
    .score { padding: 12px; border: 1px solid var(--line); border-radius: 12px; text-align: center; }
    .score span { display: block; color: var(--muted); font-size: 12px; }
    .score b { color: var(--gold); font-size: 24px; }
    .muted { color: var(--muted); }
    pre { white-space: pre-wrap; font-family: var(--font-serif); line-height: 1.8; }
    @media print { body { background: white; color: #222; } .card { border-color: #ccc; } }
  </style>
</head>
<body>
  <h1>易卦 解卦報告</h1>
  <div class="card"><p class="muted">起卦時間：${new Date().toLocaleString("zh-TW")}</p><p class="muted">問事分類：${getCategoryName(r.categoryId)}</p><p class="muted">起卦方式：${r.method === "daily" ? "每日一卦" : r.method === "manual" ? "手動排卦" : "三枚銅錢"}</p></div>
  <div class="card"><h2>${r.originalHex.symbol} ${r.originalHex.fullName}</h2>${r.changingLines.length > 0 ? `<p>動爻：${r.changingLines.join("、")} → 變卦：${r.changedHex.symbol} ${r.changedHex.fullName}</p>` : `<p>靜卦</p>`}<p style="color:var(--gold)">${r.oneLine}</p></div>
  <div class="card"><h3>多維度卦象分數</h3><div class="score-grid">${renderScores(r.scores)}</div></div>
  <div class="card"><h3>簡解</h3><pre>${r.simple}</pre></div>
  <div class="card"><h3>深解</h3><pre>${r.deep}</pre></div>
  <div class="card"><h3>原文資料</h3><p><span class="muted">卦辭：</span>${r.originalHex.judgement}</p><p><span class="muted">象辭：</span>${r.originalHex.image}</p></div>
  <p class="muted" style="text-align:center;margin-top:32px">易卦 — Local-first 易經起卦系統</p>
</body>
</html>`;
  }

  function downloadFile(filename, content, mimeType) {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  }

  function castCoinLine() {
    const result = Z.castRandomCoinLine();
    return result;
  }

  function renderCoinCastLog(values, fastMode) {
    const lines = ["初爻", "二爻", "三爻", "四爻", "五爻", "上爻"];
    let html = '<div class="cast-log">';
    for (let i = 5; i >= 0; i--) {
      html += `<div class="cast-line">
        <span>${lines[i]}</span>
        <span>${Z.coinAnimation ? Z.coinAnimation.labelLineValue(values[i]) || values[i] : values[i]}</span>
      </div>`;
    }
    html += '</div>';
    return html;
  }

  async function castWithCoinAnimation() {
    const coinMount = $("#coinMount");
    const settings = getSettings();
    const fastMode = settings.fastMode;
    const values = [];

    if (coinMount && Z.coinAnimation && Z.coinAnimation.renderCoins) {
      Z.coinAnimation.renderCoins(coinMount);
    }

    for (let i = 0; i < 6; i++) {
      const container = coinMount || document.body;

      if (Z.coinAnimation && Z.coinAnimation.throwOneLine) {
        const result = await Z.coinAnimation.throwOneLine(container, fastMode, i);
        values.push(result.value);
      } else {
        const result = Z.castRandomCoinLine();
        values.push(result.value);
        if (!fastMode) await sleep(200);
      }

      playSound("settle");
      if (!fastMode && i < 5) await sleep(70);
    }

    playSound("done");

    if (coinMount) {
      if (Z.coinAnimation && Z.coinAnimation.finishCasting) Z.coinAnimation.finishCasting(coinMount);
      coinMount.insertAdjacentHTML("beforeend", renderCoinCastLog(values, fastMode));
    }

    return values;
  }

  async function handleCoinCast() {
    const castBtn = $("#cast");
    if (!castBtn) return;
    castBtn.disabled = true;
    castBtn.textContent = "起卦中...";

    const categoryEl = $("#category");
    const categoryId = categoryEl ? categoryEl.value : "general";
    const values = await castWithCoinAnimation();

    currentReading = Z.buildReading(values, categoryId);
    currentReading.method = "coin";
    renderReading(currentReading);

    castBtn.disabled = false;
    castBtn.textContent = "擲爻起卦";
  }

  function handleFastCast() {
    const categoryEl = $("#category");
    const categoryId = categoryEl ? categoryEl.value : "general";
    const values = [];
    for (let i = 0; i < 6; i++) {
      values.push(Z.castRandomCoinLine().value);
    }
    currentReading = Z.buildReading(values, categoryId);
    currentReading.method = "coin";
    renderReading(currentReading);
  }

  function handleDailyCast() {
    const seed = getDailySeed();
    const cached = getCachedDailyHexagram(seed);
    const categoryEl = $("#dailyCategory");
    const categoryId = categoryEl ? categoryEl.value : "general";

    if (cached) {
      currentReading = Z.buildReading(cached.values, categoryId);
      currentReading.method = "daily";
      renderReading(currentReading);
      showToast("今日一卦（已快取）：" + seed);
      return;
    }

    const values = getDailyValuesForSeed(seed);

    cacheDailyHexagram(seed, values);
    currentReading = Z.buildReading(values, categoryId);
    currentReading.method = "daily";
    renderReading(currentReading);
  }

  function handleManualCast() {
    const values = [];
    for (let i = 0; i < 6; i++) {
      const el = $("#ml" + i);
      const v = el ? parseInt(el.value) : 7;
      if (v < 6 || v > 9) { showToast("爻值必須為 6, 7, 8, 9"); return; }
      values.push(v);
    }
    const categoryEl = $("#manualCategory");
    const categoryId = categoryEl ? categoryEl.value : "general";
    currentReading = Z.buildReading(values, categoryId);
    currentReading.method = "manual";
    renderReading(currentReading);
  }

  function syncSettingsFromUI() {
    const s = getSettings();
    const fastEl = $("#fastMode");
    const soundEl = $("#soundEnabled");
    if (fastEl) fastEl.checked = s.fastMode;
    if (soundEl) soundEl.checked = s.soundEnabled;
  }

  function syncSettingsToUI() {
    const fastEl = $("#fastMode");
    const soundEl = $("#soundEnabled");
    const cfgFast = $("#cfgFastMode");
    const cfgSound = $("#cfgSound");

    if (fastEl) fastEl.addEventListener("change", () => {
      const s = getSettings();
      s.fastMode = fastEl.checked;
      saveSettings(s);
      syncSettingsPanel();
    });
    if (soundEl) soundEl.addEventListener("change", () => {
      const s = getSettings();
      s.soundEnabled = soundEl.checked;
      saveSettings(s);
      syncSettingsPanel();
    });

    if (cfgFast) cfgFast.addEventListener("change", () => {
      const s = getSettings();
      s.fastMode = cfgFast.checked;
      saveSettings(s);
      syncSettingsFromUI();
    });
    if (cfgSound) cfgSound.addEventListener("change", () => {
      const s = getSettings();
      s.soundEnabled = cfgSound.checked;
      saveSettings(s);
      syncSettingsFromUI();
    });
  }

  function syncSettingsPanel() {
    const s = getSettings();
    const cfgFast = $("#cfgFastMode");
    const cfgSound = $("#cfgSound");
    if (cfgFast) cfgFast.checked = s.fastMode;
    if (cfgSound) cfgSound.checked = s.soundEnabled;
  }

  function initMainPage() {
    initCategories("#category");
    initCategories("#dailyCategory");
    initCategories("#manualCategory");

    syncSettingsFromUI();
    syncSettingsToUI();
    syncSettingsPanel();

    document.querySelectorAll(".tab").forEach(tab => {
      tab.addEventListener("click", () => {
        document.querySelectorAll(".tab").forEach(t => t.classList.remove("active"));
        tab.classList.add("active");
        document.querySelectorAll(".tab-content").forEach(tc => tc.style.display = "none");
        const target = document.getElementById(tab.dataset.tab);
        if (target) target.style.display = "block";
      });
    });

    const castBtn = $("#cast");
    const fastCastBtn = $("#fastCast");
    const dailyCastBtn = $("#dailyCast");
    const manualCastBtn = $("#manualCast");

    const coinMount = $("#coinMount");
    if (coinMount && Z.coinAnimation && Z.coinAnimation.renderCoins) {
      Z.coinAnimation.renderCoins(coinMount);
    }

    if (castBtn) castBtn.addEventListener("click", handleCoinCast);
    if (fastCastBtn) fastCastBtn.addEventListener("click", handleFastCast);
    if (dailyCastBtn) dailyCastBtn.addEventListener("click", handleDailyCast);
    if (manualCastBtn) manualCastBtn.addEventListener("click", handleManualCast);
  }

  document.addEventListener("DOMContentLoaded", () => {
    const isMain = !!$("#cast");
    if (isMain) initMainPage();
  });

  window.Zero1MatrixApp = {
    saveCurrentReading,
    exportReadingHTML,
    exportReadingJSON,
    getHistory,
    renderScores,
    getCategoryName,
    getDailyValuesForSeed
  };
})();
