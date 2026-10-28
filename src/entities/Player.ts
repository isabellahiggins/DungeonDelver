import Phaser, { Scene } from 'phaser';
import Bullet from './bullet.ts';
import {PLAYER_KEY, PLAYER_SHOOT_KEY} from '../assets.ts';

const FIRE_DELAY = 400;

// power ups
const SPREAD_SHOT_DURATION = 10000; // 10 seconds
const SPREAD_SHOT_ANGLE = Math.PI / 6;

export default class Player extends Phaser.Physics.Arcade.Sprite {

    private nextFireTime = 0;
    private speed = 500;
    private godMode = false;
	private bullets: Bullet[] = [];

    // power ups
    private spreadShotActive = false;
    private spreadShotTimer: Phaser.Time.TimerEvent | null = null;

    private tryToFire(time: number): boolean {
        if (time < this.nextFireTime) {
            return false;
        }

        this.nextFireTime = time + FIRE_DELAY;
        return true;
    }

    // method to fire bullets at a given direction
    private shoot(angle: number) {
        let bulletAngles = [angle]; // normal shot is just one bullet at the normal 90 degree angle

        if (this.spreadShotActive) { // when spread shot is active, fire three bullets at angles in an array
            bulletAngles = [angle - SPREAD_SHOT_ANGLE, angle, angle + SPREAD_SHOT_ANGLE];
        }

        for (const bulletAngle of bulletAngles) {
            const bullet = new Bullet(
            this.scene,
            this.x,
            this.y
            );
            this.bullets.push(bullet);
            bullet.shoot(bulletAngle);
            this.scene.sound.play(PLAYER_SHOOT_KEY);
        }
    }

	getAllBullets(): Bullet[]{
		return this.bullets;
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
    
    constructor(scene: Scene, x: number, y: number) {
        super(scene, x, y, PLAYER_KEY);

		this.setScale(0.3);

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

    override update(time: number) {
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
        if (this.keys.UP.isDown && this.tryToFire(time)) {
            this.shoot(-Math.PI / 2);
        }

        if (this.keys.DOWN.isDown && this.tryToFire(time)) {
            this.shoot(Math.PI / 2);
        }

        if (this.keys.LEFT.isDown && this.tryToFire(time)) {
            this.shoot(Math.PI);
        }

        if (this.keys.RIGHT.isDown && this.tryToFire(time)) {
            this.shoot(0);
        }
    }

    public isGodMode(): boolean{
          return this.godMode;
     }

     public makeGodMode(): void{
          this.godMode = true;
          this.scene.tweens.add({
            targets: this,
            alpha: 0.15,
            duration: 200,
            yoyo: true,
            repeat:3 ,
            onComplete: () =>{
                this.setAlpha(1);
                this.godMode = false;
            }
          })
     }

    // power up methods (call them when power up is collected)
    public activateSpreadShot(): void {
        this.spreadShotActive = true;

        // if a timer is already running, remove it to reset the duration
        if (this.spreadShotTimer) {
            this.spreadShotTimer.remove();
        }

        // set a new timer to deactivate the spread shot after the duration
        this.spreadShotTimer = this.scene.time.delayedCall(SPREAD_SHOT_DURATION, () => {
            this.spreadShotActive = false;
            this.spreadShotTimer = null;
        });
    }
}

