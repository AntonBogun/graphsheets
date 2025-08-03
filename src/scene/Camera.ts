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


}