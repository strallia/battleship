import Ship from '../classes/Ship';
import Gameboard from '../classes/Gameboard';

describe('Check for single ship placement', () => {
  afterEach(() => {
    Gameboard.resetBoard();
  });

  const battleship = new Ship(4);

  it('Places battleship on board vertically', () => {
    const clickedCoord = [1, 2]; // [y(row), x(column)]
    Gameboard.placeShip(clickedCoord, battleship);
    expect(Gameboard.board[1][2]).toBeTruthy();
    expect(Gameboard.board[2][2]).toBeTruthy();
    expect(Gameboard.board[3][2]).toBeTruthy();
    expect(Gameboard.board[4][2]).toBeTruthy();
  });

  it('Places battleship on board horizontally', () => {
    const clickedCoord = [1, 2];
    Gameboard.placeShip(clickedCoord, battleship, true);
    expect(Gameboard.board[1][2]).toBeTruthy();
    expect(Gameboard.board[1][3]).toBeTruthy();
    expect(Gameboard.board[1][4]).toBeTruthy();
    expect(Gameboard.board[1][5]).toBeTruthy();
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

describe('Check for overlapping ship placement', () => {
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
  let cruiser;
  beforeEach(() => {
    cruiser = new Ship(3);
    Gameboard.placeShip([2, 4], cruiser, false);
  });
  afterEach(() => {
    Gameboard.resetBoard();
  });

  it("Ship's hit score returns 1 when hit once", () => {
    Gameboard.receiveAttack([2, 4]);
    expect(cruiser.getHits()).toBe(1);
  });

  it("Ship's hit score returns 2 when hit twice", () => {
    Gameboard.receiveAttack([2, 4]);
    Gameboard.receiveAttack([3, 4]);
    expect(cruiser.getHits()).toBe(2);
  });

  it('Square has attackStatus of "hit" if attack was a hit', () => {
    Gameboard.receiveAttack([2, 4]);
    expect(Gameboard.getAttackStatus([2, 4])).toBe('hit');
  });

  it('Square has attackStatus of "miss" if attack was a miss', () => {
    Gameboard.receiveAttack([0, 4]);
    expect(Gameboard.getAttackStatus([0, 4])).toBe('miss');
  });

  it('Square has attackStatus of null if not previously attacked', () => {
    expect(Gameboard.getAttackStatus([0, 4])).toBe(null);
  });

  it('Does not allow attack on previously attacked square', () => {
    Gameboard.receiveAttack([0, 4]);
    expect(Gameboard.receiveAttack([0, 4])).toBeUndefined();
  });

  it('Sunken ship returns true from isSunk', () => {
    Gameboard.receiveAttack([2, 4]);
    Gameboard.receiveAttack([3, 4]);
    Gameboard.receiveAttack([4, 4]);
    expect(cruiser.isSunk()).toBe(true);
  });

  it('Damaged but un-sunken ship returns false from isSunk', () => {
    Gameboard.receiveAttack([2, 4]);
    Gameboard.receiveAttack([3, 4]);
    expect(cruiser.isSunk()).toBe(false);
  });
});
