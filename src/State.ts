import { Camera } from "./scene/Camera.js";
import { ISelectable } from "./scene/interaction/ISelectable.js";
import { Scene } from "./scene/Scene.js";
import { InteractionType } from "./scene/interaction/InteractionManager.js";
export class State {
    static currentCamera: Camera|null;
    static currentGraphicsContext: WebGL2RenderingContext|null;
    static currentScene: Scene|null;
    static selectedComponents: ISelectable[] = [];
}