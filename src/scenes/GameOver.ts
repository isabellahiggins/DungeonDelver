import * as Phaser from "phaser";

export default class GameOver extends Phaser.Scene {
    constructor() {
        super("GameOver");
    }

    create(): void {
        const centreX = this.sys.game.canvas.width / 2;
        const centreY = this.sys.game.canvas.height / 2;

        //game over text
        this.add.text(centreX, centreY, "Game Over \n Press SPACE to restart",{ 
            fontSize: "64px",
             color: "#ff0000"
             }).setOrigin(0.5);

        //when space bar is pressed, restart level 
        this.input.keyboard!.once("keydown-SPACE", () => {
            this.scene.start("LevelScene");
        });
    }
}