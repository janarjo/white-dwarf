import {
    generateRandomPolygon,
    isPolygon,
    isIntersect,
    isWithinRectangle,
    Rectangle,
    Offset,
    Line,
    isIntersectingLineSegments,
    Triangle,
    isWithinTriangle,
    round,
    isWithinPlane,
    Plane,
} from '../src/math/Math'

describe('round function', () => {
    it('should round a number to the nearest integer', () => {
        expect(round(0.5)).toBe(1)
        expect(round(0.4)).toBe(0)
    })

    it('should round a number to the nearest integer with a specified precision', () => {
        expect(round(0.55, 1)).toBe(0.6)
        expect(round(0.44, 1)).toBe(0.4)

        expect(round(0.555, 2)).toBe(0.56)
        expect(round(0.444, 2)).toBe(0.44)

        expect(round(0.5555, 3)).toBe(0.556)
        expect(round(0.4444, 3)).toBe(0.444)
    })
})

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

describe('isWithinRectangle function', () => {
    it('should return true if the point is within the rectangle', () => {
        const point = [5, 5] as const
        const rectangle: Rectangle = [[0, 0], [10, 10]]

        expect(isWithinRectangle(point, rectangle)).toBe(true)
    })

    it('should return false if the point is not within the rectangle', () => {
        const point = [11, 11] as const
        const rectangle: Rectangle = [[0, 0], [10, 10]]

        expect(isWithinRectangle(point, rectangle)).toBe(false)
    })

    it('should return true if the point is on the edge of the rectangle', () => {
        const point = [10, 10] as const
        const rectangle: Rectangle = [[0, 0], [10, 10]]

        expect(isWithinRectangle(point, rectangle)).toBe(true)
    })
})

describe('isWithinTriangle function', () => {
    it('should return true if the point is within the triangle', () => {
        const point = [4, 4] as const
        const triangle: Triangle = [[0, 0], [10, 0], [10, 10]]

        expect(isWithinTriangle(point, triangle)).toBe(true)
    })

    it('should return false if the point is not within the triangle', () => {
        const point = [11, 11] as const
        const triangle: Triangle= [[0, 0], [10, 0], [10, 10]]

        expect(isWithinTriangle(point, triangle)).toBe(false)
    })

    it('should return true if the point is on the edge of the triangle', () => {
        const point = [10, 10] as const
        const triangle: Triangle = [[0, 0], [10, 0], [10, 10]]

        expect(isWithinTriangle(point, triangle)).toBe(true)
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
        points.forEach(point => expect(isWithinRectangle(point, bounds)).toBe(true))
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
        expect(isPolygon(points)).toBe(true)
    })
})

describe('isWithinPlane function', () => {
    it('should return true if the point is on the plane', () => {
        const point = [0, 0] as const
        const plane: Plane = [[0, 0], [1, 0]]

        expect(isWithinPlane(point, plane)).toBe(true)
    })

    it('should return true if the point is above the plane', () => {
        const point = [1, 1] as const
        const plane: Plane = [[0, 0], [0, 1]]

        expect(isWithinPlane(point, plane)).toBe(true)
    })

    it('should return false if the point is below the plane', () => {
        const point = [0, -1] as const
        const plane: Plane = [[0, 0], [0, 1]]

        expect(isWithinPlane(point, plane)).toBe(false)
    })

    it('should return true if the point is on the plane with a diagonal normal', () => {
        const point = [1, 1] as const
        const plane: Plane = [[0, 0], [1, 1]]

        expect(isWithinPlane(point, plane)).toBe(true)
    })

    it('should return false if the point is below the plane with a diagonal normal', () => {
        const point = [-1, -1] as const
        const plane: Plane = [[0, 0], [1, 1]]

        expect(isWithinPlane(point, plane)).toBe(false)
    })

    it('should return true if the point is far above the plane', () => {
        const point = [100, 100] as const
        const plane: Plane = [[0, 0], [1, 1]]

        expect(isWithinPlane(point, plane)).toBe(true)
    })

    it('should return false if the point is far below the plane', () => {
        const point = [-100, -100] as const
        const plane: Plane = [[0, 0], [1, 1]]

        expect(isWithinPlane(point, plane)).toBe(false)
    })
})
