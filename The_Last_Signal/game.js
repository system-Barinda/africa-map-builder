// ======================================================
// THE LAST SIGNAL
// ======================================================


// ======================================================
// CANVAS
// ======================================================

const canvas =
    document.getElementById("gameCanvas");

const ctx =
    canvas.getContext("2d");


// ======================================================
// HTML ELEMENTS
// ======================================================

const timerElement =
    document.getElementById("timer");

const scoreElement =
    document.getElementById("score");

const batteryElement =
    document.getElementById("battery");

const signalElement =
    document.getElementById("signal");

const cluesElement =
    document.getElementById("clues");

const logElement =
    document.getElementById("log");

const missionTitle =
    document.getElementById("missionTitle");

const missionText =
    document.getElementById("missionText");

const interactionPrompt =
    document.getElementById(
        "interactionPrompt"
    );

const startScreen =
    document.getElementById("startScreen");

const messageBox =
    document.getElementById("messageBox");

const winScreen =
    document.getElementById("winScreen");

const failScreen =
    document.getElementById("failScreen");


// ======================================================
// PLAYER
// ======================================================

const player = {

    // IMPORTANT:
    // Start on the vertical road,
    // NOT inside a building.

    x: 357,

    y: 640,

    size: 15,

    speed: 105,

    direction: "up"

};


// ======================================================
// GAME STATE
// ======================================================

let gameStarted = false;

let gameWon = false;
let gameFailed = false;

let gamePaused = false;

let battery = 100;

let signals = 0;

let clues = 0;

let score = 0;

let gameSeconds = 0;

let lastTime = 0;

let gameTime = 0;


// ======================================================
// KEYBOARD
// ======================================================

const keys = {};


// ======================================================
// BUILDINGS
// ======================================================

const buildings = [

    {
        x: 70,
        y: 80,
        w: 220,
        h: 120,
        name: "KIGALI HEIGHTS"
    },

    {
        x: 390,
        y: 55,
        w: 230,
        h: 145,
        name: "TECH HUB"
    },

    {
        x: 720,
        y: 80,
        w: 360,
        h: 120,
        name: "CITY CENTER"
    },

    {
        x: 75,
        y: 300,
        w: 240,
        h: 130,
        name: "BLOCK A"
    },

    {
        x: 410,
        y: 275,
        w: 280,
        h: 140,
        name: "COMMUNICATION HQ"
    },

    {
        x: 800,
        y: 295,
        w: 280,
        h: 130,
        name: "BLOCK B"
    },

    {
        x: 60,
        y: 500,
        w: 240,
        h: 125,
        name: "BLOCK C"
    },

    {
        x: 420,
        y: 500,
        w: 260,
        h: 125,
        name: "BLOCK D"
    },

    {
        x: 800,
        y: 500,
        w: 300,
        h: 125,
        name: "BLOCK E"
    }

];


// ======================================================
// ITEMS
// ======================================================

const items = [

    // BATTERIES

    {
        type: "battery",
        x: 405,
        y: 230,
        collected: false
    },

    {
        type: "battery",
        x: 770,
        y: 460,
        collected: false
    },

    {
        type: "battery",
        x: 1120,
        y: 230,
        collected: false
    },


    // SIGNALS

    {
        type: "signal",
        x: 357,
        y: 455,
        collected: false
    },

    {
        type: "signal",
        x: 650,
        y: 230,
        collected: false
    },

    {
        type: "signal",
        x: 1140,
        y: 640,
        collected: false
    },


    // CLUES

    {
        type: "clue",
        x: 320,
        y: 250,
        collected: false
    },

    {
        type: "clue",
        x: 710,
        y: 250,
        collected: false
    },

    {
        type: "clue",
        x: 760,
        y: 470,
        collected: false
    }

];


// ======================================================
// DRONES
// ======================================================

const drones = [

    {
        x: 500,
        y: 220,
        size: 17,
        dx: 1.8
    },

    {
        x: 850,
        y: 440,
        size: 17,
        dx: -1.5
    },

    {
        x: 1050,
        y: 240,
        size: 17,
        dx: 1.3
    }

];


// ======================================================
// CARS
// ======================================================

const cars = [
    {
        x: 70,
        y: 247,
        speed: 1.30,
        direction: 1,
        width: 44,
        height: 28
    },
    {
        x: 1080,
        y: 472,
        speed: 1.35,
        direction: -1,
        width: 44,
        height: 28
    },
    {
        x: 430,
        y: 247,
        speed: 1.30,
        direction: 1,
        width: 44,
        height: 28
    }
];


// ======================================================
// START BUTTON
// ======================================================

document
    .getElementById("startButton")
    .addEventListener(
        "click",
        startGame
    );


function startGame() {

    resetGame();

    gameStarted = true;

    gamePaused = false;

    lastTime = performance.now();

    addLog(
        "Mission started. Find the first signal."
    );

}


// ======================================================
// RESET GAME
// ======================================================

function resetGame() {

    player.x = 357;

    player.y = 640;

    player.direction = "up";

    battery = 100;

    signals = 0;

    clues = 0;

    score = 0;

    gameSeconds = 0;

    gameTime = 0;

    gameWon = false;
    gameFailed = false;

    gamePaused = false;


    items.forEach(
        item => {

            item.collected = false;

        }
    );


    startScreen.classList.add(
        "hidden"
    );

    messageBox.classList.add(
        "hidden"
    );

    winScreen.classList.add(
        "hidden"
    );

    failScreen.classList.add(
        "hidden"
    );


    updateUI();

    updateMission();

}


// ======================================================
// RESTART
// ======================================================

document
    .getElementById("restartButton")
    .addEventListener(
        "click",
        () => {

            resetGame();

            gameStarted = true;

            lastTime = performance.now();

        }
    );


// ======================================================
// RETRY AFTER FAILURE
// ======================================================

document
    .getElementById("retryButton")
    .addEventListener(
        "click",
        () => {

            resetGame();

            gameStarted = true;

            lastTime = performance.now();

            addLog(
                "Mission restarted. You have 120 seconds."
            );

        }
    );


// ======================================================
// MESSAGE CLOSE
// ======================================================

document
    .getElementById("closeMessage")
    .addEventListener(
        "click",
        () => {

            messageBox.classList.add(
                "hidden"
            );

            lastTime =
                performance.now();

        }
    );


// ======================================================
// KEY DOWN
// ======================================================

window.addEventListener(
    "keydown",
    event => {

        const key =
            event.key.toLowerCase();


        keys[key] = true;


        // Prevent page scrolling

        if (
            [
                "arrowup",
                "arrowdown",
                "arrowleft",
                "arrowright",
                " "
            ].includes(key)
        ) {

            event.preventDefault();

        }


        // INTERACT

        if (
            key === "e" &&
            gameStarted &&
            !gamePaused
        ) {

            interact();

        }


        // PAUSE

        if (
            key === "p" &&
            gameStarted
        ) {

            gamePaused =
                !gamePaused;


            addLog(
                gamePaused
                    ? "Game paused. Press P to continue."
                    : "Game resumed."
            );


            lastTime =
                performance.now();

        }

    }
);


// ======================================================
// KEY UP
// ======================================================

window.addEventListener(
    "keyup",
    event => {

        keys[
            event.key.toLowerCase()
        ] = false;

    }
);


// ======================================================
// UPDATE UI
// ======================================================

function updateUI() {

    timerElement.textContent =
        formatTime(
            gameSeconds
        );


    scoreElement.textContent =
        score;


    batteryElement.textContent =
        Math.max(
            0,
            Math.floor(battery)
        ) + "%";


    signalElement.textContent =
        signals + " / 3";


    cluesElement.textContent =
        clues + " / 3";

}


// ======================================================
// FORMAT TIME
// ======================================================

function formatTime(seconds) {

    const minutes =
        Math.floor(seconds / 60);

    const secs =
        Math.floor(seconds % 60);


    return String(minutes)
        .padStart(2, "0")
        +
        ":" +
        String(secs)
        .padStart(2, "0");

}


// ======================================================
// MISSION
// ======================================================

function updateMission() {

    if (signals === 0) {

        missionTitle.textContent =
            "Find the first signal";

        missionText.textContent =
            "Explore the city and locate the mysterious transmission.";

    }

    else if (signals === 1) {

        missionTitle.textContent =
            "Follow the transmission";

        missionText.textContent =
            "The signal has moved. Search the city for another transmission.";

    }

    else if (signals === 2) {

        missionTitle.textContent =
            "Find the final signal";

        missionText.textContent =
            "One signal remains. Stay away from the surveillance drones.";

    }

    else if (clues < 3) {

        missionTitle.textContent =
            "Recover the remaining clues";

        missionText.textContent =
            "You found the transmissions. Now discover who sent them.";

    }

    else {

        missionTitle.textContent =
            "Mission complete";

        missionText.textContent =
            "You discovered the truth behind the last signal.";

    }

}


// ======================================================
// LOG
// ======================================================

function addLog(message) {

    logElement.textContent =
        message;

}


// ======================================================
// MESSAGE
// ======================================================

function showMessage(
    title,
    text
) {

    document.getElementById(
        "messageTitle"
    ).textContent = title;


    document.getElementById(
        "messageText"
    ).textContent = text;


    messageBox.classList.remove(
        "hidden"
    );

}


// ======================================================
// DISTANCE
// ======================================================

function distance(a, b) {

    return Math.hypot(
        a.x - b.x,
        a.y - b.y
    );

}


// ======================================================
// COLLISION
// ======================================================

function circleRectangleCollision(
    circle,
    rectangle
) {

    const closestX =
        Math.max(
            rectangle.x,
            Math.min(
                circle.x,
                rectangle.x +
                rectangle.w
            )
        );


    const closestY =
        Math.max(
            rectangle.y,
            Math.min(
                circle.y,
                rectangle.y +
                rectangle.h
            )
        );


    const dx =
        circle.x -
        closestX;


    const dy =
        circle.y -
        closestY;


    return Math.sqrt(
        dx * dx +
        dy * dy
    ) < circle.size;

}


// ======================================================
// BLOCKED?
// ======================================================

function blocked(
    x,
    y
) {

    const testPlayer = {

        x: x,

        y: y,

        size: player.size

    };


    // Canvas boundaries

    if (
        x - player.size < 0 ||
        x + player.size > canvas.width ||
        y - player.size < 0 ||
        y + player.size > canvas.height
    ) {

        return true;

    }


    // Buildings

    return buildings.some(
        building =>
            circleRectangleCollision(
                testPlayer,
                building
            )
    );

}


// ======================================================
// MOVE PLAYER
// ======================================================

function movePlayer(deltaTime) {

    let dx = 0;

    let dy = 0;


    if (
        keys["w"] ||
        keys["arrowup"]
    ) {

        dy -= 1;

        player.direction =
            "up";

    }


    if (
        keys["s"] ||
        keys["arrowdown"]
    ) {

        dy += 1;

        player.direction =
            "down";

    }


    if (
        keys["a"] ||
        keys["arrowleft"]
    ) {

        dx -= 1;

        player.direction =
            "left";

    }


    if (
        keys["d"] ||
        keys["arrowright"]
    ) {

        dx += 1;

        player.direction =
            "right";

    }


    // Nothing pressed

    if (
        dx === 0 &&
        dy === 0
    ) {

        return;

    }


    // Normalize diagonal movement

    const length =
        Math.hypot(
            dx,
            dy
        );


    dx /= length;

    dy /= length;


    const move =
        player.speed *
        deltaTime;


    const newX =
        player.x +
        dx * move;


    const newY =
        player.y +
        dy * move;


    // Horizontal collision

    if (
        !blocked(
            newX,
            player.y
        )
    ) {

        player.x =
            newX;

    }


    // Vertical collision

    if (
        !blocked(
            player.x,
            newY
        )
    ) {

        player.y =
            newY;

    }


    // Battery slowly decreases

    battery -=
        0.7 *
        deltaTime;


    if (battery < 0) {

        battery = 0;

    }

}


// ======================================================
// NEAREST ITEM
// ======================================================

function getNearbyItem() {

    let nearest = null;

    let nearestDistance = 9999;


    items.forEach(
        item => {

            if (
                item.collected
            ) {

                return;

            }


            const d =
                distance(
                    player,
                    item
                );


            if (
                d < 42 &&
                d < nearestDistance
            ) {

                nearest =
                    item;

                nearestDistance =
                    d;

            }

        }
    );


    return nearest;

}


// ======================================================
// INTERACTION
// ======================================================

function interact() {

    const item =
        getNearbyItem();


    if (!item) {

        addLog(
            "Nothing nearby to interact with."
        );

        return;

    }


    item.collected =
        true;


    // =========================
    // BATTERY
    // =========================

    if (
        item.type ===
        "battery"
    ) {

        battery =
            Math.min(
                100,
                battery + 25
            );


        score += 100;


        addLog(
            "🔋 Battery collected. +100 points."
        );

    }


    // =========================
    // SIGNAL
    // =========================

    if (
        item.type ===
        "signal"
    ) {

        signals++;

        score += 250;


        if (
            signals === 1
        ) {

            showMessage(
                "SIGNAL 01",
                "Someone is transmitting from inside Kigali. The message says: 'If you can hear this, keep following the signal.'"
            );

        }


        else if (
            signals === 2
        ) {

            showMessage(
                "SIGNAL 02",
                "The sender knows you are following them. The next transmission is coming from the eastern district."
            );

        }


        else {

            showMessage(
                "FINAL SIGNAL",
                "You found the final transmission. Now recover the clues and identify the sender."
            );

        }


        addLog(
            "📡 Signal recovered. +250 points."
        );


        updateMission();

    }


    // =========================
    // CLUE
    // =========================

    if (
        item.type ===
        "clue"
    ) {

        clues++;

        score += 150;


        if (
            clues === 1
        ) {

            showMessage(
                "CLUE FOUND",
                "You found a damaged radio marked RWN-2045. It appears to belong to an emergency communication team."
            );

        }


        else if (
            clues === 2
        ) {

            showMessage(
                "CLUE FOUND",
                "A handwritten message says: 'When Kigali goes silent, follow the blue signal.'"
            );

        }


        else {

            showMessage(
                "FINAL CLUE",
                "The final clue reveals the truth: engineers were secretly rebuilding Kigali's emergency communication network."
            );

        }


        addLog(
            "🔑 Clue recovered. +150 points."
        );


        updateMission();

    }


    updateUI();


    // Check victory

    if (
        signals === 3 &&
        clues === 3
    ) {

        finishGame();

    }

}


// ======================================================
// UPDATE DRONES
// ======================================================

function updateDrones(deltaTime) {

    drones.forEach(
        drone => {

            drone.x +=
                drone.dx *
                deltaTime *
                60;


            if (
                drone.x < 300 ||
                drone.x > 1100
            ) {

                drone.dx *= -1;

            }


            if (
                distance(
                    player,
                    drone
                ) < 30
            ) {

                battery -=
                    8 *
                    deltaTime;


                score =
                    Math.max(
                        0,
                        score - 10
                    );


                addLog(
                    "🚨 WARNING! Drone detected you. -10 points."
                );

            }

        }
    );

}


// ======================================================
// UPDATE CARS
// ======================================================

function carRectangle(car) {
    return {
        x: car.x - car.width / 2,
        y: car.y - car.height / 2,
        w: car.width,
        h: car.height
    };
}

function circleRectOverlap(circle, rect) {
    const closestX = Math.max(rect.x, Math.min(circle.x, rect.x + rect.w));
    const closestY = Math.max(rect.y, Math.min(circle.y, rect.y + rect.h));
    return Math.hypot(circle.x - closestX, circle.y - closestY) < circle.size;
}

function carsOverlap(a, b) {
    const ra = carRectangle(a);
    const rb = carRectangle(b);
    return (
        ra.x < rb.x + rb.w &&
        ra.x + ra.w > rb.x &&
        ra.y < rb.y + rb.h &&
        ra.y + ra.h > rb.y
    );
}

function failGame(reason) {
    if (gameFailed || gameWon) return;

    gameFailed = true;
    gameStarted = false;
    gamePaused = false;

    document.getElementById("failReason").textContent = reason;
    document.getElementById("failTime").textContent = formatTime(gameSeconds);
    document.getElementById("failScore").textContent = score;

    failScreen.classList.remove("hidden");

    addLog("❌ MISSION FAILED — " + reason);
    updateUI();
}

function checkVehicleCollisions() {
    for (const car of cars) {
        if (circleRectOverlap(player, carRectangle(car))) {
            failGame("You crashed into a car. Avoid the traffic and try again.");
            return true;
        }
    }

    for (let i = 0; i < cars.length; i++) {
        for (let j = i + 1; j < cars.length; j++) {
            if (carsOverlap(cars[i], cars[j])) {
                failGame("Two cars crashed into each other. The mission has failed.");
                return true;
            }
        }
    }

    return false;
}

function updateCars(deltaTime) {
    cars.forEach(car => {
        car.x += car.speed * car.direction * deltaTime * 60;

        if (car.x > canvas.width + 60) car.x = -60;
        if (car.x < -60) car.x = canvas.width + 60;
    });

    checkVehicleCollisions();
}

// ======================================================
// DRAW BACKGROUND
// ======================================================

function drawBackground() {

    ctx.fillStyle =
        "#07131f";

    ctx.fillRect(
        0,
        0,
        canvas.width,
        canvas.height
    );


    // Roads

    ctx.fillStyle =
        "#152b3c";


    ctx.fillRect(
        0,
        220,
        canvas.width,
        55
    );


    ctx.fillRect(
        0,
        445,
        canvas.width,
        55
    );


    ctx.fillRect(
        330,
        0,
        55,
        canvas.height
    );


    ctx.fillRect(
        700,
        0,
        55,
        canvas.height
    );


    // Road lines

    ctx.strokeStyle =
        "#476174";

    ctx.lineWidth = 2;

    ctx.setLineDash([
        18,
        15
    ]);


    ctx.beginPath();

    ctx.moveTo(
        0,
        247
    );

    ctx.lineTo(
        canvas.width,
        247
    );


    ctx.moveTo(
        0,
        472
    );

    ctx.lineTo(
        canvas.width,
        472
    );


    ctx.moveTo(
        357,
        0
    );

    ctx.lineTo(
        357,
        canvas.height
    );


    ctx.moveTo(
        727,
        0
    );

    ctx.lineTo(
        727,
        canvas.height
    );


    ctx.stroke();


    ctx.setLineDash([]);


    // City dots

    for (
        let x = 20;
        x < canvas.width;
        x += 75
    ) {

        for (
            let y = 20;
            y < canvas.height;
            y += 75
        ) {

            ctx.fillStyle =
                "#163044";

            ctx.fillRect(
                x,
                y,
                3,
                3
            );

        }

    }

}


// ======================================================
// BUILDINGS
// ======================================================

function drawBuildings() {

    buildings.forEach(
        building => {

            // Shadow

            ctx.fillStyle =
                "#02080d";

            ctx.fillRect(
                building.x + 8,
                building.y + 8,
                building.w,
                building.h
            );


            // Building

            ctx.fillStyle =
                "#263f50";

            ctx.fillRect(
                building.x,
                building.y,
                building.w,
                building.h
            );


            // Border

            ctx.strokeStyle =
                "#486879";

            ctx.lineWidth = 2;

            ctx.strokeRect(
                building.x,
                building.y,
                building.w,
                building.h
            );


            // Windows

            for (
                let x =
                    building.x + 18;

                x <
                    building.x +
                    building.w - 12;

                x += 32
            ) {

                for (
                    let y =
                        building.y + 18;

                    y <
                        building.y +
                        building.h - 15;

                    y += 30
                ) {

                    ctx.fillStyle =
                        "#86a9b8";

                    ctx.fillRect(
                        x,
                        y,
                        10,
                        8
                    );

                }

            }


            ctx.fillStyle =
                "#7893a2";

            ctx.font =
                "10px Arial";


            ctx.fillText(
                building.name,
                building.x + 10,
                building.y +
                building.h -
                10
            );

        }
    );

}


// ======================================================
// STREET LIGHTS
// ======================================================

function drawStreetLights() {

    const lights = [

        [25, 210],
        [310, 210],
        [680, 210],
        [1100, 210],

        [25, 435],
        [310, 435],
        [680, 435],
        [1100, 435]

    ];


    lights.forEach(
        ([x, y]) => {

            ctx.strokeStyle =
                "#536b78";

            ctx.lineWidth = 3;

            ctx.beginPath();

            ctx.moveTo(
                x,
                y
            );

            ctx.lineTo(
                x,
                y - 25
            );

            ctx.stroke();


            ctx.fillStyle =
                "#d8e6b0";

            ctx.beginPath();

            ctx.arc(
                x,
                y - 27,
                5,
                0,
                Math.PI * 2
            );

            ctx.fill();

        }
    );

}


// ======================================================
// CARS
// ======================================================

function drawCars() {

    cars.forEach(
        car => {

            ctx.save();

            ctx.translate(
                car.x,
                car.y
            );


            ctx.fillStyle =
                "#ba4e58";

            ctx.fillRect(
                -22,
                -8,
                44,
                16
            );


            ctx.fillStyle =
                "#7d3842";

            ctx.fillRect(
                -12,
                -14,
                24,
                7
            );


            ctx.fillStyle =
                "#8bb0bd";

            ctx.fillRect(
                -8,
                -12,
                7,
                5
            );

            ctx.fillRect(
                2,
                -12,
                7,
                5
            );


            ctx.fillStyle =
                "#05090c";

            ctx.beginPath();

            ctx.arc(
                -13,
                9,
                5,
                0,
                Math.PI * 2
            );

            ctx.arc(
                13,
                9,
                5,
                0,
                Math.PI * 2
            );

            ctx.fill();


            ctx.restore();

        }
    );

}


// ======================================================
// ITEMS
// ======================================================

function drawItems() {

    items.forEach(
        item => {

            if (
                item.collected
            ) {

                return;

            }


            // Battery

            if (
                item.type ===
                "battery"
            ) {

                ctx.fillStyle =
                    "#5ee391";

                ctx.fillRect(
                    item.x - 9,
                    item.y - 12,
                    18,
                    24
                );


                ctx.fillStyle =
                    "#0b1c24";

                ctx.fillRect(
                    item.x - 4,
                    item.y - 6,
                    8,
                    12
                );

            }


            // Signal

            if (
                item.type ===
                "signal"
            ) {

                const pulse =
                    Math.sin(
                        gameTime * .08
                    ) * 4;


                ctx.strokeStyle =
                    "#55d6ff";

                ctx.lineWidth = 3;


                ctx.beginPath();

                ctx.arc(
                    item.x,
                    item.y,
                    9 + pulse,
                    0,
                    Math.PI * 2
                );

                ctx.stroke();


                ctx.beginPath();

                ctx.arc(
                    item.x,
                    item.y,
                    18 + pulse,
                    0,
                    Math.PI * 2
                );

                ctx.stroke();


                ctx.fillStyle =
                    "#55d6ff";

                ctx.beginPath();

                ctx.arc(
                    item.x,
                    item.y,
                    4,
                    0,
                    Math.PI * 2
                );

                ctx.fill();

            }


            // Clue

            if (
                item.type ===
                "clue"
            ) {

                ctx.fillStyle =
                    "#e8c35b";

                ctx.fillRect(
                    item.x - 12,
                    item.y - 8,
                    24,
                    16
                );


                ctx.fillStyle =
                    "#554718";

                ctx.fillRect(
                    item.x - 7,
                    item.y - 4,
                    14,
                    2
                );

                ctx.fillRect(
                    item.x - 7,
                    item.y + 2,
                    9,
                    2
                );

            }

        }
    );

}


// ======================================================
// DRONES
// ======================================================

function drawDrones() {

    drones.forEach(
        drone => {

            ctx.strokeStyle =
                "rgba(230,70,80,.18)";

            ctx.lineWidth = 2;

            ctx.beginPath();

            ctx.arc(
                drone.x,
                drone.y,
                32,
                0,
                Math.PI * 2
            );

            ctx.stroke();


            ctx.fillStyle =
                "#e05261";

            ctx.beginPath();

            ctx.arc(
                drone.x,
                drone.y,
                drone.size,
                0,
                Math.PI * 2
            );

            ctx.fill();


            ctx.fillStyle =
                "#111c24";

            ctx.fillRect(
                drone.x - 9,
                drone.y - 3,
                18,
                6
            );

        }
    );

}


// ======================================================
// PLAYER
// ======================================================

function drawPlayer() {

    ctx.save();


    ctx.translate(
        player.x,
        player.y
    );


    // Shadow

    ctx.fillStyle =
        "rgba(0,0,0,.5)";

    ctx.beginPath();

    ctx.ellipse(
        0,
        17,
        13,
        5,
        0,
        0,
        Math.PI * 2
    );

    ctx.fill();


    // Body

    ctx.fillStyle =
        "#2387a5";

    ctx.fillRect(
        -10,
        -1,
        20,
        19
    );


    // Head

    ctx.fillStyle =
        "#d99b76";

    ctx.beginPath();

    ctx.arc(
        0,
        -11,
        9,
        0,
        Math.PI * 2
    );

    ctx.fill();


    // Hair

    ctx.fillStyle =
        "#16191c";

    ctx.beginPath();

    ctx.arc(
        0,
        -14,
        9,
        Math.PI,
        Math.PI * 2
    );

    ctx.fill();


    // Phone

    ctx.fillStyle =
        "#55d6ff";


    ctx.fillRect(
        10,
        -3,
        5,
        10
    );


    // Player circle

    ctx.strokeStyle =
        "rgba(85,214,255,.4)";

    ctx.lineWidth = 2;

    ctx.beginPath();

    ctx.arc(
        0,
        0,
        25,
        0,
        Math.PI * 2
    );

    ctx.stroke();


    ctx.restore();

}


// ======================================================
// CITY LABELS
// ======================================================

function drawCityLabels() {

    ctx.fillStyle =
        "#6d8999";

    ctx.font =
        "12px Arial";


    ctx.fillText(
        "KIGALI — EAST DISTRICT",
        18,
        25
    );


    ctx.fillStyle =
        "#55d6ff";

    ctx.fillText(
        "UNKNOWN SIGNAL →",
        1020,
        25
    );

}


// ======================================================
// INTERACTION PROMPT
// ======================================================

function updateInteractionPrompt() {

    const item =
        getNearbyItem();


    if (
        item &&
        gameStarted &&
        !gamePaused
    ) {

        interactionPrompt.classList.remove(
            "hidden"
        );

    }

    else {

        interactionPrompt.classList.add(
            "hidden"
        );

    }

}


// ======================================================
// FINISH GAME
// ======================================================

function finishGame() {

    gameWon = true;

    gameStarted = false;


    // Time bonus

    const timeBonus =
        Math.max(
            0,
            600 -
            Math.floor(
                gameSeconds * 5
            )
        );


    // Battery bonus

    const batteryBonus =
        Math.floor(
            battery * 2
        );


    score +=
        timeBonus +
        batteryBonus;


    let grade = "D";

    let message =
        "You completed the mission, but there is room for improvement.";


    if (
        score >= 2400
    ) {

        grade = "S";

        message =
            "Outstanding! You completed the mission like a professional agent.";

    }

    else if (
        score >= 2000
    ) {

        grade = "A";

        message =
            "Excellent work! You solved the mystery quickly and efficiently.";

    }

    else if (
        score >= 1600
    ) {

        grade = "B";

        message =
            "Good job! Kigali is connected again.";

    }

    else if (
        score >= 1200
    ) {

        grade = "C";

        message =
            "Mission complete, but you could improve your speed.";

    }


    document.getElementById(
        "finalTime"
    ).textContent =
        formatTime(
            gameSeconds
        );


    document.getElementById(
        "finalScore"
    ).textContent =
        score;


    document.getElementById(
        "finalGrade"
    ).textContent =
        grade;


    document.getElementById(
        "gradeMessage"
    ).textContent =
        message;


    winScreen.classList.remove(
        "hidden"
    );


    updateUI();

}


// ======================================================
// UPDATE GAME
// ======================================================

function update(
    timestamp
) {

    if (
        !lastTime
    ) {

        lastTime =
            timestamp;

    }


    let deltaTime =
        (
            timestamp -
            lastTime
        ) / 1000;


    // Prevent giant jumps

    deltaTime =
        Math.min(
            deltaTime,
            0.05
        );


    lastTime =
        timestamp;


    if (
        gameStarted &&
        !gameWon &&
        !gameFailed &&
        !gamePaused
    ) {

        gameSeconds +=
            deltaTime;

        if (gameSeconds >= 120) {

            gameSeconds = 120;

            failGame(
                "Time is up. The 120-second mission limit was reached."
            );

            draw();

            requestAnimationFrame(update);

            return;

        }


        gameTime +=
            deltaTime *
            60;


        movePlayer(
            deltaTime
        );


        updateDrones(
            deltaTime
        );


        updateCars(
            deltaTime
        );


        updateInteractionPrompt();


        updateUI();

    }


    draw();


    requestAnimationFrame(
        update
    );

}


// ======================================================
// DRAW
// ======================================================

function draw() {

    drawBackground();

    drawBuildings();

    drawStreetLights();

    drawCars();

    drawItems();

    drawDrones();

    drawPlayer();

    drawCityLabels();


    // Pause display

    if (
        gamePaused
    ) {

        ctx.fillStyle =
            "rgba(0,0,0,.55)";

        ctx.fillRect(
            0,
            0,
            canvas.width,
            canvas.height
        );


        ctx.fillStyle =
            "#55d6ff";

        ctx.font =
            "bold 32px Arial";

        ctx.textAlign =
            "center";

        ctx.fillText(
            "PAUSED",
            canvas.width / 2,
            canvas.height / 2
        );


        ctx.font =
            "14px Arial";

        ctx.fillStyle =
            "#b9cbd5";

        ctx.fillText(
            "Press P to continue",
            canvas.width / 2,
            canvas.height / 2 + 30
        );


        ctx.textAlign =
            "left";

    }

}


// ======================================================
// START LOOP
// ======================================================

requestAnimationFrame(
    update
);