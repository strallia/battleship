import Ship from '../classes/Ship';
import Gameboard from '../classes/Gameboard';

describe('Check for single ship placement', () => {
  let battleship;
  let myBoard;
  beforeEach(() => {
    battleship = new Ship('battleship');
    myBoard = new Gameboard();
  });

  it('Places battleship on board vertically', () => {
    const clickedCoord = [1, 2]; // [y(row), x(column)]
    battleship.setDirection('vertical');
    myBoard.placeShip(clickedCoord, battleship);
    expect(myBoard.board[1][2]).toBeTruthy();
    expect(myBoard.board[2][2]).toBeTruthy();
    expect(myBoard.board[3][2]).toBeTruthy();
    expect(myBoard.board[4][2]).toBeTruthy();
  });

  it('Places battleship on board horizontally', () => {
    const clickedCoord = [1, 2];
    myBoard.placeShip(clickedCoord, battleship);
    expect(myBoard.board[1][2]).toBeTruthy();
    expect(myBoard.board[1][3]).toBeTruthy();
    expect(myBoard.board[1][4]).toBeTruthy();
    expect(myBoard.board[1][5]).toBeTruthy();
  });

  it('Does not allow placement of horizontal ship past right side of board', () => {
    const clickedCoord = [3, 9];
    expect(myBoard.placeShip(clickedCoord, battleship)).toBe(false);
  });

  it('Does not allow placement of vertical ship past bottom side of board', () => {
    const clickedCoord = [9, 2];
    battleship.setDirection('vertical');
    expect(myBoard.placeShip(clickedCoord, battleship)).toBe(false);
  });
});

describe('Check for overlapping ship placement', () => {
  const battleship = new Ship('battleship');
  const cruiser = new Ship('cruiser');
  const myBoard = new Gameboard();
  afterAll(() => {
    myBoard.resetBoard();
  });

  it('Does not allow placement of horizontal ship ontop another', () => {
    const clickedCoord = [1, 2];
    myBoard.placeShip(clickedCoord, battleship, true);
    expect(myBoard.placeShip(clickedCoord, cruiser, true)).toBe(false);
  });

  it('Does not allow placement of vertical ship ontop another', () => {
    const clickedCoord = [1, 2];
    myBoard.placeShip(clickedCoord, battleship, true);
    expect(myBoard.placeShip(clickedCoord, cruiser, false)).toBe(false);
  });
});

describe('Handling attacks', () => {
  const myBoard = new Gameboard();
  let cruiser;
  beforeEach(() => {
    cruiser = new Ship('cruiser');
    myBoard.placeShip([2, 4], cruiser);
  });
  afterEach(() => {
    myBoard.resetBoard();
  });

  it("Ship's hit score returns 1 when hit once", () => {
    myBoard.receiveAttack([2, 4]);
    expect(cruiser.getHits()).toBe(1);
  });

  it("Ship's hit score returns 2 when hit twice", () => {
    myBoard.receiveAttack([2, 4]);
    myBoard.receiveAttack([2, 5]);
    expect(cruiser.getHits()).toBe(2);
  });

  it('Square has attackStatus of "hit" if attack was a hit', () => {
    myBoard.receiveAttack([2, 4]);
    expect(myBoard.getAttackStatus([2, 4])).toBe('hit');
  });

  it('Square has attackStatus of "miss" if attack was a miss', () => {
    myBoard.receiveAttack([0, 4]);
    expect(myBoard.getAttackStatus([0, 4])).toBe('miss');
  });

  it('Square has attackStatus of null if not previously attacked', () => {
    expect(myBoard.getAttackStatus([0, 4])).toBe(null);
  });

  it('Does not allow attack on previously attacked square', () => {
    myBoard.receiveAttack([0, 4]);
    expect(myBoard.receiveAttack([0, 4])).toBeUndefined();
  });

  it('Sunken ship returns true from isSunk', () => {
    myBoard.receiveAttack([2, 4]);
    myBoard.receiveAttack([2, 5]);
    myBoard.receiveAttack([2, 6]);
    expect(cruiser.isSunk()).toBe(true);
  });

  it('Damaged but un-sunken ship returns false from isSunk', () => {
    myBoard.receiveAttack([2, 4]);
    myBoard.receiveAttack([3, 4]);
    expect(cruiser.isSunk()).toBe(false);
  });
});

describe('Report if all ships down', () => {
  const myBoard = new Gameboard();
  let cruiser;
  let destroyer;
  beforeEach(() => {
    cruiser = new Ship('cruiser');
    destroyer = new Ship('destroyer');
    destroyer.setDirection('vertical');
    myBoard.placeShip([1, 1], destroyer, false);
    myBoard.placeShip([7, 6], cruiser, true);
  });
  afterEach(() => {
    myBoard.resetBoard();
  });

  it('allShipsDown returns true when all ships have sunk', () => {
    myBoard.receiveAttack([1, 1]);
    myBoard.receiveAttack([2, 1]);
    myBoard.receiveAttack([7, 6]);
    myBoard.receiveAttack([7, 7]);
    myBoard.receiveAttack([7, 8]);
    expect(myBoard.allShipsDown()).toBe(true);
  });

  it('allShipsDown returns false when some ships still floating', () => {
    myBoard.receiveAttack([1, 1]);
    myBoard.receiveAttack([7, 6]);
    expect(myBoard.allShipsDown()).toBe(false);
  });
});

describe('Handle a player and opponent board separately', () => {
  it('Places separate ship instances on each board', () => {
    const player = new Gameboard();
    const cruiser = new Ship('cruiser');
    player.placeShip([1, 1], cruiser);
    expect(player.board[1][1].ship).toBe(cruiser);
    expect(player.board[1][2].ship).toBe(cruiser);
    expect(player.board[1][3].ship).toBe(cruiser);

    const opponent = new Gameboard();
    const destoryer = new Ship('destroyer');
    opponent.placeShip([1, 1], destoryer);
    expect(opponent.board[1][1].ship).toBe(destoryer);
    expect(opponent.board[1][2].ship).toBe(destoryer);
    expect(opponent.board[1][3]).toBe(null);
  });
});

describe("Getting computer's attack (easy difficulty) with getComputerAttackRandom method", () => {
  const gameboard = new Gameboard('Leah');
  let coord;
  afterAll(() => {
    jest.restoreAllMocks();
  });

  it('Calls Math.random', () => {
    const spyMathRandom = jest.spyOn(global.Math, 'random');
    gameboard.getComputerAttackRandom();
    expect(spyMathRandom).toHaveBeenCalled();
  });

  it('Sends attack to an open coordinate without ship', () => {
    // fill board except for one square without ship
    for (let i = 0; i < 10; i += 1) {
      for (let j = 0; j < 10; j += 1) {
        gameboard.receiveAttack([i, j]);
      }
    }
    gameboard.board[0][0] = null;

    // expect computer to attack the only open square
    coord = gameboard.getComputerAttackRandom();
    expect(gameboard.board[0][0]).toBeTruthy();
    gameboard.resetBoard();
  });

  it('Sends attack to an open coordinate with a ship', () => {
    // fill board except for one square with ship
    gameboard.placeShip([0, 0], new Ship('carrier'), false);
    for (let i = 0; i < 10; i += 1) {
      for (let j = 0; j < 10; j += 1) {
        gameboard.receiveAttack([i, j]);
      }
    }
    delete gameboard.board[0][0].attackStatus;

    // expect computer to attack the only open square
    gameboard.getComputerAttackRandom();
    expect(Object.hasOwn(gameboard.board[0][0], 'attackStatus')).toBe(true);
  });

  it('Returns a coordinate within the board boundaries', () => {
    const [y, x] = coord;
    expect(y).toBeGreaterThanOrEqual(0);
    expect(y).toBeLessThanOrEqual(9);
    expect(x).toBeGreaterThanOrEqual(0);
    expect(x).toBeLessThanOrEqual(9);
  });
});

describe("Getting computer's attack (medium difficulty) with getComputerAttackMedium method", () => {
  it("Attacks a random cell on board on computer's first attack", () => {
    const gameboard = new Gameboard();
    const attackedCoord = gameboard.getComputerAttackMedium();
    expect(attackedCoord.length).toEqual(2);
    expect(attackedCoord[0] >= 0 && attackedCoord[0] <= 9).toBe(true);
    expect(attackedCoord[1] >= 0 && attackedCoord[1] <= 9).toBe(true);
  });

  it("Attacks a random cell on board if computer's previous attack was a miss", () => {
    const gameboard = new Gameboard();
    const prevAttackCoord = gameboard.getComputerAttackMedium();
    expect(
      gameboard.board[prevAttackCoord[0]][prevAttackCoord[1]].attackStatus,
    ).toBe('miss');
    const nextAttackCoord = gameboard.getComputerAttackMedium();
    expect(nextAttackCoord.length).toEqual(2);
    expect(nextAttackCoord[0] >= 0 && nextAttackCoord[0] <= 9).toBe(true);
    expect(nextAttackCoord[1] >= 0 && nextAttackCoord[1] <= 9).toBe(true);
  });

  it("Attacks a random neighbor cell when computer's prev attack was a hit", () => {
    const gameboard = new Gameboard();

    // setup previous attack to be a hit
    gameboard.placeShip([1, 1], new Ship('destroyer'));
    gameboard.receiveAttack([1, 1]);
    gameboard.setComputersPreviousAttackCoord([1, 1]);

    const possibleNeighborCoordinates = [
      [0, 1],
      [1, 0],
      [1, 2],
      [2, 1],
    ];
    const nextAttackCoord = gameboard.getComputerAttackMedium();
    expect(possibleNeighborCoordinates).toContainEqual(nextAttackCoord);
  });

  it('Does not attack neighbor cells off the board', () => {
    const gameboard = new Gameboard();

    // setup previous attack to be a hit
    gameboard.placeShip([0, 0], new Ship('destroyer'));
    gameboard.receiveAttack([0, 0]);
    gameboard.setComputersPreviousAttackCoord([0, 0]);

    const possibleNeighborCoordinates = [
      [0, 1],
      [1, 0],
    ];
    const nextAttackCoord = gameboard.getComputerAttackMedium();
    expect(possibleNeighborCoordinates).toContainEqual(nextAttackCoord);
  });

  it('Attacks random cell on board if no neighbor cells open', () => {
    const gameboard = new Gameboard();

    // setup previous attack to be a hit with no open neighbor cells
    gameboard.placeShip([0, 0], new Ship('destroyer'));
    gameboard.setComputersPreviousAttackCoord([0, 0]);
    gameboard.receiveAttack([1, 0]);
    gameboard.receiveAttack([0, 1]);

    const neighborCoordinates = [
      [0, 1],
      [1, 0],
    ];
    const nextAttackCoord = gameboard.getComputerAttackMedium();
    expect(neighborCoordinates).not.toContainEqual(nextAttackCoord);
  });

  it('Attacks neighbor cells that are likely to get a ship hit (ie creates a line of hits)', () => {
    const gameboard = new Gameboard();

    // setup previous attack
    gameboard.placeShip([1, 1], new Ship('cruiser'));
    gameboard.receiveAttack([1, 1]);
    gameboard.receiveAttack([1, 2]);
    gameboard.setComputersPreviousAttackCoord([1, 2]);

    const nextAttackCoord = gameboard.getComputerAttackMedium();
    expect(nextAttackCoord[0]).toBe(1);
    expect(nextAttackCoord[1]).toBe(3);
  });

  it('Does not attack neighbor cells that are already attacked', () => {
    const gameboard = new Gameboard();
    gameboard.placeShip([1, 1], new Ship('cruiser'));
    gameboard.receiveAttack([1, 1]);
    gameboard.receiveAttack([1, 2]);
    gameboard.receiveAttack([1, 3]);
    gameboard.receiveAttack([2, 2]);
    gameboard.setComputersPreviousAttackCoord([1, 2]);
    const [y, x] = gameboard.getComputerAttackMedium();
    expect(y).toBe(0);
    expect(x).toBe(2);
  });
});

describe('isValidPosition method', () => {
  let board;
  beforeEach(() => {
    board = new Gameboard();
  });

  it('Returns false for a ship trying to be placed off the board', () => {
    expect(board.placeShip([0, 9], new Ship('cruiser'))).toBe(false);
  });

  it('Returns false for ship trying to be placed ontop another', () => {
    board.placeShip([0, 0], new Ship('cruiser'));
    expect(board.placeShip([0, 0], new Ship('destroyer'))).toBe(false);
  });

  it('Returns true in any other valid cases', () => {
    expect(board.placeShip([0, 0], new Ship('cruiser'))).toBe(true);
  });

  it('Calls the Ship getLength method', () => {
    const spy = jest.spyOn(Ship.prototype, 'getLength');
    board.placeShip([0, 0], new Ship('cruiser'));
    expect(spy).toHaveBeenCalled();
  });
});
