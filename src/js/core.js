window.Zero1Matrix = window.Zero1Matrix || {};

(function() {
  const Z = window.Zero1Matrix;
  let dataIndexes = null;

  function buildDataIndexes() {
    const data = window.Zero1MatrixData || {};
    const index = {
      hexagramsByLines: new Map(),
      hexagramsById: new Map(),
      lines: new Map(),
      categories: new Map(),
      pairs: new Map(),
      lineCategories: new Map(),
      actions: new Map(),
      risks: new Map(),
      reflections: new Map(),
      classicCanon: new Map()
    };
    for (const item of data.hexagrams || []) {
      index.hexagramsByLines.set(item.lines.join(""), item);
      index.hexagramsById.set(item.id, item);
    }
    for (const item of data.lines || []) index.lines.set(`${item.hexagramId}-${item.line}`, item);
    for (const item of data.categoryInterpretations || []) index.categories.set(`${item.hexagramId}-${item.category}`, item);
    for (const item of data.pairInterpretations || []) index.pairs.set(`${item.from}-${item.to}`, item);
    for (const item of data.lineCategoryInterpretations || []) index.lineCategories.set(`${item.hexagramId}-${item.line}-${item.category}`, item);
    for (const item of data.actionSuggestions || []) index.actions.set(`${item.hexagramId}-${item.category}`, item);
    for (const item of data.riskWarnings || []) index.risks.set(`${item.hexagramId}-${item.category}`, item);
    for (const item of data.classicCanon?.records || []) index.classicCanon.set(item.hexagramId, item);
    for (const item of data.reflectionQuestions || []) {
      const key = `${item.hexagramId}-${item.category}`;
      if (!index.reflections.has(key)) index.reflections.set(key, []);
      index.reflections.get(key).push(item);
    }
    return index;
  }

  Z.getDataIndexes = function() {
    if (!dataIndexes) dataIndexes = buildDataIndexes();
    return dataIndexes;
  };

  Z.resetDataIndexes = function() {
    dataIndexes = null;
  };

  Z.getCategoryInterpretation = (hexagramId, categoryId) => Z.getDataIndexes().categories.get(`${hexagramId}-${categoryId}`) || null;
  Z.getPairInterpretation = (from, to) => Z.getDataIndexes().pairs.get(`${from}-${to}`) || null;
  Z.getLineCategoryInterpretation = (hexagramId, line, categoryId) => Z.getDataIndexes().lineCategories.get(`${hexagramId}-${line}-${categoryId}`) || null;
  Z.getActionSuggestion = (hexagramId, categoryId) => Z.getDataIndexes().actions.get(`${hexagramId}-${categoryId}`) || null;
  Z.getRiskWarning = (hexagramId, categoryId) => Z.getDataIndexes().risks.get(`${hexagramId}-${categoryId}`) || null;
  Z.getReflectionQuestions = (hexagramId, categoryId) => Z.getDataIndexes().reflections.get(`${hexagramId}-${categoryId}`) || [];
  Z.getClassicHexagram = hexagramId => Z.getDataIndexes().classicCanon.get(hexagramId) || null;

  Z.lineValueToYinYang = function(value) {
    if (value === 6 || value === 8) return 0;
    if (value === 7 || value === 9) return 1;
    throw new Error("Invalid line value: " + value);
  };

  Z.isChanging = function(value) {
    return value === 6 || value === 9;
  };

  Z.changedYinYang = function(value) {
    if (value === 6) return 1;
    if (value === 9) return 0;
    return Z.lineValueToYinYang(value);
  };

  Z.coinThrowToLine = function(coins) {
    const sum = coins.reduce((acc, c) => acc + (c === "H" ? 3 : 2), 0);
    if (sum === 6) return 6;
    if (sum === 7) return 7;
    if (sum === 8) return 8;
    if (sum === 9) return 9;
    throw new Error("Invalid coin throw sum: " + sum);
  };

  Z.castRandomCoinLine = function() {
    const coins = [0, 1, 2].map(() => Math.random() < 0.5 ? "H" : "T");
    return { coins, value: Z.coinThrowToLine(coins) };
  };

  Z.linesFromValues = function(values) {
    return values.map(Z.lineValueToYinYang);
  };

  Z.changedLinesFromValues = function(values) {
    return values.map(Z.changedYinYang);
  };

  Z.findHexagramByLines = function(lines) {
    return Z.getDataIndexes().hexagramsByLines.get(lines.join("")) || null;
  };

  Z.getChangingLines = function(values) {
    return values
      .map((v, i) => Z.isChanging(v) ? i + 1 : null)
      .filter(Boolean);
  };

  Z.getTrigram = function(threeLines) {
    const key = threeLines.join("");
    const map = {
      "000": "坤",
      "001": "艮",
      "010": "坎",
      "011": "巽",
      "100": "震",
      "101": "離",
      "110": "兌",
      "111": "乾"
    };
    return map[key] || "未知";
  };

  Z.getNuclearLines = function(lines) {
    return [lines[1], lines[2], lines[3], lines[2], lines[3], lines[4]];
  };

  Z.getOppositeLines = function(lines) {
    return lines.map(v => v ? 0 : 1);
  };

  Z.getReversedLines = function(lines) {
    return [...lines].reverse();
  };

  Z.scoreReading = function(originalHex, changedHex, values, categoryInterpretation) {
    const base = Object.assign({}, originalHex.scores);
    const adj = (categoryInterpretation && categoryInterpretation.scoreAdjust) || {};
    const changingCount = Z.getChangingLines(values).length;
    const result = {};
    ["clarity", "action", "risk", "change", "support", "timing"].forEach(k => {
      let v = base[k] || 50;
      v += adj[k] || 0;
      if (k === "change") v += changingCount * 7;
      if (k === "risk") v += Math.max(0, changingCount - 2) * 5;
      result[k] = Math.max(0, Math.min(100, Math.round(v)));
    });
    return result;
  };

  Z.scoreReadingDetailed = function(originalHex, changedHex, values, categoryInterpretation, pairInterpretation) {
    const dimensions = ["clarity", "action", "risk", "change", "support", "timing"];
    const scores = {};
    const scoreTrace = {};

    dimensions.forEach(k => {
      const items = [];
      const base = originalHex.scores?.[k] ?? 50;
      items.push({
        source: "hexagrams",
        id: String(originalHex.id),
        value: base,
        reason: "本卦基礎分"
      });

      const catAdj = categoryInterpretation?.scoreAdjust?.[k] ?? 0;
      if (catAdj) {
        items.push({
          source: "categoryInterpretations",
          id: categoryInterpretation.id,
          value: catAdj,
          reason: "問事分類修正"
        });
      }

      const pairAdj = pairInterpretation?.scoreAdjust?.[k] ?? 0;
      if (pairAdj) {
        items.push({
          source: "pairInterpretations",
          id: pairInterpretation.id,
          value: pairAdj,
          reason: "本卦變卦轉化修正"
        });
      }

      if (k === "change") {
        const changeAdj = Z.getChangingLines(values).length * 7;
        if (changeAdj > 0) {
          items.push({
            source: "changingLines",
            id: "changing-count",
            value: changeAdj,
            reason: "動爻數量增加變化強度"
          });
        }
      }
      if (k === "risk") {
        const changeCount = Z.getChangingLines(values).length;
        const riskAdj = Math.max(0, changeCount - 2) * 5;
        if (riskAdj > 0) {
          items.push({
            source: "changingLines",
            id: "changing-risk",
            value: riskAdj,
            reason: "動爻超過2，風險壓力增加"
          });
        }
      }

      const raw = items.reduce((sum, x) => sum + x.value, 0);
      const final = Math.max(0, Math.min(100, Math.round(raw)));

      scores[k] = final;
      scoreTrace[k] = { raw, final, items };
    });

    return { scores, scoreTrace };
  };

  Z.getPositionName = function(lineIndex) {
    const positions = ["初", "二", "三", "四", "五", "上"];
    return positions[lineIndex];
  };

  Z.getLineText = function(hexagramId, lineIndex) {
    return Z.getDataIndexes().lines.get(`${hexagramId}-${lineIndex + 1}`) || null;
  };

  Z.getInterpretationFocus = function(originalHex, changedHex, changingLines) {
    const method = window.Zero1MatrixData.interpretationMethod || {};
    const count = changingLines.length;
    const rule = (method.rules || []).find(item => item.changingCount === count) || {};
    const primary = [];
    const secondary = [];
    const originalCanon = Z.getClassicHexagram(originalHex.id);

    const judgementItem = (hex, label) => ({ label, text: Z.getClassicHexagram(hex.id)?.judgement || hex.judgement });
    const lineItem = (hex, lineNumber, label, isPrimary = false) => {
      const line = Z.getLineText(hex.id, lineNumber - 1);
      return { label: `${label}・${line?.position || Z.getPositionName(lineNumber - 1)}`, text: line?.text || "", isPrimary };
    };

    if (count === 0) {
      primary.push(judgementItem(originalHex, "本卦卦辭"));
    } else if (count === 1) {
      primary.push(lineItem(originalHex, changingLines[0], "本卦動爻", true));
      secondary.push(judgementItem(changedHex, "之卦卦辭"));
    } else if (count === 2) {
      const upper = Math.max(...changingLines);
      changingLines.slice().sort((a, b) => a - b).forEach(line => primary.push(lineItem(originalHex, line, "本卦動爻", line === upper)));
      secondary.push(judgementItem(changedHex, "之卦卦辭"));
    } else if (count === 3) {
      primary.push(judgementItem(originalHex, "本卦卦辭（貞）"));
      secondary.push(judgementItem(changedHex, "之卦卦辭（悔）"));
    } else if (count === 4 || count === 5) {
      const unchanged = [1, 2, 3, 4, 5, 6].filter(line => !changingLines.includes(line));
      const main = count === 4 ? Math.min(...unchanged) : unchanged[0];
      unchanged.forEach(line => primary.push(lineItem(changedHex, line, "之卦不變爻", line === main)));
      secondary.push(judgementItem(originalHex, "本卦卦辭"));
    } else if (count === 6 && (originalHex.id === 1 || originalHex.id === 2) && originalCanon?.useText) {
      primary.push({ label: originalCanon.useText.position, text: originalCanon.useText.text, isPrimary: true });
      secondary.push(judgementItem(changedHex, "之卦卦辭"));
    } else {
      primary.push(judgementItem(changedHex, "之卦卦辭"));
      secondary.push(judgementItem(originalHex, "本卦卦辭"));
    }

    return {
      methodId: method.id || "yixue-qimeng-changing-lines",
      methodName: method.name || "《易學啟蒙》多動爻判讀法",
      changingCount: count,
      rule: rule.primary || "依動爻數確定經典判讀主軸",
      primary,
      secondary
    };
  };

  Z.buildReading = function(values, categoryId) {
    const originalLines = Z.linesFromValues(values);
    const changedLines = Z.changedLinesFromValues(values);
    const originalHex = Z.findHexagramByLines(originalLines);
    const changedHex = Z.findHexagramByLines(changedLines);
    const changingLines = Z.getChangingLines(values);

    if (!originalHex) {
      throw new Error("找不到本卦，六爻: " + JSON.stringify(originalLines));
    }
    if (!changedHex) {
      throw new Error("找不到變卦，六爻: " + JSON.stringify(changedLines));
    }

    const cat = Z.getCategoryInterpretation(originalHex.id, categoryId);
    const pair = Z.getPairInterpretation(originalHex.id, changedHex.id);
    const scoreResult = Z.scoreReadingDetailed(originalHex, changedHex, values, cat, pair);
    const scores = scoreResult.scores;
    const scoreTrace = scoreResult.scoreTrace;

    const nuclearLines = Z.getNuclearLines(originalLines);
    const oppositeLines = Z.getOppositeLines(originalLines);
    const reversedLines = Z.getReversedLines(originalLines);
    const nuclearHex = Z.findHexagramByLines(nuclearLines);
    const oppositeHex = Z.findHexagramByLines(oppositeLines);
    const reversedHex = Z.findHexagramByLines(reversedLines);

    const lowerTrigram = Z.getTrigram(originalLines.slice(0, 3));
    const upperTrigram = Z.getTrigram(originalLines.slice(3, 6));

    const changingLineDetails = changingLines.map(lineNum => {
      const lineData = Z.getLineText(originalHex.id, lineNum - 1);
      const lineCat = Z.getLineCategoryInterpretation(originalHex.id, lineNum, categoryId);
      return {
        number: lineNum,
        position: Z.getPositionName(lineNum - 1),
        value: values[lineNum - 1],
        text: lineData ? lineData.text : "",
        plain: lineData ? lineData.plain : "",
        meaning: lineData ? lineData.meaning : "",
        advice: lineData ? lineData.advice : "",
        warning: lineData ? lineData.warning : "",
        lineDataId: lineData ? lineData.id : null,
        lineCategoryId: lineCat ? lineCat.id : null,
        categoryName: lineCat ? lineCat.categoryName : getCategoryName(categoryId),
        categoryMeaning: lineCat ? lineCat.meaning : "",
        categoryAdvice: lineCat ? lineCat.advice : "",
        categoryWarning: lineCat ? lineCat.warning : "",
        categoryBasis: lineCat && Array.isArray(lineCat.basis) ? [...lineCat.basis] : [],
        categoryScoreAdjust: lineCat && lineCat.scoreAdjust ? { ...lineCat.scoreAdjust } : null
      };
    });
    const interpretationFocus = Z.getInterpretationFocus(originalHex, changedHex, changingLines);

    let oneLine = "";
    if (changingLines.length === 0) {
      oneLine = `此卦提醒：${originalHex.summary}`;
    } else if (originalHex.id === changedHex.id) {
      oneLine = `此卦提醒：${pair ? pair.summary : originalHex.summary}`;
    } else {
      oneLine = `此卦提醒：${pair ? pair.summary : originalHex.summary}`;
    }

    let simple = "";
    if (cat) {
      simple = `以「${getCategoryName(categoryId)}」來看，${cat.meaning}\n\n建議：${cat.advice}\n\n提醒：${cat.warning}`;
    } else {
      simple = `${originalHex.summary}\n\n建議：${originalHex.coreAdvice}\n\n提醒：${originalHex.risk}`;
    }

    function getCategoryName(cid) {
      const cats = window.Zero1MatrixData.categories;
      const found = cats.find(c => c.id === cid);
      return found ? found.name : cid;
    }

    const deepLines = [
      `▎本卦：${originalHex.symbol} ${originalHex.fullName}（${upperTrigram}上${lowerTrigram}下）`,
      `▎卦辭：${originalHex.judgement}`,
      `▎象辭：${originalHex.image}`,
      `▎白話：${originalHex.summary}`,
      `▎局勢：${originalHex.situation}`,
      `▎核心建議：${originalHex.coreAdvice}`,
      `▎風險：${originalHex.risk}`
    ];
    deepLines.push(`\n▎經典判讀法：${interpretationFocus.methodName}`);
    deepLines.push(`▎主軸：${interpretationFocus.rule}`);
    interpretationFocus.primary.forEach(item => deepLines.push(`  ${item.label}${item.isPrimary ? "（主）" : ""}：${item.text}`));

    if (changingLines.length > 0) {
      deepLines.push(`\n▎動爻（${changingLines.length} 爻變動）：`);
      changingLineDetails.forEach(d => {
        deepLines.push(`  ${d.position}（${d.value === 6 ? "老陰" : "老陽"}）：${d.text}`);
        if (d.meaning) deepLines.push(`    ${d.meaning}`);
        if (d.categoryMeaning) deepLines.push(`    分類解讀（${d.categoryName}）：${d.categoryMeaning}`);
        if (d.categoryAdvice) deepLines.push(`    分類建議：${d.categoryAdvice}`);
        if (d.categoryWarning) deepLines.push(`    分類提醒：${d.categoryWarning}`);
        if (d.categoryBasis.length) deepLines.push(`    解讀依據：${d.categoryBasis.join("、")}`);
        if (d.categoryScoreAdjust) {
          const scoreLabels = { clarity: "明朗", action: "行動", risk: "風險", change: "變化", support: "支援", timing: "時機" };
          deepLines.push(`    評分參考（分類校正）：${Object.entries(d.categoryScoreAdjust).map(([key, value]) => `${scoreLabels[key] || key} ${value >= 0 ? "+" : ""}${value}`).join("、")}`);
        }
      });
      deepLines.push(`\n▎變卦：${changedHex.symbol} ${changedHex.fullName}`);
      if (pair) {
        deepLines.push(`▎變化：${pair.summary}`);
        deepLines.push(`▎行動建議：${pair.advice}`);
        deepLines.push(`▎風險：${pair.risk}`);
      }
    }

    const sourceTrace = {
      hexagram: [{ file: "hexagrams.data.js", id: `hex-${String(originalHex.id).padStart(3, "0")}`, field: "summary/judgement/image" }],
      category: cat ? [{ file: "categoryInterpretations.data.js", id: cat.id, field: "meaning/advice/warning" }] : [],
      pair: pair ? [{ file: "pairInterpretations.data.js", id: pair.id, field: "summary/advice/risk" }] : [],
      lines: changingLineDetails.map(d => ({
        file: "lines.data.js",
        id: `hex-${String(originalHex.id).padStart(3, "0")}-line-${d.number}`,
        field: "plain/meaning/advice"
      })),
      lineCategories: changingLineDetails.filter(d => d.lineCategoryId).map(d => ({
        file: "lineCategoryInterpretations.data.js",
        id: d.lineCategoryId,
        field: "meaning/advice/warning"
      })),
      scores: [{ source: "scoreRules", field: "all", reason: `changingLines count = ${changingLines.length}` }]
    };

    return {
      values,
      categoryId,
      originalLines,
      changedLines,
      originalHex,
      changedHex,
      changingLines,
      lowerTrigram,
      upperTrigram,
      nuclearLines,
      oppositeLines,
      reversedLines,
      nuclearHex,
      oppositeHex,
      reversedHex,
      categoryInterpretation: cat,
      pairInterpretation: pair,
      scores,
      scoreTrace,
      oneLine,
      simple,
      deep: deepLines.join("\n"),
      changingLineDetails,
      interpretationFocus,
      sourceTrace
    };
  };
})();
