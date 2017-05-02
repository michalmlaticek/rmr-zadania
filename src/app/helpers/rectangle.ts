import { IXy, IRectangle } from '../interfaces';

export class Rectangle implements IRectangle {
    p1: IXy;
    p2: IXy;
    p3: IXy;
    p4: IXy;
    with: number;
    height: number;

    p21: IXy;
    p41: IXy;
    p21magnSuaqre: number;
    p41magnSquare: number;

    constructor(startPoint: IXy, endPoint: IXy, width: number) {
        let a, b, c, sin, cos: number;
        a = startPoint.x - endPoint.x;
        b = startPoint.y - endPoint.y;
        c = Math.sqrt(Math.pow(a, 2) + Math.pow(b, 2));
        cos = a / c;
        sin = b / c;

        let reducedX: number = Math.abs(sin * width) / 2;
        let reducedY: number = Math.abs(cos * width) / 2;
        this.p1 = {
            x: startPoint.x - reducedX,
            y: startPoint.y + reducedY
        };
        this.p2 = {
            x: startPoint.x + reducedX,
            y: startPoint.y - reducedY
        };
        this.p3 = {
            x: endPoint.x - reducedX,
            y: endPoint.y + reducedY
        };
        this.p4 = {
            x: endPoint.x + reducedX,
            y: endPoint.y - reducedY
        };

        this.p21 = {
            x: this.p2.x - this.p1.x,
            y: this.p2.y - this.p1.y
        }

        this.p41 = {
            x: this.p4.x - this.p1.x,
            y: this.p4.y - this.p1.y
        }

        this.p21magnSuaqre = Math.pow(this.p21.x, 2) + Math.pow(this.p21.y, 2);
        this.p41magnSquare = Math.pow(this.p41.x, 2) + Math.pow(this.p41.y, 2);
    }

    contains(pointToTest: IXy): boolean {
        let p: IXy = {
            x: pointToTest.x - this.p1.x,
            y: pointToTest.y - this.p1.y
        }

        let pp21: number = (p.x * this.p21.x) + (p.y * this.p21.y);
        let pp41: number = (p.x * this.p41.x) + (p.y * this.p41.y);
        let isIn = 0 <= pp21 && pp21 <= this.p21magnSuaqre && 0 <= pp41 && pp41 <= this.p41magnSquare;
        console.log("contains: ", isIn);
        return isIn;
    }
}