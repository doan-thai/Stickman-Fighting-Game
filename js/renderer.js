function drawBackground() {
  ctx.fillStyle = "rgba(0,0,0,0.35)"
  ctx.fillRect(0, GROUND + 20, 900, 10)
  ctx.strokeStyle = "#334"
  ctx.lineWidth = 1
  ctx.beginPath()
  ctx.moveTo(0, GROUND + 20)
  ctx.lineTo(900, GROUND + 20)
  ctx.stroke()
  ctx.fillStyle = "rgba(255,255,255,0.04)"
  for (let i = 0; i < 80; i++) {
    ctx.beginPath()
    ctx.arc((i * 137) % 900, GROUND + 30 + ((i * 73) % 60), 3 + i % 4, 0, Math.PI * 2)
    ctx.fill()
  }
}

function drawShadow(p) {
  ctx.fillStyle = "rgba(0,0,0,0.18)"
  ctx.beginPath()
  ctx.ellipse(p.x, GROUND + 22, 22 * (p.knockdown > 0 ? 0.4 : 1), 5, 0, 0, Math.PI * 2)
  ctx.fill()
}

function toRgbTriplet(hex) {
  if (typeof hex !== "string" || hex[0] !== "#") return "160,220,255"
  let value = hex.slice(1)
  if (value.length === 3) value = value.split("").map(ch => ch + ch).join("")
  if (!/^[0-9a-fA-F]{6}$/.test(value)) return "160,220,255"
  const r = parseInt(value.slice(0, 2), 16)
  const g = parseInt(value.slice(2, 4), 16)
  const b = parseInt(value.slice(4, 6), 16)
  return `${r},${g},${b}`
}

function drawProjectiles() {
  for (const shot of projectiles) {
    const color = toRgbTriplet(shot.color || (shot.owner && shot.owner.color))
    ctx.save()
    ctx.shadowBlur = 18
    ctx.shadowColor = `rgba(${color},0.95)`
    ctx.fillStyle = `rgba(${color},0.9)`
    ctx.beginPath()
    ctx.arc(shot.x, shot.y, shot.radius, 0, Math.PI * 2)
    ctx.fill()
    ctx.shadowBlur = 0
    ctx.strokeStyle = `rgba(255,255,255,0.85)`
    ctx.lineWidth = 1.5
    ctx.beginPath()
    ctx.arc(shot.x, shot.y, shot.radius + 4, 0, Math.PI * 2)
    ctx.stroke()
    ctx.restore()
  }
}

function drawHitEffects() {
  for (const fx of hitEffects) {
    const t = fx.life / fx.maxLife
    const color = toRgbTriplet(fx.color)
    const blastRadius = 8 + (1 - t) * 28

    ctx.save()
    ctx.shadowBlur = 24 * t
    ctx.shadowColor = `rgba(${color},${0.95 * t})`
    ctx.fillStyle = `rgba(255,255,255,${0.5 * t})`
    ctx.beginPath()
    ctx.arc(fx.x, fx.y, 6 + (1 - t) * 10, 0, Math.PI * 2)
    ctx.fill()

    ctx.lineWidth = 2 + t
    ctx.strokeStyle = `rgba(${color},${0.9 * t})`
    ctx.beginPath()
    ctx.arc(fx.x, fx.y, blastRadius, 0, Math.PI * 2)
    ctx.stroke()

    ctx.strokeStyle = `rgba(255,255,255,${0.55 * t})`
    ctx.beginPath()
    ctx.arc(fx.x, fx.y, blastRadius * 0.6, 0, Math.PI * 2)
    ctx.stroke()
    ctx.restore()
  }
}

function drawGhostStick(x, y, dir, color, alpha) {
  const rgb = toRgbTriplet(color)
  ctx.strokeStyle = `rgba(${rgb},${alpha})`
  ctx.lineWidth = 3
  ctx.lineCap = "round"

  ctx.beginPath()
  ctx.arc(x, y - 40, 9, 0, Math.PI * 2)
  ctx.stroke()

  ctx.beginPath()
  ctx.moveTo(x, y - 31)
  ctx.lineTo(x, y)
  ctx.stroke()

  ctx.beginPath()
  ctx.moveTo(x, y - 22)
  ctx.lineTo(x - 12 * dir, y - 8)
  ctx.moveTo(x, y - 22)
  ctx.lineTo(x + 12 * dir, y - 8)
  ctx.stroke()

  ctx.beginPath()
  ctx.moveTo(x, y)
  ctx.lineTo(x - 11, y + 18)
  ctx.moveTo(x, y)
  ctx.lineTo(x + 11, y + 18)
  ctx.stroke()
}

function drawBlinkEffects() {
  for (const fx of blinkEffects) {
    const t = fx.life / fx.maxLife
    const rgb = toRgbTriplet(fx.color)

    ctx.save()
    ctx.lineWidth = 2
    ctx.strokeStyle = `rgba(${rgb},${0.35 * t})`
    ctx.beginPath()
    ctx.moveTo(fx.fromX, fx.y - 20)
    ctx.lineTo(fx.toX, fx.y - 20)
    ctx.stroke()

    drawGhostStick(fx.fromX, fx.y, fx.dir, fx.color, 0.35 * t)
    drawGhostStick(fx.toX, fx.y, fx.dir, fx.color, 0.6 * t)
    ctx.restore()
  }
}

function draw() {
  ctx.clearRect(0, 0, 900, 400)
  drawBackground()
  drawShadow(p1)
  drawShadow(p2)
  drawBlinkEffects()
  drawStick(p1)
  drawStick(p2)
  drawProjectiles()
  drawHitEffects()

  document.getElementById("hp1-bar").style.width = (Math.max(0, p1.hp) / startingHp * 100) + "%"
  document.getElementById("hp2-bar").style.width = (Math.max(0, p2.hp) / startingHp * 100) + "%"
  const scoreEl = document.getElementById("score-display")
  if (mode === 2) {
    scoreEl.classList.remove("hidden")
    scoreEl.textContent = `${score.p1} — ${score.p2}`
  } else {
    scoreEl.classList.add("hidden")
  }

  if (gameOver) {
    const t = Math.min(gameOverTimer / 40, 1)
    ctx.fillStyle = `rgba(0,0,0,${0.72 * t})`
    ctx.fillRect(0, 0, 900, 400)
    const slideY = 160 + (1 - t) * (-60)
    const isP1 = gameOverWinner === "PLAYER 1"
    ctx.save()
    ctx.shadowColor = isP1 ? "#4af" : "#f64"
    ctx.shadowBlur = 40 * t
    ctx.font = `bold ${Math.round(80 * t)}px 'Black Ops One',cursive`
    ctx.fillStyle = `rgba(255,220,0,${t})`
    ctx.textAlign = "center"
    ctx.fillText("K.O.", 450, slideY)
    ctx.font = `bold ${Math.round(32 * t)}px 'Black Ops One',cursive`
    ctx.fillStyle = isP1 ? `rgba(68,170,255,${t})` : `rgba(255,100,50,${t})`
    const resultText = gameOverWinner === "DRAW" ? "DRAW!" : `${gameOverWinner} WINS!`
    ctx.fillText(resultText, 450, slideY + 58)
    ctx.restore()
    if (gameOverTimer > 60) {
      const blink = Math.floor(gameOverTimer / 20) % 2 === 0
      ctx.font = "14px 'Share Tech Mono',monospace"
      ctx.fillStyle = blink ? "rgba(255,255,255,0.8)" : "rgba(255,255,255,0.3)"
      ctx.textAlign = "center"
      ctx.fillText("PRESS RESTART TO PLAY AGAIN", 450, slideY + 100)
      if (mode === 2) {
        ctx.font = "bold 18px 'Black Ops One',cursive"
        ctx.fillStyle = "rgba(255,255,255,0.9)"
        ctx.fillText(`SCORE  ${score.p1} - ${score.p2}`, 450, slideY + 128)
      }
    }
  }
}
