import { Camera } from '../src/components/Camera'
import { Entity } from '../src/components/Component'
import { Inventory } from '../src/components/Inventory'
import { Render, ShapeType } from '../src/components/Render'
import { Weapon } from '../src/components/Weapon'
import { EntityBag } from '../src/EntityBag'

describe('EntityBag', () => {
    it('should add entities', () => {
        const bag = new EntityBag()
        const entity = [new Inventory({ items: [], maxSize: 10})]
        bag.add(entity)
        expect(bag.get(0)).toBe(entity)
    })

    it('should add components', () => {
        const bag = new EntityBag()
        
        const entity = [new Inventory({ items: [], maxSize: 10})]
        bag.add(entity)
        
        const component = new Camera({ origin: [0, 0] })
        bag.addComponent(0, component)
        
        expect(bag.get(0)).toContain(component)
    })

    it('should remove components', () => {
        const bag = new EntityBag()
        
        const entity = [new Inventory({ items: [], maxSize: 10})]
        bag.add(entity)
        
        const component = new Camera({ origin: [0, 0] })
        bag.addComponent(0, component)
    
        bag.removeComponent(0, Camera)
        
        expect(bag.get(0)).not.toContain(component)
    })

    it('should remove entities', () => {
        const bag = new EntityBag()
        
        const entity = [new Inventory({ items: [], maxSize: 10})]
        bag.add(entity)
        
        bag.remove(0)
        
        expect(() => bag.get(0)).toThrow()
    })

    it('should get components', () => {
        const bag = new EntityBag()
        
        const entity = [new Inventory({ items: [], maxSize: 10})]
        bag.add(entity)
        
        const component = new Camera({ origin: [0, 0] })
        bag.addComponent(0, component)
        
        expect(bag.getComponent(0, Camera)).toBe(component)
    })

    it('should get components or none', () => {
        const bag = new EntityBag()
        
        const entity = [new Inventory({ items: [], maxSize: 10})]
        bag.add(entity)
        
        expect(bag.getComponentOrNone(0, Camera)).toBeUndefined()
    })

    it('should check if entity has component', () => {
        const bag = new EntityBag()
        
        const entity = [new Inventory({ items: [], maxSize: 10})]
        bag.add(entity)
        
        bag.addComponent(0, new Camera({ origin: [0, 0] }))
        
        expect(bag.hasComponent(0, Camera)).toBe(true)
    })
})

describe('EntityBag withComponents', () => {
    let bag: EntityBag
    let entity1: Entity, entity2: Entity, entity3: Entity

    beforeEach(() => {
        entity1 = [
            new Camera({origin: [0, 0] }),
            new Inventory({ items: [], maxSize: 10})
        ]
        entity2 = [
            new Camera({ origin: [10, 10]  }),
            new Inventory({ items: [], maxSize: 10}),
        ]
        entity3 = [
            new Camera({ origin: [20, 20] }),
            new Render({ shape: { type: ShapeType.DOT, color: 'white'} }),
            new Inventory({ items: [], maxSize: 15}),
        ]
        bag = new EntityBag()
        bag.add(entity1)
        bag.add(entity2)
        bag.add(entity3)
    })

    it('returns the correct entity ids for one component type', () => {
        expect(bag.withComponents(Camera)).toEqual([0, 1, 2])
    })

    it('returns the correct entity ids for two component types', () => {
        expect(bag.withComponents(Camera, Inventory)).toEqual([0, 1, 2])
    })

    it('returns the correct entity ids for three component types', () => {
        expect(bag.withComponents(Camera, Inventory, Render)).toEqual([2])
    })

    it('returns empty for non-existent component types', () => {
        expect(bag.withComponents(Weapon, Render)).toEqual([])
    })

    it('returns the correct entity ids after removing a component', () => {
        bag.removeComponent(0, Camera)
        expect(bag.withComponents(Camera)).toEqual([1, 2])
    })
})
