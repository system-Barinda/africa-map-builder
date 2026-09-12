# ORBIT — Neon Logic Puzzle (Enhanced)

This version expands the original screenshot-inspired prototype into a complete replayable browser game.

## Run

No npm, Node.js, server, framework, or internet connection is required.

1. Extract the ZIP.
2. Open `index.html` in Chrome, Edge, or Firefox.
3. Press **PLAY**.
4. Rotate with the left/right controls or keyboard arrow keys.
5. Reach the cyan checker gate.
6. Avoid pink obstacles.
7. Use **Undo** when you make a mistake.

## Retention features included

- 50 progressive levels
- Move limits
- 1–3 star scoring
- Best-move records
- Unlockable levels
- Local save using `localStorage`
- Daily challenge with daily best and streak
- Coins ("Orbs")
- Four visual themes
- Theme shop
- Retry / next-level flow
- Particle effects
- Collision feedback
- Responsive mobile/desktop controls
- Keyboard controls
- Sound effects and mute button

## Sound design

The game uses **Web Audio API synthesized sound effects** instead of downloading third-party copyrighted audio files. This keeps the project self-contained and avoids shipping an asset with unclear licensing.

Sounds are triggered for:
- button click
- orbit rotation
- undo
- collision
- level completion
- unlock/reward

This also means the game works offline.

## Controls

- Left button / Left Arrow: rotate counter-clockwise
- Right button / Right Arrow: rotate clockwise
- Play: start/pause the puzzle
- Undo: undo the last rotation
- Home: return to the main screen
- Mute: toggle sound

## Product direction

This is still a front-end prototype. A production release would add a backend for real accounts, cloud progress, global leaderboards, anti-cheat validation, analytics, and secure purchases.
