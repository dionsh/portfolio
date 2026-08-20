/* ==========================================================================
   DION SHERIFI - core/i18n.js
   Language state, the EN/SQ toggle, and the static-string swap.

   Anything that renders text from JSON (the card grids, the article) has to
   redraw when the language changes. Instead of calling those renderers from
   here, they subscribe with onLanguageChange() - that keeps this module from
   having to know which page it is running on.
   ========================================================================== */

import { translations } from './translations.js';

const htmlEl = document.documentElement;
const savedLang = localStorage.getItem('site_lang');

let currentLang = savedLang === 'sq' ? 'sq' : 'en';
const listeners = [];

/** Current language code: 'en' or 'sq'. */
export function getLang() {
  return currentLang;
}

/** The active string table. */
export function dict() {
  return translations[currentLang];
}

/** Re-render callback, run on every language switch. */
export function onLanguageChange(fn) {
  listeners.push(fn);
}

/**
 * Swap every [data-i18n] node to `lang`. Exported so a page that injects
 * markup after boot can re-run it without changing the language.
 */
export function applyStaticTranslations(lang = currentLang) {
  const dict = translations[lang];
  if (!dict) return;
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (dict[key] !== undefined) el.innerHTML = dict[key];
  });
  htmlEl.setAttribute('lang', lang);
  htmlEl.setAttribute('data-lang', lang);
}

export function setLang(lang) {
  currentLang = lang;
  localStorage.setItem('site_lang', lang);
  applyStaticTranslations(lang);

  // Re-render dynamic content that is already on the page
  listeners.forEach(fn => fn(lang));

  // Update language toggle label (shows the *other* language)
  const langLabel = document.getElementById('langLabel');
  if (langLabel) langLabel.textContent = lang === 'en' ? 'SQ' : 'EN';
}

/** Binds the toggle button and applies the saved language. */
export function initI18n() {
  const langToggle = document.getElementById('langToggle');
  if (langToggle) {
    langToggle.addEventListener('click', () => {
      setLang(currentLang === 'en' ? 'sq' : 'en');
    });
  }
  setLang(currentLang);
}
