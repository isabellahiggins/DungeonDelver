import * as Phaser from "phaser";
import { MENU_MUSIC_FILE, MENU_MUSIC_KEY, START_BACKGROUND_FILE, START_BACKGROUND_KEY } from "../assets.ts";

export default class startScene extends Phaser.Scene {
    constructor() {
        super("startScene");
    }

    preload(): void{
        this.load.image(START_BACKGROUND_KEY, START_BACKGROUND_FILE);
		this.load.audio(MENU_MUSIC_KEY, MENU_MUSIC_FILE);
    }

    create(): void {
        const centreX = this.sys.game.canvas.width / 2;
        const centreY = this.sys.game.canvas.height / 2;

        //background image
        this.add.image(centreX, centreY, START_BACKGROUND_KEY).setOrigin(0.5);

        //title and instructions text
        this.add.text(centreX, centreY, "Monster Meadow ",{ 
            fontSize: "80px",
            color: "#ffffff",
            fontStyle: "bold",
            stroke: "#000000",
            strokeThickness: 8,
            align: "center"
        }).setOrigin(0.5);
        
        this.add.text(centreX, centreY + 200, "Press SPACE to start",{
            padding:{top: 1},
            fontSize: "75px",
            color: "#ffffff",
            stroke: "#000000",
            strokeThickness: 8,
            align: "center"
        }).setOrigin(0.5);

		this.sound.play(MENU_MUSIC_KEY, {
			loop: true,
			volume: 0.5
		});

        //when space bar is pressed, restart level 
        this.input.keyboard!.once("keydown-SPACE", () => {
			this.sound.stopAll();
            this.scene.start("LevelScene");
        });

    }
}