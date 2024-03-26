import Gameboard from '../classes/Gameboard';
import Ship from '../classes/Ship';
import {
  addRandomShipPlacement,
  getEnemy,
  playComputerAttack,
  playPlayerAttack,
  switchEnemy,
  setGameDifficulty,
  delay,
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
  it("calls getComputerAttackRandom method on player's board in easy difficulty mode", () => {
    const spy = jest.spyOn(Gameboard.prototype, 'getComputerAttackRandom');
    playComputerAttack();
    expect(spy).toHaveBeenCalled();
  });
  it("calls getComputerAttackMedium method on player's board in medium difficulty mode", () => {
    const spy = jest.spyOn(Gameboard.prototype, 'getComputerAttackMedium');
    setGameDifficulty('medium');
    playComputerAttack();
    expect(spy).toHaveBeenCalled();
  });
});

describe('addRandomShipPlacement function', () => {
  it('Randomly places all 5 ships on a given gameboard', () => {
    const board = new Gameboard();
    addRandomShipPlacement(board);
    expect(board.ships.length).toBe(5);
  });
  it('Calls setDirection method', () => {
    const spy = jest.spyOn(Ship.prototype, 'setDirection');
    const board = new Gameboard();
    addRandomShipPlacement(board);
    expect(spy).toHaveBeenCalled();
  });
  it('Calls placeShip method', () => {
    const spy = jest.spyOn(Gameboard.prototype, 'placeShip');
    const board = new Gameboard();
    addRandomShipPlacement(board);
    expect(spy).toHaveBeenCalled();
  });
});

describe('delay function', () => {
  it('Returns a promise', () => {
    const result = delay(0);
    expect(result).toBeInstanceOf(Promise);
  });
});
