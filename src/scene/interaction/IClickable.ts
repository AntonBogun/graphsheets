import { Box } from "../../geometry/Box.js";
import { Vec2d } from "../../geometry/Vec2d.js";
export interface IClickable {
    isDown: boolean;
    boundingBox: Box<"world">;
    clickCallback: () => void;
    containsPosition(normPosition: Vec2d<"normalized">): boolean;
    processRelease(): void;
    processPress(): void;
    registerClickCallback(callback: () => void): void;
}