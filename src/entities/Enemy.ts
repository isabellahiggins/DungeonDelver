import Phaser from 'phaser';
import{ENEMY_KEY} from "../assets.ts";

export class Enemy extends Phaser.Physics.Arcade.Sprite {
	private speed = 100;

	constructor(scene: Phaser.Scene, x: number, y: number) {
		super(scene, x, y, ENEMY_KEY);
		this.setScale(0.3);
		// scene.add.existing(this);
		// scene.physics.add.existing(this);
		//this.setCollideWorldBounds(true);
	}

	public followPlayer(player: Phaser.Physics.Arcade.Sprite) {
		this.scene.physics.moveToObject(this, player, this.speed);
	}	
}