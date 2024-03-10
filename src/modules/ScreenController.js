import { player, playRound } from './GameController';

const shipsBoardDiv = document.querySelector('.ships.board');
const attacksBoardDiv = document.querySelector('.attacks.board');

const updateScreen = () => {
  // clear boards
  shipsBoardDiv.textContent = '';
  attacksBoardDiv.textContent = '';

  // load player's ships-board
  const playerBoard = player[0].gameboard.board;
  playerBoard.forEach((row, rowIndex) => {
    row.forEach((column, columnIndex) => {
      const square = playerBoard[rowIndex][columnIndex];
      const button = document.createElement('button');

      // render player's ships
      const hasShip = square === null ? false : Object.hasOwn(square, 'ship');
      if (hasShip) {
        button.classList.add('ship');
      }

      // render attacks on player's ships
      const hasAttackStatus =
        square === null ? false : Object.hasOwn(square, 'attackStatus');
      if (hasAttackStatus) {
        const { attackStatus } = square;
        button.classList.add(attackStatus);
      }

      shipsBoardDiv.appendChild(button);
    });
  });

  // load player's attacks-board with attacks to computer
  const computerBoard = player[1].gameboard.board;
  computerBoard.forEach((row, rowIndex) => {
    row.forEach((column, columnIndex) => {
      const square = computerBoard[rowIndex][columnIndex];
      const button = document.createElement('button');

      // render attacks to computer's ships
      const hasAttackStatus =
        square === null ? false : Object.hasOwn(square, 'attackStatus');
      if (hasAttackStatus) {
        const { attackStatus } = square;
        button.classList.add(attackStatus);
      }

      // add data attributes for coordinates
      button.dataset.y = rowIndex;
      button.dataset.x = columnIndex;

      attacksBoardDiv.appendChild(button);
    });
  });
};
updateScreen();

const handleBoardClick = (targetSquare) => {
  const { y, x } = targetSquare.dataset;
  // playRound([y, x]);
  // updateScreen();
};
attacksBoardDiv.addEventListener('click', (e) => handleBoardClick(e.target));

export { updateScreen };
