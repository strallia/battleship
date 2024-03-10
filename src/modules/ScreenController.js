import { getBoard } from './GameController';

const shipsBoardDiv = document.querySelector('.ships.board');
const attacksBoardDiv = document.querySelector('.attacks.board');

const updateScreen = () => {
  // reload active player's boards
  const activePlayerBoard = getBoard();

  activePlayerBoard.forEach((row, rowIndex) => {
    row.forEach((column, columnIndex) => {
      const shipBoardButton = document.createElement('button');
      const attackBoardButton = document.createElement('button');

      // color ships
      const square = activePlayerBoard[rowIndex][columnIndex];
      const hasShip = square === null ? false : Object.hasOwn(square, 'ship');
      if (hasShip) {
        shipBoardButton.classList.add('ship');
      }

      shipsBoardDiv.appendChild(shipBoardButton);
      attacksBoardDiv.appendChild(attackBoardButton);
    });
  });
};
updateScreen();

const handleBoardClick = () => {};
