function createAI() {
  return {
    state: "approach",
    stateTimer: 0,
    reactionDelay: 0,
    aggression: 0.6,
    memory: { lastPunch: 0, lastKick: 0, punchCount: 0 }
  }
}

function updateAI() {
  const a = ai
  const dist = Math.abs(p1.x - p2.x)
  if (p1.attack === 1) a.memory.lastPunch = 0
  if (p1.attack === 2) a.memory.lastKick = 0
  a.memory.lastPunch++
  a.memory.lastKick++
  if (a.reactionDelay > 0) { a.reactionDelay--; return }
  a.stateTimer--
  if (a.stateTimer <= 0) {
    const roll = Math.random()
    if (p1.knockdown > 0) { a.state = "pressure"; a.stateTimer = 40 }
    else if (p1.block && dist < 80) { a.state = roll < 0.5 ? "retreat" : "punish"; a.stateTimer = 30 }
    else if (dist > 180) { a.state = "approach"; a.stateTimer = 40 + Math.random() * 30 | 0 }
    else {
      if (roll < a.aggression) a.state = "pressure"
      else if (roll < a.aggression + 0.2) a.state = "block_bait"
      else a.state = "retreat"
      a.stateTimer = 20 + Math.random() * 40 | 0
    }
    a.reactionDelay = 8 + Math.random() * 12 | 0
    return
  }
  if (p1.attack > 0 && dist < 100 && !p2.block) {
    if (Math.random() < 0.55) { p2.block = true; return }
  } else if (p1.attack === 0) {
    p2.block = false
  }
  switch (a.state) {
    case "approach":
      p2.block = false
      if (p2.x > p1.x) p2.x -= 2.5
      else p2.x += 2.5
      p2.walk += 0.18
      if (dist < 80) { a.state = "pressure"; a.stateTimer = 30 }
      break
    case "pressure":
      p2.block = false
      if (dist > 60) {
        if (p2.x > p1.x) p2.x -= 2
        else p2.x += 2
        p2.walk += 0.15
      }
      if (p2.cooldown === 0 && dist < 90) {
        const r = Math.random()
        if (r < 0.55) {
          p2.attack = 1; p2.attackTimer = 6; p2.cooldown = 22
          attack(p2, p1, 65, 7, 10)
          a.reactionDelay = 10 + Math.random() * 8 | 0
        } else if (r < 0.8) {
          p2.attack = 2; p2.attackTimer = 10; p2.cooldown = 40
          attack(p2, p1, 95, 12, 18)
          a.reactionDelay = 18 + Math.random() * 12 | 0
        }
      }
      break
    case "retreat":
      p2.block = false
      if (p2.x > p1.x) p2.x += 2.5
      else p2.x -= 2.5
      p2.walk += 0.18
      if (p2.vy === 0 && Math.random() < 0.03) p2.vy = -9
      break
    case "punish":
      p2.block = false
      if (p2.cooldown === 0 && dist < 110) {
        p2.attack = 2; p2.attackTimer = 10; p2.cooldown = 38
        attack(p2, p1, 95, 12, 18)
        a.reactionDelay = 15 + Math.random() * 10 | 0
        a.state = "pressure"; a.stateTimer = 25
      } else if (dist > 110) {
        if (p2.x > p1.x) p2.x -= 3
        else p2.x += 3
        p2.walk += 0.2
      }
      break
    case "block_bait":
      p2.block = true
      if (p1.attack > 0 && a.memory.lastPunch < 20) {
        a.state = "punish"
        a.stateTimer = 20
        a.reactionDelay = 6 + Math.random() * 8 | 0
      }
      break
  }
  if (p1.vy < -4 && p2.vy === 0 && Math.random() < 0.3) p2.vy = -9
}
