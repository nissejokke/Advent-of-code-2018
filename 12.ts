let initial = `##..#..##.#....##.#..#.#.##.#.#.######..##.#.#.####.#..#...##...#....#....#.##.###..#..###...#...#..`;
let generations = `#..#. => .
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
        let padding = 15;
        let padString = new Array(padding).fill('.').join('');
        this.state = padString + initialStateString + padString + padString;
        this.statePosition = padding;
        this.generations = generationInput.split(/\n/g)
            .map(row => new Generation(row));
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
for (let gen = 1; gen <= 20; gen++) {
    pots.applyGenerations();
    console.log(gen, pots.state);
}
console.log(pots.getPotsSum())