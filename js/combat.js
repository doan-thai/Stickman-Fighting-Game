const KNOCKDOWN_HITS_REQUIRED = 5
const KNOCKDOWN_FRAMES = 35
const KICK_STAGGER_FRAMES = 60
const SPECIAL_INPUT_WINDOW_MS = 320
const SPECIAL_COOLDOWN_FRAMES = 180
const BLINK_COOLDOWN_FRAMES = 90
const BLINK_DISTANCE = 120

function applyHit(atk, def, damage, knock, isHeavy, applyKickStagger) {
  if (def.knockdown > 0) return false
  def.hit = 6
  def.hitTimer = 130

  let dmg = damage
  if (def.block) {
    dmg *= 0.25
    def.hitCount = 0
  } else {
    def.hitCount++
    if (def.hitCount >= KNOCKDOWN_HITS_REQUIRED) {
      def.knockdown = KNOCKDOWN_FRAMES
      def.hitCount = 0
    }
  }

  def.hp -= dmg
  playHitSound(isHeavy)

  if (applyKickStagger && !def.block) {
    def.knee = KICK_STAGGER_FRAMES
    def.kneeMax = KICK_STAGGER_FRAMES
  }

  const kn = def.block ? knock * 0.3 : knock
  if (def.x > atk.x) def.x += kn
  else def.x -= kn
  return true
}

function attack(atk, def, range, damage, knock) {
  const dist = def.x - atk.x
  if (Math.abs(dist) < range && Math.sign(dist) === atk.dir) {
    if (Math.abs(atk.y - def.y) > 50) return false
    return applyHit(atk, def, damage, knock, atk.attack === 2, atk.attack === 2)
  }
  return false
}

function processSpecialSequence(player, code, firstKey, secondKey, now) {
  if (code === firstKey) {
    player.specialSeqStep = 1
    player.specialSeqAt = now
    return
  }
  if (code === secondKey) {
    if (
      player.specialSeqStep === 1 &&
      now - player.specialSeqAt <= SPECIAL_INPUT_WINDOW_MS
    ) {
      player.specialQueued = true
      player.specialSeqAt = now
    }
    player.specialSeqStep = 0
    return
  }
  if (code !== secondKey) player.specialSeqStep = 0
}

function registerInput(code) {
  if (!gameStarted || gameOver || !p1 || !p2) return
  const now = performance.now()
  processSpecialSequence(p1, code, "KeyU", "KeyI", now)
  if (mode === 2) processSpecialSequence(p2, code, "Numpad4", "Numpad5", now)
  if (code === "KeyL") p1.blinkQueued = true
  if (code === "Numpad3") p2.blinkQueued = true
}

function launchEnergyShot(attacker, defender) {
  if (!attacker || !defender) return false
  if (attacker.specialCooldown > 0 || attacker.attackTimer > 0 || attacker.knockdown > 0) return false
  attacker.specialCooldown = SPECIAL_COOLDOWN_FRAMES
  attacker.specialQueued = false
  attacker.attack = 3
  attacker.attackTimer = 12
  attacker.cooldown = Math.max(attacker.cooldown, 24)
  projectiles.push({
    owner: attacker,
    color: attacker.color,
    x: attacker.x + attacker.dir * 26,
    y: attacker.y - 26,
    vx: attacker.dir * 8.5,
    life: 90,
    radius: 10
  })
  return true
}

function tryEnergyShot(player, enemy) {
  if (!player.specialQueued) return
  if (performance.now() - player.specialSeqAt > SPECIAL_INPUT_WINDOW_MS) {
    player.specialQueued = false
    return
  }
  if (!player.block) launchEnergyShot(player, enemy)
}

function spawnEnergyExplosion(x, y, color) {
  hitEffects.push({
    x,
    y,
    color,
    life: 18,
    maxLife: 18
  })
}

function spawnBlinkTrail(player, fromX, toX) {
  blinkEffects.push({
    fromX,
    toX,
    y: player.y,
    dir: player.dir,
    color: player.color,
    life: 14,
    maxLife: 14
  })
}

function tryBlink(player) {
  if (!player.blinkQueued) return
  player.blinkQueued = false
  if (player.knockdown > 0 || player.blinkCooldown > 0) return
  const fromX = player.x
  const targetX = Math.max(20, Math.min(880, player.x + player.dir * BLINK_DISTANCE))
  if (Math.abs(targetX - fromX) < 2) return
  player.x = targetX
  player.blinkCooldown = BLINK_COOLDOWN_FRAMES
  spawnBlinkTrail(player, fromX, targetX)
}

function updateHitEffects() {
  for (let i = hitEffects.length - 1; i >= 0; i--) {
    const fx = hitEffects[i]
    fx.life--
    if (fx.life <= 0) hitEffects.splice(i, 1)
  }
}

function updateBlinkEffects() {
  for (let i = blinkEffects.length - 1; i >= 0; i--) {
    const fx = blinkEffects[i]
    fx.life--
    if (fx.life <= 0) blinkEffects.splice(i, 1)
  }
}

function updateProjectiles() {
  for (let i = projectiles.length - 1; i >= 0; i--) {
    const shot = projectiles[i]
    shot.x += shot.vx
    shot.life--

    if (shot.life <= 0 || shot.x < -50 || shot.x > 950) {
      projectiles.splice(i, 1)
      continue
    }
  }

  const removed = new Set()
  for (let i = 0; i < projectiles.length; i++) {
    for (let j = i + 1; j < projectiles.length; j++) {
      const a = projectiles[i]
      const b = projectiles[j]
      if (a.owner === b.owner) continue
      const dx = a.x - b.x
      const dy = a.y - b.y
      const rr = a.radius + b.radius
      if (dx * dx + dy * dy <= rr * rr) {
        removed.add(i)
        removed.add(j)
      }
    }
  }
  if (removed.size > 0) {
    projectiles = projectiles.filter((_, idx) => !removed.has(idx))
  }

  for (let i = projectiles.length - 1; i >= 0; i--) {
    const shot = projectiles[i]
    const target = shot.owner === p1 ? p2 : p1
    const nearX = Math.abs(target.x - shot.x) <= (shot.radius + 12)
    const nearY = Math.abs((target.y - 26) - shot.y) <= 34
    if (!nearX || !nearY) continue

    applyHit(shot.owner, target, 14, 14, true, false)
    spawnEnergyExplosion(shot.x, shot.y, shot.color)
    projectiles.splice(i, 1)
  }
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

  for (const p of [p1, p2]) {
    if (p.cooldown > 0) p.cooldown--
    if (p.specialCooldown > 0) p.specialCooldown--
    if (p.blinkCooldown > 0) p.blinkCooldown--
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
      if (keys["KeyA"]) { p1.x -= 4; p1.dir = -1; moving = true }
      if (keys["KeyD"]) { p1.x += 4; p1.dir = 1; moving = true }
      if (moving) p1.walk += 0.2
      if (keys["KeyW"] && p1.vy === 0) p1.vy = -10
    } else {
      if (keys["KeyA"]) { p1.x -= 1.5; p1.dir = -1 }
      if (keys["KeyD"]) { p1.x += 1.5; p1.dir = 1 }
    }
    p1.block = keys["KeyU"]
    tryBlink(p1)
    tryEnergyShot(p1, p2)
    if (!p1.block && keys["KeyI"] && p1.attackTimer === 0 && p1.cooldown === 0) {
      p1.attack = 1; p1.attackTimer = 6; p1.cooldown = 20
      attack(p1, p2, 65, 7, 10)
    }
    if (!p1.block && !kneeled && keys["KeyO"] && p1.attackTimer === 0 && p1.cooldown === 0) {
      p1.attack = 2; p1.attackTimer = 10; p1.cooldown = 35
      attack(p1, p2, 95, 10, 18)
    }
  }

  if (mode === 2) {
    if (p2.knockdown === 0) {
      const kneeled = p2.knee > 0
      if (!kneeled) {
        let moving = false
        if (keys["ArrowLeft"]) { p2.x -= 4; p2.dir = -1; moving = true }
        if (keys["ArrowRight"]) { p2.x += 4; p2.dir = 1; moving = true }
        if (moving) p2.walk += 0.2
        if (keys["ArrowUp"] && p2.vy === 0) p2.vy = -10
      } else {
        if (keys["ArrowLeft"]) { p2.x -= 1.5; p2.dir = -1 }
        if (keys["ArrowRight"]) { p2.x += 1.5; p2.dir = 1 }
      }
      p2.block = keys["Numpad4"]
      tryBlink(p2)
      tryEnergyShot(p2, p1)
      if (!p2.block && keys["Numpad5"] && p2.attackTimer === 0 && p2.cooldown === 0) {
        p2.attack = 1; p2.attackTimer = 6; p2.cooldown = 20
        attack(p2, p1, 65, 7, 10)
      }
      if (!p2.block && !kneeled && keys["Numpad6"] && p2.attackTimer === 0 && p2.cooldown === 0) {
        p2.attack = 2; p2.attackTimer = 10; p2.cooldown = 35
        attack(p2, p1, 95, 10, 18)
      }
    }
  } else {
    if (p2.knockdown === 0) updateAI()
  }

  updateProjectiles()
  updateHitEffects()
  updateBlinkEffects()

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
