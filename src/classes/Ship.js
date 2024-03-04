export default class Ship {
  constructor(shipType = null, hits = 0, isSunk = false) {
    this.#setLength(shipType);
    this.hits = hits;
    this.isSunk = isSunk;
  }

  hit() {
    this.hits += 1;
  }

  #setLength(shipType) {
    if (shipType === 'carrier') this.length = 5;
    if (shipType === 'battleship') this.length = 4;
    if (shipType === 'cruiser' || shipType === 'submarine') {
      this.length = 3;
      console.log(this.length);
    }
    if (shipType === 'destroyer') this.length = 2;
  }
}
