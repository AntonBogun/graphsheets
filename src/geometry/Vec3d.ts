import { TransformationMatrix } from "../geometry/TransformationMatrix.js";
export class Vec3d {
    constructor(
        public x: number,
        public y: number,
        public z: number
    ){};
    static sdiv(v: Vec3d, num: number): Vec3d {
        return new Vec3d(v.x / num, v.y / num, v.z / num);
    }
    static sub(a: Vec3d, b: Vec3d): Vec3d {
        return new Vec3d(a.x - b.x, a.y - b.y, a.z - b.z);
    }
    static normalize(v: Vec3d): Vec3d {
        const len = Math.hypot(v.x, v.y, v.z);
        return len > 0 ? Vec3d.sdiv(v, len) : new Vec3d(0, 0, 1);
    }
    static crossProduct(a: Vec3d, b: Vec3d): Vec3d {
        return new Vec3d(
            a.y * b.z - a.z * b.y,
            a.z * b.x - a.x * b.z,
            a.x * b.y - a.y * b.x
        );
    }
    static dot(a: Vec3d, b: Vec3d): number {
        return a.x*b.x + a.y*b.y + a.z*b.z;
    }

}