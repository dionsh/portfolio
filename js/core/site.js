/* ==========================================================================
   DION SHERIFI - core/site.js
   The chrome that every page carries: mobile menu, navbar scroll state and
   the footer year.
   ========================================================================== */

/** Close the collapsed mobile menu when a nav link is tapped. */
function initMobileMenu() {
  const navCollapse = document.getElementById('navContent');
  if (!navCollapse) return;

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

/** Solid navbar background once the page is scrolled. */
function initNavbarScroll() {
  const navbar = document.querySelector('.custom-navbar');
  if (!navbar) return;

  const onScroll = () => {
    if (window.scrollY > 30) navbar.classList.add('scrolled');
    else navbar.classList.remove('scrolled');
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

function initFooterYear() {
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();
}

export function initSite() {
  initMobileMenu();
  initNavbarScroll();
  initFooterYear();
}
