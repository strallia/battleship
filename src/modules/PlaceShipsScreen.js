import Ship from '../classes/Ship';
import { gameScreen, delay, initializeGameScreenBoards } from './GameScreen';
import { players } from './GameController';
import { updateAnnouncement } from './AnnouncementsScreen';

const placeShipsScreen = document.querySelector('.place-ships-screen');
const toggleDirectionButton =
  placeShipsScreen.querySelector('.toggle-direction');
const draggableShipsContainer = placeShipsScreen.querySelector(
  '.draggable-ships-container',
);
const originalDraggableShips =
  placeShipsScreen.querySelectorAll('[draggable="true"]');
const boardBorderDiv = placeShipsScreen.querySelector('.board-border');
const placeShipsBoardDiv = placeShipsScreen.querySelector('.place-ships.board');

const placeShipBoardInstance = players[0].gameboard;

const updateBoard = () => {
  placeShipsBoardDiv.textContent = '';

  // load each cell
  const { board } = placeShipBoardInstance;
  board.forEach((row, rowIndex) => {
    row.forEach((_, columnIndex) => {
      const cell = board[rowIndex][columnIndex];
      const button = document.createElement('button');

      // render previously-placed ships as draggable element
      const hasShip = !!cell;
      if (hasShip) {
        const { ship } = cell;
        button.id = ship.getName();
        button.classList.add('ship');
      }

      // add data-coordinate attribute
      button.dataset.y = rowIndex;
      button.dataset.x = columnIndex;

      placeShipsBoardDiv.appendChild(button);
    });
  });
};

const removeAllShipHover = () => {
  const cells = placeShipsBoardDiv.querySelectorAll('button');
  cells.forEach((cell) => cell.classList.remove('ship-hover', 'invalid'));
};

let curShipDirection = 'horizontal';
const handleToggleDirectionClick = () => {
  // visually rotate ships
  originalDraggableShips.forEach((node) => {
    const { width, height } = node.style;
    node.setAttribute('style', `width: ${height}; height: ${width};`);
  });

  // update direction variable
  curShipDirection =
    curShipDirection === 'horizontal' ? 'vertical' : 'horizontal';
};

let curDraggedShipLength;
const handleDragStart = (e) => {
  curDraggedShipLength = +e.target.dataset.length;

  // store data in dataTransfer: ship name and direction attribute
  const obj = {
    shipName: e.target.id,
  };
  e.dataTransfer.setData('text/plain', JSON.stringify(obj));

  // position cursor grabbing ship
  e.dataTransfer.setDragImage(e.target, 20, 20);

  // make ship transparent when actively draggging
  e.target.classList.add('transparent');
};

const getHoverNodes = (e) => {
  // find all cell nodes directly under ship
  const allCells = placeShipsBoardDiv.querySelectorAll('button');
  const cellNodes = [e.target];
  if (curShipDirection === 'horizontal') {
    const firstCellX = +e.target.dataset.x;
    const constantY = +e.target.dataset.y;
    const lastCellX = firstCellX + (curDraggedShipLength - 1);
    allCells.forEach((cell) => {
      const y = +cell.dataset.y;
      const x = +cell.dataset.x;
      if (x > firstCellX && x <= lastCellX && y === constantY)
        cellNodes.push(cell);
    });
  } else {
    const firstCellY = +e.target.dataset.y;
    const constantX = +e.target.dataset.x;
    const lastCellY = firstCellY + (curDraggedShipLength - 1);
    allCells.forEach((cell) => {
      const y = +cell.dataset.y;
      const x = +cell.dataset.x;
      if (y > firstCellY && y <= lastCellY && x === constantX)
        cellNodes.push(cell);
    });
  }
  return cellNodes;
};

const handleDragEnd = (e) => {
  // remove transparent effect when stop dragging ship
  e.target.classList.remove('transparent');

  removeAllShipHover();
};

const handleDragOver = (e) => {
  e.preventDefault();
  // show move-cursor when ship hovers over potential drop target
  e.dataTransfer.dropEffect = 'move';
};

const handleDrop = async (e) => {
  const { shipName } = JSON.parse(e.dataTransfer.getData('text'));
  const { y, x } = e.target.dataset;
  const shipInstance = new Ship(shipName);

  // FIX: DOM should not write/set data
  shipInstance.setDirection(curShipDirection);

  if (placeShipBoardInstance.isValidPosition([+y, +x], shipInstance)) {
    placeShipBoardInstance.placeShip([+y, +x], shipInstance);

    // if original draggable ship is in draggable-ships-container, remove it
    const originalShipNode = Array.from(originalDraggableShips).find(
      (node) => node.id === shipName,
    );
    if (originalShipNode) draggableShipsContainer.removeChild(originalShipNode);
  }

  // remove hover effect
  e.target.classList.remove('ship-hover');

  updateBoard();

  // if placed last ship, open game screen
  if (draggableShipsContainer.children.length === 0) {
    await delay(1000);
    initializeGameScreenBoards();
    placeShipsScreen.classList.add('hidden');
    gameScreen.classList.remove('hidden');
  }
};

const handleDragEnter = (e) => {
  removeAllShipHover();
  const cellNodes = getHoverNodes(e);
  cellNodes.forEach((cell) => cell.classList.add('ship-hover'));
  if (cellNodes.length !== curDraggedShipLength)
    cellNodes.forEach((cell) => cell.classList.add('invalid'));
};

const handleDragEnterBoardBorder = (e) => {
  if (e.target === boardBorderDiv) removeAllShipHover();
};

const addShipsDragEventHandlers = () => {
  originalDraggableShips.forEach((ship) => {
    ship.addEventListener('dragstart', (e) => handleDragStart(e));
    ship.addEventListener('dragend', (e) => handleDragEnd(e));
  });

  toggleDirectionButton.addEventListener('click', () =>
    handleToggleDirectionClick(),
  );
};

const addBoardDragEventHandlers = () => {
  boardBorderDiv.addEventListener('dragenter', (e) =>
    handleDragEnterBoardBorder(e),
  );
  placeShipsBoardDiv.addEventListener('dragover', (e) => handleDragOver(e));
  placeShipsBoardDiv.addEventListener('drop', (e) => handleDrop(e));
  placeShipsBoardDiv.addEventListener('dragenter', (e) => handleDragEnter(e));
};

// setup initial render
updateAnnouncement('Place your ships');
updateBoard();
addShipsDragEventHandlers();
addBoardDragEventHandlers();
