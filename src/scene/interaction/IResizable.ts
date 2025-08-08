import { Vec2d } from "../../geometry/Vec2d.js";
export interface IResizable {
    setSize(size: Vec2d<"world">): void;
}