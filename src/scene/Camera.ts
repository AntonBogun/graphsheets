import { Vec2d } from "../geometry/Vec2d.js";
import { Vec3d } from "../geometry/Vec3d.js";
import { Vec4d } from "../geometry/Vec4d.js";
import { TransformationMatrix } from "../geometry/TransformationMatrix.js";
import { State } from "../State.js";
import { ComponentHelper } from "./components/ComponentHelper.js";
import { InteractionManager } from "./interaction/InteractionManager.js";
export class Camera {
    public position: Vec3d;
    private transformationMatrix: TransformationMatrix;
    // private inverseTransformationMatrix: TransformationMatrix;
    // private isViewDirty: boolean;

    constructor() {
        this.position = new Vec3d(0, 0, 1.0);
        this.transformationMatrix = this.getTransformationMatrix();
        // this.inverseTransformationMatrix = this.getInverseTransformationMatrix();
        State.currentCamera = this;
        // this.isViewDirty = true;
        InteractionManager.getInstance().setCurrentCamera(this);
    }
    
    // public setDirtyView() {
    //     this.isViewDirty = true;
    // }

    public getTransformationMatrix(): TransformationMatrix {
        // if (!this.isViewDirty) {
        //     return this.transformationMatrix;
        // }
        let eye = new Vec3d(this.position.x, this.position.y, this.position.z);
        let target = new Vec3d(this.position.x, this.position.y, -1);
        let up = new Vec3d(0, 1, 0);
        let vMatrix = TransformationMatrix.lookAt(eye, target, up);
        // let pMatrix = TransformationMatrix.perspective(1.5*Math.PI, window.innerWidth/window.innerHeight, 0, 1e6);
        let pMatrix = TransformationMatrix.orthogonal(10*this.position.z*window.innerWidth/window.innerHeight, 10*this.position.z, 0, 1e6);
        this.transformationMatrix = pMatrix.mul(vMatrix);
        // this.inverseTransformationMatrix = this.getInverseTransformationMatrix();
        // this.isViewDirty = false;
        return this.transformationMatrix;
    }

    public getInverseTransformationMatrix(): TransformationMatrix {
        // if (!this.isViewDirty) {
        //     return this.inverseTransformationMatrix;
        // }
        let eye = new Vec3d(this.position.x, this.position.y, this.position.z);
        let target = new Vec3d(this.position.x, this.position.y, -1);
        let up = new Vec3d(0, 1, 0);
        let vMatrix = TransformationMatrix.inverseLookAt(eye, target, up);
        // let pMatrix = TransformationMatrix.inversePerspective(1.5*Math.PI, window.innerWidth/window.innerHeight, 0, 1e6);
        let pMatrix = TransformationMatrix.inverseOrthogonal(10*this.position.z*window.innerWidth/window.innerHeight, 10*this.position.z, 0, 1e6);
        return vMatrix.mul(pMatrix);
    }

    public mouseToNormalized(mousePosition: Vec2d<"mouse">): Vec2d<"normalized"> {
        let normalizedX = (mousePosition.x / window.innerWidth) * 2 - 1;
        let normalizedY = 1 - (mousePosition.y / window.innerHeight) * 2;
        return new Vec2d(normalizedX, normalizedY, "normalized");
    }

    public normalizedToWorld(mousePosition: Vec2d<"normalized">): Vec2d<"world"> {
        const transform = State.currentCamera?.getInverseTransformationMatrix()!;
        let world_position = Vec4d.mmul(
                            transform,
                            new Vec4d(mousePosition.x, mousePosition.y, 0, 1)
                        );
        world_position = Vec4d.smul(world_position,(1.0/world_position.w));
        let world_position2 = new Vec2d(world_position.x, world_position.y, "world");
        return world_position2;
    }

    public mouseToWorld(mousePosition: Vec2d<"mouse">): Vec2d<"world"> {
        return this.normalizedToWorld(this.mouseToNormalized(mousePosition));
    }

    public worldToNormalized(worldPosition: Vec2d<"world">): Vec2d<"normalized"> {
        const transform = State.currentCamera?.getTransformationMatrix()!;
        let normalized_position = Vec4d.mmul(
            transform,
            new Vec4d(worldPosition.x, worldPosition.y, 0, 1)
        );
        normalized_position = Vec4d.smul(normalized_position, (1.0 / normalized_position.w));
        return new Vec2d(normalized_position.x, normalized_position.y, "normalized");
    }

}