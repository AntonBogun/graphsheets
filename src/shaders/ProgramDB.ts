import { Program } from "../shaders/Program.js";
import { ShaderDB } from "../shaders/ShaderDB.js";
import { SourceFile } from "../files/SourceFile.js";
export class ProgramDB {
    programs: Map<string, Program> = new Map();
    gl: WebGL2RenderingContext;
    shdb: ShaderDB;
    constructor(gl: WebGL2RenderingContext, shdb: ShaderDB) {
        this.gl = gl;
        this.shdb = shdb;
    }
    getProgram(vs: SourceFile, fs: SourceFile): Program {
        const key = `${vs.filename}:${fs.filename}`;
        if (this.programs.has(key)) {
            return this.programs.get(key)!;
        }
        const program = new Program(this.gl, this.shdb, vs, fs);
        this.programs.set(key, program);
        return program;
    }
    deleteAll(): void {
        this.programs.forEach((program) => {
            this.gl.deleteProgram(program.program);
        });
        this.programs.clear();
    }
}