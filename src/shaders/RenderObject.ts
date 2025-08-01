import { Shader } from "../shaders/Shader.js";
import { Program } from "../shaders/Program.js";
import { TransformationMatrix } from "../geometry/TransformationMatrix.js";
export abstract class RenderObject {
    public program: Program;
    
    constructor(program: Program) {
        this.program = program;
    }
    
    abstract render(gl: WebGL2RenderingContext,viewTransform:TransformationMatrix): void;
    
    draw(gl: WebGL2RenderingContext,viewTransform:TransformationMatrix): void {
        this.program.use();
        this.render(gl,viewTransform);
    }
    abstract destroy(gl: WebGL2RenderingContext): void;
}