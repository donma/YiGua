window.Zero1MatrixHistorySafety = (function() {
  const MAX_IMPORT_BYTES = 5 * 1024 * 1024;
  const MAX_IMPORT_RECORDS = 1000;
  const MAX_STORED_RECORDS = 2000;
  const CATEGORIES = new Set(["general", "career", "love", "money", "people", "family", "study", "health", "decision", "business", "legal", "spiritual"]);
  const SCORE_KEYS = ["clarity", "action", "risk", "change", "support", "timing"];

  function escapeHTML(value) {
    return String(value ?? "").replace(/[&<>'"]/g, char => ({
      "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;"
    })[char]);
  }

  function cleanText(value, field, maxLength, required) {
    if (value == null && !required) return "";
    if (typeof value !== "string") throw new Error(`${field} 必須是文字`);
    const cleaned = value.replace(/\u0000/g, "").trim();
    if (required && !cleaned) throw new Error(`${field} 不可為空`);
    if (cleaned.length > maxLength) throw new Error(`${field} 超過 ${maxLength} 字元`);
    return cleaned;
  }

  function localHexagram(id) {
    const rows = window.Zero1MatrixData?.hexagrams || [];
    return rows.find(row => row.id === id) || null;
  }

  function localCategory(id) {
    const rows = window.Zero1MatrixData?.categories || [];
    return rows.find(row => row.id === id) || null;
  }

  function sanitizeRecord(raw, fallbackId) {
    if (!raw || typeof raw !== "object" || Array.isArray(raw)) throw new Error("每筆紀錄必須是物件");
    if (!Array.isArray(raw.casts) || raw.casts.length !== 6 || !raw.casts.every(value => Number.isInteger(value) && value >= 6 && value <= 9)) {
      throw new Error("casts 必須是 6 個 6/7/8/9 爻值");
    }
    const originalId = Number(raw.originalHexagramId);
    const changedId = Number(raw.changedHexagramId);
    const original = localHexagram(originalId);
    const changed = localHexagram(changedId);
    if (!Number.isInteger(originalId) || !original || !Number.isInteger(changedId) || !changed) throw new Error("本卦或變卦 ID 無效");
    if (!CATEGORIES.has(raw.category)) throw new Error("category 無效");
    const category = localCategory(raw.category);
    const timestamp = Date.parse(raw.createdAt);
    if (!Number.isFinite(timestamp)) throw new Error("createdAt 無效");
    const id = typeof raw.id === "string" && /^[A-Za-z0-9_-]{1,100}$/.test(raw.id) ? raw.id : fallbackId;
    if (!id) throw new Error("id 無效");
    const scores = {};
    if (raw.scores != null && (typeof raw.scores !== "object" || Array.isArray(raw.scores))) throw new Error("scores 必須是物件");
    for (const key of SCORE_KEYS) {
      const value = raw.scores?.[key];
      if (value == null) continue;
      if (!Number.isFinite(value) || value < 0 || value > 100) throw new Error(`scores.${key} 必須介於 0 到 100`);
      scores[key] = Math.round(value);
    }
    const changingLines = raw.casts.map((value, index) => value === 6 || value === 9 ? index + 1 : null).filter(Boolean);
    return {
      id,
      createdAt: new Date(timestamp).toISOString(),
      method: ["coin", "daily", "manual", "imported"].includes(raw.method) ? raw.method : "imported",
      category: raw.category,
      categoryName: category?.name || raw.category,
      casts: [...raw.casts],
      originalHexagramId: originalId,
      changedHexagramId: changedId,
      originalHexagramName: original.fullName,
      changedHexagramName: changed.fullName,
      symbol: original.symbol,
      changingLines,
      readingMode: raw.readingMode === "standard" ? "standard" : "standard",
      oneLine: cleanText(raw.oneLine, "oneLine", 5000, false),
      scores,
      simple: cleanText(raw.simple, "simple", 30000, false),
      deep: cleanText(raw.deep, "deep", 120000, false),
    };
  }

  function sanitizeStoredHistory(value) {
    if (!Array.isArray(value)) return [];
    const used = new Set();
    const safe = [];
    for (let index = 0; index < value.length && safe.length < MAX_STORED_RECORDS; index++) {
      try {
        let fallback = `stored_${index}_${Date.now().toString(36)}`;
        while (used.has(fallback)) fallback += "_x";
        const record = sanitizeRecord(value[index], fallback);
        if (used.has(record.id)) record.id = fallback;
        used.add(record.id);
        safe.push(record);
      } catch (error) {}
    }
    return safe;
  }

  function parseImport(text, existingIds) {
    if (typeof text !== "string") throw new Error("匯入內容必須是文字");
    if (new Blob([text]).size > MAX_IMPORT_BYTES) throw new Error("檔案超過 5 MB 上限");
    const value = JSON.parse(text);
    if (!Array.isArray(value)) throw new Error("格式錯誤：需要 JSON 陣列");
    if (value.length === 0) throw new Error("匯入檔案沒有紀錄");
    if (value.length > MAX_IMPORT_RECORDS) throw new Error(`一次最多匯入 ${MAX_IMPORT_RECORDS} 筆`);
    const used = new Set(existingIds || []);
    return value.map((raw, index) => {
      let fallback = `imported_${Date.now().toString(36)}_${String(index + 1).padStart(4, "0")}`;
      while (used.has(fallback)) fallback += "_x";
      let record;
      try { record = sanitizeRecord(raw, fallback); }
      catch (error) { throw new Error(`第 ${index + 1} 筆：${error.message}`); }
      if (used.has(record.id)) record.id = fallback;
      used.add(record.id);
      return record;
    });
  }

  return { escapeHTML, sanitizeRecord, sanitizeStoredHistory, parseImport, MAX_IMPORT_BYTES, MAX_IMPORT_RECORDS, MAX_STORED_RECORDS };
})();
