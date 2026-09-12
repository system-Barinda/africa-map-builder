const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

const movesEl = document.getElementById("moves");
const levelEl = document.getElementById("level");
const messageEl = document.getElementById("message");
const playBtn = document.getElementById("playBtn");
const leftBtn = document.getElementById("leftBtn");
const rightBtn = document.getElementById("rightBtn");
const undoBtn = document.getElementById("undo");

const state = {
  level: 9,
  moves: 12,
  running: false,
  won: false,
  history: [],
  rotation: 0,
  targetAngle: 0,
  pulse: 0,
  last: 0,
  // The screenshot uses two overlapping vertical orbit rings.
  top:    { cx: .50, cy: .36, r: .405, angle: -2.82 },
  bottom: { cx: .50, cy: .65, r: .405, angle: -0.52 },
  player: { ring: "top", angle: -2.83 },
  obstacles: [
    { ring: "top", angle: 2.82 },
    { ring: "bottom", angle: 3.55 },
    { ring: "bottom", angle: -0.54 }
  ],
  target: { x: .925, y: .335 }
};

let W = 480, H = 860, dpr = 1;

function resize() {
  const rect = canvas.getBoundingClientRect();
  W = rect.width;
  H = rect.height;
  dpr = Math.min(window.devicePixelRatio || 1, 2);
  canvas.width = Math.round(W * dpr);
  canvas.height = Math.round(H * dpr);
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
}
window.addEventListener("resize", resize);
resize();

function px(v) { return v * Math.min(W, 480); }

function circlePoint(ring, angle) {
  return {
    x: ring.cx * W + Math.cos(angle) * ring.r * W,
    y: ring.cy * H + Math.sin(angle) * ring.r * W
  };
}

function save() {
  state.history.push({
    moves: state.moves,
    rotation: state.rotation,
    playerAngle: state.player.angle
  });
  if (state.history.length > 30) state.history.shift();
}

function showMessage(text) {
  messageEl.textContent = text;
  messageEl.classList.add("show");
  clearTimeout(showMessage.t);
  showMessage.t = setTimeout(() => messageEl.classList.remove("show"), 1200);
}

function updateHud() {
  movesEl.textContent = state.moves;
  levelEl.textContent = state.level;
}

function rotate(direction) {
  if (!state.running || state.won || state.moves <= 0) return;

  save();
  state.moves--;
  state.rotation += direction * Math.PI / 8;

  // The player travels with the upper orbit. Obstacles rotate with their rings,
  // giving the player a simple timing/avoidance puzzle.
  state.player.angle += direction * Math.PI / 8;

  updateHud();
  checkCollision();
}

function checkCollision() {
  const p = circlePoint(state.top, state.player.angle);

  // Collision with pink orbs.
  for (const o of state.obstacles) {
    const ring = o.ring === "top" ? state.top : state.bottom;
    const a = o.angle + state.rotation * (o.ring === "top" ? 1 : -1);
    const q = circlePoint(ring, a);
    if (Math.hypot(p.x - q.x, p.y - q.y) < 28) {
      state.running = false;
      showMessage("collision — press play");
      return;
    }
  }

  // Target: when the cyan player reaches the cyan checker.
  const target = { x: state.target.x * W, y: state.target.y * H };
  if (Math.hypot(p.x - target.x, p.y - target.y) < 30) {
    win();
  } else if (state.moves === 0) {
    showMessage("out of moves");
  }
}

function win() {
  state.won = true;
  state.running = false;
  showMessage("level complete!");
  setTimeout(() => {
    state.level++;
    state.moves = 12;
    state.history = [];
    state.won = false;
    state.rotation = 0;
    state.player.angle = -2.83;
    updateHud();
  }, 1500);
}

function undo() {
  const previous = state.history.pop();
  if (!previous) return;
  state.moves = previous.moves;
  state.rotation = previous.rotation;
  state.player.angle = previous.playerAngle;
  state.won = false;
  updateHud();
}

function togglePlay() {
  if (state.won) return;
  state.running = !state.running;
  if (state.running && state.moves <= 0) {
    state.moves = 12;
    state.history = [];
    updateHud();
  }
}

playBtn.addEventListener("click", togglePlay);
leftBtn.addEventListener("click", () => rotate(-1));
rightBtn.addEventListener("click", () => rotate(1));
undoBtn.addEventListener("click", undo);

window.addEventListener("keydown", e => {
  if (e.code === "Space") { e.preventDefault(); togglePlay(); }
  if (e.key === "ArrowLeft" || e.key === "ArrowDown") rotate(-1);
  if (e.key === "ArrowRight" || e.key === "ArrowUp") rotate(1);
  if (e.key.toLowerCase() === "z") undo();
});

function strokeRing(ring, width = 5) {
  ctx.beginPath();
  ctx.arc(ring.cx * W, ring.cy * H, ring.r * W, 0, Math.PI * 2);
  ctx.strokeStyle = "#ff00e6";
  ctx.lineWidth = width;
  ctx.shadowBlur = 0;
  ctx.stroke();
}

function drawTarget() {
  const x = state.target.x * W;
  const y = state.target.y * H;
  const size = 30;
  const cell = 4;
  ctx.save();
  ctx.translate(x - size / 2, y - size / 2);
  for (let row = 0; row < size / cell; row++) {
    for (let col = 0; col < size / cell; col++) {
      if ((row + col) % 2 === 0) {
        ctx.fillStyle = "#00e8ee";
        ctx.fillRect(col * cell, row * cell, cell - .4, cell - .4);
      }
    }
  }
  ctx.restore();
}

function drawOrb(x, y, radius, type = "pink") {
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, Math.PI * 2);
  ctx.fillStyle = type === "cyan" ? "#2beff4" : "#ff009d";
  ctx.shadowColor = type === "cyan" ? "rgba(43,239,244,.15)" : "rgba(255,0,157,.15)";
  ctx.shadowBlur = 5;
  ctx.fill();
  ctx.shadowBlur = 0;
}

function drawPlayHint() {
  // Tiny center play marker similar to the reference screenshot.
  const x = W / 2;
  const y = H * .695;
  ctx.beginPath();
  ctx.moveTo(x - 18, y - 22);
  ctx.quadraticCurveTo(x - 22, y - 24, x - 22, y - 16);
  ctx.lineTo(x - 22, y + 16);
  ctx.quadraticCurveTo(x - 22, y + 24, x - 15, y + 21);
  ctx.lineTo(x + 20, y + 2);
  ctx.quadraticCurveTo(x + 27, y - 2, x + 20, y - 6);
  ctx.closePath();
  ctx.fillStyle = "#ff00d0";
  ctx.fill();
}

function render(t) {
  const dt = Math.min((t - state.last) / 1000 || 0, .05);
  state.last = t;
  state.pulse += dt;

  ctx.clearRect(0, 0, W, H);
  ctx.fillStyle = "#000";
  ctx.fillRect(0, 0, W, H);

  // Rings.
  strokeRing(state.top);
  strokeRing(state.bottom);

  // Target.
  drawTarget();

  // Upper cyan player.
  const player = circlePoint(state.top, state.player.angle);
  drawOrb(player.x, player.y, 23, "cyan");

  // Pink obstacles.
  for (const o of state.obstacles) {
    const ring = o.ring === "top" ? state.top : state.bottom;
    const angle = o.angle + state.rotation * (o.ring === "top" ? 1 : -1);
    const q = circlePoint(ring, angle);
    drawOrb(q.x, q.y, 23, "pink");
  }

  drawPlayHint();

  requestAnimationFrame(render);
}

updateHud();
requestAnimationFrame(render);
