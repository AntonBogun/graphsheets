"use strict";

let openFile = function(filename: string): Promise<string> {
    return fetch(filename).then((result) => {
        return result.text().then((result) => {
            return result;
        });
    });
}

let openImage = function(filename: string): Promise<HTMLImageElement> {
     return new Promise((resolve, reject) => {
        let img = new Image();
        img.onload = () => {
            resolve(img);
        }
        img.onerror = (x) => {
            reject(new Error(x.toString()));
        }
        img.src = filename;
    });
}

class Vec2d {
    constructor(
        public x: number,
        public y: number
    ){};
    static smul(v: Vec2d, num: number): Vec2d {
        return new Vec2d(v.x * num, v.y * num);
    }
    static add(a: Vec2d, b: Vec2d): Vec2d {
        return new Vec2d(a.x + b.x, a.y + b.y);
    }
    static sub(a: Vec2d, b: Vec2d): Vec2d {
        return new Vec2d(a.x - b.x, a.y - b.y);
    }
    static emul(a: Vec2d, b: Vec2d): Vec2d {
        return new Vec2d(a.x * b.x, a.y * b.y);
    }
}
class Vec3d {
    constructor(
        public x: number,
        public y: number,
        public z: number
    ){};
    static sdiv(v: Vec3d, num: number): Vec3d {
        return new Vec3d(v.x / num, v.y / num, v.z / num);
    }
    static sub(a: Vec3d, b: Vec3d): Vec3d {
        return new Vec3d(a.x - b.x, a.y - b.y, a.z - b.z);
    }
}
class Vec4d {
    constructor(
        public x: number,
        public y: number,
        public z: number,
        public w: number
    ){};
}
interface Box {
    x: number;
    y: number;
    width: number;
    height: number;
}

function crossProduct(a: Vec3d, b: Vec3d): Vec3d {
    return new Vec3d(
        a.y * b.z - a.z * b.y,
        a.z * b.x - a.x * b.z,
        a.x * b.y - a.y * b.x
    );
}

function normalize(v: Vec3d): Vec3d {
    const len = Math.hypot(v.x, v.y, v.z);
    return len > 0 ? Vec3d.sdiv(v,len) : new Vec3d(0, 0, 1);
}

function dot(a: Vec3d, b: Vec3d): number {
    return a.x*b.x + a.y*b.y + a.z*b.z;
}

function lookAt(eye: Vec3d, target: Vec3d, up: Vec3d): Float32Array {
    const zAxis = normalize(Vec3d.sub(eye,target));
    const xAxis = normalize(crossProduct(up, zAxis));

    const yAxis = crossProduct(zAxis, xAxis);

    return new Float32Array([
        xAxis.x,  yAxis.x,  zAxis.x,  0,
        xAxis.y,  yAxis.y,  zAxis.y,  0,
        xAxis.z,  yAxis.z,  zAxis.z,  0,
        -dot(xAxis, eye), -dot(yAxis, eye), -dot(zAxis, eye), 1
    ]);
}

function perspective(fov: number, aspectRatio: number, near: number, far: number): GLfloat[] {

  const f = 1.0 / Math.tan(fov / 2);
  const rangeInv = 1 / (near - far);

  return [
    f / aspectRatio, 0, 0, 0,
    0, f, 0, 0,
    0, 0, (near + far) * rangeInv, -1,
    0, 0, near * far * rangeInv * 2, 0,
  ];
}

let z_value = 1.0;
let last_position: Vec2d = new Vec2d(0,0);
let position: Vec2d = new Vec2d(0,0);
let initial_position: Vec2d = new Vec2d(0,0);
let is_dragging = false;
document.onmousedown = (event) => {
    is_dragging = true;
    const e_pos = new Vec2d(event.pageX, -event.pageY);
    initial_position = e_pos;
    last_position = position;
}

document.onmousemove = (event) => {
    if(!is_dragging) return;
    const e_pos = new Vec2d(event.pageX, -event.pageY);
    position = Vec2d.add(last_position, 
        Vec2d.smul(
            Vec2d.sub(e_pos, initial_position),
            z_value*2 / window.innerHeight
        )
    );
}

document.onmouseup = (event) => {
    const e_pos = new Vec2d(event.pageX, -event.pageY);
    position = Vec2d.add(last_position, 
        Vec2d.smul(
            Vec2d.sub(e_pos, initial_position),
            z_value*2 / window.innerHeight
        )
    );
    is_dragging = false;
}

document.onkeydown = (event) => {
    if(event.key == "+") {
        z_value /= 2;
    } else if(event.key == "-") {
        z_value *= 2;
    }
}

window.onload = () => {
Promise.all([openFile("src/vert.glsl"), openFile("src/frag.glsl"), openImage("mandelbrot_set.jpg")]).then(([vertexShaderSource, fragmentShaderSource, mandelbrot]) => {
    
    const canvas = document.getElementById('glCanvas') as HTMLCanvasElement;
    const gl = canvas.getContext('webgl2')!;
    if (!gl) throw new Error('WebGL not supported');
    
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    gl.viewport(0, 0, window.innerWidth, window.innerHeight);

    window.onresize = () => {
        requestAnimationFrame(redraw);
    };


    function redraw(): void {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        gl.viewport(0, 0, window.innerWidth, window.innerHeight);

        let eye = new Vec3d(position.x, position.y, z_value);
        let target = new Vec3d(position.x, position.y, -1);
        let up = new Vec3d(0, 1, 0);
        let vMatrix = lookAt(eye, target, up);
        
        const viewLocation = gl.getUniformLocation(program, "view");
        gl.uniformMatrix4fv(viewLocation, false, vMatrix);

        let pMatrix = perspective(1.5*Math.PI, window.innerWidth/window.innerHeight, 0.000001, 1000000)
        const perspectiveLocation = gl.getUniformLocation(program, "perspective");
        gl.uniformMatrix4fv(perspectiveLocation, false, pMatrix);

        gl.clearColor(1.0, 1.0, 1.0, 1.0);
        gl.clear(gl.COLOR_BUFFER_BIT);
        gl.drawElements(gl.TRIANGLES, indices.length, gl.UNSIGNED_INT, 0);
        requestAnimationFrame(redraw);
    }
    
    let program = gl.createProgram();

    let vertexShader = gl.createShader(gl.VERTEX_SHADER)!;
    gl.shaderSource(vertexShader, vertexShaderSource);
    gl.compileShader(vertexShader);
    if(!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)) console.log(gl.getShaderInfoLog(vertexShader));
    
    let fragmentShader = gl.createShader(gl.FRAGMENT_SHADER)!;
    gl.shaderSource(fragmentShader, fragmentShaderSource);
    gl.compileShader(fragmentShader);
    if(!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS)) console.log(gl.getShaderInfoLog(fragmentShader));

    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);

    gl.linkProgram(program);
    gl.useProgram(program);

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

    const samplerLocation = gl.getUniformLocation(program, "sampler");
    gl.uniform1i(samplerLocation, 0);

    redraw();
});
}
