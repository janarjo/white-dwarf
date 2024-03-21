import { EntityManager } from '../../src/EntityManager'
import { Camera } from '../../src/components/Camera'
import { CameraSystem } from '../../src/systems/CameraSystem'
import { transform } from '../TestUtil'

describe('CameraSystem', () => {
    const viewport = [800, 600] as const
    const mapSize = [1600, 1200] as const

    it('should update the origin of the camera when in the middle of the map', () => {
        const entities = new EntityManager()
        const addedId = entities.add([
            transform([800, 600]),
            new Camera({ origin: [0, 0], zoom: 1 })
        ])
        const system = new CameraSystem(entities, viewport, mapSize)

        system.update()

        const updatedState = entities.getComponent(addedId, Camera).state
        expect(updatedState.origin).toEqual([400, 300])
    })

    it('should update the origin of the camera when at the top left of the map', () => {
        const entities = new EntityManager()
        const addedId = entities.add([
            transform([0, 0]),
            new Camera({ origin: [0, 0], zoom: 1 })
        ])
        const system = new CameraSystem(entities, viewport, mapSize)

        system.update()

        const updatedState = entities.getComponent(addedId, Camera).state
        expect(updatedState.origin).toEqual([0, 0])
    })

    it('should update the origin of the camera when at the bottom right of the map', () => {
        const entities = new EntityManager()
        const addedId = entities.add([
            transform([1600, 1200]),
            new Camera({ origin: [0, 0], zoom: 1 })
        ])
        const system = new CameraSystem(entities, viewport, mapSize)

        system.update()

        const updatedState = entities.getComponent(addedId, Camera).state
        expect(updatedState.origin).toEqual([800, 600])
    })

    it('should update the origin of the camera when zoomed out (FOV increases)', () => {
        const entities = new EntityManager()
        const addedId = entities.add([
            transform([800, 600]),
            new Camera({ origin: [0, 0], zoom: 0.80 })
        ])
        const system = new CameraSystem(entities, viewport, mapSize)

        system.update()

        const updatedState = entities.getComponent(addedId, Camera).state
        expect(updatedState.origin).toEqual([300, 225])
    })

    it('should update the origin of the camera when zoomed in (FOV decreases)', () => {
        const entities = new EntityManager()
        const addedId = entities.add([
            transform([800, 600]),
            new Camera({ origin: [0, 0], zoom: 2 })
        ])
        const system = new CameraSystem(entities, viewport, mapSize)

        system.update()

        const updatedState = entities.getComponent(addedId, Camera).state
        expect(updatedState.origin).toEqual([600, 450])
    })
})
