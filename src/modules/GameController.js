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
  player[0].gameboard.placeShip([1, 2], new Ship(5), false);
  player[0].gameboard.placeShip([6, 9], new Ship(4), false);
  player[0].gameboard.placeShip([5, 3], new Ship(3), false);
  player[0].gameboard.placeShip([0, 9], new Ship(3), false);
  player[0].gameboard.placeShip([1, 7], new Ship(2), false);

  player[1].gameboard.placeShip([1, 2], new Ship(5), false);
  player[1].gameboard.placeShip([3, 9], new Ship(4), false);
  player[1].gameboard.placeShip([6, 7], new Ship(3), false);
  player[1].gameboard.placeShip([2, 5], new Ship(3), false);
  player[1].gameboard.placeShip([8, 3], new Ship(2), false);
};
placeShips();
const placeHits = () => {
  player[1].gameboard.receiveAttack([9, 9]);
  player[1].gameboard.receiveAttack([1, 2]);
  player[1].gameboard.receiveAttack([8, 3]);

  player[0].gameboard.receiveAttack([0, 0]);
  player[0].gameboard.receiveAttack([3, 8]);
  player[0].gameboard.receiveAttack([9, 9]);
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

const getAnnouncement = function getStringForAnnouncement(attackedCoord) {
  let coord;
  if (arguments.length === 0) coord = computersAttackCoord;
  else coord = attackedCoord;
  const [y, x] = coord;
  const enemySquare = getEnemy().gameboard.board[y][x];

  // return string for sinking enemy's ships
  const hasShip =
    enemySquare === null ? false : Object.hasOwn(enemySquare, 'ship');
  if (hasShip) {
    const { ship } = enemySquare;
    const attacker =
      coord[0] === computersAttackCoord[0] &&
      coord[1] === computersAttackCoord[1]
        ? 'Computer'
        : 'You';
    const receiver = attacker === 'Computer' ? 'your' : "Computer's";
    if (ship.isSunk()) return `${attacker} sunk ${receiver} ship`;
  }
  return '';
};

export {
  player,
  playPlayerAttack,
  playComputerAttack,
  getAnnouncement,
  switchEnemy,
};
