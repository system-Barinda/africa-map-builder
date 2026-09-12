# Draw Your Africa — Enhanced Edition

This folder is a runnable continuation of the previous audio-enabled Draw the Map project.

## Run
1. Open this folder in VS Code.
2. Open `index.html`.
3. Use Live Server if available for the smoothest browser experience.
4. Click **Play Game** once to unlock Web Audio in the browser.

## Included
- Existing playable East Africa drag-and-drop game
- Web Audio sound system
- 60-second timer
- score/progress/streak
- hints and discovery flow where supported
- responsive desktop/tablet/mobile layout
- offline-friendly local assets
- full redesign requirements in `ENHANCED-REDESIGN-PROMPT.md`

## Important geography note
The previous prototype's country silhouettes are simplified SVG paths. The supplied redesign prompt explicitly requires accurate geographical boundary data and says not to use placeholder shapes. Therefore, for a true production/presentation version, replace those prototype paths with a single authoritative GeoJSON/SVG boundary dataset for the selected East African countries, then use the same transformed coordinates for:
- the central empty target map,
- draggable country pieces,
- and the smaller reference map.

This keeps target and piece geometry mathematically aligned instead of manually approximated.

## Recommended next implementation pass
1. Add authoritative offline geographic boundary data.
2. Generate the central target SVG and draggable pieces from the same source geometry.
3. Add the second reference map.
4. Add close/wrong placement zones and target highlighting.
5. Add full map-building glow/particles.
6. Add country discovery + sports spotlight cards.
7. Add hint/cheat-joke escalation.
8. Re-test Pointer Events on mouse, touch, and stylus.
