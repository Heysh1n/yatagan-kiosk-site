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
   * 1. VERİ MODELİ VE 3 SEVİYELİ SORULAR (Basit: 200p, Orta: 300p, Zor: 500p)
   * Toplam 12 Adet Yapay Zeka Okuryazarlığı Sorusu (4 Basit, 4 Orta, 4 Zor)
   * ===========================================================================
   */
  const QUIZ_QUESTIONS = [
    // --- BASİT SEVİYE (4 Adet • 200 Puan) ---
    {
      id: 1,
      level: "Basit",
      points: 200,
      badgeText: "BASİT • 200 PUAN",
      question: "Büyük Dil Modellerinin (LLM) gerçekte var olmayan bilgileri son derece ikna edici ve kendinden emin bir dille uydurması olayına ne ad verilir?",
      options: [
        { key: "A", text: "Overfitting (Aşırı Uyum)" },
        { key: "B", text: "Halüsinasyon (Hallucination)" },
        { key: "C", text: "Tokenizasyon (Tokenization)" },
        { key: "D", text: "Parametre Kayması (Model Drift)" }
      ],
      correctKey: "B"
    },
    {
      id: 2,
      level: "Basit",
      points: 200,
      badgeText: "BASİT • 200 PUAN",
      question: "Üretken yapay zeka modellerine (ChatGPT, Gemini vb.) istenen çıktıyı ürettirmek için verilen yazılı talimat veya yönlendirmelere ne ad verilir?",
      options: [
        { key: "A", text: "Prompt (İstem)" },
        { key: "B", text: "Algoritma" },
        { key: "C", text: "Derleyici (Compiler)" },
        { key: "D", text: "Kernel (Çekirdek)" }
      ],
      correctKey: "A"
    },
    {
      id: 3,
      level: "Basit",
      points: 200,
      badgeText: "BASİT • 200 PUAN",
      question: "Mevcut bir görüntü, ses veya videodaki kişinin yapay zeka algoritmaları kullanılarak başka biriyle gerçekçi şekilde değiştirilmesine ne ad verilir?",
      options: [
        { key: "A", text: "Phishing (Oltalama)" },
        { key: "B", text: "Ransomware (Fidye Yazılımı)" },
        { key: "C", text: "Deepfake (Derin Sahte)" },
        { key: "D", text: "Firewall (Güvenlik Duvarı)" }
      ],
      correctKey: "C"
    },
    {
      id: 4,
      level: "Basit",
      points: 200,
      badgeText: "BASİT • 200 PUAN",
      question: "Bir yapay zeka modelinin, etiketlenmiş girdi verileri ve bunlara karşılık gelen doğru çıktılar üzerinden eğitilmesine ne ad verilir?",
      options: [
        { key: "A", text: "Denetimli Öğrenme (Supervised Learning)" },
        { key: "B", text: "Denetimsiz Öğrenme (Unsupervised Learning)" },
        { key: "C", text: "Pekiştirmeli Öğrenme (Reinforcement Learning)" },
        { key: "D", text: "Kendi Kendine Denetimli Öğrenme (Self-Supervised)" }
      ],
      correctKey: "A"
    },

    // --- ORTA SEVİYE (4 Adet • 300 Puan) ---
    {
      id: 5,
      level: "Orta",
      points: 300,
      badgeText: "ORTA • 300 PUAN",
      question: "Bir yapay zeka modeline herhangi bir eğitim örneği vermeden, yalnızca görevi tanımlayarak doğrudan çıktı üretmesini sağlayan istem (prompt) tekniğine ne ad verilir?",
      options: [
        { key: "A", text: "Few-Shot Prompting" },
        { key: "B", text: "Fine-Tuning (İnce Ayar)" },
        { key: "C", text: "Zero-Shot Prompting" },
        { key: "D", text: "Chain of Thought (Düşünce Zinciri)" }
      ],
      correctKey: "C"
    },
    {
      id: 6,
      level: "Orta",
      points: 300,
      badgeText: "ORTA • 300 PUAN",
      question: "Büyük Dil Modellerinin harici bilgi kaynaklarına ve güncel belgelere erişerek yanıt üretmesini sağlayan ve halüsinasyonu azaltan mimariye ne ad verilir?",
      options: [
        { key: "A", text: "RAG (Retrieval-Augmented Generation)" },
        { key: "B", text: "GAN (Generative Adversarial Network)" },
        { key: "C", text: "RNN (Recurrent Neural Network)" },
        { key: "D", text: "CNN (Convolutional Neural Network)" }
      ],
      correctKey: "A"
    },
    {
      id: 7,
      level: "Orta",
      points: 300,
      badgeText: "ORTA • 300 PUAN",
      question: "Bir makine öğrenimi modelinin eğitim verilerini ezberleyerek yeni ve görülmemiş test verileri üzerinde başarısız olması durumuna ne ad verilir?",
      options: [
        { key: "A", text: "Underfitting (Yetersiz Uyum)" },
        { key: "B", text: "Overfitting (Aşırı Uyum)" },
        { key: "C", text: "Data Augmentation (Veri Çoğaltma)" },
        { key: "D", text: "Feature Scaling (Özellik Ölçekleme)" }
      ],
      correctKey: "B"
    },
    {
      id: 8,
      level: "Orta",
      points: 300,
      badgeText: "ORTA • 300 PUAN",
      question: "Bir makinenin insanla ayırt edilemeyecek düzeyde zeki davranış sergileyip sergileyemediğini ölçmeyi amaçlayan klasik test hangisidir?",
      options: [
        { key: "A", text: "Voight-Kampff Testi" },
        { key: "B", text: "Turing Testi" },
        { key: "C", text: "CAPTCHA Doğrulaması" },
        { key: "D", text: "Lovelace Testi" }
      ],
      correctKey: "B"
    },

    // --- ZOR SEVİYE (4 Adet • 500 Puan) ---
    {
      id: 9,
      level: "Zor",
      points: 500,
      badgeText: "ZOR • 500 PUAN",
      question: "ChatGPT ve benzeri modern üretken yapay zekaların temelini oluşturan Transformer mimarisinde, girdideki kelimelerin birbirleriyle anlamsal ilişkisini eş zamanlı hesaplayan kilit mekanizma hangisidir?",
      options: [
        { key: "A", text: "Self-Attention (Öz-Dikkat) Mekanizması" },
        { key: "B", text: "Convolutional Layer (Evrişim Katmanı)" },
        { key: "C", text: "Backpropagation (Geriye Yayılım)" },
        { key: "D", text: "Recurrent Memory Unit (Tekrarlayan Bellek)" }
      ],
      correctKey: "A"
    },
    {
      id: 10,
      level: "Zor",
      points: 500,
      badgeText: "ZOR • 500 PUAN",
      question: "Büyük Dil Modellerini insan tercihleri ve güvenlik ilkeleriyle hizalamak (alignment) amacıyla insan geri bildirimlerinden yararlanılarak uygulanan yöntem hangisidir?",
      options: [
        { key: "A", text: "RLHF (Reinforcement Learning from Human Feedback)" },
        { key: "B", text: "Quantization (Kuantalama)" },
        { key: "C", text: "Model Pruning (Ağırlık Budama)" },
        { key: "D", text: "Knowledge Distillation (Bilgi Damıtma)" }
      ],
      correctKey: "A"
    },
    {
      id: 11,
      level: "Zor",
      points: 500,
      badgeText: "ZOR • 500 PUAN",
      question: "Doğal Dil İşleme alanında kelimelerin veya metin parçalarının anlamsal özelliklerini çok boyutlu bir uzayda sayısal diziler olarak temsil eden yapıya ne ad verilir?",
      options: [
        { key: "A", text: "Hash Map (Özet Tablosu)" },
        { key: "B", text: "Vektör Gömme (Vector Embedding)" },
        { key: "C", text: "One-Hot Encoding" },
        { key: "D", text: "B-Tree İndeksleme" }
      ],
      correctKey: "B"
    },
    {
      id: 12,
      level: "Zor",
      points: 500,
      badgeText: "ZOR • 500 PUAN",
      question: "Bir Büyük Dil Modelinin (LLM) tek bir oturumda veya istemde girdi ve çıktı olarak aynı anda hafızasında tutabildiği maksimum belirteç (token) kapasitesine ne ad verilir?",
      options: [
        { key: "A", text: "Batch Size (Grup Boyutu)" },
        { key: "B", text: "Latent Space (Gizil Uzay)" },
        { key: "C", text: "Bağlam Penceresi (Context Window)" },
        { key: "D", text: "Temperature (Sıcaklık Parametresi)" }
      ],
      correctKey: "C"
    }
  ];

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
   * 5. EKRAN YÖNETİMİ (STATE MACHINE)
   * ===========================================================================
   */
  function showScreen(screenKey) {
    Object.keys(screens).forEach(key => {
      if (key === screenKey) {
        screens[key].classList.add("active");
      } else {
        screens[key].classList.remove("active");
      }
    });
    window.scrollTo(0, 0);
  }

  /**
   * ===========================================================================
   * 6. LOGO HATASI FALLBACK & 3-CLICK ADMIN TETİKLEYİCİSİ
   * ===========================================================================
   */
  // Global Fallback Handler (logo.png yüklenemezse düzen bozulmaz)
  window.handleLogoError = function (imgElement) {
    imgElement.style.display = 'none';
    const fallbackEl = document.getElementById("kiosk-logo-fallback");
    if (fallbackEl) {
      fallbackEl.classList.remove("hidden");
    }
  };

  // Dokunmatik Ekranlar İçin: Logoya 3 Kez Tıklama ile Admin Paneli Açma
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
   * 7. EKRAN 1: KARŞILAMA VE GİRİŞ
   * ===========================================================================
   */
  function handleWelcomeNext() {
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

  btnWelcomeNext.addEventListener("click", handleWelcomeNext);
  inputUserName.addEventListener("keydown", (e) => {
    if (e.key === "Enter") handleWelcomeNext();
  });

  /**
   * ===========================================================================
   * 8. EKRAN 2: BİLGİLENDİRME VE BAŞLATMA
   * ===========================================================================
   */
  btnInfoBack.addEventListener("click", () => {
    sound.playClick();
    showScreen("welcome");
  });

  btnStartQuiz.addEventListener("click", () => {
    sound.playClick();
    startQuiz();
  });

  /**
   * ===========================================================================
   * 9. EKRAN 3: YARIŞMA SÜRECİ, GERİ SAYIM & SHUFFLE ALGORİTMASI
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

  function startQuiz() {
    state.currentQuestionIndex = 0;
    state.userAnswers = [];
    state.totalRawPoints = 0;
    state.totalTimeSpent = 0;
    state.currentEntry = null;

    quizUserName.textContent = state.userName;
    showScreen("quiz");
    loadQuestion(0);
  }

  function loadQuestion(index) {
    if (index >= QUIZ_QUESTIONS.length) {
      finishQuiz();
      return;
    }

    const q = QUIZ_QUESTIONS[index];
    state.currentQuestionIndex = index;
    state.isAnsweringLocked = false;
    state.remainingSeconds = SECONDS_PER_QUESTION;

    // Rozetler ve İlerleme
    quizQuestionBadge.textContent = `SORU ${index + 1} / ${QUIZ_QUESTIONS.length}`;
    quizDifficultyBadge.textContent = q.badgeText;
    quizTotalProgress.style.width = `${((index + 1) / QUIZ_QUESTIONS.length) * 100}%`;

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

    const q = QUIZ_QUESTIONS[state.currentQuestionIndex];
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

    const q = QUIZ_QUESTIONS[state.currentQuestionIndex];
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
   * 10. EKRAN 4: SONUÇ VE LİDERLİK TABLOSU
   * ===========================================================================
   */
  function finishQuiz() {
    sound.playVictory();
    showScreen("leaderboard");

    const correctCount = state.userAnswers.filter(a => a.isCorrect).length;
    const safeTime = Math.max(1.0, state.totalTimeSpent);
    
    // FORMÜL: Nihai Skor = Kazanılan Toplam Ham Puan / Harcanan Toplam Süre (Saniye)
    const calculatedScore = parseFloat((state.totalRawPoints / safeTime).toFixed(2));

    resultUserName.textContent = state.userName;
    resultFinalScore.textContent = calculatedScore.toFixed(2);
    resultCorrectCount.textContent = correctCount;
    if (resultCorrectCount && resultCorrectCount.parentElement) {
      resultCorrectCount.parentElement.innerHTML = `<span id="result-correct-count" class="text-success">${correctCount}</span> / ${QUIZ_QUESTIONS.length} Doğru`;
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
          // Eski test/fantom verilerini temizle
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
        <td class="td-correct">${item.correct}/${QUIZ_QUESTIONS.length}</td>
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
  btnNewParticipant.addEventListener("click", () => {
    sound.playClick();
    clearInterval(state.timerInterval);
    state.userName = "";
    inputUserName.value = "";
    nameErrorMsg.classList.add("hidden");
    showScreen("welcome");
    setTimeout(() => {
      inputUserName.focus();
    }, 200);
  });

  /**
   * ===========================================================================
   * 11. KİOSK ADMİN PANELİ & JSON YÖNETİMİ (MODAL OVERLAY - DEFENSIVE CONTROLLER)
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
      if (isNaN(correct) || correct < 0 || correct > QUIZ_QUESTIONS.length) {
        alert(`Doğru sayısı 0 ile ${QUIZ_QUESTIONS.length} arasında bir değer olmalıdır!`);
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
   * 12. KONTROLLER (SES VE TAM EKRAN)
   * ===========================================================================
   */
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
   * 13. BAŞLANGIÇ ÇALIŞTIRICISI
   * ===========================================================================
   */
  window.addEventListener("DOMContentLoaded", () => {
    // İlk liderlik tablosunu yükle
    const currentList = getLeaderboard();
    renderLeaderboard(currentList);

    // Kural ve özet kartlarındaki dinamik soru sayılarını güncelle
    const ruleTitleEl = document.querySelector(".rule-title-cyan");
    if (ruleTitleEl) {
      ruleTitleEl.textContent = `Toplam ${QUIZ_QUESTIONS.length} Soru`;
    }
    const ruleDescEl = ruleTitleEl ? ruleTitleEl.nextElementSibling : null;
    if (ruleDescEl) {
      ruleDescEl.innerHTML = `Yapay zeka alanından sırasıyla <strong class="text-accent">Basit (200p)</strong>, <strong class="text-amber">Orta (300p)</strong> ve <strong class="text-pink">Zor (500p)</strong> toplam ${QUIZ_QUESTIONS.length} soru sorulacak.`;
    }
    const statSubEl = resultTotalTime ? resultTotalTime.parentElement?.nextElementSibling : null;
    if (statSubEl && statSubEl.classList.contains("stat-sub")) {
      statSubEl.textContent = `${QUIZ_QUESTIONS.length} soru toplamı`;
    }

    // İlk input odağı
    if (inputUserName) {
      inputUserName.focus();
    }
  });

})();