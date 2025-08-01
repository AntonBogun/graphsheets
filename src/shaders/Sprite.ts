import { RenderObject } from "./RenderObject.js";
import { Program } from "../shaders/Program.js";
import { Vec2d } from "../geometry/Vec2d.js";
import { Texture } from "../shaders/Texture.js";
import { TransformationMatrix } from "../geometry/TransformationMatrix.js";

export class Sprite extends RenderObject {
    private position: Vec2d;
    private size: Vec2d;
    private texture: Texture; // Your texture type
    private VAO: WebGLVertexArrayObject;
    private VBO: WebGLBuffer;
    private EBO: WebGLBuffer;

    constructor(
        gl: WebGL2RenderingContext,
        program: Program,
        texture: Texture,
        position: Vec2d = new Vec2d(0, 0),
        size: Vec2d = new Vec2d(1, 1),
    ) {
        super(program);
        this.position = position;
        this.size = size;
        this.texture = texture;
        
        const vertices = new Float32Array([
            // Position (x, y), UV (u, v)
            -0.5 * size.x + position.x, -0.5 * size.y + position.y, 0.0, 0.0,  // Bottom-left
            -0.5 * size.x + position.x,  0.5 * size.y + position.y, 0.0, 1.0,  // Top-left
             0.5 * size.x + position.x, -0.5 * size.y + position.y, 1.0, 0.0,  // Bottom-right
             0.5 * size.x + position.x,  0.5 * size.y + position.y, 1.0, 1.0   // Top-right
        ]);

        const indices = new Uint32Array([
            0, 1, 2,  // First triangle
            1, 3, 2   // Second triangle
        ]);
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

        // gl.bindVertexArray(null);
    }

    public render(gl: WebGL2RenderingContext, viewTransform: TransformationMatrix): void {

        // Set uniforms
        const transformLocation = this.program.getUniformLocation("transform");

        gl.uniformMatrix4fv(transformLocation, false, viewTransform.matrix);

        // Bind texture
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, this.texture.texture);
        
        const samplerLocation = this.program.getUniformLocation("sampler");
        gl.uniform1i(samplerLocation, 0);
        
        // Draw
        gl.bindVertexArray(this.VAO);
        gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_INT, 0);
        // gl.bindVertexArray(null);
    }


    public getPosition(): Vec2d {
        return this.position;
    }


    public getSize(): Vec2d {
        return this.size;
    }

    public destroy(gl: WebGL2RenderingContext): void {
        if (this.VAO) gl.deleteVertexArray(this.VAO);
        if (this.VBO) gl.deleteBuffer(this.VBO);
        if (this.EBO) gl.deleteBuffer(this.EBO);
    }
}