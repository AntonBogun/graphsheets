import { RenderableComponent } from "./components/RenderableComponent.js";
import { Program } from "../shaders/Program.js";
import { TransformationMatrix } from "../geometry/TransformationMatrix.js";
import { State } from "../State.js";
export class RenderManager {
    private components: RenderableComponent[];
    private currentProgram: Program | null;
    private static renderManager: RenderManager|null;
    private constructor() {
        this.currentProgram = null;
        this.components = [];
    }

    static getRenderManager(): RenderManager {
        if(!this.renderManager) {
            this.renderManager = new RenderManager();
        }
        return this.renderManager;
    }

    public useComponentProgram(component: RenderableComponent): void {
        if (this.currentProgram !== component.program) {
            this.currentProgram = component.program;
            this.currentProgram.use();
        }
    }

    public add(...object: RenderableComponent[]): void {
        this.components.push(...object);
    }

    public remove(object: RenderableComponent){
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
            this.useComponentProgram(component);
            component.render(transform);
        }
    }

    public getCount(): number {
        return this.components.length;
    }

    // Batch operations for performance
    public renderByProgram(): void {
        // this.sortItems();
        const gl = State.currentGraphicsContext!;
        const transform = State.currentCamera!.getTransformationMatrix().transpose();
        
        // Group by program to minimize state changes
        const programGroups = new Map<Program, RenderableComponent[]>();
        
        for (const component of this.components) {
            const program = component.program;
            if (!programGroups.has(program)) {
                programGroups.set(program, []);
            }
            programGroups.get(program)!.push(component);
        }

        // Render each program group
        for (const [program, components] of programGroups) {
            program.use();
            
            for (const component of components) {
                // Call render directly to avoid redundant program.use() calls
                component.render(transform);
            }
        }
        this.currentProgram = null; // Reset current program after rendering
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