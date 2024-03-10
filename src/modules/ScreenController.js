import { player, playRound } from './GameController';

const shipsBoardDiv = document.querySelector('.ships.board');
const attacksBoardDiv = document.querySelector('.attacks.board');

const updateScreen = () => {
  // clear boards
  shipsBoardDiv.textContent = '';
  attacksBoardDiv.textContent = '';

  // reload active player's boards
  const playerBoard = player[0].board.board;
  playerBoard.forEach((row, rowIndex) => {
    row.forEach((column, columnIndex) => {
      const shipsBoardButton = document.createElement('button');
      const attacksBoardButton = document.createElement('button');

      // color ships
      const square = playerBoard[rowIndex][columnIndex];
      const hasShip = square === null ? false : Object.hasOwn(square, 'ship');
      if (hasShip) {
        shipsBoardButton.classList.add('ship');
      }

      // color hit and missed attacks
      const hasAttackStatus =
        square === null ? false : Object.hasOwn(square, 'attackStatus');
      if (hasAttackStatus) {
        const { attackStatus } = square;
        attacksBoardButton.classList.add(attackStatus);
      }

      // add data attributes for coordinates
      shipsBoardButton.dataset.y = rowIndex;
      shipsBoardButton.dataset.x = columnIndex;
      attacksBoardButton.dataset.y = rowIndex;
      attacksBoardButton.dataset.x = columnIndex;

      shipsBoardDiv.appendChild(shipsBoardButton);
      attacksBoardDiv.appendChild(attacksBoardButton);
    });
  });
};
updateScreen();

const handleBoardClick = (targetSquare) => {
  const { y, x } = targetSquare.dataset;
  playRound([y, x]);
  updateScreen();
};
attacksBoardDiv.addEventListener('click', (e) => handleBoardClick(e.target));
