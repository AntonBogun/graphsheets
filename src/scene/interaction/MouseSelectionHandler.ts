import { IMouseHandler } from "./IMouseHandler";
import { State } from "../../State.js";
import { ComponentHelper } from "../components/ComponentHelper.js";
import { Vec2d } from "../../geometry/Vec2d.js";
export class MouseSelectionHandler implements IMouseHandler{
    constructor(){}
    processMouseDown(event: MouseEvent, ...args: any[]) {}
    processMouseUp(event: MouseEvent, ...args: any[]) {}
    processMouseMove(event: MouseEvent, ...args: any[]) {
        
    }
}