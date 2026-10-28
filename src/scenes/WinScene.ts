import * as Phaser from "phaser";
import {WIN_MUSIC_KEY} from "../assets.ts";

export default class WinScene extends Phaser.Scene {
    constructor() {
        super("WinScene");
    }

    create(): void {
        const centreX = this.sys.game.canvas.width / 2;
        const centreY = this.sys.game.canvas.height / 2;

        //Win text
        this.add.text(centreX, centreY, "You Win! \n Press SPACE to play again",{ 
            fontSize: "64px",
             color: "#ffffff"
             }).setOrigin(0.5);

        //when space bar is pressed, restart game 
        this.input.keyboard!.once("keydown-SPACE", () => {
            this.sound.stopAll();
            this.scene.start("LevelScene");
        });

        this.sound.stopAll();
        this.sound.play(WIN_MUSIC_KEY);
    }
}