(function () {
  "use strict";

  var root = document.documentElement;
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var themeKey = "littlesongxx-theme";
  var storedTheme = null;

  try { storedTheme = localStorage.getItem(themeKey); } catch (error) {}

  /* ---------- Theme ---------- */
  var themeToggle = document.getElementById("themeToggle");
  var themeMeta = document.querySelector('meta[name="theme-color"]');

  function currentTheme() {
    return root.dataset.theme === "dark" ? "dark" : "light";
  }

  function applyTheme(theme, persist) {
    root.dataset.theme = theme;
    if (themeMeta) {
      themeMeta.setAttribute("content", theme === "dark" ? "#0b1013" : "#f6f4ee");
    }
    if (themeToggle) {
      themeToggle.setAttribute("aria-label", theme === "dark" ? "切换到浅色主题" : "切换到深色主题");
      themeToggle.setAttribute("title", theme === "dark" ? "切换到浅色主题" : "切换到深色主题");
    }
    if (persist) {
      storedTheme = theme;
      try { localStorage.setItem(themeKey, theme); } catch (error) {}
    }
  }

  applyTheme(currentTheme(), false);

  if (themeToggle) {
    themeToggle.addEventListener("click", function () {
      applyTheme(currentTheme() === "dark" ? "light" : "dark", true);
    });
  }

  var colorMedia = window.matchMedia("(prefers-color-scheme: dark)");
  if (colorMedia.addEventListener) {
    colorMedia.addEventListener("change", function (event) {
      if (!storedTheme) {
        applyTheme(event.matches ? "dark" : "light", false);
      }
    });
  }

  /* ---------- Mobile menu ---------- */
  var topbar = document.getElementById("topbar");
  var menuBtn = document.getElementById("menuBtn");
  var nav = document.getElementById("nav");

  function closeMenu() {
    if (!topbar) return;
    topbar.classList.remove("is-open");
    if (menuBtn) {
      menuBtn.setAttribute("aria-expanded", "false");
      menuBtn.setAttribute("aria-label", "打开菜单");
    }
  }

  if (menuBtn && topbar) {
    menuBtn.addEventListener("click", function () {
      var open = !topbar.classList.contains("is-open");
      topbar.classList.toggle("is-open", open);
      menuBtn.setAttribute("aria-expanded", open ? "true" : "false");
      menuBtn.setAttribute("aria-label", open ? "关闭菜单" : "打开菜单");
    });

    if (nav) {
      nav.querySelectorAll("a").forEach(function (link) {
        link.addEventListener("click", closeMenu);
      });
    }

    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape") closeMenu();
    });

    document.addEventListener("click", function (event) {
      if (!topbar.classList.contains("is-open")) return;
      if (!topbar.contains(event.target)) closeMenu();
    });
  }

  /* ---------- Progress + back to top ---------- */
  var progress = document.getElementById("progress");
  var topBtn = document.getElementById("topBtn");

  function onScroll() {
    var doc = document.documentElement;
    var max = doc.scrollHeight - doc.clientHeight;
    if (progress) {
      progress.style.width = (max > 0 ? (doc.scrollTop / max) * 100 : 0) + "%";
    }
    if (topBtn) {
      topBtn.classList.toggle("is-show", doc.scrollTop > 600);
    }
  }

  if (topBtn) {
    topBtn.addEventListener("click", function () {
      window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" });
    });
  }

  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---------- Active navigation ---------- */
  var navLinks = nav ? Array.prototype.slice.call(nav.querySelectorAll('a[href^="#"]')) : [];
  var sectionIds = ["home", "about", "projects", "more", "contact"];

  if ("IntersectionObserver" in window) {
    var sectionObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          navLinks.forEach(function (link) {
            link.classList.toggle("is-active", link.getAttribute("href") === "#" + entry.target.id);
          });
        });
      },
      { rootMargin: "-42% 0px -52% 0px", threshold: 0 }
    );
    sectionIds.forEach(function (id) {
      var section = document.getElementById(id);
      if (section) sectionObserver.observe(section);
    });
  }

  /* ---------- Reveal ---------- */
  var reveals = Array.prototype.slice.call(document.querySelectorAll(".reveal"));
  if ("IntersectionObserver" in window && !reduceMotion) {
    var revealObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-visible");
          revealObserver.unobserve(entry.target);
        });
      },
      { threshold: 0.08, rootMargin: "0px 0px -40px 0px" }
    );
    root.classList.add("reveal-ready");
    reveals.forEach(function (el) { revealObserver.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add("is-visible"); });
  }

  /* ---------- Stats counters ---------- */
  function formatCount(value, pad) {
    var text = String(value);
    while (text.length < pad) text = "0" + text;
    return text;
  }

  function animateCounter(el) {
    var target = parseInt(el.getAttribute("data-count"), 10);
    var pad = parseInt(el.getAttribute("data-pad") || "0", 10);
    if (isNaN(target)) return;
    if (reduceMotion) {
      el.textContent = formatCount(target, pad);
      return;
    }
    var start = null;
    var duration = 900;
    function frame(timestamp) {
      if (start === null) start = timestamp;
      var progress = Math.min((timestamp - start) / duration, 1);
      var eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = formatCount(Math.round(target * eased), pad);
      if (progress < 1) requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  }

  var counters = Array.prototype.slice.call(document.querySelectorAll("[data-count]"));
  if (counters.length) {
    if ("IntersectionObserver" in window && !reduceMotion) {
      var counterObserver = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            if (!entry.isIntersecting) return;
            animateCounter(entry.target);
            counterObserver.unobserve(entry.target);
          });
        },
        { threshold: 0.45 }
      );
      counters.forEach(function (el) { counterObserver.observe(el); });
    } else {
      counters.forEach(animateCounter);
    }
  }

  /* ---------- Project filter ---------- */
  var filterButtons = Array.prototype.slice.call(document.querySelectorAll(".filter"));
  var projectCards = Array.prototype.slice.call(document.querySelectorAll("#projectGrid .project"));
  var projectCount = document.getElementById("projectCount");

  function updateCount(filter) {
    var visible = projectCards.filter(function (card) { return !card.hidden; }).length;
    if (!projectCount) return;
    var label = filter === "ai" ? " 个 AI 项目" : filter === "backend" ? " 个后端项目" : " 个项目";
    projectCount.textContent = visible + label;
  }

  filterButtons.forEach(function (button) {
    button.addEventListener("click", function () {
      var filter = button.getAttribute("data-filter") || "all";
      filterButtons.forEach(function (item) {
        var active = item === button;
        item.classList.toggle("is-active", active);
        item.setAttribute("aria-pressed", active ? "true" : "false");
      });
      projectCards.forEach(function (card) {
        var categories = (card.getAttribute("data-cat") || "").split(/\s+/);
        var show = filter === "all" || categories.indexOf(filter) !== -1;
        card.hidden = !show;
        if (show && root.classList.contains("reveal-ready")) {
          card.classList.add("is-visible");
        }
      });
      updateCount(filter);
    });
  });

  /* ---------- Misc ---------- */
  var year = document.getElementById("year");
  if (year) year.textContent = String(new Date().getFullYear());
})();
