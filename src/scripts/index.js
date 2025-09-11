// CSS imports
import '../styles/styles.css';

import App from './pages/app';

document.addEventListener('DOMContentLoaded', async () => {
  const app = new App({
    content: document.querySelector('#main-content'),
    drawerButton: document.querySelector('#drawer-button'),
    navigationDrawer: document.querySelector('#navigation-drawer'),
    skipLink: document.querySelector('#skip-link'),
  });
  await app.renderPage();
});

// ✅ Tambah: Install Prompt
window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  window.deferredPrompt = e;

  const installBtn = document.createElement('button');
  installBtn.textContent = 'Install Aplikasi';
  installBtn.classList.add('install-btn');
  document.body.appendChild(installBtn);

  installBtn.addEventListener('click', async () => {
    if (window.deferredPrompt) {
      window.deferredPrompt.prompt();
      const { outcome } = await window.deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        console.log('PWA diinstall ✅');
      }
      window.deferredPrompt = null;
      installBtn.remove();
    }
  });
});

// ✅ Tambah: Register Service Worker
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/sw.js')
      .then(() => console.log('Service Worker terdaftar 🚀'))
      .catch((err) => console.error('SW gagal:', err));
  });
}
