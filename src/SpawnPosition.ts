export class SpawnPosition{
	private x: number;
	private y: number;

	constructor(x: number, y: number){
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