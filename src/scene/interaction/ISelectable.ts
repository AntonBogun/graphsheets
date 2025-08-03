import { Box } from "../../geometry/Box.js";
export interface ISelectable {
    boundingBox: Box;
    isSelected: boolean;
    containsPosition(x: number, y: number): boolean;
}