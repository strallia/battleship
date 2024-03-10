import Gameboard from './Gameboard';
import Player from './Player';

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

let activePlayer = player[0];

const getActivePlayer = () => activePlayer;

const switchPlayerTurn = () => {
  activePlayer = activePlayer === player[0] ? player[1] : player[0];
};

const playRound = () => {};
