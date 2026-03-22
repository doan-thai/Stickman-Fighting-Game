function createPlayer(x, col) {
  return {
    x, y: GROUND, vy: 0,
    hp: startingHp,
    attack: 0, attackTimer: 0, cooldown: 0,
    block: false,
    hit: 0, hitCount: 0, hitTimer: 0,
    knockdown: 0,
    knee: 0, kneeMax: 0,
    dir: 1, walk: 0,
    color: col
  }
}

function physics(p) {
  if (p.knockdown > 0) { p.vy = 0; return }
  p.vy += 0.55
  p.y += p.vy
  if (p.y >= GROUND) { p.y = GROUND; p.vy = 0 }
  if (p.x < 20) p.x = 20
  if (p.x > 880) p.x = 880
}

function drawStick(p) {
  const c = p.hit ? "#ff0" : p.color
  ctx.strokeStyle = c
  ctx.lineWidth = 3.5
  ctx.lineCap = "round"

  if (p.knockdown > 0) {
    ctx.beginPath()
    ctx.moveTo(p.x - 25, p.y + 2)
    ctx.lineTo(p.x + 15, p.y + 2)
    ctx.stroke()
    ctx.beginPath()
    ctx.arc(p.x + 25, p.y - 6, 9, 0, Math.PI * 2)
    ctx.stroke()
    ctx.beginPath()
    ctx.moveTo(p.x, p.y)
    ctx.lineTo(p.x - 5, p.y - 12)
    ctx.moveTo(p.x + 5, p.y)
    ctx.lineTo(p.x + 10, p.y - 10)
    ctx.stroke()
    return
  }

  const bodyOffset = 0

  ctx.beginPath()
  ctx.arc(p.x, p.y - 40 + bodyOffset, 10, 0, Math.PI * 2)
  ctx.stroke()

  ctx.beginPath()
  ctx.moveTo(p.x, p.y - 30 + bodyOffset)
  ctx.lineTo(p.x, p.y)
  ctx.stroke()

  ctx.beginPath()
  if (p.block) {
    ctx.moveTo(p.x, p.y - 22 + bodyOffset)
    ctx.lineTo(p.x + 18 * p.dir, p.y - 36 + bodyOffset)
    ctx.moveTo(p.x, p.y - 10 + bodyOffset)
    ctx.lineTo(p.x + 18 * p.dir, p.y - 24 + bodyOffset)
  } else if (p.attack === 1) {
    ctx.moveTo(p.x, p.y - 20 + bodyOffset)
    ctx.lineTo(p.x + 38 * p.dir, p.y - 20 + bodyOffset)
    ctx.moveTo(p.x, p.y - 22 + bodyOffset)
    ctx.lineTo(p.x - 12 * p.dir, p.y - 10 + bodyOffset)
  } else if (p.attack === 2) {
    ctx.moveTo(p.x, p.y - 20 + bodyOffset)
    ctx.lineTo(p.x - 14 * p.dir, p.y - 10 + bodyOffset)
    ctx.moveTo(p.x, p.y - 20 + bodyOffset)
    ctx.lineTo(p.x + 14 * p.dir, p.y - 10 + bodyOffset)
  } else {
    ctx.moveTo(p.x, p.y - 22 + bodyOffset)
    ctx.lineTo(p.x - 13 * p.dir, p.y - 8 + bodyOffset)
    ctx.moveTo(p.x, p.y - 22 + bodyOffset)
    ctx.lineTo(p.x + 13 * p.dir, p.y - 8 + bodyOffset)
  }
  ctx.stroke()

  ctx.beginPath()

  if (p.knee > 0) {
    const prog = Math.min(1, 1 - (p.knee / p.kneeMax))
    const sinkY = p.y + prog * 12
    const headY = sinkY - 40 + prog * 12

    ctx.arc(p.x, headY, 10, 0, Math.PI * 2)
    ctx.stroke()
    ctx.beginPath()
    ctx.moveTo(p.x, headY + 10)
    ctx.lineTo(p.x, sinkY)
    ctx.stroke()

    ctx.beginPath()
    if (p.block) {
      ctx.moveTo(p.x, sinkY - 14)
      ctx.lineTo(p.x + 18 * p.dir, sinkY - 28)
      ctx.moveTo(p.x, sinkY - 5)
      ctx.lineTo(p.x + 18 * p.dir, sinkY - 18)
    } else {
      ctx.moveTo(p.x, sinkY - 14)
      ctx.lineTo(p.x + 14 * p.dir, sinkY - 4)
      ctx.moveTo(p.x, sinkY - 14)
      ctx.lineTo(p.x - 10 * p.dir, sinkY - 22)
    }
    ctx.stroke()

    ctx.beginPath()
    const kneeAngle = prog * (Math.PI * 0.5)
    ctx.moveTo(p.x, sinkY)
    ctx.lineTo(p.x - 8 * p.dir + Math.cos(kneeAngle) * 4, sinkY + 10 + Math.sin(kneeAngle) * 10)
    ctx.moveTo(p.x, sinkY)
    ctx.lineTo(p.x + 6 * p.dir, sinkY + 18 - prog * 10)
    ctx.stroke()
    return
  }

  if (p.attack === 2) {
    ctx.moveTo(p.x, p.y)
    ctx.lineTo(p.x - 10 * p.dir, p.y + 20)
    ctx.moveTo(p.x, p.y)
    ctx.lineTo(p.x + 42 * p.dir, p.y - 5)
  } else {
    const step = Math.sin(p.walk) * 9
    ctx.moveTo(p.x, p.y)
    ctx.lineTo(p.x - 12 + step, p.y + 20)
    ctx.moveTo(p.x, p.y)
    ctx.lineTo(p.x + 12 - step, p.y + 20)
  }
  ctx.stroke()
}
