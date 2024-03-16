import PlaceShipsBoard from '../classes/PlaceShipsBoard';
import Ship from '../classes/Ship';

const placeShipsScreen = document.querySelector('.place-ships-screen');
const toggleDirectionButton =
  placeShipsScreen.querySelector('.toggle-direction');
const draggableShipsContainer = placeShipsScreen.querySelector(
  '.draggable-ships-container',
);
const originalDraggableShips =
  placeShipsScreen.querySelectorAll('[draggable="true"]');
const placeShipsBoardDiv = placeShipsScreen.querySelector('.place-ships.board');

const placeShipBoardInstance = new PlaceShipsBoard();

const updateBoard = () => {
  placeShipsBoardDiv.textContent = '';

  // load each cell
  const { board } = placeShipBoardInstance;
  board.forEach((row, rowIndex) => {
    row.forEach((column, columnIndex) => {
      const cell = board[rowIndex][columnIndex];
      const button = document.createElement('button');

      // render previously-placed ships as draggable element
      const hasShip = !!cell;
      if (hasShip) {
        const { ship } = cell;
        button.id = ship.getName();
        button.classList.add('ship');
        button.draggable = true;
      }

      // add data-coordinate attribute
      button.dataset.y = rowIndex;
      button.dataset.x = columnIndex;

      placeShipsBoardDiv.appendChild(button);
    });
  });
};

const handleToggleDirectionClick = () => {
  originalDraggableShips.forEach((node) => {
    // DOM: rotate ship
    const { width, height } = node.style;
    node.setAttribute('style', `width: ${height}; height: ${width};`);

    // DOM: update data-direction attribute
    const { direction } = node.dataset;
    const newDirection = direction === 'horizontal' ? 'vertical' : 'horizontal';
    node.setAttribute('data-direction', newDirection);
  });
};

const handleDragStart = (e) => {
  // store data in dataTransfer: ship name and direction attribute
  const obj = {
    shipName: e.target.id,
    curDirection: e.target.dataset.direction,
  };
  e.dataTransfer.setData('text/plain', JSON.stringify(obj));

  // position cursor grabbing ship
  e.dataTransfer.setDragImage(e.target, 20, 20);

  // make ship transparent when actively draggging
  e.target.classList.add('transparent');
};

const handleDragEnd = (e) => {
  // remove transparent effect when stop dragging ship
  e.target.classList.remove('transparent');
};

const handleDragOver = (e) => {
  e.preventDefault();
  // show move-cursor when ship hovers over potential drop target
  e.dataTransfer.dropEffect = 'move';
};

const handleDrop = (e) => {
  const { shipName, curDirection } = JSON.parse(e.dataTransfer.getData('text'));
  const { y, x } = e.target.dataset;
  const shipInstance = new Ship(shipName);

  // FIX: DOM should not write/set data
  shipInstance.setDirection(curDirection);

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
};

const handleDragEnter = (e) => {
  // highlight potential drop target when the ship enters it
  e.target.classList.add('ship-hover');
};

const handleDragLeave = (e) => {
  // reset background of potential drop target when the ship leaves it
  e.target.classList.remove('ship-hover');
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
  placeShipsBoardDiv.addEventListener('dragover', (e) => handleDragOver(e));
  placeShipsBoardDiv.addEventListener('drop', (e) => handleDrop(e));
  placeShipsBoardDiv.addEventListener('dragenter', (e) => handleDragEnter(e));
  placeShipsBoardDiv.addEventListener('dragleave', (e) => handleDragLeave(e));
};

// setup initial render
updateBoard();
addShipsDragEventHandlers();
addBoardDragEventHandlers();
