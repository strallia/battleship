import Gameboard from './Gameboard';

export default class Player {
  constructor(name) {
    this.name = name;
    this.gameboard = new Gameboard();
  }

  getBoard() {
    return this.gameboard.board;
  }

  getComputerAttack() {
    let coord;
    let isPositionOpen = false;
    while (!isPositionOpen) {
      coord = [null, null].map(() => Math.floor(Math.random() * 10));
      isPositionOpen = !this.getBoard()[coord[0]][coord[1]];
    }
    return coord;
  }
}
