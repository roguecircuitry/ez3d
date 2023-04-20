import type { CameraComponent } from "../ecs/components/camera";
import type { Entity } from "../ecs/entity";
export interface Scene {
    ctx: WebGLRenderingContext;
    mainCamera?: CameraComponent;
    children: Set<Entity>;
    delta: number;
}
export declare function createScene(ctx: WebGLRenderingContext): Scene;
