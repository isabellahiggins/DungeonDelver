import Phaser from "phaser";

export default class PauseScene extends Phaser.Scene {
    constructor() {
        super("PauseScene");
    }

    create(): void {
        this.scene.bringToTop();

        const centreX = this.scale.width / 2;
        const centreY = this.scale.height / 2;

        this.add.rectangle(0, 0, this.scale.width, this.scale.height, 0x000000, 0.6)
            .setOrigin(0, 0);

        this.add.text(centreX, centreY, "PAUSED\n\nPress ESC to resume", {
            fontFamily: "Arial",
            fontSize: "64px",
            color: "#ffffff",
            fontStyle: "bold",
            align: "center"
        }).setOrigin(0.5);

        this.input.keyboard!.once("keydown-ESC", () => this.resumeGame());
    }

    private resumeGame(): void {
        this.scene.resume("LevelScene");
        this.scene.stop();
    }
}
