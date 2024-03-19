import { deepCopy } from '../src/Util'

describe('deepCopy', () => {

    it('should return a deep copy of the object', () => {
        const original = {
            a: 1,
            b: '2',
            c: [3, 4, 5],
            d: {
                e: 6,
                f: 7,
                g: [8, 9, 10],
            },
        }

        const copy = deepCopy(original)

        expect(copy).toEqual(original)
        expect(copy).not.toBe(original)
        expect(copy.d).not.toBe(original.d)
        expect(copy.d.g).not.toBe(original.d.g)
    })

    it('should return a deep copy of the array', () => {
        const original = [1, '2', [3, 4, 5], { a: 6, b: 7, c: [8, 9, 10] }]

        const copy = deepCopy(original)

        expect(copy).toEqual(original)
        expect(copy).not.toBe(original)
        expect(copy[2]).not.toBe(original[2])
        expect(copy[3]).not.toBe(original[3])
    })

    it('should not copy primitive values', () => {
        const original = 1
        const copy = deepCopy(original)

        expect(copy).toBe(original)
    })

    it('should not copy null', () => {
        const original = null
        const copy = deepCopy(original)

        expect(copy).toBe(original)
    })

    it('should not copy undefined', () => {
        const original = undefined
        const copy = deepCopy(original)

        expect(copy).toBe(original)
    })
})
