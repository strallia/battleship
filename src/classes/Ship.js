export default class Ship {
  #length;

  #hits;

  #name;

  isHorizontal = true;

  constructor(name) {
    this.#name = name;
    this.#hits = 0;
    this.#setLength();
  }

  #setLength() {
    if (this.#name === 'carrier') this.#length = 5;
    else if (this.#name === 'battleship') this.#length = 4;
    else if (this.#name === 'cruiser') this.#length = 3;
    else if (this.#name === 'submarine') this.#length = 3;
    else if (this.#name === 'destroyer') this.#length = 2;
  }

  getLength() {
    return this.#length;
  }

  getHits() {
    return this.#hits;
  }

  getName() {
    return this.#name;
  }

  hit() {
    this.#hits += 1;
  }

  isSunk() {
    if (this.#length === this.#hits) return true;
    return false;
  }

  toggleDirection() {
    if (this.isHorizontal) this.isHorizontal = false;
    else this.isHorizontal = true;
  }
}
