window.Zero1MatrixData = window.Zero1MatrixData || {};
window.Zero1MatrixData.contentQualityRulesV6 = {
  "version": "1.6.0-v6",
  "targets": {
    "pairInterpretationsV6Patch301900": {
      "count": 600,
      "allNeedsExpansionFalse": true,
      "minSummaryChars": 120,
      "minAdviceChars": 80,
      "minRiskChars": 60
    },
    "lineCategoryInterpretationsV6PatchHex9To16": {
      "count": 576,
      "allNeedsExpansionFalse": true,
      "minMeaningChars": 90,
      "minAdviceChars": 70,
      "minWarningChars": 60
    },
    "actionSuggestions": {
      "count": 768,
      "normalizedUniqueMin": 450,
      "maxSameNormalizedTextCount": 36
    }
  },
  "mergeStrategy": {
    "pairInterpretations": "merge by id into existing src/data/pairInterpretations.data.js",
    "lineCategoryInterpretations": "merge by id into existing src/data/lineCategoryInterpretations.data.js",
    "actionSuggestions": "replace whole file"
  },
  "forbiddenTerms": [
    "一定會",
    "必定會",
    "必有災禍",
    "不用看醫生",
    "保證賺錢",
    "官司一定贏",
    "馬上辭職",
    "必須分手",
    "必須離婚",
    "穩賺",
    "包贏",
    "不用諮詢專業人士",
    "絕對成功",
    "絕對失敗",
    "絕對會",
    "絕對不會",
    "絕對不能"
  ]
};
