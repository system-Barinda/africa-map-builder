# 🌍 DRAW YOUR AFRICA — MAP REDESIGN & GAMEPLAY PROMPT

You are an expert game UI/UX designer, frontend developer, SVG/map specialist, and interactive game developer.

I am building **Draw Your Africa**, an educational geography game for the **SportsBiz Africa Game Development Garage 2026**.

The core gameplay must remain:

> **SEE → IDENTIFY → DRAG → PLACE → SNAP → DISCOVER → SCORE**

The player must physically drag **real geographical country-shaped pieces** into their correct locations on an East African map.

Do NOT turn this into a quiz, card game, or static mockup.

The result must be a **real, playable, polished browser game**.

---

# 1. MOST IMPORTANT CHANGE — REDESIGN THE MAP BOARD

I want the main gameplay screen redesigned around TWO MAPS.

## CENTER: EMPTY EAST AFRICA BLUEPRINT

The center of the screen must contain a **large East Africa map blueprint**.

This is the main gameplay area.

The blueprint should initially show ONLY the map outlines/strokes.

### VERY IMPORTANT:

The outline/stroke must be:

* bold
* dark and highly visible
* clean
* smooth
* geographically accurate
* easy to see immediately
* visually attractive
* clearly separated from the background

Do NOT use a thin, barely visible line.

The player should immediately recognize:

> "This is an East Africa map waiting to be completed."

The center map should show the geographical boundaries of the countries as empty target regions.

For example:

* Rwanda target outline
* Burundi target outline
* Uganda target outline
* Kenya target outline
* Tanzania target outline
* South Sudan target outline
* Ethiopia target outline
* Somalia target outline

The countries should initially appear empty/transparent.

The player fills these empty regions by dragging the corresponding country-shaped pieces into them.

---

# 2. ACCURACY IS CRITICAL

The geographical map must resemble the **real East African map**.

Do NOT draw random blobs.

Do NOT use generic shapes.

Do NOT use rectangles.

Do NOT use emoji as country pieces.

Do NOT use approximate cartoon country shapes when accurate geographical SVG data is available.

Use **real geographical SVG path data** or another reliable geographical representation.

Every country's:

* shape
* proportions
* orientation
* neighboring relationships
* relative position
* coastline
* borders

should be as geographically accurate as reasonably possible.

The target map and draggable country pieces must use the SAME geographical coordinate system or accurately transformed versions of the same shapes.

This is extremely important because the player should feel like they are physically rebuilding a real map.

---

# 3. THE DRAGGABLE PIECES MUST BE REAL COUNTRY SHAPES

The player must drag actual country silhouettes.

For example:

### Rwanda

The draggable object should literally look like the geographical shape of Rwanda.

The player grabs the Rwanda-shaped SVG and moves it to the Rwanda-shaped empty region in the center map.

Same for:

* Burundi
* Uganda
* Kenya
* Tanzania
* South Sudan
* Ethiopia
* Somalia

Do NOT make the player drag:

> [ RWANDA ]

or:

> [ 🇷🇼 Rwanda ]

or:

> [ Country Card ]

The physical country shape IS the game mechanic.

---

# 4. SECOND MAP — REAL REFERENCE MAP

Place a **smaller, fully visible East Africa reference map** on the opposite side of the screen.

This should be called something like:

## 🧭 AFRICA NAVIGATOR

or:

## 🗺️ MAP GUIDE

This map should show a more complete/realistic colored version of East Africa.

Its purpose is to help the player recognize geographical positions.

However, it should NOT completely solve the challenge.

The player still has to identify the shape and drag it themselves.

The reference map should:

* be smaller than the main map
* remain clearly visible
* have recognizable country boundaries
* use attractive but not overwhelming colors
* feel like a navigation tool
* visually support the main game
* not distract from the central map

Add a small humorous message such as:

> "Lost? Take a look. I won't tell anyone. 👀"

or:

> "Need a little help? Your map is over here. 😉"

Keep the humor subtle.

---

# 5. SCREEN LAYOUT

On desktop, use a layout similar to:

```text
┌─────────────────────────────────────────────────────────────────┐
│ DRAW YOUR AFRICA 🌍        ⭐ SCORE    🧩 0/8       ⏱️ 60       │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  🧭 MAP GUIDE              MAIN EAST AFRICA BLUEPRINT            │
│                                                                 │
│  REAL COLORED              ┌───────────────────────────────┐     │
│  EAST AFRICA               │                               │     │
│  REFERENCE MAP             │      BOLD MAP OUTLINES        │     │
│                            │                               │     │
│  "Need help? 👀"           │       EMPTY COUNTRY          │     │
│                            │       TARGET REGIONS          │     │
│                            │                               │     │
│                            └───────────────────────────────┘     │
│                                                                 │
├─────────────────────────────────────────────────────────────────┤
│                    COUNTRY PIECES                                │
│                                                                 │
│        🗺️       🗺️       🗺️       🗺️       🗺️                   │
│       actual geographical country shapes                        │
└─────────────────────────────────────────────────────────────────┘
```

The exact layout can be improved by you, but the concept must remain.

---

# 6. MAKE THE GAME CHALLENGING

I do NOT want the game to be too easy.

Randomize:

* country piece positions
* piece order
* slight rotation
* slight starting scale
* distance from target

Never randomize:

* real country shape
* correct geographical position
* target boundaries
* country identity

The pieces should be scattered around the gameplay area.

Do not place a piece directly next to its correct target.

The player should have to think:

> "Wait... where does this shape actually go?"

That moment of thinking is part of the game.

---

# 7. ADD A "CLOSE BUT WRONG" EXPERIENCE

Make the placement system feel intelligent.

If the player drops a country close to the correct location but not close enough:

Show:

> 👀 "You're close..."

or:

> 🔥 "Getting warmer!"

Then return the piece smoothly to its original position.

If the player drops it completely wrong:

> ❌ "Nope! Africa says try again. 😂"

Then animate the piece with a small shake and return it.

Do NOT punish the player harshly.

The game should encourage them to keep trying.

---

# 8. CORRECT PLACEMENT MUST FEEL AMAZING

When the country is correctly positioned:

### STEP 1

Detect the correct target.

### STEP 2

Smoothly animate the piece into its exact geographical position.

### STEP 3

Make it snap into place.

### STEP 4

Lock the country so it cannot be dragged again.

### STEP 5

Briefly highlight the country.

### STEP 6

Illuminate the border.

### STEP 7

Connect visually with neighboring countries.

### STEP 8

Increase the score.

### STEP 9

Update progress.

### STEP 10

Play a satisfying sound.

### STEP 11

Show a short discovery/story moment.

For example:

> 🎉 RWANDA FOUND!

Then:

> 🇷🇼 RWANDA
> Capital: Kigali

> "Known as the Land of a Thousand Hills, Rwanda is also known for cycling, tourism and innovation."

Then quickly return focus to the map.

---

# 9. MAKE THE MAP BUILD VISUALLY

This is extremely important.

Every time a country is correctly placed, the center map should look more complete.

For example:

### Before placement:

```text
     ┌───────────────┐
     │   EMPTY MAP   │
     │   OUTLINES    │
     └───────────────┘
```

### After Rwanda:

Rwanda becomes filled and visually connected to the neighboring target areas.

### After several countries:

The map becomes progressively more complete.

### After 8/8:

The entire East Africa map becomes a beautiful completed composition.

The player should visually feel:

> "I built this."

That sense of ownership is one of the main purposes of the game.

---

# 10. ADD DRAMATIC MAP ANIMATIONS

Make the game feel alive.

When a country is dragged:

* slightly enlarge it
* add a shadow
* bring it above other pieces
* make it feel physically lifted from the board

When it is close to the target:

* subtle target glow
* optional magnetic effect
* subtle pulse

When correctly placed:

* snap animation
* border glow
* small particles
* map ripple
* score animation
* satisfying sound

When the final country is placed:

Trigger a much bigger effect:

1. Final country snaps in.
2. Entire East Africa map glows.
3. Borders illuminate.
4. Small particles travel across the map.
5. Score counts upward.
6. Celebration sound plays.
7. Text appears:

# 🌍 EAST AFRICA COMPLETE!

Then:

> "You rebuilt East Africa!"

---

# 11. MAKE IT FUNNY

The game should feel educational but NOT boring.

Use short humorous reactions.

Examples:

### When grabbing a piece:

> "Let's see where you belong... 👀"

### Wrong:

> "Hmm... Africa says NO. 😂"

### Very wrong:

> "That country is definitely not there. Nice try though! 😭"

### Close:

> "You're getting warmer! 🔥"

### Correct:

> "YES! THAT FITS! 🎉"

### Fast placement:

> "WOW, SPEEDSTER! ⚡"

### Three correct:

> "MAP STREAK! 🔥"

### Five correct:

> "Okay... you're getting suspiciously good at this. 👀"

### Final:

> "YOU JUST REBUILT EAST AFRICA! 🌍🔥"

Keep the jokes short and tasteful.

The game should still look professional enough for the SportsBiz Africa Game Development Garage.

---

# 12. ADD A "MAP HINT" SYSTEM

The reference map should help without destroying the challenge.

Add an optional:

## 💡 HINT

button.

When clicked:

* briefly highlight the correct target on the center map
* do NOT automatically move the country
* deduct a small number of points OR add a small time penalty

Example:

> 💡 HINT USED — -20 POINTS

This gives the player a choice:

### Challenge themselves

OR

### Ask for help.

---

# 13. MAKE THE REFERENCE MAP INTERACTIVE

When the player selects a country piece, optionally highlight the corresponding country on the reference map very subtly.

Do NOT immediately reveal the target on the main map.

For example, if the player picks up Rwanda:

The reference map can briefly show:

> Rwanda

with a subtle glow.

This provides a learning aid without making the game trivial.

---

# 14. ADD A "CHEAT" JOKE

If the player repeatedly uses hints, show a funny message.

For example:

First hint:

> "Need a little help? 😉"

Second hint:

> "Okay, okay... here's another clue."

Third hint:

> "At this point, we're basically doing it together. 😂"

Do not make this insulting.

---

# 15. VISUAL STYLE

The game must look:

* modern
* energetic
* African-inspired
* polished
* professional
* colorful
* attractive
* slightly adventurous
* slightly playful

It should NOT look like:

* a school assignment
* a basic HTML demo
* an old educational website
* a childish cartoon
* a generic AI-generated dashboard

Use:

* strong typography
* clean spacing
* smooth gradients
* subtle shadows
* rounded UI
* modern cards
* map textures
* African-inspired visual details
* elegant animations

The MAP should remain the visual hero.

---

# 16. COLOR TREATMENT

The central target map should primarily use:

* dark/bold outlines
* transparent or lightly tinted interiors
* clear country boundaries

The reference map can use stronger colors.

The draggable pieces should have attractive colors that make them easy to distinguish from the blueprint.

Do NOT use so many colors that the interface becomes chaotic.

---

# 17. COUNTRY PIECES SHOULD FEEL PHYSICAL

When sitting around the board, each country-shaped piece should look like an actual physical map piece.

Add:

* subtle shadow
* slight depth
* slight rotation
* border
* hover effect
* selected state

When picked up:

```text
scale: 1.05
shadow: stronger
z-index: maximum
rotation: slightly reduced
```

When released:

Correct:

> SNAP!

Wrong:

> SHAKE → RETURN

---

# 18. RESPONSIVE DESIGN

Desktop:

Reference map on one side.

Main blueprint in the center.

Country pieces around/below it.

Tablet:

Reference map becomes smaller.

Main blueprint remains dominant.

Pieces move to the bottom.

Mobile:

Use:

```text
HEADER

REFERENCE MAP
small

MAIN BLUEPRINT
large

COUNTRY PIECES
scrollable area
```

The map must remain large enough to understand.

Use **Pointer Events** so dragging works with:

* mouse
* touch
* stylus

---

# 19. SOUND DESIGN

Keep the complete sound system.

Add sounds for:

* button click
* country pickup
* drag
* drop
* correct placement
* wrong placement
* close placement
* hint
* countdown
* time up
* score
* bonus
* streak
* discovery
* victory
* map completion
* unlock
* typing

The correct placement should have a satisfying:

> DING + SNAP

The final map completion should have a short celebratory musical sequence.

Use Web Audio API or lightweight local sounds.

Include:

🔊 Sound ON

🔇 Sound OFF

The game must remain fully playable without sound.

---

# 20. TIMER

Keep the 60-second challenge.

Display:

> ⏱️ 60

At:

15 seconds:

> subtle warning

10 seconds:

> ticking begins

5 seconds:

> stronger ticking

3 → 2 → 1:

> dramatic countdown

Then:

# TIME'S UP!

The timer should increase the tension without making the game stressful.

---

# 21. PROGRESS HUD

Show:

> ⭐ Score: 0

> 🧩 0/8

> ⏱️ 60

> 🔥 Streak: 0

and a progress bar.

Example:

```text
████░░░░ 4/8
```

The progress bar should animate whenever a country is placed.

---

# 22. SCORE SYSTEM

Use:

Correct:

> +100

Fast:

> +50

Perfect:

> +50

Three-country streak:

> bonus

Five-country streak:

> larger bonus

East Africa completion:

> +300

Hint:

> -20

Wrong placement should have little or no penalty.

The goal is learning + fun, not frustration.

---

# 23. FINAL EAST AFRICA MAP

When all 8 countries are placed:

The completed map should look like a real East African geographical map.

Do not replace it with a generic Africa illustration.

The player should be able to visually compare:

### REFERENCE MAP

with

### MAP THEY BUILT

This creates the feeling:

> "I actually rebuilt the map."

---

# 24. STORYTELLING

After each successful placement, briefly show:

* Country
* Capital
* Interesting fact
* Short story
* Optional sports connection

Example:

## 🇰🇪 KENYA

**Capital:** Nairobi

> "Kenya is famous around the world for its incredible distance runners."

Then:

🏃 SPORTS SPOTLIGHT

> "Athletics is one of Kenya's strongest sporting traditions."

Keep the discovery moment short.

Do not interrupt gameplay for too long.

---

# 25. IMPORTANT — DO NOT MAKE THE REFERENCE MAP TOO EASY

The reference map should help the player understand geography, but the player must still recognize the country shape.

Therefore:

* do not put giant labels everywhere
* do not draw arrows from every country piece
* do not highlight the correct target automatically
* do not show the country name next to the draggable piece

The player should still have to think.

---

# 26. FINAL EXPERIENCE

The entire screen should communicate this journey:

```text
LOOK AT THE MAP
       ↓
SEE A COUNTRY SHAPE
       ↓
THINK
       ↓
GRAB IT
       ↓
DRAG IT
       ↓
"IS THIS RIGHT?"
       ↓
DROP
       ↓
WRONG → FUNNY REACTION → TRY AGAIN

OR

CORRECT
       ↓
SNAP!
       ↓
MAP BUILDS
       ↓
SCORE
       ↓
STORY
       ↓
SPORTS DISCOVERY
       ↓
NEXT COUNTRY
       ↓
EAST AFRICA COMPLETE
```

---

# 27. THE MOST IMPORTANT DESIGN PRINCIPLE

The player must feel like they are **physically rebuilding Africa**.

Not answering questions.

Not matching text.

Not clicking buttons.

Not dragging cards.

They are manipulating real geographical country shapes.

The central bold-outline East Africa map is the construction board.

The smaller real map is the navigator/reference.

The country-shaped SVG pieces are the building blocks.

---

# 28. TECHNICAL REQUIREMENTS

Use:

* HTML5
* CSS3
* Vanilla JavaScript
* SVG
* Pointer Events
* CSS animations
* Web Audio API
* localStorage

Do NOT introduce:

* React
* Node.js
* backend
* database
* npm
* unnecessary frameworks

The game must run locally by opening:

```text
index.html
```

It should work offline whenever possible.

---

# 29. DO NOT FAKE THE MAP

This is one of the most important requirements.

If you need geographical SVG data, use accurate geographical boundary data and convert it into SVG paths.

Do not manually create inaccurate country shapes just to make the prototype work.

The visual accuracy of:

* East Africa
* country silhouettes
* borders
* target positions
* coastlines

is a core part of the game.

---

# 30. DO NOT BREAK THE EXISTING GAME

Preserve the existing features:

* 8 East African countries
* 60-second timer
* scoring
* progress
* randomization
* storytelling
* sports connections
* sound system
* win screen
* Africa Journey
* responsive design
* offline functionality

The main improvement requested here is the **map presentation and gameplay experience**.

---

# 31. FINAL QUALITY STANDARD

Before considering the project complete, test:

### MAP

* Is the East Africa map geographically accurate?
* Are the country borders clear?
* Is the central stroke bold enough?
* Can the player clearly see the target regions?
* Is the reference map useful?

### COUNTRY PIECES

* Are they real geographical shapes?
* Can they be dragged?
* Are they randomized?
* Are they recognizable?
* Do they snap correctly?

### GAMEPLAY

* Correct placement works.
* Wrong placement works.
* Close placement feedback works.
* Pieces return after mistakes.
* Correct pieces lock.
* Progress updates.
* Score updates.
* Timer works.
* Restart works.

### PRESENTATION

The first 10–20 seconds should immediately impress someone watching the game.

A person should look at the screen and immediately understand:

> "You drag real country shapes onto the map to rebuild East Africa."

---

# FINAL INSTRUCTION

Now implement this redesign directly into the existing game.

Do NOT simply explain what the code should do.

Do NOT give me a mockup.

Do NOT give me pseudocode.

Do NOT use placeholder country shapes.

Do NOT use generic rectangles as country pieces.

Build the **actual playable experience**.

Prioritize:

1. Accurate East Africa geography
2. Bold, highly visible central map outline
3. Real country-shaped SVG draggable pieces
4. Smaller real reference map on the opposite side
5. Challenging but fair gameplay
6. Smooth drag-and-drop
7. Funny player reactions
8. Dramatic animations
9. Strong sound feedback
10. Storytelling after placement
11. African sports connections
12. Beautiful modern UI
13. Responsive design
14. Offline functionality
15. Presentation/demo quality

The final experience should feel like:

# 🌍 "I'M BUILDING AFRICA WITH MY OWN HANDS."

And the emotional journey should be:

> **"What shape is this?"**

↓

> **"Where does it go?"**

↓

> **"Wait..."**

↓

> **"I think I got it!"**

↓

> **SNAP!**

↓

> **"YES! 😂🔥"**

↓

> **"Oh! I just learned something about this country."**

↓

> **"Okay... what's next?"**

Make it challenging.

Make it dramatic.

Make it funny.

Make it beautiful.

But most importantly:

# **MAKE THE PLAYER FEEL LIKE THEY ARE ACTUALLY REBUILDING EAST AFRICA. 🌍**