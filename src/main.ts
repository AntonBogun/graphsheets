"use strict";


interface Box {
    x: number;
    y: number;
    width: number;
    height: number;
}


//ANCHOR File I/O
// #region File I/O
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
class IO {
    static openFile(filename: string): Promise<SourceFile> {
 
        return fetch(filename).then((result) => {
            return result.text().then((result) => {
                return new SourceFile(filename,result);
            });
        });
    }

    static openImage(filename: string): Promise<TextureFile> {
        return new Promise((resolve, reject) => {
            let img = new Image();
            img.onload = () => {
                resolve(new TextureFile(filename, img));
            }
            img.onerror = (x) => {
                reject(new Error(x.toString()));
            }
            img.src = filename;
        });
    }
}
// #endregion



//ANCHOR shader imports
// #region shader imports
import vertexShaderSource from './shaders/vert.glsl?raw';
import fragmentShaderSource from './shaders/frag.glsl?raw';
const vertexShaderFile = new SourceFile("vert.glsl", vertexShaderSource);
const fragmentShaderFile = new SourceFile("frag.glsl", fragmentShaderSource);
// #endregion



//ANCHOR Vec2d, Vec3d, Vec4d
// #region Vectors
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
    static copy(v: Vec2d): Vec2d {
        return new Vec2d(v.x, v.y);
    }
    static toString(v: Vec2d): string {
        return `(${v.x}, ${v.y})`;
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
    static normalize(v: Vec3d): Vec3d {
        const len = Math.hypot(v.x, v.y, v.z);
        return len > 0 ? Vec3d.sdiv(v, len) : new Vec3d(0, 0, 1);
    }
    static crossProduct(a: Vec3d, b: Vec3d): Vec3d {
        return new Vec3d(
            a.y * b.z - a.z * b.y,
            a.z * b.x - a.x * b.z,
            a.x * b.y - a.y * b.x
        );
    }
    static dot(a: Vec3d, b: Vec3d): number {
        return a.x*b.x + a.y*b.y + a.z*b.z;
    }

}
class Vec4d {
    constructor(
        public x: number,
        public y: number,
        public z: number,
        public w: number
    ){};
    static mmul(a_: TransformationMatrix, b: Vec4d): Vec4d {
        const a = a_.matrix;
        return new Vec4d(
            a[0] * b.x + a[1] * b.y + a[2] * b.z + a[3] * b.w,
            a[4] * b.x + a[5] * b.y + a[6] * b.z + a[7] * b.w,
            a[8] * b.x + a[9] * b.y + a[10] * b.z + a[11] * b.w,
            a[12] * b.x + a[13] * b.y + a[14] * b.z + a[15] * b.w
        );
    }
    static smul(v: Vec4d, num: number): Vec4d {
        return new Vec4d(v.x * num, v.y * num, v.z * num, v.w * num);
    }

}
// #endregion



//ANCHOR TransformationMatrix
// #region TransformationMatrix
class TransformationMatrix {
    public matrix: Float32Array;
    constructor(matrix: number[] | Float32Array) {
        if (matrix instanceof Float32Array) {
            this.matrix = matrix;
        }else{
            this.matrix = new Float32Array(matrix);
        }
    }

    public mul(other: TransformationMatrix): TransformationMatrix {
        const a = this.matrix;
        const b = other.matrix;

        const result = new Float32Array(16);
        for (let i = 0; i < 4; i++) {
            for (let j = 0; j < 4; j++) {
                let sum = 0;
                for (let k = 0; k < 4; k++) {
                    sum += a[i * 4 + k] * b[k * 4 + j];
                }
                result[i * 4 + j] = sum;
            }
        }
        return new TransformationMatrix(result);
    }


    static lookAt(eye: Vec3d, target: Vec3d, up: Vec3d): TransformationMatrix {
        const zAxis = Vec3d.normalize(Vec3d.sub(eye,target));
        const xAxis = Vec3d.normalize(Vec3d.crossProduct(up, zAxis));

        const yAxis = Vec3d.crossProduct(zAxis, xAxis);

        return new TransformationMatrix([
            xAxis.x,  yAxis.x,  zAxis.x, -Vec3d.dot(xAxis, eye),
            xAxis.y,  yAxis.y,  zAxis.y, -Vec3d.dot(yAxis, eye),
            xAxis.z,  yAxis.z,  zAxis.z, -Vec3d.dot(zAxis, eye),
            0,        0,        0,        1
        ]);
    }

    static id(): TransformationMatrix {
        return new TransformationMatrix([
            1, 0, 0, 0,
            0, 1, 0, 0,
            0, 0, 1, 0,
            0, 0, 0, 1
        ]);
    }

    static inverseLookAt(eye: Vec3d, target: Vec3d, up: Vec3d): TransformationMatrix {
        const zAxis = Vec3d.normalize(Vec3d.sub(eye, target));
        const xAxis = Vec3d.normalize(Vec3d.crossProduct(up, zAxis));
        const yAxis = Vec3d.crossProduct(zAxis, xAxis);

        return new TransformationMatrix([
            xAxis.x, xAxis.y, xAxis.z, eye.x,
            yAxis.x, yAxis.y, yAxis.z, eye.y,
            zAxis.x, zAxis.y, zAxis.z, eye.z,
            0, 0, 0, 1
        ]);
    }

    static orthogonal(width: number, height: number, near: number, far: number): TransformationMatrix {
        return new TransformationMatrix([
            1 / width, 0, 0, 0,
            0, 1 / height, 0, 0,
            0, 0, -2 / (far - near), -(far + near) / (far - near),
            0, 0, 0, 1
        ]);
    }

    static sId(scalar: number): TransformationMatrix {
        return new TransformationMatrix([
            scalar, 0, 0, 0,
            0, scalar, 0, 0,
            0, 0, 1, 0,
            0, 0, 0, 1
        ]);
    }

    static inverseOrthogonal(width: number, height: number, near: number, far: number): TransformationMatrix {
        return new TransformationMatrix([
            width, 0, 0, 0,
            0, height, 0, 0,
            0, 0, - (far - near) / 2, -(far + near) / 2,
            0, 0, 0, 1
        ]);
    }

    static perspective(fov: number, aspectRatio: number, near: number, far: number): TransformationMatrix {

    const f = 1.0 / Math.tan(fov / 2);
    const rangeInv = 1 / (near - far);

    return new TransformationMatrix([
        f / aspectRatio, 0, 0, 0,
        0, f, 0, 0,
        0, 0, (near + far) * rangeInv, near * far * rangeInv * 2,
        0, 0, -1, 0,
    ]);
    }

    // Using row-major order, inverse of perspective matrix
    static inversePerspective(fov: number, aspectRatio: number, near: number, far: number): TransformationMatrix {
        const f = Math.tan(fov / 2);
        const rangeInv = 1 / (near - far);

        return new TransformationMatrix([
            f * aspectRatio, 0, 0, 0,
            0, f, 0, 0,
            0, 0, 0, -1,
            0, 0, (near - far) / (2 * near * far), (near + far) / (2 * near * far)
        ]);
    }

    public transpose(): TransformationMatrix {
        const a = this.matrix;
        return new TransformationMatrix([
            a[0], a[4], a[8],  a[12],
            a[1], a[5], a[9],  a[13],
            a[2], a[6], a[10], a[14],
            a[3], a[7], a[11], a[15]
        ]);
    }
}
// #endregion



//ANCHOR Camera
// #region Camera
class Camera {
    private width;//world
    private world_last_pos: Vec2d;//world
    private screen_start_pos: Vec2d;//screen
    private pos: Vec2d;
    private is_dragging: boolean;
    readonly min_width = 1e-7;
    readonly max_width = 1e5;
    readonly wheel_zoom_factor = 1.4;

    constructor() {
        this.width = 1.0;
        this.world_last_pos = new Vec2d(0,0);
        this.pos = new Vec2d(0, 0);
        this.screen_start_pos = new Vec2d(0, 0);
        this.is_dragging = false;
        this.bindEventListeners();
    }
    
    public getTransformationMatrix(): TransformationMatrix {
        const eye = new Vec3d(this.pos.x, this.pos.y, this.width);
        const target = new Vec3d(this.pos.x, this.pos.y, -1);
        const up = new Vec3d(0, 1, 0);
        const vMatrix = TransformationMatrix.lookAt(eye, target, up);
        const ratio = window.innerHeight/window.innerWidth;
        const pMatrix = TransformationMatrix.orthogonal(this.width, this.width*ratio, 1e-7, 1e5);
        return pMatrix.mul(vMatrix);
    }

    public getInverseTransformationMatrix(): TransformationMatrix {
        const eye = new Vec3d(this.pos.x, this.pos.y, this.width);
        const target = new Vec3d(this.pos.x, this.pos.y, -1);
        const up = new Vec3d(0, 1, 0);
        const vMatrix = TransformationMatrix.inverseLookAt(eye, target, up);
        const ratio = window.innerHeight/window.innerWidth;
        const pMatrix = TransformationMatrix.inverseOrthogonal(this.width, this.width*ratio, 1e-7, 1e5);
        return vMatrix.mul(pMatrix);
    }
    public zoomCamera(screenPoint: Vec2d, delta: number): void {
        // clamp delta
        const min_delta = this.min_width / this.width;
        const max_delta = this.max_width / this.width;
        delta = Math.max(Math.min(delta, max_delta), min_delta);
        const normalizedScreenPoint = new Vec4d(
            (screenPoint.x / window.innerWidth)*2-1,
            (screenPoint.y / window.innerHeight)*2+1,
            0,1);
        const worldPoint = Vec4d.mmul(this.getInverseTransformationMatrix(), normalizedScreenPoint);
        // console.log(normalizedScreenPoint, worldPoint);
        // Adjust the camera pos based on the zoom level
        this.width *= delta;
        this.pos.x += (worldPoint.x - this.pos.x) * (1 - delta);
        this.pos.y += (worldPoint.y - this.pos.y) * (1 - delta);
    }
    public dragCamera(screenPos: Vec2d): void {
        // Calculate the screen delta
        const screenDelta = Vec2d.sub(this.screen_start_pos,screenPos);//reverse because dragging
        this.pos.x = this.world_last_pos.x + screenDelta.x * (this.width * 2 / window.innerWidth);
        this.pos.y = this.world_last_pos.y + screenDelta.y * (this.width * 2 / window.innerWidth);
        // console.log(screenPos, this.screen_start_pos, screenDelta, this.pos, this.world_last_pos);
    }

    public bindEventListeners(): void {
        //MARK: Event Listeners

        document.onmousedown = (event) => {
            this.is_dragging = true;
            const e_pos = new Vec2d(event.pageX, -event.pageY);
            this.screen_start_pos = e_pos;
            this.world_last_pos = Vec2d.copy(this.pos);
            // console.log("mousedown",this.screen_start_pos);
        }

        document.onmousemove = (event) => {
            if(!this.is_dragging) return;
            const e_pos = new Vec2d(event.pageX, -event.pageY);
            this.dragCamera(e_pos);
            // console.log("move",this.screen_start_pos);
        }

        document.onmouseup = (event) => {
            const e_pos = new Vec2d(event.pageX, -event.pageY);
            this.dragCamera(e_pos);
            this.world_last_pos = Vec2d.copy(this.pos);
            this.screen_start_pos = new Vec2d(window.innerWidth / 2, -window.innerHeight / 2);
            this.is_dragging = false;
            // console.log("mouseup",this.screen_start_pos);
        }

        document.onkeydown = (event) => {
            if(event.key == "+") {
                this.width /= this.wheel_zoom_factor;
            } else if(event.key == "-") {
                this.width *= this.wheel_zoom_factor;
            }
        }

        document.addEventListener("wheel", (event) => {
                event.preventDefault();
                //perform onmouseup to prevent issues with dragging after zoom
                if(this.is_dragging) {
                    const e_pos = new Vec2d(event.pageX, -event.pageY);
                    this.dragCamera(e_pos);
                    this.screen_start_pos = e_pos;//works when dragging after zoom
                }
                // console.log(new Vec2d(event.pageX, -event.pageY),new Vec2d(event.clientX, -event.clientY));
                // const delta = Math.exp(event.deltaY / 100);
                let delta = Vec2d.dot(new Vec2d(event.deltaX, event.deltaY), new Vec2d(1,1))/(event.ctrlKey?50:100);
                delta=this.wheel_zoom_factor ** delta;
                // console.log(`Zooming camera by ${event.deltaX}, ${event.deltaY} with delta: ${delta}`);
                this.zoomCamera(new Vec2d(event.pageX, -event.pageY), delta);
                this.world_last_pos = Vec2d.copy(this.pos);
                // console.log("wheel",this.screen_start_pos);
            }
        , { passive: false });
    }
}
// #endregion



//ANCHOR Shader, ShaderDB
// #region Shader(DB)
type WebGLVertexShader = WebGL2RenderingContext['VERTEX_SHADER'];
type WebGLFragmentShader = WebGL2RenderingContext['FRAGMENT_SHADER'];
type shaderType = WebGLVertexShader | WebGLFragmentShader;
class Shader{
    source: SourceFile;
    shader: WebGLShader;
    type: shaderType;
    constructor(gl:WebGL2RenderingContext,type: shaderType, source: SourceFile){
        const shader = gl.createShader(type);
        if (!shader) {
            throw new Error(`Failed to create shader of type ${Shader.toShaderTypeString(type)}`);
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

    static toShaderTypeString(type: shaderType): string {
        switch(type) {
            case WebGL2RenderingContext.VERTEX_SHADER:
                return "VERTEX_SHADER";
            case WebGL2RenderingContext.FRAGMENT_SHADER:
                return "FRAGMENT_SHADER";
            default:
                throw new Error("Unknown shader type: " + type);
        }
    }
}

class ShaderDB {
    shaders: Map<string, Shader> = new Map();
    gl: WebGL2RenderingContext;
    constructor(gl: WebGL2RenderingContext) {
        this.gl = gl;
    }
    getShader(type: shaderType, source: SourceFile): Shader {
        const key = `${Shader.toShaderTypeString(type)}:${source.filename}`;
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
// #endregion



//ANCHOR Program, ProgramDB
// #region Program(DB)
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
// #endregion



//ANCHOR Texture, TextureDB
// #region Texture(DB)
class Texture{
    source: TextureFile;
    texture: WebGLTexture;
    constructor(gl:WebGL2RenderingContext,source: TextureFile){
        const texture = gl.createTexture();
        if (!texture) {
            throw new Error("Failed to create texture");
        }
        this.source = source;
        this.texture = texture;
        gl.bindTexture(gl.TEXTURE_2D, this.texture);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, source.image);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    }
}
class TextureDB {
    textures: Map<string, Texture> = new Map();
    gl: WebGL2RenderingContext;
    constructor(gl: WebGL2RenderingContext) {
        this.gl = gl;
    }
    getTexture(source: TextureFile): Texture {
        const key = source.filename;
        if (this.textures.has(key)) {
            return this.textures.get(key)!;
        }
        const texture = new Texture(this.gl, source);
        this.textures.set(key, texture);
        return texture;
    }
    deleteAll(): void {
        this.textures.forEach((texture) => {
            this.gl.deleteTexture(texture.texture);
        });
        this.textures.clear();
    }
}
// #endregion



//ANCHOR RenderObject
// #region RenderObject
abstract class RenderObject {
    public program: Program;
    
    constructor(program: Program) {
        this.program = program;
    }
    
    abstract render(gl: WebGL2RenderingContext,viewTransform:TransformationMatrix): void;
    
    draw(gl: WebGL2RenderingContext,viewTransform:TransformationMatrix): void {
        this.program.use();
        this.render(gl,viewTransform);
    }
    abstract destroy(gl: WebGL2RenderingContext): void;
}
// #endregion



//ANCHOR Sprite
// #region Sprite
class Sprite extends RenderObject {
    private position: Vec2d;
    private size: Vec2d;
    private texture: Texture; // Your texture type
    private VAO: WebGLVertexArrayObject;
    private VBO: WebGLBuffer;
    private EBO: WebGLBuffer;

    constructor(
        gl: WebGL2RenderingContext,
        program: Program,
        texture: Texture,
        position: Vec2d = new Vec2d(0, 0),
        size: Vec2d = new Vec2d(1, 1),
    ) {
        super(program);
        this.position = position;
        this.size = size;
        this.texture = texture;
        
        const vertices = new Float32Array([
            // Position (x, y), UV (u, v)
            -0.5 * size.x + position.x, -0.5 * size.y + position.y, 0.0, 0.0,  // Bottom-left
            -0.5 * size.x + position.x,  0.5 * size.y + position.y, 0.0, 1.0,  // Top-left
             0.5 * size.x + position.x, -0.5 * size.y + position.y, 1.0, 0.0,  // Bottom-right
             0.5 * size.x + position.x,  0.5 * size.y + position.y, 1.0, 1.0   // Top-right
        ]);

        const indices = new Uint32Array([
            0, 1, 2,  // First triangle
            1, 3, 2   // Second triangle
        ]);
        this.VAO = gl.createVertexArray();
        gl.bindVertexArray(this.VAO);

        this.VBO = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.VBO);
        gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

        this.EBO = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.EBO);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW);

        // Position attribute
        gl.enableVertexAttribArray(0);
        gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 16, 0);

        // UV attribute
        gl.enableVertexAttribArray(1);
        gl.vertexAttribPointer(1, 2, gl.FLOAT, false, 16, 8);

        // gl.bindVertexArray(null);
    }

    public render(gl: WebGL2RenderingContext, viewTransform: TransformationMatrix): void {

        // Set uniforms
        const transformLocation = this.program.getUniformLocation("transform");

        gl.uniformMatrix4fv(transformLocation, false, viewTransform.matrix);

        // Bind texture
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, this.texture.texture);
        
        const samplerLocation = this.program.getUniformLocation("sampler");
        gl.uniform1i(samplerLocation, 0);
        
        // Draw
        gl.bindVertexArray(this.VAO);
        gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_INT, 0);
        // gl.bindVertexArray(null);
    }


    public getPosition(): Vec2d {
        return this.position;
    }


    public getSize(): Vec2d {
        return this.size;
    }

    public destroy(gl: WebGL2RenderingContext): void {
        if (this.VAO) gl.deleteVertexArray(this.VAO);
        if (this.VBO) gl.deleteBuffer(this.VBO);
        if (this.EBO) gl.deleteBuffer(this.EBO);
    }
}
// #endregion



//ANCHOR RenderQueue
// #region RenderQueue
interface RenderItem {
    object: RenderObject;
    // zIndex: number;
    enabled: boolean;
}

class RenderQueue {
    private items: RenderItem[];
    // private needsSort: boolean;

    constructor() {
        this.items = [];
        // this.needsSort = false;
    }

    public add(object: RenderObject, zIndex: number = 0): void {
        this.items.push({
            object: object,
            // zIndex: zIndex,
            enabled: true
        });
        // this.needsSort = true;
    }

    public remove(object: RenderObject): boolean {
        const index = this.items.findIndex(item => item.object === object);
        if (index !== -1) {
            this.items.splice(index, 1);
            return true;
        }
        return false;
    }

    // public setZIndex(object: RenderObject, zIndex: number): boolean {
    //     const item = this.items.find(item => item.object === object);
    //     if (item) {
    //         item.zIndex = zIndex;
    //         this.needsSort = true;
    //         return true;
    //     }
    //     return false;
    // }

    public setEnabled(object: RenderObject, enabled: boolean): boolean {
        const item = this.items.find(item => item.object === object);
        if (item) {
            item.enabled = enabled;
            return true;
        }
        return false;
    }

    public clear(): void {
        this.items = [];
        // this.needsSort = false;
    }

    // private sortItems(): void {
    //     if (!this.needsSort) return;
        
    //     // Sort by zIndex (lower = rendered first = behind)
    //     this.items.sort((a, b) => a.zIndex - b.zIndex);
    //     this.needsSort = false;
    // }

    public render(gl: WebGL2RenderingContext, viewTransform: TransformationMatrix): void {
        // this.sortItems();
        
        for (const item of this.items) {
            if (item.enabled) {
                item.object.draw(gl, viewTransform);
            }
        }
    }

    public getCount(): number {
        return this.items.length;
    }

    public getEnabledCount(): number {
        return this.items.filter(item => item.enabled).length;
    }

    // Batch operations for performance
    public renderByProgram(gl: WebGL2RenderingContext,viewTransform: TransformationMatrix): void {
        // this.sortItems();
        
        // Group by program to minimize state changes
        const programGroups = new Map<Program, RenderItem[]>();
        
        for (const item of this.items) {
            if (!item.enabled) continue;
            
            const program = item.object.program;
            if (!programGroups.has(program)) {
                programGroups.set(program, []);
            }
            programGroups.get(program)!.push(item);
        }

        // Render each program group
        for (const [program, items] of programGroups) {
            program.use();
            
            for (const item of items) {
                // Call render directly to avoid redundant program.use() calls
                item.object.render(gl, viewTransform);
            }
        }
    }

    // Debug methods
    public logItems(): void {
        console.log(`RenderQueue (${this.items.length} items):`);
        for (let i = 0; i < this.items.length; i++) {
            const item = this.items[i];
            // console.log(`  [${i}] z:${item.zIndex} enabled:${item.enabled} type:${item.object.constructor.name}`);
            console.log(`  [${i}] enabled:${item.enabled} type:${item.object.constructor.name}`);
        }
    }
}
// #endregion


//ANCHOR main
// #region main
window.onload = () => {
Promise.all([IO.openImage("mandelbrot_set.jpg")]).then(([mandelbrot]) => {
    
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
    console.log("window.onload");

    const canvas = document.getElementById('glCanvas') as HTMLCanvasElement;
    const gl = canvas.getContext('webgl2')!;
    if (!gl) throw new Error('WebGL not supported');
    
    const shaderDB = new ShaderDB(gl);
    const programDB = new ProgramDB(gl, shaderDB);
    const textureDB = new TextureDB(gl);
    
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    gl.viewport(0, 0, window.innerWidth, window.innerHeight);

    window.onresize = () => {
        redraw();
    };

    // Camera setup
    const cam = new Camera();

    function redraw(): void {
        // console.log(cam.getTransformationMatrix().mul(cam.getInverseTransformationMatrix()));
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        gl.viewport(0, 0, window.innerWidth, window.innerHeight);

        const transformLocation = program.getUniformLocation("transform");
        gl.uniformMatrix4fv(transformLocation, false, cam.getTransformationMatrix().transpose().matrix);

        // print_.print(`Matrix:\n${printMatrix(cam.getTransformationMatrix().matrix)}`);
        // print_.printChained(`${cam.getTransformationMatrix().matrix[15]}`);

        gl.clearColor(1.0, 1.0, 1.0, 1.0);
        gl.clear(gl.COLOR_BUFFER_BIT);
        renderQueue.renderByProgram(gl, cam.getTransformationMatrix().transpose());
        // gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_INT, 0);

        fpsLog.update();
    }
    function animationLoop(): void {
        redraw();
        requestAnimationFrame(animationLoop);
    }
    
    const program = programDB.getProgram(vertexShaderFile, fragmentShaderFile);
    program.use();
    const texture = textureDB.getTexture(mandelbrot);
    const renderQueue = new RenderQueue();
    const sprite1 = new Sprite(gl,program, texture);
    const sprite2 = new Sprite(gl,program, texture, new Vec2d(0.5, 0.5), new Vec2d(0.5, 0.5));
    renderQueue.add(sprite1);
    renderQueue.add(sprite2);


    animationLoop();
});
}
// #endregion