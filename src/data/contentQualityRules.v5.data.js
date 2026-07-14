window.Zero1MatrixData = window.Zero1MatrixData || {};
window.Zero1MatrixData.contentQualityRulesV5 = {
  "version": "1.5.0-v5",
  "targets": {
    "reflectionQuestions": {
      "minCount": 2304,
      "maxNormalizedDuplicateRatio": 0.08,
      "mustHaveFields": [
        "id",
        "hexagramId",
        "category",
        "question",
        "basis",
        "qualityLevel"
      ]
    },
    "actionSuggestions": {
      "minCount": 768,
      "maxNormalizedDuplicateRatio": 0.12,
      "mustHaveFields": [
        "id",
        "hexagramId",
        "category",
        "text",
        "basis",
        "qualityLevel"
      ]
    },
    "riskWarnings": {
      "minCount": 768,
      "maxNormalizedDuplicateRatio": 0.12,
      "mustHaveFields": [
        "id",
        "hexagramId",
        "category",
        "text",
        "basis",
        "qualityLevel"
      ]
    }
  },
  "normalization": {
    "replaceCategoryNames": [
      "一般",
      "工作事業",
      "感情關係",
      "財務金錢",
      "人際合作",
      "家庭親人",
      "學習考試",
      "身心狀態",
      "重大決策",
      "創業經營",
      "官非合約",
      "心境修行"
    ],
    "replaceHexagramNames": [
      "乾",
      "坤",
      "屯",
      "蒙",
      "需",
      "訟",
      "師",
      "比",
      "小畜",
      "履",
      "泰",
      "否",
      "同人",
      "大有",
      "謙",
      "豫",
      "隨",
      "蠱",
      "臨",
      "觀",
      "噬嗑",
      "賁",
      "剝",
      "復",
      "無妄",
      "大畜",
      "頤",
      "大過",
      "坎",
      "離",
      "咸",
      "恆",
      "遯",
      "大壯",
      "晉",
      "明夷",
      "家人",
      "睽",
      "蹇",
      "解",
      "損",
      "益",
      "夬",
      "姤",
      "萃",
      "升",
      "困",
      "井",
      "革",
      "鼎",
      "震",
      "艮",
      "漸",
      "歸妹",
      "豐",
      "旅",
      "巽",
      "兌",
      "渙",
      "節",
      "中孚",
      "小過",
      "既濟",
      "未濟"
    ],
    "removeNumbers": true
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
  ],
  "allowedPhrases": [
    "不要把卦象當成絕對命令",
    "不作絕對判斷",
    "避免絕對化解讀"
  ],
  "releaseGate": {
    "v5RC": {
      "reflectionQuestions": ">= 2304",
      "actionSuggestions": ">= 768",
      "riskWarnings": ">= 768",
      "normalizedReflectionUnique": ">= 180",
      "normalizedActionUnique": ">= 120",
      "normalizedRiskUnique": ">= 120",
      "forbiddenHits": 0
    }
  }
};
