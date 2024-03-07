export default class Gameboard {
  constructor() {
    // creates 10x10 grid with origin being the top left.
    // position selected by [y, x] coordinates where
    // y = row number and x = column number.
    this.board = Gameboard.#getNewBoard();
    this.ships = [];
  }

  static #getNewBoard() {
    return Array(10)
      .fill(null)
      .map(() => Array(10).fill(null));
  }

  static getShipCoordinates(clickedCoord, shipInstance, isHorizontal) {
    const [y, x] = clickedCoord;
    const length = shipInstance.getLength();
    const coords = [];
    if (isHorizontal) {
      for (let i = 0; i < length; i += 1) {
        coords.push([y, x + i]);
      }
    } else {
      for (let i = 0; i < length; i += 1) {
        coords.push([y + i, x]);
      }
    }
    return coords;
  }

  resetBoard() {
    this.board = Gameboard.#getNewBoard();
    this.ships = [];
  }

  placeShip(clickedCoord, shipInstance, isHorizontal) {
    const [y, x] = clickedCoord;
    const length = shipInstance.getLength();

    // check if ship is off the board
    const sternPositon = (isHorizontal ? x : y) + length;
    if (sternPositon > 9) return false;

    // check if ship is being placed ontop another
    const proposedShipCoordinates = Gameboard.getShipCoordinates(
      clickedCoord,
      shipInstance,
      isHorizontal,
    );
    const coordinatesVacancy = proposedShipCoordinates.map((coord) =>
      Boolean(this.board[coord[0]][coord[1]]),
    );
    if (coordinatesVacancy.some((occupied) => occupied)) {
      return false;
    }

    // place ship on board horizontally or vertically
    let yCount = 0;
    let xCount = 0;
    this.ships.push(shipInstance);
    while (
      (yCount === 0 && xCount < length) ||
      (yCount < length && xCount === 0)
    ) {
      this.board[y + yCount][x + xCount] = { ship: shipInstance };
      if (isHorizontal) xCount += 1;
      else yCount += 1;
    }
    return true;
  }

  receiveAttack(coord) {
    const [y, x] = coord;
    const square = this.board[y][x];
    if (square === null) {
      this.board[y][x] = { attackStatus: 'miss' };
    } else if (Object.hasOwn(square, 'ship')) {
      square.ship.hit();
      square.attackStatus = 'hit';
    }
  }

  getAttackStatus(coord) {
    const [y, x] = coord;
    const square = this.board[y][x];
    if (square) return square.attackStatus;
    return square;
  }

  allShipsDown() {
    const allDown = this.ships
      .map((ship) => ship.isSunk())
      .every((status) => status === true);
    if (allDown) return true;
    return false;
  }
}
