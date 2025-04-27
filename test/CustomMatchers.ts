import { expect } from '@jest/globals'
import { Vector } from '../src/math/Math'
import { round } from '../src/math/Math'

expect.extend({
    toMatchVector(received: Vector, expected: Vector, precision = 3) {
        const roundedReceived = received.map(val => round(val, precision))
        const pass = roundedReceived.every((val, i) => val === expected[i])
        if (pass) {
            return {
                message: () => `expected ${received} (rounded to ${roundedReceived}) not to match ${expected}`,
                pass: true
            }
        } else {
            return {
                message: () => `expected ${received} (rounded to ${roundedReceived}) to match ${expected}`,
                pass: false
            }
        }
    }
})

declare global {
    // eslint-disable-next-line @typescript-eslint/no-namespace
    namespace jest {
        interface Matchers<R> {
            toMatchVector(expected: Vector): R
            toMatchVector(expected: Vector, precision: number): R
        }
    }
}

export { expect }
