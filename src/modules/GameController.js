import Gameboard from '../classes/Gameboard';
import Player from '../classes/Player';
import Ship from '../classes/Ship';

const player = [
  {
    player: new Player('Leah'),
    gameboard: new Gameboard(),
  },
  {
    player: new Player('Computer'),
    gameboard: new Gameboard(),
  },
];

// Only for building initial UI. Places ships on both player's boards.
const placeShips = () => {
  player[0].gameboard.placeShip([1, 2], new Ship('carrier'), false);
  player[0].gameboard.placeShip([6, 9], new Ship('battleship'), false);
  player[0].gameboard.placeShip([5, 3], new Ship('cruiser'), false);
  player[0].gameboard.placeShip([0, 9], new Ship('submarine'), false);
  player[0].gameboard.placeShip([1, 7], new Ship('destroyer'), false);

  player[1].gameboard.placeShip([1, 2], new Ship('carrier'), false);
  player[1].gameboard.placeShip([3, 9], new Ship('battleship'), false);
  player[1].gameboard.placeShip([6, 7], new Ship('cruiser'), false);
  player[1].gameboard.placeShip([2, 5], new Ship('submarine'), false);
  player[1].gameboard.placeShip([8, 3], new Ship('destroyer'), false);
};
placeShips();
const placeHits = () => {
  player[1].gameboard.receiveAttack([9, 9]);
  player[1].gameboard.receiveAttack([1, 2]);
  player[1].gameboard.receiveAttack([8, 3]);

  for (let i = 0; i < 10; i += 1) {
    for (let j = 0; j < 10; j += 1) {
      if (i === 2 && j === 7) continue;
      player[0].gameboard.receiveAttack([i, j]);
    }
  }
};
placeHits();
console.log('player', player[0].gameboard.board);
console.log('computer', player[1].gameboard.board);

let enemy = player[1];

const getEnemy = () => enemy;

const switchEnemy = () => {
  enemy = enemy === player[0] ? player[1] : player[0];
};

const playPlayerAttack = (coord) => {
  player[1].gameboard.receiveAttack(coord);
  console.log('attacked computer', player[1].gameboard.board);
};

let computersAttackCoord = [null, null];
const playComputerAttack = () => {
  computersAttackCoord = player[0].gameboard.getComputerAttack();
  console.log('computer attacked me', player[0].gameboard.board);
};

const getAnnouncement = function getStringForAnnouncement(
  attackedCoord = computersAttackCoord,
) {
  // find attacked square with it's data object
  const [y, x] = attackedCoord;
  const attackedSquare = getEnemy().gameboard.board[y][x];

  // get nouns for string interpolation
  const attacker = arguments.length === 0 ? 'Computer' : 'You';
  const receiver = attacker === 'Computer' ? 'your' : "Computer's";

  // if attack sunk enemy's last ship
  const hasShip =
    attackedSquare === null ? false : Object.hasOwn(attackedSquare, 'ship');
  if (hasShip && getEnemy().gameboard.allShipsDown()) {
    return `${attacker} win${attacker === 'Computer' ? "'s" : ''}!`;
  }

  // if attack sunk enemy's ship
  if (hasShip) {
    const { ship } = attackedSquare;
    const shipName = ship.getName();
    if (ship.isSunk()) return `${attacker} sunk ${receiver} ${shipName}`;
  }

  return '';
};

export {
  player,
  getEnemy,
  playPlayerAttack,
  playComputerAttack,
  getAnnouncement,
  switchEnemy,
};
