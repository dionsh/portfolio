/* ==========================================================================
   DION SHERIFI - components/project-cards.js
   Fills #work-grid from json/projects.json.

   The same grid serves two pages; how much it shows comes from the markup:
   data-project-mode="featured" on the homepage, absent on projects.html =
   show all.
   ========================================================================== */

import { dict, getLang, onLanguageChange } from '../core/i18n.js';
import { loadProjectData } from '../core/data.js';
import { applyReveal } from '../core/reveal.js';
import { asset, esc } from '../core/utils.js';

const workGrid = document.getElementById('work-grid');
let projectData = null;

function renderProjectCards() {
  if (!workGrid || !projectData) return;
  const strings = dict();
  const currentLang = getLang();

  if (projectData.length === 0) {
    workGrid.innerHTML = `<div class="col-12 blog-loading">${strings['work.error']}</div>`;
    return;
  }

  // data-project-mode="featured" on the homepage grid; absent on projects.html = show all
  const featuredOnly = workGrid.dataset.projectMode === 'featured';
  const projects = featuredOnly ? projectData.filter(p => p.featured) : projectData;

  workGrid.innerHTML = projects.map(project => {
    const lp = project[currentLang] || project.en || {};
    const tagsHTML = (project.tags || []).map(t => `<span class="tag">${t}</span>`).join('');

    const livePill = project.live ? `
              <a href="${esc(project.live)}" class="live-pill" target="_blank" rel="noopener">
                <span>${strings['card.live']}</span>
                <i class="bi bi-box-arrow-up-right"></i>
              </a>` : '';

    const githubLink = project.github ? `
              <a href="${esc(project.github)}" target="_blank" rel="noopener" class="project-github">
                <i class="bi bi-github"></i>
                <span>${strings['card.github']}</span>
              </a>` : '';

    return `
        <div class="col-md-6">
          <article class="project-card">
            <div class="project-image">
              <img src="${esc(asset(project.image))}" alt="${esc(project.title)} screenshot" loading="lazy" />${livePill}
            </div>
            <div class="project-body">
              <div class="project-head">
                <h3 class="project-title">${project.title}</h3>
                <span class="project-category">${project.category}</span>
              </div>
              <p class="project-desc">${lp.description || ''}</p>
              <div class="project-tags">${tagsHTML}</div>${githubLink}
            </div>
          </article>
        </div>
      `;
  }).join('');

  applyReveal(workGrid.querySelectorAll('.project-card'));
}

/** No-op on pages without a #work-grid. */
export async function initProjectGrid() {
  if (!workGrid) return;
  onLanguageChange(renderProjectCards);

  const data = await loadProjectData();
  if (!data) {
    workGrid.innerHTML = `<div class="col-12 blog-loading">${dict()['work.error']}</div>`;
    return;
  }
  projectData = data;
  renderProjectCards();
}
