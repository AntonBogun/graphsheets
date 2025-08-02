import { Vec2d } from "../geometry/Vec2d.js";
import { Vec3d } from "../geometry/Vec3d.js";
import { Vec4d } from "../geometry/Vec4d.js";
import { TransformationMatrix } from "../geometry/TransformationMatrix.js";
import { State } from "../State.js";
export class Camera {
    private zoom_value;
    private last_position: Vec2d;
    private position: Vec2d;
    private initial_position: Vec2d;
    private is_dragging;
    private touch_initial_distance;
    private touch_initial_position: Vec2d;
    private touch_last_position: Vec2d;
    private transformationMatrix: TransformationMatrix;
    private inverseTransformationMatrix: TransformationMatrix;
    // private isViewDirty: boolean;

    constructor() {
        this.zoom_value = 1.0;
        this.last_position = new Vec2d(0,0);
        this.position = new Vec2d(0, 0);
        this.initial_position = new Vec2d(0, 0);
        this.is_dragging = false;
        this.touch_initial_distance = 0;
        this.touch_initial_position = new Vec2d(0, 0);
        this.touch_last_position = new Vec2d(0, 0);
        this.transformationMatrix = this.getTransformationMatrix();
        this.inverseTransformationMatrix = this.getInverseTransformationMatrix();
        this.bindEventListeners();
        State.currentCamera = this;
        // this.isViewDirty = true;
    }
    
    // public setDirtyView() {
    //     this.isViewDirty = true;
    // }

    public getTransformationMatrix(): TransformationMatrix {
        // if (!this.isViewDirty) {
        //     return this.transformationMatrix;
        // }
        let eye = new Vec3d(this.position.x, this.position.y, this.zoom_value);
        let target = new Vec3d(this.position.x, this.position.y, -1);
        let up = new Vec3d(0, 1, 0);
        let vMatrix = TransformationMatrix.lookAt(eye, target, up);
        // let pMatrix = TransformationMatrix.perspective(1.5*Math.PI, window.innerWidth/window.innerHeight, 0, 1e6);
        let pMatrix = TransformationMatrix.orthogonal(10*this.zoom_value*window.innerWidth/window.innerHeight, 10*this.zoom_value, 0, 1e6);
        // this.transformationMatrix = pMatrix.mul(vMatrix);
        // this.inverseTransformationMatrix = this.getInverseTransformationMatrix();
        // this.isViewDirty = false;
        return this.transformationMatrix;
    }

    public getInverseTransformationMatrix(): TransformationMatrix {
        // if (!this.isViewDirty) {
        //     return this.inverseTransformationMatrix;
        // }
        let eye = new Vec3d(this.position.x, this.position.y, this.zoom_value);
        let target = new Vec3d(this.position.x, this.position.y, -1);
        let up = new Vec3d(0, 1, 0);
        let vMatrix = TransformationMatrix.inverseLookAt(eye, target, up);
        // let pMatrix = TransformationMatrix.inversePerspective(1.5*Math.PI, window.innerWidth/window.innerHeight, 0, 1e6);
        let pMatrix = TransformationMatrix.inverseOrthogonal(10*this.zoom_value*window.innerWidth/window.innerHeight, 10*this.zoom_value, 0, 1e6);
        return vMatrix.mul(pMatrix);
    }

    public bindEventListeners(): void {
        //MARK: Event Listeners

        document.onmousedown = (event) => {
            this.is_dragging = true;
            const e_pos = new Vec2d(event.pageX, -event.pageY);
            this.initial_position = e_pos;
            this.last_position = this.position;
        }

        document.onmousemove = (event) => {
            if(!this.is_dragging) return;
            const e_pos = new Vec2d(event.pageX, -event.pageY);
            this.position = Vec2d.add(this.last_position, 
                Vec2d.smul(
                    Vec2d.sub(e_pos, this.initial_position),
                    this.zoom_value*2 / window.innerHeight
                )
            );
        }

        document.onmouseup = (event) => {
            const e_pos = new Vec2d(event.pageX, -event.pageY);
            this.position = Vec2d.add(this.last_position, 
                Vec2d.smul(
                    Vec2d.sub(e_pos, this.initial_position),
                    this.zoom_value*2 / window.innerHeight
                )
            );
            this.is_dragging = false;
        }

        document.onkeydown = (event) => {
            if(event.key == "+") {
                this.zoom_value /= 2;
            } else if(event.key == "-") {
                this.zoom_value *= 2;
            }
        }


        document.addEventListener("touchstart", (event) => {
            event.preventDefault();
            if(event.touches.length != 2) { 
                this.touch_initial_distance = 0;
                this.touch_initial_position = new Vec2d(0, 0);
                this.touch_last_position = new Vec2d(0,0);
                return;
            }
            let touch0 = new Vec2d(event.touches[0].clientX, event.touches[0].clientY);
            let touch1 = new Vec2d(event.touches[1].clientX, event.touches[1].clientY);
            this.touch_initial_position = Vec2d.smul(Vec2d.add(touch0, touch1), 0.5);
            this.touch_initial_distance = Vec2d.mag(Vec2d.sub(touch0, touch1));
            this.touch_last_position = this.position;
        },
        {passive: false});

        document.addEventListener("touchmove", (event) => {
            event.preventDefault();
            if(event.touches.length != 2) {
                this.touch_initial_distance = 0;
                this.touch_initial_position = new Vec2d(0, 0);
                this.touch_last_position = new Vec2d(0,0);
                return;
            }
            let touch0 = new Vec2d(event.touches[0].clientX, event.touches[0].clientY);
            let touch1 = new Vec2d(event.touches[1].clientX, event.touches[1].clientY);
            let touch_current_distance = Vec2d.mag(Vec2d.sub(touch0, touch1));
            let touch_current_position = Vec2d.smul(Vec2d.add(touch0, touch1), 0.5);
            this.zoom_value = touch_current_distance/this.touch_initial_distance;
            this.position = Vec2d.add(this.touch_last_position, 
                                    Vec2d.sub(touch_current_position, this.touch_initial_position)
                                );

        },
        {passive: false});

        document.addEventListener("touchend", (event) => {
            event.preventDefault();
            if(event.touches.length != 2) {
                this.touch_initial_distance = 0;
                this.touch_initial_position = new Vec2d(0, 0);
                this.touch_last_position = new Vec2d(0,0);
                return;
            }
            let touch0 = new Vec2d(event.touches[0].clientX, event.touches[0].clientY);
            let touch1 = new Vec2d(event.touches[1].clientX, event.touches[1].clientY);
            let touch_current_position = Vec2d.smul(Vec2d.add(touch0, touch1), 0.5);
            this.position = Vec2d.add(this.touch_last_position, 
                            Vec2d.sub(touch_current_position, this.touch_initial_position)
                        );
            this.touch_initial_distance = 0;
            this.touch_initial_position = new Vec2d(0, 0);
            this.touch_last_position = new Vec2d(0,0);
        },
        {passive:false});

        document.addEventListener("wheel", (event) => {
                event.preventDefault();
                let mouse_position = new Vec2d(2*(event.clientX - (window.innerWidth / 2)) / window.innerWidth, 
                                                2*((window.innerHeight-event.clientY) - (window.innerHeight / 2)) / window.innerHeight);
                let world_mouse_position = Vec4d.mmul(
                    this.getInverseTransformationMatrix(),
                    new Vec4d(mouse_position.x, mouse_position.y, 0, 1)
                );
                world_mouse_position = Vec4d.smul(world_mouse_position,(1.0/world_mouse_position.w));
                let world_mouse_position3 = new Vec3d(world_mouse_position.x, world_mouse_position.y, 0);
                // console.log(world_mouse_position3);
                let delta = Vec2d.dot(new Vec2d(event.deltaX, event.deltaY), new Vec2d(1,1))/(event.ctrlKey?50:100);
                let position_to_mouse = Vec3d.normalize(Vec3d.sub(world_mouse_position3, new Vec3d(this.position.x, this.position.y, this.zoom_value)));
                let xzslope = position_to_mouse.x / position_to_mouse.z;
                let yzslope = position_to_mouse.y / position_to_mouse.z;
                if(this.zoom_value * 2**delta > -1){
                    this.position.x = this.position.x + xzslope * ((this.zoom_value * 2**delta) - this.zoom_value);
                    this.position.y = this.position.y + yzslope * ((this.zoom_value * 2**delta) - this.zoom_value);
                    this.zoom_value *= 2**(delta);
                }
            }
        , { passive: false });
    }
}