
let initial = `#..#.#..##......###...###`;
let generations = `...## => #
..#.. => #
.#... => #
.#.#. => #
.#.## => #
.##.. => #
.#### => #
#.#.# => #
#.### => #
##.#. => #
##.## => #
###.. => #
###.# => #
####. => #`;

initial = `##..#..##.#....##.#..#.#.##.#.#.######..##.#.#.####.#..#...##...#....#....#.##.###..#..###...#...#..`;
generations = `#..#. => .
.#..# => #
..#.# => .
..... => .
.#... => #
#..## => #
..##. => #
#.##. => #
#.#.# => .
###.# => #
.#### => .
..### => .
.###. => .
#.#.. => #
###.. => .
##.#. => .
##..# => .
##.## => .
#.### => .
...## => #
##... => #
####. => .
.#.## => .
#...# => #
.#.#. => #
....# => .
.##.. => .
...#. => .
..#.. => .
#.... => .
.##.# => #
##### => #`;

class Generation {
    match:string;
    output:boolean;
    constructor(generationInput:string) {
        let parts = generationInput.split(' => ');
        this.match = parts[0];
        this.output = parts[1] === '#';
    }
}

class Pots {
    state:string;
    statePosition:number;
    generations:Generation[];
    constructor(initialStateString:string, generationInput:string) {
        let paddingSize = 10;
        let padString = this.getPadstring(paddingSize);
        this.state = padString + initialStateString + padString;
        this.statePosition = paddingSize;
        this.generations = generationInput.split(/\n/g)
            .map(row => new Generation(row));
    }

    getPadstring(padding:number) {
        let padString = new Array(padding).fill('.').join('');
        return padString;
    }

    applyGenerations() {
        let nextGeneration = this.state;
        for (let index = 2; index < this.state.length - 2; index++) {
            let match:Generation;
            for (let generation of this.generations) {
                if (this.state.substr(index - 2, 5) === generation.match) {
                    match = generation;
                    break;
                }
            }

            nextGeneration = this.stateReplaceAt(nextGeneration, index, match && match.output ? '#' : '.');
        }

        let pad = 10;
        let index = nextGeneration.lastIndexOf('#');
        if (index > nextGeneration.length - pad) {
            nextGeneration = nextGeneration + this.getPadstring(pad);
        }
        this.state = nextGeneration;
    }

    stateReplaceAt(state:string, index:number, replacement:string) {
        return state.substr(0, index) + replacement + state.substr(index + replacement.length);
    }

    getPotsSum(): number {
        return this.state.split('').reduce((av, cv, index) => { 
             if (cv === '#')
                return av + index - this.statePosition;
            return av;
        }, 0);
    }
}

let pots = new Pots(initial, generations);
console.log(0, pots.state)
for (let gen = 1; gen <= 500; gen++) {
    pots.applyGenerations();
    console.log(gen, pots.getPotsSum(), pots.state);
}
console.log(pots.statePosition, pots.getPotsSum())

/*
Calculating change each generation:
Difference from gen 500 and 450

> 16555-14905
1650
> (16555-14905)/50
33
> x = 500; (x-450)*33 + 14905;
16555
> x = 50000000000; (x-450)*33 + 14905;

Answer:
1650000000055

*/