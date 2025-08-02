import { Vec2d } from "../geometry/Vec2d.js";
import { Vec3d } from "../geometry/Vec3d.js";
import { Vec4d } from "../geometry/Vec4d.js";
import { TransformationMatrix } from "../geometry/TransformationMatrix.js";
export class Camera {
    private width;//world
    private world_last_pos: Vec2d;//world
    private screen_start_pos: Vec2d;//screen
    private pos: Vec2d;
    private is_dragging: boolean;
    readonly min_width = 1e-7;
    readonly max_width = 1e5;
    readonly wheel_zoom_factor = 1.4;

    constructor() {
        this.width = 1.0;
        this.world_last_pos = new Vec2d(0,0);
        this.pos = new Vec2d(0, 0);
        this.screen_start_pos = new Vec2d(0, 0);
        this.is_dragging = false;
        this.bindEventListeners();
    }
    
    public getTransformationMatrix(): TransformationMatrix {
        const eye = new Vec3d(this.pos.x, this.pos.y, this.width);
        const target = new Vec3d(this.pos.x, this.pos.y, -1);
        const up = new Vec3d(0, 1, 0);
        const vMatrix = TransformationMatrix.lookAt(eye, target, up);
        const ratio = window.innerHeight/window.innerWidth;
        const pMatrix = TransformationMatrix.orthogonal(this.width, this.width*ratio, 1e-7, 1e5);
        return pMatrix.mul(vMatrix);
    }

    public getInverseTransformationMatrix(): TransformationMatrix {
        const eye = new Vec3d(this.pos.x, this.pos.y, this.width);
        const target = new Vec3d(this.pos.x, this.pos.y, -1);
        const up = new Vec3d(0, 1, 0);
        const vMatrix = TransformationMatrix.inverseLookAt(eye, target, up);
        const ratio = window.innerHeight/window.innerWidth;
        const pMatrix = TransformationMatrix.inverseOrthogonal(this.width, this.width*ratio, 1e-7, 1e5);
        return vMatrix.mul(pMatrix);
    }
    public zoomCamera(screenPoint: Vec2d, delta: number): void {
        // clamp delta
        const min_delta = this.min_width / this.width;
        const max_delta = this.max_width / this.width;
        delta = Math.max(Math.min(delta, max_delta), min_delta);
        const normalizedScreenPoint = new Vec4d(
            (screenPoint.x / window.innerWidth)*2-1,
            (screenPoint.y / window.innerHeight)*2+1,
            0,1);
        const worldPoint = Vec4d.mmul(this.getInverseTransformationMatrix(), normalizedScreenPoint);
        // console.log(normalizedScreenPoint, worldPoint);
        // Adjust the camera pos based on the zoom level
        this.width *= delta;
        this.pos.x += (worldPoint.x - this.pos.x) * (1 - delta);
        this.pos.y += (worldPoint.y - this.pos.y) * (1 - delta);
    }
    public dragCamera(screenPos: Vec2d): void {
        // Calculate the screen delta
        const screenDelta = Vec2d.sub(this.screen_start_pos,screenPos);//reverse because dragging
        this.pos.x = this.world_last_pos.x + screenDelta.x * (this.width * 2 / window.innerWidth);
        this.pos.y = this.world_last_pos.y + screenDelta.y * (this.width * 2 / window.innerWidth);
        // console.log(screenPos, this.screen_start_pos, screenDelta, this.pos, this.world_last_pos);
    }

    public bindEventListeners(): void {
        //MARK: Event Listeners

        document.onmousedown = (event) => {
            this.is_dragging = true;
            const e_pos = new Vec2d(event.pageX, -event.pageY);
            this.screen_start_pos = e_pos;
            this.world_last_pos = Vec2d.copy(this.pos);
            // console.log("mousedown",this.screen_start_pos);
        }

        document.onmousemove = (event) => {
            if(!this.is_dragging) return;
            const e_pos = new Vec2d(event.pageX, -event.pageY);
            this.dragCamera(e_pos);
            // console.log("move",this.screen_start_pos);
        }

        document.onmouseup = (event) => {
            const e_pos = new Vec2d(event.pageX, -event.pageY);
            this.dragCamera(e_pos);
            this.world_last_pos = Vec2d.copy(this.pos);
            this.screen_start_pos = new Vec2d(window.innerWidth / 2, -window.innerHeight / 2);
            this.is_dragging = false;
            // console.log("mouseup",this.screen_start_pos);
        }

        document.onkeydown = (event) => {
            if(event.key == "+") {
                this.width /= this.wheel_zoom_factor;
            } else if(event.key == "-") {
                this.width *= this.wheel_zoom_factor;
            }
        }

        document.addEventListener("wheel", (event) => {
                event.preventDefault();
                //perform onmouseup to prevent issues with dragging after zoom
                if(this.is_dragging) {
                    const e_pos = new Vec2d(event.pageX, -event.pageY);
                    this.dragCamera(e_pos);
                    this.screen_start_pos = e_pos;//works when dragging after zoom
                }
                // console.log(new Vec2d(event.pageX, -event.pageY),new Vec2d(event.clientX, -event.clientY));
                // const delta = Math.exp(event.deltaY / 100);
                let delta = Vec2d.dot(new Vec2d(event.deltaX, event.deltaY), new Vec2d(1,1))/(event.ctrlKey?50:100);
                delta=this.wheel_zoom_factor ** delta;
                // console.log(`Zooming camera by ${event.deltaX}, ${event.deltaY} with delta: ${delta}`);
                this.zoomCamera(new Vec2d(event.pageX, -event.pageY), delta);
                this.world_last_pos = Vec2d.copy(this.pos);
                // console.log("wheel",this.screen_start_pos);
            }
        , { passive: false });
    }
}