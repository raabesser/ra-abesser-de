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
