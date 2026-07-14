window.Zero1MatrixTestFixtures = window.Zero1MatrixTestFixtures || {};
window.Zero1MatrixTestFixtures.hexagramValidationCases = [
  {
    "caseId": "all-yang-qian",
    "values": [
      7,
      7,
      7,
      7,
      7,
      7
    ],
    "originalLines": [
      1,
      1,
      1,
      1,
      1,
      1
    ],
    "changingLines": [],
    "expectedOriginal": "乾為天",
    "expectedChanged": "乾為天"
  },
  {
    "caseId": "all-yin-kun",
    "values": [
      8,
      8,
      8,
      8,
      8,
      8
    ],
    "originalLines": [
      0,
      0,
      0,
      0,
      0,
      0
    ],
    "changingLines": [],
    "expectedOriginal": "坤為地",
    "expectedChanged": "坤為地"
  },
  {
    "caseId": "old-yin-all-to-qian",
    "values": [
      6,
      6,
      6,
      6,
      6,
      6
    ],
    "originalLines": [
      0,
      0,
      0,
      0,
      0,
      0
    ],
    "changedLines": [
      1,
      1,
      1,
      1,
      1,
      1
    ],
    "changingLines": [
      1,
      2,
      3,
      4,
      5,
      6
    ],
    "expectedOriginal": "坤為地",
    "expectedChanged": "乾為天"
  },
  {
    "caseId": "old-yang-all-to-kun",
    "values": [
      9,
      9,
      9,
      9,
      9,
      9
    ],
    "originalLines": [
      1,
      1,
      1,
      1,
      1,
      1
    ],
    "changedLines": [
      0,
      0,
      0,
      0,
      0,
      0
    ],
    "changingLines": [
      1,
      2,
      3,
      4,
      5,
      6
    ],
    "expectedOriginal": "乾為天",
    "expectedChanged": "坤為地"
  },
  {
    "caseId": "mixed-changing",
    "values": [
      6,
      7,
      8,
      9,
      7,
      8
    ],
    "originalLines": [
      0,
      1,
      0,
      1,
      1,
      0
    ],
    "changedLines": [
      1,
      1,
      0,
      0,
      1,
      0
    ],
    "changingLines": [
      1,
      4
    ]
  }
];
