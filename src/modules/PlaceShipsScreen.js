import PlaceShipsBoard from '../classes/PlaceShipsBoard';
import Ship from '../classes/Ship';

const placeShipsScreen = document.querySelector('.place-ships-screen');
const draggableShipsContainer = placeShipsScreen.querySelector(
  '.draggable-ships-container',
);
const placeShipsBoardDiv = placeShipsScreen.querySelector('.place-ships.board');
const draggableShips = placeShipsScreen.querySelectorAll('[draggable="true"]');
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
  draggableShips.forEach((ship) => {
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
placeShipsBoardDiv.addEventListener('drop', (e) => {
  const shipName = e.dataTransfer.getData('text');

  // add ship to board instances
  const { y, x } = e.target.dataset;
  placeShipBoardInstance.placeShip([+y, +x], new Ship(shipName));

  // remove source of dragged ship so player can't place duplicates
  const shipSource = draggableShipsContainer.querySelector(`#${shipName}`);
  draggableShipsContainer.removeChild(shipSource);

  // remove hover effect
  e.target.classList.remove('ship-hover');

  updateBoard();
});
placeShipsBoardDiv.addEventListener('dragenter', (e) => {
  // highlight potential drop target when the ship enters it
  e.target.classList.add('ship-hover');
});
placeShipsBoardDiv.addEventListener('dragleave', (e) => {
  // reset background of potential drop target when the ship leaves it
  e.target.classList.remove('ship-hover');
});

// setup initial render
updateBoard();
addShipsDragEventHandlers();
