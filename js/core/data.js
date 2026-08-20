/* ==========================================================================
   DION SHERIFI - core/data.js
   Loads the two JSON content files.

   Paths are root-absolute because the prerendered posts at /blog/<slug>/ sit
   two levels deep. Each file is fetched at most once per page load; a failure
   resolves to null so callers can show their own error line.
   ========================================================================== */

import { fetchJSON } from './utils.js';

let blogPromise = null;
let projectPromise = null;

/** All posts, sorted newest first, or null if the file could not be read. */
export function loadBlogData() {
  if (!blogPromise) {
    blogPromise = fetchJSON('/json/blog.json')
      // Sorted newest first, so "the 4 latest" is just a slice of this order
      .then(data => (data.posts || []).sort((a, b) => new Date(b.date) - new Date(a.date)))
      .catch(err => {
        console.error('Failed to load blog.json:', err);
        return null;
      });
  }
  return blogPromise;
}

/** All projects in file order, or null if the file could not be read. */
export function loadProjectData() {
  if (!projectPromise) {
    projectPromise = fetchJSON('/json/projects.json')
      .then(data => data.projects || [])
      .catch(err => {
        console.error('Failed to load projects.json:', err);
        return null;
      });
  }
  return projectPromise;
}
