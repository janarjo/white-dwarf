import { isIntersect, isWithin, Rectangle } from '../src/Math'

describe('isIntersect function', () => {
    it('should return true if the rectangles intersect', () => {
        const r1: Rectangle = [[0, 0], [10, 10]]
        const r2: Rectangle = [[5, 5], [10, 10]]

        expect(isIntersect(r1, r2)).toBe(true)
    })

    it('should return false if the rectangles do not intersect', () => {
        const r1: Rectangle = [[0, 0], [10, 10]]
        const r2: Rectangle = [[11, 11], [10, 10]]

        expect(isIntersect(r1, r2)).toBe(false)
    })

    it('should return true if the rectangles are the same', () => {
        const r1: Rectangle = [[0, 0], [10, 10]]
        const r2: Rectangle = [[0, 0], [10, 10]]

        expect(isIntersect(r1, r2)).toBe(true)
    })

    it('should return false if the rectangles are adjacent', () => {
        const r1: Rectangle = [[0, 0], [10, 10]]
        const r2: Rectangle = [[11, 11], [10, 10]]

        expect(isIntersect(r1, r2)).toBe(false)
    })

    it('should return true if the rectangles are adjacent and touching', () => {     
        const r1: Rectangle = [[0, 0], [10, 10]]
        const r2: Rectangle = [[10, 0], [10, 10]]

        expect(isIntersect(r1, r2)).toBe(true)
    })
})

describe('isWithin function', () => {
    it('should return true if the point is within the rectangle', () => {
        const point = [5, 5] as const
        const rectangle: Rectangle = [[0, 0], [10, 10]]

        expect(isWithin(point, rectangle)).toBe(true)
    })

    it('should return false if the point is not within the rectangle', () => {
        const point = [11, 11] as const
        const rectangle: Rectangle = [[0, 0], [10, 10]]

        expect(isWithin(point, rectangle)).toBe(false)
    })

    it('should return true if the point is on the edge of the rectangle', () => {
        const point = [10, 10] as const
        const rectangle: Rectangle = [[0, 0], [10, 10]]

        expect(isWithin(point, rectangle)).toBe(true)
    })
})
