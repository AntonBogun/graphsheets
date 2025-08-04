import { IRenderable } from "../../shaders/IRenderable";
import { Box } from "../../geometry/Box.js";
import { State } from "../../State.js";
export class SelectionComponent implements IRenderable<"selection"> {
    public renderingType: "selection";
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
            this.selectionRegion.xi, this.selectionRegion.yi,
            this.selectionRegion.xi, this.selectionRegion.yi + this.selectionRegion.height,
            this.selectionRegion.xi + this.selectionRegion.width, this.selectionRegion.yi,
            this.selectionRegion.xi + this.selectionRegion.width, this.selectionRegion.yi + this.selectionRegion.height
        ]);

        gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.DYNAMIC_DRAW);

        this.EBO = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.EBO);

        let indices = new Uint32Array([
            0, 1, 2,
            1, 3, 2
        ]);

        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW);

        gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 4 * 2, 0);
        gl.enableVertexAttribArray(0);
    }

    render(){
        const gl = State.currentGraphicsContext!;
        gl.bindVertexArray(this.VAO);
        gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_INT, 0);
    }
}