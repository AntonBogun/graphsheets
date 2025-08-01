import { TransformationMatrix } from "../geometry/TransformationMatrix.js";
export class Vec4d {
    constructor(
        public x: number,
        public y: number,
        public z: number,
        public w: number
    ){};
    static mmul(a_: TransformationMatrix, b: Vec4d): Vec4d {
        const a = a_.matrix;
        return new Vec4d(
            a[0] * b.x + a[1] * b.y + a[2] * b.z + a[3] * b.w,
            a[4] * b.x + a[5] * b.y + a[6] * b.z + a[7] * b.w,
            a[8] * b.x + a[9] * b.y + a[10] * b.z + a[11] * b.w,
            a[12] * b.x + a[13] * b.y + a[14] * b.z + a[15] * b.w
        );
    }
    static smul(v: Vec4d, num: number): Vec4d {
        return new Vec4d(v.x * num, v.y * num, v.z * num, v.w * num);
    }

}