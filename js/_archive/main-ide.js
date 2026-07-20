/* apleith.com — IDE / Dracula JS
   Replaces the Bauhaus nav-toggle script (preserved in
   js/_archive/main-bauhaus-pre-dracula.js). PERS-011, 2026-05-21.

   Responsibilities:
     1. Mobile drawer toggle for the file-tree sidebar (≤768px viewports).
     2. Scrollspy: highlight the active section in sidebar + outline pane
        as the user scrolls.
     3. Status-bar fakery: update "Ln X, Col Y · filename.ext" to track
        the section currently in view.
*/
(function () {
  'use strict';

  // ── 1. Mobile drawer toggle ─────────────────────────────────────────
  var body = document.body;
  var drawerToggle = document.getElementById('drawerToggle');
  var sidebar = document.getElementById('sidebar');

  function closeDrawer() {
    body.classList.remove('drawer-open');
    if (drawerToggle) drawerToggle.setAttribute('aria-expanded', 'false');
  }
  function toggleDrawer() {
    var open = body.classList.toggle('drawer-open');
    if (drawerToggle) drawerToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
  }
  if (drawerToggle) {
    drawerToggle.addEventListener('click', function (e) {
      e.preventDefault();
      toggleDrawer();
    });
  }
  if (sidebar) {
    sidebar.addEventListener('click', function (e) {
      if (e.target.closest('a')) closeDrawer();
    });
  }
  document.addEventListener('click', function (e) {
    if (!body.classList.contains('drawer-open')) return;
    if (sidebar && (sidebar.contains(e.target) || (drawerToggle && drawerToggle.contains(e.target)))) return;
    closeDrawer();
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && body.classList.contains('drawer-open')) closeDrawer();
  });

  // ── 2. Scrollspy: sidebar + outline pane + tab bar ──────────────────
  var sections = document.querySelectorAll('.ide-section[id]');
  var sidebarLinks = document.querySelectorAll('.ide-tree a[data-anchor]');
  var outlineLinks = document.querySelectorAll('#outline-list a[data-anchor]');
  var tabLinks = document.querySelectorAll('.ide-tabs .ide-tab[href^="#"]');

  function setActive(anchor) {
    sidebarLinks.forEach(function (a) {
      a.classList.toggle('active', a.dataset.anchor === anchor);
    });
    outlineLinks.forEach(function (a) {
      a.classList.toggle('active', a.dataset.anchor === anchor);
    });
    tabLinks.forEach(function (a) {
      var href = a.getAttribute('href') || '';
      a.classList.toggle('active', href === '#' + anchor);
    });
  }

  if (sections.length) {
    var observer = new IntersectionObserver(function (entries) {
      var best = null;
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          if (!best || entry.boundingClientRect.top < best.boundingClientRect.top) {
            best = entry;
          }
        }
      });
      if (best && best.target.id) {
        setActive(best.target.id);
        updateStatus();   // keep status bar in sync with the active section
      }
    }, { rootMargin: '-20% 0px -65% 0px' });
    sections.forEach(function (s) { observer.observe(s); });
  }

  // ── 3. Status bar Ln/Col + filename tracker ─────────────────────────
  var posEl = document.getElementById('status-position');
  var main = document.querySelector('.ide-main');
  var sectionFiles = {
    // index.html
    'about':            'hero.md',
    'work-on':          'research.md',
    'track-record':     'track-record.md',
    'work-with-me':     'engage.md',
    'publications':     'publications.bib',
    'current-projects': 'projects.yaml',
    // info.html
    'profile':          'contact.md',
    'office-hours':     'office-hours.md',
    'links':            'links.md'
  };

  function updateStatus() {
    if (!posEl || !main) return;
    var activeAnchorEl = document.querySelector('#outline-list a.active');
    var anchor = (activeAnchorEl && activeAnchorEl.dataset.anchor) || 'about';
    var section = document.getElementById(anchor);
    if (!section) return;
    var rect = section.getBoundingClientRect();
    var height = Math.max(section.offsetHeight, 1);
    var into = Math.max(0, -rect.top);
    var pct = Math.min(1, into / height);
    var ln = Math.max(1, Math.floor(pct * 120) + 1);
    var col = Math.floor((main.scrollTop % 80) + 1);
    posEl.textContent = 'Ln ' + ln + ', Col ' + col + ' · ' + (sectionFiles[anchor] || 'untitled');
  }
  if (main) {
    var rafQueued = false;
    main.addEventListener('scroll', function () {
      if (rafQueued) return;
      rafQueued = true;
      requestAnimationFrame(function () { updateStatus(); rafQueued = false; });
    }, { passive: true });
    updateStatus();
  }

  // ── 4. Keyboard shortcut: Ctrl/Cmd+B toggles sidebar on mobile ──────
  document.addEventListener('keydown', function (e) {
    if ((e.ctrlKey || e.metaKey) && (e.key === 'b' || e.key === 'B')) {
      if (window.matchMedia('(max-width: 768px)').matches) {
        e.preventDefault();
        toggleDrawer();
      }
    }
  });
})();
