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

const addShipsDragEventHandlers = () => {
  originalDraggableShips.forEach((ship) => {
    ship.addEventListener('dragstart', (e) => {
      // store ship name
      e.dataTransfer.setData('text/plain', e.target.id);

      // position cursor grabbing ship
      e.dataTransfer.setDragImage(e.target, 20, 20);

      // make ship transparent when actively draggging
      e.target.classList.add('transparent');
    });

    ship.addEventListener('dragend', (e) => {
      // remove transparent effect when stop dragging ship
      e.target.classList.remove('transparent');
    });
  });
};

// add drag and drop event handlers on board
placeShipsBoardDiv.addEventListener('dragover', (e) => {
  e.preventDefault();
  // show move-cursor when ship hovers over potential drop target
  e.dataTransfer.dropEffect = 'move';
});

const handleDropEvent = (e) => {
  const shipName = e.dataTransfer.getData('text');
  const { y, x } = e.target.dataset;
  const shipInstance = new Ship(shipName);

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
placeShipsBoardDiv.addEventListener('drop', (e) => {
  handleDropEvent(e);
});

placeShipsBoardDiv.addEventListener('dragenter', (e) => {
  // highlight potential drop target when the ship enters it
  e.target.classList.add('ship-hover');
});
placeShipsBoardDiv.addEventListener('dragleave', (e) => {
  // reset background of potential drop target when the ship leaves it
  e.target.classList.remove('ship-hover');
});

toggleDirectionButton.addEventListener('click', () => {
  // swap width and height of each ship
  originalDraggableShips.forEach((node) => {
    const { width, height } = node.style;
    node.setAttribute('style', `width: ${height}; height: ${width};`);
  });
});

// setup initial render
updateBoard();
addShipsDragEventHandlers();
