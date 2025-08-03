import { Vec2d } from "../../geometry/Vec2d.js";
import { State } from "../../State.js";
import { Vec3d } from "../../geometry/Vec3d.js";
import { Vec4d } from "../../geometry/Vec4d.js";
import { ComponentHelper } from "../components/ComponentHelper.js";
import { Camera } from "../Camera.js";
import { IMouseHandler } from "./IMouseHandler.js";
export class InteractionManager {
    private lastPosition: Vec2d;
    private initialPosition: Vec2d;
    private isDragging;
    private position: Vec3d;
    private mouseHandlers: IMouseHandler[];
    private static interactionManager: InteractionManager;
    private constructor() {
        this.lastPosition = new Vec2d(0, 0);
        this.initialPosition = new Vec2d(0, 0);
        this.position = new Vec3d(0, 0, 1.0);
        this.mouseHandlers = [];
        this.isDragging = false;
    }

    public static getInstance(): InteractionManager {
        if (!InteractionManager.interactionManager) {
            InteractionManager.interactionManager = new InteractionManager();
        }
        return InteractionManager.interactionManager;
    }

    public addMouseHandler(mouseHandler: IMouseHandler) {
        this.mouseHandlers.push(mouseHandler);
    }

    public removeMouseHandler(mouseHandler: IMouseHandler) {
        this.mouseHandlers = this.mouseHandlers.filter(handler => handler !== mouseHandler);
    }

    public setCurrentCamera(cam: Camera) {
        State.currentCamera = cam;
        this.position = cam.position;
        this.bindEventListeners();
    }

    public bindEventListeners(): void {
    //MARK: Event Listeners

        document.onmousedown = (event) => {
            // this.isDragging = true;
            // const e_pos = new Vec2d(event.pageX, -event.pageY);
            // this.initialPosition = e_pos;
            // this.lastPosition = new Vec2d(this.position.x, this.position.y);
            for(const mouseHandler of this.mouseHandlers) {
                mouseHandler.processMouseDown(event, this.position);
            }
        }

        // TODO: Use pointer events instead
        // TODO: 2x mouse position?
        document.onmousemove = (event) => {
            for(const mouseHandler of this.mouseHandlers) {
                mouseHandler.processMouseMove(event, this.position);
            }
            // if(!this.isDragging) return;
            // const e_pos = new Vec2d(event.pageX, -event.pageY);
            // let pos2d: Vec2d = Vec2d.add(this.lastPosition, 
            //     Vec2d.smul(
            //         Vec2d.sub(e_pos, this.initialPosition),
            //         this.position.z*2 / window.innerHeight
            //     )
            // );
            // this.position = new Vec3d(pos2d.x, pos2d.y, this.position.z);
        }

        // document.onmouseup = (event: MouseEvent) => {
        //     const e_pos = new Vec2d(event.pageX, -event.pageY);
        //     let pos2d: Vec2d = Vec2d.add(this.lastPosition,
        //         Vec2d.smul(
        //             Vec2d.sub(e_pos, this.initialPosition),
        //             this.position.z*2 / window.innerHeight
        //         )
        //     );
        //     this.position = new Vec3d(pos2d.x, pos2d.y, this.position.z);
        //     this.isDragging = false;
        // }

        document.onkeydown = (event) => {
            if(event.key == "+") {
                this.position.z /= 2;
            } else if(event.key == "-") {
                this.position.z *= 2;
            }
        }

        document.addEventListener("wheel", (event) => {
                event.preventDefault();
                let mouse_position = new Vec2d(2*(event.clientX - (window.innerWidth / 2)) / window.innerWidth, 
                                                2*((window.innerHeight-event.clientY) - (window.innerHeight / 2)) / window.innerHeight);
                let world_mouse_position = Vec4d.mmul(
                    State.currentCamera?.getInverseTransformationMatrix()!,
                    new Vec4d(mouse_position.x, mouse_position.y, 0, 1)
                );
                world_mouse_position = Vec4d.smul(world_mouse_position,(1.0/world_mouse_position.w));
                let world_mouse_position3 = new Vec3d(world_mouse_position.x, world_mouse_position.y, 0);
                // console.log(world_mouse_position3);
                let delta = Vec2d.dot(new Vec2d(event.deltaX, event.deltaY), new Vec2d(1,1))/(event.ctrlKey?50:100);
                let position_to_mouse = Vec3d.normalize(Vec3d.sub(world_mouse_position3, new Vec3d(this.position.x, this.position.y, this.position.z)));
                let xzslope = position_to_mouse.x / position_to_mouse.z;
                let yzslope = position_to_mouse.y / position_to_mouse.z;
                if(this.position.z * 2**delta > -1){
                    this.position.x = this.position.x + xzslope * ((this.position.z * 2**delta) - this.position.z);
                    this.position.y = this.position.y + yzslope * ((this.position.z * 2**delta) - this.position.z);
                    this.position.z *= 2**(delta);
                }
            }
        , { passive: false });
        }
}