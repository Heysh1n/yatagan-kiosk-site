/**
 * =============================================================================
 * YAPAY ZEKA OKURYAZARLIĞI BİLGİ YARIŞMASI - KİOSK STAND YAZILIMI (app.js)
 * Yatağan Teknoloji Topluluğu • Sürüm 3.0
 * =============================================================================
 */

(function () {
  'use strict';

  /**
   * ===========================================================================
   * 1. QUESTION POOL (questions.json Dosyasından Asenkron Yüklenir)
   * ===========================================================================
   */
  let QUESTION_POOL = [];
  let QUIZ_QUESTIONS = [];
  let isQuestionsLoaded = false;

  // Başlangıç Tohum Verisi (Tertemiz başlangıç için boş bırakılmıştır)
  const SEED_LEADERBOARD = [];

  const STORAGE_KEY = "ytt_kiosk_leaderboard_v1";
  const SECONDS_PER_QUESTION = 20;
  const CIRCLE_CIRCUMFERENCE = 263.89; // 2 * Math.PI * 42

  /**
   * ===========================================================================
   * 2. SES SENTEZLEYİCİ (Web Audio API - Harici Ses Dosyası Bağımlılığı Yoktur)
   * ===========================================================================
   */
  class SoundSynthesizer {
    constructor() {
      this.enabled = true;
      this.audioCtx = null;
    }

    init() {
      if (!this.audioCtx) {
        const AudioContextClass = window.AudioContext || window.webkitAudioContext;
        if (AudioContextClass) {
          this.audioCtx = new AudioContextClass();
        }
      }
      if (this.audioCtx && this.audioCtx.state === 'suspended') {
        this.audioCtx.resume();
      }
    }

    playClick() {
      if (!this.enabled) return;
      this.init();
      if (!this.audioCtx) return;
      try {
        const osc = this.audioCtx.createOscillator();
        const gain = this.audioCtx.createGain();
        osc.type = "triangle";
        osc.frequency.setValueAtTime(650, this.audioCtx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(1250, this.audioCtx.currentTime + 0.05);
        gain.gain.setValueAtTime(0.2, this.audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, this.audioCtx.currentTime + 0.05);
        osc.connect(gain);
        gain.connect(this.audioCtx.destination);
        osc.start();
        osc.stop(this.audioCtx.currentTime + 0.05);
      } catch (e) {}
    }

    playWarning() {
      if (!this.enabled) return;
      this.init();
      if (!this.audioCtx) return;
      try {
        const osc = this.audioCtx.createOscillator();
        const gain = this.audioCtx.createGain();
        osc.type = "sawtooth";
        osc.frequency.setValueAtTime(880, this.audioCtx.currentTime);
        osc.frequency.setValueAtTime(440, this.audioCtx.currentTime + 0.07);
        gain.gain.setValueAtTime(0.25, this.audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, this.audioCtx.currentTime + 0.1);
        osc.connect(gain);
        gain.connect(this.audioCtx.destination);
        osc.start();
        osc.stop(this.audioCtx.currentTime + 0.1);
      } catch (e) {}
    }

    playVictory() {
      if (!this.enabled) return;
      this.init();
      if (!this.audioCtx) return;
      try {
        const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
        notes.forEach((freq, i) => {
          const osc = this.audioCtx.createOscillator();
          const gain = this.audioCtx.createGain();
          osc.type = "sine";
          osc.frequency.setValueAtTime(freq, this.audioCtx.currentTime + i * 0.08);
          gain.gain.setValueAtTime(0.2, this.audioCtx.currentTime + i * 0.08);
          gain.gain.exponentialRampToValueAtTime(0.001, this.audioCtx.currentTime + i * 0.08 + 0.32);
          osc.connect(gain);
          gain.connect(this.audioCtx.destination);
          osc.start(this.audioCtx.currentTime + i * 0.08);
          osc.stop(this.audioCtx.currentTime + i * 0.08 + 0.35);
        });
      } catch (e) {}
    }
  }

  const sound = new SoundSynthesizer();

  /**
   * ===========================================================================
   * 3. UYGULAMA DURUMU (APP STATE)
   * ===========================================================================
   */
  const state = {
    userName: "",
    activeQuestions: [],
    currentQuestionIndex: 0,
    userAnswers: [],
    totalRawPoints: 0,
    totalTimeSpent: 0,
    currentQuestionStartTime: 0,
    timerInterval: null,
    remainingSeconds: SECONDS_PER_QUESTION,
    isAnsweringLocked: false,
    currentEntry: null,
    currentCorrectKey: null
  };

  /**
   * ===========================================================================
   * 4. DOM ELEMENTLERİ
   * ===========================================================================
   */
  // Ekranlar
  const screens = {
    welcome: document.getElementById("screen-welcome"),
    info: document.getElementById("screen-info"),
    quiz: document.getElementById("screen-quiz"),
    leaderboard: document.getElementById("screen-leaderboard")
  };

  // Ekran 1: Welcome
  const inputUserName = document.getElementById("input-user-name");
  const btnWelcomeNext = document.getElementById("btn-welcome-next");
  const nameErrorMsg = document.getElementById("name-error-msg");

  // Ekran 2: Info
  const infoUserDisplay = document.getElementById("info-user-display");
  const btnInfoBack = document.getElementById("btn-info-back");
  const btnStartQuiz = document.getElementById("btn-start-quiz");

  // Ekran 3: Quiz
  const quizQuestionBadge = document.getElementById("quiz-question-badge");
  const quizDifficultyBadge = document.getElementById("quiz-difficulty-badge");
  const quizUserName = document.getElementById("quiz-user-name");
  const quizQuestionText = document.getElementById("quiz-question-text");
  const quizOptionsContainer = document.getElementById("quiz-options-container");
  const timerRing = document.getElementById("timer-ring");
  const timerText = document.getElementById("timer-text");
  const quizTotalProgress = document.getElementById("quiz-total-progress");

  // Ekran 4: Leaderboard
  const resultUserName = document.getElementById("result-user-name");
  const resultFinalScore = document.getElementById("result-final-score");
  const resultCorrectCount = document.getElementById("result-correct-count");
  const resultRawPoints = document.getElementById("result-raw-points");
  const resultTotalTime = document.getElementById("result-total-time");
  const leaderboardTableBody = document.getElementById("leaderboard-table-body");
  const btnNewParticipant = document.getElementById("btn-new-participant");
  const btnOpenAdminFromScreen = document.getElementById("btn-open-admin-from-screen");

  // Header & Logo
  const kioskLogoSlot = document.getElementById("kiosk-logo-slot");
  const btnSoundToggle = document.getElementById("btn-sound-toggle");
  const iconSoundOn = document.getElementById("icon-sound-on");
  const iconSoundOff = document.getElementById("icon-sound-off");
  const btnFullscreenToggle = document.getElementById("btn-fullscreen-toggle");
  const iconFsEnter = document.getElementById("icon-fs-enter");
  const iconFsExit = document.getElementById("icon-fs-exit");

  // Admin Modal
  const adminModal = document.getElementById("admin-modal");
  const adminModalBackdrop = document.getElementById("admin-modal-backdrop");
  const btnAdminClose = document.getElementById("btn-admin-close");
  const adminInputName = document.getElementById("admin-input-name");
  const adminInputCorrect = document.getElementById("admin-input-correct");
  const adminInputPoints = document.getElementById("admin-input-points");
  const adminInputTime = document.getElementById("admin-input-time");
  const btnAdminAddManual = document.getElementById("btn-admin-add-manual");
  const btnAdminExportJson = document.getElementById("btn-admin-export-json");
  const btnAdminSaveJson = document.getElementById("btn-admin-save-json");
  const adminJsonTextarea = document.getElementById("admin-json-textarea");
  const btnAdminResetAll = document.getElementById("btn-admin-reset-all");

  /**
   * ===========================================================================
   * 5. ASENKRON VERİ YÜKLEME (FETCH API)
   * questions.json dosyasından 18 soruluk havuz asenkron yüklenir.
   * ===========================================================================
   */
  async function loadQuestionsFromJSON() {
    if (btnWelcomeNext) {
      btnWelcomeNext.disabled = true;
      const span = btnWelcomeNext.querySelector("span");
      if (span) span.textContent = "Sorular Yükleniyor...";
    }

    try {
      const response = await fetch("questions.json");
      if (!response.ok) {
        throw new Error(`HTTP ${response.status} - ${response.statusText}`);
      }
      const data = await response.json();
      if (!Array.isArray(data)) {
        throw new Error("Geçersiz veri formatı: JSON bir dizi olmalıdır.");
      }

      QUESTION_POOL = data;
      QUIZ_QUESTIONS = data;
      isQuestionsLoaded = true;

      if (btnWelcomeNext) {
        btnWelcomeNext.disabled = false;
        const span = btnWelcomeNext.querySelector("span");
        if (span) span.textContent = "İleri";
      }

      // Veri başarıyla yüklendiğinde runSystemCheck() çalıştırılır
      runSystemCheck();
    } catch (error) {
      console.error("[YTT Kiosk] Soru veritabanı yüklenirken hata oluştu:", error);
      if (btnWelcomeNext) {
        const span = btnWelcomeNext.querySelector("span");
        if (span) span.textContent = "Yükleme Hatası!";
      }
    }
  }

  /**
   * ===========================================================================
   * 6. EKRAN YÖNETİMİ (STATE MACHINE)
   * ===========================================================================
   */
  function showScreen(screenKey) {
    Object.keys(screens).forEach(key => {
      if (screens[key]) {
        if (key === screenKey) {
          screens[key].classList.add("active");
        } else {
          screens[key].classList.remove("active");
        }
      }
    });
    window.scrollTo(0, 0);
  }

  /**
   * ===========================================================================
   * 7. LOGO HATASI FALLBACK & 3-CLICK ADMIN TETİKLEYİCİSİ
   * ===========================================================================
   */
  window.handleLogoError = function (imgElement) {
    imgElement.style.display = 'none';
    const fallbackEl = document.getElementById("kiosk-logo-fallback");
    if (fallbackEl) {
      fallbackEl.classList.remove("hidden");
    }
  };

  let logoClickCount = 0;
  let logoClickTimer = null;

  if (kioskLogoSlot) {
    kioskLogoSlot.addEventListener("click", () => {
      logoClickCount++;
      clearTimeout(logoClickTimer);

      if (logoClickCount >= 3) {
        logoClickCount = 0;
        sound.playClick();
        openAdminModal();
      } else {
        logoClickTimer = setTimeout(() => {
          logoClickCount = 0;
        }, 650);
      }
    });
  }

  /**
   * ===========================================================================
   * 8. EKRAN 1: KARŞILAMA VE GİRİŞ
   * ===========================================================================
   */
  function handleWelcomeNext() {
    if (!isQuestionsLoaded || QUESTION_POOL.length === 0) {
      sound.playWarning();
      return;
    }

    const name = inputUserName.value.trim();
    if (!name || name.length < 2) {
      sound.playWarning();
      nameErrorMsg.classList.remove("hidden");
      inputUserName.classList.add("shake-error");
      inputUserName.focus();
      setTimeout(() => {
        inputUserName.classList.remove("shake-error");
      }, 500);
      return;
    }

    nameErrorMsg.classList.add("hidden");
    state.userName = name;
    sound.playClick();

    infoUserDisplay.textContent = state.userName;
    showScreen("info");
  }

  if (btnWelcomeNext) {
    btnWelcomeNext.addEventListener("click", handleWelcomeNext);
  }
  if (inputUserName) {
    inputUserName.addEventListener("keydown", (e) => {
      if (e.key === "Enter") handleWelcomeNext();
    });
  }

  /**
   * ===========================================================================
   * 9. EKRAN 2: BİLGİLENDİRME VE BAŞLATMA
   * ===========================================================================
   */
  if (btnInfoBack) {
    btnInfoBack.addEventListener("click", () => {
      sound.playClick();
      showScreen("welcome");
    });
  }

  if (btnStartQuiz) {
    btnStartQuiz.addEventListener("click", () => {
      sound.playClick();
      startQuiz();
    });
  }

  /**
   * ===========================================================================
   * 10. EKRAN 3: YARIŞMA SÜRECİ, FISHER-YATES SHUFFLE & OTURUM SEÇİMİ
   * ===========================================================================
   */

  /**
   * Fisher-Yates (Knuth) Shuffle Algoritması
   * Orijinal diziyi bozmadan karıştırılmış kopyasını döndürür.
   */
  function fisherYatesShuffle(array) {
    const arr = array.slice();
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      const temp = arr[i];
      arr[i] = arr[j];
      arr[j] = temp;
    }
    return arr;
  }

  /**
   * Rastgele Oturum Mantığı (Random Session Selection)
   * 18 soruluk havuzdan rastgele 1 Basit, 1 Orta ve 1 Zor soru seçilir.
   * Kullanıcının karşısına Basit -> Orta -> Zor sırasıyla 3 soru gelir.
   */
  function startQuiz() {
    if (!QUESTION_POOL || QUESTION_POOL.length === 0) return;

    const easyPool = QUESTION_POOL.filter(q => q.level === "Basit");
    const mediumPool = QUESTION_POOL.filter(q => q.level === "Orta");
    const hardPool = QUESTION_POOL.filter(q => q.level === "Zor");

    const randomEasy = easyPool[Math.floor(Math.random() * easyPool.length)];
    const randomMedium = mediumPool[Math.floor(Math.random() * mediumPool.length)];
    const randomHard = hardPool[Math.floor(Math.random() * hardPool.length)];

    state.activeQuestions = [randomEasy, randomMedium, randomHard];
    state.currentQuestionIndex = 0;
    state.userAnswers = [];
    state.totalRawPoints = 0;
    state.totalTimeSpent = 0;
    state.currentEntry = null;

    quizUserName.textContent = state.userName;
    showScreen("quiz");
    loadQuestion(0);
  }

  /**
   * Şıkların Karıştırılması (Shuffle Options)
   * Seçenekler Fisher-Yates algoritması ile karıştırılır.
   * UI üzerindeki A, B, C, D harfleri sabit kalır, metinler değişir.
   * correctKey eşleştirmesi yeni buton harfine göre güncellenir.
   */
  function loadQuestion(index) {
    const questions = state.activeQuestions;
    if (!questions || index >= questions.length) {
      finishQuiz();
      return;
    }

    const q = questions[index];
    state.currentQuestionIndex = index;
    state.isAnsweringLocked = false;
    state.remainingSeconds = SECONDS_PER_QUESTION;

    // Rozetler ve İlerleme (3 Soru)
    quizQuestionBadge.textContent = `SORU ${index + 1} / ${questions.length}`;
    quizDifficultyBadge.textContent = q.badgeText;
    quizTotalProgress.style.width = `${((index + 1) / questions.length) * 100}%`;

    // Soru Metni
    quizQuestionText.textContent = q.question;

    // Şıkları Fisher-Yates Algoritması ile Karıştır
    const displayKeys = ["A", "B", "C", "D"];
    const shuffledOptions = fisherYatesShuffle(q.options);

    // Orijinal doğru seçeneğin (q.correctKey) karıştırılmış dizideki yeni indeksini bul
    const newCorrectIndex = shuffledOptions.findIndex(opt => opt.key === q.correctKey);
    state.currentCorrectKey = newCorrectIndex !== -1 ? displayKeys[newCorrectIndex] : q.correctKey;

    // Şıkları Oluştur (Büyük Kiosk Butonları: "A, B, C, D" sabit harfler kalır, metinler karıştırılır)
    quizOptionsContainer.innerHTML = "";
    shuffledOptions.forEach((opt, idx) => {
      const assignedKey = displayKeys[idx] || opt.key;
      const btn = document.createElement("button");
      btn.className = "quiz-option-btn cyber-cut-btn";
      btn.innerHTML = `
        <div class="opt-key">${assignedKey}</div>
        <div class="opt-text">${opt.text}</div>
      `;

      btn.addEventListener("click", () => {
        handleAnswerSelection(assignedKey, btn);
      });

      quizOptionsContainer.appendChild(btn);
    });

    startTimer();
  }

  function startTimer() {
    clearInterval(state.timerInterval);
    state.currentQuestionStartTime = performance.now();
    updateTimerUI(SECONDS_PER_QUESTION);

    state.timerInterval = setInterval(() => {
      state.remainingSeconds -= 0.1;

      if (state.remainingSeconds <= 0.05) {
        state.remainingSeconds = 0;
        updateTimerUI(0);
        clearInterval(state.timerInterval);
        handleTimeExpired();
      } else {
        updateTimerUI(state.remainingSeconds);
      }
    }, 100);
  }

  function updateTimerUI(seconds) {
    const displayInt = Math.ceil(seconds);
    timerText.textContent = displayInt;

    // SVG Çember Halkası
    const offset = CIRCLE_CIRCUMFERENCE - (seconds / SECONDS_PER_QUESTION) * CIRCLE_CIRCUMFERENCE;
    timerRing.style.strokeDashoffset = offset;

    // Son 5 Saniye Tehlike Uyarı Efekti
    if (seconds <= 5.0) {
      timerRing.style.stroke = "var(--danger)";
      timerText.classList.add("timer-danger");
      if (Math.abs(seconds - Math.round(seconds)) < 0.08) {
        sound.playWarning();
      }
    } else {
      timerRing.style.stroke = "var(--accent)";
      timerText.classList.remove("timer-danger");
    }
  }

  function handleAnswerSelection(selectedKey, btnElement) {
    if (state.isAnsweringLocked) return;
    state.isAnsweringLocked = true;

    clearInterval(state.timerInterval);
    const elapsedSeconds = Math.min(20, (performance.now() - state.currentQuestionStartTime) / 1000);

    const q = state.activeQuestions[state.currentQuestionIndex];
    // Güncel şık sırasına göre belirlenen doğru harfle karşılaştırma
    const activeTargetKey = state.currentCorrectKey || q.correctKey;
    const isCorrect = (selectedKey === activeTargetKey);
    const points = isCorrect ? q.points : 0;

    btnElement.classList.add("selected");
    sound.playClick();

    state.userAnswers.push({
      questionId: q.id,
      selectedKey: selectedKey,
      isCorrect: isCorrect,
      pointsAwarded: points,
      timeSpent: parseFloat(elapsedSeconds.toFixed(1))
    });

    state.totalRawPoints += points;
    state.totalTimeSpent += elapsedSeconds;

    setTimeout(() => {
      loadQuestion(state.currentQuestionIndex + 1);
    }, 320);
  }

  function handleTimeExpired() {
    if (state.isAnsweringLocked) return;
    state.isAnsweringLocked = true;
    sound.playWarning();

    const q = state.activeQuestions[state.currentQuestionIndex];
    // Süre bitti: 0 puan, 20 sn
    state.userAnswers.push({
      questionId: q.id,
      selectedKey: null,
      isCorrect: false,
      pointsAwarded: 0,
      timeSpent: 20.0
    });

    state.totalTimeSpent += 20.0;

    setTimeout(() => {
      loadQuestion(state.currentQuestionIndex + 1);
    }, 450);
  }

  /**
   * ===========================================================================
   * 11. EKRAN 4: SONUÇ VE LİDERLİK TABLOSU
   * ===========================================================================
   */
  function finishQuiz() {
    sound.playVictory();
    showScreen("leaderboard");

    const totalQuestions = state.activeQuestions ? state.activeQuestions.length : 3;
    const correctCount = state.userAnswers.filter(a => a.isCorrect).length;
    const safeTime = Math.max(1.0, state.totalTimeSpent);
    
    // FORMÜL: Nihai Skor = Kazanılan Toplam Ham Puan / Harcanan Toplam Süre (Saniye)
    const calculatedScore = parseFloat((state.totalRawPoints / safeTime).toFixed(2));

    resultUserName.textContent = state.userName;
    resultFinalScore.textContent = calculatedScore.toFixed(2);
    resultCorrectCount.textContent = correctCount;
    if (resultCorrectCount && resultCorrectCount.parentElement) {
      resultCorrectCount.parentElement.innerHTML = `<span id="result-correct-count" class="text-success">${correctCount}</span> / ${totalQuestions} Doğru`;
    }
    resultRawPoints.textContent = state.totalRawPoints;
    resultTotalTime.textContent = state.totalTimeSpent.toFixed(1);

    const newEntry = {
      name: state.userName,
      correct: correctCount,
      rawPoints: state.totalRawPoints,
      totalTime: parseFloat(state.totalTimeSpent.toFixed(1)),
      score: calculatedScore,
      timestamp: Date.now()
    };

    state.currentEntry = newEntry;
    saveLeaderboardEntry(newEntry);
  }

  function getLeaderboard() {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      if (data) {
        const parsed = JSON.parse(data);
        if (Array.isArray(parsed)) {
          const isLegacySeeds = parsed.length === 5 && parsed.every(p => 
            ["Alperen Demir", "Selin Kaya", "Eren Öztürk", "Zeynep Aydın", "Mert Çelik"].includes(p.name)
          );
          if (isLegacySeeds) {
            localStorage.setItem(STORAGE_KEY, JSON.stringify([]));
            return [];
          }
          return parsed;
        }
      }
    } catch (e) {}
    return [...SEED_LEADERBOARD];
  }

  function saveLeaderboardEntry(entry) {
    let list = getLeaderboard();
    list.push(entry);

    // Sıralama Kuralı: Önce en yüksek skor, eşitlikte daha düşük toplam süre
    list.sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      return a.totalTime - b.totalTime;
    });

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
    } catch (e) {}

    renderLeaderboard(list, entry);
  }

  function renderLeaderboard(list, currentEntry = null) {
    leaderboardTableBody.innerHTML = "";
    const top10 = list.slice(0, 10);

    top10.forEach((item, index) => {
      const isCurrent = currentEntry && 
        item.name === currentEntry.name && 
        item.score === currentEntry.score && 
        item.totalTime === currentEntry.totalTime;

      const tr = document.createElement("tr");
      if (isCurrent) {
        tr.className = "current-user-row";
      }

      let rankDisplay = `${index + 1}`;
      if (index === 0) rankDisplay = `🥇 1`;
      else if (index === 1) rankDisplay = `🥈 2`;
      else if (index === 2) rankDisplay = `🥉 3`;

      tr.innerHTML = `
        <td class="td-rank">${rankDisplay}</td>
        <td class="td-name">
          <span>${escapeHtml(item.name)}</span>
          ${isCurrent ? '<span class="current-tag">SEN</span>' : ''}
        </td>
        <td class="td-correct">${item.correct}/3</td>
        <td class="td-time">${item.totalTime}s</td>
        <td class="td-score">${parseFloat(item.score).toFixed(2)}</td>
      `;

      leaderboardTableBody.appendChild(tr);
    });
  }

  function escapeHtml(str) {
    if (!str) return "";
    return str.replace(/[&<>'"]/g, tag => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      "'": '&#39;',
      '"': '&quot;'
    }[tag] || tag));
  }

  // Yeni Yarışmacı Butonu -> Ekran 1'e Temiz Dönüş
  if (btnNewParticipant) {
    btnNewParticipant.addEventListener("click", () => {
      sound.playClick();
      clearInterval(state.timerInterval);
      state.userName = "";
      inputUserName.value = "";
      nameErrorMsg.classList.add("hidden");
      showScreen("welcome");
      setTimeout(() => {
        if (inputUserName) inputUserName.focus();
      }, 200);
    });
  }

  /**
   * ===========================================================================
   * 12. KİOSK ADMİN PANELİ & JSON YÖNETİMİ (MODAL OVERLAY - DEFENSIVE CONTROLLER)
   * Tetikleyiciler: Ctrl+Shift+A, Logo 3-Click, [⚙ Admin Paneli] butonu, Esc
   * ===========================================================================
   */
  function getAdminPanelElement() {
    return document.getElementById("admin-panel") || document.getElementById("admin-modal");
  }

  function openAdminModal() {
    const panel = getAdminPanelElement();
    if (!panel) return;
    
    const list = getLeaderboard();
    const textarea = document.getElementById("admin-json-textarea");
    if (textarea) {
      textarea.value = JSON.stringify(list, null, 2);
    }
    
    panel.classList.remove("hidden");
    panel.setAttribute("aria-hidden", "false");
  }

  function closeAdminModal() {
    const panel = getAdminPanelElement();
    if (!panel) return;
    panel.classList.add("hidden");
    panel.setAttribute("aria-hidden", "true");
  }

  // 1. Tetikleyici: Leaderboard Ekranındaki [⚙ Admin Paneli] Linki
  const btnOpenAdmin = document.getElementById("btn-open-admin-from-screen");
  if (btnOpenAdmin) {
    btnOpenAdmin.addEventListener("click", () => {
      sound.playClick();
      openAdminModal();
    });
  }

  // 2. Kapatma Butonu (✕)
  const btnCloseModal = document.getElementById("btn-admin-close");
  if (btnCloseModal) {
    btnCloseModal.addEventListener("click", () => {
      sound.playClick();
      closeAdminModal();
    });
  }

  // 3. Arka Plana Tıklayınca Kapatma
  const modalBackdrop = document.getElementById("admin-modal-backdrop");
  if (modalBackdrop) {
    modalBackdrop.addEventListener("click", closeAdminModal);
  }

  // 4. Klavye Kısayolları: Ctrl + Shift + A (Aç/Kapat) ve Escape (Kapat)
  window.addEventListener("keydown", (e) => {
    const panel = getAdminPanelElement();
    if (!panel) return;

    if (e.ctrlKey && e.shiftKey && (e.key === "A" || e.key === "a")) {
      e.preventDefault();
      sound.playClick();
      if (panel.classList.contains("hidden")) {
        openAdminModal();
      } else {
        closeAdminModal();
      }
    } else if (e.key === "Escape" && !panel.classList.contains("hidden")) {
      closeAdminModal();
    }
  });

  // 5. Dokunmatik Standlar İçin: Logoya 3 Kez Tıklama (Triple-Click)
  let adminLogoClickCount = 0;
  let adminLogoClickTimer = null;
  const logoTriggerSlot = document.getElementById("kiosk-logo-slot");
  if (logoTriggerSlot) {
    logoTriggerSlot.addEventListener("click", () => {
      adminLogoClickCount++;
      clearTimeout(adminLogoClickTimer);

      if (adminLogoClickCount >= 3) {
        adminLogoClickCount = 0;
        sound.playClick();
        openAdminModal();
      } else {
        adminLogoClickTimer = setTimeout(() => {
          adminLogoClickCount = 0;
        }, 650);
      }
    });
  }

  // 6. Admin Özelliği 1: Manuel Yarışmacı Kaydı Ekle (Virgül & NaN Korumalı)
  const btnAddManual = document.getElementById("btn-admin-add-manual");
  if (btnAddManual) {
    btnAddManual.addEventListener("click", () => {
      const nameInput = document.getElementById("admin-input-name");
      const correctInput = document.getElementById("admin-input-correct");
      const pointsInput = document.getElementById("admin-input-points");
      const timeInput = document.getElementById("admin-input-time");

      const name = nameInput ? nameInput.value.trim() : "";
      const correct = correctInput ? parseInt(correctInput.value, 10) : 0;
      const rawPoints = pointsInput ? parseInt(pointsInput.value, 10) : 0;

      // Virgülü noktaya çevirme ve defansif parse (NaN veya 0 ise 1.0 al)
      const rawTimeStr = timeInput ? timeInput.value.replace(',', '.').trim() : "1.0";
      let totalTime = parseFloat(rawTimeStr);
      if (isNaN(totalTime) || totalTime <= 0) {
        totalTime = 1.0;
      }

      if (!name) {
        alert("Lütfen geçerli bir katılımcı adı giriniz!");
        if (nameInput) nameInput.focus();
        return;
      }
      if (isNaN(correct) || correct < 0 || correct > 3) {
        alert("Doğru sayısı 0 ile 3 arasında bir değer olmalıdır!");
        return;
      }
      if (isNaN(rawPoints) || rawPoints < 0) {
        alert("Ham puan geçerli bir pozitif sayı olmalıdır!");
        return;
      }

      // Skor Hesaplama Formülü: Ham Puan / Harcanan Süre
      const score = parseFloat((rawPoints / totalTime).toFixed(2));
      const newEntry = {
        name: name,
        correct: correct,
        rawPoints: rawPoints,
        totalTime: parseFloat(totalTime.toFixed(1)),
        score: score,
        timestamp: Date.now()
      };

      // localStorage'a anında kaydet ve liderlik tablosunu yeniden çiz
      saveLeaderboardEntry(newEntry);

      // JSON textarea alanını güncelle
      const textarea = document.getElementById("admin-json-textarea");
      if (textarea) {
        textarea.value = JSON.stringify(getLeaderboard(), null, 2);
      }

      sound.playClick();
      if (nameInput) nameInput.value = "";
      alert(`"${name}" başarıyla eklendi!\nHesaplanan Skor: ${score.toFixed(2)}`);
    });
  }

  // 7. Admin Özelliği 2: JSON Export (İndir)
  const btnExportJson = document.getElementById("btn-admin-export-json");
  if (btnExportJson) {
    btnExportJson.addEventListener("click", () => {
      sound.playClick();
      const list = getLeaderboard();
      const jsonStr = JSON.stringify(list, null, 2);
      const blob = new Blob([jsonStr], { type: "application/json;charset=utf-8" });
      const url = URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = `leaderboard.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    });
  }

  // 8. Admin Özelliği 3: JSON Import & Edit (Kaydet)
  const btnSaveJson = document.getElementById("btn-admin-save-json");
  if (btnSaveJson) {
    btnSaveJson.addEventListener("click", () => {
      const textarea = document.getElementById("admin-json-textarea");
      if (!textarea) return;

      const text = textarea.value.trim();
      if (!text) {
        alert("JSON alanı boş bırakılamaz!");
        return;
      }

      try {
        const parsed = JSON.parse(text);
        if (!Array.isArray(parsed)) {
          throw new Error("JSON verisi bir dizi (array) formatında olmalıdır! Örn: [ { ... } ]");
        }

        // Alan Doğrulamaları
        parsed.forEach((item, i) => {
          if (!item.name || typeof item.score === "undefined") {
            throw new Error(`Kayıt ${i + 1} için 'name' veya 'score' alanı eksik!`);
          }
        });

        // Skorlara göre sırala
        parsed.sort((a, b) => {
          if (b.score !== a.score) return b.score - a.score;
          return (a.totalTime || 0) - (b.totalTime || 0);
        });

        localStorage.setItem(STORAGE_KEY, JSON.stringify(parsed));
        renderLeaderboard(parsed);
        sound.playClick();
        alert("Liderlik tablosu başarıyla güncellendi!");
      } catch (err) {
        sound.playWarning();
        alert(`Geçersiz JSON Formatı!\nDetay: ${err.message}`);
      }
    });
  }

  // 9. Admin Özelliği 4: Sıralamayı Sıfırla (Reset)
  const btnResetAll = document.getElementById("btn-admin-reset-all");
  if (btnResetAll) {
    btnResetAll.addEventListener("click", () => {
      const isConfirmed = confirm(
        "DİKKAT: Kiosk üzerindeki tüm liderlik sıralaması sıfırlanacaktır. Devam etmek istiyor musunuz?"
      );

      if (isConfirmed) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(SEED_LEADERBOARD));
        renderLeaderboard(SEED_LEADERBOARD);
        const textarea = document.getElementById("admin-json-textarea");
        if (textarea) {
          textarea.value = JSON.stringify(SEED_LEADERBOARD, null, 2);
        }
        sound.playWarning();
        alert("Sıralama varsayılan başlangıç verilerine sıfırlandı!");
      }
    });
  }

  /**
   * ===========================================================================
   * 13. KONTROLLER (SES VE TAM EKRAN)
   * ===========================================================================
   */
  if (btnSoundToggle) {
    btnSoundToggle.addEventListener("click", () => {
      sound.enabled = !sound.enabled;
      if (sound.enabled) {
        iconSoundOn.classList.remove("hidden");
        iconSoundOff.classList.add("hidden");
        sound.playClick();
      } else {
        iconSoundOn.classList.add("hidden");
        iconSoundOff.classList.remove("hidden");
      }
    });
  }

  if (btnFullscreenToggle) {
    btnFullscreenToggle.addEventListener("click", () => {
      sound.playClick();
      if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen().catch(() => {});
      } else {
        if (document.exitFullscreen) {
          document.exitFullscreen().catch(() => {});
        }
      }
    });
  }

  document.addEventListener("fullscreenchange", () => {
    if (document.fullscreenElement) {
      iconFsEnter.classList.add("hidden");
      iconFsExit.classList.remove("hidden");
    } else {
      iconFsEnter.classList.remove("hidden");
      iconFsExit.classList.add("hidden");
    }
  });

  /**
   * ===========================================================================
   * 14. BAŞLANGIÇ ÇALIŞTIRICISI
   * ===========================================================================
   */
  window.addEventListener("DOMContentLoaded", () => {
    // 1. İlk iş olarak questions.json dosyasını asenkron yükle
    loadQuestionsFromJSON();

    // 2. İlk liderlik tablosunu yükle
    const currentList = getLeaderboard();
    renderLeaderboard(currentList);

    // 3. Kural ve özet kartlarındaki dinamik soru sayılarını güncelle (3 Soru)
    const ruleTitleEl = document.querySelector(".rule-title-cyan");
    if (ruleTitleEl) {
      ruleTitleEl.textContent = "Toplam 3 Soru";
    }
    const ruleDescEl = ruleTitleEl ? ruleTitleEl.nextElementSibling : null;
    if (ruleDescEl) {
      ruleDescEl.innerHTML = `Yapay zeka alanından sırasıyla <strong class="text-accent">Basit (200p)</strong>, <strong class="text-amber">Orta (300p)</strong> ve <strong class="text-pink">Zor (500p)</strong> toplam 3 soru sorulacak.`;
    }
    const statSubEl = resultTotalTime ? resultTotalTime.parentElement?.nextElementSibling : null;
    if (statSubEl && statSubEl.classList.contains("stat-sub")) {
      statSubEl.textContent = "3 soru toplamı";
    }

    // 4. İlk input odağı
    if (inputUserName) {
      inputUserName.focus();
    }
  });

  /**
   * ===========================================================================
   * 15. SİSTEM DOĞRULAMA (SELF-TEST)
   * ===========================================================================
   */
  function runSystemCheck() {
    const pool = QUESTION_POOL;
    const basitCount = pool.filter(q => q.level === "Basit").length;
    const ortaCount = pool.filter(q => q.level === "Orta").length;
    const zorCount = pool.filter(q => q.level === "Zor").length;

    if (basitCount === 6 && ortaCount === 6 && zorCount === 6 && pool.length === 18) {
      console.log(`[YTT Kiosk Test] Sistem OK. Havuz: ${basitCount} Basit, ${ortaCount} Orta, ${zorCount} Zor.`);
      return true;
    } else {
      console.error(
        `[YTT Kiosk Test] Hata: Soru havuzunda eksik veya tutarsızlık var! Bulunan: ${basitCount} Basit, ${ortaCount} Orta, ${zorCount} Zor (Toplam: ${pool.length}). Beklenen: 6 Basit, 6 Orta, 6 Zor (Toplam: 18).`
      );
      return false;
    }
  }

  // Dışarıdan veya konsoldan da tetiklenebilmesi için window nesnesine ekle
  window.runSystemCheck = runSystemCheck;

})();