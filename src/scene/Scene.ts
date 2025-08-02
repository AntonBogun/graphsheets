import { IRenderable } from "../shaders/IRenderable.js";
import { State } from "../State.js";
import { RenderManager } from "./RenderManager.js";
export class Scene {
    private components: IRenderable<any>[];
    constructor(components: IRenderable<any>[]){
        this.components = components;
    }

    public addComponent(component: IRenderable<any>): void {
        this.components.push(component);
    }

    public getComponents(): IRenderable<any>[] {
        return this.components;
    }

    public display(): void {
        RenderManager.getRenderManager().clear();
        RenderManager.getRenderManager().add(...this.components);
    }

}