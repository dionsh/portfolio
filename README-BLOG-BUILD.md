# Blog build step

Blog posts are prerendered. `json/blog.json` is still the single source of
truth — but each post is also written out as a real HTML file so that its
title, description, cover image and text exist in the served HTML.

## Adding or editing a post

1. Edit `json/blog.json` as usual.
2. Run the generator:

   ```bash
   node build/build-blog.js
   ```

3. If you **added** a post, add its URL to `sitemap.xml`:

   ```xml
   <url>
     <loc>https://dionsherifi.com/blog/YOUR-SLUG</loc>
     <lastmod>2026-01-01</lastmod>
     <changefreq>yearly</changefreq>
     <priority>0.8</priority>
   </url>
   ```

4. Commit **both** `json/blog.json` and the generated `blog/` folder.

No dependencies, no `npm install`, and Vercel still just serves static files.
If you forget step 2, the site keeps working — the new post simply won't have
its own prerendered page until you run it.

## Why this exists

Link scrapers (LinkedIn, WhatsApp, Slack, Facebook) and weaker crawlers
(Bing/Edge) do not run JavaScript. Before this, every post shared the same
`article.html` shell, so all of them previewed as "Blog — Dion Sherifi" with
the generic site card, and search engines saw seven identical pages.

Now each post is a real page at `/blog/<slug>` with its own metadata.
`script.js` still hydrates it on load, which is what keeps the EN/SQ toggle
working.

## What is generated vs. hand-written

| Path | |
| --- | --- |
| `build/build-blog.js` | the generator |
| `article.html` | the **template** — edit this to change article layout |
| `blog/<slug>/index.html` | **generated, do not edit by hand** (wiped on each run) |

Because `blog/` is deleted and rebuilt every run, deleting a post from
`blog.json` also removes its page. Remember to drop it from `sitemap.xml` too.

## URLs

Posts live at `/blog/<slug>`. The old `/article.html?slug=<slug>` links still
work — `vercel.json` redirects them permanently (301) to the new URL, so
anything already shared or indexed keeps working.
