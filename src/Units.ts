

abstract class Unit {}

export class Time extends Unit {
    constructor(readonly amount: number, readonly millisPerAmount: number) {
        super()
    }

    toSec(): number {
        return this.amount * this.millisPerAmount * 0.001
    }
}

export class Length extends Unit {
    constructor(readonly amount: number, readonly pxPerAmount: number) {
        super()
    }

    toPx(): number {
        return this.amount * this.pxPerAmount
    }
}

export class Rotation extends Unit {
    constructor(readonly amount: number, readonly radPerAmount: number) {
        super()
    }

    toRad(): number {
        return this.amount * this.radPerAmount
    }
}

export class Speed extends Unit {
    constructor(readonly lengthUnit: Length, readonly timeUnit: Time) {
        super()
    }

    toPxPerSec(): number {
        return this.lengthUnit.toPx() / this.timeUnit.toSec()
    }
}

export class RateOfRotation extends Unit {
    constructor(readonly rotation: Rotation, readonly time: Time) {
        super()
    }

    toRadPerSec(): number {
        return this.rotation.toRad() / this.time.toSec()
    }
}

export class Acceleration extends Unit {
    constructor(readonly velocityUnit: Speed, readonly timeUnit: Time) {
        super()
    }

    toPxPerSec(): number {
        return this.velocityUnit.toPxPerSec() / this.timeUnit.toSec()
    }
}

export const sec = (amount: number) => new Time(amount, 1000)
export const px = (amount: number) => new Length(amount, 1)
export const deg = (amount: number) => new Rotation(amount, Math.PI / 180)
export const pxPerSec = (amount: number) => new Speed(px(amount), sec(1))
export const degPerSec = (amount: number) => new RateOfRotation(deg(amount), sec(1))
export const pxPerSec2 = (amount: number) => new Acceleration(pxPerSec(amount), sec(1))
