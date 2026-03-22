function ensureAudio() {
  if (!audioCtx) {
    const AudioAPI = window.AudioContext || window.webkitAudioContext
    if (!AudioAPI) return null
    audioCtx = new AudioAPI()
  }
  if (audioCtx.state === "suspended") audioCtx.resume()
  return audioCtx
}

function playTone(freq, duration, type, volume) {
  if (!soundEnabled) return
  const ctxAudio = ensureAudio()
  if (!ctxAudio) return

  const osc = ctxAudio.createOscillator()
  const gain = ctxAudio.createGain()
  const now = ctxAudio.currentTime

  osc.type = type
  osc.frequency.setValueAtTime(freq, now)
  gain.gain.setValueAtTime(0.0001, now)
  gain.gain.exponentialRampToValueAtTime(volume, now + 0.01)
  gain.gain.exponentialRampToValueAtTime(0.0001, now + duration)

  osc.connect(gain)
  gain.connect(ctxAudio.destination)
  osc.start(now)
  osc.stop(now + duration)
}

function playUISound() {
  playTone(560, 0.08, "square", 0.035)
}

function playHitSound(isHeavy) {
  playTone(isHeavy ? 170 : 230, isHeavy ? 0.12 : 0.08, "triangle", 0.045)
}

function playWinSound() {
  playTone(320, 0.09, "square", 0.04)
  setTimeout(() => playTone(460, 0.12, "square", 0.04), 70)
}

function setSoundButtonState() {
  document.getElementById("sound-on").classList.toggle("active", soundEnabled)
  document.getElementById("sound-off").classList.toggle("active", !soundEnabled)
  const icon = document.getElementById("sound-icon")
  icon.textContent = soundEnabled ? "🔊" : "🔇"
  icon.classList.toggle("muted", !soundEnabled)
}
