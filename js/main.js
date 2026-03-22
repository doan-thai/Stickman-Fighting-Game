document.addEventListener("keydown", e => {
  keys[e.code] = true
  if (GAME_KEYS.has(e.code)) e.preventDefault()
}, { passive: false })

document.addEventListener("keyup", e => {
  keys[e.code] = false
})

function initSettingsUI() {
  const soundOnBtn = document.getElementById("sound-on")
  const soundOffBtn = document.getElementById("sound-off")
  const healthSlider = document.getElementById("health-slider")
  const timeSelect = document.getElementById("time-limit")
  const startBtn = document.getElementById("btn-start")
  const aboutBtn = document.getElementById("btn-about")
  const langViBtn = document.getElementById("lang-vi")
  const langEnBtn = document.getElementById("lang-en")
  const aboutBackBtn = document.getElementById("btn-about-back")
  const restartBtn = document.getElementById("btn-restart")
  const openSettingsBtn = document.getElementById("btn-open-settings")

  soundOnBtn.addEventListener("click", () => {
    ensureAudio()
    soundEnabled = true
    setSoundButtonState()
    playUISound()
  })

  soundOffBtn.addEventListener("click", () => {
    soundEnabled = false
    setSoundButtonState()
  })

  healthSlider.addEventListener("input", e => {
    healthPercent = Math.max(50, Math.min(150, parseInt(e.target.value, 10)))
    updateHealthLabel()
    playUISound()
  })

  timeSelect.addEventListener("change", e => {
    timeLimit = parseInt(e.target.value, 10)
    timeLeft = timeLimit
    updateTimerLabel()
    playUISound()
  })

  startBtn.addEventListener("click", () => {
    ensureAudio()
    applySettings()
    resetGame()
    showGameScreen()
    settingsNote.textContent = ""
    playUISound()
  })

  aboutBtn.addEventListener("click", () => {
    playUISound()
    showAbout()
  })

  langViBtn.addEventListener("click", () => {
    applyLanguage("vi")
    playUISound()
  })

  langEnBtn.addEventListener("click", () => {
    applyLanguage("en")
    playUISound()
  })

  aboutBackBtn.addEventListener("click", () => {
    playUISound()
    showSettingsScreen()
  })

  restartBtn.addEventListener("click", () => {
    applySettings()
    resetGame()
    showGameScreen()
    playUISound()
  })

  openSettingsBtn.addEventListener("click", () => {
    playUISound()
    showSettingsScreen()
  })

  setSoundButtonState()
  updateHealthLabel()
  updateTimerLabel()
  applyLanguage(currentLanguage)
}

function resetGame() {
  p1 = createPlayer(200, "#4af")
  p2 = createPlayer(700, "#f64")
  ai = createAI()
  gameOver = false
  gameOverWinner = ""
  gameOverTimer = 0
  timeLeft = timeLimit
  updateTimerLabel()
}

function loop() {
  const now = performance.now()
  const dt = Math.min((now - lastTime) / 1000, 0.05)
  lastTime = now
  update(dt)
  draw()
  requestAnimationFrame(loop)
}

document.addEventListener("visibilitychange", () => {
  if (!document.hidden) lastTime = performance.now()
})

initSettingsUI()
applySettings()
resetGame()
loop()
