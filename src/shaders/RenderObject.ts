import { Shader } from "../shaders/Shader.js";
import { Program } from "../shaders/Program.js";
export abstract class RenderObject<Impl extends RenderObject<Impl>>{
    public program:Program;
    renderer: (instance: Impl, gl: WebGLRenderingContext) => void;
    constructor(program: Program, renderer: (instance: Impl, gl: WebGLRenderingContext) => void) {
        this.program = program;
        this.renderer = renderer;
    }
    draw(gl: WebGLRenderingContext) {
        this.program.use();
        this.renderer(this as unknown as Impl, gl);
    }
}