(function() {
  const Z = window.Zero1Matrix;
  Z.coinAnimation = Z.coinAnimation || {};

  const LINE_NAMES = ["初爻", "二爻", "三爻", "四爻", "五爻", "上爻"];

  function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  function setStatus(container, lineIndex, text) {
    const currentLine = container.querySelector("[data-current-line]");
    const status = container.querySelector("[data-cast-status]");
    if (currentLine && Number.isInteger(lineIndex)) currentLine.textContent = LINE_NAMES[lineIndex];
    if (status) status.textContent = text;
  }

  function revealLine(container, lineIndex, value) {
    const line = container.querySelector(`[data-hex-line="${lineIndex}"]`);
    if (!line) return;
    const isYang = value === 7 || value === 9;
    const isMoving = value === 6 || value === 9;
    line.classList.remove("yin", "yang", "moving");
    line.classList.add(isYang ? "yang" : "yin");
    if (isMoving) line.classList.add("moving");
    line.classList.add("revealed");
    line.setAttribute("aria-label", `${LINE_NAMES[lineIndex]}：${Z.coinAnimation.labelLineValue(value)}`);
  }

  Z.coinAnimation.renderCoins = function(container) {
    container.innerHTML = `
      <div class="coin-stage">
        <div class="ink-wash" aria-hidden="true"></div>
        <div class="casting-main">
          <div class="ritual-kicker">三枚銅錢 · <strong data-current-line>準備起卦</strong></div>
          <div class="coin-row" aria-label="三枚銅錢">
            ${["乾隆通寶", "道光通寶", "嘉慶通寶"].map((name, i) => `
              <div class="coin settle-head" data-coin="${i + 1}" aria-label="${name}">
                <div class="coin-face"></div>
              </div>
            `).join("")}
          </div>
          <div class="coin-result-label" data-cast-status aria-live="polite">靜心定念，依序擲成六爻</div>
        </div>
        <aside class="hex-progress" aria-label="六爻生成進度">
          <span class="hex-progress-label">六爻 · 由下而上</span>
          <div class="hex-build">
            ${[5,4,3,2,1,0].map(i => `
              <div class="hex-build-line" data-hex-line="${i}">
                <span class="hex-stroke"></span><span class="hex-stroke"></span>
              </div>
            `).join("")}
          </div>
        </aside>
      </div>
    `;
  };

  Z.coinAnimation.finishCasting = function(container) {
    const stage = container.querySelector(".coin-stage");
    if (stage) {
      stage.classList.remove("is-casting");
      stage.classList.add("is-complete");
    }
    setStatus(container, null, "六爻已成 · 判讀已生成");
    const currentLine = container.querySelector("[data-current-line]");
    if (currentLine) currentLine.textContent = "成卦";
  };

  Z.coinAnimation.throwOneLine = async function(container, fastMode, lineIndex) {
    const coins = Array.from(container.querySelectorAll(".coin"));
    const stage = container.querySelector(".coin-stage");
    const reducedMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const shouldAnimate = !fastMode && !reducedMotion;
    const resultCoins = [0,1,2].map(() => Math.random() < 0.5 ? "H" : "T");

    if (stage) {
      stage.classList.remove("is-complete");
      stage.classList.add("is-casting");
    }
    setStatus(container, lineIndex, `${LINE_NAMES[lineIndex]} · 銅錢擲出`);

    coins.forEach(coin => {
      coin.classList.toggle("throw-from-tail", coin.classList.contains("settle-tail"));
      coin.classList.remove("throwing", "landed");
      void coin.offsetWidth;
      if (shouldAnimate) coin.classList.add("throwing");
    });

    if (shouldAnimate) await sleep(760);

    coins.forEach((coin, idx) => {
      coin.classList.remove("throwing", "throw-from-tail", "settle-head", "settle-tail");
      coin.classList.add(resultCoins[idx] === "H" ? "settle-head" : "settle-tail");
      if (shouldAnimate) coin.classList.add("landed");
    });

    if (shouldAnimate) await sleep(210);
    coins.forEach(coin => coin.classList.remove("landed"));

    const value = Z.coinThrowToLine(resultCoins);
    revealLine(container, lineIndex, value);
    setStatus(container, lineIndex, `${LINE_NAMES[lineIndex]} · ${Z.coinAnimation.labelLineValue(value)}`);
    return { coins: resultCoins, value };
  };

  Z.coinAnimation.labelLineValue = function(value) {
    return {
      6: "老陰・動爻",
      7: "少陽・不動",
      8: "少陰・不動",
      9: "老陽・動爻"
    }[value];
  };
})();
