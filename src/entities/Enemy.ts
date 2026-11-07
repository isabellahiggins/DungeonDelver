import Phaser from 'phaser';
import{ENEMY_KEY} from "../assets.ts";

export class Enemy extends Phaser.Physics.Arcade.Sprite {

	private speed: number;
	private health: number;

	constructor(scene: Phaser.Scene, x: number, y: number, speed: number = 100, health: number = 3) {
		super(scene, x, y, ENEMY_KEY);
		this.setScale(0.3);
		this.speed = speed;
		this.health = health;
		// scene.add.existing(this);
		// scene.physics.add.existing(this);
		//this.setCollideWorldBounds(true);
	}

	public followPlayer(player: Phaser.Physics.Arcade.Sprite) {
		this.scene.physics.moveToObject(this, player, this.speed);
	}

	public shotTook(): boolean{
		this.health--;
		return this.health <= 0;
	}
}