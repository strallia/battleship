import Player from '../classes/Player';

it("Returns player's name", () => {
  const player1 = new Player('Leah');
  expect(player1.name).toBe('Leah');
});
