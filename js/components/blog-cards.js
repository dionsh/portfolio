/* ==========================================================================
   DION SHERIFI - components/blog-cards.js
   Fills #blog-grid from json/blog.json.

   The same grid serves two pages; how much it shows comes from the markup:
   data-blog-limit="4" on the homepage, absent on blog.html = show all.
   ========================================================================== */

import { dict, getLang, onLanguageChange } from '../core/i18n.js';
import { loadBlogData } from '../core/data.js';
import { applyReveal } from '../core/reveal.js';
import { asset, esc, formatDate } from '../core/utils.js';

const blogGrid = document.getElementById('blog-grid');
let blogData = null;

/**
 * Picks the posts shown on the homepage.
 *
 * A post can claim a fixed slot by setting "homeOrder" in blog.json — that's
 * how a standout post stays on the front page even once newer posts exist.
 * Slots left over after the pinned ones are filled with the most recent
 * unpinned posts, so the grid is never short if a pin is removed.
 */
function selectHomePosts(limit) {
  const isPinned = p => Number.isFinite(p.homeOrder);
  const pinned = blogData.filter(isPinned).sort((a, b) => a.homeOrder - b.homeOrder);
  const rest   = blogData.filter(p => !isPinned(p)); // already sorted newest first
  return [...pinned, ...rest].slice(0, limit);
}

function renderBlogCards() {
  if (!blogGrid || !blogData) return;
  const strings = dict();
  const currentLang = getLang();

  if (blogData.length === 0) {
    blogGrid.innerHTML = `<div class="col-12 blog-loading">${strings['blog.error']}</div>`;
    return;
  }

  // data-blog-limit="4" on the homepage grid; absent on blog.html = show all
  const limit = parseInt(blogGrid.dataset.blogLimit, 10);
  const posts = Number.isFinite(limit) ? selectHomePosts(limit) : blogData;

  blogGrid.innerHTML = posts.map(post => {
    const lp = post[currentLang] || post.en;
    const tagsHTML = (post.tags || []).slice(0, 4).map(t => `<span class="tag">${t}</span>`).join('');
    const url = `/blog/${encodeURIComponent(post.slug)}`;

    return `
        <div class="col-md-6 col-lg-4">
          <article class="blog-card">
            <a href="${url}" class="blog-card-image">
              <img src="${esc(asset(post.image))}" alt="${esc(lp.title)}" loading="lazy" />
            </a>
            <div class="blog-card-body">
              <div class="blog-card-meta">
                <span class="blog-card-cat">${post.category}</span>
                <span class="blog-card-date">${formatDate(post.date, currentLang)}</span>
              </div>
              <h3 class="blog-card-title">
                <a href="${url}" style="color:inherit">${lp.title}</a>
              </h3>
              <p class="blog-card-desc">${lp.description}</p>
              <div class="blog-card-tags">${tagsHTML}</div>
              <a href="${url}" class="blog-card-read">
                ${strings['blog.read']} <i class="bi bi-arrow-right"></i>
              </a>
            </div>
          </article>
        </div>
      `;
  }).join('');

  // Re-apply scroll reveal to new cards
  applyReveal(blogGrid.querySelectorAll('.blog-card'));
}

/** No-op on pages without a #blog-grid. */
export async function initBlogGrid() {
  if (!blogGrid) return;
  onLanguageChange(renderBlogCards);

  const data = await loadBlogData();
  if (!data) {
    blogGrid.innerHTML = `<div class="col-12 blog-loading">${dict()['blog.error']}</div>`;
    return;
  }
  blogData = data;
  renderBlogCards();
}
