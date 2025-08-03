import { ShaderDB } from "../shaders/ShaderDB.js";
import { Shader, shaderType } from "../shaders/shader.js";
import { State } from "../State.js";
export class Program {
    program: WebGLProgram;
    vertexShader: Shader;
    fragmentShader: Shader;

    constructor(program: WebGLProgram, vertexShader: Shader, fragmentShader: Shader) {
        this.program = program;
        this.vertexShader = vertexShader;
        this.fragmentShader = fragmentShader;
    }

    static loadProgram(vertexShaderPath: string, fragmentShaderPath: string): Promise<Program> {
        const gl = State.currentGraphicsContext!;
        let vertexShader = Shader.loadShader(gl.VERTEX_SHADER, vertexShaderPath);
        let fragmentShader = Shader.loadShader(gl.FRAGMENT_SHADER, fragmentShaderPath);//("FRAGMENT_SHADER", fragmentShaderPath);
        return Promise.all([vertexShader, fragmentShader]).then(([vertexShader, fragmentShader]) => {
            let program = gl.createProgram();
            gl.attachShader(program, vertexShader.shader);
            gl.attachShader(program, fragmentShader.shader);
            gl.linkProgram(program);
            return new Program(program, vertexShader, fragmentShader);
        });

    }

    use(): void {
        State.currentGraphicsContext!.useProgram(this.program);
    }

    getUniformLocation(name: string): WebGLUniformLocation | null {
        return State.currentGraphicsContext!.getUniformLocation(this.program, name);
    }

    getAttribLocation(name: string): number {
        const location = State.currentGraphicsContext!.getAttribLocation(this.program, name);
        if (location === -1) {
            throw new Error(`Attribute ${name} not found in program`);
        }
        return location;
    }
}