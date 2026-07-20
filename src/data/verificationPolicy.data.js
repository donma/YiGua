window.Zero1MatrixData = window.Zero1MatrixData || {};
window.Zero1MatrixData.verificationPolicy = {
  id: "yigua-verification-policy-v2",
  version: "2.0.0",
  effectiveDate: "2026-07-20",
  principles: [
    "機器驗證不等同人工審校",
    "經典原文與現代應用分層標示",
    "每一項可信狀態都必須能由公開規則與版本資料重現"
  ],
  states: {
    "machine-validated": {
      label: "機器驗證",
      requires: ["schema", "count", "unique-key", "referential-integrity", "rule-based-content-check"],
      humanReviewRequired: true,
      mayUseReviewedLabel: false,
      mayUseGoldLabel: false
    },
    reviewed: {
      label: "人工已審",
      requires: ["named-human-reviewer", "review-date", "review-scope", "review-evidence"],
      humanReviewRequired: true,
      mayUseReviewedLabel: true,
      mayUseGoldLabel: false
    },
    gold: {
      label: "Gold",
      requires: ["reviewed", "independent-second-review", "all-blocking-findings-resolved", "release-hash-frozen"],
      humanReviewRequired: true,
      mayUseReviewedLabel: true,
      mayUseGoldLabel: true
    }
  },
  legacyPolicy: {
    status: "revoked",
    note: "舊版 Gold／Reviewed 僅代表流程標記，缺少可驗證的人工作者與證據，不沿用為人工審定。"
  }
};
