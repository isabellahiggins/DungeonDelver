export interface EnemyType{
    speed: number;
    health: number;
    sprite: number;
}

export const EnemyTypes: EnemyType[] = [
    { speed: 70, health: 8, sprite: 0 },
    { speed: 150, health: 3, sprite: 10 },
    { speed: 200, health: 2, sprite: 13}
];