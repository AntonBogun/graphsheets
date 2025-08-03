import { IRenderable } from "../../shaders/IRenderable.js";
import { Program } from "../../shaders/Program.js";
import { Vec2d } from "../../geometry/Vec2d.js";
import { Texture } from "../../shaders/Texture.js";
import { TransformationMatrix } from "../../geometry/TransformationMatrix.js";
import { State } from "../../State.js";
import { ProgramDB } from "../../shaders/ProgramDB.js";
import { Box } from "../../geometry/Box.js";
import { ISelectable } from "./ISelectable.js";
import { Vec4d } from "../../geometry/Vec4d.js";
import { Vec3d } from "../../geometry/Vec3d.js";
export class SpriteComponent implements IRenderable<"basic_selectable">, ISelectable {
    public renderingType: "basic_selectable" = "basic_selectable";
    private position: Vec2d;
    private size: Vec2d;
    private texture: Texture; // Your texture type
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
            // Position (x, y), UV (u, v)
            -0.5 * size.x + position.x, -0.5 * size.y + position.y, 0.0, 0.0,  // Bottom-left
            -0.5 * size.x + position.x,  0.5 * size.y + position.y, 0.0, 1.0,  // Top-left
             0.5 * size.x + position.x, -0.5 * size.y + position.y, 1.0, 0.0,  // Bottom-right
             0.5 * size.x + position.x,  0.5 * size.y + position.y, 1.0, 1.0   // Top-right
        ]);

        this.boundingBox = new Box(
            position.x - 0.5 * size.x,
            position.y - 0.5 * size.y,
            size.x,
            size.y
        );

        const indices = new Uint32Array([
            0, 1, 2,  // First triangle
            1, 3, 2   // Second triangle
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

        // gl.bindVertexArray(null);
    }

    public render(viewTransform: TransformationMatrix): void {
        const gl = State.currentGraphicsContext!;

        // Set uniforms
        const transformLocation = ProgramDB.getProgram(this).getUniformLocation("transform");

        gl.uniformMatrix4fv(transformLocation, false, viewTransform.matrix);

        const selectionLocation = ProgramDB.getProgram(this).getUniformLocation("isSelected");
        if(this.isSelected) {
            gl.uniform1f(selectionLocation, 1);
        } else {
            gl.uniform1f(selectionLocation, 0);
        }

        // Bind texture
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, this.texture.texture);
        
        const samplerLocation = ProgramDB.getProgram(this).getUniformLocation("sampler");
        gl.uniform1i(samplerLocation, 0);
        
        // Draw
        gl.bindVertexArray(this.VAO);
        gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_INT, 0);
        // gl.bindVertexArray(null);
    }

    // TODO: Factor of two?
    public containsPosition(x: number, y: number): boolean {
        const transform = State.currentCamera?.getInverseTransformationMatrix()!;
        let world_position = Vec4d.mmul(
                            transform,
                            new Vec4d(2*x, 2*y, 0, 1)
                        );
        world_position = Vec4d.smul(world_position,(1.0/world_position.w));
        let world_position3 = new Vec3d(world_position.x, world_position.y, 0);
        return this.boundingBox.contains(world_position3.x, world_position3.y);
    }


    public getPosition(): Vec2d {
        return this.position;
    }


    public getSize(): Vec2d {
        return this.size;
    }

    public destroy(): void {
        const gl = State.currentGraphicsContext!;
        if (this.VAO) gl.deleteVertexArray(this.VAO);
        if (this.VBO) gl.deleteBuffer(this.VBO);
        if (this.EBO) gl.deleteBuffer(this.EBO);
    }
}