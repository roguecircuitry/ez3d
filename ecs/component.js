export class Component {
  get hasEntity() {
    return this.entity !== null;
  }

  // get requireComponent () {
  //   return this.entity.requireComponent;
  // }
  requireComponent(t) {
    return this.entity.requireComponent(t);
  }
  getComponentByType(t) {
    return this.entity.getComponentByType(t);
  }
  getComponentsByType(t, a) {
    return this.entity.getComponentsByType(t, a);
  }
  addComponents(...cs) {
    this.entity.addComponents(...cs);
    return this;
  }
  removeComponents(...cs) {
    this.entity.removeComponents(...cs);
    return this;
  }
  hasComponent(c) {
    return this.entity.hasComponent(c);
  }
  createComponent(t) {
    return this.entity.createComponent(t);
  }
  /**Can be forced by sublcass by removing ? when entity reference is needed in its constructor, such as calls to requireComponent*/
  constructor(entity) {
    this.entity = entity;
  }
  update(scene) {}
}