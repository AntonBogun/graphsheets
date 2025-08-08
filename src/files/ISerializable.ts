export interface ISerializable {
    serialize(): Promise<string>;
}

export type SerializableComponentType<T extends ISerializable> = {
    new(...args: any[]): T;
    deserialize(data: any): Promise<T>;
};