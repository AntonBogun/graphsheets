"use strict";
import { IO } from "./files/io.js";
import { TextureDB } from "./shaders/TextureDB.js";
import { Camera } from "./scene/Camera.js";
import { RenderManager } from "./scene/RenderManager.js";
import { SpriteComponent } from "./scene/components/SpriteComponent.js";
import { Vec2d } from "./geometry/Vec2d.js";
import { State } from "./State.js";
import { Scene } from "./scene/Scene.js";
import { ProgramManager } from "./shaders/ProgramManager.js";
import { UISprite } from "./scene/UI/UISprite.js";
import { InteractionManager } from "./scene/interaction/InteractionManager.js";
import { MouseSelectionHandler } from "./scene/interaction/MouseSelectionHandler.js";
import { Texture } from "./shaders/Texture.js";
import { UIRadioGroup } from "./scene/UI/UIRadioGroup.js";
import { UIRadioButton } from "./scene/UI/UIRadioButton.js";
import { MouseClickHandler } from "./scene/interaction/MouseClickHandler.js";
window.onload = () => {
const canvas = document.getElementById('glCanvas') as HTMLCanvasElement;
const gl = canvas.getContext('webgl2')!;
if (!gl) throw new Error('WebGL not supported');
State.currentGraphicsContext = gl;

Promise.all([ProgramManager.loadPrograms(), IO.openImage("mandelbrot_set.jpg"), IO.openImage("julia.png")]).then(([_, mandelbrot, julia]) => {

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    gl.viewport(0, 0, window.innerWidth, window.innerHeight);

    function redraw(): void {
        // console.log(cam.getTransformationMatrix().mul(cam.getInverseTransformationMatrix()));
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        gl.viewport(0, 0, window.innerWidth, window.innerHeight);

        gl.clearColor(63.0/255.0, 63.0/255.0, 63.0/255.0, 1.0);
        gl.clear(gl.COLOR_BUFFER_BIT);

        RenderManager.getRenderManager().renderByProgram();

        // gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_INT, 0);

        requestAnimationFrame(redraw);
    }

    const cam = new Camera();
    const scene = new Scene([]);
    const mand = TextureDB.getTextureDB().getTexture(mandelbrot);
    const jul = TextureDB.getTextureDB().getTexture(julia);
    const sprite1 = new SpriteComponent(mand);
    const sprite2 = new SpriteComponent(mand, new Vec2d(0.5, 0.5, "world"), new Vec2d(0.5, 0.5, "world"));
    const radioCollection = new UIRadioGroup();
    const radio1 = new UIRadioButton(mand, jul, radioCollection, new Vec2d(-1,-1, "world"), new Vec2d(0.5,0.5, "world"));
    const radio2 = new UIRadioButton(mand, jul, radioCollection, new Vec2d(-0.5,-1, "world"), new Vec2d(0.5,0.5, "world"));
    const radio3 = new UIRadioButton(mand, jul, radioCollection, new Vec2d(0,-1, "world"), new Vec2d(0.5,0.5, "world"));
    radio1.registerClickCallback( () => {
        InteractionManager.getInstance().changeInterationType("default");
    });

    radio2.registerClickCallback( () => {
        InteractionManager.getInstance().changeInterationType("move");
    });

    radio1.processPress();

    scene.addComponent(sprite1);
    scene.addComponent(sprite2);
    scene.addComponent(radio1);
    scene.addComponent(radio2);
    scene.addComponent(radio3);
    scene.display();

    redraw();
});
}