export class Box {
    xi: number;
    yi: number;
    xf: number;
    yf: number;
    width: number;
    height: number;

    constructor(xi: number, yi: number, width: number, height: number) {
        this.xi = xi;
        this.yi = yi;
        this.xf = xi + width;
        this.yf = yi + height;
        this.width = width;
        this.height = height;
    }

    contains(x: number, y: number) {
        return x >= this.xi && x <= this.xf && y >= this.yi && y <= this.yf;
    }
}
