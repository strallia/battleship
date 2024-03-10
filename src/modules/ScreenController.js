import { getBoard, playRound } from './GameController';

const shipsBoardDiv = document.querySelector('.ships.board');
const attacksBoardDiv = document.querySelector('.attacks.board');

const updateScreen = () => {
  // clear out all boards
  shipsBoardDiv.textContent = '';
  attacksBoardDiv.textContent = '';

  // reload active player's boards
  const activePlayerBoard = getBoard();
  activePlayerBoard.forEach((row, rowIndex) => {
    row.forEach((column, columnIndex) => {
      const shipsBoardButton = document.createElement('button');
      const attacksBoardButton = document.createElement('button');

      // color ships
      const square = activePlayerBoard[rowIndex][columnIndex];
      const hasShip = square === null ? false : Object.hasOwn(square, 'ship');
      if (hasShip) {
        shipsBoardButton.classList.add('ship');
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
