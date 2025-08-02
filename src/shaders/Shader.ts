import { State } from "../State.js";
import { ShaderDB } from "./ShaderDB.js";
type WebGLVertexShader = WebGL2RenderingContext['VERTEX_SHADER'];
type WebGLFragmentShader = WebGL2RenderingContext['FRAGMENT_SHADER'];
export type shaderType = WebGLVertexShader | WebGLFragmentShader;
export class Shader{
    shader: WebGLShader;
    static loadShader(type: shaderType, path: string): Promise<Shader> {
        const gl = State.currentGraphicsContext!;
        const shaderCode = "";
        if(ShaderDB.getShaderDB().getShader(path)){
            return Promise.resolve(ShaderDB.getShaderDB().getShader(path)!);
        }
        return fetch(path).then(response => {
                if (!response.ok) {
                    throw new Error(`Failed to load shader from ${path}`);
                }
                return response.text();
            })
            .then(code => {
                const gl = State.currentGraphicsContext!;
                const shader = gl.createShader(type);
                if (!shader) {
                    throw new Error(`Failed to create shader`);
                }
                gl.shaderSource(shader, code);
                gl.compileShader(shader);
                if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
                    console.error(gl.getShaderInfoLog(shader));
                    throw new Error("Shader compile failed");
                }
                let S = new Shader(shader);
                ShaderDB.getShaderDB().registerShader(path, S);
                return S;
            });
    }

    constructor(shader: WebGLShader){
        this.shader = shader;
    }
}