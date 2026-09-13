# Orbit 9 — HTML/CSS/JavaScript Game

A standalone browser recreation inspired by the supplied screenshot.

## Run

No Node.js, npm, framework, or server is required.

1. Extract this folder.
2. Open `index.html` in Chrome, Edge, or Firefox.
3. Press the pink play button.
4. Use the cyan ↑ control / keyboard arrows to rotate.
5. Use the dark cyan ↓ control for the opposite direction.
6. `Z` or the curved arrow button undoes the last move.

## Files

- `index.html` — game structure
- `style.css` — portrait neon visual design
- `script.js` — game loop, orbit math, controls, collision, target, undo, level progression

## Notes

The original screenshot does not expose its exact game rules, so this implementation reproduces the visible composition and builds a playable orbit-rotation mechanic around it.
