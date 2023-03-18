export interface Item {
    code: ItemCode
    name: string
    description: string
    amount: number
}

export enum ItemCode {
    AMMO_PLASMA_SMALL
}

export const smallPlasmaPack = () => ({
    code: ItemCode.AMMO_PLASMA_SMALL,
    name: 'Plasma (x5)',
    description: 'Small plasma pack (x5)',
    amount: 5
})
