import {
    equals,
    isWithinTriangle,
    norm,
    subtract,
    cross,
    dot,
    Triangle,
    Vector,
    Polygon,
    Range,
    Line,
    Plane,
    Position,
    isWithinPlane,
} from './Math'

export const earclip = (polygon: Polygon) => {
    const points = [...polygon]
    if (points.length< 3) throw new Error('Polygon must have at least 3 points!')

    const triangles = new Array<Triangle>()
    let i = 0
    while (points.length > 3) {
        const triangle = [points[i], points[(i + 1) % points.length], points[(i + 2) % points.length]] as const
        if (isEar(triangle, points)) {
            triangles.push(triangle)
            points.splice((i + 1) % points.length, 1)
            i = 0
        } else i++
    }

    triangles.push([points[0], points[1], points[2]] as const)
    return triangles
}

export const isEar = (triangle: Triangle, polygon: Polygon) => {
    const [p1, p2, p3] = triangle

    // Check if the triangle is convex
    if (cross(subtract(p2, p1), subtract(p3, p2)) <= 0) return false

    // Check if any point of the polygon lies inside the triangle
    for (const point of polygon) {
        if (equals(point, p1) || equals(point, p2) || equals(point, p3)) continue
        if (isWithinTriangle(point, triangle)) return false
    }

    return true
}

export const getAxes = (polygon: Polygon) => {
    const axes = new Array<Vector>()
    const numPoints = polygon.length

    for (let i = 0; i < numPoints; i++) {
        const p1 = polygon[i]
        const p2 = polygon[(i + 1) % numPoints]
        const edge = subtract(p2, p1)
        const normal = norm([-edge[1], edge[0]])

        // Check if the normal is parallel to any of the previously added ones
        if (axes.every(axis => Math.abs(dot(normal, axis)) < 1 - 1e-6)) {
            axes.push(normal)
        }
    }

    return axes
}

export const project = (polygon: Polygon, axis: Vector) => {
    const numPoints = polygon.length
    let min = dot(polygon[0], axis)
    let max = min

    for (let i = 1; i < numPoints; i++) {
        const p = dot(polygon[i], axis)
        if (p < min) min = p
        else if (p > max) max = p
    }

    return [min, max] as Range
}

/**
 * Computes the contact points between two triangles along a given axis.
 * CCW (counter-clockwise) order of triangle vertices is assumed. ORDER MATTERS at every step.
 *
 * @param ref - The reference triangle, which serves as the basis for the clipping planes.
 * @param inc - The incident triangle, which is clipped against the reference triangle's planes.
 * @param axis - The axis along which the contact points are determined.
 * @returns An array of contact points resulting from clipping the incident triangle's edge
 *          against the reference triangle's clipping planes.
 */
export const getContactPoints = (ref: Triangle, inc: Triangle): Position[] => {
    // Build clipping planes from the reference triangle
    const planes = buildClippingPlanes(ref)

    // Clip the incident triangle against the clipping planes
    let clipped = [inc[0], inc[1], inc[2]]
    for (const plane of planes) {
        clipped = clip(clipped, plane)
        if (clipped.length === 0) return []
    }

    return clipped
}

export const buildClippingPlanes = (ref: Triangle): Plane[] => {
    const planes: Plane[] = []

    // Add clipping planes for each edge of the reference triangle
    for (let i = 0; i < 3; i++) {
        const v0 = ref[i]
        const v1 = ref[(i + 1) % 3]

        // Calculate edge vector
        const edge = subtract(v1, v0)

        // Calculate outward normal (perpendicular to the edge)
        // For CCW triangles, if edge is [x,y], outward normal is [y,-x]
        const normal = norm([edge[1], -edge[0]])

        // Create plane using edge vertex and outward normal
        planes.push([v0, normal])
    }

    return planes
}

/**
 * Clips a polygon against a plane, returning the portion of the polygon
 * that lies on or outside the plane.
 *
 * @param polygon - The polygon to be clipped, represented as an array of `Position` points.
 *                  Each point is assumed to be a 2D or 3D coordinate.
 * @param plane - The plane against which the polygon is clipped. The plane is
 *                typically represented by a normal vector and a distance from the origin.
 * @returns An array of points representing the clipped polygon.
 *          The clipping may result in 0, 1, or more points depending on the intersection.
 */
export const clip = (polygon: Polygon, plane: Plane): Position[] => {
    if (polygon.length === 0) return []
    if (polygon.length === 1) return !isWithinPlane(polygon[0], plane) ? [polygon[0]] : []
    if (polygon.length === 2) return clipToPlane(polygon as Line, plane)

    const addedPoints = new Set<string>()
    const result: Position[] = []

    for (let i = 0; i < polygon.length; i++) {
        const curr = polygon[i]
        const next = polygon[(i + 1) % polygon.length]

        const clippedEdge = clipToPlane([curr, next], plane)

        // Add all points from clipped edge that aren't duplicates of the previous point
        for (const point of clippedEdge) {
            const pointKey = point.join(',')
            if (!addedPoints.has(pointKey)) {
                result.push(point)
                addedPoints.add(pointKey)
            }
        }
    }

    return result
}

/**
 * Clips a line segment to a plane and returns the points of intersection or the points
 * that lie outside the plane. The function assumes that the plane is outward facing.
 *
 * @param line - A line segment represented as a tuple of two positions `[p1, p2]`,
 *               where each position is a 2D point `[x, y]`.
 * @param plane - A plane represented as a tuple `[planePoint, planeNormal]`, where
 *                `planePoint` is a point on the plane and `planeNormal` is the
 *                normal vector of the plane. Outward facing planes are assumed.
 * @returns An array of positions representing the clipped points of the line segment.
 *          The array may contain 0, 1, or 2 points depending on the intersection.
 */
export const clipToPlane = (line: Line, plane: Plane): Position[] => {
    const [p1, p2] = line
    const [planePoint, planeNormal] = plane
    const lineDir = subtract(p2, p1)

    const d1 = dot(subtract(p1, planePoint), planeNormal)
    const d2 = dot(subtract(p2, planePoint), planeNormal)

    const points = [] as Position[]

    // outward facing planes
    if (d1 <= 0) points.push(p1)
    if (d1 * d2 < 0) {
        const t = d1 / (d1 - d2)
        const intersection = [p1[0] + t * lineDir[0], p1[1] + t * lineDir[1]] as Position
        points.push(intersection)
    }
    if (d2 <= 0) points.push(p2)

    return points
}
