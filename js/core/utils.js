/* ==========================================================================
   DION SHERIFI - core/utils.js
   Small helpers shared by the card grids and the article renderer.

   esc(), asset() and renderInlineMarkdown() are mirrored in
   build/build-blog.js, so the prerendered HTML and the hydrated HTML come
   out the same. Change one, change the other.
   ========================================================================== */

/** Format date string ("2025-06-15") -> locale-friendly format. */
export function formatDate(isoDate, lang) {
  const d = new Date(isoDate);
  if (isNaN(d)) return isoDate;
  const locale = lang === 'sq' ? 'sq-AL' : 'en-US';
  return d.toLocaleDateString(locale, { year: 'numeric', month: 'long', day: 'numeric' });
}

/**
 * Root-absolute asset path. Prerendered posts live at /blog/<slug>/, two
 * levels deep, so a bare "images/…" would resolve against that directory.
 */
export function asset(p) {
  if (!p || /^https?:\/\//.test(p) || p.startsWith('/')) return p;
  return '/' + p;
}

/** Escape a value before dropping it into an HTML attribute. */
export function esc(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

/** Minimal inline markdown: **bold** only (keeps it safe & simple). */
export function renderInlineMarkdown(text) {
  // Escape HTML first
  const escaped = text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
  // Then replace **...** with <strong>
  return escaped.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
}

export async function fetchJSON(path) {
  const res = await fetch(path, { cache: 'no-store' });
  if (!res.ok) throw new Error(path + ' HTTP ' + res.status);
  return res.json();
}
