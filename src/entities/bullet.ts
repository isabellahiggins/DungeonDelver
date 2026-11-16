import Phaser from 'phaser';
import{BULLET_KEY} from "../assets.ts";

export default class Bullet extends Phaser.Physics.Arcade.Sprite {

    private speed =  1500;
    private knockbackForce = 0;

    constructor(scene: Phaser.Scene, x: number, y: number) {
        super(scene, x, y, BULLET_KEY);

        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.setActive(true);
        this.setVisible(true);
    }

    shoot(angle: number){
        this.setRotation(angle);

        const velocity = this.scene.physics.velocityFromRotation(angle, this.speed);
        this.setVelocity(velocity.x, velocity.y);

    }

    getKnockbackForce(): number {
        return this.knockbackForce;
    }

    setKnockbackForce(force: number): void {
        this.knockbackForce = force;
    }
}