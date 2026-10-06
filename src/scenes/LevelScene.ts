import * as Phaser from "phaser";
import{ MAP_KEY, MAP_FILE, GROUND_TILESET_NAME,
     GROUND_KEY, GROUND_FILE,DECO_TILESET_NAME,
     DECO_KEY,DECO_FILE,GROUND_LAYER,DECO_LAYER} from "../assets.ts";

export default class LevelScene extends Phaser.Scene {
     private map!: Phaser.Tilemaps.Tilemap;
     private ground!: Phaser.Tilemaps.TilemapLayer;
     private deco!: Phaser.Tilemaps.TilemapLayer;
     
     constructor(){
          super("LevelScene");
     }

     preload(): void{
          this.load.tilemapTiledJSON(MAP_KEY, MAP_FILE);
          this.load.image(GROUND_KEY, GROUND_FILE);
          this.load.image(DECO_KEY, DECO_FILE);
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

     create(): void{
          this.createMap();
          this.cameras.main.setZoom(0.230);
     }

}


  