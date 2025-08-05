import { IRenderable } from "../../shaders/IRenderable";
import { Box } from "../../geometry/Box.js";
import { State } from "../../State.js";
import { Vec2d } from "../../geometry/Vec2d.js";
import { ISelectable } from "../interaction/ISelectable";
import { ProgramDB } from "../../shaders/ProgramDB.js";
import { ProgramManager } from "../../shaders/ProgramManager";
export class SelectionComponent implements IRenderable<"selection"> {
    public renderingType = "selection" as const;
    selectionRegion: Box<"world">;
    VAO: WebGLVertexArrayObject;
    VBO: WebGLBuffer;
    EBO: WebGLBuffer;

    constructor(){
        this.selectionRegion = new Box(0, 0, 1, 1, "world");

        const gl = State.currentGraphicsContext!;
        this.VAO = gl.createVertexArray()!;
        gl?.bindVertexArray(this.VAO);

        this.VBO = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.VBO);

        let vertices = new Float32Array([
            this.selectionRegion.xi, this.selectionRegion.yi, 0, 0,
            this.selectionRegion.xi, this.selectionRegion.yi + this.selectionRegion.height, 0, 1,
            this.selectionRegion.xi + this.selectionRegion.width, this.selectionRegion.yi, 1, 0,
            this.selectionRegion.xi + this.selectionRegion.width, this.selectionRegion.yi + this.selectionRegion.height , 1, 1
        ]);

        gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.DYNAMIC_DRAW);

        this.EBO = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.EBO);

        let indices = new Uint32Array([
            0, 1, 2,
            1, 3, 2
        ]);

        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW);

        gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 4 * Float32Array.BYTES_PER_ELEMENT, 0);
        gl.enableVertexAttribArray(0);

        gl.vertexAttribPointer(1, 2, gl.FLOAT, false, 4 * Float32Array.BYTES_PER_ELEMENT, 2 * Float32Array.BYTES_PER_ELEMENT);
        gl.enableVertexAttribArray(1);

    }

    setPosition(position: Vec2d<"world">) {
        this.selectionRegion.xi = position.x;
        this.selectionRegion.yi = position.y;

        const gl = State.currentGraphicsContext!;
        gl.bindBuffer(gl.ARRAY_BUFFER, this.VBO);

        let vertices = new Float32Array([
            this.selectionRegion.xi, this.selectionRegion.yi, 0, 0,
            this.selectionRegion.xi, this.selectionRegion.yi + this.selectionRegion.height, 0, 1,
            this.selectionRegion.xi + this.selectionRegion.width, this.selectionRegion.yi, 1, 0,
            this.selectionRegion.xi + this.selectionRegion.width, this.selectionRegion.yi + this.selectionRegion.height, 1, 1
        ]);

        gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.DYNAMIC_DRAW);
    }

    setSize(size: Vec2d<"world">) {
        this.selectionRegion.width = size.x;
        this.selectionRegion.height = size.y;

        const gl = State.currentGraphicsContext!;
        gl.bindBuffer(gl.ARRAY_BUFFER, this.VBO);

        let vertices = new Float32Array([
            this.selectionRegion.xi, this.selectionRegion.yi, 0, 0,
            this.selectionRegion.xi, this.selectionRegion.yi + this.selectionRegion.height, 0, 1,
            this.selectionRegion.xi + this.selectionRegion.width, this.selectionRegion.yi, 1, 0,
            this.selectionRegion.xi + this.selectionRegion.width, this.selectionRegion.yi + this.selectionRegion.height, 1, 1
        ]);
        
        gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.DYNAMIC_DRAW);
    }

    containsComponent(component: ISelectable) {
        const componentBounds = component.boundingBox;
        let l1: Vec2d<"world">;
        let r1: Vec2d<"world">;
        let l2: Vec2d<"world">;
        let r2: Vec2d<"world">;

        if(this.selectionRegion.width > 0 && this.selectionRegion.height > 0) {
            l1 = new Vec2d(this.selectionRegion.xi, this.selectionRegion.yi, "world");
            r1 = new Vec2d(this.selectionRegion.xi + this.selectionRegion.width, this.selectionRegion.yi + this.selectionRegion.height, "world");
        } else if (this.selectionRegion.width < 0 && this.selectionRegion.height < 0) {
            l1 = new Vec2d(this.selectionRegion.xi + this.selectionRegion.width, this.selectionRegion.yi + this.selectionRegion.height, "world");
            r1 = new Vec2d(this.selectionRegion.xi, this.selectionRegion.yi, "world");
        } else if (this.selectionRegion.width < 0 && this.selectionRegion.height > 0) {
            l1 = new Vec2d(this.selectionRegion.xi + this.selectionRegion.width, this.selectionRegion.yi, "world");
            r1 = new Vec2d(this.selectionRegion.xi, this.selectionRegion.yi + this.selectionRegion.height, "world");
        } else {
            l1 = new Vec2d(this.selectionRegion.xi, this.selectionRegion.yi + this.selectionRegion.height, "world");
            r1 = new Vec2d(this.selectionRegion.xi + this.selectionRegion.width, this.selectionRegion.yi, "world");
        }

        if(componentBounds.width > 0 && componentBounds.height > 0) {
            l2 = new Vec2d(componentBounds.xi, componentBounds.yi, "world");
            r2 = new Vec2d(componentBounds.xi + componentBounds.width, componentBounds.yi + componentBounds.height, "world");
        } else if (componentBounds.width < 0 && componentBounds.height < 0) {
            l2 = new Vec2d(componentBounds.xi + componentBounds.width, componentBounds.yi + componentBounds.height, "world");
            r2 = new Vec2d(componentBounds.xi, componentBounds.yi, "world");
        } else if (componentBounds.width < 0 && componentBounds.height > 0) {
            l2 = new Vec2d(componentBounds.xi + componentBounds.width, componentBounds.yi, "world");
            r2 = new Vec2d(componentBounds.xi, componentBounds.yi + componentBounds.height, "world");
        } else {
            l2 = new Vec2d(componentBounds.xi, componentBounds.yi + componentBounds.height, "world");
            r2 = new Vec2d(componentBounds.xi + componentBounds.width, componentBounds.yi, "world");
        }

        return (
            l1.x < r2.x && r1.x > l2.x &&
            l1.y < r2.y && r1.y > l2.y
        );

    }

    render(){
        const gl = State.currentGraphicsContext!;

        const transformLocation = ProgramDB.getProgram(this).getUniformLocation("transform");
        gl.uniformMatrix4fv(transformLocation, false, State.currentCamera?.getTransformationMatrix()!.transpose().matrix!);

        gl.bindVertexArray(this.VAO);
        gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_INT, 0);
    }
}