/* ==========================================================================
   DION SHERIFI - core/reveal.js
   Fade-and-lift elements in as they scroll into view.
   Styles live in css/components/scroll-reveal.css.
   ========================================================================== */

let io;

/**
 * Call with no arguments to sweep the page for the usual targets, or with a
 * NodeList to reveal cards that were just injected into a grid.
 */
export function applyReveal(extraNodes) {
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
