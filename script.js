// ===================================
// 想える人。 v2.0
// script.js
// ===================================

const userData = {};

// -----------------------------------
// オープニング → STEP1
// -----------------------------------

const startBtn = document.getElementById("startBtn");

if (startBtn) {
  startBtn.addEventListener("click", () => {
    document.getElementById("step1").scrollIntoView({
      behavior: "smooth",
      block: "start"
    });
  });
}

// -----------------------------------
// オーバーレイ
// -----------------------------------

const overlay = document.getElementById("overlay");
const overlayText = document.getElementById("overlayText");

function showOverlay(message, callback) {
  overlayText.innerHTML = message;
  overlay.classList.add("show");

  setTimeout(() => {
    overlay.classList.remove("show");

    if (callback) {
      setTimeout(callback, 300);
    }
  }, 1800);
}

// -----------------------------------
// STEP1
// -----------------------------------

const step1Options = document.querySelectorAll("#step1 .option-card");

step1Options.forEach(option => {

  option.addEventListener("click", () => {

    step1Options.forEach(o => o.classList.remove("selected"));

    option.classList.add("selected");

    userData.step1 = option.dataset.value;

    showOverlay(
      "新しいことへの向き合い方には、<br>人それぞれのパターンがあります。",
      () => {

        // ===================================
        // 次回 STEP2 へ接続
        // 今は仮で少しスクロール
        // ===================================

        window.scrollBy({
          top: window.innerHeight * 0.6,
          behavior: "smooth"
        });

      }
    );

  });

});

// -----------------------------------
// フェードイン
// -----------------------------------

const fadeTargets = document.querySelectorAll(
  ".hero-image, .hero h1, .lead, .body-text, .primary-btn, .step-image, .step-container"
);

const observer = new IntersectionObserver((entries) => {

  entries.forEach(entry => {

    if (entry.isIntersecting) {
      entry.target.classList.add("visible");
    }

  });

}, {
  threshold: 0.2
});

fadeTargets.forEach(el => {

  el.classList.add("fade-up");

  observer.observe(el);

});

// -----------------------------------
// スクロール時に背景の光を少し動かす
// -----------------------------------

const glow1 = document.querySelector(".glow1");
const glow2 = document.querySelector(".glow2");

window.addEventListener("scroll", () => {

  const y = window.scrollY;

  glow1.style.transform = `translate(${y * 0.02}px, ${y * 0.01}px)`;

  glow2.style.transform = `translate(${-y * 0.015}px, ${-y * 0.008}px)`;

});

// -----------------------------------
// デバッグ
// -----------------------------------

window.userData = userData;

console.log("想える人。 v2.0 loaded");
