import { ISerializable } from "./ISerializable.js"
import { State } from "../State.js";
import { SerializableComponentType } from "./ISerializable.js";
import { ComponentHelper } from "../scene/components/ComponentHelper.js";
import { IRenderable } from "../shaders/IRenderable.js";
export class IO {
    static isSerializable(obj: any): obj is ISerializable {
        return 'serialize' in obj && typeof obj.serialize === 'function';
    }

    static save(): void {
        const data: Record<string, any> = {};
        let promises: Promise<void>[] = [];
        
        State.currentScene?.getComponents().forEach((component) => {
            if (IO.isSerializable(component)) {
                promises.push(component.serialize().then((serializedData) => {
                    data[component.constructor.name+"|"+crypto.randomUUID()] = JSON.parse(serializedData);
                }));
            }
        });

        Promise.all(promises).then(() => {
            const json = JSON.stringify(data);
            const blob = new Blob([json], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'scene.json';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        });
    }

    static load(): Promise<void> {
        return new Promise((resolve, reject) => {
            State.currentScene?.removeNonUIComponents();
            const input = document.createElement('input');
            input.type = 'file';
            input.accept = '.json';
            input.onchange = (event) => {
                const file = (event.target as HTMLInputElement).files?.[0];
                if (!file) {
                    reject(new Error("No file selected"));
                    return;
                }
                const reader = new FileReader();
                reader.onload = () => {
                    try {
                        const data = JSON.parse(reader.result as string);
                        const promises: Promise<IRenderable<any>&ISerializable>[] = [];
                        for (const key in data) {
                            let classKey = key.split("|")[0];
                            const componentClass = ComponentHelper.componentClassByName[classKey];
                            promises.push(IO.deserialize(componentClass, data[key]));
                        }
                        Promise.all(promises).then((components) => {
                            components.forEach((component) => {
                                State.currentScene?.addComponent(component);
                            });
                            resolve();
                        });
                    } catch (error) {
                        reject(error);
                    }
                };
                reader.onerror = () => reject(reader.error);
                reader.readAsText(file);
            };
            input.click();
        });
    }

    static deserialize<T extends ISerializable>(component: SerializableComponentType<T>, data: string): Promise<T> {
        return component.deserialize(data).then((deserializedComponent) => {
            return deserializedComponent;
        });
    }

    static openImage(URL: string): Promise<HTMLImageElement> {
        return new Promise((resolve, reject) => {
            let img = new Image();
            img.onload = () => {
                resolve(img);
            }
            img.onerror = () => {
                throw new Error(`Failed to load image from ${URL}`);
            }
            img.src = URL;
        });
    }
}
