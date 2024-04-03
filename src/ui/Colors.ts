export interface Color {
    readonly r: number
    readonly g: number
    readonly b: number
    readonly a: number
}

export const color = (r: number, g: number, b: number, a: number): Color => ({ r, g, b, a })
export const white = color(255, 255, 255, 1)
export const black = color(0, 0, 0, 1)
export const red = color(255, 0, 0, 1)
export const green = color(0, 255, 0, 1)
export const blue = color(0, 0, 255, 1)
export const plasmaBlue = color(41, 173, 230, 1)
export const fireOrange = color(240, 180, 14, 1)
export const asteroidGray = color(71, 59, 59, 1)
export const metallicGray = color(191, 184, 184, 1)
