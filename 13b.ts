import * as fs from 'fs';

let input = fs.readFileSync('13.txt', 'utf-8');

// input = `/>-<\\  
// |   |  
// | /<+-\\
// | | | v
// \\>+</ |
//   |   ^
//   \\<->/`;                                                                             

enum Direction {
    left = 0,
    top,
    right,
    bottom
}

class Cart {
    rotate:number;
    history:any[];
    crasched:boolean;
    constructor(public x:number, public y:number, public direction:Direction){
        this.rotate = 1;
        this.history = [];
        this.crasched = false;
    }

    nextPosition(): { x, y } {
        let x = this.x;
        let y = this.y;
        switch (this.direction) {
            case Direction.left: x--; break;
            case Direction.top: y--; break;
            case Direction.right: x++; break;
            case Direction.bottom: y++; break;
        }
        return { x, y };
    }

    turn() {
        this.direction -= this.rotate;
        if (--this.rotate < -1)
            this.rotate = 1;
        if (this.direction < Direction.left)
            this.direction = Direction.bottom;
        if (this.direction > Direction.bottom)
            this.direction = Direction.left;
    }

    setPosition(x, y, char) {
        this.history.unshift({ dir: this.direction, x: this.x, y: this.y, char });
        if (this.history.length > 10)
            this.history.length = 10;
        this.x = x;
        this.y = y;
    }
}

class CartMap {
    map:string[][];
    constructor(input:string) {
        this.map = input.split(/\n/g)
            .map(row => row.split(''));
    }

    getCarts(): Cart[] {
        let ppoints = this.map.map((row, y) => {
            let points = row.reduce((av, cv, x) => {

                let direction = -1;
                switch (cv) {
                    case '>': direction = Direction.right; break;
                    case '<': direction = Direction.left; break;
                    case '^': direction = Direction.top; break;
                    case 'v': direction = Direction.bottom; break;
                }
                if (direction > -1)
                    av.push(new Cart(x,y, direction));
                return av;
            }, []);
            return points;
        });

        return [].concat.apply([], ppoints);
    }

    isRailAt(x, y) {
        return this.map[y][x] !== ' ';
    }

    getMapChar(x, y) {
        return this.map[y][x];
    }

    orderCarts(carts:Cart[]) {
        return carts.sort((a, b) => {
            if (a.y < b.y)
                return -1;
            else if (a.y > b.y)
                return 1;
            else if (a.x < b.x)
                return -1;
            else if (a.x > b.x)
                return 1;
            else
                return 0;
        })
    }

    moveCarts(carts:Cart[]): Cart {
        for (let cart of carts) {
            if (cart.crasched) continue;
            let pos = cart.nextPosition();
            if (this.isRailAt(pos.x, pos.y)) {
                cart.setPosition(pos.x, pos.y, this.getMapChar(pos.x, pos.y));
                this.updateDirection(cart, this.getMapChar(cart.x, cart.y));
            }
            else
                throw new Error('What the hell is going on');

            let colls = this.detectCollisions(carts);
            if (colls.length > 0) {
                colls.forEach(col => col.forEach(craschedCart => craschedCart.crasched = true));
            }
        }

        let cartsAlive = carts.filter(c => !c.crasched);
        if (cartsAlive.length === 1)
            return cartsAlive[0];

        return null;
    }

    private updateDirection(cart:Cart, char: string): any {
        switch(cart.direction) {
            case Direction.left: 
                switch(char) {
                    case '/': cart.direction = Direction.bottom; break;
                    case '\\': cart.direction = Direction.top; break;
                    case '+': cart.turn(); break;
                }
                break;
            case Direction.top: 
                switch(char) {
                    case '/': cart.direction = Direction.right; break;
                    case '\\': cart.direction = Direction.left; break;
                    case '+': cart.turn(); break;
                }
                break;
            case Direction.right: 
                switch(char) {
                    case '/': cart.direction = Direction.top; break;
                    case '\\': cart.direction = Direction.bottom; break;
                    case '+': cart.turn(); break;
                }
                break;
            case Direction.bottom: 
                switch(char) {
                    case '/': cart.direction = Direction.left; break;
                    case '\\': cart.direction = Direction.right; break;
                    case '+': cart.turn(); break;
                }
                break;
        }
    }

    detectCollisions(carts:Cart[]): Cart[][] {
        let crasches = [];
        carts
        .filter(cart => !cart.crasched)
        .reduce((av, cart) => {
            let key = cart.y + ',' + cart.x;
            av[key] = av[key] || [];
            av[key].push(cart)
            if (av[key].length > 1)
                crasches.push(av[key]);
            return av;
        }, {});
        return crasches;
    }

    print(carts:Cart[]) {
        this.map.forEach((row, y) => {
            let printRow = [];
            row.forEach((col, x) => {
                let cartsAtPos = carts.filter(cart => cart.y === y && cart.x === x);
                if (cartsAtPos.length)
                    printRow.push('X');
                else
                    printRow.push(col);
            });
            console.log(printRow.join(''));
        });
    }
}

let map = new CartMap(input);
let carts = map.getCarts();
let printmap = false;
for (let i = 0; i < 2000000; i++) {
    carts = carts.filter(cart => !cart.crasched);
    carts = map.orderCarts(carts);
    let theOneLeftCart = map.moveCarts(carts);
    if (printmap) {
        map.print(carts);
        console.log('--------------');
    }
    if (theOneLeftCart) {
        console.log('yey', theOneLeftCart.x + ',' + theOneLeftCart.y);
        break;
    }
}