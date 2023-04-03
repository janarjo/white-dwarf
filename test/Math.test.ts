import { generateRandomPolygon, isPolygon, isIntersect, isWithin, Rectangle, Vector, Offset, Line, isIntersectingLineSegments } from '../src/Math'

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

describe('isIntersectingLineSegments function', () => {
    it('should return true if the line segments intersect', () => {
        const l1: Line = [[0, 0], [10, 10]]
        const l2: Line = [[0, 10], [10, 0]]

        expect(isIntersectingLineSegments(l1, l2)).toBe(true)
    })

    it('should return true if the line segments intersect 2', () => {
        const l1: Line = [[0, 0], [10, 0]]
        const l2: Line = [[10, 10], [4, -4]]

        expect(isIntersectingLineSegments(l1, l2)).toBe(true)
    })

    it('should return false if the line segments do not intersect', () => {
        const l1: Line = [[0, 0], [10, 10]]
        const l2: Line = [[11, 11], [20, 20]]

        expect(isIntersectingLineSegments(l1, l2)).toBe(false)
    })

    it('should return true if the line segments are the same', () => {
        const l: Line = [[0, 0], [10, 10]]
        expect(isIntersectingLineSegments(l, l)).toBe(true)
    })

    it('should return false if the line segments are adjacent', () => {
        const l1: Line = [[0, 0], [10, 10]]
        const l2: Line = [[10, 10], [20, 20]]

        expect(isIntersectingLineSegments(l1, l2)).toBe(false)
    })

    it('should return false if the line segments are parallel', () => {
        const l1: Line = [[0, 0], [10, 10]]
        const l2: Line = [[0, 10], [10, 20]]

        expect(isIntersectingLineSegments(l1, l2)).toBe(false)
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

describe('isPolygon function', () => {
    it('should return false if the polygon has less than 3 points', () => {
        const points: Offset[] = [[0, 0], [10, 0]]
        expect(isPolygon(points)).toBe(false)
    })

    it('should return true if the polygon is a triangle', () => {
        const points: Offset[] = [[0, 0], [10, 0], [10, 10]]
        expect(isPolygon(points)).toBe(true)
    })

    it('should return true if the polygon is a square', () => {
        const points: Offset[] = [[0, 0], [10, 0], [10, 10], [0, 10]]
        expect(isPolygon(points)).toBe(true)
    })

    it('should return true if the polygon is a pentagon', () => {
        const points: Offset[] = [[0, 0], [10, 0], [10, 10], [5, 15], [0, 10]]
        expect(isPolygon(points)).toBe(true)
    })

    it('should return true if the polygon is a convex shape', () => {
        const points: Offset[] = [[0, 0], [10, 0], [10, 10], [5, 5], [0, 10]]
        expect(isPolygon(points)).toBe(true)
    })

    it('should return false if the polygon intersects itself', () => {
        const points: Offset[] = [[0, 0], [10, 0], [10, 10], [4, -4], [0, 10]]
        expect(isPolygon(points)).toBe(false)
    })
})

describe('generateRandomPolygon function', () => {
    it('should return a polygon with the correct number of points', () => {
        const points = generateRandomPolygon(10, 5, 10)
        expect(points.length).toBe(10)
    })

    it('should return a polygon with points within the specified bounds', () => {
        const points = generateRandomPolygon(10, 5, 10)
        const bounds: Rectangle =  [[-10, -10], [20, 20]]
        points.forEach(point => expect(isWithin(point, bounds)).toBe(true))
    })

    it('should return a polygon when max = min', () => {
        const points = generateRandomPolygon(10, 5, 5)
        expect(isPolygon(points)).toBe(true)
    })

    it('should return a polygon when few points and max > min', () => {
        const points = generateRandomPolygon(5, 5, 10)
        expect(isPolygon(points)).toBe(true)
    })

    it('should return a polygon when many points and max > min', () => {
        const points: Offset[] = generateRandomPolygon(10, 10, 20)
        console.log(points)
        expect(isPolygon(points)).toBe(true)
    })
})
