import { RenderObject } from "./RenderObject.js";
import { Program } from "../shaders/Program.js";
import { TransformationMatrix } from "../geometry/TransformationMatrix.js";

export interface RenderItem {
    object: RenderObject;
    // zIndex: number;
    enabled: boolean;
}

export class RenderQueue {
    private items: RenderItem[];
    // private needsSort: boolean;

    constructor() {
        this.items = [];
        // this.needsSort = false;
    }

    public add(object: RenderObject, zIndex: number = 0): void {
        this.items.push({
            object: object,
            // zIndex: zIndex,
            enabled: true
        });
        // this.needsSort = true;
    }

    public remove(object: RenderObject): boolean {
        const index = this.items.findIndex(item => item.object === object);
        if (index !== -1) {
            this.items.splice(index, 1);
            return true;
        }
        return false;
    }

    // public setZIndex(object: RenderObject, zIndex: number): boolean {
    //     const item = this.items.find(item => item.object === object);
    //     if (item) {
    //         item.zIndex = zIndex;
    //         this.needsSort = true;
    //         return true;
    //     }
    //     return false;
    // }

    public setEnabled(object: RenderObject, enabled: boolean): boolean {
        const item = this.items.find(item => item.object === object);
        if (item) {
            item.enabled = enabled;
            return true;
        }
        return false;
    }

    public clear(): void {
        this.items = [];
        // this.needsSort = false;
    }

    // private sortItems(): void {
    //     if (!this.needsSort) return;
        
    //     // Sort by zIndex (lower = rendered first = behind)
    //     this.items.sort((a, b) => a.zIndex - b.zIndex);
    //     this.needsSort = false;
    // }

    public render(gl: WebGL2RenderingContext, viewTransform: TransformationMatrix): void {
        // this.sortItems();
        
        for (const item of this.items) {
            if (item.enabled) {
                item.object.draw(gl, viewTransform);
            }
        }
    }

    public getCount(): number {
        return this.items.length;
    }

    public getEnabledCount(): number {
        return this.items.filter(item => item.enabled).length;
    }

    // Batch operations for performance
    public renderByProgram(gl: WebGL2RenderingContext,viewTransform: TransformationMatrix): void {
        // this.sortItems();
        
        // Group by program to minimize state changes
        const programGroups = new Map<Program, RenderItem[]>();
        
        for (const item of this.items) {
            if (!item.enabled) continue;
            
            const program = item.object.program;
            if (!programGroups.has(program)) {
                programGroups.set(program, []);
            }
            programGroups.get(program)!.push(item);
        }

        // Render each program group
        for (const [program, items] of programGroups) {
            program.use();
            
            for (const item of items) {
                // Call render directly to avoid redundant program.use() calls
                item.object.render(gl, viewTransform);
            }
        }
    }

    // Debug methods
    public logItems(): void {
        console.log(`RenderQueue (${this.items.length} items):`);
        for (let i = 0; i < this.items.length; i++) {
            const item = this.items[i];
            // console.log(`  [${i}] z:${item.zIndex} enabled:${item.enabled} type:${item.object.constructor.name}`);
            console.log(`  [${i}] enabled:${item.enabled} type:${item.object.constructor.name}`);
        }
    }
}