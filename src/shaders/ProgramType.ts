export const ProgramTypes = ["basic", "basic_selectable"]
export type ProgramTypeAssociation = typeof ProgramTypes[number];
export function getSourceFiles(type: ProgramTypeAssociation): [string, string] {
    switch  (type) {
        case "basic":
            return ["src/shaders/sources/vert.glsl", "src/shaders/sources/frag.glsl"];
        case "basic_selectable":
            return ["src/shaders/sources/vertSelectable.glsl", "src/shaders/sources/fragSelectable.glsl"];
        default:
            throw new Error(`No program type ${type} found`);
    }
}