import * as Phaser from "phaser";
import{ MAP_KEY, MAP_FILE, GROUND_TILESET_NAME,
     GROUND_KEY, GROUND_FILE,DECO_TILESET_NAME,
     DECO_KEY,DECO_FILE,GROUND_LAYER,DECO_LAYER,
	ENEMY_KEY, ENEMY_FILE, PLAYER_KEY, PLAYER_FILE} from "../assets.ts";
import {EnemySpawner} from "../EnemySpawner.ts";
import Player from "../entities/Player.ts";
import { SpawnPosition } from "../SpawnPosition.ts";

export default class LevelScene extends Phaser.Scene {
     private map!: Phaser.Tilemaps.Tilemap;
     private ground!: Phaser.Tilemaps.TilemapLayer;
     private deco!: Phaser.Tilemaps.TilemapLayer;
	 private enemySpawner! : EnemySpawner;
     private player! : Player;
	 private spawnTime: integer = 0;
	 private timeBetweenWaves: integer = 3000; // In Milliseconds
     private hudText!: Phaser.GameObjects.Text;
     private lives = 3;
     
     constructor(){
          super("LevelScene");
     }

     preload(): void{
          this.load.tilemapTiledJSON(MAP_KEY, MAP_FILE);
          this.load.image(GROUND_KEY, GROUND_FILE);
          this.load.image(DECO_KEY, DECO_FILE);
		  this.load.image(ENEMY_KEY, ENEMY_FILE);
		  this.load.image(PLAYER_KEY, PLAYER_FILE);
     }

     private createMap(): void{
          this.map = this.make.tilemap({key: MAP_KEY});
          const groundTiles = this.map.addTilesetImage(GROUND_TILESET_NAME, GROUND_KEY);
          if (groundTiles == null){
               throw new Error(`No Tileset "${GROUND_TILESET_NAME}" found in map`);
          }
          const decoTiles = this.map.addTilesetImage(DECO_TILESET_NAME, DECO_KEY);
          if (decoTiles == null){
               throw new Error(`No Tileset "${DECO_TILESET_NAME}" found in map`);
          }

          this.ground = this.map.createLayer(GROUND_LAYER, [groundTiles, decoTiles]) as Phaser.Tilemaps.TilemapLayer;
          this.deco = this.map.createLayer(DECO_LAYER, [groundTiles, decoTiles]) as Phaser.Tilemaps.TilemapLayer;  
          this.ground.setCollisionByProperty({ collision: true });
          this.deco.setCollisionByProperty({ collision: true });
     }

	 private createSpawner(){
		const width = this.sys.game.canvas.width;
		const height = this.sys.game.canvas.height;

		const spawn1 : SpawnPosition = new SpawnPosition(width / 2, 0);
		const spawn2 : SpawnPosition = new SpawnPosition(width, height / 2);
		const spawn3 : SpawnPosition = new SpawnPosition(width / 2, height);
		const spawn4 : SpawnPosition = new SpawnPosition(0, height / 2);

		this.enemySpawner = new EnemySpawner(this, spawn1, spawn2, spawn3, spawn4);
	 }

      private createPlayer(): void{
          const centreX = this.sys.game.canvas.width / 2;
          const centreY = this.sys.game.canvas.height / 2;
          this.player = new Player(this, centreX, centreY);
      }

      private updatehud(): void{
          this.hudText.setText(`Lives: ${this.lives}`);
      }

      private loseLife(): void{
          if(this.player.isGodMode()){
               return;
          }
          this.lives = this.lives - 1;
          this.updatehud();
          this.player.makeGodMode();
          if(this.lives <=0){
               this.scene.start("GameOver");
          }

      }

     create(): void{
          this.createMap();
		this.createSpawner();
		this.enemySpawner.spawnEnemy(12);
          this.createPlayer();
          this.hudText = this.add.text(32, 32, `Lives: ${this.lives}`,{
               fontFamily:"Arial",
               fontSize: "50px",
               color: 'white',
               fontStyle: "bold"
          });
          this.updatehud();

          this.physics.add.overlap(this.player, this.enemySpawner.getEnemies(), ()=>{
               this.loseLife();
          })
          this.deco.setCollisionByProperty({ collision: true });
          this.physics.add.collider(this.player, this.deco);
          this.physics.add.collider(this.enemySpawner.getEnemies(), this.deco);

     }

     override update(time: integer): void{
		this.player.update(time);
        this.enemySpawner.moveEnemies(this.player);

		console.log("SpawnTime: " + this.spawnTime);
		console.log("Current Time: " + time);

		if(time >= (this.spawnTime + this.timeBetweenWaves) && this.enemySpawner.enemiesLeft() == 0){
			this.spawnTime = time;
		}
		if(this.enemySpawner.enemiesLeft() != 0){
			this.spawnTime = time;
		}
	
          this.player.update(3);
          this.enemySpawner.moveEnemies(this.player);
     }

}