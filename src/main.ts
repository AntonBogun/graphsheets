"use strict";
import { IO } from "./files/io.js";
import { ShaderDB } from "./shaders/ShaderDB.js";
import { ProgramDB } from "./shaders/ProgramDB.js";
import { Camera } from "./scene/Camera.js";
window.onload = () => {
Promise.all([IO.openFile("src/shaders/sources/vert.glsl"), IO.openFile("src/shaders/sources/frag.glsl"), IO.openImage("mandelbrot_set.jpg")]).then(([vertexShaderSource, fragmentShaderSource, mandelbrot]) => {
    
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
    let print_= new PrintWithRateLimit(250);

    const canvas = document.getElementById('glCanvas') as HTMLCanvasElement;
    const gl = canvas.getContext('webgl2')!;
    if (!gl) throw new Error('WebGL not supported');
    
    const shaderDB = new ShaderDB(gl);
    const programDB = new ProgramDB(gl, shaderDB);
    
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    gl.viewport(0, 0, window.innerWidth, window.innerHeight);

    window.onresize = () => {
        requestAnimationFrame(redraw);
    };

    // Camera setup
    const cam = new Camera();

    function redraw(): void {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        gl.viewport(0, 0, window.innerWidth, window.innerHeight);

        const transformLocation = program.getUniformLocation("transform");
        gl.uniformMatrix4fv(transformLocation, false, cam.getTransformationMatrix().transpose().matrix);

        print_.print(`Matrix:\n${printMatrix(cam.getTransformationMatrix().matrix)}`);
        print_.printChained(`vertexShaderSource:\n${vertexShaderSource.content}`);

        gl.clearColor(1.0, 1.0, 1.0, 1.0);
        gl.clear(gl.COLOR_BUFFER_BIT);
        gl.drawElements(gl.TRIANGLES, indices.length, gl.UNSIGNED_INT, 0);
        requestAnimationFrame(redraw);
    }
    
    const program = programDB.getProgram(vertexShaderSource, fragmentShaderSource);
    program.use();


    const vertices = new Float32Array([
        0, 0, 0, 0,
        0, 1, 0, 1,
        1, 0, 1, 0,
        1, 1, 1, 1
    ]);

    const indices = new Uint32Array([
        0, 1, 3,
        0, 3, 2
    ]);

    const VAO = gl.createVertexArray();

    gl.bindVertexArray(VAO);

    const VBO = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, VBO);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);


    const EBO = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, EBO);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW);

    gl.enableVertexAttribArray(0);
    gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 16, 0);

    gl.enableVertexAttribArray(1);
    gl.vertexAttribPointer(1, 2, gl.FLOAT, false, 16, 8);

    const textureBuffer = gl.createTexture();
    gl.activeTexture(gl.TEXTURE0);

    gl.bindTexture(gl.TEXTURE_2D, textureBuffer);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, mandelbrot);
    
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);

    const samplerLocation = program.getUniformLocation("sampler");
    gl.uniform1i(samplerLocation, 0);

    redraw();
});
}