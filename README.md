# apleith.github.io

Personal site for Alex P. Leith, PhD. Lives at [apleith.com](https://apleith.com).

Static HTML + CSS + JS, served via GitHub Pages, custom domain via `CNAME`.

## Structure

- `index.html` — main landing page (About, Research, Track Record, Work With Me, Selected Publications, Current Projects)
- `info.html` — compact contact + office hours + social links page (apleith.com/info.html)
- `css/` — `main.css` (landing), `info.css` (info page), `resume.css` / `resume.min.css` (CV-format pages)
- `files/` — CV PDF (`Leith_CV.pdf`) and the .docx source it renders from
- `images/`, `img/` — site imagery
- `theory/` — legacy Codrops grid demo of mass communication theories, linked from teaching materials
- `js/` — small navigation + nav-toggle script
- `comms/` — creative brief documenting the site's design direction
- `vendor/` — third-party CSS/JS dependencies

## Updates

Edit HTML directly, commit + push to `main` — GitHub Pages publishes within ~1 min.

The CV PDF (`files/Leith_CV.pdf`) is rendered from `files/Leith_CV(YYYY-MM-DD).docx` manually; re-render and replace when adding new publications, grants, or appointments.
