import Player from '../classes/Player';

it('Returns players name', () => {
  const player1 = new Player('Leah');
  expect(player1.getName()).toBe('Leah');
});
