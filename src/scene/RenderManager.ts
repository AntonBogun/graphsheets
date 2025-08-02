import { IRenderable } from "../shaders/IRenderable.js";
import { Program } from "../shaders/Program.js";
import { TransformationMatrix } from "../geometry/TransformationMatrix.js";
import { State } from "../State.js";
import { ProgramTypeAssociation, ProgramTypes } from "../shaders/ProgramType.js";
import { ProgramDB } from "../shaders/ProgramDB.js";
export class RenderManager {
    private components: IRenderable<any>[];
    private static renderManager: RenderManager|null;
    private constructor() {
        this.components = [];
    }

    static getRenderManager(): RenderManager {
        if(!this.renderManager) {
            this.renderManager = new RenderManager();
        }
        return this.renderManager;
    }

    public add(...object: IRenderable<any>[]): void {
        this.components.push(...object);
    }

    public remove(object: IRenderable<any>){
        // this.components = this.components.filter(component => component !== object);
        const index = this.components.findIndex(component => component === object);
        if (index !== -1) {
            this.components.splice(index, 1);
            return true;
        }
        return false;
    }

    public clear(): void {
        this.components = [];
    }

    public render(): void {
        const gl = State.currentGraphicsContext!;
        const transform = State.currentCamera!.getTransformationMatrix().transpose();
        for (const component of this.components) {
            ProgramDB.getProgram(component).use();
            component.render(transform);
        }
    }

    public getCount(): number {
        return this.components.length;
    }

    // Batch operations for performance
    public renderByProgram(): void {
        for (const type of ProgramTypes) {
            this.renderByType(type);
        }
    }

    public renderByType(type: ProgramTypeAssociation): void {
        const gl = State.currentGraphicsContext!;
        const transform = State.currentCamera!.getTransformationMatrix().transpose();
        const program = ProgramDB.getProgramDB().getProgram(type);
        program.use();
        for (const component of this.components) {
            if (component.renderingType === type) {
                component.render(transform);
            }
        }
    }

    // Debug methods
    public logItems(): void {
        console.log(`RenderQueue (${this.components.length} components):`);
        for (let i = 0; i < this.components.length; i++) {
            const component = this.components[i];
            // console.log(`  [${i}] z:${component.zIndex} enabled:${component.enabled} type:${component.object.constructor.name}`);
            console.log(`  [${i}] type:${component.constructor.name}`);
        }
    }
}