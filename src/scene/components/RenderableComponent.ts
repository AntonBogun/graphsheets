import { Shader } from "../../shaders/Shader.js";
import { Program } from "../../shaders/Program.js";
import { TransformationMatrix } from "../../geometry/TransformationMatrix.js";
export abstract class RenderableComponent {
    public program: Program;
    
    constructor(program: Program) {
        this.program = program;
    }
    
    abstract render(viewTransform:TransformationMatrix): void;
    
    abstract destroy(): void;
}