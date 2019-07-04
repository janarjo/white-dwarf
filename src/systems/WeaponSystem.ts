import { Command } from '../command/Command';
import { Commands } from '../command/Commands';
import { Weapon } from '../components/Weapon';
import { Entities } from '../entities/Entities';
import { Events } from '../events/Events';
import { FireEvent } from '../events/FireEvent';
import { System } from './System';

export class WeaponSystem extends System {
    constructor(
        private readonly entities: Entities,
        private readonly events: Events,
        private readonly commands: Commands) {
        super();
        this.registerListeners();
    }

    update() {
        return;
    }

    registerListeners() {
        this.commands.on(Command.FIRE, () => {
            this.entities.entities.forEach(entity => {
                const weapon = entity.getComponent(Weapon);
                if (!weapon) return;

                this.events.emit(new FireEvent(entity.id));
            });
        });
    }
}
