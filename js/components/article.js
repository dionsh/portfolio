/* ==========================================================================
   DION SHERIFI - components/article.js
   Renders one blog post into the article.html shell, and the image lightbox.

   The prerendered pages under /blog/<slug>/ already contain this markup as
   static HTML; this module rewrites it on load, which is what keeps the
   EN/SQ toggle working there.
   ========================================================================== */

import { applyStaticTranslations, getLang, onLanguageChange } from '../core/i18n.js';
import { loadBlogData } from '../core/data.js';
import { asset, formatDate, renderInlineMarkdown } from '../core/utils.js';

let currentPost = null;

/**
 * Which post is this page?
 *  1. ?slug=…            — legacy article.html links
 *  2. body[data-slug]    — prerendered pages from build/build-blog.js
 *  3. /blog/<slug>       — clean URL, in case the attribute is ever missing
 */
function getSlugFromURL() {
  const fromQuery = new URLSearchParams(window.location.search).get('slug');
  if (fromQuery) return fromQuery;

  const fromAttr = document.body && document.body.dataset.slug;
  if (fromAttr) return fromAttr;

  const m = window.location.pathname.match(/\/blog\/([^/]+)\/?$/);
  return m ? decodeURIComponent(m[1]) : null;
}

function renderArticle(post) {
  const currentLang = getLang();
  const lp = post[currentLang] || post.en;

  // Page title
  document.title = `${lp.title} — Dion Sherifi`;

  // SEO / social meta. Google renders JS, so it picks these up on its
  // rendering pass. Social scrapers (LinkedIn, WhatsApp) do not — they
  // fall back to the static defaults in article.html's <head>.
  const setMeta = (id, val) => {
    const el = document.getElementById(id);
    if (el) el.content = val;
  };
  const absImage = post.image
    ? new URL(asset(post.image), 'https://dionsherifi.com/').href
    : 'https://dionsherifi.com/images/og-card.png?v=2';

  if (lp.description) {
    setMeta('meta-description', lp.description);
    setMeta('og-description', lp.description);
  }
  setMeta('og-title', `${lp.title} — Dion Sherifi`);
  setMeta('og-image', absImage);
  setMeta('twitter-image', absImage);

  // Cover
  const coverImg = document.getElementById('article-cover-img');
  if (coverImg) {
    coverImg.src = asset(post.image);
    coverImg.alt = lp.title;
  }

  // Category, title, date, read time
  const setText = (id, val) => {
    const el = document.getElementById(id);
    if (el) el.textContent = val;
  };

  setText('article-category', post.category);
  setText('article-title', lp.title);
  setText('article-date', formatDate(post.date, currentLang));
  setText('article-readtime', post.readTime || 5);

  // Tags
  const tagsWrap = document.getElementById('article-tags');
  if (tagsWrap) {
    tagsWrap.innerHTML = (post.tags || [])
      .map(t => `<span class="tag">${t}</span>`).join('');
  }

  // Body content blocks
  const bodyWrap = document.getElementById('article-body');
  if (bodyWrap) {
    bodyWrap.innerHTML = (lp.content || []).map(block => {
      if (block.type === 'h3') return `<h3>${renderInlineMarkdown(block.text)}</h3>`;
      if (block.type === 'p')  return `<p>${renderInlineMarkdown(block.text)}</p>`;
      return '';
    }).join('');
  }

  // Gallery
  const gallery = document.getElementById('article-gallery');
  if (gallery) {
    gallery.innerHTML = (post.gallery || []).map((item, i) => {
      // Backward-compatible: plain string = image
      if (typeof item === 'string') {
        const src = asset(item);
        return `
      <div class="gallery-item" data-src="${src}" role="button" tabindex="0" aria-label="View image ${i + 1}">
        <img src="${src}" alt="${lp.title} — image ${i + 1}" loading="lazy" />
      </div>
    `;
      }
      // TikTok embed
      if (item.type === 'tiktok') {
        const match = item.url.match(/video\/(\d+)/);
        const videoId = match ? match[1] : '';
        return `
      <div class="gallery-video">
        <blockquote class="tiktok-embed" cite="${item.url}" data-video-id="${videoId}">
          <a href="${item.url}"></a>
        </blockquote>
      </div>
    `;
      }
      // YouTube embed (bonus — in case you want it later)
      if (item.type === 'youtube') {
        return `
      <div class="gallery-video">
        <iframe src="https://www.youtube.com/embed/${item.id}"
                title="YouTube video"
                frameborder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowfullscreen></iframe>
      </div>
    `;
      }
      return '';
    }).join('');

    // Load TikTok embed script if there are any TikTok videos
    if (post.gallery?.some(g => g.type === 'tiktok')) {
      if (!document.querySelector('script[src*="tiktok.com/embed.js"]')) {
        const tiktokScript = document.createElement('script');
        tiktokScript.src = 'https://www.tiktok.com/embed.js';
        tiktokScript.async = true;
        document.body.appendChild(tiktokScript);
      } else if (window.tiktokEmbedLoad) {
        window.tiktokEmbedLoad();
      }
    }

    bindLightbox(gallery);
  }
}

/* ---------------------------------------------------------------
   LIGHTBOX
   --------------------------------------------------------------- */
function bindLightbox(scope) {
  const lightbox    = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightbox-img');
  const closeBtn    = document.querySelector('.lightbox-close');
  if (!lightbox || !lightboxImg) return;

  const open = (src) => {
    lightboxImg.src = src;
    lightbox.hidden = false;
    document.body.style.overflow = 'hidden';
  };

  const close = () => {
    lightbox.hidden = true;
    lightboxImg.src = '';
    document.body.style.overflow = '';
  };

  scope.querySelectorAll('.gallery-item').forEach(item => {
    item.addEventListener('click', () => open(item.dataset.src));
    item.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        open(item.dataset.src);
      }
    });
  });

  closeBtn?.addEventListener('click', close);
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) close();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !lightbox.hidden) close();
  });
}

function showArticleError() {
  const loading = document.getElementById('article-loading');
  const error   = document.getElementById('article-error');
  if (loading) loading.hidden = true;
  if (error)   error.hidden   = false;
}

/** No-op on pages without #article-content. */
export async function initArticle() {
  if (!document.getElementById('article-content')) return;

  onLanguageChange(() => {
    if (currentPost) renderArticle(currentPost);
  });

  const posts = await loadBlogData();
  if (!posts) {
    showArticleError();
    return;
  }

  const slug = getSlugFromURL();
  const post = posts.find(p => p.slug === slug);
  if (!post) {
    showArticleError();
    return;
  }

  currentPost = post;
  renderArticle(post);

  // swap loading -> content
  document.getElementById('article-loading').hidden = true;
  document.getElementById('article-content').hidden = false;

  // The rendered post carries no [data-i18n] nodes today, but re-applying
  // keeps this correct if the template ever gains one.
  applyStaticTranslations();
}
