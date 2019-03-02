import { Control } from './components/Control';
import { Core } from './components/Core';
import { Movement } from './components/Movement';
import { Render } from './components/Render';
import { Weapon } from './components/Weapon';
import { Vector } from './math/Vector';
import { ShapeType } from './ui/Shape';

export const getPlayer = (position: Vector) => [
    new Core({
        position,
        orientation: 0,
    }),
    new Render({
        type: ShapeType.TRIANGLE,
    }),
    new Control({
        isAccelerating: false,
        isDecelerating: false,
        isTurningLeft: false,
        isTurningRight: false,
        isShooting: false,
    }),
    new Movement({
        acceleration: 0,
        speed: 0,
        maxSpeed: 5,
        turningSpeed: 0.1,
    }),
    new Weapon({
        isFiring: false,
        attackSpeed: 1,
        projectileSpeed: 10,
    }),
];

export const getProjectile = (position: Vector, orientation: number) => [
    new Core({
        position,
        orientation,
    }),
    new Render({
        type: ShapeType.DOT,
    }),
    new Movement({
        acceleration: 0,
        speed: 5,
        maxSpeed: 5,
        turningSpeed: 0,
    }),
];
