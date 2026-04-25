
const toggle = document.querySelector(".menu-toggle");
const menu = document.querySelector(".nav-menu");
if (toggle && menu) {
  toggle.addEventListener("click", () => menu.classList.toggle("show"));
}

const pwaInstallBtn = document.getElementById("pwaInstallBtn");
let deferredPrompt = null;

window.addEventListener("beforeinstallprompt", (event) => {
  event.preventDefault();
  deferredPrompt = event;
  if (pwaInstallBtn) pwaInstallBtn.style.display = "inline-block";
});

if (pwaInstallBtn) {
  pwaInstallBtn.addEventListener("click", async () => {
    if (!deferredPrompt) {
      alert("Use your browser menu and choose 'Add to Home screen' or 'Install app'.");
      return;
    }
    deferredPrompt.prompt();
    await deferredPrompt.userChoice;
    deferredPrompt = null;
  });
}

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("service-worker.js").catch(() => {});
  });
}
