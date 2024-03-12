const placeShipsScreen = document.querySelector('.place-ships-screen');
const placeShipsBoardDiv = placeShipsScreen.querySelector('.place-ships.board');
const draggableShips = placeShipsScreen.querySelectorAll(
  '.draggable-ships-container > *',
);

const addCellsToBoard = () => {
  for (let i = 0; i < 100; i += 1) {
    const cell = document.createElement('div');

    // show move-cursor when ship hovers over potential drop target
    cell.addEventListener('dragover', (e) => {
      e.preventDefault();
      e.dataTransfer.dropEffect = 'move';
    });

    // move ship into dropped target
    cell.addEventListener('drop', (e) => {
      const shipName = e.dataTransfer.getData('application/my-app');
      const ship = placeShipsScreen.querySelector(`.${shipName}`);
      e.target.appendChild(ship);
      e.target.classList.remove('ship-hover');
    });

    // highlight potential drop target when the ship enters it
    cell.addEventListener('dragenter', (e) => {
      e.target.classList.add('ship-hover');
    });

    // reset background of potential drop target when the ship leaves it
    cell.addEventListener('dragleave', (e) => {
      e.target.classList.remove('ship-hover');
    });

    placeShipsBoardDiv.appendChild(cell);
  }
};
addCellsToBoard();

const addShipsDragEventHandlers = () => {
  draggableShips.forEach((ship) => {
    ship.addEventListener('dragstart', (e) => {
      // store ship name
      e.dataTransfer.setData('application/my-app', e.target.classList);

      // make ship transparent when actively draggging
      e.target.classList.add('transparent');
    });

    ship.addEventListener('dragend', (e) => {
      // remove transparent effect when stop dragging ship
      e.target.classList.remove('transparent');
    });
  });
};
addShipsDragEventHandlers();
