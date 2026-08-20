#!/usr/bin/env node
/**
 * Sanity-check sitemap.xml against the JSON that drives the site.
 *
 * sitemap.xml is maintained by hand, and since it also lists page images a new
 * post has to be added in up to three places (its own <url>, /blog.html, and /
 * when the post has a homeOrder). This catches the entries that get forgotten.
 *
 *   node build/check-sitemap.js
 *
 * Exits 1 if anything is wrong, so it can gate a commit.
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const ORIGIN = 'https://dionsherifi.com';

const read = (p) => fs.readFileSync(path.join(ROOT, p), 'utf8');
const load = (p) => JSON.parse(read(p));

const sitemap = read('sitemap.xml');
const blog = load('json/blog.json');
const proj = load('json/projects.json');
const posts = Array.isArray(blog) ? blog : blog.posts;
const projects = Array.isArray(proj) ? proj : proj.projects;

const problems = [];
const note = (msg) => problems.push(msg);

// --- parse the sitemap into { loc, images[] } ------------------------------
const urls = [...sitemap.matchAll(/<url>([\s\S]*?)<\/url>/g)].map((m) => ({
  loc: (m[1].match(/<loc>([^<]+)<\/loc>/) || [])[1],
  lastmod: (m[1].match(/<lastmod>([^<]+)<\/lastmod>/) || [])[1],
  images: [...m[1].matchAll(/<image:loc>([^<]+)<\/image:loc>/g)].map((i) => i[1]),
}));

const byLoc = Object.fromEntries(urls.map((u) => [u.loc, u]));
const rel = (url) => decodeURIComponent(String(url).replace(ORIGIN + '/', ''));
const imagesOf = (loc) => new Set((byLoc[loc] ? byLoc[loc].images : []).map(rel));

// Gallery entries can be embed objects (e.g. TikTok), not image paths.
const paths = (arr) => (arr || []).filter((g) => typeof g === 'string');

// --- structural checks -----------------------------------------------------
if (!sitemap.includes('xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"')) {
  note('urlset is missing the xmlns:image namespace declaration');
}
const open = (sitemap.match(/<image:image>/g) || []).length;
const close = (sitemap.match(/<\/image:image>/g) || []).length;
if (open !== close) note(`unbalanced <image:image> tags: ${open} open, ${close} closed`);

// --- every post has a <url>, with its cover and gallery --------------------
for (const post of posts) {
  const loc = `${ORIGIN}/blog/${post.slug}`;
  if (!byLoc[loc]) {
    note(`post "${post.slug}" has no <url> entry`);
    continue;
  }
  const listed = imagesOf(loc);
  for (const img of [post.image, ...paths(post.gallery)]) {
    if (!listed.has(img)) note(`post "${post.slug}" is missing image: ${img}`);
  }
}

// --- listing pages carry the images they render ----------------------------
const blogListing = imagesOf(`${ORIGIN}/blog.html`);
for (const post of posts) {
  if (!blogListing.has(post.image)) {
    note(`/blog.html is missing the cover for "${post.slug}": ${post.image}`);
  }
}

const projListing = imagesOf(`${ORIGIN}/projects.html`);
for (const p of projects) {
  if (!projListing.has(p.image)) {
    note(`/projects.html is missing the image for "${p.slug}": ${p.image}`);
  }
}

const home = imagesOf(`${ORIGIN}/`);
for (const p of projects.filter((x) => x.featured)) {
  if (!home.has(p.image)) note(`/ is missing the featured project image for "${p.slug}": ${p.image}`);
}
for (const post of posts.filter((x) => x.homeOrder)) {
  if (!home.has(post.image)) note(`/ is missing the homeOrder cover for "${post.slug}": ${post.image}`);
}

// --- nothing points at a file that isn't there ------------------------------
for (const u of urls) {
  for (const img of u.images) {
    const file = rel(img);
    if (!img.startsWith(ORIGIN + '/')) note(`image is not an absolute ${ORIGIN} URL: ${img}`);
    else if (!fs.existsSync(path.join(ROOT, file))) note(`image does not exist on disk: ${file}`);
  }
  if (u.lastmod && !/^\d{4}-\d{2}-\d{2}$/.test(u.lastmod)) {
    note(`<lastmod> is not YYYY-MM-DD on ${u.loc}: ${u.lastmod}`);
  }
}

// --- report -----------------------------------------------------------------
const imageCount = urls.reduce((n, u) => n + u.images.length, 0);

if (problems.length) {
  console.error(`check-sitemap: ${problems.length} problem(s)\n`);
  for (const p of problems) console.error('  - ' + p);
  console.error('');
  process.exit(1);
}

console.log(`check-sitemap: OK — ${urls.length} urls, ${imageCount} images, all present on disk`);
