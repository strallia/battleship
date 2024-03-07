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

  static placeShip(clickedCoord, shipInstance, isHorizontal) {
    const [y, x] = clickedCoord;
    const length = shipInstance.getLength();

    // check if ship is off the board
    const sternPositon = (isHorizontal ? x : y) + length;
    if (sternPositon > 9) return false;

    // check if ship is being placed ontop another
    const proposedShipCoordinates = Gameboard.#getShipCoordinates(
      clickedCoord,
      shipInstance,
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
      Gameboard.board[y + yCount][x + xCount] = {
        ship: shipInstance,
        hasAttacked: false,
      };
      if (isHorizontal) xCount += 1;
      else yCount += 1;
    }
    return true;
  }

  static #getShipCoordinates(clickedCoord, shipInstance, isHorizontal) {
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

  static receiveAttack(coord) {
    const [y, x] = coord;
    const hasShip = Gameboard.board[y][x];
    if (hasShip) {
      hasShip.ship.hit();
      hasShip.hasAttacked = true;
      return true;
    }
    return false;
  }
}
