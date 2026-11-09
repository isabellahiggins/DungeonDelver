import Phaser from 'phaser';
import {Enemy} from "./entities/Enemy.ts";
import {SpawnPosition} from './SpawnPosition.ts';
import LevelScene from './scenes/LevelScene.ts';
import {EnemyTypes} from './enemyType.ts';
import EasyStar from 'easystarjs';

export class EnemySpawner{
	private locationArray: SpawnPosition[];
	private scene: LevelScene;
	private enemies: Enemy[] = [];
	private toSpawn: Enemy[] = [];
	private spawner?: Phaser.Time.TimerEvent;
	private easystar: EasyStar.js;

	constructor(scene: LevelScene, easystar: EasyStar.js, ...locationArray: SpawnPosition[]){
		this.locationArray = locationArray;
		this.scene = scene;
		this.easystar = easystar;
	}

	private spawnEnemy(numEnemies: integer){
		for(let index = 0; index < numEnemies; index++){
			const r = Math.floor(Math.random() * (this.locationArray.length));
			console.log(r);

			const type = Phaser.Math.RND.pick(EnemyTypes);
			const enemy = new Enemy(this.scene, this.locationArray[r].getPositionX(), this.locationArray[r].getPositionY(), type.speed, type.health, this.easystar, type.sprite);
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
		currentEnemy.setCollideWorldBounds(true);
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

	updateEnemiesPath(player: Phaser.Physics.Arcade.Sprite){
		for(const enemy of this.enemies){
			enemy.findPath(player);
		}
	}

	moveEnemies(){
		this.easystar.calculate();

		for(const enemy of this.enemies) {
			enemy.followPlayer();
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
