import { Camera } from "./scene/Camera.js";
import { Scene } from "./scene/Scene.js";
export class State {
    static currentCamera: Camera|null;
    static currentGraphicsContext: WebGL2RenderingContext|null;
    static currentScene: Scene|null;
}