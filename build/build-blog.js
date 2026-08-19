#!/usr/bin/env node
/* ==========================================================================
   BLOG PRERENDERER

   Turns each post in json/blog.json into a real HTML file at
   blog/<slug>/index.html, so the URL is /blog/<slug> and the title,
   description, social image and article text are all in the served HTML —
   no JavaScript required.

   Why: link scrapers (LinkedIn, WhatsApp, Slack, Facebook) and weaker
   crawlers (Bing/Edge) never run JS, so the old article.html?slug=… shell
   looked identical for every post. See docs/blog-build.md.

   json/blog.json stays the single source of truth. js/pages/article.js
   still hydrates the page on load, which keeps the EN/SQ toggle working.

   Run after adding or editing a post:   node build/build-blog.js
   ========================================================================== */

'use strict';

const fs   = require('fs');
const path = require('path');

const ROOT     = path.join(__dirname, '..');
const ORIGIN   = 'https://dionsherifi.com';
const TEMPLATE = path.join(ROOT, 'article.html');
const DATA     = path.join(ROOT, 'json', 'blog.json');
const OUT_DIR  = path.join(ROOT, 'blog');

/* ---------------------------------------------------------------
   Helpers — these mirror js/core/utils.js so static and hydrated output match
   --------------------------------------------------------------- */

const escAttr = v => String(v ?? '')
  .replace(/&/g, '&amp;').replace(/</g, '&lt;')
  .replace(/>/g, '&gt;').replace(/"/g, '&quot;');

const escHTML = v => String(v ?? '')
  .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

// Same minimal markdown as js/core/utils.js: escape, then **bold** -> <strong>
const inlineMarkdown = text =>
  escHTML(text).replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');

// Root-absolute asset path, so pages two levels deep still resolve
const asset = p => (!p || /^https?:\/\//.test(p) || p.startsWith('/')) ? p : '/' + p;

const absURL = p => ORIGIN + asset(p);

const formatDate = iso => {
  const d = new Date(iso);
  if (isNaN(d)) return iso;
  return d.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
};

/** Replace exactly once, and fail loudly if the marker moved. */
function replaceOnce(html, pattern, replacement, label) {
  const matches = html.match(pattern);
  if (!matches) {
    throw new Error(
      `build-blog: could not find ${label} in article.html.\n` +
      `The template changed — update build/build-blog.js to match.`
    );
  }
  return html.replace(pattern, () => replacement);
}

/* ---------------------------------------------------------------
   Content builders
   --------------------------------------------------------------- */

function buildBody(content) {
  return (content || []).map(block => {
    if (block.type === 'h3') return `<h3>${inlineMarkdown(block.text)}</h3>`;
    if (block.type === 'p')  return `<p>${inlineMarkdown(block.text)}</p>`;
    return '';
  }).join('\n          ');
}

function buildGallery(gallery, title) {
  return (gallery || []).map((item, i) => {
    if (typeof item === 'string') {
      const src = asset(item);
      return `<div class="gallery-item" data-src="${escAttr(src)}" role="button" tabindex="0" aria-label="View image ${i + 1}">` +
             `<img src="${escAttr(src)}" alt="${escAttr(title)} — image ${i + 1}" loading="lazy" /></div>`;
    }
    if (item && item.type === 'tiktok') {
      const m = String(item.url).match(/video\/(\d+)/);
      return `<div class="gallery-video"><blockquote class="tiktok-embed" cite="${escAttr(item.url)}" data-video-id="${m ? m[1] : ''}">` +
             `<a href="${escAttr(item.url)}"></a></blockquote></div>`;
    }
    if (item && item.type === 'youtube') {
      return `<div class="gallery-video"><iframe src="https://www.youtube.com/embed/${escAttr(item.id)}" ` +
             `title="YouTube video" frameborder="0" allowfullscreen></iframe></div>`;
    }
    return '';
  }).join('\n          ');
}

function buildJsonLd(post, en, url) {
  return JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: en.title,
    description: en.description,
    image: absURL(post.image),
    datePublished: post.date,
    dateModified: post.date,
    author: { '@type': 'Person', name: 'Dion Sherifi', url: ORIGIN + '/' },
    publisher: { '@type': 'Person', name: 'Dion Sherifi' },
    mainEntityOfPage: { '@type': 'WebPage', '@id': url },
    keywords: (post.tags || []).join(', ')
  }, null, 2);
}

/* ---------------------------------------------------------------
   Render one post
   --------------------------------------------------------------- */

function renderPost(template, post) {
  const en    = post.en;
  const url   = `${ORIGIN}/blog/${post.slug}`;
  const title = `${en.title} — Dion Sherifi`;
  const cover = absURL(post.image);

  let html = template;

  // --- 1. Make every relative reference root-absolute (page lives 2 deep).
  //        The stylesheet and module lists come from article.html itself, so
  //        adding a <link> there needs no change here.
  html = html.replace(/href="(css\/[^"]+)"/g,         (_, p) => `href="/${p}"`);
  html = html.replace(/src="(js\/[^"]+)"/g,           (_, p) => `src="/${p}"`);
  html = html.replace(/href="index\.html"/g,          'href="/"');
  html = html.replace(/href="blog\.html"/g,           'href="/blog.html"');

  // --- 2. Head: title + description
  html = replaceOnce(html, /<title>[^<]*<\/title>/,
    `<title>${escHTML(title)}</title>`, '<title>');
  html = replaceOnce(html, /<meta id="meta-description" name="description" content="[^"]*" \/>/,
    `<meta id="meta-description" name="description" content="${escAttr(en.description)}" />`,
    'meta description');

  // --- 3. The template rewrites canonical/og:url from ?slug= at runtime.
  //        Prerendered pages bake the real URL in, so that script goes.
  html = replaceOnce(html, /\n  <script>\n    \(function \(\) \{[\s\S]*?\}\)\(\);\n  <\/script>\n/,
    '\n', 'inline canonical script');

  html = replaceOnce(html, /<link rel="canonical" id="canonical-link" href="[^"]*" \/>/,
    `<link rel="canonical" id="canonical-link" href="${escAttr(url)}" />`, 'canonical link');
  html = replaceOnce(html, /<meta property="og:url" id="og-url" content="[^"]*" \/>/,
    `<meta property="og:url" id="og-url" content="${escAttr(url)}" />`, 'og:url');
  html = replaceOnce(html, /<meta property="og:title" id="og-title" content="[^"]*" \/>/,
    `<meta property="og:title" id="og-title" content="${escAttr(title)}" />`, 'og:title');
  html = replaceOnce(html, /<meta property="og:description" id="og-description" content="[^"]*" \/>/,
    `<meta property="og:description" id="og-description" content="${escAttr(en.description)}" />`, 'og:description');
  html = replaceOnce(html, /<meta property="og:image" id="og-image" content="[^"]*" \/>/,
    `<meta property="og:image" id="og-image" content="${escAttr(cover)}" />`, 'og:image');
  html = replaceOnce(html, /<meta name="twitter:image" id="twitter-image" content="[^"]*" \/>/,
    `<meta name="twitter:image" id="twitter-image" content="${escAttr(cover)}" />`, 'twitter:image');

  // --- 4. Article structured data, right before </head>
  html = replaceOnce(html, /<\/head>/,
    `  <script type="application/ld+json">\n${buildJsonLd(post, en, url)}\n  </script>\n</head>`,
    '</head>');

  // --- 5. Tell the article module which post this is (no ?slug= on clean URLs)
  html = replaceOnce(html, /<body class="article-body">/,
    `<body class="article-body" data-slug="${escAttr(post.slug)}">`, '<body>');

  // --- 6. Swap the loading state for real content
  html = replaceOnce(html, /<div id="article-loading" class="article-loading">/,
    '<div id="article-loading" class="article-loading" hidden>', 'loading state');
  html = replaceOnce(html, /<article id="article-content" class="article-wrap" hidden>/,
    '<article id="article-content" class="article-wrap">', 'article content wrapper');

  // --- 7. Fill the content itself
  html = replaceOnce(html, /<img id="article-cover-img" src="" alt="" \/>/,
    `<img id="article-cover-img" src="${escAttr(asset(post.image))}" alt="${escAttr(en.title)}" />`,
    'cover image');
  html = replaceOnce(html, /<span id="article-category" class="article-category-pill">[^<]*<\/span>/,
    `<span id="article-category" class="article-category-pill">${escHTML(post.category)}</span>`, 'category pill');
  html = replaceOnce(html, /<h1 id="article-title" class="article-title">[^<]*<\/h1>/,
    `<h1 id="article-title" class="article-title">${escHTML(en.title)}</h1>`, 'article title');
  html = replaceOnce(html, /<span id="article-date">[^<]*<\/span>/,
    `<span id="article-date">${escHTML(formatDate(post.date))}</span>`, 'article date');
  html = replaceOnce(html, /<span id="article-readtime">[^<]*<\/span>/,
    `<span id="article-readtime">${escHTML(post.readTime || 5)}</span>`, 'read time');
  html = replaceOnce(html, /<div id="article-tags" class="article-tags"><\/div>/,
    `<div id="article-tags" class="article-tags">${(post.tags || []).map(t => `<span class="tag">${escHTML(t)}</span>`).join('')}</div>`,
    'tags');
  html = replaceOnce(html, /<div id="article-body" class="article-body-content"><\/div>/,
    `<div id="article-body" class="article-body-content">\n          ${buildBody(en.content)}\n        </div>`,
    'article body');
  html = replaceOnce(html, /<div id="article-gallery" class="article-gallery"><\/div>/,
    `<div id="article-gallery" class="article-gallery">\n          ${buildGallery(post.gallery, en.title)}\n        </div>`,
    'gallery');

  return html;
}

/* ---------------------------------------------------------------
   Main
   --------------------------------------------------------------- */

function main() {
  const template = fs.readFileSync(TEMPLATE, 'utf8');
  const posts    = JSON.parse(fs.readFileSync(DATA, 'utf8')).posts || [];

  if (!posts.length) { console.error('build-blog: no posts in blog.json'); process.exit(1); }

  // Wipe previously generated dirs so deleted posts don't linger as live pages
  if (fs.existsSync(OUT_DIR)) fs.rmSync(OUT_DIR, { recursive: true, force: true });
  fs.mkdirSync(OUT_DIR, { recursive: true });

  const seen = new Set();
  for (const post of posts) {
    if (!post.slug)     throw new Error('build-blog: a post is missing "slug"');
    if (seen.has(post.slug)) throw new Error(`build-blog: duplicate slug "${post.slug}"`);
    if (!post.en || !post.en.title) throw new Error(`build-blog: "${post.slug}" is missing en.title`);
    seen.add(post.slug);

    const dir = path.join(OUT_DIR, post.slug);
    fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(path.join(dir, 'index.html'), renderPost(template, post), 'utf8');
    console.log(`  /blog/${post.slug}`);
  }

  console.log(`\nbuild-blog: wrote ${posts.length} pages to blog/`);
  console.log('Remember to update sitemap.xml if you added a post.');
}

main();
