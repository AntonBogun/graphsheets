import { Shader } from "../shaders/Shader.js";
import { SourceFile } from "../files/SourceFile.js";
import { shaderType } from "../shaders/Shader.js";
export class ShaderDB {
    shaders: Map<string, Shader> = new Map();
    gl: WebGL2RenderingContext;
    constructor(gl: WebGL2RenderingContext) {
        this.gl = gl;
    }
    getShader(type: shaderType, source: SourceFile): Shader {
        const key = `${Shader.toShaderTypeString(type)}:${source.filename}`;
        if (this.shaders.has(key)) {
            return this.shaders.get(key)!;
        }
        const shader = new Shader(this.gl, type, source);
        this.shaders.set(key, shader);
        return shader;
    }
    deleteAll(): void {
        this.shaders.forEach((shader) => {
            this.gl.deleteShader(shader.shader);
        });
        this.shaders.clear();
    }
}