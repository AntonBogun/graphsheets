import { Camera } from "./scene/Camera.js";
export class State {
    static currentCamera: Camera|null;
    static currentGraphicsContext: WebGL2RenderingContext|null;
    
}