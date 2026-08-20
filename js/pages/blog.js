/* ==========================================================================
   DION SHERIFI - pages/blog.js
   Entry point for blog.html. Everything it needs, and nothing it doesn't.
   ========================================================================== */

import { initSite } from '../core/site.js';
import { initI18n } from '../core/i18n.js';
import { applyReveal } from '../core/reveal.js';
import { initBlogGrid } from '../components/blog-cards.js';

initSite();
initI18n();
applyReveal();
initBlogGrid();
