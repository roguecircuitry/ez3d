
import type { Scene } from "../mod.js";
import type { Component } from "./component.js";

export class Entity {
  components: Set<Component>;

  constructor(...types: Array<typeof Component>) {
    this.components = new Set();
    for (let t of types) {
      this.createComponent(t as any);
    }
  }
  getComponentByType<Clazz extends typeof Component, T extends Component = InstanceType<Clazz>>(type: Clazz): T|null {
    for (let c of this.components) {
      if (c instanceof type) return c as any;
    }
    return null;
  }
  getComponentsByType<Clazz extends typeof Component, T extends Component = InstanceType<Clazz>>(type: Clazz, a?: Array<T>): Array<T> {
    if (a === undefined) a = [];
    for (let c of this.components) {
      if (c.constructor === type.constructor) a.push(c as T);
    }
    return a;
  }
  createComponent<Clazz extends typeof Component, T extends Component = InstanceType<Clazz>>(type: Clazz): T {
    //@ts-ignore - why is this so hard..
    let result: T = new type(this);
    this.addComponents(result);
    return result;
  }
  addComponents(...cs: Component[]): this {
    for (let c of cs) {
      if (!this.components.has(c)) {
        //check for singleton if necessary and warn if tried to add more than one
        if ((c.constructor as any as typeof c).singleton && this.hasComponentsByType(c.constructor as any)) {
          console.warn(`Tried to add Component type "${c.constructor.name}", but Component class ${c.constructor.name}.singleton = true; and another of exact type is already present! Refusing to add component..`);
        } else {
          c.entity = this;
          this.components.add(c);
        }
      }
    }
    return this;
  }
  removeComponents(...cs: Component[]): this {
    for (let c of cs) {
      if (this.components.has(c)) {
        c.entity = null;
        this.components.delete(c);
      }
    }
    return this;
  }
  hasComponent(c: Component) {
    return this.components.has(c);
  }
  hasComponentsByType<Clazz extends typeof Component, T extends Component = InstanceType<Clazz>>(t: Clazz): boolean {
    for (let oc of this.components) {
      if (oc.constructor === t.constructor) {
        return true;
      }
    }
    return false;
  }
  countComponentsByType<Clazz extends typeof Component, T extends Component = InstanceType<Clazz>>(t: Clazz): number {
    let result = 0;
    for (let oc of this.components) {
      if (oc.constructor === t.constructor) {
        result++;
      }
    }
    return result;
  }
  /**Same as getComponentByType but throws when not found*/
  requireComponent<Clazz extends typeof Component, T extends Component = InstanceType<Clazz>>(t: Clazz): T {
    let result = this.getComponentByType(t);
    if (result === null) throw `requireComponent<${t}>() not satisfied`;
    return result as any;
  }
  update (scene: Scene) {
    for (let c of this.components) {
      c.update(scene);
    }
  }
}
