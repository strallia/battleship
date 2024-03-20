import Gameboard from '../classes/Gameboard';
import Player from '../classes/Player';
import Ship from '../classes/Ship';
import {
  announcementDiv,
  gameScreen,
  placeShipsScreen,
  winnerScreen,
} from './DOMscreens';

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

const getGameAnnouncement = function getStringForGameAnnouncement(
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

const getRandomCoord = () =>
  [null, null].map((item) => Math.floor(Math.random() * 10));

const addRandomShipPlacement = (gameboard) => {
  const shipNames = [
    'carrier',
    'battleship',
    'cruiser',
    'submarine',
    'destroyer',
  ];
  const shipDirectionOptions = ['horizontal', 'vertical'];
  while (shipNames.length > 0) {
    const randomCoord = getRandomCoord();
    const ship = new Ship(shipNames.at(-1));
    ship.setDirection(shipDirectionOptions[Math.floor(Math.random() * 2)]);
    const isValidShipPlacement = gameboard.placeShip(randomCoord, ship);
    if (isValidShipPlacement) shipNames.pop();
  }
};

const delay = (msec) => new Promise((res) => setTimeout(res, msec));

const showSelectScreen = (string) => {
  if (string === 'game') {
    placeShipsScreen.classList.add('hidden');
    gameScreen.classList.remove('hidden');
  } else if (string === 'winner') {
    gameScreen.classList.add('hidden');
    winnerScreen.classList.remove('hidden');
  } else if (string === 'place ships') {
    winnerScreen.classList.add('hidden');
    placeShipsScreen.classList.remove('hidden');
  }
};

const updateAnnouncement = (string) => {
  announcementDiv.textContent = string;
};

export {
  players,
  getEnemy,
  playPlayerAttack,
  playComputerAttack,
  getGameAnnouncement,
  switchEnemy,
  addRandomShipPlacement,
  delay,
  showSelectScreen,
  updateAnnouncement,
};
