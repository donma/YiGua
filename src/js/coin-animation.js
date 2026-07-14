(function() {
  const Z = window.Zero1Matrix;
  Z.coinAnimation = Z.coinAnimation || {};

  function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  Z.coinAnimation.renderCoins = function(container) {
    container.innerHTML = `
      <div class="coin-stage">
        <div class="coin-row">
          ${[1,2,3].map(i => `
            <div class="coin" data-coin="${i}">
              <div class="coin-face coin-front"></div>
              <div class="coin-face coin-back"></div>
            </div>
          `).join("")}
        </div>
      </div>
      <div class="cast-log" id="castLog"></div>
    `;
  };

  Z.coinAnimation.throwOneLine = async function(container, fastMode) {
    const coins = Array.from(container.querySelectorAll(".coin"));
    const resultCoins = [0,1,2].map(() => Math.random() < 0.5 ? "H" : "T");

    coins.forEach(c => {
      c.classList.remove("settle-head", "settle-tail", "throwing");
      void c.offsetWidth;
      if (!fastMode) c.classList.add("throwing");
    });

    if (!fastMode) await sleep(1350);

    coins.forEach((coin, idx) => {
      coin.classList.remove("throwing");
      coin.classList.add(resultCoins[idx] === "H" ? "settle-head" : "settle-tail");
    });

    const value = Z.coinThrowToLine(resultCoins);
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
