import Phaser from 'phaser';

class Enemy extends Phaser.Physics.Arcade.Sprite {
	constructor(scene: Phaser.Scene, x: number, y: number) {
		super(scene, x, y, 'enemy');
		scene.add.existing(this);
		scene.physics.add.existing(this);
		this.setCollideWorldBounds(true);
	}
}

class EnemySpawner extends Phaser.Scene {
	constructor() {
		super('EnemySpawner');
	}

	spawnEnemy(){
		const x = this.sys.game.canvas.width / 2;
		const y = this.sys.game.canvas.height / 2;

		new Enemy(this, x, y);
	}

	override update(){
	}
}
