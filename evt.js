export class EventDispatcher {
  constructor() {
    this.listeners = new Map();
  }
  getListenerType(type, create = false) {
    let result = this.listeners.get(type);
    if (!result) {
      if (create) {
        result = new Set();
        this.listeners.set(type, result);
      } else {
        return undefined;
      }
    }
    return result;
  }
  listen(type, cb) {
    this.getListenerType(type, true).add(cb);
    return this;
  }
  deafen(type, cb) {
    let lt = this.getListenerType(type);
    if (lt) lt.delete(cb);
    return this;
  }
  fire(type, evt, cancelable = true) {
    let lt = this.getListenerType(type, false);
    if (!lt) return this;
    for (let cb of lt) {
      //@ts-ignore
      let result = cb(evt);
      if (result && cancelable) break;
    }
    return this;
  }
}