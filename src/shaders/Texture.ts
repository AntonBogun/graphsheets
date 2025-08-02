import { TextureFile } from "../files/TextureFile.js";
import { State } from "../State.js";
export class Texture{
    source: TextureFile;
    texture: WebGLTexture;
    constructor(source: TextureFile){
        const gl = State.currentGraphicsContext!;
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