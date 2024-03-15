import { Time } from '../Units'

export interface System {
    update(dt: Time): void
}
