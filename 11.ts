
class Cell {
    rackId: number;
    powerLever: number;
    constructor(x, y, serialNumber) {
        this.rackId = x + 10;
        let powerLevel = this.rackId * y + serialNumber;
        powerLevel *= this.rackId;
        
        let hund = Math.floor(powerLevel / 100);
        let strHund = hund.toString();
        powerLevel = parseInt(strHund[strHund.length - 1]) || 0;
        powerLevel -= 5;
        this.powerLever = powerLevel;
    }
}

class Grid {
    size: number;
    constructor(public x, public y, size) {
        this.size = size;
    }

    totalPower(serialNumber) {
        let power = 0;
        for (let i = 0; i < this.size; i++) {
            for (let j = 0; j < this.size; j++)
                power += new Cell(this.x + i, this.y + j, serialNumber).powerLever;
        }
        return power;
    }
}

const gridSerialNumber = 3613;
let maxPower = 0;
let maxGrid = null;
let maxGridSize = 0;
for (let gridSize = 1; gridSize < 300; gridSize++) {
    for (let i = 0; i < 300; i++) {
        for (let j = 0; j < 300; j++) {
            let grid = new Grid(i, j, gridSize);
            let power = grid.totalPower(gridSerialNumber);
            if (power > maxPower) {
                maxGrid = grid;
                maxPower = power;
                maxGridSize = gridSize;
            }
        }
    }
    console.log(maxGrid.x, maxGrid.y, maxGridSize, ':', maxPower);
}

//console.log(maxGrid.x, maxGrid.y, maxGridSize);