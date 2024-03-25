export interface Item {
    code: ItemCode
    name: string
    description: string
    amount: number
}

export enum ItemCode {
    AMMO_PLASMA_SMALL,
    AMMO_MISSILE_SMALL,
}

export const smallPlasmaPack = () => ({
    code: ItemCode.AMMO_PLASMA_SMALL,
    name: 'Plasma (x50)',
    description: 'Small plasma pack (x50)',
    amount: 50
})

export const smallMissilePack = () => ({
    code: ItemCode.AMMO_MISSILE_SMALL,
    name: 'Missile (x10)',
    description: 'Small missile pack (x25)',
    amount: 10
})
