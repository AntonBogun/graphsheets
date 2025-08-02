import { Program } from "../shaders/Program.js";
import { IRenderable } from "./IRenderable.js";
import { ProgramTypeAssociation  } from "./ProgramType.js";
export class ProgramDB {
    private programs: Map<ProgramTypeAssociation, Program> = new Map();
    private static programDB: ProgramDB;

    static getProgramDB() {
        if(!ProgramDB.programDB) ProgramDB.programDB = new ProgramDB();
        return ProgramDB.programDB;
    }

    registerProgram(renderingType: ProgramTypeAssociation, program: Program) {
        this.programs.set(renderingType, program);
    }

    getProgram(renderingType: ProgramTypeAssociation): Program {
        if(!this.programs.has(renderingType)){
            throw new Error(`Rendering program ${renderingType} does not exist!`);
        }
        return this.programs.get(renderingType)!;
    }

    public static getProgram<T extends IRenderable<U>, U extends ProgramTypeAssociation>(component: T) {
        return ProgramDB.getProgramDB().getProgram(component.renderingType);
    }

}