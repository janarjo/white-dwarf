import { Camera } from '../src/components/Camera'
import { Entity } from '../src/components/Component'
import { Inventory } from '../src/components/Inventory'
import { Render } from '../src/components/Render'
import { Weapon } from '../src/components/Weapon'
import { EntityBag } from '../src/EntityBag'
import { white } from '../src/ui/Colors'

describe('EntityBag', () => {
    it('should add entities', () => {
        const bag = new EntityBag()
        const entity = [new Inventory({ items: [], maxSize: 10 })]
        bag.add(entity)
        expect(bag.get(1)).toBe(entity)
    })

    it('should add components', () => {
        const bag = new EntityBag()

        const entity = [new Inventory({ items: [], maxSize: 10 })]
        bag.add(entity)

        const component = new Camera({ origin: [0, 0], zoom: 1 })
        bag.addComponent(1, component)

        expect(bag.get(1)).toContain(component)
    })

    it('should remove components', () => {
        const bag = new EntityBag()

        const entity = [new Inventory({ items: [], maxSize: 10 })]
        bag.add(entity)

        const component = new Camera({ origin: [0, 0], zoom: 1 })
        bag.addComponent(1, component)

        bag.removeComponent(1, component)

        expect(bag.get(1)).not.toContain(component)
    })

    it('should remove entities', () => {
        const bag = new EntityBag()

        const entity = [new Inventory({ items: [], maxSize: 10 })]
        bag.add(entity)

        bag.remove(1)

        expect(() => bag.get(1)).toThrow()
    })

    it('should get components', () => {
        const bag = new EntityBag()

        const entity = [new Inventory({ items: [], maxSize: 10 })]
        bag.add(entity)

        const component = new Camera({ origin: [0, 0], zoom: 1 })
        bag.addComponent(1, component)

        expect(bag.getComponent(1, Camera)).toBe(component)
    })

    it('should get components or none', () => {
        const bag = new EntityBag()

        const entity = [new Inventory({ items: [], maxSize: 10 })]
        bag.add(entity)

        expect(bag.getComponentOrNone(1, Camera)).toBeUndefined()
    })

    it('should check if entity has component', () => {
        const bag = new EntityBag()

        const entity = [new Inventory({ items: [], maxSize: 10 })]
        bag.add(entity)

        bag.addComponent(1, new Camera({ origin: [0, 0], zoom: 1 }))

        expect(bag.hasComponent(1, Camera)).toBe(true)
    })
})

describe('EntityBag withComponents', () => {
    let bag: EntityBag
    let entity1: Entity, entity2: Entity, entity3: Entity

    beforeEach(() => {
        entity1 = [
            new Camera({ origin: [0, 0], zoom: 1 }),
            new Inventory({ items: [], maxSize: 10 })
        ]
        entity2 = [
            new Camera({ origin: [10, 10], zoom: 1 }),
            new Inventory({ items: [], maxSize: 10 }),
        ]
        entity3 = [
            new Camera({ origin: [20, 20], zoom: 1 }),
            new Render({ color: white }),
            new Inventory({ items: [], maxSize: 15 }),
        ]
        bag = new EntityBag()
        bag.add(entity1)
        bag.add(entity2)
        bag.add(entity3)
    })

    it('returns the correct entity ids for one component type', () => {
        expect(bag.withComponents(Camera)).toEqual([1, 2, 3])
    })

    it('returns the correct entity ids for two component types', () => {
        expect(bag.withComponents(Camera, Inventory)).toEqual([1, 2, 3])
    })

    it('returns the correct entity ids for three component types', () => {
        expect(bag.withComponents(Camera, Inventory, Render)).toEqual([3])
    })

    it('returns empty for non-existent component types', () => {
        expect(bag.withComponents(Weapon, Render)).toEqual([])
    })

    it('returns the correct entity ids after removing a component', () => {
        bag.removeComponent(1, entity1[0] as Camera)
        expect(bag.withComponents(Camera)).toEqual([2, 3])
    })
})
