/* ==========================================================================
   DION SHERIFI — Portfolio JS
   Features: EN/SQ language toggle, mobile menu close, navbar scroll state,
             scroll reveal, blog cards loaded from blog.json,
             article.html dynamic renderer with lightbox.
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
      'about.p2':       "I'm most at home in <strong>PHP &amp; MySQL</strong>, where I build the backend logic and data layer for full applications. On the frontend I work with HTML, CSS, JavaScript, React Native and WordPress.",
      'about.p3':       "I'm currently open to freelance work and collaboration. If you have an idea you want shipped, let's talk.",
      'about.stackTitle': 'My stack',

      'work.title':     'My work',
      'work.sub':       "A selection of projects I've built. Each one solves a specific problem.",

      'card.live':      'Live Demo',
      'card.github':    'View on GitHub',
      'card.1.desc':    'HumanityConnect is a Good Deeds Tracker that connects volunteers with events and tracks their hours or achievements.',
      'card.2.desc':    'DS Banking is a React Native mobile banking app that lets users securely manage finances on the go.',
      'card.3.desc':    'A modern, high-fashion concept website inspired by Vogue, meticulously crafted with WordPress to deliver a premium editorial experience.',
      'card.4.desc':    'DION SHERIFI Bookings is an all-in-one reservation ecosystem built to handle scheduling across multiple business sectors. The platform connects clients and businesses through three tailored user roles.',

      'blog.title':     'My blog',
      'blog.heading':   'Highlights from my journey',
      'blog.sub':       'Moments, wins, and lessons from competitions, projects, and growth as a developer.',
      'blog.loading':   'Loading posts…',
      'blog.read':      'Read Article',
      'blog.error':     'Could not load posts. Please try again later.',

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
      'about.p2':       "Jam më i komodë me <strong>PHP &amp; MySQL</strong>, ku ndërtoj logjikën backend dhe shtresën e të dhënave për aplikacione të plota. Në frontend punoj me HTML, CSS, JavaScript, React Native dhe WordPress",
      'about.p3':       'Aktualisht jam i hapur për punë freelance dhe bashkëpunime. Nëse ke një ide që dëshiron ta realizosh, le të bisedojmë.',
      'about.stackTitle': 'Stack-u im',

      'work.title':     'Punët e mia',
      'work.sub':       'Një përzgjedhje projektesh që kam ndërtuar. Secili zgjidh një problem specifik.',

      'card.live':      'Demo Live',
      'card.github':    'Shiko në GitHub',
      'card.1.desc':    'HumanityConnect është një Gjurmues i Veprave të Mira që lidh vullnetarët me ngjarjet dhe paraqet orët ose arritjet e tyre.',
      'card.2.desc':    'DS Banking është një aplikacion bankar celular me React Native që u lejon përdoruesve të menaxhojnë në mënyrë të sigurt financat në lëvizje.',
      'card.3.desc':    'Një website modern dhe me koncept të modës së lartë, e frymëzuar nga Vogue, e krijuar me WordPress për të ofruar një përvojë editoriale premium.',
      'card.4.desc':    'DION SHERIFI Bookings është një ekosistem rezervimesh gjithëpërfshirës i ndërtuar për të trajtuar planifikimin në sektorë të shumtë biznesi. Platforma lidh klientët dhe bizneset përmes tre roleve të personalizuara të përdoruesit.',

      'blog.title':     'Blogu im',
      'blog.heading':   'Momentet kryesore nga rrugëtimi im',
      'blog.sub':       'Momente, fitore dhe mësime nga garat, projektet dhe rritja si zhvillues.',
      'blog.loading':   'Po ngarkohen postimet…',
      'blog.read':      'Lexo Artikullin',
      'blog.error':     'Nuk mund të ngarkohen postimet. Provo më vonë.',

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
     7. BLOG DATA loading
     --------------------------------------------------------------- */
  let blogData = null;          // full posts array
  let currentPost = null;       // post viewed on article.html

  async function loadBlogData() {
    try {
      const res = await fetch('blog.json', { cache: 'no-store' });
      if (!res.ok) throw new Error('blog.json HTTP ' + res.status);
      const data = await res.json();
      blogData = (data.posts || []).sort((a, b) => new Date(b.date) - new Date(a.date));
      return blogData;
    } catch (err) {
      console.error('Failed to load blog.json:', err);
      return null;
    }
  }

  /* ---------------------------------------------------------------
     8. HOMEPAGE: render blog cards
     --------------------------------------------------------------- */
  const blogGrid = document.getElementById('blog-grid');

  function renderBlogCards() {
    if (!blogGrid || !blogData) return;
    const dict = translations[currentLang];

    if (blogData.length === 0) {
      blogGrid.innerHTML = `<div class="col-12 blog-loading">${dict['blog.error']}</div>`;
      return;
    }

    blogGrid.innerHTML = blogData.map(post => {
      const lp = post[currentLang] || post.en;
      const tagsHTML = (post.tags || []).slice(0, 4).map(t => `<span class="tag">${t}</span>`).join('');
      const url = `article.html?slug=${encodeURIComponent(post.slug)}`;

      return `
        <div class="col-md-6 col-lg-4">
          <article class="blog-card">
            <a href="${url}" class="blog-card-image">
              <img src="${post.image}" alt="${lp.title}" loading="lazy" />
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
     9. ARTICLE PAGE: render single post
     --------------------------------------------------------------- */
  function getSlugFromURL() {
    const params = new URLSearchParams(window.location.search);
    return params.get('slug');
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
      ? new URL(post.image, 'https://dionsherifi.com/').href
      : 'https://dionsherifi.com/images/og-card.png';

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
      coverImg.src = post.image;
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
    return `
      <div class="gallery-item" data-src="${item}" role="button" tabindex="0" aria-label="View image ${i + 1}">
        <img src="${item}" alt="${lp.title} — image ${i + 1}" loading="lazy" />
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
     10. LIGHTBOX
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
     11. SCROLL REVEAL
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
     12. BOOT — decides what to do based on the current page
     --------------------------------------------------------------- */
  async function boot() {
    // Apply UI strings first so anything visible is already translated
    setLang(currentLang);
    applyReveal();

    // Detect which page we're on by looking for unique elements
    const isBlogHome   = !!blogGrid;
    const isArticlePage = !!document.getElementById('article-content');

    if (isBlogHome || isArticlePage) {
      const data = await loadBlogData();

      if (!data) {
        // Failed to fetch
        if (blogGrid) {
          blogGrid.innerHTML = `<div class="col-12 blog-loading">${translations[currentLang]['blog.error']}</div>`;
        }
        if (isArticlePage) showArticleError();
        return;
      }

      if (isBlogHome) renderBlogCards();

      if (isArticlePage) {
        const slug = getSlugFromURL();
        const post = data.find(p => p.slug === slug);
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
    }
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