function attack(atk, def, range, damage, knock) {
  if (def.knockdown > 0) return false
  const dist = def.x - atk.x
  if (Math.abs(dist) < range && Math.sign(dist) === atk.dir) {
    if (Math.abs(atk.y - def.y) > 50) return false
    def.hit = 6
    def.hitCount++
    def.hitTimer = 130
    let dmg = damage
    if (def.block) dmg *= 0.25
    def.hp -= dmg
    playHitSound(atk.attack === 2)
    if (atk.attack === 2 && !def.block) {
      def.knee = 90
      def.kneeMax = 90
    }
    if (!def.block && def.hitCount >= 3) {
      def.knockdown = 70
      def.hitCount = 0
    }
    const kn = def.block ? knock * 0.3 : knock
    if (def.x > atk.x) def.x += kn
    else def.x -= kn
    return true
  }
  return false
}

function update(dt) {
  if (!gameStarted) return
  if (gameOver) { gameOverTimer++; return }

  timeLeft = Math.max(0, timeLeft - dt)
  updateTimerLabel()

  if (timeLeft <= 0) {
    gameOver = true
    if (p1.hp === p2.hp) gameOverWinner = "DRAW"
    else gameOverWinner = p1.hp > p2.hp ? "PLAYER 1" : "PLAYER 2"
    gameOverTimer = 0
    if (mode === 2) {
      if (gameOverWinner === "PLAYER 1") score.p1++
      else if (gameOverWinner === "PLAYER 2") score.p2++
    }
    return
  }

  p1.dir = p1.x < p2.x ? 1 : -1
  p2.dir = p2.x < p1.x ? 1 : -1

  for (const p of [p1, p2]) {
    if (p.cooldown > 0) p.cooldown--
    if (p.knockdown > 0) p.knockdown--
    if (p.knee > 0) p.knee--
    if (p.hitTimer > 0) p.hitTimer--
    if (p.hitTimer === 0) p.hitCount = 0
    if (p.hit > 0) p.hit--
    if (p.attackTimer > 0) {
      p.attackTimer--
      if (p.attackTimer === 0) p.attack = 0
    }
  }

  if (p1.knockdown === 0) {
    const kneeled = p1.knee > 0
    if (!kneeled) {
      let moving = false
      if (keys["KeyA"]) { p1.x -= 4; moving = true }
      if (keys["KeyD"]) { p1.x += 4; moving = true }
      if (moving) p1.walk += 0.2
      if (keys["KeyW"] && p1.vy === 0) p1.vy = -10
    } else {
      if (keys["KeyA"]) p1.x -= 1.5
      if (keys["KeyD"]) p1.x += 1.5
    }
    p1.block = keys["KeyU"]
    if (!p1.block && keys["KeyI"] && p1.attackTimer === 0 && p1.cooldown === 0) {
      p1.attack = 1; p1.attackTimer = 6; p1.cooldown = 20
      attack(p1, p2, 65, 7, 10)
    }
    if (!p1.block && !kneeled && keys["KeyO"] && p1.attackTimer === 0 && p1.cooldown === 0) {
      p1.attack = 2; p1.attackTimer = 10; p1.cooldown = 35
      attack(p1, p2, 95, 12, 18)
    }
  }

  if (mode === 2) {
    if (p2.knockdown === 0) {
      const kneeled = p2.knee > 0
      if (!kneeled) {
        let moving = false
        if (keys["ArrowLeft"]) { p2.x -= 4; moving = true }
        if (keys["ArrowRight"]) { p2.x += 4; moving = true }
        if (moving) p2.walk += 0.2
        if (keys["ArrowUp"] && p2.vy === 0) p2.vy = -10
      } else {
        if (keys["ArrowLeft"]) p2.x -= 1.5
        if (keys["ArrowRight"]) p2.x += 1.5
      }
      p2.block = keys["Numpad4"]
      if (!p2.block && keys["Numpad5"] && p2.attackTimer === 0 && p2.cooldown === 0) {
        p2.attack = 1; p2.attackTimer = 6; p2.cooldown = 20
        attack(p2, p1, 65, 7, 10)
      }
      if (!p2.block && !kneeled && keys["Numpad6"] && p2.attackTimer === 0 && p2.cooldown === 0) {
        p2.attack = 2; p2.attackTimer = 10; p2.cooldown = 35
        attack(p2, p1, 95, 12, 18)
      }
    }
  } else {
    if (p2.knockdown === 0) updateAI()
  }

  physics(p1)
  physics(p2)

  if (!gameOver && (p1.hp <= 0 || p2.hp <= 0)) {
    p1.hp = Math.max(0, p1.hp)
    p2.hp = Math.max(0, p2.hp)
    gameOver = true
    gameOverWinner = p1.hp <= 0 ? "PLAYER 2" : "PLAYER 1"
    gameOverTimer = 0
    if (mode === 2) {
      if (gameOverWinner === "PLAYER 1") score.p1++
      else if (gameOverWinner === "PLAYER 2") score.p2++
    }
    playWinSound()
  }
}
