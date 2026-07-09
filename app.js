/* ═══════════════════════════════════════════════════
   SUSHANT KUMAR : app.js
   Nav, scroll-reveal, and the hero chart's one signature
   load animation. Every step runs defensively : one
   failure never blocks the rest (lesson learned).
═══════════════════════════════════════════════════ */

function safeRun(label, fn) {
  try { return fn(); }
  catch (err) { console.error("[site] " + label + " failed:", err); }
}

function initNav() {
  const navbar = document.getElementById("navbar");
  window.addEventListener("scroll", () => {
    navbar.classList.toggle("scrolled", window.scrollY > 12);
  });
  const burger = document.getElementById("navBurger");
  const mobile = document.getElementById("navMobile");
  burger.addEventListener("click", () => mobile.classList.toggle("open"));
  mobile.querySelectorAll("a").forEach(a =>
    a.addEventListener("click", () => mobile.classList.remove("open"))
  );
}

function initReveal() {
  const els = document.querySelectorAll(".reveal");
  if (!("IntersectionObserver" in window)) {
    els.forEach(el => el.classList.add("in-view"));
    return;
  }
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("in-view");
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });
  els.forEach(el => io.observe(el));
}

// The signature moment: hero chart bars draw in on load, matching
// his own LinkedIn infographic format (stark bar comparison).
function initHeroChart() {
  const typical = document.getElementById("barTypical");
  const best    = document.getElementById("barBest");
  if (!typical || !best) return;

  const typicalVal = 10000;
  const bestVal     = 136226;
  const scale       = 90; // max bar width %, leaves room so the longer bar doesn't touch the edge

  setTimeout(() => {
    typical.style.width = ((typicalVal / bestVal) * scale) + "%";
    best.style.width     = scale + "%";
  }, 300);
}

// ═══════════════════════════════════════════════════
// GALLERY: named photo slots. There is no server here,
// so "uploading" means: save a file with this exact name
// and add it to the same GitHub repo as the other files.
// Each slot shows the real photo automatically once that
// file exists, and a clearly-labeled placeholder until then.
// ═══════════════════════════════════════════════════
const GALLERY_ITEMS = [
  { file: "gallery-1.jpg", caption: "Bihar AI Summit 2026" },
  { file: "gallery-2.jpg", caption: "MY Bharat National Round" },
  { file: "gallery-3.jpg", caption: "Building Dawai Sahi Hai" },
  { file: "gallery-4.jpg", caption: "MyGov Recognition" },
  { file: "gallery-5.jpg", caption: "On Stage" },
  { file: "gallery-6.jpg", caption: "Behind the Work" },
];

// Shared by the hero photo and every gallery slot. If the .jpg
// named in the HTML fails to load, tries .jpeg, then .png, before
// finally giving up and showing the labeled placeholder. Handles
// the common case where a phone saved the file as .jpeg instead
// of .jpg, or exported as .png, without needing anyone to rename
// their photo's actual format, only its name.
function handleImgError(img, fallbackId) {
  const chain = ["jpeg", "png"];
  const tried = img.dataset.tried ? img.dataset.tried.split(",") : [];
  const next = chain.find(ext => !tried.includes(ext));
  if (next) {
    tried.push(next);
    img.dataset.tried = tried.join(",");
    img.src = img.dataset.base + "." + next;
  } else {
    img.style.display = "none";
    const fb = document.getElementById(fallbackId);
    if (fb) fb.style.display = "flex";
  }
}

function renderGallery() {
  const grid = document.getElementById("galleryGrid");
  if (!grid) return;
  grid.innerHTML = "";

  GALLERY_ITEMS.forEach((item, i) => {
    const base = item.file.replace(/\.[^.]+$/, "");
    const wrap = document.createElement("div");
    wrap.className = "gallery-item";
    wrap.innerHTML =
      '<div class="gallery-frame">' +
        '<img src="' + item.file + '" data-base="' + base + '" alt="' + item.caption + '" ' +
             'onerror="handleImgError(this, \'galleryFallback' + i + '\')">' +
        '<div class="gallery-placeholder" id="galleryFallback' + i + '" style="display:none;">' +
          '<div class="gallery-placeholder-icon">Add photo</div>' +
          '<div class="gallery-placeholder-file">' + item.file + '</div>' +
        '</div>' +
      '</div>' +
      '<div class="gallery-caption">' + item.caption + '</div>';
    grid.appendChild(wrap);
  });
}

function init() {
  safeRun("initNav", initNav);
  safeRun("initReveal", initReveal);
  safeRun("initHeroChart", initHeroChart);
  safeRun("renderGallery", renderGallery);
}

document.addEventListener("DOMContentLoaded", init);