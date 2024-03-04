export default class Ship {
  constructor(shipType = null, hits = 0) {
    this.#setLength(shipType);
    this.hits = hits;
  }

  hit() {
    this.hits += 1;
  }

  #setLength(shipType) {
    if (shipType === 'carrier') this.length = 5;
    if (shipType === 'battleship') this.length = 4;
    if (shipType === 'cruiser' || shipType === 'submarine') this.length = 3;
    if (shipType === 'destroyer') this.length = 2;
  }

  isSunk() {
    if (this.length === this.hits) return true;
    return false;
  }
}
