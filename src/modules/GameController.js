import Gameboard from '../classes/Gameboard';
import Player from '../classes/Player';
import Ship from '../classes/Ship';

const player = [
  {
    player: new Player('Leah'),
    board: new Gameboard(),
  },
  {
    player: new Player('Elly'),
    board: new Gameboard(),
  },
];

// Only for building initial UI. Places ships on both player's boards.
const placeShips = () => {
  player[0].board.placeShip([1, 2], new Ship(5), false);
  player[0].board.placeShip([6, 9], new Ship(4), false);
  player[0].board.placeShip([5, 3], new Ship(3), false);
  player[0].board.placeShip([0, 9], new Ship(3), false);
  player[0].board.placeShip([1, 7], new Ship(2), false);

  player[1].board.placeShip([1, 2], new Ship(5), false);
  player[1].board.placeShip([3, 9], new Ship(4), false);
  player[1].board.placeShip([6, 7], new Ship(3), false);
  player[1].board.placeShip([2, 5], new Ship(3), false);
  player[1].board.placeShip([8, 3], new Ship(2), false);
};
console.log(player[0].board.board);
console.log(player[1].board.board);
placeShips();

let activePlayer = player[0];

const getActivePlayer = () => activePlayer;

const getBoard = () => activePlayer.board.board;

const switchPlayerTurn = () => {
  activePlayer = activePlayer === player[0] ? player[1] : player[0];
};

const playRound = (coord) => {
  // send attack to enemy's board
  const enemy = (activePlayer === player[0] ? player[1] : player[0]).board;
  enemy.receiveAttack(coord);

  switchPlayerTurn();
};

export { playRound, getBoard };
