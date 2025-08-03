import { TransformationMatrix } from "../geometry/TransformationMatrix.js";
import { ProgramTypeAssociation } from "./ProgramType.js";
import { Box } from "../geometry/Box.js";
export interface IRenderable<T extends ProgramTypeAssociation> {
    renderingType: T;
    render(viewTransform: TransformationMatrix): void;
}