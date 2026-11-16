import Phaser from 'phaser';
import{BARRIER_SPRITE_KEY} from "../assets.ts";


export class Barrier extends Phaser.Physics.Arcade.Sprite {
	constructor(scene: Phaser.Scene, x: number, y: number) {
		super(scene, x, y, BARRIER_SPRITE_KEY);
		this.setScale(0.25);
		this.x = x;
		this.y = y;
	}
}