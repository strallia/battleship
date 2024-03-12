import Gameboard from '../classes/Gameboard';
import Player from '../classes/Player';
import Ship from '../classes/Ship';

const players = [
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
  players[0].gameboard.placeShip([1, 2], new Ship('carrier'), false);
  players[0].gameboard.placeShip([6, 9], new Ship('battleship'), false);
  players[0].gameboard.placeShip([5, 3], new Ship('cruiser'), false);
  players[0].gameboard.placeShip([0, 9], new Ship('submarine'), false);
  players[0].gameboard.placeShip([1, 7], new Ship('destroyer'), false);

  players[1].gameboard.placeShip([1, 2], new Ship('carrier'), false);
  players[1].gameboard.placeShip([3, 9], new Ship('battleship'), false);
  players[1].gameboard.placeShip([6, 7], new Ship('cruiser'), false);
  players[1].gameboard.placeShip([2, 5], new Ship('submarine'), false);
  players[1].gameboard.placeShip([8, 3], new Ship('destroyer'), false);
};
placeShips();
const placeHits = () => {
  players[1].gameboard.receiveAttack([9, 9]);
  players[1].gameboard.receiveAttack([1, 2]);
  players[1].gameboard.receiveAttack([8, 3]);

  for (let i = 0; i < 10; i += 1) {
    for (let j = 0; j < 10; j += 1) {
      if (i === 2 && j === 7) continue;
      if (i === 3 && j === 3) continue;
      players[0].gameboard.receiveAttack([i, j]);
    }
  }
};
placeHits();
console.log('player', players[0].gameboard.board);
console.log('computer', players[1].gameboard.board);

let winner = null;

const getWinner = () => winner;

const setWinner = (playerObj) => {
  winner = playerObj;
};

let enemy = players[1];

const getEnemy = () => enemy;

const switchEnemy = () => {
  enemy = enemy === players[0] ? players[1] : players[0];
};

const playPlayerAttack = (coord) => {
  players[1].gameboard.receiveAttack(coord);
  console.log('attacked computer', players[1].gameboard.board);
};

let computersAttackCoord = [null, null];
const playComputerAttack = () => {
  computersAttackCoord = players[0].gameboard.getComputerAttack();
  console.log('computer attacked me', players[0].gameboard.board);
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
  players,
  getEnemy,
  playPlayerAttack,
  playComputerAttack,
  getAnnouncement,
  switchEnemy,
};
