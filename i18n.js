const i18n = (function () {
  const defaultLang = 'mk';
  let currentLang = localStorage.getItem('lang') || defaultLang;

  async function loadTranslations(lang) {
    const res = await fetch(`locales/${lang}.json`);
    return await res.json();
  }

  async function translatePage() {
    const translations = await loadTranslations(currentLang);

    // Apply translations
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      if (translations[key]) {
        el.textContent = translations[key];
      }
    });

    // Sync html lang (SEO + accessibility)
    document.documentElement.lang = currentLang;

    // Desktop language toggle UI
    const desktopText = document.getElementById('current-lang-text');
    const desktopFlag = document.getElementById('current-lang-flag');

    // Mobile language toggle UI
    const mobileText = document.getElementById('current-lang-mobile');
    const mobileFlag = document.getElementById('current-lang-flag-mobile');

    const nextLang = currentLang === 'mk' ? 'en' : 'mk';

    if (desktopText) desktopText.textContent = nextLang.toUpperCase();
    if (mobileText) mobileText.textContent = nextLang.toUpperCase();

    if (desktopFlag)
      desktopFlag.src = nextLang === 'mk'
        ? 'img/Macedonian.png'
        : 'img/English.png';

    if (mobileFlag)
      mobileFlag.src = nextLang === 'mk'
        ? 'img/Macedonian.png'
        : 'img/English.png';
  }

  function toggleLang() {
    currentLang = currentLang === 'mk' ? 'en' : 'mk';
    localStorage.setItem('lang', currentLang);
    translatePage();
  }

  document.addEventListener('DOMContentLoaded', () => {
    translatePage();

    const desktopBtn = document.getElementById('lang-toggle-desktop');
    const mobileBtn = document.getElementById('lang-toggle-mobile');

    if (desktopBtn) desktopBtn.addEventListener('click', toggleLang);
    if (mobileBtn) mobileBtn.addEventListener('click', toggleLang);
  });

  // expose safe global refresh for toggleText()
  window.applyTranslations = translatePage;

  return { translatePage, toggleLang };
})();
