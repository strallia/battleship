import {
  getAnnouncement,
  playComputerAttack,
  players,
  playPlayerAttack,
  switchEnemy,
} from './GameController';

const shipsBoardDiv = document.querySelector('.ships.board');
const attacksBoardDiv = document.querySelector('.attacks.board');
const announcementDiv = document.querySelector('.announcement');

const updateShipsBoard = () => {
  // clear board
  shipsBoardDiv.textContent = '';

  // load each square
  const playerBoard = players[0].gameboard.board;
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

const updateAttacksBoard = () => {
  // clear board
  attacksBoardDiv.textContent = '';

  // load each square
  const computerBoard = players[1].gameboard.board;
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

const updateAnnouncement = (string) => {
  announcementDiv.textContent = string;
};

const disableAttacksBoard = () => {
  attacksBoardDiv.classList.add('disable-pointer');
};

const enableAttacksBoard = () => {
  attacksBoardDiv.classList.remove('disable-pointer');
};

const delay = (msec) => new Promise((res) => setTimeout(res, msec));

const handleAttacksBoardClick = async (targetSquare) => {
  // disable clicks until round completes
  disableAttacksBoard();

  // run player's attack
  const { y, x } = targetSquare.dataset;
  playPlayerAttack([y, x]);
  updateAttacksBoard();

  // announce if player sunk computer's ship
  const firstAnnouncement = getAnnouncement([y, x]);
  if (firstAnnouncement) {
    updateAnnouncement(firstAnnouncement);
    await delay(1000);
  }
  switchEnemy();

  // announce waiting for computer's attack
  updateAnnouncement('Waiting for Computer...');
  await delay(1000);

  // run computer's attack
  playComputerAttack();
  updateShipsBoard();

  // announce if computer sunk player's ship
  const secondAnnouncement = getAnnouncement();
  if (secondAnnouncement) {
    updateAnnouncement(secondAnnouncement);
    await delay(1000);
  }
  switchEnemy();

  // announce player's turn to attack
  updateAnnouncement('Send your attack');
  switchEnemy();

  enableAttacksBoard();
};
attacksBoardDiv.addEventListener('click', (e) => {
  const targetClasses = e.target.classList;
  if (!targetClasses.contains('hit') && !targetClasses.contains('miss'))
    handleAttacksBoardClick(e.target);
});

// setup initial render
updateShipsBoard();
updateAttacksBoard();
updateAnnouncement('Send your attack');
