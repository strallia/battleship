import Gameboard from '../classes/Gameboard';
import Player from '../classes/Player';
import Ship from '../classes/Ship';
import {
  gameScreen,
  menuScreen,
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

let enemy = players[1];

const getEnemy = () => enemy;

const switchEnemy = () => {
  enemy = enemy === players[0] ? players[1] : players[0];
};

let gameDifficulty = 'easy';

const setGameDifficulty = (string) => {
  gameDifficulty = string;
};

const playPlayerAttack = (coord) => players[1].gameboard.receiveAttack(coord);

let computersAttackCoord = [null, null];
const playComputerAttack = () => {
  if (gameDifficulty === 'easy')
    computersAttackCoord = players[0].gameboard.getComputerAttackRandom();
  else computersAttackCoord = players[0].gameboard.getComputerAttackMedium();
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
  [null, null].map((_) => Math.floor(Math.random() * 10));

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

const announcementDiv = document.querySelector('.announcement');
const showSelectScreen = (string) => {
  if (string === 'game') {
    placeShipsScreen.classList.add('hidden');
    gameScreen.classList.remove('hidden');
  } else if (string === 'winner') {
    gameScreen.classList.add('hidden');
    winnerScreen.classList.remove('hidden');
  } else if (string === 'menu') {
    announcementDiv.classList.add('hidden');
    winnerScreen.classList.add('hidden');
    menuScreen.classList.remove('hidden');
  } else if (string === 'place ships') {
    menuScreen.classList.add('hidden');
    announcementDiv.classList.remove('hidden');
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
  setGameDifficulty,
};
