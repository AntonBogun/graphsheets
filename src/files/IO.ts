import { SourceFile } from "./SourceFile.js";
import { TextureFile } from "./TextureFile.js";
export class IO {
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
