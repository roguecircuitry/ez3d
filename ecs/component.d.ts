import type { Scene } from "../mod.js";
import { Entity } from "./entity.js";
export declare class Component {
    singleton?: boolean;
    entity: Entity | null;
    get hasEntity(): boolean;
    mounted(): void;
    unmounted(): void;
    requireComponent<Clazz extends typeof Component, T extends Component = InstanceType<Clazz>>(t: Clazz): T;
    getComponentByType<Clazz extends typeof Component, T extends Component = InstanceType<Clazz>>(t: Clazz): T;
    getComponentsByType<Clazz extends typeof Component, T extends Component = InstanceType<Clazz>>(t: Clazz, a?: T[]): T[];
    addComponents(...cs: Component[]): this;
    removeComponents(...cs: Component[]): this;
    hasComponent(c: Component): boolean;
    createComponent<Clazz extends typeof Component, T extends Component = InstanceType<Clazz>>(t: Clazz): T;
    /**Can be forced by sublcass by removing ? when entity reference is needed in its constructor, such as calls to requireComponent*/
    constructor();
    update(scene: Scene): void;
}
