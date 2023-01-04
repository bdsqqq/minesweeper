# Minesweeper

I'll write a better read me at some point, for now this is a glorified TODO list ✌

# logic-overhaul branch goals

- Allow for multiple game instances, each one contained within itself.
- Prepare for chording

# Roadmap

## features

### Meta

- [x] Command K can replace the current menu. (Don't know how this will affect the current keyboard shortcut implementation)
  - [x] Show/hide UI panels (time, current tool)
  - [x] Pause timer while in cmd+k
- [ ] Tutorial (Take inspiration from wordle)
- [ ] Onboarding (Don't know if a landing page makes sense, I want this site to be the game as soon as you enter. An onboarding similar to flow.rest might work)
- [ ] About modal
- [ ] focus ring (focus states are ok but its hard to tell where I am in the menus)
- [ ] allow theming, use css variables in stitches
- [ ] refactor game logic, re-rendering the entire board on every play can't be efficient
  - [ ] reveal might be able to be async?
- [ ] OG image + SEO stuff
- [ ] Sounds

### Game

- [ ] [Chording](https://www.minesweeper.info/wiki/Chord)???
- [ ] Generate field after first click, losing on turn 1 is frustrating

## fixes

- [x] Board moves when user moves with arrows, show do it only when the user holds ~~space/shift~~ ctrl + arrows
- [x] User cant move with numpad arrows
- [ ] A shitton of re-renders
  - [ ] changing difficulty re-renders EVERYTHING
  - [ ] changing tool re-renders all cells (might be needed tho, their event handles change)
