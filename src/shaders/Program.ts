import { ShaderDB } from "../shaders/ShaderDB.js";
import { SourceFile } from "../files/SourceFile.js";
import { Shader, shaderType } from "../shaders/Shader.js";
export class Program {
    program: WebGLProgram;
    gl: WebGL2RenderingContext;
    vs: Shader;
    fs: Shader;
    constructor(gl: WebGL2RenderingContext, shdb: ShaderDB, vs: SourceFile, fs: SourceFile) {
        this.gl = gl;
        this.vs = shdb.getShader(gl.VERTEX_SHADER, vs);
        this.fs = shdb.getShader(gl.FRAGMENT_SHADER, fs);
        this.program = gl.createProgram();
        if (!this.program) {
            throw new Error("Failed to create program");
        }
        gl.attachShader(this.program, this.vs.shader);
        gl.attachShader(this.program, this.fs.shader);
        gl.linkProgram(this.program);
        if (!gl.getProgramParameter(this.program, gl.LINK_STATUS)) {
            console.error(gl.getProgramInfoLog(this.program));
            throw new Error("Program link failed");
        }
    }
    use(): void {
        this.gl.useProgram(this.program);
    }
    getUniformLocation(name: string): WebGLUniformLocation | null {
        return this.gl.getUniformLocation(this.program, name);
    }
    getAttribLocation(name: string): number {
        const location = this.gl.getAttribLocation(this.program, name);
        if (location === -1) {
            throw new Error(`Attribute ${name} not found in program`);
        }
        return location;
    }
}