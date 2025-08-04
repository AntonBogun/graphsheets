import { Box } from "../../geometry/Box.js";
import { Vec2d } from "../../geometry/Vec2d.js";
export interface IHoverable {
    boundingBox: Box<"world">;
    isHovered: boolean;
    containsPosition(normPosition: Vec2d<"normalized">): boolean;
}