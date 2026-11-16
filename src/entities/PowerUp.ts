import Phaser from 'phaser'
import type {PowerUpType} from "../PowerUpType.ts"
import{ POWERUPSSPRITES_KEY } from "../assets.ts"
import { PowerUpImages } from '../powerUpSprite.ts';
import{ SPREAD_KEY, LIFE_KEY, RAPID_SHOT_KEY, SPEED_KEY, GHOST_BULLETS_KEY, BARRIER_KEY } from "../assets.ts"

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

    private static getPowerUpKey(powerUpType: PowerUpType): string{
        if(powerUpType === "spread"){
            return SPREAD_KEY;
        }
        else if(powerUpType === "life"){
            return LIFE_KEY;
        }else if(powerUpType === "rapidShot"){
            return RAPID_SHOT_KEY;
        }else if(powerUpType === "speed"){
            return SPEED_KEY;
		}
		else if(powerUpType === "barrier"){
            return BARRIER_KEY;
        }else{
            return GHOST_BULLETS_KEY;
        }
    }
}