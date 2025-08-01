import { Shader } from "../shaders/Shader.js";
import { Program } from "../shaders/Program.js";
export abstract class RenderObject {
    public program: Program;
    
    constructor(program: Program) {
        this.program = program;
    }
    
    abstract render(gl: WebGLRenderingContext): void;
    
    draw(gl: WebGLRenderingContext) {
        this.program.use();
        this.render(gl);
    }
}