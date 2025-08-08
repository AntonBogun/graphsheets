import { IKeyHandler } from "./IKeyHandler.js";
import { TextureDB } from "../../shaders/TextureDB.js";
import { Texture } from "../../shaders/Texture.js";
import { State } from "../../State.js";
import { SpriteComponent } from "../components/SpriteComponent.js";
import { IMouseHandler } from "./IMouseHandler.js";
import { IRenderable } from "../../shaders/IRenderable.js";
import { IMovable } from "./IMovable.js";
import { Vec2d } from "../../geometry/Vec2d.js";
import { IO } from "../../files/io.js";
export class KeyMouseClipboardHandler implements IKeyHandler, IMouseHandler {

    isPlacing: boolean;
    componentToPlace: IMovable&IRenderable<any>|null;
    constructor() {
        this.isPlacing = false;
        this.componentToPlace = null;
    }

    processMouseDown(event: MouseEvent, ...args: any[]) {
        if (this.isPlacing && this.componentToPlace) {
            const worldPos = State.currentCamera?.mouseToWorld(new Vec2d(event.pageX, event.pageY, "mouse"))!;
            this.componentToPlace.setPosition(worldPos);
            State.currentScene?.addComponent(this.componentToPlace);
            this.isPlacing = false;
            this.componentToPlace = null;
        }
    }

    processMouseMove(event: MouseEvent, ...args: any[]) {}

    processMouseUp(event: MouseEvent, ...args: any[]) {}

    processKeyDown(event: KeyboardEvent): void {
        if (event.key === "o" && (event.ctrlKey || event.metaKey)) {
            event.preventDefault();
            IO.load().catch((error) => {
                console.error("Failed to load scene:", error);
            });
        }

        if (event.key === "s" && (event.ctrlKey || event.metaKey)) {
            event.preventDefault();
            IO.save();
        }

        if (event.key === "v" && (event.ctrlKey || event.metaKey)) {
            navigator.permissions.query({ name: "clipboard-read" as PermissionName}).then(permissionStatus => {
                if (permissionStatus.state === "granted" || permissionStatus.state === "prompt") {
                    navigator.clipboard.read().then( (items) => {
                        for(const item of items){
                            if (!item.types.includes("image/png")) continue;
                            item.getType("image/png").then(blob => {
                                Texture.loadTexture(URL.createObjectURL(blob)).then((texture) => {
                                    let spriteComponent = new SpriteComponent(texture, new Vec2d(0, 0, "world"), new Vec2d(texture.image.width, texture.image.height, "world"));
                                    this.isPlacing = true;
                                    this.componentToPlace = spriteComponent;
                                });
                            });
                        }
                    });


                }
            });
        }
    }


    processKeyUp(event: KeyboardEvent): void {}

    clean(): void {}
}