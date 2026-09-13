const canvas = document.getElementById("game"),
  ctx = canvas.getContext("2d");
const $ = (id) => document.getElementById(id);
let W = 480,
  H = 860,
  DPR = 1;
const PINK = "#ff00b7",
  RING = "#ff00e6",
  CYAN = "#18f7ff",
  DARK = "#087e82";
const saveKey = "orbit-feast-v3";
const stored = JSON.parse(localStorage.getItem(saveKey) || "null") || {};
const G = {
  level: 9,
  moves: 12,
  maxMoves: 12,
  time: 45,
  timeLimit: 45,
  running: false,
  won: false,
  failed: false,
  muted: stored.muted || false,
  balls: stored.balls || 3,
  history: [],
  eaten: 0,
  step: Math.PI / 8,
  rotation: 0,
  ring: "top",
  cyanAngle: -2.82,
  pinks: [],
  particles: [],
  last: performance.now(),
  acc: 0,
};
const rings = {
  top: { cx: 0.5, cy: 0.36, r: 0.405 },
  bottom: { cx: 0.5, cy: 0.65, r: 0.405 },
};
function resize() {
  const r = canvas.getBoundingClientRect();
  W = r.width;
  H = r.height;
  DPR = Math.min(devicePixelRatio || 1, 2);
  canvas.width = W * DPR;
  canvas.height = H * DPR;
  ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
}
addEventListener("resize", resize);
resize();
function save() {
  localStorage.setItem(
    saveKey,
    JSON.stringify({ balls: G.balls, timeLimit: G.timeLimit, muted: G.muted }),
  );
}
function point(r, a) {
  return {
    x: r.cx * W + Math.cos(a) * r.r * W,
    y: r.cy * H + Math.sin(a) * r.r * W,
  };
}
function norm(a) {
  return ((a + Math.PI * 3) % (Math.PI * 2)) - Math.PI;
}
function diff(a, b) {
  return Math.abs(norm(a - b));
}
function levelData() {
  const n = G.level;
  const count = Math.min(
    12,
    Math.max(3, G.balls + Math.floor(Math.max(0, n - 9) / 6)),
  );
  const maxMoves = Math.max(8, 12 - Math.floor(Math.max(0, n - 9) / 12));
  const step = Math.PI / (4 + Math.min(4, Math.floor((n - 9) / 8) + 4));
  const base = [
    2.82, 1.25, -0.15, 0.72, -1.18, 2.05, -2.12, 0.18, 1.95, -0.65, -2.55, 0.45,
  ];
  const pinks = [];
  for (let i = 0; i < count; i++) {
    const ring = i % 2 === 0 ? "top" : "bottom";
    let a = base[(i + n) % base.length];
    if (ring === "bottom") a += Math.PI * 0.34;
    pinks.push({ ring, angle: a, alive: true, phase: ring === "top" ? 1 : -1 });
  }
  return { count, maxMoves, step };
}
function reset() {
  const c = levelData();
  G.maxMoves = c.maxMoves;
  G.moves = c.maxMoves;
  G.time = G.timeLimit;
  G.running = false;
  G.won = false;
  G.failed = false;
  G.history = [];
  G.eaten = 0;
  G.rotation = 0;
  G.ring = "top";
  G.cyanAngle = -2.82;
  G.step = c.step;
  G.pinks = [];
  for (let i = 0; i < c.count; i++) {
    const base = [
      2.82, 1.25, -0.15, 0.72, -1.18, 2.05, -2.12, 0.18, 1.95, -0.65, -2.55,
      0.45,
    ];
    const ring = i % 2 === 0 ? "top" : "bottom";
    let a =
      base[(i + G.level) % base.length] +
      (ring === "bottom" ? Math.PI * 0.34 : 0);
    if (ring === "top" && diff(a, G.cyanAngle) < 0.45) a += 0.8;
    G.pinks.push({
      ring,
      angle: norm(a),
      alive: true,
      phase: ring === "top" ? 1 : -1,
    });
  }
  update();
  setStatus("PRESS PLAY");
  $("playBtn").classList.remove("paused");
  hideResult();
}
function update() {
  $("moves").textContent = G.moves;
  $("level").textContent = G.level;
  $("timer").textContent = Math.ceil(G.time);
  $("eaten").textContent = G.eaten;
  $("total").textContent = G.pinks.length;
  $("ballCount").textContent = G.balls;
  $("timeLimit").textContent = G.timeLimit;
  $("soundBtn").textContent = G.muted ? "🔇" : "🔊";
}
function setStatus(t) {
  $("instruction").textContent = t;
}
function toast(t) {
  const e = $("toast");
  e.textContent = t;
  e.classList.add("show");
  clearTimeout(toast.t);
  toast.t = setTimeout(() => e.classList.remove("show"), 1100);
}
function play() {
  if (G.won || G.failed) return;
  G.running = !G.running;
  playSound("click");
  $("playBtn").classList.toggle("paused", G.running);
  setStatus(G.running ? "ROTATE THE ORBITS" : "PAUSED");
}
function snapshot() {
  G.history.push({
    moves: G.moves,
    time: G.time,
    ring: G.ring,
    angle: G.cyanAngle,
    pinks: G.pinks.map((x) => ({ ...x })),
  });
  if (G.history.length > 40) G.history.shift();
}
function undo() {
  const h = G.history.pop();
  if (!h) return;
  G.moves = h.moves;
  G.time = h.time;
  G.ring = h.ring;
  G.cyanAngle = h.angle;
  G.pinks = h.pinks.map((x) => ({ ...x }));
  G.eaten = G.pinks.filter((x) => !x.alive).length;
  G.running = true;
  $("playBtn").classList.add("paused");
  playSound("undo");
  update();
}
function move(dir) {
  if (!G.running || G.won || G.failed || G.moves <= 0) return;
  snapshot();
  G.moves--;
  G.cyanAngle = norm(G.cyanAngle + dir * G.step);
  for (const b of G.pinks)
    if (b.alive) b.angle = norm(b.angle + dir * G.step * b.phase);
  playSound("move");
  resolve();
  update();
  if (G.moves === 0 && G.eaten < G.pinks.length) toast("OUT OF MOVES");
}
function intersections() {
  const a = rings[G.ring === "top" ? "bottom" : "top"];
  const p = point(rings[G.ring], G.cyanAngle);
  let best = { d: Infinity, a: 0 };
  for (let i = 0; i < 360; i += 2) {
    const x = (i * Math.PI) / 180,
      q = point(a, x),
      d = Math.hypot(p.x - q.x, p.y - q.y);
    if (d < best.d) best = { d, a: x };
  }
  return best;
}
function resolve() {
  let p = point(rings[G.ring], G.cyanAngle);
  const cross = intersections();
  if (cross.d < 15) {
    G.ring = G.ring === "top" ? "bottom" : "top";
    G.cyanAngle = cross.a;
    playSound("transfer");
    burst(p.x, p.y, CYAN, 15);
    setStatus("SECOND ORBIT");
  }
  p = point(rings[G.ring], G.cyanAngle);
  for (const b of G.pinks) {
    if (!b.alive) continue;
    const q = point(rings[b.ring], b.angle);
    if (Math.hypot(p.x - q.x, p.y - q.y) < 31) {
      b.alive = false;
      G.eaten++;
      burst(q.x, q.y, PINK, 26);
      playSound("eat");
      setStatus(`EATEN ${G.eaten}/${G.pinks.length}`);
      if (b.ring !== G.ring) {
        G.ring = b.ring;
        G.cyanAngle = b.angle;
        playSound("transfer");
      }
    }
  }
  if (G.eaten === G.pinks.length) {
    setStatus("ALL EATEN — FIND THE GATE");
    const gate = gatePoint();
    if (Math.hypot(p.x - gate.x, p.y - gate.y) < 38) win();
  }
}
function gatePoint() {
  return { x: 0.925 * W, y: 0.335 * H };
}
function win() {
  if (G.won) return;
  G.won = true;
  G.running = false;
  $("playBtn").classList.remove("paused");
  playSound("win");
  setStatus("LEVEL COMPLETE");
  const used = G.maxMoves - G.moves;
  const stars =
    used <= Math.ceil(G.maxMoves * 0.45)
      ? 3
      : used <= Math.ceil(G.maxMoves * 0.75)
        ? 2
        : 1;
  setTimeout(() => showResult(true, stars, used), 300);
}
function fail(reason) {
  if (G.failed) return;
  G.failed = true;
  G.running = false;
  $("playBtn").classList.remove("paused");
  playSound("hit");
  showResult(false, 0, G.maxMoves - G.moves, reason);
}
function showResult(ok, stars, used, reason = "") {
  const r = $("result");
  r.classList.add("open");
  $("resultIcon").textContent = ok ? "★".repeat(stars) : "×";
  $("resultTitle").textContent = ok
    ? stars === 3
      ? "PERFECT!"
      : stars === 2
        ? "GREAT!"
        : "CLEARED!"
    : reason || "TRY AGAIN";
  $("resultText").textContent = ok
    ? "Every pink orb was eaten. Now you found the gate!"
    : "The orbit got the better of this run. Try again.";
  $("resultEaten").textContent = `${G.eaten}/${G.pinks.length}`;
  $("resultMoves").textContent = G.moves;
  $("resultTime").textContent = `${Math.max(0, Math.ceil(G.time))}s`;
  update();
}
function hideResult() {
  $("result").classList.remove("open");
}
function next() {
  G.level++;
  reset();
  G.running = true;
  $("playBtn").classList.add("paused");
  setStatus("ROTATE THE ORBITS");
  playSound("click");
}
function retry() {
  reset();
  G.running = true;
  $("playBtn").classList.add("paused");
  setStatus("ROTATE THE ORBITS");
  playSound("click");
}

let AC = window.AudioContext || window.webkitAudioContext,
  audio = null;
function playSound(type) {
  if (G.muted || !AC) return;
  try {
    audio = audio || new AC();
    if (audio.state === "suspended") audio.resume();
    const now = audio.currentTime;
    const data = {
      click: [440, 0.055, "sine"],
      move: [170, 0.055, "triangle"],
      undo: [110, 0.08, "triangle"],
      transfer: [280, 0.11, "square"],
      eat: [520, 0.14, "sine"],
      hit: [75, 0.25, "sawtooth"],
      win: [620, 0.16, "sine"],
    }[type] || [300, 0.05, "sine"];
    const o = audio.createOscillator(),
      g = audio.createGain();
    o.type = data[2];
    o.frequency.setValueAtTime(data[0], now);
    if (type === "eat")
      o.frequency.exponentialRampToValueAtTime(1000, now + 0.14);
    if (type === "win")
      o.frequency.exponentialRampToValueAtTime(1100, now + 0.35);
    if (type === "hit")
      o.frequency.exponentialRampToValueAtTime(35, now + 0.22);
    g.gain.setValueAtTime(0.0001, now);
    g.gain.exponentialRampToValueAtTime(0.06, now + 0.008);
    g.gain.exponentialRampToValueAtTime(0.0001, now + data[1]);
    o.connect(g).connect(audio.destination);
    o.start(now);
    o.stop(now + data[1] + 0.02);
    if (type === "win") {
      setTimeout(() => playSound("eat"), 100);
      setTimeout(() => playSound("eat"), 210);
    }
  } catch (e) {}
}
function burst(x, y, color, n) {
  for (let i = 0; i < n; i++) {
    const a = Math.random() * Math.PI * 2,
      s = 1 + Math.random() * 4;
    G.particles.push({
      x,
      y,'\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\''
      vx: Math.cos(a) * s,
      vy: Math.sin(a) * s,
      life: 1,
      color,
      size: 1 + Math.random() * 3,
    });
  }
}
function drawGate() {
  const p = gatePoint(),
    size = 31,
    cell = 4;
  for (let r = 0; r < 8; r++)
    for (let c = 0; c < 8; c++)
      if ((r + c) % 2 === 0) {
        ctx.fillStyle = CYAN;
        ctx.fillRect(
          p.x - size / 2 + c * cell,
          p.y - size / 2 + r * cell,
          cell - 0.4,
          cell - 0.4,
        );
      }
  ctx.globalAlpha = 0.16;
  ctx.strokeStyle = CYAN;
  ctx.lineWidth = 2;
  ctx.strokeRect(p.x - 20, p.y - 20, 40, 40);
  ctx.globalAlpha = 1;
}
function drawOrb(p, r, color) {
  ctx.beginPath();
  ctx.arc(p.x, p.y, r, 0, Math.PI * 2);
  ctx.fillStyle = color;
  ctx.shadowColor = color;
  ctx.shadowBlur = 6;
  ctx.fill();
  ctx.shadowBlur = 0;
}
function render(t) {
  const dt = Math.min(0.05, (t - G.last) / 1000);
  G.last = t;
  ctx.clearRect(0, 0, W, H);
  ctx.fillStyle = "#000";
  ctx.fillRect(0, 0, W, H);
  for (const r of [rings.top, rings.bottom]) {
    ctx.beginPath();
    ctx.arc(r.cx * W, r.cy * H, r.r * W, 0, Math.PI * 2);
    ctx.strokeStyle = RING;
    ctx.lineWidth = 5;
    ctx.stroke();
  }
  drawGate();
  for (const b of G.pinks)
    if (b.alive) drawOrb(point(rings[b.ring], b.angle), 23, PINK);
  const cp = point(rings[G.ring], G.cyanAngle),
    radius = Math.min(30, 23 + G.eaten * 1.35);
  drawOrb(cp, radius, CYAN);
  if (G.eaten) {
    ctx.beginPath();
    ctx.arc(cp.x, cp.y, radius - 6, 0, Math.PI * 2);
    ctx.strokeStyle = "rgba(0,0,0,.2)";
    ctx.lineWidth = 2;
    ctx.stroke();
    for (let i = 0; i < Math.min(6, G.eaten); i++) {
      const a = t / 700 + i * 1.05;
      drawOrb(
        {
          x: cp.x + Math.cos(a) * (radius + 5),
          y: cp.y + Math.sin(a) * (radius + 5),
        },
        2,
        CYAN,
      );
    }
  }
  for (const p of G.particles) {
    p.x += p.vx;
    p.y += p.vy;
    p.vx *= 0.97;
    p.vy *= 0.97;
    p.life -= dt * 1.8;
    ctx.globalAlpha = Math.max(0, p.life);
    ctx.fillStyle = p.color;
    ctx.fillRect(p.x, p.y, p.size, p.size);
  }
  ctx.globalAlpha = 1;
  G.particles = G.particles.filter((p) => p.life > 0);
  requestAnimationFrame(render);
}
function tick() {
  if (G.running && !G.won && !G.failed) {
    G.time -= 0.1;
    if (G.time <= 0) {
      G.time = 0;
      update();
      fail("TIME UP");
    }
    update();
  }
  setTimeout(tick, 100);
}

$("playBtn").onclick = play;
$("leftBtn").onclick = () => move(-1);
$("rightBtn").onclick = () => move(1);
$("undoBtn").onclick = undo;
$("retryBtn").onclick = retry;
$("nextBtn").onclick = next;
$("soundBtn").onclick = () => {
  G.muted = !G.muted;
  save();
  update();
  if (!G.muted) playSound("click");
};
$("settingsBtn").onclick = () => {
  $("settings").classList.add("open");
  G.running = false;
  $("playBtn").classList.remove("paused");
};
$("closeSettings").onclick = () => {
  $("settings").classList.remove("open");
};
$("minusBalls").onclick = () => {
  G.balls = Math.max(3, G.balls - 1);
  update();
};
$("plusBalls").onclick = () => {
  G.balls = Math.min(12, G.balls + 1);
  update();
};
$("minusTime").onclick = () => {
  G.timeLimit = Math.max(20, G.timeLimit - 5);
  G.time = G.timeLimit;
  update();
};
$("plusTime").onclick = () => {
  G.timeLimit = Math.min(120, G.timeLimit + 5);
  G.time = G.timeLimit;
  update();
};
$("newGame").onclick = () => {
  save();
  $("settings").classList.remove("open");
  reset();
  G.running = true;
  $("playBtn").classList.add("paused");
  setStatus("ROTATE THE ORBITS");
  playSound("click");
};
addEventListener("keydown", (e) => {
  if (e.code === "Space") {
    e.preventDefault();
    play();
  }
  if (e.key === "ArrowLeft" || e.key === "ArrowDown") move(-1);
  if (e.key === "ArrowRight" || e.key === "ArrowUp") move(1);
  if (e.key.toLowerCase() === "z") undo();
  if (e.key.toLowerCase() === "m") $("soundBtn").click();
});
canvas.addEventListener("pointerdown", () => {
  if (!G.muted && AC && !audio) playSound("click");
});
reset();
update();
requestAnimationFrame(render);
tick();
