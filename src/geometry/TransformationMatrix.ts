import { Vec3d } from "../geometry/Vec3d.js";
export class TransformationMatrix {
    public matrix: Float32Array;
    constructor(matrix: number[] | Float32Array) {
        if (matrix instanceof Float32Array) {
            this.matrix = matrix;
        }else{
            this.matrix = new Float32Array(matrix);
        }
    }

    public mul(other: TransformationMatrix): TransformationMatrix {
        const a = this.matrix;
        const b = other.matrix;

        const result = new Float32Array(16);
        for (let i = 0; i < 4; i++) {//column
            for (let j = 0; j < 4; j++) {//row
                result[i * 4 + j] = a[i * 4 + 0] * b[0 * 4 + j] +
                                    a[i * 4 + 1] * b[1 * 4 + j] +
                                    a[i * 4 + 2] * b[2 * 4 + j] +
                                    a[i * 4 + 3] * b[3 * 4 + j];
            }
        }
        return new TransformationMatrix(result);
    }


    static lookAt(eye: Vec3d, target: Vec3d, up: Vec3d): TransformationMatrix {
        const zAxis = Vec3d.normalize(Vec3d.sub(eye,target));
        const xAxis = Vec3d.normalize(Vec3d.crossProduct(up, zAxis));

        const yAxis = Vec3d.crossProduct(zAxis, xAxis);

        return new TransformationMatrix([
            xAxis.x,  yAxis.x,  zAxis.x,  -Vec3d.dot(xAxis, eye),
            xAxis.y,  yAxis.y,  zAxis.y,  -Vec3d.dot(yAxis, eye),
            xAxis.z,  yAxis.z,  zAxis.z,  -Vec3d.dot(zAxis, eye),
            0, 0, 0, 1
        ]);
    }
    static id(): TransformationMatrix {
        return new TransformationMatrix([
            1, 0, 0, 0,
            0, 1, 0, 0,
            0, 0, 1, 0,
            0, 0, 0, 1
        ]);
    }

    static inverseLookAt(eye: Vec3d, target: Vec3d, up: Vec3d): TransformationMatrix {
        const zAxis = Vec3d.normalize(Vec3d.sub(eye, target));
        const xAxis = Vec3d.normalize(Vec3d.crossProduct(up, zAxis));
        const yAxis = Vec3d.crossProduct(zAxis, xAxis);

        return new TransformationMatrix([
            xAxis.x, xAxis.y, xAxis.z, eye.x,
            yAxis.x, yAxis.y, yAxis.z, eye.y,
            zAxis.x, zAxis.y, zAxis.z, eye.z,
            0,   0,   0,   1
        ]);
    }

    static perspective(fov: number, aspectRatio: number, near: number, far: number): TransformationMatrix {

    const f = 1.0 / Math.tan(fov / 2);
    const rangeInv = 1 / (near - far);

    return new TransformationMatrix([
        f / aspectRatio, 0, 0, 0,
        0, f, 0, 0,
        0, 0, (near + far) * rangeInv, near * far * rangeInv * 2,
        0, 0, -1, 0,
    ]);
    }

    static inversePerspective(fov: number, aspectRatio: number, near: number, far: number): TransformationMatrix {
        const f = 1.0 / Math.tan(fov / 2);
        const rangeInv = 1 / (near - far);

        const A = f / aspectRatio;
        const B = f;
        const C = (near + far) * rangeInv;
        const D = near * far * rangeInv * 2;
        
        return new TransformationMatrix([
            1/A,   0,    0,    0,
            0,   1/B,    0,    0,
            0,     0,    0,  1/D,
            0,     0,   -1,  C/D
        ]);
    }

    public transpose(): TransformationMatrix {
        const a = this.matrix;
        return new TransformationMatrix([
            a[0], a[4], a[8],  a[12],
            a[1], a[5], a[9],  a[13],
            a[2], a[6], a[10], a[14],
            a[3], a[7], a[11], a[15]
        ]);
    }
}
