const placeShipsScreen = document.querySelector('.place-ships-screen');
const placeShipsBoardDiv = placeShipsScreen.querySelector('.place-ships.board');
const draggableShips = placeShipsScreen.querySelectorAll(
  '.draggable-ships-container > *',
);

const addCellsToBoard = () => {
  for (let i = 0; i < 100; i += 1) {
    const cell = document.createElement('div');

    cell.addEventListener('dragover', (e) => {
      e.preventDefault();
      e.dataTransfer.dropEffect = 'move';
    });

    cell.addEventListener('drop', (e) => {
      // move the ship to dropped position
      const shipName = e.dataTransfer.getData('application/my-app');
      const ship = placeShipsScreen.querySelector(`.${shipName}`);
      e.target.appendChild(ship);
    });

    placeShipsBoardDiv.appendChild(cell);
  }
};
addCellsToBoard();

const addShipsDragEventHandlers = () => {
  draggableShips.forEach((ship) => {
    ship.addEventListener('dragstart', (e) => {
      e.dataTransfer.setData('application/my-app', e.target.classList);
    });
  });
};
addShipsDragEventHandlers();
