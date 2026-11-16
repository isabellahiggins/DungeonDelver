import Phaser from 'phaser'
import type {PowerUpType} from "../PowerUpType.ts"
import{ POWERUPSSPRITES_KEY } from "../assets.ts"
import { PowerUpImages } from '../powerUpSprite.ts';

export default class PowerUp extends Phaser.Physics.Arcade.Sprite {

    private powerUpType: PowerUpType;

    constructor(scene: Phaser.Scene, x: number, y: number, powerUpType: PowerUpType) {
        super(scene, x, y, POWERUPSSPRITES_KEY, PowerUpImages[powerUpType]);
        this.powerUpType = powerUpType;
        scene.add.existing(this);
        scene.physics.add.existing(this);
        this.setScale(3);
    }

    public getPowerUpType(): PowerUpType{
        return this.powerUpType;
    }
}