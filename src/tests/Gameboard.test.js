import Ship from '../classes/Ship';
import Gameboard from '../classes/Gameboard';

describe('Reset board after each test to check for valid ship placement', () => {
  afterEach(() => {
    Gameboard.resetBoard();
  });

  const battleship = new Ship(4);

  it('Places battleship on board vertically', () => {
    const clickedCoord = [1, 2]; // [y(row), x(column)]
    Gameboard.placeShip(clickedCoord, battleship);
    expect(Gameboard.board[1][2]).toBeInstanceOf(Ship);
    expect(Gameboard.board[2][2]).toBeInstanceOf(Ship);
    expect(Gameboard.board[3][2]).toBeInstanceOf(Ship);
    expect(Gameboard.board[4][2]).toBeInstanceOf(Ship);
  });

  it('Places battleship on board horizontally', () => {
    const clickedCoord = [1, 2];
    Gameboard.placeShip(clickedCoord, battleship, true);
    expect(Gameboard.board[1][2]).toBeInstanceOf(Ship);
    expect(Gameboard.board[1][3]).toBeInstanceOf(Ship);
    expect(Gameboard.board[1][4]).toBeInstanceOf(Ship);
    expect(Gameboard.board[1][5]).toBeInstanceOf(Ship);
  });

  it('Does not allow placement of horizontal ship past right side of board', () => {
    const clickedCoord = [3, 9];
    expect(Gameboard.placeShip(clickedCoord, battleship, true)).toBe(false);
  });

  it('Does not allow placement of vertical ship past bottom side of board', () => {
    const clickedCoord = [9, 2];
    expect(Gameboard.placeShip(clickedCoord, battleship, false)).toBe(false);
  });
});

describe('Using only single board to check for overlapping ship placement', () => {
  afterAll(() => {
    Gameboard.resetBoard();
  });

  const battleship = new Ship(4);
  const cruiser = new Ship(3);

  it('Does not allow placement of horizontal ship ontop another', () => {
    const clickedCoord = [1, 2];
    Gameboard.placeShip(clickedCoord, battleship, true);
    expect(Gameboard.placeShip(clickedCoord, cruiser, true)).toBe(false);
  });

  it('Does not allow placement of vertical ship ontop another', () => {
    const clickedCoord = [1, 2];
    Gameboard.placeShip(clickedCoord, battleship, true);
    expect(Gameboard.placeShip(clickedCoord, cruiser, false)).toBe(false);
  });
});

describe('Handling attacks', () => {
  const cruiser = new Ship(3);
  beforeEach(() => {
    Gameboard.placeShip([2, 4], cruiser, false);
  });
  afterEach(() => {
    Gameboard.resetBoard();
  });

  it('receiveAttack returns true when its a hit', () => {
    expect(Gameboard.receiveAttack([2, 4])).toBe(true);
  });

  it('receiveAttack returns false when its a miss', () => {
    expect(Gameboard.receiveAttack([1, 4])).toBe(false);
  });

  // it("Ship's hit score returns 1 when hit once", () => {
  //   Gameboard.receiveAttack([2, 4]);
  //   expect(cruiser.getHits()).toBe(1);
  // });

  // it("Ship's hit score returns 2 when hit twice", () => {
  //   Gameboard.receiveAttack([2, 4]);
  //   Gameboard.receiveAttack([3, 4]);
  //   expect(cruiser.hits).toBe(1);
  // });

  // it('Records on square that a successful attack was a hit');
  // it('Records on square that an unsuccessful attack was a miss');
  // it('Does not allow attack on prviously attacked square');
});
