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
  player[0].gameboard.receiveAttack([9, 9]);
  player[0].gameboard.receiveAttack([1, 2]);

  player[1].gameboard.receiveAttack([8, 3]);
  player[1].gameboard.receiveAttack([0, 0]);
};
placeHits();
console.log('player', player[0].gameboard.board);
console.log('computer', player[1].gameboard.board);

let activePlayer = player[0];

const getActivePlayer = () => activePlayer;

const getBoard = () => activePlayer.gameboard.board;

const switchPlayerTurn = () => {
  activePlayer = activePlayer === player[0] ? player[1] : player[0];
};

const playRound = (coord) => {
  // send attack to computer's board
  player[1].gameboard.receiveAttack(coord);
  console.log('attacked computer', player[1].gameboard.board);

  // computer attacks player
  player[0].gameboard.getComputerAttack();
  console.log('computer attacked me', player[0].gameboard.board);
};

export { playRound, getBoard, player };
