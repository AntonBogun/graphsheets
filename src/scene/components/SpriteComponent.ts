import { IRenderable } from "../../shaders/IRenderable.js";
import { Program } from "../../shaders/Program.js";
import { Vec2d } from "../../geometry/Vec2d.js";
import { Texture } from "../../shaders/Texture.js";
import { TransformationMatrix } from "../../geometry/TransformationMatrix.js";
import { State } from "../../State.js";
import { ProgramDB } from "../../shaders/ProgramDB.js";
import { Box } from "../../geometry/Box.js";
import { ISelectable } from "../interaction/ISelectable.js";
import { Vec4d } from "../../geometry/Vec4d.js";
import { Vec3d } from "../../geometry/Vec3d.js";
import { IMovable } from "../interaction/IMovable.js";
import { IHoverable } from "../interaction/IHoverable.js";
export class SpriteComponent implements IRenderable<"basic_selectable">, ISelectable, IMovable, IHoverable {
    public renderingType: "basic_selectable" = "basic_selectable";
    public position: Vec2d<"world">;
    private size: Vec2d<"world">;
    private texture: Texture; // Your texture type
    private VAO: WebGLVertexArrayObject;
    private VBO: WebGLBuffer;
    private EBO: WebGLBuffer;
    public boundingBox: Box<"world">;
    public isSelected: boolean = false;
    public isHovered: boolean = false;

    constructor(
        texture: Texture,
        position: Vec2d<"world"> = new Vec2d(0, 0, "world"),
        size: Vec2d<"world"> = new Vec2d(1, 1, "world"),
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
            size.y,
            "world"
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

        // gl.bindVertexArray(null);
    }

    public setPosition(position: Vec2d<"world">): void {
        this.position = position;
        this.boundingBox.setPosition(position);
        const vertices = new Float32Array([
            position.x, position.y, 0.0, 0.0,
            position.x, position.y + this.size.y, 0.0, 1.0,
            position.x + this.size.x, position.y, 1.0, 0.0,
            position.x + this.size.x, position.y + this.size.y, 1.0, 1.0 
        ]);
        const gl = State.currentGraphicsContext!;
        gl.bindBuffer(gl.ARRAY_BUFFER, this.VBO);
        gl.bufferSubData(gl.ARRAY_BUFFER, 0, vertices);
    }

    public render(): void {
        const gl = State.currentGraphicsContext!;

        // Set uniforms
        const transformLocation = ProgramDB.getProgram(this).getUniformLocation("transform");

        gl.uniformMatrix4fv(transformLocation, false, State.currentCamera?.getTransformationMatrix().transpose().matrix!);

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
    public containsPosition(normPosition: Vec2d<"normalized">): boolean {
        let world_position = State.currentCamera?.normalizedToWorld(normPosition)!;
        return this.boundingBox.contains(world_position);
    }


    public getPosition(): Vec2d<"world"> {
        return this.position;
    }


    public getSize(): Vec2d<"world"> {
        return this.size;
    }

    public destroy(): void {
        const gl = State.currentGraphicsContext!;
        if (this.VAO) gl.deleteVertexArray(this.VAO);
        if (this.VBO) gl.deleteBuffer(this.VBO);
        if (this.EBO) gl.deleteBuffer(this.EBO);
    }
}