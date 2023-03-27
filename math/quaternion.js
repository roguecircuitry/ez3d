export const quat = {
  q: {
    x: 0,
    y: 0,
    z: 0,
    w: 0
  },
  create(x = 0, y = 0, z = 0, w = 0) {
    return {
      x,
      y,
      z,
      w
    };
  }
};