import { RenderableComponent } from "./components/RenderableComponent";
import { State } from "../State.js";
import { RenderManager } from "./RenderManager.js";
export class Scene {
    private components: RenderableComponent[];
    constructor(components: RenderableComponent[]){
        this.components = components;
    }

    public addComponent(component: RenderableComponent): void {
        this.components.push(component);
    }

    public getComponents(): RenderableComponent[] {
        return this.components;
    }

    public display(): void {
        RenderManager.getRenderManager().clear();
        RenderManager.getRenderManager().add(...this.components);
    }

}