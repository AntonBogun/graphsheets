import { SourceFile } from "../files/SourceFile.js";
type WebGLVertexShader = WebGL2RenderingContext['VERTEX_SHADER'];
type WebGLFragmentShader = WebGL2RenderingContext['FRAGMENT_SHADER'];
export type shaderType = WebGLVertexShader | WebGLFragmentShader;
export class Shader{
    source: SourceFile;
    shader: WebGLShader;
    type: shaderType;
    constructor(gl:WebGL2RenderingContext,type: shaderType, source: SourceFile){
        const shader = gl.createShader(type);
        if (!shader) {
            throw new Error(`Failed to create shader of type ${Shader.toShaderTypeString(type)}`);
        }
        this.shader = shader;
        this.type = type;
        this.source = source;
        gl.shaderSource(shader, source.content);
        gl.compileShader(shader);
        if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
            console.error(gl.getShaderInfoLog(shader));
            throw new Error("Shader compile failed");
        }
    }

    static toShaderTypeString(type: shaderType): string {
        switch(type) {
            case WebGL2RenderingContext.VERTEX_SHADER:
                return "VERTEX_SHADER";
            case WebGL2RenderingContext.FRAGMENT_SHADER:
                return "FRAGMENT_SHADER";
            default:
                throw new Error("Unknown shader type: " + type);
        }
    }
}