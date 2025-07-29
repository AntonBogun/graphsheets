"use strict";

//MARK: file classes
class SourceFile {
    constructor(
        public filename: string,
        public content: string
    ){}
}
class TextureFile {
    constructor(
        public filename: string,
        public image: HTMLImageElement
    ){}
}

//MARK: open files and images
let openFile = function(filename: string): Promise<SourceFile> {
    return fetch(filename).then((result) => {
        return result.text().then((result) => {
            return new SourceFile(filename,result);
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

//MARK: vec 2d/3d/4d, box
class Vec2d {
    constructor(
        public x: number,
        public y: number
    ){};
    static mag(v: Vec2d) {
        return Math.hypot(v.x, v.y);
    }
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
    static dot(a: Vec2d, b: Vec2d): number {
        return a.x * b.x + a.y * b.y;
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
    
    static mmul(a: number[], b: Vec3d): Vec3d {
        return new Vec3d(
            a[0] * b.x + a[4] * b.y + a[8] * b.z + a[12],
            a[1] * b.x + a[5] * b.y + a[9] * b.z + a[13],
            a[2] * b.x + a[6] * b.y + a[10] * b.z + a[14]
        );
    }
    static normalize(v: Vec3d): Vec3d {
        const len = Math.hypot(v.x, v.y, v.z);
        return len > 0 ? Vec3d.sdiv(v, len) : new Vec3d(0, 0, 1);
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

//MARK: vector functions
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

function lookAt(eye: Vec3d, target: Vec3d, up: Vec3d): number[] {
    const zAxis = normalize(Vec3d.sub(eye,target));
    const xAxis = normalize(crossProduct(up, zAxis));

    const yAxis = crossProduct(zAxis, xAxis);

    return [
        xAxis.x,  yAxis.x,  zAxis.x,  0,
        xAxis.y,  yAxis.y,  zAxis.y,  0,
        xAxis.z,  yAxis.z,  zAxis.z,  0,
        -dot(xAxis, eye), -dot(yAxis, eye), -dot(zAxis, eye), 1
    ];
}

function inverseLookAt(eye: Vec3d, target: Vec3d, up: Vec3d): number[] {
    const zAxis = normalize(Vec3d.sub(eye, target));
    const xAxis = normalize(crossProduct(up, zAxis));
    const yAxis = crossProduct(zAxis, xAxis);

    return [
        xAxis.x, xAxis.y, xAxis.z, 0,
        yAxis.x, yAxis.y, yAxis.z, 0,
        zAxis.x, zAxis.y, zAxis.z, 0,
        eye.x,   eye.y,   eye.z,   1
    ];
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

function inversePerspective(fov: number, aspectRatio: number, near: number, far: number): GLfloat[] {
    const f = 1.0 / Math.tan(fov / 2);
    const rangeInv = 1 / (near - far);

    const A = f / aspectRatio;
    const B = f;
    const C = (near + far) * rangeInv;
    const D = near * far * rangeInv * 2;
    
    return [
        1/A,   0,    0,    0,
         0,   1/B,    0,    0,
         0,     0,    0,  1/D,
         0,     0,   -1,  C/D
    ];
}

function mouseTo2DPos(): Vec2d {

    return new Vec2d(0, 0);
}

//MARK: !! temp camera
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


let touch_initial_distance = 0;
let touch_initial_position: Vec2d = new Vec2d(0, 0);
let touch_last_position: Vec2d = new Vec2d(0,0);
document.addEventListener("touchstart", (event) => {
    event.preventDefault();
    if(event.touches.length != 2) { 
        touch_initial_distance = 0;
        touch_initial_position = new Vec2d(0, 0);
        touch_last_position = new Vec2d(0,0);
        return;
    }
    let touch0 = new Vec2d(event.touches[0].clientX, event.touches[0].clientY);
    let touch1 = new Vec2d(event.touches[1].clientX, event.touches[1].clientY);
    touch_initial_position = Vec2d.smul(Vec2d.add(touch0, touch1), 0.5);
    touch_initial_distance = Vec2d.mag(Vec2d.sub(touch0, touch1));
    touch_last_position = position;
},
{passive: false});

document.addEventListener("touchmove", (event) => {
    event.preventDefault();
    if(event.touches.length != 2) {
        touch_initial_distance = 0;
        touch_initial_position = new Vec2d(0, 0);
        touch_last_position = new Vec2d(0,0);
        return;
    }
    let touch0 = new Vec2d(event.touches[0].clientX, event.touches[0].clientY);
    let touch1 = new Vec2d(event.touches[1].clientX, event.touches[1].clientY);
    let touch_current_distance = Vec2d.mag(Vec2d.sub(touch0, touch1));
    let touch_current_position = Vec2d.smul(Vec2d.add(touch0, touch1), 0.5);
    z_value = touch_current_distance/touch_initial_distance;
    position = Vec2d.add(touch_last_position, 
                            Vec2d.sub(touch_current_position, touch_initial_position)
                        );

},
{passive: false});

document.addEventListener("touchend", (event) => {
    event.preventDefault();
    if(event.touches.length != 2) {
        touch_initial_distance = 0;
        touch_initial_position = new Vec2d(0, 0);
        touch_last_position = new Vec2d(0,0);
        return;
    }
    let touch0 = new Vec2d(event.touches[0].clientX, event.touches[0].clientY);
    let touch1 = new Vec2d(event.touches[1].clientX, event.touches[1].clientY);
    let touch_current_position = Vec2d.smul(Vec2d.add(touch0, touch1), 0.5);
    position = Vec2d.add(touch_last_position, 
                    Vec2d.sub(touch_current_position, touch_initial_position)
                );
    touch_initial_distance = 0;
    touch_initial_position = new Vec2d(0, 0);
    touch_last_position = new Vec2d(0,0);
},
{passive:false});

document.addEventListener("wheel", (event) => {
        event.preventDefault();
        let mouse_position = new Vec2d(2*(event.clientX - (window.innerWidth / 2)) / window.innerWidth, 
                                        2*((window.innerHeight-event.clientY) - (window.innerHeight / 2)) / window.innerHeight);
        console.log(mouse_position);
        let world_mouse_position = Vec3d.mmul(
            inversePerspective(1.5*Math.PI, window.innerWidth/window.innerHeight, 0.000001, 1000000),
            new Vec3d(mouse_position.x, mouse_position.y, 0)
        );
        world_mouse_position = Vec3d.mmul(
            inverseLookAt(new Vec3d(position.x, position.y, z_value), new Vec3d(position.x, position.y, -1), new Vec3d(0, 1, 0)),
            world_mouse_position
        );
        let delta = Vec2d.dot(new Vec2d(event.deltaX, event.deltaY), new Vec2d(1,1))/(event.ctrlKey?50:100);
        let position_to_mouse = Vec3d.normalize(Vec3d.sub(world_mouse_position, new Vec3d(position.x, position.y, z_value)));
        let xzslope = position_to_mouse.x / position_to_mouse.z;
        let yzslope = position_to_mouse.y / position_to_mouse.z;
        if(z_value * 2**delta > 0.01){
            position.x = position.x + xzslope * ((z_value * 2**delta) - z_value);
            position.y = position.y + yzslope * ((z_value * 2**delta) - z_value);
            z_value *= 2**(delta);
        }
    }
, { passive: false });


//neither geometry nor compute seem to be defined
type WebGLVertexShader = WebGL2RenderingContext['VERTEX_SHADER'];
type WebGLFragmentShader = WebGL2RenderingContext['FRAGMENT_SHADER'];
type shaderType = WebGLVertexShader | WebGLFragmentShader;
function toShaderTypeString(type: shaderType): string {
    switch(type) {
        case WebGL2RenderingContext.VERTEX_SHADER:
            return "VERTEX_SHADER";
        case WebGL2RenderingContext.FRAGMENT_SHADER:
            return "FRAGMENT_SHADER";
        default:
            throw new Error("Unknown shader type: " + type);
    }
}
//MARK: WebGL classes
//compiled
class Shader{
    source: SourceFile;
    shader: WebGLShader;
    type: shaderType;
    constructor(gl:WebGL2RenderingContext,type: shaderType, source: SourceFile){
        const shader = gl.createShader(type);
        if (!shader) {
            throw new Error(`Failed to create shader of type ${toShaderTypeString(type)}`);
        }
        this.shader = shader;
        this.type = type;
        this.source = source;
        gl.shaderSource(shader, source.content);
        gl.compileShader(shader);
        if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
            console.error(gl.getShaderInfoLog(shader));
            throw new Error("Shader compile failed");
        }
    }
}
//shaderdb stores compiled shaders and reuses instead of compiling them again
class ShaderDB {
    shaders: Map<string, Shader> = new Map();
    gl: WebGL2RenderingContext;
    constructor(gl: WebGL2RenderingContext) {
        this.gl = gl;
    }
    getShader(type: shaderType, source: SourceFile): Shader {
        const key = `${toShaderTypeString(type)}:${source.filename}`;
        if (this.shaders.has(key)) {
            return this.shaders.get(key)!;
        }
        const shader = new Shader(this.gl, type, source);
        this.shaders.set(key, shader);
        return shader;
    }
    deleteAll(): void {
        this.shaders.forEach((shader) => {
            this.gl.deleteShader(shader.shader);
        });
        this.shaders.clear();
    }
}
class Program {
    program: WebGLProgram;
    gl: WebGL2RenderingContext;
    vs: Shader;
    fs: Shader;
    constructor(gl: WebGL2RenderingContext, shdb: ShaderDB, vs: SourceFile, fs: SourceFile) {
        this.gl = gl;
        this.vs = shdb.getShader(gl.VERTEX_SHADER, vs);
        this.fs = shdb.getShader(gl.FRAGMENT_SHADER, fs);
        this.program = gl.createProgram();
        if (!this.program) {
            throw new Error("Failed to create program");
        }
        gl.attachShader(this.program, this.vs.shader);
        gl.attachShader(this.program, this.fs.shader);
        gl.linkProgram(this.program);
        if (!gl.getProgramParameter(this.program, gl.LINK_STATUS)) {
            console.error(gl.getProgramInfoLog(this.program));
            throw new Error("Program link failed");
        }
    }
    use(): void {
        this.gl.useProgram(this.program);
    }
    getUniformLocation(name: string): WebGLUniformLocation | null {
        return this.gl.getUniformLocation(this.program, name);
    }
    getAttribLocation(name: string): number {
        const location = this.gl.getAttribLocation(this.program, name);
        if (location === -1) {
            throw new Error(`Attribute ${name} not found in program`);
        }
        return location;
    }
}
class ProgramDB {
    programs: Map<string, Program> = new Map();
    gl: WebGL2RenderingContext;
    shdb: ShaderDB;
    constructor(gl: WebGL2RenderingContext, shdb: ShaderDB) {
        this.gl = gl;
        this.shdb = shdb;
    }
    getProgram(vs: SourceFile, fs: SourceFile): Program {
        const key = `${vs.filename}:${fs.filename}`;
        if (this.programs.has(key)) {
            return this.programs.get(key)!;
        }
        const program = new Program(this.gl, this.shdb, vs, fs);
        this.programs.set(key, program);
        return program;
    }
    deleteAll(): void {
        this.programs.forEach((program) => {
            this.gl.deleteProgram(program.program);
        });
        this.programs.clear();
    }
}




//MARK: main (onload)
window.onload = () => {
Promise.all([openFile("src/vert.glsl"), openFile("src/frag.glsl"), openImage("mandelbrot_set.jpg")]).then(([vertexShaderSource, fragmentShaderSource, mandelbrot]) => {
    
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


    function redraw(): void {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        gl.viewport(0, 0, window.innerWidth, window.innerHeight);

        let eye = new Vec3d(position.x, position.y, z_value);
        let target = new Vec3d(position.x, position.y, -1);
        let up = new Vec3d(0, 1, 0);
        let vMatrix = lookAt(eye, target, up);
        
        const viewLocation = program.getUniformLocation("view");
        gl.uniformMatrix4fv(viewLocation, false, vMatrix);

        let pMatrix = perspective(1.5*Math.PI, window.innerWidth/window.innerHeight, 0.000001, 1000000)
        const perspectiveLocation = program.getUniformLocation("perspective");
        gl.uniformMatrix4fv(perspectiveLocation, false, pMatrix);

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
