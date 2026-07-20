(function() {
  if (!("serviceWorker" in navigator)) return;
  const isSecureHost = location.protocol === "https:" || location.hostname === "localhost" || location.hostname === "127.0.0.1";
  if (!isSecureHost) return;

  const hadController = Boolean(navigator.serviceWorker.controller);
  let reloading = false;
  navigator.serviceWorker.addEventListener("controllerchange", () => {
    if (hadController && !reloading) {
      reloading = true;
      location.reload();
    }
  });

  window.addEventListener("load", () => {
    navigator.serviceWorker.register("./sw.js").then(registration => registration.update()).catch(error => {
      console.warn("PWA service worker registration failed:", error);
    });
  });
})();
