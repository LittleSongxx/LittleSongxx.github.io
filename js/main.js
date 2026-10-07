(function () {
  "use strict";

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- 入场动画（Hero 与卡片错峰） ---------- */
  document.querySelectorAll(".hero .reveal").forEach(function (el, i) {
    el.style.transitionDelay = i * 90 + "ms";
  });
  document.querySelectorAll(".projects .card").forEach(function (el, i) {
    el.style.transitionDelay = (i % 2) * 100 + "ms";
  });

  var revealObserver = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          var el = entry.target;
          el.classList.add("is-visible");
          revealObserver.unobserve(el);
          // 展示完成后清掉延迟，避免拖慢 hover 等后续过渡
          if (el.style.transitionDelay) {
            setTimeout(function () { el.style.transitionDelay = ""; }, 900);
          }
        }
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
  );
  document.querySelectorAll(".reveal").forEach(function (el) {
    revealObserver.observe(el);
  });

  /* ---------- 滚动进度条 & 返回顶部 ---------- */
  var progress = document.getElementById("progress");
  var topBtn = document.getElementById("topBtn");

  function onScroll() {
    var doc = document.documentElement;
    var max = doc.scrollHeight - doc.clientHeight;
    progress.style.width = (max > 0 ? (doc.scrollTop / max) * 100 : 0) + "%";
    topBtn.classList.toggle("is-show", doc.scrollTop > 600);
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  topBtn.addEventListener("click", function () {
    window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" });
  });

  /* ---------- 打字机 ---------- */
  var phrases = [
    "AI Agent 工程实践",
    "Java / Python 后端",
    "React / Vue 前端",
    "5900+ 测试用例的信徒"
  ];
  var typedEl = document.getElementById("typed");

  function typeLoop() {
    var phraseIndex = 0;

    function typePhrase() {
      var text = phrases[phraseIndex];
      var ci = 0;
      (function stepIn() {
        typedEl.textContent = text.slice(0, ++ci);
        if (ci < text.length) {
          setTimeout(stepIn, 70);
        } else {
          setTimeout(erase, 1900);
        }
      })();
    }

    function erase() {
      var text = phrases[phraseIndex];
      var cj = text.length;
      (function stepOut() {
        typedEl.textContent = text.slice(0, --cj);
        if (cj > 0) {
          setTimeout(stepOut, 28);
        } else {
          phraseIndex = (phraseIndex + 1) % phrases.length;
          setTimeout(typePhrase, 380);
        }
      })();
    }

    typePhrase();
  }
  if (typedEl) {
    if (reduceMotion) {
      typedEl.textContent = phrases[0];
    } else {
      typeLoop();
    }
  }

  /* ---------- 统计数字滚动 ---------- */
  function formatCount(value, padWidth, suffix) {
    var s = String(value);
    while (s.length < padWidth) s = "0" + s;
    return s + suffix;
  }

  function animateCount(el) {
    var target = parseInt(el.getAttribute("data-count"), 10);
    var padWidth = parseInt(el.getAttribute("data-pad") || "0", 10);
    var suffix = el.getAttribute("data-suffix") || "";
    if (reduceMotion) {
      el.textContent = formatCount(target, padWidth, suffix);
      return;
    }
    var start = null;
    var duration = 1100;
    function frame(ts) {
      if (start === null) start = ts;
      var p = Math.min((ts - start) / duration, 1);
      var eased = 1 - Math.pow(1 - p, 3);
      el.textContent = formatCount(Math.round(target * eased), padWidth, suffix);
      if (p < 1) requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  }

  var statsBox = document.querySelector(".stats");
  if (statsBox) {
    var counted = false;
    var statsObserver = new IntersectionObserver(
      function (entries) {
        if (entries[0].isIntersecting && !counted) {
          counted = true;
          statsBox.querySelectorAll("[data-count]").forEach(animateCount);
          statsObserver.disconnect();
        }
      },
      { threshold: 0.35 }
    );
    statsObserver.observe(statsBox);
  }

  /* ---------- 项目卡片 3D 倾斜（仅精确指针设备） ---------- */
  if (window.matchMedia("(pointer: fine)").matches && !reduceMotion) {
    document.querySelectorAll(".card").forEach(function (card) {
      card.addEventListener("mousemove", function (e) {
        var r = card.getBoundingClientRect();
        var rx = ((e.clientY - r.top) / r.height - 0.5) * -5;
        var ry = ((e.clientX - r.left) / r.width - 0.5) * 6;
        card.style.transform =
          "perspective(900px) rotateX(" + rx.toFixed(2) + "deg) rotateY(" +
          ry.toFixed(2) + "deg) translateY(-4px)";
      });
      card.addEventListener("mouseleave", function () {
        card.style.transform = "";
      });
    });
  }

  /* ---------- 移动端菜单 ---------- */
  var sidebar = document.getElementById("sidebar");
  var menuBtn = document.getElementById("menuBtn");

  function closeMenu() {
    sidebar.classList.remove("is-open");
    menuBtn.classList.remove("is-open");
    menuBtn.setAttribute("aria-expanded", "false");
  }

  menuBtn.addEventListener("click", function () {
    var open = sidebar.classList.toggle("is-open");
    menuBtn.classList.toggle("is-open", open);
    menuBtn.setAttribute("aria-expanded", String(open));
  });

  document.querySelectorAll(".nav__link").forEach(function (link) {
    link.addEventListener("click", closeMenu);
  });

  document.addEventListener("click", function (e) {
    if (
      sidebar.classList.contains("is-open") &&
      !sidebar.contains(e.target) &&
      !menuBtn.contains(e.target)
    ) {
      closeMenu();
    }
  });

  /* ---------- 当前分区高亮 ---------- */
  var sections = document.querySelectorAll("section[id]");
  var navLinks = document.querySelectorAll(".nav__link");

  var sectionObserver = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          var id = entry.target.getAttribute("id");
          navLinks.forEach(function (link) {
            link.classList.toggle(
              "is-active",
              link.getAttribute("href") === "#" + id
            );
          });
        }
      });
    },
    { rootMargin: "-45% 0px -50% 0px" }
  );
  sections.forEach(function (s) {
    sectionObserver.observe(s);
  });

  /* ---------- 页脚年份 ---------- */
  document.getElementById("year").textContent = String(new Date().getFullYear());
})();
