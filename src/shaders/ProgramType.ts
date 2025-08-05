export const ProgramTypes = ["basic", "basic_selectable", "interface", "selection"]
export type ProgramTypeAssociation = typeof ProgramTypes[number];
export function getSourceFiles(type: ProgramTypeAssociation): [string, string] {
    switch  (type) {
        case "basic":
            return ["src/shaders/sources/vert.glsl", "src/shaders/sources/frag.glsl"];
        case "basic_selectable":
            return ["src/shaders/sources/vertSelectable.glsl", "src/shaders/sources/fragSelectable.glsl"];
        case "interface":
            return ["src/shaders/sources/vertInterface.glsl", "src/shaders/sources/fragInterface.glsl"];
        case "selection":
            return ["src/shaders/sources/vertSelection.glsl", "src/shaders/sources/fragSelection.glsl"];
        default:
            throw new Error(`No program type ${type} found`);
    }
}