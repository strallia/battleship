import Player from '../classes/Player';
import Gameboard from '../classes/Gameboard';

it("Returns player's name", () => {
  const player1 = new Player('Leah');
  expect(player1.name).toBe('Leah');
});

it("Returns player's own board", () => {
  const player1 = new Player('Leah');
  expect(player1.getBoard()).toBeInstanceOf(Gameboard);
});

it("Each players's board is a separate gameboard instance", () => {
  const player1 = new Player('Leah');
  const player2 = new Player('Bob');
  expect(player1.getBoard()).not.toBe(player2.getBoard());
});
