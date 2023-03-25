import { inverseLerp, RGBALerp } from "./vector.js";
function angleDifference(angle1, angle2) {
  const diff = angle1 - angle2;
  return diff >= 0 ? diff : diff + 2 * Math.PI;
}
function getAdjacentColors(colors, angle) {
  const n = colors.stops.length;
  let leftIndex;
  let rightIndex;
  let minLeftDiff = Infinity,
    minRightDiff = Infinity;
  for (let i = 0; i < n; i++) {
    const colorAngle = colors.stops[i].angle;
    const diff = angleDifference(colorAngle, angle);
    if (colorAngle < angle && diff < minLeftDiff) {
      leftIndex = i;
      minLeftDiff = diff;
    } else if (colorAngle > angle && diff < minRightDiff) {
      rightIndex = i;
      minRightDiff = diff;
    }
  }
  if (leftIndex === undefined && rightIndex === undefined) {
    // Handle edge case where angle is beyond range of colors
    if (angle < colors.stops[0].angle || angle > colors.stops[n - 1].angle) {
      const wrappedAngle = angle < colors.stops[0].angle ? angle + 2 * Math.PI : angle - 2 * Math.PI;
      return getAdjacentColors(colors, wrappedAngle);
    }
    // Handle case where there is only one color
    return {
      nearestIndex: 0
    };
  } else if (leftIndex === undefined) {
    return {
      leftIndex: rightIndex
    };
  } else if (rightIndex === undefined) {
    return {
      rightIndex: leftIndex
    };
  } else {
    return {
      leftIndex,
      rightIndex
    };
  }
}
export function colorWheelSort(w) {
  w.stops.sort((a, b) => a.angle - b.angle);
}
export function colorWheelInterpolate(w, angle, out) {
  let result = getAdjacentColors(w, angle);
  let left = w.stops[result.leftIndex];
  let right = w.stops[result.rightIndex];
  if (!left) left = w.stops[result.nearestIndex];
  if (!left) left = w.stops[result.rightIndex];
  if (!right) right = w.stops[result.nearestIndex];
  if (!right) right = w.stops[result.leftIndex];
  let by = inverseLerp(left.angle, right.angle, angle);
  RGBALerp(left.color, right.color, by, out);
}