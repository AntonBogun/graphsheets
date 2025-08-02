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
window.onload = () => {
const canvas = document.getElementById('glCanvas') as HTMLCanvasElement;
const gl = canvas.getContext('webgl2')!;
if (!gl) throw new Error('WebGL not supported');
State.currentGraphicsContext = gl;

Promise.all([ProgramManager.loadPrograms(), IO.openImage("mandelbrot_set.jpg")]).then(([_, mandelbrot]) => {
    
    function printMatrix(m: number[]|Float32Array): string {
        let str = '';
        for (let i = 0; i < 4; i++) {
            for (let j = 0; j < 4; j++) {
                str += m[i * 4 + j].toFixed(3) + ' ';
            }
            if (i < 3) {
                str += '\n';
            }
        }
        return str;
    }
    
    class PrintWithRateLimit {
        private rate: number;
        private lastTime: number;
        private chained: boolean;
    
        constructor(rate: number) {
            this.rate = rate;
            this.lastTime = 0;
            this.chained = false;
        }
    
        print(message: string): void {
            const now = Date.now();
            if (now - this.lastTime >= this.rate) {
                console.log(message);
                this.lastTime = now;
                this.chained = true;
            } else {
                this.chained = false;
            }
        }
    
        printChained(message: string): void {
            if (this.chained) {
                console.log(message);
            }
        }
    }
    class FPSLog{
        private lastTime: number;
        private frameCount: number;
        private fps: number;

        constructor() {
            this.lastTime = Date.now();
            this.frameCount = 0;
            this.fps = 0;
        }

        update(): void {
            this.frameCount++;
            const now = Date.now();
            if (now - this.lastTime >= 1000) {
                this.fps = this.frameCount;
                this.frameCount = 0;
                this.lastTime = now;
                console.log(`FPS: ${this.fps}`);
            }
        }
    }
    let print_ = new PrintWithRateLimit(250);
    let fpsLog = new FPSLog();
    
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    gl.viewport(0, 0, window.innerWidth, window.innerHeight);

    window.onresize = () => {
        requestAnimationFrame(redraw);
    };

    // Camera setup
    const cam = new Camera();
    State.currentCamera = cam;

    function redraw(): void {
        // console.log(cam.getTransformationMatrix().mul(cam.getInverseTransformationMatrix()));
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        gl.viewport(0, 0, window.innerWidth, window.innerHeight);

        gl.clearColor(1.0, 1.0, 1.0, 1.0);
        gl.clear(gl.COLOR_BUFFER_BIT);

        RenderManager.getRenderManager().renderByProgram();

        // gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_INT, 0);

        requestAnimationFrame(redraw);
        fpsLog.update();
    }
    
    const texture = TextureDB.getTextureDB().getTexture(mandelbrot);
    const scene = new Scene([]);
    const sprite1 = new SpriteComponent(texture);
    const sprite2 = new SpriteComponent(texture, new Vec2d(0.5, 0.5), new Vec2d(0.5, 0.5));
    scene.addComponent(sprite1);
    scene.addComponent(sprite2);
    scene.display();

    redraw();
});
}