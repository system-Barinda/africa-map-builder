// Draw the Map - Complete offline audio system using Web Audio API.
// No external sound files are required.

const countries = [
  {
    id: "uganda",
    name: "Uganda",
    color: "#ef75aa",
    d: "M350 142L390 132L421 151L414 190L380 202L345 185Z",
    capital: "Kampala",
  },
  {
    id: "kenya",
    name: "Kenya",
    color: "#f4a24f",
    d: "M420 145L466 130L505 151L526 190L501 238L463 229L430 196Z",
    capital: "Nairobi",
  },
  {
    id: "rwanda",
    name: "Rwanda",
    color: "#7d9de8",
    d: "M330 229L351 220L367 234L359 257L337 261L326 245Z",
    capital: "Kigali",
  },
  {
    id: "burundi",
    name: "Burundi",
    color: "#8ccf83",
    d: "M310 265L336 258L351 274L344 300L319 303L306 286Z",
    capital: "Gitega",
  },
  {
    id: "tanzania",
    name: "Tanzania",
    color: "#e9c74d",
    d: "M349 258L393 236L438 249L469 287L454 342L421 379L379 363L354 327L337 294Z",
    capital: "Dodoma",
  },
  {
    id: "south-sudan",
    name: "South Sudan",
    color: "#9b7bd2",
    d: "M350 91L398 79L437 91L459 124L438 151L400 146L373 158L346 135Z",
    capital: "Juba",
  },
  {
    id: "ethiopia",
    name: "Ethiopia",
    color: "#5db8b1",
    d: "M438 86L491 72L545 89L568 120L550 155L515 164L483 151L455 129Z",
    capital: "Addis Ababa",
  },
  {
    id: "somalia",
    name: "Somalia",
    color: "#ee806f",
    d: "M553 145L590 120L613 133L604 180L579 224L555 257L535 238L551 199Z",
    capital: "Mogadishu",
  },
];
const centers = {
  uganda: [380, 169],
  kenya: [474, 185],
  rwanda: [347, 241],
  burundi: [329, 283],
  tanzania: [404, 305],
  "south-sudan": [402, 118],
  ethiopia: [506, 116],
  somalia: [570, 185],
};
const board = document.getElementById("board"),
  pieces = document.getElementById("pieces"),
  mapBase = document.createElementNS("http://www.w3.org/2000/svg", "g"),
  targets = document.createElementNS("http://www.w3.org/2000/svg", "g");
board.appendChild(mapBase);
board.appendChild(targets);

const africaOutline =
  "M190 90L233 66L282 58L334 75L370 88L396 74L436 62L487 79L520 70L568 92L597 130L620 172L637 221L634 272L612 325L620 378L595 420L574 462L541 507L503 551L455 578L411 600L360 590L321 592L287 547L260 506L240 462L211 426L182 402L156 364L170 315L151 270L174 214L180 164L190 90Z";

let placed = 0,
  score = 0,
  streak = 0,
  timeLeft = 60,
  timer = null,
  lastTick = 0;

// ---------- Audio Engine ----------
let audioCtx = null;
let masterGain = null;
let soundOn = localStorage.getItem("drawMapSound") !== "off";
let volume = Number(localStorage.getItem("drawMapVolume") || 85) / 100;

function ensureAudio() {
  if (!soundOn) return false;
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    masterGain = audioCtx.createGain();
    masterGain.gain.value = volume;
    masterGain.connect(audioCtx.destination);
  }
  if (audioCtx.state === "suspended") audioCtx.resume();
  return true;
}
function tone(freq, duration, type = "sine", gain = 0.07, delay = 0) {
  if (!ensureAudio()) return;
  const now = audioCtx.currentTime + delay,
    o = audioCtx.createOscillator(),
    g = audioCtx.createGain();
  o.type = type;
  o.frequency.setValueAtTime(freq, now);
  g.gain.setValueAtTime(0.0001, now);
  g.gain.exponentialRampToValueAtTime(gain, now + 0.012);
  g.gain.exponentialRampToValueAtTime(0.0001, now + duration);
  o.connect(g);
  g.connect(masterGain);
  o.start(now);
  o.stop(now + duration + 0.03);
}
function playButtonSound() {
  tone(520, 0.055, "sine", 0.045);
  tone(700, 0.045, "sine", 0.025, 0.035);
}
function playPickupSound() {
  tone(330, 0.07, "sine", 0.06);
  tone(520, 0.08, "triangle", 0.045, 0.045);
}
function playDropSound() {
  tone(180, 0.07, "sine", 0.035);
}
function playCorrectSound() {
  tone(660, 0.1, "triangle", 0.06);
  tone(880, 0.14, "triangle", 0.055, 0.08);
  tone(1100, 0.18, "sine", 0.04, 0.17);
}
function playWrongSound() {
  tone(190, 0.1, "sine", 0.045);
  tone(130, 0.12, "triangle", 0.035, 0.06);
}
function playCountdownSound(strong = false) {
  tone(strong ? 650 : 500, 0.055, "square", strong ? 0.035 : 0.022);
}
function playTimeUpSound() {
  tone(260, 0.12, "sawtooth", 0.045);
  tone(190, 0.18, "sawtooth", 0.04, 0.12);
  tone(110, 0.28, "sine", 0.035, 0.25);
}
function playVictorySound() {
  [523, 659, 784, 1047, 1319].forEach((f, i) =>
    tone(f, 0.18, "triangle", 0.055, i * 0.105),
  );
}
function playUnlockSound() {
  tone(523, 0.1, "sine", 0.04);
  tone(659, 0.1, "sine", 0.045, 0.08);
  tone(784, 0.13, "triangle", 0.05, 0.16);
  tone(1047, 0.2, "triangle", 0.055, 0.26);
}
function playScoreSound() {
  tone(900, 0.055, "triangle", 0.025);
}
function playBonusSound() {
  tone(880, 0.07, "triangle", 0.04);
  tone(1175, 0.12, "triangle", 0.045, 0.07);
}
function playTypingSound() {
  tone(
    [420, 470, 520, 390][Math.floor(Math.random() * 4)],
    0.025,
    "square",
    0.012,
  );
}
function playStartSound() {
  [392, 523, 659].forEach((f, i) => tone(f, 0.13, "triangle", 0.045, i * 0.11));
}
function playStreakSound(n) {
  const base = n >= 5 ? 720 : 600;
  tone(base, 0.08, "triangle", 0.04);
  tone(base * 1.25, 0.1, "triangle", 0.045, 0.07);
  if (n >= 5) tone(base * 1.5, 0.14, "triangle", 0.05, 0.14);
}

function setSound(on) {
  soundOn = on;
  localStorage.setItem("drawMapSound", on ? "on" : "off");
  updateSoundButtons();
  if (on) ensureAudio();
}
function updateSoundButtons() {
  const text = soundOn ? "🔊 Sound ON" : "🔇 Sound OFF";
  document.querySelectorAll(".sound").forEach((b) => (b.textContent = text));
}
function setVolume(v) {
  volume = Math.min(1, v / 100 * 1.35);
  localStorage.setItem("drawMapVolume", v);
  if (masterGain) masterGain.gain.value = volume;
  document.getElementById("volumeValue").textContent = `${v}%`;
}
updateSoundButtons();

// ---------- Game ----------
function svgEl(tag) {
  return document.createElementNS("http://www.w3.org/2000/svg", tag);
}
function shuffle(a) {
  return [...a].sort(() => Math.random() - 0.5);
}
function renderMapBackground() {
  mapBase.innerHTML = "";

  const africa = svgEl("path");
  africa.setAttribute("d", africaOutline);
  africa.setAttribute("fill", "rgba(255,255,255,0.06)");
  africa.setAttribute("stroke", "rgba(148, 255, 210, 0.9)");
  africa.setAttribute("stroke-width", "3.5");
  africa.setAttribute("stroke-linejoin", "round");
  africa.setAttribute("class", "africa-outline");
  mapBase.appendChild(africa);
}
function renderTargets() {
  targets.innerHTML = "";
  countries.forEach((c) => {
    const p = svgEl("path");
    p.setAttribute("d", c.d);
    p.classList.add("target");
    p.dataset.id = c.id;
    p.addEventListener("dragover", (e) => {
      e.preventDefault();
      p.classList.add("over");
    });
    p.addEventListener("dragleave", () => p.classList.remove("over"));
    p.addEventListener("drop", (e) => {
      e.preventDefault();
      p.classList.remove("over");
      checkDrop(e.dataTransfer.getData("id"), c.id, p);
    });
    targets.appendChild(p);
  });
}
function renderPieces() {
  pieces.innerHTML = "";
  shuffle(countries).forEach((c) => {
    const q = document.createElement("div");
    q.className = "piece";
    q.draggable = true;
    q.dataset.id = c.id;
    const s = svgEl("svg");
    s.setAttribute("viewBox", "290 60 340 330");
    const p = svgEl("path");
    p.setAttribute("d", c.d);
    p.setAttribute("fill", c.color);
    p.setAttribute("stroke", "#5d4550");
    p.setAttribute("stroke-width", "3");
    p.setAttribute("stroke-linejoin", "round");
    s.appendChild(p);
    q.appendChild(s);
    q.addEventListener("dragstart", (e) => {
      ensureAudio();
      playPickupSound();
      e.dataTransfer.setData("id", c.id);
      q.classList.add("dragging");
    });
    q.addEventListener("dragend", () => {
      q.classList.remove("dragging");
      playDropSound();
    });
    addTouch(q, c.id);
    pieces.appendChild(q);
  });
}
function addTouch(q, id) {
  let active = false;
  q.addEventListener(
    "touchstart",
    (e) => {
      if (q.classList.contains("placed")) return;
      active = true;
      ensureAudio();
      playPickupSound();
      q.classList.add("dragging");
      e.preventDefault();
    },
    { passive: false },
  );
  q.addEventListener(
    "touchmove",
    (e) => {
      if (active) e.preventDefault();
    },
    { passive: false },
  );
  q.addEventListener(
    "touchend",
    (e) => {
      if (!active) return;
      active = false;
      q.classList.remove("dragging");
      const t = e.changedTouches[0],
        x = document.elementFromPoint(t.clientX, t.clientY),
        target = x && x.closest(".target");
      playDropSound();
      if (target) checkDrop(id, target.dataset.id, target);
    },
    { passive: false },
  );
}
function checkDrop(a, b, target) {
  if (!a) return;
  if (a === b) {
    const q = document.querySelector(`.piece[data-id="${a}"]`);
    if (!q || q.classList.contains("placed")) return;
    q.classList.add("placed");
    target.classList.add("correct");
    placed++;
    streak++;
    let points = 100;
    score += points;
    playCorrectSound();
    playScoreSound();
    const country = countries.find((x) => x.id === b);
    showToast(`✨ ${country.name} placed correctly!`);
    revealCountry(country.name);
    if (streak >= 3) {
      score += 50;
      playStreakSound(streak);
      showToast(`🔥 ${streak} COUNTRY STREAK! +50`);
    }
    if (timeLeft >= 50) {
      score += 50;
      playBonusSound();
      showToast("⚡ QUICK PLACEMENT! +50");
    }
    update();
    if (placed === countries.length) setTimeout(win, 550);
  } else {
    streak = 0;
    playWrongSound();
    target.classList.add("shake");
    markWrongPiece(a);
    setTimeout(() => target.classList.remove("shake"), 400);
    document.getElementById("message").textContent =
      "Not quite — that shape is wrong. Try again!";
    document.getElementById("message").style.color = "#ff8ca8";
    updateStreak();
  }
}
function revealCountry(name) {
  document.getElementById("message").textContent = `✅ Country found: ${name}`;
  document.getElementById("message").style.color = "#6ee7b7";
}
function markWrongPiece(id) {
  const piece = document.querySelector(`.piece[data-id="${id}"]`);
  if (!piece) return;
  piece.classList.add("wrong");
  const laugh = document.createElement("span");
  laugh.className = "laugh-emoji";
  laugh.textContent = "😂";
  piece.appendChild(laugh);
  setTimeout(() => {
    piece.classList.remove("wrong");
    laugh.remove();
  }, 700);
}
function update() {
  document.getElementById("progress").textContent =
    `${placed}/${countries.length}`;
  document.getElementById("score").textContent = score;
  document.getElementById("time").textContent = timeLeft;
  updateStreak();
}
function updateStreak() {
  document.getElementById("streak").textContent = `🔥 Streak: ${streak}`;
}
function showToast(text) {
  const t = document.getElementById("toast");
  t.textContent = text;
  t.classList.add("show");
  clearTimeout(showToast.timer);
  showToast.timer = setTimeout(() => t.classList.remove("show"), 1500);
}
function startTimer() {
  clearInterval(timer);
  lastTick = 0;
  timer = setInterval(() => {
    timeLeft--;
    update();
    if (timeLeft <= 10 && timeLeft > 0) {
      playCountdownSound(timeLeft <= 5);
    }
    if (timeLeft === 3) showToast("3... 2... 1...");
    if (timeLeft <= 0) {
      clearInterval(timer);
      playTimeUpSound();
      document.getElementById("timeProgress").textContent =
        `${placed} / ${countries.length}`;
      document.getElementById("timeUp").classList.remove("hidden");
    }
  }, 1000);
}
function startGame() {
  document.getElementById("menu").classList.add("hidden");
  document.getElementById("game").classList.remove("hidden");
  ensureAudio();
  playStartSound();
  placed = 0;
  score = 0;
  streak = 0;
  timeLeft = 60;
  renderMapBackground();
  renderTargets();
  renderPieces();
  update();
  startTimer();
  showToast("🌍 AFRICA MAP CHALLENGE STARTED!");
  document.getElementById("message").textContent = "Pick up any country shape and place it into the Africa map.";
  document.getElementById("message").style.color = "#d8c9ff";
}
function resetGame() {
  clearInterval(timer);
  document.getElementById("timeUp").classList.add("hidden");
  document.getElementById("win").classList.add("hidden");
  placed = 0;
  score = 0;
  streak = 0;
  timeLeft = 60;
  renderMapBackground();
  renderTargets();
  renderPieces();
  update();
  startTimer();
  showToast("🔄 ROUND RESTARTED");
  playButtonSound();
}
function backMenu() {
  clearInterval(timer);
  document.getElementById("game").classList.add("hidden");
  document.getElementById("timeUp").classList.add("hidden");
  document.getElementById("menu").classList.remove("hidden");
  showToast("🏠 BACK TO MENU");
  playButtonSound();
}
function win() {
  clearInterval(timer);
  score += timeLeft * 10;
  playVictorySound();
  playUnlockSound();
  document.getElementById("finalScore").textContent = score;
  document.getElementById("win").classList.remove("hidden");
  update();
  showToast("🎉 AFRICA COMPLETE!");
}
function openModal(id) {
  playButtonSound();
  document.getElementById(id).classList.remove("hidden");
}
function closeModal(id) {
  playButtonSound();
  document.getElementById(id).classList.add("hidden");
}

document.getElementById("play").onclick = startGame;
document.getElementById("how").onclick = () => openModal("howModal");
document.getElementById("settings").onclick = () => openModal("settingsModal");
document.getElementById("restart").onclick = resetGame;
document.getElementById("tryAgain").onclick = () => {
  document.getElementById("timeUp").classList.add("hidden");
  resetGame();
};
document.getElementById("backMenu").onclick = backMenu;
document.getElementById("playAgain").onclick = () => {
  document.getElementById("win").classList.add("hidden");
  startGame();
};
document
  .querySelectorAll("[data-close]")
  .forEach((b) => (b.onclick = () => closeModal(b.dataset.close)));
document.getElementById("soundMenu").onclick = () => {
  setSound(!soundOn);
  if (soundOn) playButtonSound();
};
document.getElementById("soundGame").onclick = () => {
  setSound(!soundOn);
  if (soundOn) playButtonSound();
};
document.getElementById("volume").value = Math.round(volume / 1.35 * 100);
document.getElementById("volumeValue").textContent =
  `${Math.round(volume / 1.35 * 100)}%`;
document.getElementById("volume").oninput = (e) => {
  setVolume(Number(e.target.value));
  playScoreSound();
};

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    document
      .querySelectorAll(".modal")
      .forEach((m) => m.classList.add("hidden"));
  }
});
document
  .querySelectorAll("input")
  .forEach((input) => input.addEventListener("keydown", playTypingSound));

renderMapBackground();
renderTargets();
renderPieces();
update();
