class Item {
    prev:Item;
    next:Item;
    data:any;
    constructor(data) {
        this.prev = null
        this.next = null
        this.data = data
    }
}
  
class LinkedList {
    last:Item;
    first:Item;
    length:number;
    constructor() {
        this.length = 0
        this.first = null
        this.last = null
    }
  
  append(node) {
    if (this.first === null) {
      this.first = node.prev = node
      this.last = node.next = node
    } else {
      node.prev = this.last
      node.next = this.first
      this.first.prev = node
      this.last.next = node
      this.last = node
    }
  
    this.length += 1
  }
  
  insert(node, inserted) {
    inserted.prev = node
    inserted.next = node.next
    node.next.prev = inserted
    node.next = inserted
    if (inserted.prev === this.last) this.last = inserted
  
    this.length += 1
  }
  
  remove = function(node) {
    if (this.length > 1) {
      node.prev.next = node.next
      node.next.prev = node.prev
      if (node === this.first) this.first = node.next
      if (node === this.last) this.last = node.prev
    } else
    if (this.first === node) {
      this.first = null
      this.last = null
    }
    node.prev = null
    node.next = null
  
    this.length -= 1
  }
  
}

class Game {
    scores: number[];
    players:number;
    current:Item;
    board:LinkedList;
    currentPlayer:number;
    marble:number;
    lastMarbleScore:number;
    constructor(players:number) {
        this.scores = [];
        this.players = players;
        this.board = new LinkedList();
        this.board.append(new Item(0));
        this.current = this.board.last;

        this.currentPlayer = 1;
        this.marble = 1;
        this.lastMarbleScore = 0;
    }

    moveCurrent(relativeIndex) {
        for (let i = 0; i < relativeIndex; i++)
            this.current = this.current.next;
        for (let i = 0; i > relativeIndex; i--)
            this.current = this.current.prev;
    }

    placeMarble() {
        if (this.currentPlayer > this.players)
            this.currentPlayer -= this.players;

        if (this.marble > 0 && this.marble % 23 === 0) {
            
            this.moveCurrent(-7);
            let removed = this.current.data;
            let newCurrent = this.current.next;
            this.board.remove(this.current);
            this.current = newCurrent;

            let marbleScore = this.marble + removed;
            this.lastMarbleScore = marbleScore;

            let playerScore = this.scores[this.currentPlayer] || 0;
            this.scores[this.currentPlayer] = playerScore + marbleScore;
        }
        else {

            this.moveCurrent(2);
            let newNode = new Item(this.marble);
            this.board.insert(this.current.prev, newNode);
            this.current = newNode;
        
        }

        this.marble++;
        this.currentPlayer++;
    }

    highestScore(): number {
        if (this.scores.length)
            return this.scores.filter(score => Boolean(score)).sort((a, b) => b - a)[0];
        return 0;
    }
}

const game = new Game(424);
let upper =  71144;
for (let n = 1; n <= upper; n++) {
    game.placeMarble();
}

console.log(game.highestScore())