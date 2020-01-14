import { Attachment, RemoveBehavior } from '../components/Attachment'
import { EntityManager } from '../EntityManager'
import { System } from './System'

export class AttachmentSystem extends System {
    constructor(
        private readonly entities: EntityManager) {
        super()
    }
}
