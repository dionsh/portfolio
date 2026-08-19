/* ==========================================================================
   DION SHERIFI - pages/index.js
   Entry point for index.html. Everything it needs, and nothing it doesn't.
   ========================================================================== */

import { initSite } from '../core/site.js';
import { initI18n } from '../core/i18n.js';
import { applyReveal } from '../core/reveal.js';
import { initBlogGrid } from '../components/blog-cards.js';
import { initProjectGrid } from '../components/project-cards.js';

initSite();
initI18n();
applyReveal();

// Both grids fetch in parallel; each fills in when its JSON lands.
initBlogGrid();
initProjectGrid();
