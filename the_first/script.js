const regions = [
  {
    name: "East Africa",
    time: 60,
    countries: [
      { id: "rwanda", name: "🇷🇼 Rwanda" },
      { id: "uganda", name: "🇺🇬 Uganda" },
      { id: "kenya", name: "🇰🇪 Kenya" },
      { id: "tanzania", name: "🇹🇿 Tanzania" },
      { id: "burundi", name: "🇧🇮 Burundi" }
    ]
  },
  {
    name: "South Africa",
    time: 50,
    countries: [
      { id: "south-africa", name: "🇿🇦 South Africa" },
      { id: "namibia", name: "🇳🇦 Namibia" },
      { id: "botswana", name: "🇧🇼 Botswana" },
      { id: "zimbabwe", name: "🇿🇼 Zimbabwe" },
      { id: "zambia", name: "🇿🇲 Zambia" }
    ]
  },
  {
    name: "North Africa",
    time: 45,
    countries: [
      { id: "morocco", name: "🇲🇦 Morocco" },
      { id: "algeria", name: "🇩🇿 Algeria" },
      { id: "tunisia", name: "🇹🇳 Tunisia" },
      { id: "libya", name: "🇱🇾 Libya" },
      { id: "egypt", name: "🇪🇬 Egypt" }
    ]
  },
  {
    name: "West Africa",
    time: 40,
    countries: [
      { id: "senegal", name: "🇸🇳 Senegal" },
      { id: "ghana", name: "🇬🇭 Ghana" },
      { id: "nigeria", name: "🇳🇬 Nigeria" },
      { id: "mali", name: "🇲🇱 Mali" },
      { id: "ivory-coast", name: "🇨🇮 Côte d'Ivoire" }
    ]
  }
];

let currentLevel = 0;
let score = 0;
let timeLeft = 60;
let timer = null;
let placed = 0;

const $ = id => document.getElementById(id);

function showScreen(id) {
  document.querySelectorAll(".screen").forEach(s => s.classList.add("hidden"));
  $(id).classList.remove("hidden");
}

function updateTop() {
  $("levelText").textContent = currentLevel + 1;
  $("scoreText").textContent = score;
  $("timerText").textContent = timeLeft;
}

function startGame() {
  currentLevel = 0;
  score = 0;
  loadLevel();
  showScreen("gameScreen");
}

function loadLevel() {
  clearInterval(timer);
  placed = 0;

  const region = regions[currentLevel];
  timeLeft = region.time;

  $("regionTitle").textContent = region.name;
  $("mapStatus").textContent = region.name;
  $("instruction").textContent =
    `Drag every country to its correct location. You have ${region.time} seconds.`;

  $("progressText").textContent = `0 / ${region.countries.length}`;
  $("progressFill").style.width = "0%";

  renderPieces(region.countries);
  renderTargets(region.countries);

  updateTop();
  startTimer();
}

function renderPieces(countries) {
  const container = $("pieces");
  container.innerHTML = "";

  countries.forEach(country => {
    const piece = document.createElement("div");
    piece.className = "piece";
    piece.draggable = true;
    piece.dataset.country = country.id;
    piece.textContent = country.name;

    piece.addEventListener("dragstart", e => {
      e.dataTransfer.setData("text/plain", country.id);
      piece.classList.add("dragging");
    });

    piece.addEventListener("dragend", () => {
      piece.classList.remove("dragging");
    });

    container.appendChild(piece);
  });
}

function renderTargets(countries) {
  const container = $("targets");
  container.innerHTML = "";

  countries.forEach(country => {
    const target = document.createElement("div");
    target.className = "target";
    target.dataset.country = country.id;
    target.textContent = country.name.replace(/^.*? /, "");

    target.addEventListener("dragover", e => {
      e.preventDefault();
      target.classList.add("over");
    });

    target.addEventListener("dragleave", () => {
      target.classList.remove("over");
    });

    target.addEventListener("drop", e => {
      e.preventDefault();
      target.classList.remove("over");

      const draggedId = e.dataTransfer.getData("text/plain");

      if (draggedId === target.dataset.country) {
        placeCorrect(target, draggedId);
      } else {
        target.classList.add("shake");
        setTimeout(() => target.classList.remove("shake"), 400);
      }
    });

    container.appendChild(target);
  });
}

function placeCorrect(target, countryId) {
  const piece = document.querySelector(`.piece[data-country="${countryId}"]`);

  if (!piece || piece.classList.contains("placed")) return;

  piece.classList.add("placed");
  target.classList.add("correct");
  target.innerHTML = `<span class="placed-label">✓ ${piece.textContent}</span>`;

  placed++;
  score += 100 + (timeLeft * 2);

  const total = regions[currentLevel].countries.length;
  $("progressText").textContent = `${placed} / ${total}`;
  $("progressFill").style.width = `${(placed / total) * 100}%`;
  updateTop();

  if (placed === total) {
    clearInterval(timer);
    setTimeout(levelComplete, 450);
  }
}

function startTimer() {
  timer = setInterval(() => {
    timeLeft--;
    updateTop();

    if (timeLeft <= 0) {
      clearInterval(timer);
      showScreen("gameOverScreen");
    }
  }, 1000);
}

function levelComplete() {
  const region = regions[currentLevel];

  if (currentLevel === regions.length - 1) {
    $("finalScore").textContent = score;
    showScreen("finishedScreen");
    return;
  }

  $("completeMessage").textContent =
    `You completed ${region.name} and earned points for beating the timer.`;

  $("nextRegionName").textContent = regions[currentLevel + 1].name;
  showScreen("regionScreen");
}

$("startBtn").addEventListener("click", startGame);

$("restartBtn").addEventListener("click", () => {
  loadLevel();
});

$("tryAgainBtn").addEventListener("click", () => {
  loadLevel();
  showScreen("gameScreen");
});

$("nextBtn").addEventListener("click", () => {
  currentLevel++;
  loadLevel();
  showScreen("gameScreen");
});

$("playAgainBtn").addEventListener("click", startGame);

// Basic touch support for mobile.
let touchPiece = null;

document.addEventListener("touchstart", e => {
  const piece = e.target.closest(".piece");
  if (!piece || piece.classList.contains("placed")) return;
  touchPiece = piece;
  piece.classList.add("dragging");
}, { passive: true });

document.addEventListener("touchend", e => {
  if (!touchPiece) return;

  const touch = e.changedTouches[0];
  const element = document.elementFromPoint(touch.clientX, touch.clientY);
  const target = element?.closest(".target");

  if (target) {
    if (target.dataset.country === touchPiece.dataset.country) {
      placeCorrect(target, touchPiece.dataset.country);
    } else {
      target.classList.add("shake");
      setTimeout(() => target.classList.remove("shake"), 400);
    }
  }

  touchPiece.classList.remove("dragging");
  touchPiece = null;
}, { passive: true });
