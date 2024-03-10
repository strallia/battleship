import Gameboard from '../classes/Gameboard';
import { playRound } from '../modules/GameController';

beforeAll(() => {
  jest.spyOn(Gameboard.prototype, 'receiveAttack').mockImplementation();
  jest.spyOn(Gameboard.prototype, 'getComputerAttack').mockImplementation();
});

describe('Playing a round', () => {
  it("Calls receiveAttack method on computers's board", () => {
    const spy = jest.spyOn(Gameboard.prototype, 'receiveAttack');
    playRound();
    expect(spy).toHaveBeenCalled();
  });

  it("Calls getComputerAttack method on player's board", () => {
    const spy = jest.spyOn(Gameboard.prototype, 'getComputerAttack');
    playRound();
    expect(spy).toHaveBeenCalled();
  });
});
