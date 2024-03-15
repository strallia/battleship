import Ship from '../classes/Ship';
import PlaceShipsBoard from '../classes/PlaceShipsBoard';
import Gameboard from '../classes/Gameboard';

let destroyer;
let placeShipsBoard;
beforeEach(() => {
  destroyer = new Ship('destroyer');
  placeShipsBoard = new PlaceShipsBoard();
});

it('Removes a specific ship', () => {
  placeShipsBoard.placeShip([0, 0], destroyer);
  placeShipsBoard.removeShip(destroyer);
  expect(placeShipsBoard.board[0][0]).toBe(null);
  expect(placeShipsBoard.board[0][1]).toBe(null);
});

describe('moveShip method', () => {
  it('Moves a horizontal ship to a different position', () => {
    placeShipsBoard.placeShip([0, 0], destroyer);
    placeShipsBoard.moveShip([0, 0], [1, 0]);

    // expect old position to be empty
    expect(placeShipsBoard.board[0][0]).toBe(null);
    expect(placeShipsBoard.board[0][1]).toBe(null);

    // expect new position to be occupied
    expect(placeShipsBoard.board[1][0]).toBeInstanceOf(Object);
    expect(placeShipsBoard.board[1][1]).toBeInstanceOf(Object);
  });

  it('Moves a vertical ship to a different position', () => {
    destroyer.setDirection('vertical');
    placeShipsBoard.placeShip([0, 0], destroyer);
    placeShipsBoard.moveShip([0, 0], [0, 9]);

    // expect old position to be empty
    expect(placeShipsBoard.board[0][0]).toBe(null);
    expect(placeShipsBoard.board[1][0]).toBe(null);

    // expect new position to be occupied
    expect(placeShipsBoard.board[0][9]).toBeInstanceOf(Object);
    expect(placeShipsBoard.board[1][9]).toBeInstanceOf(Object);
  });

  it('Calls the removeShip method', () => {
    placeShipsBoard.placeShip([0, 0], destroyer);
    const spy = jest.spyOn(PlaceShipsBoard.prototype, 'removeShip');
    placeShipsBoard.moveShip([0, 0], [1, 0]);
    expect(spy).toHaveBeenCalled();
  });

  it('Calls the placeShip method', () => {
    placeShipsBoard.placeShip([0, 0], destroyer);
    const spy = jest.spyOn(Gameboard.prototype, 'placeShip');
    placeShipsBoard.moveShip([0, 0], [1, 0]);
    expect(spy).toHaveBeenCalled();
  });
});
