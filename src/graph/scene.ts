
import type { CameraComponent } from "../ecs/components/camera";
import type { Entity } from "../ecs/entity";

export interface Scene {
  ctx: WebGLRenderingContext;
  mainCamera?: CameraComponent;
  children: Set<Entity>;
  delta: number;
}

export function createScene (ctx: WebGLRenderingContext): Scene {
  return {
    ctx,
    mainCamera: undefined,
    children: new Set(),
    delta: 0
  };
}
