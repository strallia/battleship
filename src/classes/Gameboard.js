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
    const y = clickedCoord[0];
    const x = clickedCoord[1];

    // check if ship is off the board
    const sternPositon = (isHorizontal ? x : y) + ship.length;
    if (sternPositon > 9) return false;

    // place ship on board
    let yCount = 0;
    let xCount = 0;
    while (
      (yCount === 0 && xCount < ship.length) ||
      (yCount < ship.length && xCount === 0)
    ) {
      Gameboard.board[y + yCount][x + xCount] = ship;
      if (isHorizontal) xCount += 1;
      else yCount += 1;
    }
    return true;
  }
}
