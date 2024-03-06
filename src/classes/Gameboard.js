export default class Gameboard {
  // creates 10x10 grid with origin being the top left.
  // position selected by [y, x] coordinates where
  // y = row number and x = column number.
  static board = Array(10)
    .fill(null)
    .map(() => Array(10).fill(null));

  static placeShip(clickedCoord, ship, direction) {
    const y = clickedCoord[0];
    const x = clickedCoord[1];

    // check if ship is off right side of board
    const sternCoord = x + ship.length;
    if (sternCoord > 9) return false;

    // place ship on board
    let yCount = 0;
    let xCount = 0;
    while (
      (yCount === 0 && xCount < ship.length) ||
      (yCount < ship.length && xCount === 0)
    ) {
      Gameboard.board[y + yCount][x + xCount] = ship;
      if (direction === 'horizontal') xCount += 1;
      else yCount += 1;
    }
  }
}
