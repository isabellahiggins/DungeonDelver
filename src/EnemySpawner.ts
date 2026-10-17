import Phaser from 'phaser';
import {Enemy} from "./entities/Enemy.ts";
import {SpawnPosition} from './SpawnPosition.ts';

export class EnemySpawner{
	private locationArray: SpawnPosition[];
	private scene: Phaser.Scene;
	private enemies: Enemy[] = [];

	constructor(scene: Phaser.Scene, ...locationArray: SpawnPosition[]){
		this.locationArray = locationArray;
		this.scene = scene;
	}

	 spawnEnemy(numEnemies: integer){
		for(let index = 0; index < numEnemies; index++){
			let r = Math.floor(Math.random() * (this.locationArray.length));
			console.log(r);
			
			const enemy = new Enemy(this.scene, this.locationArray[r].getPositionX(), this.locationArray[r].getPositionY());
			this.enemies.push(enemy);

		}
	}

	startWave(numEnemies: integer){
		this.spawnEnemy(numEnemies);
	}

	enemiesLeft(): integer{
		return this.enemies.length;
	}

	moveEnemies(player: Phaser.Physics.Arcade.Sprite){
		for(const enemy of this.enemies){
			enemy.followPlayer(player);
		}
	}

	getEnemies(): Enemy[]{
		return this.enemies;
	}

	getEnemiesGroup(): Phaser.Physics.Arcade.Group{
		const enemiesGroup = this.scene.physics.add.group();
		
		for(const enemy of this.enemies){
			enemiesGroup.add(enemy);
		}
		return enemiesGroup;
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
