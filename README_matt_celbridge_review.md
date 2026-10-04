# Dungeon Delver (team 2): Celbridge / Deno review

Reviewed 2026-10-05 by Matt.

## Summary

The repo had a Tiled map (`testLevel.tmx`) and its art, but no code yet. It's now set up as a Phaser 4 +
TypeScript project with Celbridge's Deno tools. `src/main.ts` is a small placeholder scene that shows the tileset
image, to prove the build works. Replace it with the real game.

The build has **no TypeScript errors** and **no lint warnings**, and the placeholder runs correctly.

The main work left before the map can be used in the game is in Tiled (see issue 1).

## Changes made on this branch

| Change | Why |
|---|---|
| Moved `assets/` to `public/assets/` | Everything in `public/` is copied into `dist/` by the build, so the game can load it as `assets/...`. |
| Updated the 19 image paths in `testLevel.tmx` to `public/assets/...` | So Tiled still finds the images. The `.tmx` itself didn't move. |
| Added a `.gitignore` | There wasn't one. It ignores `dist/`, `test_output/`, `.celbridge/` and `.DS_Store`. |
| Added the Deno build, Celbridge tools and a placeholder game | See `CELBRIDGE.md`. |
| Added `tools/tmx_to_json.ts` (`deno task map`, and a **map** button in the console) | Converts the Tiled map to JSON for Phaser, without needing Tiled installed. |

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

### 2. Not yet checked inside Celbridge itself

The build was tested through a local web server, not in Celbridge's side preview.

*Recommended:* open `DungeonDelver.celbridge` and check the placeholder appears in the side preview, with the
tileset image.

## Files added for the Deno build

`DungeonDelver.celbridge` (replaced), `CELBRIDGE.md`, `terminal.console`, `deno.json`, `deno.lock`, `build.ts`,
`tools/test_report.ts`, `tools/tmx_to_json.ts`, `tests/README.md`, `.gitignore`, and the placeholder game in
`src/main.ts`, `public/index.html` and `public/styles.css`. See `CELBRIDGE.md` for how to use them.
