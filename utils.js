export function debounce(func, delay) {
  let timeoutId;
  return function () {
    const context = this;
    const args = arguments;
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func.apply(context, args), delay);
  };
}
export const CONSTS = {
  aVertex: "aVertex",
  aColor: "aColor",
  vColor: "vColor",
  bVertices: "bVertices",
  bIndices: "bIndices",
  bColors: "bColors"
};
export function assignWithSpread(target, source, transform, ...keysToInclude) {
  for (const key of keysToInclude) {
    if (source[key] !== undefined && source[key] !== null) {
      let value = source[key];
      if (transform) value = transform(value);
      target[key] = value;
    }
  }
  return target;
}

// export function toIntegers(obj: Record<string, any>, deep = false): void {
//   for (const key in obj) {
//     if (typeof obj[key] === 'number') {
//       obj[key] = Math.floor(obj[key]);
//     } else if (deep && typeof obj[key] === 'object' && obj[key] !== null) {
//       toIntegers(obj[key], deep);
//     }
//   }
// }

// export const IntTrans: AssignTransformer<number> = parseInt;

export function resize(canvas, gl) {
  assignWithSpread(canvas, canvas.getBoundingClientRect(), parseInt, "width", "height");
  gl.viewport(0, 0, canvas.width, canvas.height);
  console.log("resize", canvas.width, canvas.height);
}