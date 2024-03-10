export default class Player {
  constructor(name) {
    this.name = name;
  }

  // TODO: remove this method and its tests (already in GameController)
  getBoard() {
    return this.gameboard.board;
  }
}
