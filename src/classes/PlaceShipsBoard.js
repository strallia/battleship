import Gameboard from './Gameboard';

export default class PlaceShipsBoard extends Gameboard {
  removeShip(shipInstance) {
    const newBoard = this.board.map((row) => {
      const newRowContent = row.map((cell) => {
        if (cell === null) return null;
        if (cell.ship === shipInstance) return null;
        return cell;
      });
      return newRowContent;
    });
    this.board = newBoard;
  }

  moveShip(originalCoord, newCoord) {
    const [y, x] = originalCoord;
    const shipInstance = this.board[y][x].ship;
    this.removeShip(shipInstance);
    this.placeShip(newCoord, shipInstance);
  }
}
