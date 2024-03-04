import Ship from '../classes/Ship';

test('Hitting ship increments its hit score by one per hit', () => {
  const ship = new Ship();
  ship.hit();
  ship.hit();
  expect(ship.hits).toBe(2);
});

test('Un-sunken ship returns accurate sunk status', () => {
  const ship = new Ship();
  expect(ship.isSunk()).toBe(false);
});

test('Sunken ship returns accurate sunk status', () => {
  const destoryer = new Ship('destroyer');
  destoryer.hit();
  destoryer.hit();
  expect(destoryer.isSunk()).toBe(true);
});

test('Cruiser has length of 3', () => {
  const cruiser = new Ship('cruiser');
  expect(cruiser.length).toBe(3);
});

test('Carrier has length of 5', () => {
  const carrier = new Ship('carrier');
  expect(carrier.length).toBe(5);
});
