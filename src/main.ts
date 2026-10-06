// Dungeon Delver - starting point. Replace this scene with the real game.
import * as Phaser from "phaser";
import LevelScene from "./scenes/LevelScene.ts";

new Phaser.Game({
  type: Phaser.AUTO,
  width: 2048,
  height: 2048,
  pixelArt: true,
  parent: "game-container",
  scene: [LevelScene],
  scale: {
	mode: Phaser.Scale.FIT,
	autoCenter: Phaser.Scale.CENTER_BOTH
  }
});
