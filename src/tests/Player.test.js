import Player from '../classes/Player';
import Gameboard from '../classes/Gameboard';

it("Returns player's name", () => {
  const player1 = new Player('Leah');
  expect(player1.name).toBe('Leah');
});

it("Returns player's own board", () => {
  const player1 = new Player('Leah');
  expect(player1.getBoard()).toBeInstanceOf(Array);
});

it("Each players's board is a separate gameboard instance", () => {
  const player1 = new Player('Leah');
  const player2 = new Player('Bob');
  expect(player1.getBoard()).not.toBe(player2.getBoard());
});

describe("Getting computer's attack", () => {
  const player = new Player('Leah');
  let coord;
  afterAll(() => {
    jest.restoreAllMocks();
  });

  it('Calls Math.random', () => {
    const spyMathRandom = jest.spyOn(global.Math, 'random');
    coord = player.getComputerAttack();
    expect(spyMathRandom).toHaveBeenCalled();
  });

  it("Returns a coordinate within the board's range", () => {
    expect(coord).toBeInstanceOf(Array);
    expect(coord.length).toBe(2);
    expect(coord[0]).toBeGreaterThanOrEqual(0);
    expect(coord[0]).toBeLessThanOrEqual(9);
    expect(coord[1]).toBeGreaterThanOrEqual(0);
    expect(coord[1]).toBeLessThanOrEqual(9);
  });

  it("Returns a coordinate that hasn't been attacked", () => {
    // fill board except for one square
    for (let i = 0; i < 10; i += 1) {
      for (let j = 0; j < 10; j += 1) {
        player.gameboard.receiveAttack([i, j]);
      }
    }
    player.getBoard()[0][0] = null;

    // expect to return the only open square
    const [y, x] = player.getComputerAttack();
    expect(y).toBe(0);
    expect(x).toBe(0);
    player.gameboard.resetBoard();
  });

  it("Sends attack to player's board", () => {
    const spyReceiveAttack = jest.spyOn(player.gameboard, 'receiveAttack');
    player.getComputerAttack();
    expect(spyReceiveAttack).toHaveBeenCalled();
  });
});
