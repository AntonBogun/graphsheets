import { IMouseHandler } from "./IMouseHandler.js";
import { State } from "../../State.js";
import { ComponentHelper } from "../components/ComponentHelper.js";
import { IClickable } from "./IClickable.js";
import { Vec2d } from "../../geometry/Vec2d.js";
export class MouseClickHandler implements IMouseHandler{
    clickedComponent: IClickable|null;
    constructor(){
        this.clickedComponent = null;
    }
    processMouseDown(event: MouseEvent, ...args: any[]) {
        const scene = State.currentScene;
        if(scene) {
            for(const component of scene?.getComponents()) {
                if(ComponentHelper.isClickable(component)){
                    let normPos = new Vec2d(2*(event.pageX-window.innerWidth/2)/window.innerWidth, -2*(event.pageY-window.innerHeight/2)/window.innerHeight, "normalized");
                    if(component.containsPosition(normPos)) {
                        component.processPress();
                        this.clickedComponent = component;
                    }
                }
            }  
        }
    }
    processMouseUp(event: MouseEvent, ...args: any[]) {
        if(this.clickedComponent) {
            this.clickedComponent.processRelease();
            this.clickedComponent = null;
        }
    }
    processMouseMove(event: MouseEvent, ...args: any[]) {
    }
    
    clean(): void {
        
    }
}