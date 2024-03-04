export default class Ship {
  constructor(hits = 0) {
    this.hits = hits;
  }

  hit() {
    this.hits += 1;
  }
}
