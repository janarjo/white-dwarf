import { Plane, Polygon } from '../src/math/Math'
import {
    isEar,
    earclip,
    getAxes,
    project,
    getContactPoints,
    buildClippingPlanes,
    clip,
    clipToPlane,
} from '../src/math/SAT'

describe('isEar function', () => {
    it('should return true if the triangle is an ear', () => {
        const polygon = [[0, 0], [10, 0], [10, 10], [0, 10]] as const
        const triangle = [[0, 0], [10, 0], [10, 10]] as const
        expect(isEar(triangle, polygon)).toBe(true)
    })

    it('should return false if the triangle is not an ear because it is concave', () => {
        const polygon = [[0, 0], [10, 0], [10, 10], [5, 5], [0, 10]] as const
        const triangle = [[10, 10], [5, 5], [0, 10]] as const
        expect(isEar(triangle, polygon)).toBe(false)
    })

    it('should return false if the triangle is not an ear because contains another point of the polygon within', () => {
        const polygon = [[0, 0], [10, 0], [10, 10], [5, 5], [0, 10]] as const
        const triangle = [[0, 0], [10, 0], [10, 10]] as const
        expect(isEar(triangle, polygon)).toBe(false)
    })
})

describe('earclip function', () => {
    it('should throw an error if the polygon is not valid', () => {
        const polygon = [[0, 0], [10, 0]] as const
        expect(() => earclip(polygon)).toThrowError()
    })

    it('should return a triangulated polygon (triangle)', () => {
        const polygon = [[0, 0], [10, 0], [10, 10]] as const
        const triangles = earclip(polygon)
        expect(triangles.length).toBe(1)
        expect(triangles[0]).toEqual([[0, 0], [10, 0], [10, 10]])
    })

    it('should return a triangulated polygon (rectangle)', () => {
        const polygon = [[0, 0], [10, 0], [10, 10], [0, 10]] as const
        const triangles = earclip(polygon)
        expect(triangles.length).toBe(2)
        expect(triangles[0]).toEqual([[0, 0], [10, 0], [10, 10]])
        expect(triangles[1]).toEqual([[0, 0], [10, 10], [0, 10]])
    })

    it('should return a triangulated polygon (pentagon)', () => {
        const polygon = [[0, 0], [10, 0], [10, 10], [5, 15], [0, 10]] as const
        const triangles = earclip(polygon)
        expect(triangles.length).toBe(3)
        expect(triangles[0]).toEqual([[0, 0], [10, 0], [10, 10]])
        expect(triangles[1]).toEqual([[0, 0], [10, 10], [5, 15]])
        expect(triangles[2]).toEqual([[0, 0], [5, 15], [0, 10]])
    })
})

describe('getAxes function', () => {
    it('should return the correct axes for a rectangle', () => {
        const rectangle = [[0, 0], [10, 0], [10, 10], [0, 10]] as const
        const axes = getAxes(rectangle)
        expect(axes.length).toBe(2)
        expect(axes[0]).toEqual([-0, 1])
        expect(axes[1]).toEqual([-1, 0])
    })

    it('should return the correct axes for a triangle', () => {
        const triangle = [[0, 0], [10, 0], [10, 10]] as const
        const axes = getAxes(triangle)
        expect(axes.length).toBe(3)
        expect(axes[0]).toEqual([-0, 1])
        expect(axes[1]).toEqual([-1, 0])
        expect(axes[2]).toEqual([0.7071067811865475, -0.7071067811865475])
    })
})

describe('project function', () => {
    it('should return the correct projection for a rectangle', () => {
        const rectangle = [[0, 0], [10, 0], [10, 10], [0, 10]] as const
        const axis = [-0, 1] as const
        const projection = project(rectangle, axis)
        expect(projection).toEqual([0, 10])
    })

    it('should return the correct projection for a triangle', () => {
        const triangle = [[0, 0], [10, 0], [10, 10]] as const
        const axis = [0.7071067811865475, -0.7071067811865475] as const
        const projection = project(triangle, axis)
        expect(projection).toEqual([0, 7.071067811865475])
    })
})

describe('getContactPoints function', () => {
    it('should return the correct contact points when the incident triangle is fully within the reference triangle', () => {
        const ref = [[0, 0], [10, 0], [5, 10]] as const
        const inc = [[2, 2], [8, 2], [5, 5]] as const
        const result = getContactPoints(ref, inc)
        expect(result).toEqual([[2, 2], [8, 2], [5, 5]])
    })

    it('should return the correct contact points when the incident triangle is partially clipped by the reference triangle', () => {
        const ref = [[0, 0], [10, 0], [5, 10]] as const
        const inc = [[-5, 5], [5, 5], [0, 15]] as const
        const result = getContactPoints(ref, inc)
        expect(result).toEqual([[2.5, 5], [5, 5], [3.75, 7.5]])
    })

    it('should return an empty array when the incident triangle is completely outside the reference triangle', () => {
        const ref = [[0, 0], [10, 0], [5, 10]] as const
        const inc = [[-5, -5], [-10, -10], [-15, -15]] as const
        const result = getContactPoints(ref, inc)
        expect(result).toEqual([])
    })

    it('should handle a case where the incident triangle intersects the reference triangle at a single point', () => {
        const ref = [[0, 0], [10, 0], [5, 10]] as const
        const inc = [[10, 0], [15, 0], [15, 15]] as const
        const result = getContactPoints(ref, inc)
        expect(result).toEqual([[10, 0]])
    })

    it('should handle a case where the incident triangle lies exactly on one of the reference triangle edges', () => {
        const ref = [[0, 0], [10, 0], [5, 10]] as const
        const inc = [[0, 0], [10, 0], [5, -5]] as const
        const result = getContactPoints(ref, inc)
        expect(result).toEqual([[0, 0], [10, 0]])
    })

    it('should handle a case where the incident triangle is parallel to one of the reference triangle edges but outside', () => {
        const ref = [[0, 0], [10, 0], [5, 10]] as const
        const inc = [[0, -5], [10, -5], [5, -10]] as const
        const result = getContactPoints(ref, inc)
        expect(result).toEqual([])
    })

    it('should handle a case where the incident triangle intersects multiple edges of the reference triangle', () => {
        const ref = [[0, 0], [10, 0], [5, 10]] as const
        const inc = [[-5, 5], [5, -5], [15, 5]] as const
        const result = getContactPoints(ref, inc)
        expect(result).toEqual([[0, 0], [10, 0], [7.5, 5], [2.5, 5]])
    })

    it('should handle a case where the incident triangle is collinear with one of the reference triangle edges', () => {
        const ref = [[0, 0], [10, 0], [5, 10]] as const
        const inc = [[0, 0], [5, 0], [10, 0]] as const
        const result = getContactPoints(ref, inc)
        expect(result).toEqual([[0, 0], [5, 0], [10, 0]])
    })
})

describe('buildClippingPlanes function', () => {
    it('should handle a triangle with a horizontal edge', () => {
        const triangle = [[0, 0], [10, 0], [5, 10]] as const
        const result = buildClippingPlanes(triangle)
        expect(result.length).toBe(3)
        expect(result[0]).toEqual([[0, 0], [0, -1]]) // Facing slightly up to the left
        expect(result[1]).toEqual([[10, 0], [0.8944271909999159, 0.4472135954999579]]) // Facing slightly up to the right
        expect(result[2]).toEqual([[5, 10], [-0.8944271909999159, 0.4472135954999579]]) // Facing slightly down to the left
    })

    it('should handle a triangle with a vertical edge', () => {
        const triangle = [[0, 0], [5, 5], [0, 10]] as const
        const result = buildClippingPlanes(triangle)
        expect(result.length).toBe(3)
        expect(result[0]).toEqual([[0, 0], [0.7071067811865475, -0.7071067811865475]]) // Facing slightly down to the right
        expect(result[1]).toEqual([[5, 5], [0.7071067811865475, 0.7071067811865475]]) // Facing slightly up to the right
        expect(result[2]).toEqual([[0, 10], [-1, -0]]) // Facing to the left
    })

    it('should handle a triangle with a diagonal edge', () => {
        const triangle = [[0, 0], [10, 0], [10, 10]] as const
        const result = buildClippingPlanes(triangle)
        expect(result.length).toBe(3)
        expect(result[0]).toEqual([[0, 0], [0, -1]]) // Facing down
        expect(result[1]).toEqual([[10, 0], [1, -0]]) // Facing to the right
        expect(result[2]).toEqual([[10, 10], [-0.7071067811865475, 0.7071067811865475]]) // Facing up to the left
    })

    it('should handle an acute triangle', () => {
        const triangle = [[0, 0], [10, 0], [5, 10]] as const
        const result = buildClippingPlanes(triangle)
        expect(result.length).toBe(3)
        expect(result[0]).toEqual([[0, 0], [0, -1]]) // Facing down
        expect(result[1]).toEqual([[10, 0], [0.8944271909999159, 0.4472135954999579]]) // Facing slightly up to the right
        expect(result[2]).toEqual([[5, 10], [-0.8944271909999159, 0.4472135954999579]]) // Facing up to the left
    })

    it('should handle a degenerate triangle', () => {
        const triangle = [[0, 0], [0, 0], [5, 10]] as const
        const result = buildClippingPlanes(triangle)
        expect(result.length).toBe(3)
        expect(result[0]).toEqual([[0, 0], [NaN, NaN]]) // Invalid plane due to degenerate triangle
        expect(result[1]).toEqual([[0, 0], [0.8944271909999159, -0.4472135954999579]]) // Facing slightly down to the right
    })

    it('should handle a triangle with collinear edges', () => {
        const triangle = [[0, 0], [10, 0], [20, 0]] as const
        const result = buildClippingPlanes(triangle)
        expect(result.length).toBe(3)
        expect(result[0]).toEqual([[0, 0], [0, -1]]) // Facing down
        expect(result[1]).toEqual([[10, 0], [0, -1]]) // Facing down
        expect(result[2]).toEqual([[20, 0], [0, 1]]) // Facing up
    })
})

describe('clip function', () => {

    it('should return an empty array if the polygon is empty', () => {
        const polygon: Polygon = []
        const plane: Plane = [[0, 0], [0, -1]] // Clipping plane: y <= 0
        const result = clip(polygon, plane)
        expect(result).toEqual([])
    })

    it ('should return the point if the polygon is a single point outside the clipping plane', () => {
        const polygon = [[5, 5]] as const
        const plane: Plane = [[0, 0], [0, -1]] // Clipping plane: y <= 0
        const result = clip(polygon, plane)
        expect(result).toEqual([[5, 5]])
    })

    it('should return an empty array if the polygon is a single point inside the clipping plane', () => {
        const polygon = [[5, -5]] as const
        const plane: Plane = [[0, 0], [0, -1]] // Clipping plane: y <= 0
        const result = clip(polygon, plane)
        expect(result).toEqual([])
    })

    it('should return the original polygon if the polygon is a line segment outside the clipping plane', () => {
        const polygon = [[0, 0], [10, 0]] as const
        const plane: Plane = [[0, 0], [0, -1]] // Clipping plane: y <= 0
        const result = clip(polygon, plane)
        expect(result).toEqual(polygon)
    })

    it('should return an empty array if the polygon is a line segment inside the clipping plane', () => {
        const polygon = [[0, -5], [10, -5]] as const
        const plane: Plane = [[0, 0], [0, -1]] // Clipping plane: y <= 0
        const result = clip(polygon, plane)
        expect(result).toEqual([])
    })

    it('should return a clipped polygon if the polygon is a line segment that intersects the clipping plane', () => {
        const polygon = [[-5, -5], [5, 5]] as const
        const plane: Plane = [[0, 0], [0, -1]] // Clipping plane: y <= 0
        const result = clip(polygon, plane)
        expect(result).toEqual([[0, 0], [5, 5]])
    })

    it('should return the original polygon if it is completely outside the clipping plane', () => {
        const polygon = [[0, 0], [10, 0], [10, 10], [0, 10]] as const
        const plane: Plane = [[0, 0], [0, -1]] // Clipping plane: y <= 0
        const result = clip(polygon, plane)
        expect(result).toEqual(polygon)
    })

    it('should return a clipped polygon if part of it is inside the clipping plane', () => {
        const polygon = [[-5, -5], [10, -5], [10, 10], [-5, 10]] as const
        const plane: Plane = [[0, 0], [0, -1]] // Clipping plane: y <= 0
        const result = clip(polygon, plane)
        expect(result).toEqual([[10, 0], [10, 10], [-5, 10], [-5, 0]])
    })

    it('should return an empty array if the polygon is inside the clipping plane', () => {
        const polygon = [[-5, -5], [10, -5], [10, -10], [-5, -10]] as const
        const plane: Plane = [[0, 0], [0, -1]] // Clipping plane: y <= 0
        const result = clip(polygon, plane)
        expect(result).toEqual([])
    })

    it('should handle a polygon that intersects the clipping plane at multiple points', () => {
        const polygon = [[-5, 5], [5, 5], [5, -5], [-5, -5]] as const
        const plane: Plane = [[0, 0], [0, -1]] // Clipping plane: y <= 0
        const result = clip(polygon, plane)
        expect(result).toEqual([[-5, 5], [5, 5], [5, 0], [-5, 0]])
    })

    it('should handle a polygon that lies exactly on the clipping plane', () => {
        const polygon = [[0, 0], [10, 0], [10, 10], [0, 10]] as const
        const plane: Plane = [[0, 0], [0, -1]] // Clipping plane: y <= 0
        const result = clip(polygon, plane)
        expect(result).toEqual(polygon)
    })

    it('should handle a polygon that is parallel to the clipping plane and inside it', () => {
        const polygon = [[0, -5], [10, -5], [10, -10], [0, -10]] as const
        const plane: Plane = [[0, 0], [0, -1]] // Clipping plane: y <= 0
        const result = clip(polygon, plane)
        expect(result).toEqual([])
    })

    it('should handle a polygon that intersects the clipping plane at an acute angle', () => {
        const polygon = [[-5, -5], [10, -5], [5, 5]] as const
        const plane: Plane = [[0, 0], [0, -1]] // Clipping plane: y <= 0
        const result = clip(polygon, plane)
        expect(result).toEqual([[7.5, 0], [5, 5], [0, 0]])
    })

    it('should handle a polygon that intersects the clipping plane at an obtuse angle', () => {
        const polygon = [[-5, 5], [5, -5], [10, 5]] as const
        const plane: Plane = [[0, 0], [0, -1]] // Clipping plane: y <= 0
        const result = clip(polygon, plane)
        expect(result).toEqual([[-5, 5], [0, 0], [7.5, 0], [10, 5]])
    })

    it('should handle a degenerate polygon with fewer than 3 vertices', () => {
        const polygon = [[0, 0], [10, 0]] as const
        const plane: Plane = [[0, 0], [0, -1]] // Clipping plane: y <= 0
        const result = clip(polygon, plane)
        expect(result).toEqual(polygon)
    })

    it('should handle a polygon that is completely clipped to a single point', () => {
        const polygon = [[-5, -5], [0, 0], [5, -5]] as const
        const plane: Plane = [[0, 0], [0, -1]] // Clipping plane: y <= 0
        const result = clip(polygon, plane)
        expect(result).toEqual([[0, 0]])
    })
})

describe('clipToPlane function', () => {
    it('should return both points if the line is outside the plane', () => {
        const line = [[0, 0], [10, 10]] as const
        const plane: Plane = [[0, 0], [0, -1]] // Clipping plane: y <= 0
        const result = clipToPlane(line, plane)
        expect(result).toEqual([[0, 0], [10, 10]])
    })

    it('should return an empty array if the line is completely inside the plane', () => {
        const line = [[-5, -5], [-10, -10]] as const
        const plane: Plane = [[0, 0], [0, -1]] // Clipping plane: y <= 0
        const result = clipToPlane(line, plane)
        expect(result).toEqual([])
    })

    it('should return the intersection point if the line intersects the plane', () => {
        const line = [[-5, 5], [5, -5]] as const
        const plane: Plane = [[0, 0], [0, -1]] // Clipping plane: y <= 0
        const result = clipToPlane(line, plane)
        expect(result).toEqual([[-5, 5], [0, 0]])
    })

    it('should handle a line that lies exactly on the plane', () => {
        const line = [[0, 0], [10, 0]] as const
        const plane: Plane = [[0, 0], [0, -1]] // Clipping plane: y <= 0
        const result = clipToPlane(line, plane)
        expect(result).toEqual([[0, 0], [10, 0]])
    })

    it('should handle a line that is parallel to the plane but inside the region', () => {
        const line = [[0, -5], [10, -5]] as const
        const plane: Plane = [[0, 0], [0, -1]] // Clipping plane: y <= 0
        const result = clipToPlane(line, plane)
        expect(result).toEqual([])
    })

    it('should handle a line that intersects the plane at an acute angle', () => {
        const line = [[-5, -5], [5, 5]] as const
        const plane: Plane = [[0, 0], [0, -1]] // Clipping plane: y <= 0
        const result = clipToPlane(line, plane)
        expect(result).toEqual([[0, 0], [5, 5]])
    })

    it('should handle a line that intersects the plane at an obtuse angle', () => {
        const line = [[-5, 5], [5, -5]] as const
        const plane: Plane = [[0, 0], [0, -1]] // Clipping plane: y <= 0
        const result = clipToPlane(line, plane)
        expect(result).toEqual([[-5, 5], [0, 0]])
    })

    it('should handle a degenerate line where both points are the same', () => {
        const line = [[0, 0], [0, 0]] as const
        const plane: Plane = [[0, 0], [0, -1]] // Clipping plane: y <= 0
        const result = clipToPlane(line, plane)
        expect(result).toEqual([[0, 0], [0, 0]])
    })

    it('should handle a line that is completely clipped to a single point', () => {
        const line = [[-5, -5], [0, 0]] as const
        const plane: Plane = [[0, 0], [0, -1]] // Clipping plane: y <= 0
        const result = clipToPlane(line, plane)
        expect(result).toEqual([[0, 0]])
    })

    it('should handle a line that intersects a plane with a complex plane', () => {
        const line = [[0, 0], [10, 10]] as const
        const plane: Plane = [[5, 5], [1, 1]] // Clipping plane: y = x, offset by (5, 5)
        const result = clipToPlane(line, plane)
        expect(result).toEqual([[0, 0], [5, 5]])
    })
})
