/* apleith.com — "Instrument" JS
   Section navigator (right rail) + mobile scroll-progress bar.
   Purely presentational: the page is fully usable and navigable without JS.
   Motion is left to CSS (scroll-behavior), which honours prefers-reduced-motion. */
(function () {
  "use strict";

  var links = Array.prototype.slice.call(document.querySelectorAll(".rail a"));
  var progressBar = document.querySelector(".progress > i");
  var sections = links.map(function (a) {
    return document.querySelector(a.getAttribute("href"));
  });
  if (!links.length) return;

  var active = 0;

  function setActive(i) {
    if (i < 0 || i >= links.length) return;
    active = i;
    links.forEach(function (l, idx) {
      if (idx === i) l.setAttribute("aria-current", "true");
      else l.removeAttribute("aria-current");
    });
    if (progressBar) {
      // inline --hue on each rail link is e.g. "var(--s-teal)"; resolves against :root
      var hue = links[i].style.getPropertyValue("--hue") || "var(--s-blue)";
      progressBar.style.background = hue;
    }
  }

  // ---- scrollspy: activate the section crossing the viewport's middle band ----
  if ("IntersectionObserver" in window) {
    var obs = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        var idx = sections.indexOf(e.target);
        if (idx !== -1) setActive(idx);
      });
    }, { rootMargin: "-45% 0px -50% 0px", threshold: 0 });
    sections.forEach(function (s) { if (s) obs.observe(s); });
  }

  // ---- progress bar width tracks scroll position -----------------------------
  function onScroll() {
    if (!progressBar) return;
    var st = window.scrollY || document.documentElement.scrollTop || 0;
    var h = document.documentElement.scrollHeight - window.innerHeight;
    progressBar.style.width = (h > 0 ? (st / h) * 100 : 0) + "%";
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll, { passive: true });
  onScroll();

  // ---- clicking a rail item activates it immediately -------------------------
  links.forEach(function (l, idx) {
    l.addEventListener("click", function () { setActive(idx); });
  });

  setActive(0);
})();
