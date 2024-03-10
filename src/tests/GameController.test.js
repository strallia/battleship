import Gameboard from '../classes/Gameboard';
import { playRound } from '../classes/GameController';

beforeAll(() => {
  jest.spyOn(Gameboard.prototype, 'receiveAttack').mockImplementation();
});

describe('playRound method', () => {
  it('Calls receiveAttack method', () => {
    const board = new Gameboard();
    const spy = jest.spyOn(board, 'receiveAttack');
    playRound();
    expect(spy).toHaveBeenCalled();
  });
});
