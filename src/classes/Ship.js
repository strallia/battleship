export default class Ship {
  constructor(hits = 0, isSunk = false) {
    this.hits = hits;
    this.isSunk = isSunk;
  }

  hit() {
    this.hits += 1;
  }
}
