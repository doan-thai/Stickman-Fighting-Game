const canvas = document.getElementById("game")
const ctx = canvas.getContext("2d")
const settingsScreen = document.getElementById("settings-screen")
const aboutScreen = document.getElementById("about-screen")
const gameScreen = document.getElementById("game-screen")
const settingsNote = document.getElementById("settings-note")

let mode = 1
let keys = {}
let gameOver = false
let gameStarted = false
let startingHp = BASE_HP
let soundEnabled = true
let healthPercent = 100
let timeLimit = 60
let timeLeft = 60
let audioCtx = null
let currentLanguage = "vi"
let score = { p1: 0, p2: 0 }

let p1
let p2
let ai
let gameOverWinner = ""
let gameOverTimer = 0
let lastTime = performance.now()
