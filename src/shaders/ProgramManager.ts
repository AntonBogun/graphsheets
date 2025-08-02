import { IRenderable } from "./IRenderable.js";
import { Program } from "./Program.js";
import { ProgramDB } from "./ProgramDB.js";
import { ProgramTypes, getSourceFiles } from "./ProgramType.js";
export class ProgramManager {
    static loadPrograms(): Promise<void[]> {
        const promises: Promise<void>[] = [];
        for (const type of ProgramTypes) {
            const [vertexShaderPath, fragmentShaderPath] = getSourceFiles(type);
            promises.push(
                Program.loadProgram(vertexShaderPath, fragmentShaderPath).then(program => {
                    ProgramDB.getProgramDB().registerProgram(type, program);
                })
            );
        }
        return Promise.all(promises);
    }
}