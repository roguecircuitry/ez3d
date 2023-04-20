import type { Scene } from "../mod.js";
import type { Component } from "./component.js";
export declare class Entity {
    components: Set<Component>;
    constructor(...types: Array<typeof Component>);
    getComponentByType<Clazz extends typeof Component, T extends Component = InstanceType<Clazz>>(type: Clazz): T | null;
    getComponentsByType<Clazz extends typeof Component, T extends Component = InstanceType<Clazz>>(type: Clazz, a?: Array<T>): Array<T>;
    createComponent<Clazz extends typeof Component, T extends Component = InstanceType<Clazz>>(type: Clazz): T;
    addComponents(...cs: Component[]): this;
    removeComponents(...cs: Component[]): this;
    hasComponent(c: Component): boolean;
    hasComponentsByType<Clazz extends typeof Component, T extends Component = InstanceType<Clazz>>(t: Clazz): boolean;
    countComponentsByType<Clazz extends typeof Component, T extends Component = InstanceType<Clazz>>(t: Clazz): number;
    /**Same as getComponentByType but throws when not found*/
    requireComponent<Clazz extends typeof Component, T extends Component = InstanceType<Clazz>>(t: Clazz): T;
    update(scene: Scene): void;
}
