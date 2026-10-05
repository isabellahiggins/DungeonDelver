# Dungeon Delver (team 2): Celbridge / Deno review

Reviewed 2026-10-05 by Matt, after the 11:00 deadline.

**Code reviewed:** `main` at `e95b74f` (Mon 5 Oct 03:40, Sean Kelly: "added basic script for 8 directional player
movement").

## Summary

The repo had a Tiled map (`testLevel.tmx`) and its art, and, by the deadline, one piece of code: a `Player`
class with 8-direction WASD movement (`Player.ts`). It's now set up as a Phaser 4 + TypeScript project with
Celbridge's Deno tools. `src/main.ts` is a small placeholder scene that shows the tileset image, to prove the build
works. Replace it with the real game.

The build has **1 TypeScript error** (in `Player.ts`, a one-word fix) and **no lint warnings**. The placeholder
runs correctly. `Player` isn't used by the game yet (see issue 2).

The main work left before the map can be used in the game is in Tiled (see issue 1).

## Changes made on this branch

| Change | Why |
|---|---|
| Moved `assets/` to `public/assets/` | Everything in `public/` is copied into `dist/` by the build, so the game can load it as `assets/...`. |
| Updated the 19 image paths in `testLevel.tmx` to `public/assets/...` | So Tiled still finds the images. The `.tmx` itself didn't move. |
| Moved `Player.ts` to `src/Player.ts` | All the game's code goes in `src/`, where the build type checks and lints it. |
| Added a `.gitignore` | There wasn't one. It ignores `dist/`, `test_output/`, `.celbridge/` and `.DS_Store`. |
| Added the Deno build, Celbridge tools and a placeholder game | See `CELBRIDGE.md`. |
| Added `tools/tmx_to_json.ts` (`deno task map`, and a **map** button in the console) | Converts the Tiled map to JSON for Phaser, without needing Tiled installed. |
| Added `deno task serve` and `README_deno_tooling.md` | For previewing in a browser, and working without Celbridge. |
| Added `public/fit-to-window.css` | Scales the page to fit the window or Celbridge's preview panel, so the game is never cut off. |

## Working without Celbridge

`README_deno_tooling.md` explains how to get the same set-up without Celbridge. That matters most for **Linux**
users, as there's no Linux version of Celbridge yet, and `README_deno_install.md` covers installing Deno
on Linux (as well as macOS and Windows). It also
suits anyone working in VS Code. The
project only needs Deno (no Node.js or npm), which runs on Windows, macOS and Linux:

- `deno task dev` builds, tests, and rebuilds `dist/` every time a file in `src/`, `public/` or `tests/` is saved
- `deno task serve`, in a second terminal, serves the game at http://127.0.0.1:8000. Then refresh the browser
  after each rebuild

The game needs the server: opened straight from disk (`file://`), browsers block Phaser from loading its images and maps,
so it shows a blank screen.

## Issues and recommended actions

### 1. The map isn't ready for Phaser yet

Convert it with the console's **map** button (or `deno task map testLevel.tmx public/assets/testLevel.json`), and
load it with `this.load.tilemapTiledJSON("testLevel", "assets/testLevel.json")`. But first:

**a) The map's grid and its tiles are different sizes**

The map's grid is 32×32, but the `tinyswords_flat` tiles are 64×64. Tiled and Phaser both draw each 64×64 tile
on a 32×32 grid, so they overlap. That's hard to line things up with, and collisions will match the 32×32 grid,
not what you see.

*Recommended:* in Tiled, change the map's tile size to 64×64 (**Map > Map Properties**). Or, if 32×32 is the size
you want, use a 32×32 tileset.

**b) The `Deco` layer uses an image-collection tileset, which Phaser's tile layers can't draw**

`Deco` is a collection of separate images (`deco/01.png` to `18.png`), not one tileset image. Phaser's
`createLayer()` only draws tiles from a single tileset image, so the 56 decorations on `Tile Layer 2` won't
appear.

*Recommended:* either

- put the decorations on an **object layer** in Tiled (**Insert Tile**), and create them in Phaser with
  `map.createFromObjects()`, or
- combine the decoration images into one tileset image (a sprite sheet) and use that instead.

**c) One placed decoration uses an `.aseprite` file**

Tile 19 of `Deco` (`Tiny Swords/.../Trees/Tree.aseprite`) is placed on the map. `.aseprite` is Aseprite's own
format, and browsers can't load it. Tile 20 (`Tree.png`) isn't placed, but neither file is in the repo.

*Recommended:* export the tree as a `.png` into `public/assets/`, use that tile instead, and remove the
`.aseprite` tile from the tileset.

**d) Layer names**

The layers are called `Tile Layer 1`, `Tile Layer 2` and `Tile Layer 3`. Phaser finds layers by name
(`map.createLayer("Ground", ...)`).

*Recommended:* rename them to say what they hold, e.g. `Ground`, `Decorations`, `Paths`.

### 2. `src/Player.ts`

A clear, well-commented start: a `Phaser.Physics.Arcade.Sprite` subclass, with WASD movement and no gravity for a
top-down game.

**a) Type error: `update()` needs `override`**

```
TS4114: This member must have an 'override' modifier because it overrides a member in the base class 'Sprite'.
```

`Sprite` already has an `update()` method, and this project's TypeScript settings ask for `override` whenever a
method replaces one from the base class. That makes it obvious which methods Phaser calls. The fix:

```ts
override update() {
```

**b) It isn't used yet**

Nothing creates a `Player`. To use it, the game needs:

- arcade physics turned on, in the game config in `src/main.ts`:
  `physics: { default: "arcade", arcade: { gravity: { x: 0, y: 0 } } }`
- an image loaded with the key `"player"`, in a scene's `preload()`
- a scene that creates it (`this.player = new Player(this, x, y)`) and calls `this.player.update()` from the
  scene's own `update()`

**c) Diagonal movement is faster**

Holding W and D sets both velocities to 100, so the player moves diagonally at about 141 (√2 × 100). To keep the
same speed in every direction, scale the velocity: `this.body!.velocity.normalize().scale(this.speed)` after
setting both.

### 3. The Celbridge preview

Celbridge's side preview loads the game, including its images and sounds, without needing a separate web server
(checked in Celbridge on 5 Oct).

The page now also scales to fit the preview panel. `public/fit-to-window.css` (linked from `public/index.html`)
shrinks the game to fit as the panel is resized, keeping its shape, so nothing is cut off. Mouse clicks still land
in the right place. It's the last stylesheet on the page, so it's easy to remove if you'd rather lay the page out
yourselves.

*Recommended:* nothing needed. If you change the page's layout (e.g. add a heading or a panel), check it still
fits a narrow panel.

## Files added for the Deno build

`DungeonDelver.celbridge` (replaced), `CELBRIDGE.md`, `README_deno_tooling.md`, `README_deno_install.md`, `terminal.console`, `deno.json`, `deno.lock`, `build.ts`,
`tools/test_report.ts`, `tools/tmx_to_json.ts`, `tests/README.md`, `.gitignore`, and the placeholder game in
`src/main.ts`, `public/index.html` and `public/styles.css`. See `CELBRIDGE.md` for how to use them.
