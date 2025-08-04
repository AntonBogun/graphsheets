export type coordinateSpaceType = "world" | "mouse" | "normalized";
export class Vec2d<T extends coordinateSpaceType> {
    x: number;
    y: number;
    coordinateSpace: T;
    constructor(
        x: number,
        y: number,
        coordinateSpace: T
    ){
        this.x = x;
        this.y = y;
        this.coordinateSpace = coordinateSpace;
    };
    asArray() {
        return [this.x, this.y];
    }
    mag() {
        return Math.hypot(this.x, this.y);
    }
    smul(num: number): Vec2d<T> {
        return new Vec2d<T>(this.x * num, this.y * num, this.coordinateSpace);
    }
    add(b: Vec2d<T>): Vec2d<T> {
        return new Vec2d<T>(this.x + b.x, this.y + b.y, this.coordinateSpace);
    }
    sub(b: Vec2d<T>): Vec2d<T> {
        return new Vec2d<T>(this.x - b.x, this.y - b.y, this.coordinateSpace);
    }
    emul(a: Vec2d<T>, b: Vec2d<T>): Vec2d<T> {
        return new Vec2d<T>(this.x * b.x, this.y * b.y, this.coordinateSpace);
    }
    dot(b: Vec2d<T>): number {
        return this.x * b.x + this.y * b.y;
    }
}