function setMode(m) {
  mode = m
  document.getElementById("btn1").classList.toggle("active", m === 1)
  document.getElementById("btn2").classList.toggle("active", m === 2)
}

window.setMode = setMode

function updateTimerLabel() {
  document.getElementById("timer-display").textContent = `${Math.ceil(timeLeft)}`
}

function updateHealthLabel() {
  document.getElementById("health-value").textContent = `${healthPercent}%`
}

function applyLanguage(lang) {
  currentLanguage = lang
  const t = i18n[lang]

  document.querySelectorAll("h1").forEach(el => el.textContent = t.title)
  document.querySelector(".settings-title").textContent = t.setupTitle

  document.getElementById("label-sound").textContent = t.labelSound
  document.getElementById("label-health").textContent = t.labelHealth
  document.getElementById("label-time").textContent = t.labelTime
  document.getElementById("label-mode").textContent = t.labelMode
  document.getElementById("label-language").textContent = t.labelLanguage

  document.getElementById("btn-start").textContent = t.btnStart
  document.getElementById("btn-about").textContent = t.btnAbout
  document.getElementById("btn-restart").textContent = t.btnRestart
  document.getElementById("btn-open-settings").textContent = t.btnBack
  document.getElementById("btn-about-back").textContent = t.btnBackSetup
  document.getElementById("btn1").textContent = t.mode1
  document.getElementById("btn2").textContent = t.mode2
  document.getElementById("lang-vi").textContent = t.langVi
  document.getElementById("lang-en").textContent = t.langEn

  const timeSelect = document.getElementById("time-limit")
  timeSelect.options[0].text = t.sec30
  timeSelect.options[1].text = t.sec60
  timeSelect.options[2].text = t.sec90
  timeSelect.options[3].text = t.sec120

  document.querySelector(".about-title").textContent = t.aboutTitle
  document.querySelector(".about-desc").textContent = t.aboutDesc

  const guideTitles = document.querySelectorAll(".guide-card h3")
  guideTitles[0].textContent = t.guide1Title
  guideTitles[1].textContent = t.guide2Title
  guideTitles[2].textContent = t.guide3Title
  guideTitles[3].textContent = t.guide4Title

  const guideLines = document.querySelectorAll(".guide-card .guide-lines div")
  guideLines[0].textContent = t.guide1Line1
  guideLines[1].textContent = t.guide1Line2
  guideLines[2].textContent = t.guide1Line3
  guideLines[3].textContent = t.guide2Line1
  guideLines[4].textContent = t.guide2Line2
  guideLines[5].textContent = t.guide2Line3
  guideLines[6].textContent = t.guide3Line1
  guideLines[7].textContent = t.guide3Line2
  guideLines[8].textContent = t.guide3Line3
  guideLines[9].textContent = t.guide4Line1
  guideLines[10].textContent = t.guide4Line2
  guideLines[11].textContent = t.guide4Line3

  document.getElementById("lang-vi").classList.toggle("active", lang === "vi")
  document.getElementById("lang-en").classList.toggle("active", lang === "en")
}

function applySettings() {
  healthPercent = Math.max(50, Math.min(150, healthPercent))
  startingHp = Math.max(20, Math.round(BASE_HP * healthPercent / 100))
  timeLeft = timeLimit
  updateTimerLabel()
}

function showAbout() {
  gameStarted = false
  keys = {}
  settingsScreen.classList.add("hidden")
  gameScreen.classList.add("hidden")
  aboutScreen.classList.remove("hidden")
}

function showSettingsScreen() {
  gameStarted = false
  keys = {}
  score = { p1: 0, p2: 0 }
  settingsScreen.classList.remove("hidden")
  gameScreen.classList.add("hidden")
  aboutScreen.classList.add("hidden")
  settingsNote.textContent = ""
}

function showGameScreen() {
  gameStarted = true
  settingsScreen.classList.add("hidden")
  aboutScreen.classList.add("hidden")
  gameScreen.classList.remove("hidden")
  lastTime = performance.now()
}
