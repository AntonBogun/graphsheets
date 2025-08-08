import { Texture } from "../shaders/Texture.js";
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

    registerTexture(source: string, texture: Texture): void {
        this.textures.set(source, texture);
    }

    getTexture(source: string): Texture|null {
        if (this.textures.has(source)) {
            return this.textures.get(source)!;
        }
        throw new Error(`Texture with source ${source} does not exist!`);
    }
}