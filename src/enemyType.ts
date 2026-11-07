export interface EnemyType{
    speed: number;
    health: number;
}

export const EnemyTypes: EnemyType[] = [
    { speed: 70, health: 8 },
    { speed: 150, health: 3 },
    { speed: 200, health: 2 }
];