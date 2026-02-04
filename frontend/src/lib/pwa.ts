let deferredPrompt: BeforeInstallPromptEvent | null = null;

export function initPwaListener() {
  window.addEventListener("beforeinstallprompt", (e) => {
    e.preventDefault();
    deferredPrompt = e as BeforeInstallPromptEvent;
    console.log("PWA deferredPrompt saved");
  });
}

export function getDeferredPrompt(): BeforeInstallPromptEvent | null {
  return deferredPrompt;
}

export function clearDeferredPrompt() {
  deferredPrompt = null;
}
