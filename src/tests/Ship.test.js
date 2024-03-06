import Ship from '../classes/Ship';

it('Increments hit score by one each time when ship hit', () => {
  const ship = new Ship();
  ship.hit();
  ship.hit();
  expect(ship.hits).toBe(2);
});

it('Builds ship of length 5', () => {
  const ship = new Ship(5);
  expect(ship.length).toBe(5);
});

it('Returns false when ship has not sunk', () => {
  const ship = new Ship(3);
  expect(ship.isSunk()).toBe(false);
});

it('Returns true when ship has sunk', () => {
  const ship = new Ship(1);
  ship.hit();
  expect(ship.isSunk()).toBe(true);
});
