import { coordinateSpaceType } from "./Vec2d";
import { Vec2d } from "./Vec2d.js";
export class Box<T extends coordinateSpaceType> {
    xi: number;
    yi: number;
    xf: number;
    yf: number;
    width: number;
    height: number;
    coordinateSpace: T;

    constructor(xi: number, yi: number, width: number, height: number, coordinateSpace: T) {
        this.xi = xi;
        this.yi = yi;
        this.xf = xi + width;
        this.yf = yi + height;
        this.width = width;
        this.height = height;
        this.coordinateSpace = coordinateSpace;
    }

    contains(point: Vec2d<T>) {
        return point.x >= this.xi && point.x <= this.xf && point.y >= this.yi && point.y <= this.yf;
    }

    setPosition(point: Vec2d<T>) {
        this.xi = point.x;
        this.yi = point.y;
        this.xf = this.xi + this.width;
        this.yf = this.yi + this.height;
    }

}
