export default class Gameboard {
  #computersPrevAttackCoord = null;

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

  static getShipCoordinates(clickedCoord, shipInstance, direction) {
    const [y, x] = clickedCoord;
    const length = shipInstance.getLength();
    const coords = [];
    if (direction === 'horizontal') {
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

  placeShip(clickedCoord, shipInstance) {
    const [y, x] = clickedCoord;
    const length = shipInstance.getLength();
    const { direction } = shipInstance;

    // if valid spot, place ship on board horizontally or vertically
    if (this.isValidPosition([y, x], shipInstance)) {
      let yCount = 0;
      let xCount = 0;
      this.ships.push(shipInstance);
      while (
        (yCount === 0 && xCount < length) ||
        (yCount < length && xCount === 0)
      ) {
        this.board[y + yCount][x + xCount] = { ship: shipInstance };
        if (direction === 'horizontal') xCount += 1;
        else yCount += 1;
      }
      return true;
    }
    return false;
  }

  isValidPosition(clickedCoord, shipInstance) {
    const [y, x] = clickedCoord;
    const length = shipInstance.getLength();
    const { direction } = shipInstance;

    // do not place ship off the board
    const sternPositon = (direction === 'horizontal' ? x : y) + (length - 1);
    if (sternPositon > 9) return false;

    // do not overlap ships
    const proposedShipCoordinates = Gameboard.getShipCoordinates(
      clickedCoord,
      shipInstance,
      direction,
    );
    const coordinatesVacancy = proposedShipCoordinates.map((coord) =>
      Boolean(this.board[coord[0]][coord[1]]),
    );
    if (coordinatesVacancy.some((occupied) => occupied)) {
      return false;
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

  getComputerAttackRandom() {
    // get random, open position that does not have attackStatus
    let coord;
    let isPositionOpen = false;
    while (!isPositionOpen) {
      coord = [null, null].map(() => Math.floor(Math.random() * 10));
      const hasObj = this.board[coord[0]][coord[1]];
      if (hasObj && Object.hasOwn(hasObj, 'attackStatus')) {
        isPositionOpen = false;
      } else isPositionOpen = true;
    }

    // send computer's attack
    this.receiveAttack(coord);
    return coord;
  }

  setComputersPreviousAttackCoord(coord) {
    this.#computersPrevAttackCoord = coord;
  }

  getComputerAttackMedium() {
    /**
     * This method checks the attack status of the computer's previous attack.
     * If it was a miss, it'll attack a random cell on the board.
     * It it was a hit, it'll attack a neighbor cell.
     */

    // if no previous computer attack or if it attacked and was a miss, attack random cell
    if (
      !this.#computersPrevAttackCoord ||
      this.board[this.#computersPrevAttackCoord[0]][
        this.#computersPrevAttackCoord[1]
      ].attackStatus === 'miss'
    ) {
      this.#computersPrevAttackCoord = this.getComputerAttackRandom();
      return this.#computersPrevAttackCoord;
    }

    // else prev attack was a hit, so attack a neighbor cell
    const coordChanges = [
      [-1, 0],
      [0, 1],
      [1, 0],
      [0, -1],
    ];
    let allNeighborCoords = [];
    coordChanges.forEach(([changeY, changeX]) => {
      allNeighborCoords.push([
        this.#computersPrevAttackCoord[0] + changeY,
        this.#computersPrevAttackCoord[1] + changeX,
      ]);
    });

    // remove neighbor cells that are off the board
    allNeighborCoords = allNeighborCoords.filter(
      ([y, x]) => y >= 0 && y <= 9 && x >= 0 && x <= 9,
    );

    // find open neighbor cells that can be attacked
    const openNeighborCoords = allNeighborCoords.filter(
      ([y, x]) => !this.board[y][x]?.attackStatus,
    );

    // if no open neighbor cells, attack any other random cell
    if (openNeighborCoords.length === 0) {
      this.#computersPrevAttackCoord = this.getComputerAttackRandom();
      return this.#computersPrevAttackCoord;
    }

    // if any neighbor cells were hit, attack the neighbor directly opposite it
    const previouslyHitNeighbors = allNeighborCoords.filter(([y, x]) => {
      const hasAttackStatus = this.board[y][x]?.attackStatus;
      return hasAttackStatus === 'hit';
    });
    let indexCounter = 0;
    while (indexCounter < previouslyHitNeighbors.length) {
      const curHitNeighbor = previouslyHitNeighbors[indexCounter];

      const changeYFromReference =
        this.#computersPrevAttackCoord[0] - curHitNeighbor[0];
      const changeXFromReference =
        this.#computersPrevAttackCoord[1] - curHitNeighbor[1];
      const oppositeNeighbor =
        changeYFromReference === 0
          ? [
              this.#computersPrevAttackCoord[0],
              this.#computersPrevAttackCoord[1] + changeXFromReference,
            ]
          : [
              this.#computersPrevAttackCoord[0] + changeYFromReference,
              this.#computersPrevAttackCoord[1],
            ];

      const oppNeighborCanBeAttacked =
        !this.board[oppositeNeighbor[0]][oppositeNeighbor[1]]?.attackStatus;
      if (oppNeighborCanBeAttacked) {
        this.receiveAttack(oppositeNeighbor);
        this.#computersPrevAttackCoord = oppositeNeighbor;
        return this.#computersPrevAttackCoord;
      }
      indexCounter += 1;
    }

    // else attack random open neighbor cell
    const randomNeighborCoord =
      openNeighborCoords[Math.floor(Math.random() * openNeighborCoords.length)];
    this.receiveAttack(randomNeighborCoord);
    this.#computersPrevAttackCoord = randomNeighborCoord;
    return this.#computersPrevAttackCoord;
  }
}
