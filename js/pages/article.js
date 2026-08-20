/* ==========================================================================
   DION SHERIFI - pages/article.js
   Entry point for article.html and the prerendered /blog/<slug>/ pages.

   No applyReveal() here: none of its target elements exist on this page.
   ========================================================================== */

import { initSite } from '../core/site.js';
import { initI18n } from '../core/i18n.js';
import { initArticle } from '../components/article.js';

initSite();
initI18n();
initArticle();
