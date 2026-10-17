import type {PowerUpType} from "./PowerUp.ts"

type TimedPowerUpType = Exclude<PowerUpType, "life"> // life is the only power-up that is not timed
const POWER_UP_DURATION = 10000 // 10 seconds

export default class PowerUpManager {
    private activePowerUps = new Set<TimedPowerUpType>() // stores power-ups that are currently active
    private powerUpTimers = new Map<TimedPowerUpType, Phaser.Time.TimerEvent>() // stores timers for active power-ups so they can be reset if the same power-up is collected again

    constructor(private readonly scene: Phaser.Scene) {}

    // activates a power-up and schedules its expiration with the scene timer.
    public apply(powerUpType: PowerUpType): void {
        if (powerUpType === "life") { // life is special case as its not timed and just adds to the player's lives
            const lives = this.scene.registry.get("lives")
            this.scene.registry.set("lives", lives + 1)
            return
        }

        // check if the power-up previously had a timer, and if so remove it to reset the duration
        const previousTimer = this.powerUpTimers.get(powerUpType)
        if (previousTimer !== undefined) {
            previousTimer.remove()
        }

        this.activePowerUps.add(powerUpType)

        // schedule a timer to remove the power-up after the duration
        const timer = this.scene.time.delayedCall(POWER_UP_DURATION, () => {
            this.activePowerUps.delete(powerUpType)
            this.powerUpTimers.delete(powerUpType)
        })

        // set timer in the map to keep track of it for potential future resets
        this.powerUpTimers.set(powerUpType, timer)
    }

    public isActive(powerUpType: TimedPowerUpType): boolean {
        return this.activePowerUps.has(powerUpType)
    }
}