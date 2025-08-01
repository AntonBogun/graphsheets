import { Texture } from "../shaders/Texture.js";
import { TextureFile } from "../files/TextureFile.js";
export class TextureDB {
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