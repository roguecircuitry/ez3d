export const RAD2DEG = 57.29578;
export const DEG2RAD = 0.01745329;
export function lerp(from, to, by) {
  return (1 - by) * from + by * to;
}
export const inverseLerp = (from, to, value) => {
  if (to - from === 0) return value;
  return (value - from) / (to - from);
};