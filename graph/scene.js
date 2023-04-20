export function createScene(ctx) {
  return {
    ctx,
    mainCamera: undefined,
    children: new Set(),
    delta: 0
  };
}