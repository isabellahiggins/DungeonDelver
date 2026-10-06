import Phaser from 'phaser';

export default class Player extends Phaser.Physics.Arcade.Sprite {

    private speed = 100; // movement speed - possibly rehome into a file with other constants for easier tweaking

    // controls
    private keys: {
        W: Phaser.Input.Keyboard.Key,
        A: Phaser.Input.Keyboard.Key,
        S: Phaser.Input.Keyboard.Key,
        D: Phaser.Input.Keyboard.Key
    };
    
    constructor(scene: Phaser.Scene, x: number, y: number) {
        super(scene, x, y, 'player');

        // add the player to the scene
        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.setGravity(0, 0); // disable gravity because of top down style
        this.setCollideWorldBounds(true);

        // set WASD movement keys
        this.keys = scene.input.keyboard!.addKeys('W,A,S,D') as {
            W: Phaser.Input.Keyboard.Key;
            A: Phaser.Input.Keyboard.Key;
            S: Phaser.Input.Keyboard.Key;
            D: Phaser.Input.Keyboard.Key;
        };
    }

    override update() {
        this.setVelocity(0);

        // up + down movement
        if (this.keys.W.isDown) {
            this.setVelocityY(-this.speed);
        } else if (this.keys.S.isDown) {
            this.setVelocityY(this.speed);
        }

        // left + right movement
        if (this.keys.A.isDown) {
            this.setVelocityX(-this.speed);
        } else if (this.keys.D.isDown) {
            this.setVelocityX(this.speed);
        }
    }
}


