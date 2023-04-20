
import type { Scene } from "../mod.js";
import { Entity } from "./entity.js";

export class Component {
  singleton?: boolean;

  entity: Entity|null;

  get hasEntity (): boolean {
    return this.entity !== null;
  }

  // get requireComponent () {
  //   return this.entity.requireComponent;
  // }
  requireComponent <Clazz extends typeof Component, T extends Component = InstanceType<Clazz>>(t: Clazz): T {
    return this.entity.requireComponent(t);
  }

  getComponentByType<Clazz extends typeof Component, T extends Component = InstanceType<Clazz>>(t: Clazz): T {
    return this.entity.getComponentByType(t);
  }
  getComponentsByType<Clazz extends typeof Component, T extends Component = InstanceType<Clazz>>(t: Clazz, a?:T[]): T[] {
    return this.entity.getComponentsByType(t, a);
  }

  addComponents(...cs: Component[]) {
    this.entity.addComponents(...cs);
    return this;
  }
  removeComponents(...cs: Component[]) {
    this.entity.removeComponents(...cs);
    return this;
  }
  hasComponent(c: Component): boolean {
    return this.entity.hasComponent(c);
  }
  createComponent<Clazz extends typeof Component, T extends Component = InstanceType<Clazz>>(t: Clazz): T {
    return this.entity.createComponent(t);
  }
  /**Can be forced by sublcass by removing ? when entity reference is needed in its constructor, such as calls to requireComponent*/
  constructor (entity?: Entity|null) {
    this.entity = entity;
  }

  update (scene: Scene) {

  }
}