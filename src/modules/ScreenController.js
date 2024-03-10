import { getBoard } from './GameController';

const shipsBoardDiv = document.querySelector('.ships-board');
const attacksBoardDiv = document.querySelector('.attacks-board');

const updateScreen = () => {
  // reload active player's boards
  const activePlayerBoard = getBoard();

  activePlayerBoard.forEach((row) => {
    row.forEach((square) => {
      const shipBoardButton = document.createElement('button');
      const attackBoardButton = document.createElement('button');
      shipsBoardDiv.appendChild(shipBoardButton);
      attacksBoardDiv.appendChild(attackBoardButton);
    });
  });
};
updateScreen();

const handleBoardClick = () => {};
