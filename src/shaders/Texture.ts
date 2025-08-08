import { State } from "../State.js";
import { IO } from "../files/io.js";
import { TextureDB } from "./TextureDB.js";
import { ISerializable } from "../files/ISerializable.js";
export class Texture implements ISerializable {
    URLString: string;
    image: HTMLImageElement;
    texture: WebGLTexture;
    constructor(image: HTMLImageElement, URLString: string){
        const gl = State.currentGraphicsContext!;

        const texture = gl.createTexture();
        this.texture = texture;
        
        this.image = image;
        this.URLString = URLString;
        
        gl.bindTexture(gl.TEXTURE_2D, this.texture);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
        TextureDB.getTextureDB().registerTexture(URLString, this);
    }

    static loadTexture(URLString: string): Promise<Texture> {
        return IO.openImage(URLString).then((image: HTMLImageElement) => {
            let texture = new Texture(image, URLString);
            TextureDB.getTextureDB().registerTexture(URLString, texture);
            return texture;
        });
    }

    serialize(): Promise<string> {
        return fetch(this.URLString).then(response => response.blob()).then(blob => {
            return blob.arrayBuffer().then(buffer => {
                return JSON.stringify({
                    image: Array.from(new Uint8Array(buffer))
                    });
            })
        });
    }

    static deserialize(data: any): Promise<Texture> {
        data = JSON.parse(data);
        let URLString = URL.createObjectURL(new Blob([new Uint8Array(data.image).buffer], {type: "image/png"}));
        return Texture.loadTexture(URLString).then(texture => {
            return texture;
        });
    }
}
