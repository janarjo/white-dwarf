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
    name: 'Plasma (x50)',
    description: 'Small plasma pack (x50)',
    amount: 50
})
