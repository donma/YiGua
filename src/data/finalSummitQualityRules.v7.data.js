window.Zero1MatrixData = window.Zero1MatrixData || {};
window.Zero1MatrixData.finalSummitQualityRulesV7 = {
  "version": "1.7.0-v7",
  "qualityLevels": [
    "coverage",
    "usable",
    "refined",
    "reviewed",
    "gold"
  ],
  "goldRequirements": {
    "pairInterpretations": {
      "count": 4096,
      "fullyRefined": 4096,
      "requiredFields": [
        "transitionTone",
        "summary",
        "advice",
        "risk",
        "timing",
        "basis",
        "scoreAdjust",
        "qualityLevel",
        "reviewed"
      ],
      "qualityLevel": "gold"
    },
    "lineCategoryInterpretations": {
      "count": 4608,
      "fullyRefined": 4608,
      "requiredFields": [
        "meaning",
        "advice",
        "warning",
        "basis",
        "scoreAdjust",
        "qualityLevel",
        "reviewed"
      ],
      "qualityLevel": "gold"
    },
    "categoryInterpretations": {
      "count": 768,
      "reviewed": 768,
      "qualityLevel": "gold"
    },
    "lines": {
      "count": 384,
      "reviewed": 384,
      "qualityLevel": "gold"
    },
    "hexagrams": {
      "count": 64,
      "reviewed": 64,
      "qualityLevel": "gold"
    }
  },
  "releaseGate": {
    "hardCorrectness": "PASS",
    "fileMode": "PASS",
    "pwaMode": "PASS",
    "goldenTests": "300/300",
    "forbiddenHits": 0,
    "missingBasis": 0,
    "missingQualityLevel": 0,
    "missingReviewFlags": 0,
    "duplicateIds": 0,
    "missingIds": 0,
    "syntaxErrors": 0
  }
};
