import { IMouseHandler } from "./IMouseHandler";
import { State } from "../../State.js";
import { ComponentHelper } from "../components/ComponentHelper.js";
import { Vec2d } from "../../geometry/Vec2d.js";
import { IHoverable } from "./IHoverable.js";
import { ISelectable } from "./ISelectable.js";
export class MouseHoverHandler implements IMouseHandler{
    hoveredComponents: (IHoverable&ISelectable)[];
    constructor(){
        this.hoveredComponents = [];
    }
    processMouseDown(event: MouseEvent, ...args: any[]) {}
    processMouseUp(event: MouseEvent, ...args: any[]) {}
    processMouseMove(event: MouseEvent, ...args: any[]) {
        const scene = State.currentScene;
        if(scene) {
            for(const component of scene?.getComponents()) {
                if(ComponentHelper.isSelectable(component) && ComponentHelper.isHoverable(component)){
                    const normPos: Vec2d<"normalized"> = State.currentCamera?.mouseToNormalized(new Vec2d(event.pageX, event.pageY, "mouse"))!;
                    if(!normPos) {
                        throw new Error("Cannot access current camera.");
                    }
                    if(component.containsPosition(normPos)) {
                        if(!component.isSelected) {
                            component.isSelected = true;
                            component.isHovered = true;
                            State.selectedComponents.push(component);
                            this.hoveredComponents.push(component);
                        }
                    } else if(this.hoveredComponents.includes(component) && component.isHovered){
                        component.isSelected = false;
                        component.isHovered = false;
                        const index = State.selectedComponents.indexOf(component);
                        if(index !== -1) {
                            State.selectedComponents.splice(index, 1);
                        }
                        const hoveredIndex = this.hoveredComponents.indexOf(component);
                        if(hoveredIndex !== -1) {
                            this.hoveredComponents.splice(hoveredIndex, 1);
                        }
                    }
                }
            }  
        }
    }
    clean(): void {
        for(const component of this.hoveredComponents) {
            if(component.isHovered && component.isSelected) {
                component.isSelected = false;
                component.isHovered = false;
            }
        }
        this.hoveredComponents = [];
    }
}