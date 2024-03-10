import Gameboard from './Gameboard';

export default class Player {
  constructor(name) {
    this.name = name;
  }

  // TODO: remove this method and its tests (already in GameController)
  getBoard() {
    return this.gameboard.board;
  }

  getComputerAttack(gameboard) {
    // get random, open position
    const { board } = gameboard;
    let coord;
    let isPositionOpen = false;
    while (!isPositionOpen) {
      coord = [null, null].map(() => Math.floor(Math.random() * 10));
      isPositionOpen = !board[coord[0]][coord[1]];
    }

    // send computer's attack
    gameboard.receiveAttack(coord);
    return coord;
  }
}
