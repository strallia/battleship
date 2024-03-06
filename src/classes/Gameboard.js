export default class Gameboard {
  // Creates 10x10 grid with origin being the top left.
  // Position selected by [y, x] coordinates where
  // y = row number and x = column number.
  static board = Array(10)
    .fill(null)
    .map(() => Array(10).fill(null));

  static placeShip(clickedCoord, shipInstance, direction) {
    const y = clickedCoord[0];
    const x = clickedCoord[1];

    let yCount = 0;
    let xCount = 0;
    while (
      (yCount === 0 && xCount < shipInstance.length) ||
      (yCount < shipInstance.length && xCount === 0)
    ) {
      Gameboard.board[y + yCount][x + xCount] = shipInstance;
      if (direction === 'horizontal') xCount += 1;
      else yCount += 1;
    }
  }
}
