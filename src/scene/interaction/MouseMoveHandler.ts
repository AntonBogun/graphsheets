import { IMouseHandler } from "./IMouseHandler.js";
import { State } from "../../State.js";
import { Vec2d } from "../../geometry/Vec2d.js";
import { ComponentHelper } from "../components/ComponentHelper.js";
import { IMovable } from "./IMovable.js";
import { ISelectable } from "./ISelectable.js";
export class MouseMoveHandler implements IMouseHandler {
    isMoving: boolean;
    initialComponentPositions: Vec2d<"world">[];
    initialMousePosition: Vec2d<"world">;
    movingComponents: [IMovable&ISelectable, Vec2d<"world">][];
    constructor(){
        this.isMoving = false;
        this.initialComponentPositions = [];
        this.initialMousePosition = new Vec2d(0, 0, "world");
        this.movingComponents = [];
    }

    processMouseUp(event: MouseEvent, ...args: any[]): void {
        this.isMoving = false;
        this.initialComponentPositions = [];
        this.initialMousePosition = new Vec2d(0, 0, "world");
        this.movingComponents = [];
    }

    processMouseMove(event: MouseEvent, ...args: any[]): void {
        console.log(this.movingComponents);
        this.movingComponents.filter(component => State.selectedComponents.includes(component[0]));
        if(this.isMoving && this.movingComponents.length > 0) {
            const currentMousePosition = State.currentCamera?.mouseToWorld(new Vec2d(event.pageX, event.pageY, "mouse"))!;
            const delta = currentMousePosition.sub(this.initialMousePosition);
            for(const component of this.movingComponents) {
                let newPos = component[1].add(delta);
                component[0].setPosition(newPos);
            }
        }
    }

    processMouseDown(event: MouseEvent, ...args: any[]): void {
        if(State.selectedComponents.length > 0 && !this.isMoving){
            this.isMoving = true;
            this.initialMousePosition = State.currentCamera?.mouseToWorld(new Vec2d(event.pageX, event.pageY, "mouse"))!;
            this.movingComponents = State.selectedComponents.filter(component => ComponentHelper.isMovable(component))
                                    .map(component => [component, component.position]);
        }
    }
    
    clean(): void {
        
    }
}