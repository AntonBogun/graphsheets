export class Vec2d {
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
}