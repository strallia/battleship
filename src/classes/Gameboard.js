export default class Gameboard {
  // creates 10x10 grid with origin being the top left.
  // position selected by [y, x] coordinates where
  // y = row number and x = column number.
  static board = Gameboard.#getNewBoard();

  static #getNewBoard() {
    return Array(10)
      .fill(null)
      .map(() => Array(10).fill(null));
  }

  static resetBoard() {
    Gameboard.board = Gameboard.#getNewBoard();
  }

  static placeShip(clickedCoord, ship, isHorizontal) {
    const [y, x] = clickedCoord;
    const length = ship.getLength();

    // check if ship is off the board
    const sternPositon = (isHorizontal ? x : y) + length;
    if (sternPositon > 9) return false;

    // check if ship is being placed ontop another
    const proposedShipCoordinates = Gameboard.#getShipCoordinates(
      clickedCoord,
      ship,
      isHorizontal,
    );
    const coordinatesVacancy = proposedShipCoordinates.map((coord) =>
      Boolean(Gameboard.board[coord[0]][coord[1]]),
    );
    if (coordinatesVacancy.some((occupied) => occupied)) {
      return false;
    }

    // place ship on board
    let yCount = 0;
    let xCount = 0;
    while (
      (yCount === 0 && xCount < length) ||
      (yCount < length && xCount === 0)
    ) {
      Gameboard.board[y + yCount][x + xCount] = ship;
      if (isHorizontal) xCount += 1;
      else yCount += 1;
    }
    return true;
  }

  static #getShipCoordinates(clickedCoord, ship, isHorizontal) {
    const [y, x] = clickedCoord;
    const length = ship.getLength();
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

  static receiveAttack(coord) {
    const [y, x] = coord;
    // given clicked coord, check if a ship is there,
    // if it is, incremenet ship's git score and return true,
    // else return false as in miss
    const hasShip = Gameboard.board[y][x];
    if (hasShip) {
      hasShip.hits += 1;
      return true;
    }
    return false;
  }
}
