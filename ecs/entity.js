export class Entity {
  constructor(...types) {
    this.components = new Set();
    for (let t of types) {
      this.createComponent(t);
    }
  }
  getComponentByType(type) {
    for (let c of this.components) {
      if (c instanceof type) return c;
    }
    return null;
  }
  getComponentsByType(type, a) {
    if (a === undefined) a = [];
    for (let c of this.components) {
      if (c.constructor === type.constructor) a.push(c);
    }
    return a;
  }
  createComponent(type) {
    //@ts-ignore - why is this so hard..
    let result = new type(this);
    this.addComponents(result);
    return result;
  }
  addComponents(...cs) {
    for (let c of cs) {
      if (!this.components.has(c)) {
        //check for singleton if necessary and warn if tried to add more than one
        if (c.constructor.singleton && this.hasComponentsByType(c.constructor)) {
          console.warn(`Tried to add Component type "${c.constructor.name}", but Component class ${c.constructor.name}.singleton = true; and another of exact type is already present! Refusing to add component..`);
        } else {
          c.entity = this;
          this.components.add(c);
          c.mounted();
        }
      }
    }
    return this;
  }
  removeComponents(...cs) {
    for (let c of cs) {
      if (this.components.has(c)) {
        c.entity = null;
        this.components.delete(c);
        c.unmounted();
      }
    }
    return this;
  }
  hasComponent(c) {
    return this.components.has(c);
  }
  hasComponentsByType(t) {
    for (let oc of this.components) {
      if (oc.constructor === t.constructor) {
        return true;
      }
    }
    return false;
  }
  countComponentsByType(t) {
    let result = 0;
    for (let oc of this.components) {
      if (oc.constructor === t.constructor) {
        result++;
      }
    }
    return result;
  }
  /**Same as getComponentByType but throws when not found*/
  requireComponent(t) {
    let result = this.getComponentByType(t);
    if (result === null) throw `requireComponent<${t}>() not satisfied`;
    return result;
  }
  update(scene) {
    for (let c of this.components) {
      c.update(scene);
    }
  }
}