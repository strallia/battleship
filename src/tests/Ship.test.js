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

test('Cruiser has length of 3', () => {
  const cruiser = new Ship('cruiser');
  expect(cruiser.length).toBe(5);
});

test('Carrier has length of 5', () => {
  const carrier = new Ship('carrier');
  expect(carrier.length).toBe(5);
});
