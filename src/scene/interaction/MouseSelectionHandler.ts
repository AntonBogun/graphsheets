import { IMouseHandler } from "./IMouseHandler";
import { State } from "../../State.js";
import { ComponentHelper } from "../components/ComponentHelper.js";
import { Vec2d } from "../../geometry/Vec2d.js";
import { IRenderable } from "../../shaders/IRenderable";
import { SelectionComponent } from "../components/SelectionComponent.js";
import { InteractionManager } from "./InteractionManager.js";
import { ISelectable } from "./ISelectable.js";
export class MouseSelectionHandler implements IMouseHandler{
    selectionComponent: SelectionComponent;
    isSelecting: boolean;
    initial_position: Vec2d<"world">;
    constructor(){
        this.selectionComponent = new SelectionComponent();
        this.initial_position = new Vec2d(0, 0, "world");
        this.isSelecting = false;
    }
    processMouseDown(event: MouseEvent, ...args: any[]) {
        this.initial_position = State.currentCamera?.mouseToWorld(new Vec2d(event.pageX, event.pageY, "mouse"))!;
        this.selectionComponent.setPosition(this.initial_position);
        this.selectionComponent.setSize(new Vec2d(0, 0, "world"));
        if(!InteractionManager.isUIClick(State.currentCamera?.mouseToWorld(new Vec2d(event.pageX, event.pageY, "mouse"))!)) State.clearSelection();
        State.currentScene?.addComponent(this.selectionComponent);
        this.isSelecting = true;
    }

    processMouseUp(event: MouseEvent, ...args: any[]) {
        if(this.isSelecting) {
            State.currentScene?.removeComponent(this.selectionComponent);
            State.currentScene?.display();
            this.isSelecting = false;
        }
    }

    processMouseMove(event: MouseEvent, ...args: any[]) {
        if(!this.isSelecting) return;
        const currentMousePosition = State.currentCamera?.mouseToWorld(new Vec2d(event.pageX, event.pageY, "mouse"))!;
        this.selectionComponent.setSize(
            new Vec2d(
                currentMousePosition.x - this.initial_position.x,
                currentMousePosition.y - this.initial_position.y,
                "world"
            ));

        const scene = State.currentScene!;
        for(const component of scene.getComponents()) {
            if(!ComponentHelper.isUIComponent(component) && ComponentHelper.isSelectable(component)){
                if(this.selectionComponent.containsComponent(component)) {
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

    clean() {
    if(this.isSelecting) {
        State.currentScene?.removeComponent(this.selectionComponent);
        State.currentScene?.display();
        this.isSelecting = false;
    }
    }
}