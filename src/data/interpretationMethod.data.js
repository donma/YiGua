window.Zero1MatrixData = window.Zero1MatrixData || {};
window.Zero1MatrixData.interpretationMethod = {
  id: "yixue-qimeng-changing-lines",
  name: "《易學啟蒙》多動爻判讀法",
  version: "1.0.0",
  contentOrder: ["classic-text", "moving-line-focus", "changed-hexagram", "modern-application"],
  source: {
    title: "《易學啟蒙》占法（《易學象數論・占法》所錄）",
    url: "https://zh.wikisource.org/zh-hant/易學象數論/占法",
    accessed: "2026-07-20"
  },
  rules: [
    { changingCount: 0, primary: "本卦卦辭", secondary: "本卦內外卦貞悔" },
    { changingCount: 1, primary: "本卦動爻爻辭", secondary: "之卦卦辭" },
    { changingCount: 2, primary: "本卦兩個動爻爻辭，以上爻為主", secondary: "之卦卦辭" },
    { changingCount: 3, primary: "本卦與之卦卦辭，本卦為貞", secondary: "之卦為悔" },
    { changingCount: 4, primary: "之卦兩個不變爻爻辭，以下爻為主", secondary: "本卦卦辭" },
    { changingCount: 5, primary: "之卦唯一不變爻爻辭", secondary: "本卦卦辭" },
    { changingCount: 6, primary: "乾坤用九用六；其餘取之卦卦辭", secondary: "本卦卦辭" }
  ],
  disclaimer: "此為明示採用的判讀系統，不宣稱是所有易學流派的唯一規則。現代分類內容只作第二層決策反思。"
};
