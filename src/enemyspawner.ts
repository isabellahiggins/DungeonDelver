import Phaser from 'phaser';
import{ENEMY_KEY, ENEMY_FILE} from "./assets.ts";

class Enemy extends Phaser.Physics.Arcade.Sprite {
	private speed = 100;

	constructor(scene: Phaser.Scene, x: number, y: number) {
		super(scene, x, y, ENEMY_KEY);
		this.setScale(0.3);
		scene.add.existing(this);
		scene.physics.add.existing(this);
		//this.setCollideWorldBounds(true);
	}

	public followPlayer(player: Phaser.Physics.Arcade.Sprite) {
		this.scene.physics.moveToObject(this, player, this.speed);
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
	private enemies : Enemy[] = [];

	constructor(scene : Phaser.Scene, ...locationArray : SpawnPosition[]){
		this.locationArray = locationArray;
		this.scene = scene;
		this.enemies = [];
	}

	spawnEnemy(numEnemies : integer){
		for(let index = 0; index < numEnemies; index++){
			let r = Math.floor(Math.random() * (this.locationArray.length));
			console.log(r);
			
			const enemy = new Enemy(this.scene, this.locationArray[r].getPositionX(), this.locationArray[r].getPositionY());
			this.enemies.push(enemy);

		}
	}

	moveEnemies(player : Phaser.Physics.Arcade.Sprite){
		for(const enemy of this.enemies){
			enemy.followPlayer(player);
		}
	}
}
