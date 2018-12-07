let input = `137, 140
318, 75
205, 290
104, 141
163, 104
169, 164
238, 324
180, 166
260, 198
189, 139
290, 49
51, 350
51, 299
73, 324
220, 171
146, 336
167, 286
51, 254
40, 135
103, 138
100, 271
104, 328
80, 67
199, 180
320, 262
215, 290
96, 142
314, 128
162, 106
214, 326
303, 267
340, 96
211, 278
335, 250
41, 194
229, 291
45, 97
304, 208
198, 214
250, 80
200, 51
287, 50
120, 234
106, 311
41, 116
359, 152
189, 207
300, 167
318, 315
296, 72`;

class Point {
    x: number;
    y: number;
    name: string;
    origin: Point;
    constructor(x, y, name?) {
        this.x = x;
        this.y = y;
        this.name = name;
    }

    
    
    distanceTo(point:Point) {
        return Math.abs(this.x - point.x) + Math.abs(this.y - point.y);
    }

    distanceToOrigin() {
        return this.distanceTo(this.origin);
    }
}

let points = input.split(/\n/g).map((row, rowIndex) => {
    let parts = row.split(' ').map(p => parseInt(p));
    return new Point(parts[0], parts[1], String.fromCharCode(97 + rowIndex));
});

let d = 1;
let xmin = points.sort((a, b) => a.x - b.x)[0].x - d;
let ymin = points.sort((a, b) => a.y - b.y)[0].y - d;
let xmax = points.sort((a, b) => b.x - a.x)[0].x + d;
let ymax = points.sort((a, b) => b.y - a.y)[0].y + d;

let map = {};
let infinites = {};
let sum = 0;

for (let y = ymin; y <= ymax; y++) {
    for (let x = xmin; x <= xmax; x++) {
        let totalDistance = points.map(point => {
            return { 
                point, 
                distance: point.distanceTo(new Point(x, y))
            };
        })
        .reduce((av, cv) => av + cv.distance, 0);

        if (totalDistance < 10000)
            sum++;
    }
}

console.log(sum);