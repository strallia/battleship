import {
  addRandomShipPlacement,
  getGameAnnouncement,
  playComputerAttack,
  players,
  playPlayerAttack,
  switchEnemy,
  delay,
  updateAnnouncement,
  showSelectScreen,
} from './GameController';

const shipsBoardDiv = document.querySelector('.ships.board');
const attacksBoardDiv = document.querySelector('.attacks.board');

const updateShipsBoard = () => {
  // clear board
  shipsBoardDiv.textContent = '';

  // load each square
  const playerBoard = players[0].gameboard.board;
  playerBoard.forEach((row, rowIndex) => {
    row.forEach((_, columnIndex) => {
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
    row.forEach((_, columnIndex) => {
      const square = computerBoard[rowIndex][columnIndex];
      const button = document.createElement('button');

      // reveal enemy's sunken ships
      const hasShip = square === null ? false : Object.hasOwn(square, 'ship');
      if (hasShip && square.ship.isSunk()) {
        button.classList.add('ship');
      }

      // render attacks to computer's ships
      const hasAttackStatus =
        square === null ? false : Object.hasOwn(square, 'attackStatus');
      if (hasAttackStatus) {
        const { attackStatus } = square;
        button.classList.add(attackStatus);
        button.classList.add('disable');
        button.addEventListener('click', (e) => e.stopPropagation());
      }

      // add data attributes for coordinates
      button.dataset.y = rowIndex;
      button.dataset.x = columnIndex;

      attacksBoardDiv.appendChild(button);
    });
  });
};

const disableAttacksBoard = () => {
  attacksBoardDiv.classList.add('disable-pointer');
};

const enableAttacksBoard = () => {
  attacksBoardDiv.classList.remove('disable-pointer');
};

const handleAttacksBoardClick = async (targetSquare) => {
  disableAttacksBoard();

  // run player's attack
  const { y, x } = targetSquare.dataset;
  playPlayerAttack([y, x]);
  updateAttacksBoard();

  // announce if player sunk computer's ship or wins
  const firstAnnouncement = getGameAnnouncement([y, x]);
  if (firstAnnouncement) {
    updateAnnouncement(firstAnnouncement);
    if (firstAnnouncement.includes('win')) {
      updateAnnouncement(firstAnnouncement);
      showSelectScreen('winner');
    }
    await delay(1000);
  }
  switchEnemy();

  // end game if player is winner
  if (players[1].gameboard.allShipsDown()) return;

  // announce waiting for computer's attack
  updateAnnouncement('Waiting for Computer...');
  await delay(1000);

  // run computer's attack
  playComputerAttack();
  updateShipsBoard();

  // announce if computer sunk player's ship or wins
  const secondAnnouncement = getGameAnnouncement();
  if (secondAnnouncement) {
    updateAnnouncement(secondAnnouncement);
    if (secondAnnouncement.includes('win')) {
      updateAnnouncement(secondAnnouncement);
      showSelectScreen('winner');
    }
    await delay(1000);
  }
  switchEnemy();

  // end game if computer is winner
  if (players[0].gameboard.allShipsDown()) return;

  // announce player's turn to attack
  updateAnnouncement('Send your attack');

  enableAttacksBoard();
};
attacksBoardDiv.addEventListener('click', (e) => {
  handleAttacksBoardClick(e.target);
});

const initializeGameScreenBoards = () => {
  // randomly place all ships to computer's board
  addRandomShipPlacement(players[1].gameboard);

  updateShipsBoard();
  updateAttacksBoard();
  updateAnnouncement('Send your attack');
};

export { initializeGameScreenBoards };
