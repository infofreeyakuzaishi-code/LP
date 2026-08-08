/* =========================================
  想える人 v1.0
  script.js Part1
========================================= */

const GAS_URL =
  "https://script.google.com/macros/s/AKfycbzkrEJ7dVbWkEYvxW7lE8Pu8REcsWelbscCZtQAwpIYTKQtzs0VeIYw9QnHJFbBPxfWHA/exec";

/* =========================================
  STATE
========================================= */

const state = {
  currentStep: 0,
  answers: {},
  prefecture: "",
};

const STORAGE_KEY = "omoeru_v1_answers";

/* =========================================
  STEP DATA
========================================= */

const steps = [
  {
    key: "discover",
    title:
      "何か新しい情報や面白いものを見つけたとき、\\nあなたはどうすることが多いですか？",
    subtitle:
      "正解・不正解はありません。\\n今の自分に一番近いものを選んでください。",
    options: [
      "まず自分で試してみる",
      "周りの人に相談する",
      "とりあえず保存して他の情報も見る",
      "特に何もしないことが多い",
    ],
  },
  {
    key: "share",
    title:
      "「これは良かった」と感じたものや体験があったとき、\\nあなたはどうすることが多いですか？",
    subtitle:
      "深く考えなくて大丈夫です。\\n普段の自分に一番近いものを選んでください。",
    options: [
      "周りの人に伝える・話す",
      "SNSやブログで発信する",
      "家族や近い人にだけシェアする",
      "自分の中にしまっておく",
    ],
  },
  {
    key: "fit",
    title:
      "誰かからおすすめされたものが、\\n自分には合わなかったことはありますか？",
    subtitle:
      "人によって合うものは違う。\\nそう感じた経験に近いものを選んでください。",
    options: [
      "よくある",
      "何度かある",
      "あまりない",
      "ほとんどない",
    ],
  },
  {
    key: "listen",
    title:
      "誰かの悩みや相談を聞くことは多いですか？",
    subtitle:
      "あなたの普段の役割に近いものを選んでください。",
    options: [
      "よく相談される",
      "時々相談される",
      "あまり相談されない",
      "自分から相談することが多い",
    ],
  },
  {
    key: "future",
    title:
      "これから先、誰かや地域の役に立てることがあるなら、\\n少し興味がありますか？",
    subtitle:
      "今の気持ちに一番近いものを選んでください。",
    options: [
      "とても興味がある",
      "少し興味がある",
      "まだわからない",
      "今は考えていない",
    ],
  },
];

/* =========================================
  DOM
========================================= */

const splash = document.getElementById("splash");
const app = document.getElementById("app");

const startBtn = document.getElementById("startBtn");

const stepContainer = document.getElementById("stepContainer");
const interlude = document.getElementById("interlude");

const progressBar = document.getElementById("progressBar");
const stepLabel = document.getElementById("stepLabel");
const question = document.getElementById("question");
const subtitle = document.getElementById("subtitle");
const options = document.getElementById("options");

/* =========================================
  INIT
========================================= */

window.addEventListener("load", () => {
  loadState();

  setTimeout(() => {
    splash.classList.add("hidden");
    app.classList.remove("hidden");

    revealElements();
  }, 2200);
});

/* =========================================
  START
========================================= */

startBtn.addEventListener("click", () => {
  document
    .querySelector(".hero")
    .scrollIntoView({ behavior: "smooth" });

  setTimeout(() => {
    stepContainer.classList.remove("hidden");
    renderStep(0);

    stepContainer.scrollIntoView({ behavior: "smooth" });
  }, 400);
});

/* =========================================
  STEP RENDER
========================================= */

function renderStep(index) {
  state.currentStep = index;

  const step = steps[index];

  const progress = ((index + 1) / 10) * 100;

  progressBar.style.width = progress + "%";

  stepLabel.textContent = `STEP ${index + 1} / 10`;

  question.innerHTML = step.title.replace(/\\n/g, "<br>");

  subtitle.innerHTML = step.subtitle.replace(/\\n/g, "<br>");

  options.innerHTML = "";

  step.options.forEach((option, i) => {
    const btn = document.createElement("button");

    btn.className = "option-card";

    btn.innerHTML = `
      <span class="option-letter">${String.fromCharCode(65 + i)}</span>
      <span class="option-text">${option}</span>
    `;

    if (state.answers[step.key] === option) {
      btn.classList.add("selected");
    }

    btn.addEventListener("click", () => {
      state.answers[step.key] = option;

      saveState();

      document
        .querySelectorAll(".option-card")
        .forEach((el) => el.classList.remove("selected"));

      btn.classList.add("selected");

      setTimeout(() => nextStep(), 320);
    });

    options.appendChild(btn);
  });
}

/* =========================================
  NEXT STEP
========================================= */

function nextStep() {
  const next = state.currentStep + 1;

  if (next < steps.length) {
    if (next === 1 || next === 3) {
      showInterlude(() => renderStep(next));
    } else {
      renderStep(next);
    }

    return;
  }

  stepContainer.classList.add("hidden");

  // Part2で日本地図セクションへ進む
  if (typeof showMapSection === "function") {
    showMapSection();
  }
}

/* =========================================
  INTERLUDE
========================================= */

function showInterlude(callback) {
  stepContainer.classList.add("hidden");

  interlude.classList.remove("hidden");

  interlude.scrollIntoView({ behavior: "smooth" });

  setTimeout(() => {
    interlude.classList.add("hidden");

    stepContainer.classList.remove("hidden");

    callback();

    stepContainer.scrollIntoView({ behavior: "smooth" });
  }, 1800);
}

/* =========================================
  STORAGE
========================================= */

function saveState() {
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify({
      answers: state.answers,
      prefecture: state.prefecture,
    })
  );
}

function loadState() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));

    if (!saved) return;

    state.answers = saved.answers || {};
    state.prefecture = saved.prefecture || "";
  } catch (e) {}
}

/* =========================================
  REVEAL
========================================= */

function revealElements() {
  const targets = document.querySelectorAll(
    ".hero-content, .step-card, .interlude-content, .project-card"
  );

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("show");
        }
      });
    },
    {
      threshold: 0.12,
    }
  );

  targets.forEach((el) => {
    el.classList.add("reveal");
    observer.observe(el);
  });
}

/* =========================================
  script.js Part2
========================================= */

/* DOM */

const mapSection = document.getElementById("mapSection");
const projectSection = document.getElementById("projectSection");
const prefectureSection = document.getElementById("prefectureSection");
const endingSection = document.getElementById("endingSection");

const prefectureSelect = document.getElementById("prefectureSelect");
const prefectureNext = document.getElementById("prefectureNext");

const reserveBtn = document.getElementById("reserveBtn");
const reserveModal = document.getElementById("reserveModal");
const modalClose = document.getElementById("modalClose");
const reserveForm = document.getElementById("reserveForm");

/* =========================================
  MAP
========================================= */

function showMapSection() {
  mapSection.classList.remove("hidden");
  mapSection.scrollIntoView({ behavior: "smooth" });

  animateMap();

  setTimeout(() => {
    showProjectSection();
  }, 2400);
}

function animateMap() {
  const map = document.getElementById("japanMap");

  if (!map) return;

  map.addEventListener(
    "load",
    () => {
      const svg = map.contentDocument;

      if (!svg) return;

      const ids = [
        "hokkaido",
        "tokyo",
        "osaka",
        "fukuoka",
        "okinawa",
      ];

      ids.forEach((id, index) => {
        const el = svg.getElementById(id);

        if (!el) return;

        setTimeout(() => {
          el.style.transition = "fill .4s ease, opacity .4s ease";
          el.style.fill = "#7FAFBC";
          el.style.opacity = "1";
        }, index * 260);
      });
    },
    { once: true }
  );
}

/* =========================================
  PROJECT
========================================= */

function showProjectSection() {
  projectSection.classList.remove("hidden");
  projectSection.scrollIntoView({ behavior: "smooth" });

  setTimeout(() => {
    showPrefectureSection();
  }, 1200);
}

/* =========================================
  PREFECTURE
========================================= */

function showPrefectureSection() {
  prefectureSection.classList.remove("hidden");
  prefectureSection.scrollIntoView({ behavior: "smooth" });

  if (state.prefecture) {
    prefectureSelect.value = state.prefecture;
  }
}

prefectureNext.addEventListener("click", () => {
  const value = prefectureSelect.value;

  if (!value) {
    alert("都道府県を選択してください。");
    return;
  }

  state.prefecture = value;
  saveState();

  showEndingSection();
});

/* =========================================
  ENDING
========================================= */

function showEndingSection() {
  endingSection.classList.remove("hidden");
  endingSection.scrollIntoView({ behavior: "smooth" });
}

/* =========================================
  MODAL
========================================= */

reserveBtn.addEventListener("click", openModal);

modalClose.addEventListener("click", closeModal);

reserveModal
  .querySelector(".modal-backdrop")
  .addEventListener("click", closeModal);

function openModal() {
  reserveModal.classList.remove("hidden");

  document.body.style.overflow = "hidden";

  document.getElementById("prefecture").value = state.prefecture || "";
  document.getElementById("businessStatus").value =
    state.answers.business || "";
  document.getElementById("projectInterest").value =
    state.answers.project || "";
  document.getElementById("mainInterest").value =
    state.answers.interest || "";

  const params = new URLSearchParams(location.search);

  document.getElementById("source").value = params.get("utm_source") || "";
  document.getElementById("keyword").value =
    params.get("utm_campaign") || "";
}

function closeModal() {
  reserveModal.classList.add("hidden");

  document.body.style.overflow = "";
}

/* =========================================
  FORM
========================================= */

reserveForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const submitBtn = reserveForm.querySelector("button[type=submit]");

  submitBtn.disabled = true;
  submitBtn.textContent = "送信中...";

  const payload = {
    name: document.getElementById("name").value,
    email: document.getElementById("email").value,
    phone: document.getElementById("phone").value,
    memo: document.getElementById("memo").value,
    prefecture: state.prefecture,
    answers: state.answers,
    source: document.getElementById("source").value,
    keyword: document.getElementById("keyword").value,
  };

  try {
    await fetch(GAS_URL, {
      method: "POST",
      mode: "no-cors",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    alert(
      "ありがとうございます。\\n内容を受け付けました。\\n予約画面へ進みます。"
    );

    closeModal();

    window.open(GAS_URL, "_blank");
  } catch (err) {
    alert("送信に失敗しました。時間をおいて再度お試しください。");
  } finally {
    submitBtn.disabled = false;
    submitBtn.textContent = "予約へ進む";
  }
});


/* =========================================
  PREFILL
========================================= */

if (state.prefecture) {
  prefectureSelect.value = state.prefecture;
}
