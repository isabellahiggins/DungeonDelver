// Dungeon Delver - starting point. Replace this scene with the real game.
import * as Phaser from "phaser";

class StartScene extends Phaser.Scene {
  constructor() {
    super("StartScene");
  }

  preload() {
    this.load.image("tiles", "assets/Tilemap_Flat.png");
  }

  create() {
    this.add.text(512, 120, "Dungeon Delver", { fontSize: "48px", color: "#ffffff" }).setOrigin(0.5);
    this.add.image(512, 384, "tiles");
    this.add.text(512, 640, "assets/Tilemap_Flat.png loaded - the game starts here", {
      fontSize: "20px",
      color: "#aaaaaa",
    }).setOrigin(0.5);
  }
}

new Phaser.Game({
  type: Phaser.AUTO,
  width: 1024,
  height: 768,
  pixelArt: true,
  parent: "game-container",
  scene: [StartScene],
});
