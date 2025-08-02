export const ProgramTypes = ["basic"]
export type ProgramTypeAssociation = typeof ProgramTypes[number];
export function getSourceFiles(type: ProgramTypeAssociation): [string, string] {
    switch  (type) {
        case "basic":
            return ["src/shaders/sources/vert.glsl", "src/shaders/sources/frag.glsl"];
        default:
            throw new Error(`No program type ${type} found`);
    }
}