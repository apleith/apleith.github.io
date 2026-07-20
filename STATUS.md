---
type: status
status: active
zone: personal
priority: normal
project: PERS-011
related: [PERS-011, ACAD-005]
tldr: "apleith.com IDE/Dracula redesign. Phase 1 (index.html) + Phase 2 (info.html → contact.md) both SHIPPED 2026-05-21. Shared css/main.css drives the IDE chrome (tab bar, file-tree sidebar, gutter+line-numbers, outline pane, purple status bar) across both pages with responsive collapse at 1100px + 768px + 480px. js/main.js handles drawer toggle + scrollspy + status-bar Ln/Col fakery (sectionFiles map covers both pages). Dead resume.css + resume.min.css archived. theory/ Codrops grid deferred to Phase 3. Wellcome Trust copy corrected to Co-PI (AI methods)."
last_modified: 2026-05-21T16:15:00-05:00
last_session: 2026-05-21T16:15:00-05:00
last_session_handoff: meta/handoffs/session/2026-05-21-13-12-PERS-002-switch.md
next_action_oneline: "Phase 3 (deferred): redesign theory/ (Codrops 16-tile grid + overlay) when scheduled — decide wrap-vs-rebuild. Current theory/ is functional and reachable via sidebar."
blockers: "None."
---

# PERS-011 — apleith.com personal site

GitHub Pages site for Dr. Alex Leith's personal/faculty homepage at `apleith.com`. Repo: [`apleith/apleith.github.io`](https://github.com/apleith/apleith.github.io). On-disk: `D:\OneDrive - Southern Illinois University Edwardsville\websites\apleith.github.io\`.

## 2026-07-19 — "Instrument" rebrand (retires IDE/Dracula)

Full identity rebuild to the shared **AURA Lab × SIM DAD LLC** system, derived from the joint
wallpaper (`C:\pythia\brand\wallpapers\aura-simdad-wallpaper.py`). The IDE/Dracula chrome is retired.

### What changed
- **New design system** — dark graph-paper ground (`#101113→#1B1E24`), aperture-ring emblem, the
  colorblind-safe **Okabe-Ito + AURA-brick** 6-color spectrum color-coding the six sections, SIUE red
  (`#E5182D`) as a single institutional accent tick. Type: Archivo (display) · Plus Jakarta Sans (body)
  · Spline Sans Mono (labels) · Newsreader (citations).
- **`css/main.css`** — rewritten (instrument system); old IDE/Dracula sheet archived to
  `css/_archive/main-ide-dracula.css`.
- **`index.html` / `info.html`** — rebuilt on a shared shell: sticky brand bar, right **spectrum rail**
  (scrollspy) that collapses to a top progress bar < 1100px, hero with inline-SVG emblem, section cards.
- **`js/main.js`** — rewritten to IntersectionObserver scrollspy + progress bar; old script archived to
  `js/_archive/main-ide.js`. Drops the fake Ln/Col + tab logic.
- **Self-contained** — fonts self-hosted as WOFF2 in `fonts/` (dropped Google Fonts + cdnjs Font Awesome
  + imgur favicon); icons are inline SVG. Emblem/favicon/OG assets generated from
  `brand/wallpapers` geometry (`images/aperture.svg`, `favicon.svg/png`, `images/og-card.png`).
- **`theory/`** — dead microsite (rebuilt on AURA Lab); `theory/index.html` now redirects to
  `aura-lab-siue.github.io`, old page preserved in `theory/_archive/`.
- **Accessibility** — WCAG 2.1 AA + 2.2: verified contrast (accent-text uses ≥4.5 variants), color never
  the sole cue, `:focus-visible` rings, `scroll-margin-top`, ≥24px targets, reduced-motion + forced-colors +
  prefers-contrast handling.

### Verification
Served locally, checked in Chrome (narrow viewport): hero, all six section-coded sections, stats strip,
scrollspy progress bar tracks section hue, footer; zero console errors. `files/Leith_CV.pdf` untouched.
Desktop rail (≥1100px) verified by markup + CSS media query (side-panel constrained the screenshot width).

## 2026-05-21 PM — Phase 2: info.html → contact.md SHIPPED

### What changed

- **info.html rebuilt** around the same `.ide-root` structure as index.html: tab bar (with `contact.md` active), shared file-tree sidebar, three sections (`contact.md`, `office-hours.md`, `links.md`), outline pane with a "Quick Nav" block, purple status bar.
- **Content reorganized into three sections**: Profile (name + role), Office Hours (Dunham Hall 1017 + In-Person Mon/Wed + Remote Tue/Thu rendered as two side-by-side `.ide-block` cards), Reach Me (six contact buttons across two rows + a footnote pointing to `/#work-with-me` for substantive engagements).
- **Cross-page navigation**: tab bar now uses root-relative anchors so `hero.md` and `publications.bib` tabs work from both pages. `contact.md` added to the sidebar file tree on index.html. Both pages share css/main.css + js/main.js.
- **Dead CSS archived**: legacy `css/info.css` (Bauhaus, 86-line equivalent) and `css/resume.css` + `css/resume.min.css` (leftover Bootstrap-Resume v4 template, not referenced by any HTML) all moved to `css/_archive/` per never-delete.
- **js/main.js sectionFiles map extended** to cover info.html sections (`profile → contact.md`, `office-hours → office-hours.md`, `links → links.md`) so the status bar Ln/Col indicator reads correctly on both pages.

### Verification

Re-ran `python -m http.server 8765`, opened Chrome via DevTools MCP:

- **Desktop (1400×900):** info.html renders profile + side-by-side hours cards + button rows. Sidebar shows `contact.md` highlighted. Outline pane lists Profile (active) / Office Hours / Reach Me. Status bar reads `Ln 1, Col 1 · contact.md`. Zero console errors.
- **Mobile (390×844):** sidebar collapses to drawer; office hours cards stack vertically; buttons wrap; tab bar scrolls horizontally. Zero console errors.
- **Cross-page nav verified**: `hero.md` tab on info.html points to `/`, navigation between pages preserves the IDE chrome.
- **index.html sidebar update confirmed**: `contact.md` now appears between `projects.yaml` and `files/`.

### theory/ deferred to Phase 3

The `theory/index.html` page is a Codrops-derived grid of 16 communication-theory tiles with an animated overlay (TweenMax/imagesLoaded). Forcing it into the IDE chrome creates visual conflict (image-backed tiles vs Dracula dark surface). Two paths for Phase 3:

1. **Wrap** — keep the existing Codrops tile + overlay interaction, host it inside `.ide-root` chrome. Pro: preserves the visual richness. Con: aesthetic mismatch between glossy tiles and IDE flat-Dracula.
2. **Rebuild** — drop the Codrops grid, render the 16 theories as a code-comment catalog (`/// agenda-setting-theory`, `/// cognitive-dissonance`, etc.) with definitions below each as documentation. Pro: aesthetic coherence. Con: loses the interaction design.

Decision deferred until owner schedules Phase 3. Current `theory/` is functional and reachable from the sidebar `theory/ → index.html` entry; no regression to ship.

### Files touched

- `info.html` — full rewrite (86 → ~13.7 KB), IDE chrome
- `index.html` — tab bar updated (`research.md` → `contact.md`), sidebar added `contact.md` entry
- `js/main.js` — sectionFiles map extended for info.html
- `css/_archive/info-bauhaus-pre-dracula.css` — preserved old info.css
- `css/_archive/resume-bootstrap-legacy.css` + `resume-bootstrap-legacy.min.css` — preserved dead Bootstrap-Resume CSS
- `css/info.css` + `css/resume.css` + `css/resume.min.css` — removed from `css/` root after archive

## 2026-05-21 PM — Phase 1: home page IDE/Dracula redesign SHIPPED

### Why IDE (vs Terminal vs Minimal)

Owner reviewed the variant pitch at `_notes/2026-05-21-dracula-variants.html` (3 mockups behind a tympanus-style switcher) and chose Variant 2 (IDE-chrome). The IDE metaphor positions the site as "you're browsing my source" — file-tree navigation, tab bar for active document, gutter + line numbers in content, outline pane as TOC, status bar with `Ln X, Col Y · filename`. Suits a CS-leaning behavioral researcher.

### Files touched

| File | Change |
|---|---|
| `css/main.css` | Replaced 911-line Bauhaus stylesheet with ~17 KB IDE/Dracula production CSS (3-column grid, file tree, tab bar, gutter, outline, status bar, full responsive breakpoints at 1100px + 768px + 480px). |
| `css/_archive/main-bauhaus-pre-dracula.css` | NEW — preserved prior Bauhaus stylesheet verbatim per never-delete rule. |
| `index.html` | Rebuilt around `.ide-root` grid: tab bar, sidebar with markdown-icon file tree (`hero.md`, `research.md`, `track-record.md`, `engage.md`, `publications.bib`, `projects.yaml`) + External section (AURA Lab, SIM DAD LLC, github, X), main pane with `## `-prefixed headings and gutter + line numbers, outline pane (01–06), purple status bar (`main · UTF-8 · Markdown · Ln X, Col Y · filename · JetBrains Mono · Dracula`), footer with brand + social icons. |
| `js/main.js` | Replaced Bauhaus nav-toggle with: (1) drawer toggle for mobile sidebar, (2) IntersectionObserver scrollspy syncing sidebar + outline + tab bar + status bar, (3) status-bar `Ln X, Col Y · filename.ext` fakery tied to the section in view, (4) Cmd/Ctrl+B keyboard shortcut on mobile to toggle the drawer. |
| `js/_archive/main-bauhaus-pre-dracula.js` | NEW — preserved prior JS verbatim. |

### Bugs caught + fixed during verification

- **Mobile blank-content bug.** On `≤768px`, `.ide-sidebar` becomes `position: fixed` (drawer), which removed it from grid auto-placement. The unanchored `.ide-main` then drifted up into column 1 (which was `0px` on mobile), rendering invisibly. Fix: added explicit `grid-column: 1/2/3` declarations to sidebar/main/outline so placement is locked regardless of positioning.
- **Status-bar / scrollspy desync.** The status bar's `updateStatus()` read the active outline link, but the IntersectionObserver was async, so a scroll-driven update could fire before the outline was updated. Fix: call `updateStatus()` from inside the IntersectionObserver callback so the status bar updates in lockstep with the outline.

### Copy correction (per 2026-05-21 owner clarification)

- Wellcome Trust card now reads `WELLCOME TRUST · PENDING · CO-PI`, `Co-PI (AI methods)`, `University of Zambia-led · 2026-2030`. Prior copy ("Co-Investigator — SIUE Lead") was wrong — owner is Co-PI on the AI methods strand and is NOT the SIUE lead. Memory at [reference_wellcome_role.md](file:///C:/Users/alexl/.claude/projects/c--life-os/memory/reference_wellcome_role.md).

### Verification

Started `python -m http.server 8765` at the repo root, opened Chrome via DevTools MCP:

- **Desktop (1400×900):** tab bar, file-tree sidebar, hero with photo + Dracula-purple border, pink name with em styled, yellow headline, purple "Work with me" CTA, outline pane (01 Hero active), purple status bar. Zero console errors.
- **Mobile (390×844):** sidebar collapses to drawer behind a "Files" hamburger; hero renders single-column; tab bar scrolls; status bar simplified. Zero console errors.
- **Wellcome card** rendered correctly with corrected role.
- **Scrollspy + status bar** sync: scrolling to `#current-projects` updates sidebar highlight (`projects.yaml`), outline (`06 Projects`), and status bar (`Ln 1, Col 48 · projects.yaml`) together.

### Backlog → Phase 2

- Rebuild `info.html` with the same `.ide-root` structure using shared `css/main.css`. Archive prior `css/info.css` to `css/_archive/`.
- Rebuild `theory/index.html` (academic content microsite) with the IDE chrome. Decide whether `theory/` gets its own scoped `tabbar.json`-style navigation or just adopts the main site's sidebar.
- Resume/CV page: the PDF at `files/Leith_CV.pdf` stays untouched (academic-facing). Any HTML resume views should adopt the IDE chrome.
- Smoke-test the rendered CV link on Dracula background after Phase 2.
- Consider extracting the `.ide-root` HTML chrome to a server-side include or build step if a third page joins. For now: copy-and-paste between pages is fine.

## 2026-05-21 AM — Project slot created

### Context

Prior personal-site work rode along on ACAD-005 sessions opportunistically (most recently the 2026-05-17 CV PDF `droptitle` fix logged in [`academic/zone-log.md`](file:///C:/life-os/academic/zone-log.md)). Owner is now starting a substantive redesign — JetBrains Mono everywhere, Dracula color palette — which warrants its own project ID, STATUS, and handoff stream.

### Current state of the site

Static HTML (no build step). Hand-rolled CSS. No Jekyll/Astro/Hugo. Bootstrap + Font Awesome in `vendor/`.

| File | Role |
|---|---|
| `index.html` | Home / landing |
| `info.html` | Bio / about |
| `theory/` | Theory section (academic content) |
| `comms/` | Comms section |
| `archive/` | Archive section |
| `files/Leith_CV.pdf` | Live CV — must remain pristine through any redesign |
| `css/main.css` | Primary stylesheet — **currently Bauhaus** (Jost, cream/black/red/yellow/blue, thick 3px black borders) |
| `css/info.css` | Bio-page styles |
| `css/resume.css` + `resume.min.css` | Resume-page styles |
| `js/` | Site JS |
| `vendor/` | Bootstrap + Font Awesome |
| `CNAME` | `apleith.com` |

### Redesign target

- **Type**: JetBrains Mono (replaces Jost geometric sans across the entire site)
- **Theme**: Dracula color palette
  - Background `#282a36` · Current line `#44475a` · Foreground `#f8f8f2` · Comment `#6272a4`
  - Cyan `#8be9fd` · Green `#50fa7b` · Orange `#ffb86c` · Pink `#ff79c6` · Purple `#bd93f9` · Red `#ff5555` · Yellow `#f1fa8c`
- **Open questions** (surface in the variant pitch):
  - Full IDE chrome aesthetic vs terminal-prose vs minimal-typographic interpretation
  - Hard-dark commitment vs dual-mode (Dracula is hard dark by spec)
  - Resume page treatment — PDF stays unchanged but `resume.html`/CV section may want its own variant
  - Preserve Bauhaus border-system Dracula-recolored vs replace with code-editor patterns (line numbers, gutters, syntax-highlight accents)

### Constraints

- **CV PDF (`files/Leith_CV.pdf`) is academic-facing** — must remain readable/printable through any theme change. The PDF itself isn't redesigned here, but linking treatment around it must not bury the link.
- **GitHub Pages deploy** — no build step. CSS changes go live on push to `main`. Always test locally before pushing.
- **Owner is anti-social** per [feedback_owner_social_posture.md](file:///C:/Users/alexl/.claude/projects/c--life-os/memory/feedback_owner_social_posture.md) — no "share" widgets, no embedded social-feed clutter.
- **Never delete files** per [feedback_never_delete.md](file:///C:/Users/alexl/.claude/projects/c--life-os/memory/feedback_never_delete.md) — archive prior Bauhaus CSS to `css/_archive/main-bauhaus-pre-dracula.css` before overwriting.

### Backlog

- Variant pitch (per [feedback_design_mockup_navigation.md](file:///C:/Users/alexl/.claude/projects/c--life-os/memory/feedback_design_mockup_navigation.md) standing practice): 2-3 HTML mockup variants in a tympanus-style fixed switcher, hosted locally for owner review before any production CSS edits.
- After variant selection: archive `main.css` → `_archive/`, replace with the chosen Dracula direction, replicate across `info.css` + `resume.css`.
- Smoke-test the rendered CV link on Dracula background (contrast + icon legibility).
- Re-check `info.html` and `theory/` content readability with JetBrains Mono — mono fonts read slower in long-form prose; may need a measured `line-height` and `max-width: 65ch` to compensate.
