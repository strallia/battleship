import Ship from '../classes/Ship';

describe('getName of ship method', () => {
  it('New ship instance with argument "battleship" returns ship with same name', () => {
    const battleship = new Ship('battleship');
    expect(battleship.getName()).toBe('battleship');
  });

  it('New ship instance with argument "cruiser" returns ship with same name', () => {
    const cruiser = new Ship('cruiser');
    expect(cruiser.getName()).toBe('cruiser');
  });
});

describe('hit ship method', () => {
  it('Increments hit score by one each time when ship hit', () => {
    const ship = new Ship('destroyer');
    ship.hit();
    ship.hit();
    expect(ship.getHits()).toBe(2);
  });
});

describe('getLength of ship method', () => {
  it('Builds battleship of length 4', () => {
    const ship = new Ship('battleship');
    expect(ship.getLength()).toBe(4);
  });

  it('Builds cruiser of length 3', () => {
    const cruiser = new Ship('cruiser');
    expect(cruiser.getLength()).toBe(3);
  });
});

describe('isSunk method', () => {
  it('Returns false when ship has not sunk', () => {
    const ship = new Ship('cruiser');
    expect(ship.isSunk()).toBe(false);
  });

  it('Returns true when ship has sunk', () => {
    const ship = new Ship('destroyer');
    ship.hit();
    ship.hit();
    expect(ship.isSunk()).toBe(true);
  });
});
