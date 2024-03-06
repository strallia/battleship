import Ship from '../classes/Ship';
import Gameboard from '../classes/Gameboard';

describe('Reset board after each test', () => {
  afterEach(() => {
    Gameboard.resetBoard();
  });

  const battleship = new Ship(4);

  it('Places battleship on board vertically', () => {
    const clickedCoord = [1, 2]; // [y(row), x(column)]
    Gameboard.placeShip(clickedCoord, battleship);
    expect(Gameboard.board[1][2]);
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

// describe('Using only single board', () => {
//   afterAll(() => {
//     Gameboard.resetBoard();
//   });

//   const battleship = new Ship(4);
//   const cruiser = new Ship(3);

//   it('Does not allow placement of ships ontop another', () => {});
// });
