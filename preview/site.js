// Mobile menu (hamburger) like the Wix draft.
(function () {
  var menu = document.getElementById("menu"), burger = document.querySelector(".burger");
  if (!menu || !burger) return;
  function set(open) {
    menu.hidden = !open;
    burger.setAttribute("aria-expanded", open ? "true" : "false");
    document.documentElement.style.overflow = open ? "hidden" : "";
  }
  burger.addEventListener("click", function () { set(true); });
  menu.addEventListener("click", function (e) {
    if (e.target.closest("[data-close]") || e.target.closest("nav a")) set(false);
  });
  document.addEventListener("keydown", function (e) { if (e.key === "Escape") set(false); });
})();

// Startbild: wie bei Wix fenstergroß, scrollt mit 0,2-facher Geschwindigkeit (nur Desktop).
(function () {
  var hero = document.querySelector(".hero"), bg = hero && hero.querySelector(".hero-bg");
  var mq = window.matchMedia("(min-width:601px)");
  var tick = false;
  function update() {
    tick = false;
    if (!bg || !mq.matches) return;
    bg.style.transform = "translateY(" + (-0.8 * hero.getBoundingClientRect().top).toFixed(1) + "px)";
  }
  // „Nach oben“-Knopf (Smartphone): erst nach etwa einer Bildschirmhöhe einblenden.
  var top = document.querySelector(".totop");
  function onScroll() {
    if (top) top.classList.toggle("on", window.scrollY > window.innerHeight);
    if (!tick) { tick = true; window.requestAnimationFrame(update); }
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll);
  onScroll();
})();
