window.Zero1MatrixData = window.Zero1MatrixData || {};
window.Zero1MatrixData.dictionaryQualityRules = {
  "version": "1.3.0-v3-hard-correctness",
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
  "warningTerms": [
    "大凶",
    "血光",
    "災禍",
    "天命",
    "注定",
    "無解",
    "必敗",
    "唯一選擇"
  ],
  "minLengths": {
    "hexagrams.summary": 160,
    "hexagrams.situation": 160,
    "hexagrams.coreAdvice": 40,
    "lines.plain": 80,
    "lines.meaning": 80,
    "lines.advice": 60,
    "categoryInterpretations.meaning": 120,
    "categoryInterpretations.advice": 100,
    "categoryInterpretations.warning": 80,
    "lineCategoryInterpretations.meaning": 70,
    "lineCategoryInterpretations.advice": 60,
    "lineCategoryInterpretations.warning": 40,
    "pairInterpretations.summary": 120,
    "pairInterpretations.advice": 80,
    "pairInterpretations.risk": 60
  },
  "requiredFields": {
    "all": [
      "id",
      "version"
    ],
    "interpretationRecords": [
      "meaning",
      "advice",
      "warning",
      "basis"
    ],
    "pairInterpretations": [
      "summary",
      "advice",
      "risk",
      "basis",
      "scoreAdjust"
    ],
    "scoreTrace": [
      "base",
      "adjustments",
      "final"
    ]
  },
  "classicTextMustNotContain": [
    "待校對",
    "待補齊",
    "待填",
    "TODO",
    "placeholder"
  ],
  "reviewFlags": [
    "needsExpansion",
    "needsHumanReview",
    "reviewed"
  ],
  "releaseGate": {
    "forBeta": {
      "classicTextPlaceholders": 0,
      "coverage": "100%",
      "forbiddenTerms": 0
    },
    "forStrongest": {
      "needsExpansion": 0,
      "needsHumanReview": 0,
      "reviewed": "100%",
      "pairInterpretationsRefined": 4096,
      "lineCategoryInterpretationsRefined": 4608
    }
  },
  "allowedPhrases": [
    "不要把卦象當成絕對命令",
    "不作絕對判斷",
    "避免絕對化解讀"
  ],
  "hardCorrectnessChecks": {
    "uniqueHexagramLinePatterns": 64,
    "trigramBottomUpMap": {
      "000": "坤",
      "001": "艮",
      "010": "坎",
      "011": "巽",
      "100": "震",
      "101": "離",
      "110": "兌",
      "111": "乾"
    },
    "correctedHexagramLines": {
      "9": [1,1,1,0,1,1],
      "20": [0,0,0,0,1,1],
      "37": [1,0,1,0,1,1],
      "42": [1,0,0,0,1,1],
      "53": [0,0,1,0,1,1]
    }
  }
};
