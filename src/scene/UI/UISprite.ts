import { IRenderable } from "../../shaders/IRenderable.js";
import { Vec2d } from "../../geometry/Vec2d.js";
import { Texture } from "../../shaders/Texture.js";
import { State } from "../../State.js";
import { Box } from "../../geometry/Box.js";
import { ProgramDB } from "../../shaders/ProgramDB.js";
import { ISelectable } from "../interaction/ISelectable.js";
export class UISprite implements IRenderable<"interface">, ISelectable {
    public renderingType = "interface" as const;
    private position: Vec2d;
    private size: Vec2d;
    private texture: Texture;
    private VAO: WebGLVertexArrayObject;
    private VBO: WebGLBuffer;
    private EBO: WebGLBuffer;
    public boundingBox: Box;
    public isSelected: boolean = false;

    constructor(
        texture: Texture,
        position: Vec2d = new Vec2d(0, 0),
        size: Vec2d = new Vec2d(1, 1),
    ) {
        this.position = position;
        this.size = size;
        this.texture = texture;
        
        const vertices = new Float32Array([
            position.x, position.y, 0.0, 0.0,
            position.x, position.y + size.y, 0.0, 1.0,
            position.x + size.x, position.y, 1.0, 0.0,
            position.x + size.x, position.y + size.y, 1.0, 1.0 
        ]);

        this.boundingBox = new Box(
            position.x,
            position.y,
            size.x,
            size.y
        );

        const indices = new Uint32Array([
            0, 1, 2,
            1, 3, 2
        ]);

        const gl = State.currentGraphicsContext!;

        this.VAO = gl.createVertexArray();
        gl.bindVertexArray(this.VAO);

        this.VBO = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.VBO);
        gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

        this.EBO = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.EBO);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW);

        // Position attribute
        gl.enableVertexAttribArray(0);
        gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 16, 0);

        // UV attribute
        gl.enableVertexAttribArray(1);
        gl.vertexAttribPointer(1, 2, gl.FLOAT, false, 16, 8);
    }

    public containsPosition(x: number, y: number): boolean {
        return this.boundingBox.contains(x, y);
    }

    render() {
        const gl = State.currentGraphicsContext!;
        
        const selectionLocation = ProgramDB.getProgram(this).getUniformLocation("isSelected");
        if(this.isSelected) {
            gl.uniform1f(selectionLocation, 1);
        } else {
            gl.uniform1f(selectionLocation, 0);
        }

        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, this.texture.texture);
        
        const samplerLocation = ProgramDB.getProgram(this).getUniformLocation("sampler");
        gl.uniform1i(samplerLocation, 0);
        
        gl.bindVertexArray(this.VAO);
        gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_INT, 0);
    }

}