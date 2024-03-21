import { Transform } from '../src/components/Transform'

export const transform = (position: [number, number]) => new Transform({ position, direction: [0, 0] })
