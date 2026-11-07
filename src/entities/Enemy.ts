import Phaser from 'phaser';
import{ENEMY_KEY} from "../assets.ts";
import EasyStar from 'easystarjs';


export class Enemy extends Phaser.Physics.Arcade.Sprite {
	private speed: number;
	private health: number;
	private easystar: EasyStar.js;
	private path: { x: number, y: number }[] = [];
	private currentPathIndex: number = 0;
	private isCalculatingPath: boolean = false;

	constructor(scene: Phaser.Scene, x: number, y: number, speed: number = 100, health: number = 3, easystar: EasyStar.js) {
		super(scene, x, y, ENEMY_KEY);
		this.setScale(0.25);
		this.speed = speed;
		this.health = health;
		this.x = x;
		this.y = y;
		this.easystar = easystar;
	}

	public findPath(player: Phaser.Physics.Arcade.Sprite){
		if(this.isCalculatingPath){
			return;
		}

		this.isCalculatingPath = true;

		const startX = Math.floor(this.x / 64);
		const startY = Math.floor(this.y / 64);

		const targetX = Math.floor(player.x / 64);
		const targetY = Math.floor(player.y / 64);

		this.easystar.findPath(startX, startY, targetX, targetY, (e)=>{
				this.isCalculatingPath = false;

				if(e === null){
					console.log("Path Not Found");
					return;
				}

				this.path = e;
				this.currentPathIndex = 1;
			}
		);
	}

	public followPlayer(){
		if(this.path.length === 0 || this.currentPathIndex >= this.path.length){
			this.setVelocity(0, 0);
			return;
		}

		const target = this.path[this.currentPathIndex];

		const targetX = (target.x * 64) + 32;
		const targetY = (target.y * 64) + 32;

		this.scene.physics.moveTo(this, targetX, targetY, this.speed);
	}

	public shotTook(): boolean{
		this.health--;
		return this.health <= 0;
	}
}