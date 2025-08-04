import { IRenderable } from "../../shaders/IRenderable.js";
import { Vec2d } from "../../geometry/Vec2d.js";
import { Texture } from "../../shaders/Texture.js";
import { State } from "../../State.js";
import { Box } from "../../geometry/Box.js";
import { ProgramDB } from "../../shaders/ProgramDB.js";
import { ISelectable } from "../interaction/ISelectable.js";
import { IClickable } from "../interaction/IClickable.js";
import { UIRadioGroup } from "./UIRadioGroup.js";
import { IHoverable } from "../interaction/IHoverable.js";
export class UIRadioButton implements IRenderable<"interface">, ISelectable, IClickable, IHoverable {
    public renderingType = "interface" as const;
    private position: Vec2d<"world">;
    private size: Vec2d<"world">;
    private textureOff: Texture;
    private textureOn: Texture;
    private VAO: WebGLVertexArrayObject;
    private VBO: WebGLBuffer;
    private EBO: WebGLBuffer;
    public radioGroup: UIRadioGroup;
    public isDown: boolean;
    public boundingBox: Box<"world">;
    public isSelected: boolean = false;
    public isHovered: boolean = false;
    public clickCallback: () => void;

    constructor(
        textureOff: Texture,
        textureOn: Texture,
        radioGroup: UIRadioGroup,
        position: Vec2d<"world"> = new Vec2d(0, 0, "world"),
        size: Vec2d<"world"> = new Vec2d(1, 1, "world"),
    ) {
        this.isDown = false;
        this.position = position;
        this.size = size;
        this.textureOff = textureOff;
        this.textureOn = textureOn;
        this.clickCallback = () => {};
        
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

        this.radioGroup = radioGroup;
        radioGroup.addRadioButton(this);
    }

    registerClickCallback(clickCallback: () => void) {
        this.clickCallback = clickCallback;
    }

    processPress(): void {
        this.clickCallback();
        this.radioGroup.processRadioButtonPressed(this);
    }

    processRelease(): void {
    }

    public containsPosition(position: Vec2d<"normalized">): boolean {
        // Implicit conversion from World to Normalized
        let adjustedBox = new Box(
                                    (this.boundingBox.xi+1)*window.innerHeight/window.innerWidth - 1, 
                                    this.boundingBox.yi, 
                                    this.boundingBox.width*window.innerHeight/window.innerWidth,
                                    this.boundingBox.height,
                                    "normalized"
                                );
        return adjustedBox.contains(position);
    }

    render() {
        const gl = State.currentGraphicsContext!;
        
        const selectionLocation = ProgramDB.getProgram(this).getUniformLocation("isSelected");
        if(this.isSelected) {
            gl.uniform1f(selectionLocation, 1);
        } else {
            gl.uniform1f(selectionLocation, 0);
        }

        if(this.isDown) {
            gl.bindTexture(gl.TEXTURE_2D, this.textureOn.texture);
        } else {
            gl.bindTexture(gl.TEXTURE_2D, this.textureOff.texture);
        }
        
        const arLocation = ProgramDB.getProgram(this).getUniformLocation("aspectRatio");
        gl.uniform1f(arLocation, window.innerHeight/window.innerWidth);
        
        const samplerLocation = ProgramDB.getProgram(this).getUniformLocation("sampler");
        gl.uniform1i(samplerLocation, 0);
        
        gl.bindVertexArray(this.VAO);
        gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_INT, 0);
    }

}