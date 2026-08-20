/* ==========================================================================
   DION SHERIFI - core/translations.js
   Every static UI string, in English and Albanian.

   Keys match the data-i18n attributes in the HTML. Values may contain HTML
   (they are assigned with innerHTML), which is how the arrow icons and
   <strong> tags survive a language switch.
   ========================================================================== */

export const translations = {
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
