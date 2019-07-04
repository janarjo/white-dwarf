import { Command } from './Command';

export class Commands {
    private commands: Command[] = [];
    private listeners: Map<Command, ReadonlyArray<(command: Command) => void>> = new Map();

    emit(command: Command) {
        this.commands.push(command);
    }

    on(command: Command, callback: (command: Command) => void) {
        if (this.listeners.has(command)) {
            const newCallbackArray = this.listeners.get(command)!
                .concat([callback]);
            this.listeners.set(command, newCallbackArray);
        } else {
            this.listeners.set(command, [callback]);
        }
    }

    off(command: Command, callback: (command: Command) => void) {
        if (this.listeners.has(command)) {
            const newCallbackArray = this.listeners.get(command)!
                .filter((cb) => cb !== callback);
            this.listeners.set(command, newCallbackArray);
        }
    }

    proccess() {
        this.commands.forEach((command) => {
            const listeners = this.listeners.has(command) ?
                this.listeners.get(command) as Array<(command: Command) => void> : [];
            listeners.forEach((callback: (command: Command) => void) => callback(command));
        });
        this.commands = [];
    }
}
