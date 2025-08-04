import { Vec2d } from "../../geometry/Vec2d.js";
export interface IMovable {
    position: Vec2d<"world">;
    setPosition(position: Vec2d<"world">): void;
}