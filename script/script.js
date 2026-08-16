/* ==========================================================================
   DION SHERIFI — Portfolio JS
   Features: EN/SQ language toggle, mobile menu close, navbar scroll state,
             scroll reveal, blog cards loaded from json/blog.json,
             project cards loaded from json/projects.json,
             article.html dynamic renderer with lightbox.

   One script for every page. Which parts run is decided in boot() by
   probing for #blog-grid, #work-grid and #article-content.
   ========================================================================== */

(() => {
  'use strict';

  /* ---------------------------------------------------------------
     1. STATIC TRANSLATIONS (UI strings)
     --------------------------------------------------------------- */
  const translations = {
    en: {
      'nav.home':       'Home',
      'nav.about':      'About',
      'nav.work':       'My Work',
      'nav.blog':       'My Blog',
      'nav.contact':    'Contact',

      'hero.greet':     '// hello world, my name is',
      'hero.sub':       'Full-Stack Developer building things that solve real problems.',
      'hero.cta1':      'See my work',
      'hero.cta2':      'Get in touch',
      'hero.scroll':    'scroll',

      'about.title':    'About me',
      'about.p1':       "Hi! I'm <strong>Dion Sherifi</strong>, a full-stack developer and a second-year student at <strong>Digital School Ferizaj</strong>. I love turning ideas into real, working products — especially the kind of tools people actually use day to day.",
      'about.p2':       "I'm most at home in <strong>PHP &amp; MySQL</strong>, where I build the backend logic and data layer for full applications. On the frontend I work with HTML, CSS, JavaScript, React.js, React Native and WordPress.",
      'about.p3':       "I'm currently open to freelance work and collaboration. If you have an idea you want shipped, let's talk.",
      'about.stackTitle': 'My stack',

      'work.title':     'My work',
      'work.sub':       "A selection of projects I've built. Each one solves a specific problem.",
      'work.allTitle':  'All projects',
      'work.allSub':    "Everything I've built so far. Each one solves a specific problem.",
      'work.loading':   'Loading projects…',
      'work.error':     'Could not load projects. Please try again later.',
      'work.seeAll':    'See All Projects <i class="bi bi-arrow-right"></i>',

      'card.live':      'Live Demo',
      'card.github':    'View on GitHub',

      'blog.title':     'My blog',
      'blog.heading':   'Highlights from my journey',
      'blog.sub':       'Moments, wins, and lessons from competitions, projects, and growth as a developer.',
      'blog.allTitle':  'All posts',
      'blog.allSub':    "Every post I've written — moments, wins, and lessons from competitions, projects, and growth as a developer.",
      'blog.loading':   'Loading posts…',
      'blog.read':      'Read Article',
      'blog.error':     'Could not load posts. Please try again later.',
      'blog.seeAll':    'See All Posts <i class="bi bi-arrow-right"></i>',

      'nav.backHome':   '<i class="bi bi-arrow-left"></i> Back to home',

      'notfound.greet': '// error 404',
      'notfound.tag':   '&lt;page not found<span class="cursor">/</span>&gt;',
      'notfound.sub':   "This page doesn't exist, or it moved somewhere else. Let's get you back on track.",
      'notfound.home':  'Back to home',
      'notfound.work':  'See my work',
      'notfound.blog':  'Read the blog',

      'contact.title':  'Get in touch',
      'contact.lead':   "I'm currently open to freelance work and collaboration. Whether it's a project idea, a question, or just a hello — my inbox is open.",

      'footer.text':    'Designed & built by Dion Sherifi',
      'footer.rights':  'All rights reserved',

      'article.back':       'Back to blog',
      'article.loading':    'Loading article…',
      'article.errorTitle': 'Article not found',
      'article.errorText':  "The article you're looking for doesn't exist or has been moved.",
      'article.errorBack':  'Back to blog',
      'article.author':     'By Dion Sherifi',
      'article.read':       'min read'
    },

    sq: {
      'nav.home':       'Kreu',
      'nav.about':      'Rreth meje',
      'nav.work':       'Punët e mia',
      'nav.blog':       'Blogu im',
      'nav.contact':    'Kontakti',

      'hero.greet':     '// përshëndetje, unë jam',
      'hero.sub':       'Zhvillues Full-Stack që ndërton programe që zgjidhin probleme reale.',
      'hero.cta1':      'Shiko punët e mia',
      'hero.cta2':      'Më kontakto',
      'hero.scroll':    'lëviz',

      'about.title':    'Rreth meje',
      'about.p1':       "Përshëndetje! Unë jam <strong>Dion Sherifi</strong>, zhvillues full-stack dhe nxënës i vitit të dytë në <strong>Shkollën Digjitale Ferizaj</strong>. Më pëlqen t'i kthej idetë në produkte reale që funksionojnë — sidomos mjete që njerëzit i përdorin përditë.",
      'about.p2':       "Jam më i komodë me <strong>PHP &amp; MySQL</strong>, ku ndërtoj logjikën backend dhe shtresën e të dhënave për aplikacione të plota. Në frontend punoj me HTML, CSS, JavaScript, React.js, React Native dhe WordPress.",
      'about.p3':       'Aktualisht jam i hapur për punë freelance dhe bashkëpunime. Nëse ke një ide që dëshiron ta realizosh, le të bisedojmë.',
      'about.stackTitle': 'Stack-u im',

      'work.title':     'Punët e mia',
      'work.sub':       'Një përzgjedhje projektesh që kam ndërtuar. Secili zgjidh një problem specifik.',
      'work.allTitle':  'Të gjitha projektet',
      'work.allSub':    'Gjithçka që kam ndërtuar deri tani. Secili zgjidh një problem specifik.',
      'work.loading':   'Po ngarkohen projektet…',
      'work.error':     'Nuk mund të ngarkohen projektet. Provo më vonë.',
      'work.seeAll':    'Shiko të Gjitha Projektet <i class="bi bi-arrow-right"></i>',

      'card.live':      'Demo Live',
      'card.github':    'Shiko në GitHub',

      'blog.title':     'Blogu im',
      'blog.heading':   'Momentet kryesore nga rrugëtimi im',
      'blog.sub':       'Momente, fitore dhe mësime nga garat, projektet dhe rritja si zhvillues.',
      'blog.allTitle':  'Të gjitha postimet',
      'blog.allSub':    'Çdo postim që kam shkruar — momente, fitore dhe mësime nga garat, projektet dhe rritja si zhvillues.',
      'blog.loading':   'Po ngarkohen postimet…',
      'blog.read':      'Lexo Artikullin',
      'blog.error':     'Nuk mund të ngarkohen postimet. Provo më vonë.',
      'blog.seeAll':    'Shiko të Gjitha Postimet <i class="bi bi-arrow-right"></i>',

      'nav.backHome':   '<i class="bi bi-arrow-left"></i> Kthehu te kreu',

      'notfound.greet': '// gabim 404',
      'notfound.tag':   '&lt;faqja nuk u gjet<span class="cursor">/</span>&gt;',
      'notfound.sub':   'Kjo faqe nuk ekziston, ose është zhvendosur diku tjetër. Le të të kthejmë në rrugën e duhur.',
      'notfound.home':  'Kthehu te kreu',
      'notfound.work':  'Shiko punët e mia',
      'notfound.blog':  'Lexo blogun',

      'contact.title':  'Më kontakto',
      'contact.lead':   'Aktualisht jam i hapur për punë freelance dhe bashkëpunime. Qoftë një ide projekti, një pyetje, apo thjesht një përshëndetje — kutia ime është e hapur.',

      'footer.text':    'Dizajnuar & ndërtuar nga Dion Sherifi',
      'footer.rights':  'Të gjitha të drejtat e rezervuara',

      'article.back':       'Kthehu te blogu',
      'article.loading':    'Po ngarkohet artikulli…',
      'article.errorTitle': 'Artikulli nuk u gjet',
      'article.errorText':  'Artikulli që po kërkoni nuk ekziston ose është zhvendosur.',
      'article.errorBack':  'Kthehu te blogu',
      'article.author':     'Nga Dion Sherifi',
      'article.read':       'min lexim'
    }
  };

  /* ---------------------------------------------------------------
     2. LANGUAGE STATE
     --------------------------------------------------------------- */
  const htmlEl   = document.documentElement;
  const savedLang = localStorage.getItem('site_lang');
  let currentLang = savedLang === 'sq' ? 'sq' : 'en';

  function applyStaticTranslations(lang) {
    const dict = translations[lang];
    if (!dict) return;
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      if (dict[key] !== undefined) el.innerHTML = dict[key];
    });
    htmlEl.setAttribute('lang', lang);
    htmlEl.setAttribute('data-lang', lang);
  }

  function setLang(lang) {
    currentLang = lang;
    localStorage.setItem('site_lang', lang);
    applyStaticTranslations(lang);

    // Re-render dynamic content if it exists
    if (blogData) renderBlogCards();
    if (projectData) renderProjectCards();
    if (currentPost) renderArticle(currentPost);

    // Update language toggle label (shows the *other* language)
    const langLabel = document.getElementById('langLabel');
    if (langLabel) langLabel.textContent = lang === 'en' ? 'SQ' : 'EN';
  }

  // Bind toggle button (on both pages)
  const langToggle = document.getElementById('langToggle');
  if (langToggle) {
    langToggle.addEventListener('click', () => {
      setLang(currentLang === 'en' ? 'sq' : 'en');
    });
  }

  /* ---------------------------------------------------------------
     3. MOBILE MENU close on link click
     --------------------------------------------------------------- */
  const navCollapse = document.getElementById('navContent');
  if (navCollapse) {
    document.querySelectorAll('#navContent .nav-link').forEach(link => {
      link.addEventListener('click', () => {
        if (navCollapse.classList.contains('show')) {
          const bsCollapse = bootstrap.Collapse.getInstance(navCollapse)
                            || new bootstrap.Collapse(navCollapse, { toggle: false });
          bsCollapse.hide();
        }
      });
    });
  }

  /* ---------------------------------------------------------------
     4. NAVBAR scroll state
     --------------------------------------------------------------- */
  const navbar = document.querySelector('.custom-navbar');
  if (navbar) {
    const onScroll = () => {
      if (window.scrollY > 30) navbar.classList.add('scrolled');
      else navbar.classList.remove('scrolled');
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ---------------------------------------------------------------
     5. CURRENT YEAR
     --------------------------------------------------------------- */
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------------------------------------------------------------
     6. UTILS
     --------------------------------------------------------------- */
  // Format date string ("2025-06-15") -> locale-friendly format
  function formatDate(isoDate, lang) {
    const d = new Date(isoDate);
    if (isNaN(d)) return isoDate;
    const locale = lang === 'sq' ? 'sq-AL' : 'en-US';
    return d.toLocaleDateString(locale, { year: 'numeric', month: 'long', day: 'numeric' });
  }

  // Root-absolute asset path. Prerendered posts live at /blog/<slug>/, two
  // levels deep, so a bare "images/…" would resolve against that directory.
  function asset(p) {
    if (!p || /^https?:\/\//.test(p) || p.startsWith('/')) return p;
    return '/' + p;
  }

  // Escape a value before dropping it into an HTML attribute
  function esc(value) {
    return String(value ?? '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  // Minimal inline markdown: **bold** only (keeps it safe & simple)
  function renderInlineMarkdown(text) {
    // Escape HTML first
    const escaped = text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
    // Then replace **...** with <strong>
    return escaped.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
  }

  /* ---------------------------------------------------------------
     7. DATA loading — blog posts + projects
     --------------------------------------------------------------- */
  let blogData    = null;       // full posts array, sorted newest first
  let projectData = null;       // full projects array, in file order
  let currentPost = null;       // post viewed on article.html

  async function fetchJSON(path) {
    const res = await fetch(path, { cache: 'no-store' });
    if (!res.ok) throw new Error(path + ' HTTP ' + res.status);
    return res.json();
  }

  async function loadBlogData() {
    try {
      const data = await fetchJSON('/json/blog.json');
      // Sorted newest first, so "the 3 latest" is just a slice of this order
      blogData = (data.posts || []).sort((a, b) => new Date(b.date) - new Date(a.date));
      return blogData;
    } catch (err) {
      console.error('Failed to load blog.json:', err);
      return null;
    }
  }

  async function loadProjectData() {
    try {
      const data = await fetchJSON('/json/projects.json');
      projectData = data.projects || [];
      return projectData;
    } catch (err) {
      console.error('Failed to load projects.json:', err);
      return null;
    }
  }

  /* ---------------------------------------------------------------
     8. BLOG CARDS — homepage (latest N) and blog.html (all)
     --------------------------------------------------------------- */
  const blogGrid = document.getElementById('blog-grid');

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
    const dict = translations[currentLang];

    if (blogData.length === 0) {
      blogGrid.innerHTML = `<div class="col-12 blog-loading">${dict['blog.error']}</div>`;
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
                ${dict['blog.read']} <i class="bi bi-arrow-right"></i>
              </a>
            </div>
          </article>
        </div>
      `;
    }).join('');

    // Re-apply scroll reveal to new cards
    applyReveal(blogGrid.querySelectorAll('.blog-card'));
  }

  /* ---------------------------------------------------------------
     9. PROJECT CARDS — homepage (featured) and projects.html (all)
     --------------------------------------------------------------- */
  const workGrid = document.getElementById('work-grid');

  function renderProjectCards() {
    if (!workGrid || !projectData) return;
    const dict = translations[currentLang];

    if (projectData.length === 0) {
      workGrid.innerHTML = `<div class="col-12 blog-loading">${dict['work.error']}</div>`;
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
                <span>${dict['card.live']}</span>
                <i class="bi bi-box-arrow-up-right"></i>
              </a>` : '';

      const githubLink = project.github ? `
              <a href="${esc(project.github)}" target="_blank" rel="noopener" class="project-github">
                <i class="bi bi-github"></i>
                <span>${dict['card.github']}</span>
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

  /* ---------------------------------------------------------------
     10. ARTICLE PAGE: render single post
     --------------------------------------------------------------- */
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
    const lp = post[currentLang] || post.en;
    const dict = translations[currentLang];

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
     11. LIGHTBOX
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

  /* ---------------------------------------------------------------
     12. SCROLL REVEAL
     --------------------------------------------------------------- */
  let io;
  function applyReveal(extraNodes) {
    const newSelectors = '.section-head, .about-text, .code-card, .stack-grid, ' +
                         '.about-subtitle, .project-card, .blog-card, ' +
                         '.contact-card, .contact-lead, .section-sub, .blog-heading';
    const targets = extraNodes
      ? Array.from(extraNodes)
      : Array.from(document.querySelectorAll(newSelectors));

    targets.forEach(el => {
      if (!el.classList.contains('reveal')) el.classList.add('reveal');
    });

    if (!('IntersectionObserver' in window)) {
      targets.forEach(el => el.classList.add('visible'));
      return;
    }

    if (!io) {
      io = new IntersectionObserver((entries) => {
        entries.forEach((entry, i) => {
          if (entry.isIntersecting) {
            setTimeout(() => entry.target.classList.add('visible'), i * 60);
            io.unobserve(entry.target);
          }
        });
      }, { threshold: 0.12, rootMargin: '0px 0px -50px 0px' });
    }

    targets.forEach(el => io.observe(el));
  }

  /* ---------------------------------------------------------------
     13. BOOT — decides what to do based on the current page
     --------------------------------------------------------------- */
  function mountArticle(posts) {
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
    // re-apply translations now that DOM has new [data-i18n] nodes — actually not added,
    // but keep this safe in case future content uses them
    applyStaticTranslations(currentLang);
  }

  async function boot() {
    // Apply UI strings first so anything visible is already translated
    setLang(currentLang);
    applyReveal();

    // Detect what this page needs by looking for unique elements.
    // #blog-grid   -> index.html (latest 3) and blog.html (all)
    // #work-grid   -> index.html (featured) and projects.html (all)
    // #article-content -> article.html
    const isArticlePage = !!document.getElementById('article-content');
    const jobs = [];

    if (blogGrid || isArticlePage) {
      jobs.push(loadBlogData().then(data => {
        if (!data) {
          if (blogGrid) {
            blogGrid.innerHTML = `<div class="col-12 blog-loading">${translations[currentLang]['blog.error']}</div>`;
          }
          if (isArticlePage) showArticleError();
          return;
        }
        if (blogGrid) renderBlogCards();
        if (isArticlePage) mountArticle(data);
      }));
    }

    if (workGrid) {
      jobs.push(loadProjectData().then(data => {
        if (!data) {
          workGrid.innerHTML = `<div class="col-12 blog-loading">${translations[currentLang]['work.error']}</div>`;
          return;
        }
        renderProjectCards();
      }));
    }

    await Promise.all(jobs);
  }

  function showArticleError() {
    const loading = document.getElementById('article-loading');
    const error   = document.getElementById('article-error');
    if (loading) loading.hidden = true;
    if (error)   error.hidden   = false;
  }

  // Kick things off
  boot();

})();