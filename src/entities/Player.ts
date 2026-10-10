import Phaser from 'phaser';
import Bullet from './bullet.ts';
import { PLAYER_KEY} from './assets.ts';

export default class Player extends Phaser.Physics.Arcade.Sprite {

    private speed = 100; // movement speed - possibly rehome into a file with other constants for easier tweaking

    // method to fire bullets at a given direction
    private shoot(angle: number) {
        const bullet = new Bullet(
            this.scene,
            this.x,
            this.y
        );

        bullet.shoot(angle);
    }

    // controls
    private keys: {
        W: Phaser.Input.Keyboard.Key,
        A: Phaser.Input.Keyboard.Key,
        S: Phaser.Input.Keyboard.Key,
        D: Phaser.Input.Keyboard.Key

        UP: Phaser.Input.Keyboard.Key,
        DOWN: Phaser.Input.Keyboard.Key,
        LEFT: Phaser.Input.Keyboard.Key,
        RIGHT: Phaser.Input.Keyboard.Key
    };
    
    constructor(scene: Phaser.Scene, x: number, y: number) {
        super(scene, x, y, 'player');

        // add the player to the scene
        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.setGravity(0, 0); // disable gravity because of top down style
        this.setCollideWorldBounds(true);

        // set WASD movement keys and arrow shooting keys
        this.keys = scene.input.keyboard!.addKeys('W,A,S,D,UP,DOWN,LEFT,RIGHT') as {
            W: Phaser.Input.Keyboard.Key;
            A: Phaser.Input.Keyboard.Key;
            S: Phaser.Input.Keyboard.Key;
            D: Phaser.Input.Keyboard.Key;
            UP: Phaser.Input.Keyboard.Key;
            DOWN: Phaser.Input.Keyboard.Key;
            LEFT: Phaser.Input.Keyboard.Key;
            RIGHT: Phaser.Input.Keyboard.Key;
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

        this.body!.velocity.normalize().scale(this.speed) // prevent diagonal movement being faster

        // directional shooting
        if (this.keys.UP.isDown) {
            this.shoot(-Math.PI / 2);
        }

        if (this.keys.DOWN.isDown) {
            this.shoot(Math.PI / 2);
        }

        if (this.keys.LEFT.isDown) {
            this.shoot(Math.PI);
        }

        if (this.keys.RIGHT.isDown) {
            this.shoot(0);
        }
    }
}


