import Gameboard from '../classes/Gameboard';
import Ship from '../classes/Ship';
import {
  addRandomShipPlacement,
  getGameAnnouncement,
  getEnemy,
  playComputerAttack,
  playPlayerAttack,
  switchEnemy,
} from '../modules/GameController';

beforeAll(() => {
  jest.spyOn(Gameboard.prototype, 'receiveAttack').mockImplementation();
  jest
    .spyOn(Gameboard.prototype, 'getComputerAttackRandom')
    .mockImplementation();
});

describe('getEnemy function', () => {
  it('Returns a player object with player and gameboard properties', () => {
    const enemy = getEnemy();
    expect(enemy.player).toBeTruthy();
    expect(enemy.gameboard).toBeTruthy();
  });
});

describe('switchEnemy function', () => {
  it('Swaps enemy to other player', () => {
    const prevEnemy = getEnemy();
    switchEnemy();
    const currentEnemy = getEnemy();
    expect(prevEnemy).not.toBe(currentEnemy);
  });
});

describe('playPlayerAttack function', () => {
  it("calls receiveAttack method on computer's board", () => {
    const spy = jest.spyOn(Gameboard.prototype, 'receiveAttack');
    playPlayerAttack();
    expect(spy).toHaveBeenCalled();
  });
});

describe('playComputerAttack function', () => {
  it("calls getComputerAttackRandom method on player's board", () => {
    const spy = jest.spyOn(Gameboard.prototype, 'getComputerAttackRandom');
    playComputerAttack();
    expect(spy).toHaveBeenCalled();
  });
});

describe('getGameAnnouncement function', () => {
  beforeAll(() => {
    const board = new Gameboard();
    board.placeShip([0, 0], new Ship('battleship'), false);
    board.receiveAttack([0, 0]);
  });

  it('Always returns a string with or without argument', () => {
    const resultWithArg = getGameAnnouncement([0, 0]);
    expect(typeof resultWithArg).toBe('string');
    const resultWithoutArg = getGameAnnouncement();
    expect(typeof resultWithoutArg).toBe('string');
  });

  // TODO: write test for conditional string returns
  // it('Returns string "Computer sunk your (Ship name)" if Computer\'s recent attack sunk a ship', () => {
  //   const string = getGameAnnouncement([0,0])
  //   expect(string).toBe('Computer sunk your battleship');
  // });
});

describe('addRandomShipPlacement function', () => {
  it('Randomly places all 5 ships on a given gameboard', () => {
    const board = new Gameboard();
    addRandomShipPlacement(board);
    expect(board.ships.length).toBe(5);
  });
});
