import Phaser, { Scene } from 'phaser';
import Bullet from './bullet.ts';
import {PLAYER_KEY, PLAYER_SHOOT_KEY} from '../assets.ts';


// power ups
const POWER_UP_DURATION = 10000; // 10 seconds

const SPREAD_SHOT_ANGLE = Math.PI / 6;


export default class Player extends Phaser.Physics.Arcade.Sprite {

    private nextFireTime = 0;
    private speed = 500;
    private godMode = false;
	private bullets: Bullet[] = [];
    private fireDelay = 400; // milliseconds between shots
    public lives = 3; 

    // power ups
    private spreadShotActive = false;
    private spreadShotTimer: Phaser.Time.TimerEvent | null = null;

    private rapidShotActive = false;
    private rapidShotTimer: Phaser.Time.TimerEvent | null = null;

    private speedActive = false;
    private speedTimer: Phaser.Time.TimerEvent | null = null;

    private tryToFire(time: number): boolean {
        if (time < this.nextFireTime) {
            return false;
        } if (this.rapidShotActive) {
            this.fireDelay = 200; // faster fire rate when rapid shot is active
        }

        this.nextFireTime = time + this.fireDelay;
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

        if (this.speedActive) {
            this.body!.velocity.scale(1.5); // increase speed when speed power-up is active
        }
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
     private activatePowerUp(
        currentTimer: Phaser.Time.TimerEvent | null,
        setActive: (active: boolean) => void,
        setTimer: (timer: Phaser.Time.TimerEvent | null) => void
        ): void {
        setActive(true);
        
        if (currentTimer) {
            currentTimer.remove();
        }

        const timer = this.scene.time.delayedCall(POWER_UP_DURATION, () => {
            setActive(false);
            setTimer(null);
        });

        setTimer(timer);
    }

    public activateSpreadShot(): void {
        this.activatePowerUp(
            this.spreadShotTimer,
            (active) => this.spreadShotActive = active,
            (timer) => this.spreadShotTimer = timer
        );
    }

    public activateRapidShot(): void {
        this.activatePowerUp(
            this.rapidShotTimer,
            (active) => this.rapidShotActive = active,
            (timer) => this.rapidShotTimer = timer
        );
    }

    public activateSpeed(): void {
        this.activatePowerUp(
            this.speedTimer,
            (active) => this.speedActive = active,
            (timer) => this.speedTimer = timer
        );
    }
}

