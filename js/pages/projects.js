/* ==========================================================================
   DION SHERIFI - pages/projects.js
   Entry point for projects.html. Everything it needs, and nothing it doesn't.
   ========================================================================== */

import { initSite } from '../core/site.js';
import { initI18n } from '../core/i18n.js';
import { applyReveal } from '../core/reveal.js';
import { initProjectGrid } from '../components/project-cards.js';

initSite();
initI18n();
applyReveal();
initProjectGrid();
