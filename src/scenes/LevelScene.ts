import * as Phaser from "phaser";
import{ MAP_KEY, MAP_FILE, GROUND_TILESET_NAME,
     GROUND_KEY, GROUND_FILE,DECO_TILESET_NAME,
     DECO_KEY,DECO_FILE,GROUND_LAYER,DECO_LAYER,
	 ENEMY_KEY, ENEMY_FILE} from "../assets.ts";
import {EnemySpawner, SpawnPosition} from "../enemyspawner.ts";

export default class LevelScene extends Phaser.Scene {
     private map!: Phaser.Tilemaps.Tilemap;
     private ground!: Phaser.Tilemaps.TilemapLayer;
     private deco!: Phaser.Tilemaps.TilemapLayer;
	 private enemySpawner! : EnemySpawner;
     
     constructor(){
          super("LevelScene");
     }

     preload(): void{
          this.load.tilemapTiledJSON(MAP_KEY, MAP_FILE);
          this.load.image(GROUND_KEY, GROUND_FILE);
          this.load.image(DECO_KEY, DECO_FILE);
		  this.load.image(ENEMY_KEY, ENEMY_FILE);
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
          this.ground.setCollisionByProperty({ collides: true });
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

     create(): void{
          this.createMap();
		this.createSpawner();
		
		this.enemySpawner.spawnEnemy(1);

     }

}


  