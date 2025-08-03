import { IMouseHandler } from "./IMouseHandler";
import { State } from "../../State.js";
import { ComponentHelper } from "../components/ComponentHelper.js";
export class MouseSelectionHandler implements IMouseHandler{
    constructor(){}
    processMouseDown(event: MouseEvent, ...args: any[]) {}
    processMouseUp(event: MouseEvent, ...args: any[]) {}
    processMouseMove(event: MouseEvent, ...args: any[]) {
        const scene = State.currentScene;
        if(scene) {
            for(const component of scene?.getComponents()) {
                if(ComponentHelper.isSelectable(component)){
                    if(component.containsPosition(2*(event.pageX-window.innerWidth/2)/window.innerWidth, -2*(event.pageY-window.innerHeight/2)/window.innerHeight)) {
                        component.isSelected = true;
                        State.selectedComponents.push(component);
                    } else {
                        component.isSelected = false;
                        const index = State.selectedComponents.indexOf(component);
                        if(index !== -1) {
                            State.selectedComponents.splice(index, 1);
                        }
                    }
                }
            }  
        }
    }
}