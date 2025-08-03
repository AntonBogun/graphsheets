import { IMouseHandler } from "./IMouseHandler";
import { State } from "../../State.js";
import { ComponentHelper } from "../components/ComponentHelper.js";
import { IClickable } from "./IClickable.js";
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
                    if(component.containsPosition(2*(event.pageX-window.innerWidth/2)/window.innerWidth, -2*(event.pageY-window.innerHeight/2)/window.innerHeight)) {
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
}