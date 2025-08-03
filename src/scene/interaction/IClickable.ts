import { Box } from "../../geometry/Box.js";
export interface IClickable {
    isDown: boolean;
    boundingBox: Box;
    containsPosition(x: number, y: number): boolean;
    processRelease(): void;
    processPress(): void;
}