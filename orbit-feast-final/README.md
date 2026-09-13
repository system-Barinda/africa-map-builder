# Orbit Feast — Screenshot-inspired orbit puzzle

## Run
Open `index.html` in Chrome, Edge, or Firefox. No npm, Node.js, server, or framework is required.

## How to play
1. Press the pink Play triangle.
2. Press either arrow button. **Every object moves on every move.**
3. The cyan ball is the player.
4. Pink balls are food. When the cyan ball meets one, it eats it and a sound plays.
5. At the crossing of the two rings, the cyan ball can transfer from one orbit to the other. A different sound plays.
6. Continue until every pink ball is gone.
7. The cyan ball grows after each eaten ball and shows small cyan orbiting sparks.
8. When all pink balls are eaten, move the cyan ball into the cyan checkerboard gate on the right to win.

## Game systems
- Limited moves
- Countdown timer
- Progressive levels
- More balls as levels increase
- 1–3 stars
- Retry / next level
- Undo
- Adjustable pink-ball count (3–12)
- Adjustable timer (20–120 seconds)
- Sound / mute
- Keyboard: Space, arrows, Z, M
- Local settings saved in browser

## Sound
The game uses the browser Web Audio API to synthesize short original game sounds. This keeps the project offline and avoids bundling unknown/copyrighted audio files.
