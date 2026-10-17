// Dungeon Delver - starting point. Replace this scene with the real game.
import * as Phaser from "phaser";
import GameOver from "./scenes/GameOver.ts";
import LevelScene from "./scenes/LevelScene.ts";
import StartScene from "./scenes/startScene.ts";

new Phaser.Game({
  type: Phaser.AUTO,
  width: 2048,
  height: 2048,
  pixelArt: true,
  parent: "game-container",
  scene: [StartScene,LevelScene, GameOver],
  scale: {
	mode: Phaser.Scale.FIT,
	autoCenter: Phaser.Scale.CENTER_BOTH
  },
  physics: {
    default: "arcade",
    arcade: {
      gravity:{x: 0, y: 0}
    }
  }
  });
