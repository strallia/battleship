import {
  delay,
  getAnnouncement,
  playComputerAttack,
  player,
  playPlayerAttack,
  switchEnemy,
} from './GameController';

const shipsBoardDiv = document.querySelector('.ships.board');
const updateShipsBoard = () => {
  // clear board
  shipsBoardDiv.textContent = '';

  // load each square
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
};
updateShipsBoard();

const attacksBoardDiv = document.querySelector('.attacks.board');
const updateAttacksBoard = () => {
  // clear board
  attacksBoardDiv.textContent = '';

  // load each square
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
updateAttacksBoard();

const announcementDiv = document.querySelector('.announcement');
const updateAnnouncement = (string) => {
  announcementDiv.textContent = string;
};
updateAnnouncement('Send your attack');

const handleAttacksBoardClick = async (targetSquare) => {
  // run player's attack
  const { y, x } = targetSquare.dataset;
  playPlayerAttack([y, x]);
  updateAttacksBoard();

  // update announcement
  updateAnnouncement(getAnnouncement([y, x]));
  switchEnemy();
  await delay(1000);

  // announce waiting for computer's attack
  updateAnnouncement('Waiting for Computer...');
  await delay(1000);

  // run computer's attack
  playComputerAttack();
  updateShipsBoard();

  // update announcement
  updateAnnouncement('Send your attack');
  switchEnemy();
};
attacksBoardDiv.addEventListener('click', (e) =>
  handleAttacksBoardClick(e.target),
);
