import Ship from '../classes/Ship';

test('Hitting ship increments its hit score by one per hit', () => {
  const ship = new Ship();
  ship.hit();
  ship.hit();
  expect(ship.hits).toBe(2);
});

test('Ship returns accurate sunk status', () => {
  const ship = new Ship();
  expect(ship.isSunk).toBe(false);
});
