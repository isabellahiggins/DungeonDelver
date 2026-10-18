import Phaser from 'phaser';
import {Enemy} from "./entities/Enemy.ts";
import {SpawnPosition} from './SpawnPosition.ts';
import LevelScene from './scenes/LevelScene.ts';

export class EnemySpawner{
	private locationArray: SpawnPosition[];
	private scene: LevelScene;
	private enemies: Enemy[] = [];
	private toSpawn: Enemy[] = [];
	private spawner?: Phaser.Time.TimerEvent;

	constructor(scene: LevelScene, ...locationArray: SpawnPosition[]){
		this.locationArray = locationArray;
		this.scene = scene;
	}

	private spawnEnemy(numEnemies: integer){
		for(let index = 0; index < numEnemies; index++){
			let r = Math.floor(Math.random() * (this.locationArray.length));
			console.log(r);
			
			const enemy = new Enemy(this.scene, this.locationArray[r].getPositionX(), this.locationArray[r].getPositionY());
			this.toSpawn.push(enemy);
		}

		this.spawner = this.scene.time.addEvent({
			delay: 1000,
			callback: this.aliveEnemy,
			callbackScope: this,
			loop: true
		});
	}

	aliveEnemy(): void{
		const currentEnemy: Enemy = this.toSpawn.pop() as Enemy;
		this.scene.add.existing(currentEnemy);
		this.scene.physics.add.existing(currentEnemy);
		this.enemies.push(currentEnemy)
		this.scene.registerNewEnemies();
		console.log(this.toSpawn.length)
		if(this.toSpawn.length == 0){
			this.spawner?.remove();
		}
	}

	startWave(numEnemies: integer){
		this.spawnEnemy(numEnemies);
	}

	enemiesLeft(): integer{
		return this.enemies.length + this.toSpawn.length;
	}

	moveEnemies(player: Phaser.Physics.Arcade.Sprite){
		for(const enemy of this.enemies){
			enemy.followPlayer(player);
		}
	}

	getEnemies(): Enemy[]{
		return this.enemies;
	}

	removeEnemy(deadEnemy: Enemy): void{
		const newEnemies = [];

		for(const enemy of this.enemies){
			if(enemy == deadEnemy){
				continue;
			}
			newEnemies.push(enemy);
		}

		this.enemies = newEnemies;
	}
}
