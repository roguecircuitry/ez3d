import type { Scene } from "../../graph/scene";
import { Transform } from "../../math/transform.js";
import { Component } from "../component.js";
export declare class TransformComponent extends Component {
    static singleton: true;
    /**Parents kept track of via Transform Compoents, aka entities don't have to be transformable*/
    parentTransform: TransformComponent;
    /**global transform matrix used for shader render
     * global pos, rot, scale used for logic (read only)
     * local pos, rot, scale used for logic (read/write)
      local transform matrix used for calculating global matrix
    */
    global: Transform;
    local: Transform;
    children: Set<TransformComponent>;
    constructor();
    update(scene: Scene): void;
    add(child: TransformComponent): this;
    remove(child: TransformComponent): this;
}
