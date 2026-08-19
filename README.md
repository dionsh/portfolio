# dionsherifi.com

Personal portfolio — live at **[dionsherifi.com](https://dionsherifi.com)**.

Static HTML/CSS/JS. No framework and no dependencies to install. The only build
step prerenders the blog posts (`node build/build-blog.js`, see
[docs/blog-build.md](docs/blog-build.md)).

## Structure

```
index.html                  Homepage — hero, about, 4 featured projects, 4 posts, contact
blog.html                   Every blog post
projects.html               Every project
article.html                Single-post template (also the build/ generator's template)
404.html                    Served for any unmatched URL
blog/<slug>/index.html      Prerendered posts — generated, see docs/blog-build.md

css/base.css                Loaded everywhere: tokens, reset, navbar, buttons, footer
css/components/*.css        Shared blocks — hero, section, project-card, blog-card,
                            scroll-reveal
css/pages/*.css             One per page: index, projects, blog, article, 404

js/pages/*.js               One entry module per page — the only script each page loads
js/components/*.js          blog-cards, project-cards, article
js/core/*.js                translations, i18n, site chrome, utils, reveal, data

json/blog.json              All blog content, bilingual (EN / SQ)
json/projects.json          All project content, bilingual (EN / SQ)
images/                     Project shots and blog photos
build/build-blog.js         Prerenders json/blog.json into blog/<slug>/index.html
docs/blog-build.md          How the blog build step works

favicon.ico / .svg          Icons; favicon-96x96, apple-touch-icon and the two
                            web-app-manifest PNGs sit beside them at the root
site.webmanifest            Installable-app metadata, points at the manifest icons
robots.txt                  Crawler rules, points at the sitemap
sitemap.xml                 Listed URLs for search engines
vercel.json                 Redirects the .vercel.app URL to the apex domain
```

## How the CSS and JS are split

Every page loads `css/base.css` first, then only the components it actually
uses, then its own page stylesheet:

| Page            | Stylesheets, in link order                                                                |
| --------------- | ----------------------------------------------------------------------------------------- |
| `index.html`    | base, hero, section, project-card, blog-card, **pages/index**, scroll-reveal               |
| `projects.html` | base, section, project-card, **pages/projects**, scroll-reveal                             |
| `blog.html`     | base, section, blog-card, **pages/blog**, scroll-reveal                                    |
| `article.html`  | base, **pages/article**                                                                     |
| `404.html`      | base, hero, **pages/404**                                                                   |

`pages/projects.css` and `pages/blog.css` are intentionally empty — those pages
are built entirely from shared layers, and the file is the obvious place to put
page-specific rules later.

**`components/scroll-reveal.css` must stay last.** `.reveal.visible` and the
card `:hover` rules have equal specificity, so the later one wins. It sat at the
bottom of the old single stylesheet, which is why a revealed card keeps its
border and shadow hover but not the lift. Linking it earlier would silently turn
that lift back on.

The JavaScript mirrors this. Each page loads exactly one ES module
(`<script type="module" src="js/pages/<page>.js">`), which imports what it
needs. Shared UI state lives in `js/core/i18n.js`: renderers subscribe with
`onLanguageChange()` instead of i18n reaching into them, so no core module
needs to know which page it is on.

Each renderer is a no-op unless its element is present, so a page only pays for
what it shows:

| Element            | Present on                      | Rendered by                         |
| ------------------ | ------------------------------- | ----------------------------------- |
| `#blog-grid`       | `index.html`, `blog.html`       | `js/components/blog-cards.js`       |
| `#work-grid`       | `index.html`, `projects.html`   | `js/components/project-cards.js`    |
| `#article-content` | `article.html`, `/blog/<slug>/` | `js/components/article.js`          |

The same grid is reused across pages; how much it shows is driven by data
attributes on the grid itself, so no page hardcodes content:

- `data-blog-limit="4"` — show only 4 posts (omit it to show all)
- `data-project-mode="featured"` — show only projects flagged `"featured": true`
  (omit it to show all)

Several files have to sit at the repository root and cannot be foldered:

- `robots.txt` — the spec defines it as `/robots.txt`; crawlers look nowhere else
- `vercel.json` — Vercel only reads its config from the root
- `favicon.ico` — browsers request `/favicon.ico` by default, and the rest of
  the icon set plus `site.webmanifest` are referenced from the root
- `index.html` / `article.html` — moving these would change the public URLs,
  which are baked into `sitemap.xml` and the canonical tags

## Local preview

The pages load their content over `fetch` and their scripts as ES modules, so
opening `index.html` directly from disk will not work — it needs to be served
over HTTP:

```bash
python -m http.server 8137
```

Then open <http://localhost:8137>.

## Deploying

Pushing to `main` deploys to production automatically via Vercel.
Any other branch gets its own preview URL.

```bash
git add -A
git commit -m "your message"
git push
```

## Adding a blog post

1. Add an entry to the `posts` array in `json/blog.json`, with both `en` and `sq`
   objects and a unique `slug`.
2. Add a matching `<url>` block to `sitemap.xml` so search engines pick it up —
   the article links are generated by JavaScript, so the sitemap is how
   crawlers reliably discover them.

Posts are sorted by `date` at runtime, so `blog.html` always lists everything
newest first with no extra work.

### Which posts show on the homepage

The homepage grid holds 4 posts and is **curated, not purely chronological** —
the section is headed "Highlights from my journey", and a standout post should
not scroll off the front page just because it got older.

A post claims a fixed slot with `"homeOrder"`:

```json
"date": "2026-05-23",
"homeOrder": 2,
```

Pinned posts come first, in `homeOrder` order. Any slots left over are filled
with the most recent unpinned posts, so the grid is never short.

All 4 slots are currently pinned, which means **a new post will not appear on
the homepage on its own** — give it a `homeOrder` and renumber the others, or
drop a `homeOrder` from a post you want to retire to the full blog page.

## Adding a project

Add an entry to the `projects` array in `json/projects.json`. Set
`"featured": true` on exactly the projects that should appear on the homepage;
every project shows on `projects.html` regardless, in file order.

`live` and `github` are both optional — omit either and that link is left off
the card rather than rendering a dead button.

## Image paths are case-sensitive

Vercel serves from a case-sensitive filesystem, but local Windows previews are
not. A path that works locally can still 404 in production, so match the
on-disk name exactly — including extensions like `.JPG`.

## Domain & DNS

Registered with Cloudflare Registrar; DNS is on Cloudflare pointing at Vercel.

Records are deliberately **DNS-only (grey cloud), not proxied** — Vercel already
provides edge caching and DDoS protection, and proxying risks serving a stale
the CSS and JS since those filenames are not content-hashed.

`www` and the `.vercel.app` URL both redirect to the apex domain.
