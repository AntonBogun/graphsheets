import { Shader } from "./shader.js";
import { ProgramTypeAssociation } from "./ProgramType.js";
export class ShaderDB {
    shaders: Map<string, Shader> = new Map();

    private static shaderDB: ShaderDB;
    static getShaderDB() {
        if (!ShaderDB.shaderDB) ShaderDB.shaderDB = new ShaderDB();
        return ShaderDB.shaderDB;
    }

    registerShader(path: string, shader: Shader) {
        this.shaders.set(path, shader);
    }

    getShader(filename: string) {
        if (!this.shaders.has(filename)) {
            return null;
        }
        return this.shaders.get(filename)!;
    }

}