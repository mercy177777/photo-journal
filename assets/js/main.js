(function () {
  "use strict";

  var SITE = window.SITE || {};
  var TRAVEL = window.TRAVEL || [];
  var COCKTAILS = window.COCKTAILS || [];

  var $ = function (s, r) { return (r || document).querySelector(s); };
  var esc = function (s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  };
  var pad = function (n) { return (n < 10 ? "0" : "") + n; };

  /* ---------- site text ---------- */
  if (SITE.name) {
    $("#brand").innerHTML = esc(SITE.name) + "<span>·</span><em>Journal</em>";
    $("#footName").textContent = SITE.name;
  }
  $("#introText").textContent = SITE.intro || "";
  $("#aboutText").textContent = SITE.about || "";
  $("#links").innerHTML = (SITE.links || [])
    .map(function (l) {
      if (l.copy) {
        return '<a href="#" data-copy="' + esc(l.copy) + '" title="Click to copy">' + esc(l.label) + "</a>";
      }
      var ext = /^https?:/.test(l.url) ? ' target="_blank" rel="noopener"' : "";
      return '<a href="' + esc(l.url) + '"' + ext + ">" + esc(l.label) + "</a>";
    })
    .join("");
  $("#links").addEventListener("click", function (e) {
    var a = e.target.closest("[data-copy]");
    if (!a) return;
    e.preventDefault();
    var label = a.textContent;
    navigator.clipboard.writeText(a.dataset.copy).then(function () {
      a.textContent = "Copied!";
      setTimeout(function () { a.textContent = label; }, 1500);
    });
  });
  $("#year").textContent = new Date().getFullYear();

  /* ---------- image fade-in ---------- */
  function wireImg(img) {
    if (img.complete && img.naturalWidth) img.classList.add("is-loaded");
    else img.addEventListener("load", function () { img.classList.add("is-loaded"); });
  }

  /* ---------- travel grid ---------- */
  var travelGrid = $("#travelGrid");
  travelGrid.innerHTML = TRAVEL.map(function (p, i) {
    return (
      '<figure class="reveal" data-i="' + i + '" data-region="' + esc(p.region || "") + '" tabindex="0">' +
        '<div class="frame">' +
          '<img src="' + esc(p.src) + '" alt="' + esc(p.place + (p.country ? ", " + p.country : "")) + '" loading="lazy" decoding="async" />' +
          (p.note ? '<p class="note">' + esc(p.note) + "</p>" : "") +
        "</div>" +
        "<figcaption>" +
          '<span class="title"><i>' + pad(i + 1) + "</i>" + esc(p.place) +
            (p.placeZh ? "<small>" + esc(p.placeZh) + "</small>" : "") + "</span>" +
          '<span class="meta">' + esc([p.country, p.year].filter(Boolean).join(" · ")) + "</span>" +
        "</figcaption>" +
      "</figure>"
    );
  }).join("");

  /* ---------- region filters ---------- */
  var regions = [];
  TRAVEL.forEach(function (p) { if (p.region && regions.indexOf(p.region) < 0) regions.push(p.region); });
  var filtersEl = $("#filters");
  var activeRegion = "All";
  if (regions.length > 1) {
    filtersEl.innerHTML = ["All"].concat(regions).map(function (r) {
      var n = r === "All" ? TRAVEL.length : TRAVEL.filter(function (p) { return p.region === r; }).length;
      return '<button role="tab" data-r="' + esc(r) + '" aria-selected="' + (r === "All") + '">' +
        esc(r === "All" ? "All" : r) + "<sup>" + n + "</sup></button>";
    }).join("");
    filtersEl.addEventListener("click", function (e) {
      var b = e.target.closest("button");
      if (!b) return;
      activeRegion = b.getAttribute("data-r");
      filtersEl.querySelectorAll("button").forEach(function (x) {
        x.setAttribute("aria-selected", String(x === b));
      });
      travelGrid.querySelectorAll("figure").forEach(function (f) {
        var show = activeRegion === "All" || f.getAttribute("data-region") === activeRegion;
        f.classList.toggle("is-hidden", !show);
        if (show) f.classList.add("is-in");
      });
    });
  } else {
    filtersEl.remove();
  }

  /* ---------- cocktail menu ---------- */
  var cocktailGrid = $("#cocktailGrid");
  cocktailGrid.innerHTML = COCKTAILS.map(function (c, i) {
    return (
      '<article class="card reveal" data-i="' + i + '" tabindex="0">' +
        '<div class="frame">' +
          '<span class="card__no">No. ' + pad(i + 1) + "</span>" +
          '<img src="' + esc(c.src) + '" alt="' + esc(c.name) + '" loading="lazy" decoding="async" />' +
        "</div>" +
        '<div class="card__body">' +
          '<div class="card__row"><span class="card__name">' + esc(c.name) + '</span><span class="card__leader"></span>' +
            (c.nameZh ? '<span class="card__zh">' + esc(c.nameZh) + "</span>" : "") + "</div>" +
          (c.ingredients && c.ingredients.length
            ? '<p class="card__ingredients">' + c.ingredients.map(function (x) { return "<span>" + esc(x) + "</span>"; }).join("") + "</p>"
            : "") +
          (c.bar || c.city
            ? '<p class="card__where">' + esc(c.bar || "") + (c.bar && c.city ? " <em>—</em> " : "") + "<em>" + esc(c.city || "") + "</em></p>"
            : "") +
          (c.note ? '<p class="card__note">' + esc(c.note) + "</p>" : "") +
        "</div>" +
      "</article>"
    );
  }).join("");

  document.querySelectorAll(".frame img").forEach(wireImg);

  /* ---------- reveal on scroll ---------- */
  var reveals = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) {
          en.target.classList.add("is-in");
          io.unobserve(en.target);
        }
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.08 });
    reveals.forEach(function (el, i) {
      // gentle stagger inside grids
      if (el.parentElement && (el.parentElement.id === "travelGrid" || el.parentElement.id === "cocktailGrid")) {
        el.style.transitionDelay = (i % 3) * 0.08 + "s";
      }
      io.observe(el);
    });
  } else {
    reveals.forEach(function (el) { el.classList.add("is-in"); });
  }

  /* ---------- nav state ---------- */
  var nav = $("#nav");
  var links = Array.prototype.slice.call(nav.querySelectorAll("nav a"));
  var sections = links.map(function (a) { return $(a.getAttribute("href")); });
  function onScroll() {
    nav.classList.toggle("is-scrolled", window.scrollY > 40);
    var y = window.scrollY + window.innerHeight * 0.35;
    var current = -1;
    sections.forEach(function (s, i) { if (s && s.offsetTop <= y) current = i; });
    links.forEach(function (a, i) { a.classList.toggle("is-active", i === current); });
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---------- lightbox ---------- */
  var lb = $("#lightbox"), lbImg = $("#lbImg");
  var set = [], idx = 0, lastFocus = null;

  function travelItems() {
    return TRAVEL.map(function (p, i) {
      return {
        i: i, src: p.src,
        title: p.place + (p.placeZh ? "  ·  " + p.placeZh : ""),
        sub: [p.country, p.year].filter(Boolean).join(" · ") + (p.note ? " — " + p.note : ""),
        region: p.region,
      };
    }).filter(function (x) { return activeRegion === "All" || x.region === activeRegion; });
  }
  function cocktailItems() {
    return COCKTAILS.map(function (c, i) {
      return {
        i: i, src: c.src,
        title: c.name + (c.nameZh ? "  ·  " + c.nameZh : ""),
        sub: [c.bar, c.city].filter(Boolean).join(", ") + (c.note ? " — " + c.note : ""),
      };
    });
  }

  function show(k, instant) {
    idx = (k + set.length) % set.length;
    var it = set[idx];
    var apply = function () {
      lbImg.src = it.src;
      lbImg.alt = it.title;
      $("#lbTitle").textContent = it.title;
      $("#lbSub").textContent = it.sub;
      $("#lbCount").textContent = pad(idx + 1) + " / " + pad(set.length);
      lbImg.classList.remove("is-swapping");
    };
    if (instant) return apply();
    lbImg.classList.add("is-swapping");
    var pre = new Image();
    pre.onload = pre.onerror = function () { setTimeout(apply, 180); };
    pre.src = it.src;
  }

  function open(items, dataIndex) {
    set = items;
    var k = 0;
    set.forEach(function (x, j) { if (x.i === dataIndex) k = j; });
    lastFocus = document.activeElement;
    lb.hidden = false;
    show(k, true);
    requestAnimationFrame(function () { lb.classList.add("is-open"); });
    document.body.style.overflow = "hidden";
    $("#lbClose").focus();
  }
  function close() {
    lb.classList.remove("is-open");
    document.body.style.overflow = "";
    setTimeout(function () { lb.hidden = true; }, 350);
    if (lastFocus) lastFocus.focus();
  }

  function bindOpen(container, sel, getItems) {
    container.addEventListener("click", function (e) {
      var el = e.target.closest(sel);
      if (el) open(getItems(), +el.getAttribute("data-i"));
    });
    container.addEventListener("keydown", function (e) {
      if (e.key !== "Enter" && e.key !== " ") return;
      var el = e.target.closest(sel);
      if (el) { e.preventDefault(); open(getItems(), +el.getAttribute("data-i")); }
    });
  }
  bindOpen(travelGrid, "figure", travelItems);
  bindOpen(cocktailGrid, ".card", cocktailItems);

  $("#lbClose").addEventListener("click", close);
  $("#lbPrev").addEventListener("click", function () { show(idx - 1); });
  $("#lbNext").addEventListener("click", function () { show(idx + 1); });
  lb.addEventListener("click", function (e) {
    if (e.target === lb || e.target.classList.contains("lb-figure")) close();
  });
  document.addEventListener("keydown", function (e) {
    if (lb.hidden) return;
    if (e.key === "Escape") close();
    else if (e.key === "ArrowLeft") show(idx - 1);
    else if (e.key === "ArrowRight") show(idx + 1);
  });
  // swipe
  var sx = null;
  lb.addEventListener("touchstart", function (e) { sx = e.touches[0].clientX; }, { passive: true });
  lb.addEventListener("touchend", function (e) {
    if (sx === null) return;
    var dx = e.changedTouches[0].clientX - sx;
    if (Math.abs(dx) > 50) show(idx + (dx < 0 ? 1 : -1));
    sx = null;
  });
})();
