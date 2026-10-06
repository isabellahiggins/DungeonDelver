import Phaser from 'phaser';

class Enemy extends Phaser.Physics.Arcade.Sprite {
	constructor(scene: Phaser.Scene, x: number, y: number) {
		super(scene, x, y, 'enemy');
		scene.add.existing(this);
		scene.physics.add.existing(this);
		this.setCollideWorldBounds(true);
	}
}

export class SpawnPosition{
	private x : number;
	private y : number;

	constructor(x : number, y : number){
		this.x = x;
		this.y = y;
	}

	getPositionX(){
		return this.x;
	}

	getPositionY(){
		return this.y;
	}
}

export class EnemySpawner{
	private locationArray : SpawnPosition[];
	private scene : Phaser.Scene;

	constructor(scene : Phaser.Scene, locationArray : SpawnPosition[]){
		this.locationArray = locationArray;
		this.scene = scene;
	}

	spawnEnemy(numEnemies : integer){
		for(let index = 0; index < numEnemies; index++){
			let r = Math.random() * (this.locationArray.length - 1) + 1;
			
			new Enemy(this.scene, this.locationArray[r].getPositionX(), this.locationArray[r].getPositionY());
		}
	}
}
