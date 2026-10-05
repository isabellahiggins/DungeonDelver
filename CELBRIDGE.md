# Dungeon Delver in Celbridge (Deno)

A Phaser 4 + TypeScript project, built with Deno. Not using Celbridge? See `README_deno_tooling.md`. `src/main.ts` is a placeholder scene that shows
`public/assets/Tilemap_Flat.png`, to prove the build works. Replace it with the real game.

## Running it in Celbridge

Open `DungeonDelver.celbridge` in Celbridge. The console at the bottom starts by itself and runs `deno task dev`:

1. **builds** `src/` (TypeScript, plus Phaser from npm) into `dist/app.js`, and copies `public/` (the page, its CSS,
   and the art in `public/assets/`) into `dist/`
2. **tests** everything in `tests/`, printing the results in the console and writing a readable report to
   `test_output/index.html`. The report also lists TypeScript errors and lint warnings
3. **watches**: every time you save a file in `src/`, `public/` or `tests/`, it does it all again

`dist/index.html` opens beside the console. After a rebuild, press its preview's **refresh** button to see
your changes. The clipboard icon opens the test report.

The console's buttons: rebuild-and-watch, build once, test once, and lint. To use them while the watcher is
running, press **Ctrl+C** first to stop it.

## Where things go

| Folder | What goes in it |
|---|---|
| `src/` | the game's TypeScript code. `src/main.ts` is where it starts |
| `public/` | `index.html` and `styles.css` |
| `public/assets/` | images, sounds, maps. In the game, load them as `assets/...` (no `public/`) |
| `tests/` | tests, in files ending `.test.ts` |

## Using testLevel.tmx in the game

Phaser can't read Tiled's `.tmx` files, so convert the map to JSON. Press the console's **map** button, or type:

```
deno task map testLevel.tmx public/assets/testLevel.json
```

This does the same as Tiled's own command line (`tiled --export-map json --embed-tilesets in.tmx out.json`), but
doesn't need Tiled installed. Run it again after each change to the map in Tiled. Then load it in the game with
`this.load.tilemapTiledJSON("testLevel", "assets/testLevel.json")`.

It works for any map: `deno task map <in.tmx> <out.json>`. Tilesets are always embedded, and tile data is always
written as plain numbers, so Phaser can read it.

Two things in the current map need fixing first:

- The map's grid is 32x32 but the `tinyswords_flat` tiles are 64x64. Phaser expects them to match.
- The `Deco` tileset includes a tree from a `Tiny Swords/...` folder that isn't in this repo. Copy that image
  into `public/assets/`, or remove it from the tileset.

## Files added for the Deno build

You never need to edit these:

- `DungeonDelver.celbridge`: the Celbridge project, with its shortcuts
- `terminal.console`: the console and its buttons
- `deno.json`: the Deno tasks and settings
- `build.ts`, `tools/test_report.ts`: the build and the test report
- `tools/tmx_to_json.ts`: converts Tiled maps to JSON (`deno task map`)
- `README_deno_tooling.md`: how to do all this without Celbridge
- `README_deno_install.md`: how to install Deno on Linux, macOS and Windows
