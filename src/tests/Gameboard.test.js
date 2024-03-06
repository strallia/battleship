import Ship from '../classes/Ship';
import Gameboard from '../classes/Gameboard';

it('Places battleship on board vertically', () => {
  const battleship = new Ship(5);
  const clickedCoord = [1, 2]; // [y(row), x(column)]
  Gameboard.placeShip(clickedCoord, battleship);
  expect(Gameboard.board[1][2]);
  expect(Gameboard.board[2][2]).toBeInstanceOf(Ship);
  expect(Gameboard.board[3][2]).toBeInstanceOf(Ship);
  expect(Gameboard.board[4][2]).toBeInstanceOf(Ship);
  expect(Gameboard.board[5][2]).toBeInstanceOf(Ship);
});

it('Places battleship on board horizontally', () => {
  const battleship = new Ship(5);
  const clickedCoord = [1, 2];
  Gameboard.placeShip(clickedCoord, battleship, 'horizontal');
  expect(Gameboard.board[1][2]).toBeInstanceOf(Ship);
  expect(Gameboard.board[1][3]).toBeInstanceOf(Ship);
  expect(Gameboard.board[1][4]).toBeInstanceOf(Ship);
  expect(Gameboard.board[1][5]).toBeInstanceOf(Ship);
  expect(Gameboard.board[1][6]).toBeInstanceOf(Ship);
});
