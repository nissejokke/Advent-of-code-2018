let input = `Step G must be finished before step N can begin.
Step N must be finished before step B can begin.
Step P must be finished before step Q can begin.
Step F must be finished before step U can begin.
Step H must be finished before step A can begin.
Step C must be finished before step S can begin.
Step A must be finished before step K can begin.
Step M must be finished before step O can begin.
Step V must be finished before step L can begin.
Step E must be finished before step L can begin.
Step B must be finished before step Q can begin.
Step W must be finished before step J can begin.
Step R must be finished before step D can begin.
Step D must be finished before step S can begin.
Step S must be finished before step X can begin.
Step Q must be finished before step J can begin.
Step I must be finished before step L can begin.
Step U must be finished before step J can begin.
Step Z must be finished before step X can begin.
Step Y must be finished before step T can begin.
Step J must be finished before step K can begin.
Step T must be finished before step L can begin.
Step K must be finished before step O can begin.
Step O must be finished before step X can begin.
Step L must be finished before step X can begin.
Step Y must be finished before step O can begin.
Step F must be finished before step S can begin.
Step K must be finished before step L can begin.
Step Z must be finished before step O can begin.
Step J must be finished before step X can begin.
Step K must be finished before step X can begin.
Step Q must be finished before step X can begin.
Step Y must be finished before step L can begin.
Step E must be finished before step S can begin.
Step H must be finished before step Y can begin.
Step G must be finished before step P can begin.
Step E must be finished before step K can begin.
Step B must be finished before step L can begin.
Step T must be finished before step K can begin.
Step N must be finished before step R can begin.
Step F must be finished before step E can begin.
Step W must be finished before step Y can begin.
Step U must be finished before step X can begin.
Step A must be finished before step I can begin.
Step Q must be finished before step Y can begin.
Step P must be finished before step T can begin.
Step D must be finished before step X can begin.
Step E must be finished before step Y can begin.
Step F must be finished before step B can begin.
Step P must be finished before step I can begin.
Step N must be finished before step S can begin.
Step F must be finished before step V can begin.
Step W must be finished before step U can begin.
Step F must be finished before step A can begin.
Step I must be finished before step Z can begin.
Step E must be finished before step D can begin.
Step R must be finished before step I can begin.
Step M must be finished before step V can begin.
Step R must be finished before step U can begin.
Step R must be finished before step X can begin.
Step G must be finished before step O can begin.
Step G must be finished before step H can begin.
Step M must be finished before step R can begin.
Step E must be finished before step U can begin.
Step F must be finished before step Z can begin.
Step N must be finished before step Q can begin.
Step U must be finished before step O can begin.
Step J must be finished before step T can begin.
Step W must be finished before step Z can begin.
Step I must be finished before step J can begin.
Step U must be finished before step L can begin.
Step I must be finished before step X can begin.
Step Z must be finished before step J can begin.
Step F must be finished before step D can begin.
Step N must be finished before step O can begin.
Step Q must be finished before step U can begin.
Step G must be finished before step L can begin.
Step H must be finished before step Q can begin.
Step M must be finished before step Q can begin.
Step N must be finished before step D can begin.
Step Z must be finished before step L can begin.
Step I must be finished before step Y can begin.
Step E must be finished before step X can begin.
Step J must be finished before step L can begin.
Step H must be finished before step W can begin.
Step P must be finished before step Y can begin.
Step Q must be finished before step T can begin.
Step Z must be finished before step Y can begin.
Step R must be finished before step T can begin.
Step E must be finished before step J can begin.
Step I must be finished before step T can begin.
Step A must be finished before step L can begin.
Step E must be finished before step R can begin.
Step T must be finished before step O can begin.
Step Y must be finished before step X can begin.
Step A must be finished before step Q can begin.
Step W must be finished before step Q can begin.
Step A must be finished before step T can begin.
Step B must be finished before step Y can begin.
Step H must be finished before step E can begin.
Step H must be finished before step K can begin.`

class TreeNode {
    letter:string;
    requires:TreeNode[];
    leafs:TreeNode[];
    constructor(letter:string) {
        this.letter = letter;
        this.requires = [];
        this.leafs = [];
    }
}

let tree:{ [index:string]:TreeNode } = input.split(/\n/g)
    .reduce((av, cv) => {
        const getOrCreateNode = (letter) => av[letter] = av[letter] || new TreeNode(letter);

        let requires = cv.substr(5, 1);
        let step = cv.substr(36, 1);

        let requiresNode = getOrCreateNode(requires);
        let stepNode = getOrCreateNode(step);

        stepNode.requires.push(requiresNode);
        requiresNode.leafs.push(stepNode);
        return av;
    }, {});

const getLeafs = (root:TreeNode, set:TreeNode[], requiredNodes:string) => {

    const meetRequirements = (leaf) => leaf.requires.filter(r => requiredNodes.indexOf(r.letter) > -1).length === leaf.requires.length;
    const getLeafs = () => root ? root.leafs : Object.values(tree).filter(node => node.requires.length === 0);

    let leafs = 
        set.concat(getLeafs())
        .filter(leaf => requiredNodes.indexOf(leaf.letter) === -1)
        .sort((a, b) => {
            let mra = meetRequirements(a);
            let mrb = meetRequirements(b);

            if (mra && !mrb)
                return -1;
            else if (!mra && mrb)
                return 1;
            return a.letter.localeCompare(b.letter);
        });

    if (leafs.length > 0 && !meetRequirements(leafs[0]))
        throw new Error(leafs[0].letter + ' does not meet reqs (' + leafs[0].requires.map(r => r.letter) + '). Current is ' + requiredNodes);

    return leafs;
}

let root:TreeNode;
let footprint = '';
let set = [];

do {
    set = getLeafs(root, set, footprint);
    root = set.shift();
    if (root)
        footprint += root.letter;
} while (root);

console.log(footprint);