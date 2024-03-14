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
    battleship.toggleDirection();
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
    battleship.toggleDirection();
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
    destroyer.toggleDirection();
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

describe("Getting computer's attack", () => {
  const gameboard = new Gameboard('Leah');
  let coord;
  afterAll(() => {
    jest.restoreAllMocks();
  });

  it('Calls Math.random', () => {
    const spyMathRandom = jest.spyOn(global.Math, 'random');
    gameboard.getComputerAttack();
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
    coord = gameboard.getComputerAttack();
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
    gameboard.getComputerAttack();
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
