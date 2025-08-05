import { IRenderable } from "../shaders/IRenderable.js";
import { State } from "../State.js";
import { RenderManager } from "./RenderManager.js";
export class Scene {
    private components: IRenderable<any>[];
    constructor(){
        this.components = [];
    }

    public addComponent(component: IRenderable<any>): void {
        this.components.push(component);
        this.display();
    }

    public removeComponent(component: IRenderable<any>): void {
        let index = this.components.indexOf(component);
        if(index !== -1) {
            this.components.splice(index, 1);
        } else {
            throw new Error("Tried to remove non-existent component from scene.");
        }
        this.display();
    }

    public getComponents(): IRenderable<any>[] {
        return this.components;
    }

    public display(): void {
        State.currentScene = this;
        RenderManager.getRenderManager().clear();
        RenderManager.getRenderManager().add(...this.components);
    }

}