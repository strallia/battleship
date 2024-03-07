export default class Ship {
  #length;

  #hits;

  constructor(length) {
    this.#length = length;
    this.#hits = 0;
  }

  getLength() {
    return this.#length;
  }

  getHits() {
    return this.#hits;
  }

  hit() {
    this.#hits += 1;
  }

  isSunk() {
    if (this.#length === this.#hits) return true;
    return false;
  }
}
