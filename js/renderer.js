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

function draw() {
  ctx.clearRect(0, 0, 900, 400)
  drawBackground()
  drawShadow(p1)
  drawShadow(p2)
  drawStick(p1)
  drawStick(p2)

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
