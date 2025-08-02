import { Texture } from "../shaders/Texture.js";
import { TextureFile } from "../files/TextureFile.js";
export class TextureDB {
    textures: Map<string, Texture> = new Map();
    private static instance: TextureDB;
    private constructor() {}
    static getTextureDB(): TextureDB {
        if (!TextureDB.instance) {
            TextureDB.instance = new TextureDB();
        }
        return TextureDB.instance;
    }
    getTexture(source: TextureFile): Texture {
        const key = source.filename;
        if (this.textures.has(key)) {
            return this.textures.get(key)!;
        }
        const texture = new Texture(source);
        this.textures.set(key, texture);
        return texture;
    }
}