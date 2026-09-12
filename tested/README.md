# Draw the Map — Audio Edition 🌍🔊

A complete offline browser game for VS Code.

## Run

1. Extract the ZIP.
2. Open the `draw-the-map-audio` folder in VS Code.
3. Open `index.html`.
4. Right-click it and choose **Open with Live Server**, or double-click `index.html`.
5. Click **Play Game**. Browsers normally require a user click before Web Audio can start, so the Play button is the first audio interaction.

## Audio system

All sound is generated locally with the Web Audio API. There are no external audio files, CDNs, APIs, or internet dependencies.

Included functions:

- `playButtonSound()`
- `playPickupSound()`
- `playDropSound()`
- `playCorrectSound()`
- `playWrongSound()`
- `playCountdownSound()`
- `playTimeUpSound()`
- `playVictorySound()`
- `playUnlockSound()`
- `playScoreSound()`
- `playBonusSound()`
- `playTypingSound()`
- `playStartSound()`
- `playStreakSound()`

## Gameplay

- 8 country-shaped SVG pieces
- Uganda, Kenya, Rwanda, Burundi, Tanzania, South Sudan, Ethiopia and Somalia
- Pieces are shuffled
- Drag the actual map shape, not the country name
- Correct shape snaps into the matching map position
- Wrong placement gives gentle error feedback
- 60-second countdown
- Countdown ticks during the final 10 seconds
- Time-out screen with Try Again / Back to Menu
- Correct placement score
- Quick-placement bonus
- 3+ country streaks
- Victory sequence and final score
- Sound ON/OFF
- Volume slider
- Sound/volume preference saved with localStorage
- Mobile touch support

## Presentation

The strongest demo flow is:

Play Game → hear start sequence → drag Rwanda → hear pickup/drop/success → show capital discovery → make one wrong placement → demonstrate gentle error → place remaining countries → show streak/bonus → complete map → hear victory → show final score.

## Note

This prototype uses simplified SVG geographic silhouettes. For a production release, replace them with accurate geographic boundary data while keeping the same audio and game logic.
