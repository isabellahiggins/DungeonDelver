// Dungeon Delver - starting point. Replace this scene with the real game.
import * as Phaser from "phaser";
import LevelScene from "./scenes/LevelScene.ts";

new Phaser.Game({
  type: Phaser.AUTO,
  width: 1024,
  height: 768,
  pixelArt: true,
  parent: "game-container",
  scene: [LevelScene],
});
