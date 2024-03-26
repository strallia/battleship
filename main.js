/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./src/classes/Gameboard.js":
/*!**********************************!*\
  !*** ./src/classes/Gameboard.js ***!
  \**********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ Gameboard)
/* harmony export */ });
class Gameboard {
  #computersPrevAttackCoord = null;
  constructor() {
    // creates 10x10 grid with origin being the top left.
    // position selected by [y, x] coordinates where
    // y = row number and x = column number.
    this.board = Gameboard.#getNewBoard();
    this.ships = [];
  }
  static #getNewBoard() {
    return Array(10).fill(null).map(() => Array(10).fill(null));
  }
  static getShipCoordinates(clickedCoord, shipInstance, direction) {
    const [y, x] = clickedCoord;
    const length = shipInstance.getLength();
    const coords = [];
    if (direction === 'horizontal') {
      for (let i = 0; i < length; i += 1) {
        coords.push([y, x + i]);
      }
    } else {
      for (let i = 0; i < length; i += 1) {
        coords.push([y + i, x]);
      }
    }
    return coords;
  }
  resetBoard() {
    this.board = Gameboard.#getNewBoard();
    this.ships = [];
  }
  placeShip(clickedCoord, shipInstance) {
    const [y, x] = clickedCoord;
    const length = shipInstance.getLength();
    const {
      direction
    } = shipInstance;

    // if valid spot, place ship on board horizontally or vertically
    if (this.isValidPosition([y, x], shipInstance)) {
      let yCount = 0;
      let xCount = 0;
      this.ships.push(shipInstance);
      while (yCount === 0 && xCount < length || yCount < length && xCount === 0) {
        this.board[y + yCount][x + xCount] = {
          ship: shipInstance
        };
        if (direction === 'horizontal') xCount += 1;else yCount += 1;
      }
      return true;
    }
    return false;
  }
  isValidPosition(clickedCoord, shipInstance) {
    const [y, x] = clickedCoord;
    const length = shipInstance.getLength();
    const {
      direction
    } = shipInstance;

    // do not place ship off the board
    const sternPositon = (direction === 'horizontal' ? x : y) + (length - 1);
    if (sternPositon > 9) return false;

    // do not overlap ships
    const proposedShipCoordinates = Gameboard.getShipCoordinates(clickedCoord, shipInstance, direction);
    const coordinatesVacancy = proposedShipCoordinates.map(coord => Boolean(this.board[coord[0]][coord[1]]));
    if (coordinatesVacancy.some(occupied => occupied)) {
      return false;
    }
    return true;
  }
  receiveAttack(coord) {
    const [y, x] = coord;
    const square = this.board[y][x];
    if (square === null) {
      this.board[y][x] = {
        attackStatus: 'miss'
      };
    } else if (Object.hasOwn(square, 'ship')) {
      square.ship.hit();
      square.attackStatus = 'hit';
    }
  }
  getAttackStatus(coord) {
    const [y, x] = coord;
    const square = this.board[y][x];
    if (square) return square.attackStatus;
    return square;
  }
  allShipsDown() {
    const allDown = this.ships.map(ship => ship.isSunk()).every(status => status === true);
    if (allDown) return true;
    return false;
  }
  getComputerAttackRandom() {
    // get random, open position that does not have attackStatus
    let coord;
    let isPositionOpen = false;
    while (!isPositionOpen) {
      coord = [null, null].map(() => Math.floor(Math.random() * 10));
      const hasObj = this.board[coord[0]][coord[1]];
      if (hasObj && Object.hasOwn(hasObj, 'attackStatus')) {
        isPositionOpen = false;
      } else isPositionOpen = true;
    }

    // send computer's attack
    this.receiveAttack(coord);
    return coord;
  }
  setComputersPreviousAttackCoord(coord) {
    this.#computersPrevAttackCoord = coord;
  }
  getComputerAttackMedium() {
    /**
     * This method checks the attack status of the computer's previous attack.
     * If it was a miss, it'll attack a random cell on the board.
     * It it was a hit, it'll attack a random neighbor cell.
     */

    // if no previous computer attack or if it attacked and was a miss, attack random cell
    if (!this.#computersPrevAttackCoord || this.board[this.#computersPrevAttackCoord[0]][this.#computersPrevAttackCoord[1]].attackStatus === 'miss') {
      this.#computersPrevAttackCoord = this.getComputerAttackRandom();
      return this.#computersPrevAttackCoord;
    }

    // else prev attack was a hit, so attack a neighbor cell
    const [refY, refX] = this.#computersPrevAttackCoord;
    const coordChanges = [[-1, 0], [0, 1], [1, 0], [0, -1]];
    const allNeighborCoords = [];
    coordChanges.forEach(_ref => {
      let [changeY, changeX] = _ref;
      const [neighborY, neighborX] = [refY + changeY, refX + changeX];
      if (neighborY >= 0 && neighborY <= 9 && neighborX >= 0 && neighborX <= 9) allNeighborCoords.push([neighborY, neighborX]);
    });

    // find open neighbor cells that haven't been attacked
    const openNeighborCoords = allNeighborCoords.filter(_ref2 => {
      let [y, x] = _ref2;
      return !this.board[y][x]?.attackStatus;
    });

    // if no open neighbor cells, attack any other random cell
    if (openNeighborCoords.length === 0) {
      this.#computersPrevAttackCoord = this.getComputerAttackRandom();
      return this.#computersPrevAttackCoord;
    }

    // if any neighbor cells were hit, attack the neighbor directly opposite it
    const previouslyHitNeighbors = allNeighborCoords.filter(_ref3 => {
      let [y, x] = _ref3;
      const hasAttackStatus = this.board[y][x]?.attackStatus;
      return hasAttackStatus === 'hit';
    });
    let indexCounter = 0;
    while (indexCounter < previouslyHitNeighbors.length) {
      const curHitNeighbor = previouslyHitNeighbors[indexCounter];
      const changeYFromReference = this.#computersPrevAttackCoord[0] - curHitNeighbor[0];
      const changeXFromReference = this.#computersPrevAttackCoord[1] - curHitNeighbor[1];
      const oppositeNeighbor = changeYFromReference === 0 ? [this.#computersPrevAttackCoord[0], this.#computersPrevAttackCoord[1] + changeXFromReference] : [this.#computersPrevAttackCoord[0] + changeYFromReference, this.#computersPrevAttackCoord[1]];
      const oppNeighborCanBeAttacked = !this.board[oppositeNeighbor[0]][oppositeNeighbor[1]]?.attackStatus;
      if (oppNeighborCanBeAttacked) {
        this.receiveAttack(oppositeNeighbor);
        this.#computersPrevAttackCoord = oppositeNeighbor;
        return this.#computersPrevAttackCoord;
      }
      indexCounter += 1;
    }

    // else attack random open neighbor cell
    const randomNeighborCoord = openNeighborCoords[Math.floor(Math.random() * openNeighborCoords.length)];
    this.receiveAttack(randomNeighborCoord);
    this.#computersPrevAttackCoord = randomNeighborCoord;
    return this.#computersPrevAttackCoord;
  }
}

/***/ }),

/***/ "./src/classes/Player.js":
/*!*******************************!*\
  !*** ./src/classes/Player.js ***!
  \*******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ Player)
/* harmony export */ });
class Player {
  constructor(name) {
    this.name = name;
  }
}

/***/ }),

/***/ "./src/classes/Ship.js":
/*!*****************************!*\
  !*** ./src/classes/Ship.js ***!
  \*****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ Ship)
/* harmony export */ });
class Ship {
  #length;
  #hits;
  #name;
  constructor(name) {
    this.#name = name;
    this.#hits = 0;
    this.#setLength();
    this.direction = 'horizontal';
  }
  #setLength() {
    if (this.#name === 'carrier') this.#length = 5;else if (this.#name === 'battleship') this.#length = 4;else if (this.#name === 'cruiser') this.#length = 3;else if (this.#name === 'submarine') this.#length = 3;else if (this.#name === 'destroyer') this.#length = 2;
  }
  getLength() {
    return this.#length;
  }
  getHits() {
    return this.#hits;
  }
  getName() {
    return this.#name;
  }
  hit() {
    this.#hits += 1;
  }
  isSunk() {
    if (this.#length === this.#hits) return true;
    return false;
  }
  setDirection(directionString) {
    this.direction = directionString;
  }
}

/***/ }),

/***/ "./src/modules/DOMscreens.js":
/*!***********************************!*\
  !*** ./src/modules/DOMscreens.js ***!
  \***********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   gameScreen: () => (/* binding */ gameScreen),
/* harmony export */   menuScreen: () => (/* binding */ menuScreen),
/* harmony export */   placeShipsScreen: () => (/* binding */ placeShipsScreen),
/* harmony export */   winnerScreen: () => (/* binding */ winnerScreen)
/* harmony export */ });
const placeShipsScreen = document.querySelector('.place-ships-screen');
const gameScreen = document.querySelector('.game-screen');
const winnerScreen = document.querySelector('.winner-screen');
const menuScreen = document.querySelector('.menu-screen');


/***/ }),

/***/ "./src/modules/GameController.js":
/*!***************************************!*\
  !*** ./src/modules/GameController.js ***!
  \***************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   addRandomShipPlacement: () => (/* binding */ addRandomShipPlacement),
/* harmony export */   delay: () => (/* binding */ delay),
/* harmony export */   getEnemy: () => (/* binding */ getEnemy),
/* harmony export */   getGameAnnouncement: () => (/* binding */ getGameAnnouncement),
/* harmony export */   playComputerAttack: () => (/* binding */ playComputerAttack),
/* harmony export */   playPlayerAttack: () => (/* binding */ playPlayerAttack),
/* harmony export */   players: () => (/* binding */ players),
/* harmony export */   setGameDifficulty: () => (/* binding */ setGameDifficulty),
/* harmony export */   showSelectScreen: () => (/* binding */ showSelectScreen),
/* harmony export */   switchEnemy: () => (/* binding */ switchEnemy),
/* harmony export */   updateAnnouncement: () => (/* binding */ updateAnnouncement)
/* harmony export */ });
/* harmony import */ var _classes_Gameboard__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../classes/Gameboard */ "./src/classes/Gameboard.js");
/* harmony import */ var _classes_Player__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../classes/Player */ "./src/classes/Player.js");
/* harmony import */ var _classes_Ship__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../classes/Ship */ "./src/classes/Ship.js");
/* harmony import */ var _DOMscreens__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./DOMscreens */ "./src/modules/DOMscreens.js");




const players = [{
  player: new _classes_Player__WEBPACK_IMPORTED_MODULE_1__["default"]('Leah'),
  gameboard: new _classes_Gameboard__WEBPACK_IMPORTED_MODULE_0__["default"]()
}, {
  player: new _classes_Player__WEBPACK_IMPORTED_MODULE_1__["default"]('Computer'),
  gameboard: new _classes_Gameboard__WEBPACK_IMPORTED_MODULE_0__["default"]()
}];
let enemy = players[1];
const getEnemy = () => enemy;
const switchEnemy = () => {
  enemy = enemy === players[0] ? players[1] : players[0];
};
let gameDifficulty = 'easy';
const setGameDifficulty = string => {
  gameDifficulty = string;
};
const playPlayerAttack = coord => players[1].gameboard.receiveAttack(coord);
let computersAttackCoord = [null, null];
const playComputerAttack = () => {
  if (gameDifficulty === 'easy') computersAttackCoord = players[0].gameboard.getComputerAttackRandom();else computersAttackCoord = players[0].gameboard.getComputerAttackMedium();
};
const getGameAnnouncement = function getStringForGameAnnouncement() {
  let attackedCoord = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : computersAttackCoord;
  // find attacked square with it's data object
  const [y, x] = attackedCoord;
  const attackedSquare = getEnemy().gameboard.board[y][x];

  // get nouns for string interpolation
  const attacker = arguments.length === 0 ? 'Computer' : 'You';
  const receiver = attacker === 'Computer' ? 'your' : "Computer's";

  // if attack sunk enemy's last ship
  const hasShip = attackedSquare === null ? false : Object.hasOwn(attackedSquare, 'ship');
  if (hasShip && getEnemy().gameboard.allShipsDown()) {
    return `${attacker} win${attacker === 'Computer' ? "'s" : ''}!`;
  }

  // if attack sunk enemy's ship
  if (hasShip) {
    const {
      ship
    } = attackedSquare;
    const shipName = ship.getName();
    if (ship.isSunk()) return `${attacker} sunk ${receiver} ${shipName}`;
  }
  return '';
};
const getRandomCoord = () => [null, null].map(_ => Math.floor(Math.random() * 10));
const addRandomShipPlacement = gameboard => {
  const shipNames = ['carrier', 'battleship', 'cruiser', 'submarine', 'destroyer'];
  const shipDirectionOptions = ['horizontal', 'vertical'];
  while (shipNames.length > 0) {
    const randomCoord = getRandomCoord();
    const ship = new _classes_Ship__WEBPACK_IMPORTED_MODULE_2__["default"](shipNames.at(-1));
    ship.setDirection(shipDirectionOptions[Math.floor(Math.random() * 2)]);
    const isValidShipPlacement = gameboard.placeShip(randomCoord, ship);
    if (isValidShipPlacement) shipNames.pop();
  }
};
const delay = msec => new Promise(res => setTimeout(res, msec));
const announcementDiv = document.querySelector('.announcement');
const showSelectScreen = string => {
  if (string === 'game') {
    _DOMscreens__WEBPACK_IMPORTED_MODULE_3__.placeShipsScreen.classList.add('hidden');
    _DOMscreens__WEBPACK_IMPORTED_MODULE_3__.gameScreen.classList.remove('hidden');
  } else if (string === 'winner') {
    _DOMscreens__WEBPACK_IMPORTED_MODULE_3__.gameScreen.classList.add('hidden');
    _DOMscreens__WEBPACK_IMPORTED_MODULE_3__.winnerScreen.classList.remove('hidden');
  } else if (string === 'menu') {
    announcementDiv.classList.add('hidden');
    _DOMscreens__WEBPACK_IMPORTED_MODULE_3__.winnerScreen.classList.add('hidden');
    _DOMscreens__WEBPACK_IMPORTED_MODULE_3__.menuScreen.classList.remove('hidden');
  } else if (string === 'place ships') {
    _DOMscreens__WEBPACK_IMPORTED_MODULE_3__.menuScreen.classList.add('hidden');
    announcementDiv.classList.remove('hidden');
    _DOMscreens__WEBPACK_IMPORTED_MODULE_3__.placeShipsScreen.classList.remove('hidden');
  }
};
const updateAnnouncement = string => {
  announcementDiv.textContent = string;
};


/***/ }),

/***/ "./src/modules/GameScreen.js":
/*!***********************************!*\
  !*** ./src/modules/GameScreen.js ***!
  \***********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   initializeGameScreenBoards: () => (/* binding */ initializeGameScreenBoards)
/* harmony export */ });
/* harmony import */ var _GameController__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./GameController */ "./src/modules/GameController.js");

const shipsBoardDiv = document.querySelector('.ships.board');
const attacksBoardDiv = document.querySelector('.attacks.board');
const updateShipsBoard = () => {
  // clear board
  shipsBoardDiv.textContent = '';

  // load each square
  const playerBoard = _GameController__WEBPACK_IMPORTED_MODULE_0__.players[0].gameboard.board;
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
      const hasAttackStatus = square === null ? false : Object.hasOwn(square, 'attackStatus');
      if (hasAttackStatus) {
        const {
          attackStatus
        } = square;
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
  const computerBoard = _GameController__WEBPACK_IMPORTED_MODULE_0__.players[1].gameboard.board;
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
      const hasAttackStatus = square === null ? false : Object.hasOwn(square, 'attackStatus');
      if (hasAttackStatus) {
        const {
          attackStatus
        } = square;
        button.classList.add(attackStatus);
        button.classList.add('disable');
        button.addEventListener('click', e => e.stopPropagation());
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
const handleAttacksBoardClick = async targetSquare => {
  disableAttacksBoard();

  // run player's attack
  const {
    y,
    x
  } = targetSquare.dataset;
  (0,_GameController__WEBPACK_IMPORTED_MODULE_0__.playPlayerAttack)([y, x]);
  updateAttacksBoard();

  // announce if player sunk computer's ship or wins
  const firstAnnouncement = (0,_GameController__WEBPACK_IMPORTED_MODULE_0__.getGameAnnouncement)([y, x]);
  if (firstAnnouncement) {
    (0,_GameController__WEBPACK_IMPORTED_MODULE_0__.updateAnnouncement)(firstAnnouncement);
    if (firstAnnouncement.includes('win')) {
      (0,_GameController__WEBPACK_IMPORTED_MODULE_0__.updateAnnouncement)(firstAnnouncement);
      (0,_GameController__WEBPACK_IMPORTED_MODULE_0__.showSelectScreen)('winner');
    }
    await (0,_GameController__WEBPACK_IMPORTED_MODULE_0__.delay)(1000);
  }
  (0,_GameController__WEBPACK_IMPORTED_MODULE_0__.switchEnemy)();

  // end game if player is winner
  if (_GameController__WEBPACK_IMPORTED_MODULE_0__.players[1].gameboard.allShipsDown()) return;

  // announce waiting for computer's attack
  (0,_GameController__WEBPACK_IMPORTED_MODULE_0__.updateAnnouncement)('Waiting for Computer...');
  await (0,_GameController__WEBPACK_IMPORTED_MODULE_0__.delay)(1000);

  // run computer's attack
  (0,_GameController__WEBPACK_IMPORTED_MODULE_0__.playComputerAttack)();
  updateShipsBoard();

  // announce if computer sunk player's ship or wins
  const secondAnnouncement = (0,_GameController__WEBPACK_IMPORTED_MODULE_0__.getGameAnnouncement)();
  if (secondAnnouncement) {
    (0,_GameController__WEBPACK_IMPORTED_MODULE_0__.updateAnnouncement)(secondAnnouncement);
    if (secondAnnouncement.includes('win')) {
      (0,_GameController__WEBPACK_IMPORTED_MODULE_0__.updateAnnouncement)(secondAnnouncement);
      (0,_GameController__WEBPACK_IMPORTED_MODULE_0__.showSelectScreen)('winner');
    }
    await (0,_GameController__WEBPACK_IMPORTED_MODULE_0__.delay)(1000);
  }
  (0,_GameController__WEBPACK_IMPORTED_MODULE_0__.switchEnemy)();

  // end game if computer is winner
  if (_GameController__WEBPACK_IMPORTED_MODULE_0__.players[0].gameboard.allShipsDown()) return;

  // announce player's turn to attack
  (0,_GameController__WEBPACK_IMPORTED_MODULE_0__.updateAnnouncement)('Send your attack');
  enableAttacksBoard();
};
attacksBoardDiv.addEventListener('click', e => {
  handleAttacksBoardClick(e.target);
});
const initializeGameScreenBoards = () => {
  // randomly place all ships to computer's board
  (0,_GameController__WEBPACK_IMPORTED_MODULE_0__.addRandomShipPlacement)(_GameController__WEBPACK_IMPORTED_MODULE_0__.players[1].gameboard);
  updateShipsBoard();
  updateAttacksBoard();
  (0,_GameController__WEBPACK_IMPORTED_MODULE_0__.updateAnnouncement)('Send your attack');
};


/***/ }),

/***/ "./src/modules/MenuScreen.js":
/*!***********************************!*\
  !*** ./src/modules/MenuScreen.js ***!
  \***********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _DOMscreens__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./DOMscreens */ "./src/modules/DOMscreens.js");
/* harmony import */ var _GameController__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./GameController */ "./src/modules/GameController.js");


const nameInput = _DOMscreens__WEBPACK_IMPORTED_MODULE_0__.menuScreen.querySelector('#name');
const difficultyInput = _DOMscreens__WEBPACK_IMPORTED_MODULE_0__.menuScreen.querySelector('#difficulty');
const startButton = _DOMscreens__WEBPACK_IMPORTED_MODULE_0__.menuScreen.querySelector('.start');
const handleStartButtonClick = e => {
  e.preventDefault();

  // set game data
  const name = nameInput.value;
  _GameController__WEBPACK_IMPORTED_MODULE_1__.players[0].player.name = name;
  (0,_GameController__WEBPACK_IMPORTED_MODULE_1__.setGameDifficulty)(difficultyInput.value);

  // change screen
  (0,_GameController__WEBPACK_IMPORTED_MODULE_1__.showSelectScreen)('place ships');
  (0,_GameController__WEBPACK_IMPORTED_MODULE_1__.updateAnnouncement)(`${name.charAt(0).toUpperCase() + name.slice(1)}, place your ships`);
};
startButton.addEventListener('click', e => handleStartButtonClick(e));

/***/ }),

/***/ "./src/modules/PlaceShipsScreen.js":
/*!*****************************************!*\
  !*** ./src/modules/PlaceShipsScreen.js ***!
  \*****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _classes_Ship__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../classes/Ship */ "./src/classes/Ship.js");
/* harmony import */ var _DOMscreens__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./DOMscreens */ "./src/modules/DOMscreens.js");
/* harmony import */ var _GameScreen__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./GameScreen */ "./src/modules/GameScreen.js");
/* harmony import */ var _GameController__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./GameController */ "./src/modules/GameController.js");




const toggleDirectionButton = _DOMscreens__WEBPACK_IMPORTED_MODULE_1__.placeShipsScreen.querySelector('.toggle-direction');
const draggableShipsContainer = _DOMscreens__WEBPACK_IMPORTED_MODULE_1__.placeShipsScreen.querySelector('.draggable-ships-container');
const originalDraggableShips = _DOMscreens__WEBPACK_IMPORTED_MODULE_1__.placeShipsScreen.querySelectorAll('[draggable="true"]');
const boardBorderDiv = _DOMscreens__WEBPACK_IMPORTED_MODULE_1__.placeShipsScreen.querySelector('.board-border');
const placeShipsBoardDiv = _DOMscreens__WEBPACK_IMPORTED_MODULE_1__.placeShipsScreen.querySelector('.place-ships.board');
const placeShipBoardInstance = _GameController__WEBPACK_IMPORTED_MODULE_3__.players[0].gameboard;
const updateBoard = () => {
  placeShipsBoardDiv.textContent = '';

  // load each cell
  const {
    board
  } = placeShipBoardInstance;
  board.forEach((row, rowIndex) => {
    row.forEach((_, columnIndex) => {
      const cell = board[rowIndex][columnIndex];
      const button = document.createElement('button');

      // render previously-placed ships as draggable element
      const hasShip = !!cell;
      if (hasShip) {
        const {
          ship
        } = cell;
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
  cells.forEach(cell => cell.classList.remove('ship-hover', 'invalid'));
};
let curShipDirection = 'horizontal';
const handleToggleDirectionClick = () => {
  // visually rotate ships
  originalDraggableShips.forEach(node => {
    const {
      width,
      height
    } = node.style;
    node.setAttribute('style', `width: ${height}; height: ${width};`);
  });

  // update direction variable
  curShipDirection = curShipDirection === 'horizontal' ? 'vertical' : 'horizontal';
};
let curDraggedShipLength;
const handleDragStart = e => {
  curDraggedShipLength = +e.target.dataset.length;

  // store data in dataTransfer: ship name and direction attribute
  const obj = {
    shipName: e.target.id
  };
  e.dataTransfer.setData('text/plain', JSON.stringify(obj));

  // position cursor grabbing ship
  e.dataTransfer.setDragImage(e.target, 10, 10);

  // make ship transparent when actively draggging
  e.target.classList.add('transparent');
};
const getHoverNodes = e => {
  // find all cell nodes directly under ship
  const allCells = placeShipsBoardDiv.querySelectorAll('button');
  const cellNodes = [e.target];
  if (curShipDirection === 'horizontal') {
    const firstCellX = +e.target.dataset.x;
    const constantY = +e.target.dataset.y;
    const lastCellX = firstCellX + (curDraggedShipLength - 1);
    allCells.forEach(cell => {
      const y = +cell.dataset.y;
      const x = +cell.dataset.x;
      if (x > firstCellX && x <= lastCellX && y === constantY) cellNodes.push(cell);
    });
  } else {
    const firstCellY = +e.target.dataset.y;
    const constantX = +e.target.dataset.x;
    const lastCellY = firstCellY + (curDraggedShipLength - 1);
    allCells.forEach(cell => {
      const y = +cell.dataset.y;
      const x = +cell.dataset.x;
      if (y > firstCellY && y <= lastCellY && x === constantX) cellNodes.push(cell);
    });
  }
  return cellNodes;
};
const handleDragEnd = e => {
  // remove transparent effect when stop dragging ship
  e.target.classList.remove('transparent');
  removeAllShipHover();
};
const handleDragOver = e => {
  e.preventDefault();
  // show move-cursor when ship hovers over potential drop target
  e.dataTransfer.dropEffect = 'move';
};
const handleDrop = async e => {
  const {
    shipName
  } = JSON.parse(e.dataTransfer.getData('text'));
  const {
    y,
    x
  } = e.target.dataset;
  const shipInstance = new _classes_Ship__WEBPACK_IMPORTED_MODULE_0__["default"](shipName);
  shipInstance.setDirection(curShipDirection);
  if (placeShipBoardInstance.isValidPosition([+y, +x], shipInstance)) {
    placeShipBoardInstance.placeShip([+y, +x], shipInstance);

    // if original draggable ship is in draggable-ships-container, remove it
    const originalShipNode = Array.from(originalDraggableShips).find(node => node.id === shipName);
    if (originalShipNode) draggableShipsContainer.removeChild(originalShipNode);
  }

  // remove hover effect
  e.target.classList.remove('ship-hover');
  updateBoard();

  // if placed last ship, open game screen
  if (draggableShipsContainer.children.length === 0) {
    (0,_GameScreen__WEBPACK_IMPORTED_MODULE_2__.initializeGameScreenBoards)();
    (0,_GameController__WEBPACK_IMPORTED_MODULE_3__.showSelectScreen)('game');
  }
};
const handleDragEnter = e => {
  removeAllShipHover();
  const cellNodes = getHoverNodes(e);
  cellNodes.forEach(cell => cell.classList.add('ship-hover'));
  if (cellNodes.length !== curDraggedShipLength) cellNodes.forEach(cell => cell.classList.add('invalid'));
};
const handleDragEnterBoardBorder = e => {
  if (e.target === boardBorderDiv) removeAllShipHover();
};
const addShipsDragEventHandlers = () => {
  originalDraggableShips.forEach(ship => {
    ship.addEventListener('dragstart', e => handleDragStart(e));
    ship.addEventListener('dragend', e => handleDragEnd(e));
  });
  toggleDirectionButton.addEventListener('click', () => handleToggleDirectionClick());
};
const addBoardDragEventHandlers = () => {
  boardBorderDiv.addEventListener('dragenter', e => handleDragEnterBoardBorder(e));
  placeShipsBoardDiv.addEventListener('dragover', e => handleDragOver(e));
  placeShipsBoardDiv.addEventListener('drop', e => handleDrop(e));
  placeShipsBoardDiv.addEventListener('dragenter', e => handleDragEnter(e));
};

// setup initial render
(0,_GameController__WEBPACK_IMPORTED_MODULE_3__.updateAnnouncement)('Place your ships');
updateBoard();
addShipsDragEventHandlers();
addBoardDragEventHandlers();

/***/ }),

/***/ "./src/modules/WinnerScreen.js":
/*!*************************************!*\
  !*** ./src/modules/WinnerScreen.js ***!
  \*************************************/
/***/ (() => {

const playAgainButton = document.querySelector('.play-again');
playAgainButton.addEventListener('click', () => window.location.reload());

/***/ }),

/***/ "./node_modules/css-loader/dist/cjs.js!./src/styles.css":
/*!**************************************************************!*\
  !*** ./node_modules/css-loader/dist/cjs.js!./src/styles.css ***!
  \**************************************************************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../node_modules/css-loader/dist/runtime/sourceMaps.js */ "./node_modules/css-loader/dist/runtime/sourceMaps.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../node_modules/css-loader/dist/runtime/api.js */ "./node_modules/css-loader/dist/runtime/api.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _node_modules_css_loader_dist_runtime_getUrl_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../node_modules/css-loader/dist/runtime/getUrl.js */ "./node_modules/css-loader/dist/runtime/getUrl.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_getUrl_js__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_getUrl_js__WEBPACK_IMPORTED_MODULE_2__);
// Imports



var ___CSS_LOADER_URL_IMPORT_0___ = new URL(/* asset import */ __webpack_require__(/*! ./assets/KeaniaOne-Regular.ttf */ "./src/assets/KeaniaOne-Regular.ttf"), __webpack_require__.b);
var ___CSS_LOADER_URL_IMPORT_1___ = new URL(/* asset import */ __webpack_require__(/*! ./assets/SpaceMono-Regular.ttf */ "./src/assets/SpaceMono-Regular.ttf"), __webpack_require__.b);
var ___CSS_LOADER_EXPORT___ = _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default()((_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default()));
var ___CSS_LOADER_URL_REPLACEMENT_0___ = _node_modules_css_loader_dist_runtime_getUrl_js__WEBPACK_IMPORTED_MODULE_2___default()(___CSS_LOADER_URL_IMPORT_0___);
var ___CSS_LOADER_URL_REPLACEMENT_1___ = _node_modules_css_loader_dist_runtime_getUrl_js__WEBPACK_IMPORTED_MODULE_2___default()(___CSS_LOADER_URL_IMPORT_1___);
// Module
___CSS_LOADER_EXPORT___.push([module.id, `@font-face {
  font-family: 'Keania';
  src: url(${___CSS_LOADER_URL_REPLACEMENT_0___}) format('truetype');
}
@font-face {
  font-family: 'SpaceMono';
  src: url(${___CSS_LOADER_URL_REPLACEMENT_1___}) format('truetype');
}
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: 'SpaceMono', sans-serif;
}
:root {
  --black: rgb(16, 17, 16);
  --grey: rgb(219, 219, 219);
  --yellow: rgb(255, 246, 192);
}

body {
  position: absolute;
  bottom: 0;
  top: 0;
  left: 0;
  right: 0;
  margin: 30px;
  background-color: var(--grey);
  color: var(--black);

  display: grid;
  grid-template-rows: min-content min-content;
  row-gap: 30px;
  justify-items: center;
  text-align: center;
}

.title {
  font-family: 'Keania';
  font-size: 60px;
  font-stretch: extra-expanded;
}

.menu-screen > form {
  margin: 30px;
  display: grid;
  align-items: center;
  grid-template-rows: repeat(3, min-content);
  gap: 50px;
  align-content: center;
  justify-items: center;
}

form > div {
  display: grid;
  gap: 10px;
  justify-content: center;
}

form > div:nth-child(2) {
  display: flex;
  width: 100%;
}

form button {
  width: min-content;
}

input {
  padding: 5px 10px;
}

.game-screen {
  width: 100%;
  height: min-content;

  display: grid;
  grid-template-columns: 1fr 1fr;
  column-gap: 50px;
  justify-items: center;
}

.place-ships-screen {
  width: 100%;

  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: min-content min-content;
  align-items: center;
  column-gap: 50px;
  justify-items: center;
}

.toggle-direction {
  height: min-content;
}

.announcement {
  padding: 20px;
  width: clamp(300px, 50%, 400px);
  height: 100%;
  text-align: center;
}

.board {
  background-color: whitesmoke;
  display: grid;
  grid-template-columns: repeat(10, 40px);
  grid-template-rows: repeat(10, 40px);
}

.board > button {
  outline: 1px solid darkgrey;
  height: 40px;
  min-width: 40px;
  background-color: inherit;
  border: none;
}

.attacks.board > button:hover {
  background-color: lightgray;
}

.attacks.board > button:active {
  background-color: whitesmoke;
}

.attacks.board > button.ship.disable:hover {
  background-color: rebeccapurple;
}

.attacks.board > button.disable:hover {
  background-color: inherit;
}

.disable-pointer {
  pointer-events: none;
}

button.ship {
  background-color: rebeccapurple;
}

button.hit::before {
  content: 'X';
  color: red;
  font-weight: bolder;
  font-size: 24px;
}

button.miss::before {
  content: 'O';
  color: gray;
  font-weight: bolder;
  font-size: 24px;
}

.board-border {
  padding: 5px;

  grid-column: 2/3;
  grid-row: 1/3;
}

.place-ships.board {
  display: flex;
  flex-wrap: wrap;
  width: 400px;
  height: 400px;
}

.draggable-ships-container {
  width: 350px;
  min-height: 300px;
  background-color: whitesmoke;
  padding: 30px;

  display: flex;
  flex-wrap: wrap;
  gap: 20px;
}

.draggable-ships-container > * {
  cursor: grab;
}

#battleship,
#cruiser,
#submarine,
#destroyer,
#carrier {
  width: 40px;
  height: 40px;
  background-color: rebeccapurple;

  display: flex;
  align-items: center;
  justify-content: center;
}

.place-ships.board > .ship-hover {
  background-color: gray;
}

.place-ships.board > .ship-hover.invalid {
  background-color: maroon;
}

.transparent {
  opacity: 0.5;
}

.hidden {
  display: none;
}

button.start,
button.toggle-direction,
button.play-again {
  padding: 5px 12px;
}

.menu-screen,
.place-ships-screen,
.game-screen,
.winner-screen {
  max-width: 1000px;
}

footer {
  align-self: flex-end;
  font-size: 14px;
  color: gray;
  a {
    color: inherit;
  }
}
`, "",{"version":3,"sources":["webpack://./src/styles.css"],"names":[],"mappings":"AAAA;EACE,qBAAqB;EACrB,+DAA6D;AAC/D;AACA;EACE,wBAAwB;EACxB,+DAA6D;AAC/D;AACA;EACE,SAAS;EACT,UAAU;EACV,sBAAsB;EACtB,oCAAoC;AACtC;AACA;EACE,wBAAwB;EACxB,0BAA0B;EAC1B,4BAA4B;AAC9B;;AAEA;EACE,kBAAkB;EAClB,SAAS;EACT,MAAM;EACN,OAAO;EACP,QAAQ;EACR,YAAY;EACZ,6BAA6B;EAC7B,mBAAmB;;EAEnB,aAAa;EACb,2CAA2C;EAC3C,aAAa;EACb,qBAAqB;EACrB,kBAAkB;AACpB;;AAEA;EACE,qBAAqB;EACrB,eAAe;EACf,4BAA4B;AAC9B;;AAEA;EACE,YAAY;EACZ,aAAa;EACb,mBAAmB;EACnB,0CAA0C;EAC1C,SAAS;EACT,qBAAqB;EACrB,qBAAqB;AACvB;;AAEA;EACE,aAAa;EACb,SAAS;EACT,uBAAuB;AACzB;;AAEA;EACE,aAAa;EACb,WAAW;AACb;;AAEA;EACE,kBAAkB;AACpB;;AAEA;EACE,iBAAiB;AACnB;;AAEA;EACE,WAAW;EACX,mBAAmB;;EAEnB,aAAa;EACb,8BAA8B;EAC9B,gBAAgB;EAChB,qBAAqB;AACvB;;AAEA;EACE,WAAW;;EAEX,aAAa;EACb,8BAA8B;EAC9B,2CAA2C;EAC3C,mBAAmB;EACnB,gBAAgB;EAChB,qBAAqB;AACvB;;AAEA;EACE,mBAAmB;AACrB;;AAEA;EACE,aAAa;EACb,+BAA+B;EAC/B,YAAY;EACZ,kBAAkB;AACpB;;AAEA;EACE,4BAA4B;EAC5B,aAAa;EACb,uCAAuC;EACvC,oCAAoC;AACtC;;AAEA;EACE,2BAA2B;EAC3B,YAAY;EACZ,eAAe;EACf,yBAAyB;EACzB,YAAY;AACd;;AAEA;EACE,2BAA2B;AAC7B;;AAEA;EACE,4BAA4B;AAC9B;;AAEA;EACE,+BAA+B;AACjC;;AAEA;EACE,yBAAyB;AAC3B;;AAEA;EACE,oBAAoB;AACtB;;AAEA;EACE,+BAA+B;AACjC;;AAEA;EACE,YAAY;EACZ,UAAU;EACV,mBAAmB;EACnB,eAAe;AACjB;;AAEA;EACE,YAAY;EACZ,WAAW;EACX,mBAAmB;EACnB,eAAe;AACjB;;AAEA;EACE,YAAY;;EAEZ,gBAAgB;EAChB,aAAa;AACf;;AAEA;EACE,aAAa;EACb,eAAe;EACf,YAAY;EACZ,aAAa;AACf;;AAEA;EACE,YAAY;EACZ,iBAAiB;EACjB,4BAA4B;EAC5B,aAAa;;EAEb,aAAa;EACb,eAAe;EACf,SAAS;AACX;;AAEA;EACE,YAAY;AACd;;AAEA;;;;;EAKE,WAAW;EACX,YAAY;EACZ,+BAA+B;;EAE/B,aAAa;EACb,mBAAmB;EACnB,uBAAuB;AACzB;;AAEA;EACE,sBAAsB;AACxB;;AAEA;EACE,wBAAwB;AAC1B;;AAEA;EACE,YAAY;AACd;;AAEA;EACE,aAAa;AACf;;AAEA;;;EAGE,iBAAiB;AACnB;;AAEA;;;;EAIE,iBAAiB;AACnB;;AAEA;EACE,oBAAoB;EACpB,eAAe;EACf,WAAW;EACX;IACE,cAAc;EAChB;AACF","sourcesContent":["@font-face {\n  font-family: 'Keania';\n  src: url('./assets/KeaniaOne-Regular.ttf') format('truetype');\n}\n@font-face {\n  font-family: 'SpaceMono';\n  src: url('./assets/SpaceMono-Regular.ttf') format('truetype');\n}\n* {\n  margin: 0;\n  padding: 0;\n  box-sizing: border-box;\n  font-family: 'SpaceMono', sans-serif;\n}\n:root {\n  --black: rgb(16, 17, 16);\n  --grey: rgb(219, 219, 219);\n  --yellow: rgb(255, 246, 192);\n}\n\nbody {\n  position: absolute;\n  bottom: 0;\n  top: 0;\n  left: 0;\n  right: 0;\n  margin: 30px;\n  background-color: var(--grey);\n  color: var(--black);\n\n  display: grid;\n  grid-template-rows: min-content min-content;\n  row-gap: 30px;\n  justify-items: center;\n  text-align: center;\n}\n\n.title {\n  font-family: 'Keania';\n  font-size: 60px;\n  font-stretch: extra-expanded;\n}\n\n.menu-screen > form {\n  margin: 30px;\n  display: grid;\n  align-items: center;\n  grid-template-rows: repeat(3, min-content);\n  gap: 50px;\n  align-content: center;\n  justify-items: center;\n}\n\nform > div {\n  display: grid;\n  gap: 10px;\n  justify-content: center;\n}\n\nform > div:nth-child(2) {\n  display: flex;\n  width: 100%;\n}\n\nform button {\n  width: min-content;\n}\n\ninput {\n  padding: 5px 10px;\n}\n\n.game-screen {\n  width: 100%;\n  height: min-content;\n\n  display: grid;\n  grid-template-columns: 1fr 1fr;\n  column-gap: 50px;\n  justify-items: center;\n}\n\n.place-ships-screen {\n  width: 100%;\n\n  display: grid;\n  grid-template-columns: 1fr 1fr;\n  grid-template-rows: min-content min-content;\n  align-items: center;\n  column-gap: 50px;\n  justify-items: center;\n}\n\n.toggle-direction {\n  height: min-content;\n}\n\n.announcement {\n  padding: 20px;\n  width: clamp(300px, 50%, 400px);\n  height: 100%;\n  text-align: center;\n}\n\n.board {\n  background-color: whitesmoke;\n  display: grid;\n  grid-template-columns: repeat(10, 40px);\n  grid-template-rows: repeat(10, 40px);\n}\n\n.board > button {\n  outline: 1px solid darkgrey;\n  height: 40px;\n  min-width: 40px;\n  background-color: inherit;\n  border: none;\n}\n\n.attacks.board > button:hover {\n  background-color: lightgray;\n}\n\n.attacks.board > button:active {\n  background-color: whitesmoke;\n}\n\n.attacks.board > button.ship.disable:hover {\n  background-color: rebeccapurple;\n}\n\n.attacks.board > button.disable:hover {\n  background-color: inherit;\n}\n\n.disable-pointer {\n  pointer-events: none;\n}\n\nbutton.ship {\n  background-color: rebeccapurple;\n}\n\nbutton.hit::before {\n  content: 'X';\n  color: red;\n  font-weight: bolder;\n  font-size: 24px;\n}\n\nbutton.miss::before {\n  content: 'O';\n  color: gray;\n  font-weight: bolder;\n  font-size: 24px;\n}\n\n.board-border {\n  padding: 5px;\n\n  grid-column: 2/3;\n  grid-row: 1/3;\n}\n\n.place-ships.board {\n  display: flex;\n  flex-wrap: wrap;\n  width: 400px;\n  height: 400px;\n}\n\n.draggable-ships-container {\n  width: 350px;\n  min-height: 300px;\n  background-color: whitesmoke;\n  padding: 30px;\n\n  display: flex;\n  flex-wrap: wrap;\n  gap: 20px;\n}\n\n.draggable-ships-container > * {\n  cursor: grab;\n}\n\n#battleship,\n#cruiser,\n#submarine,\n#destroyer,\n#carrier {\n  width: 40px;\n  height: 40px;\n  background-color: rebeccapurple;\n\n  display: flex;\n  align-items: center;\n  justify-content: center;\n}\n\n.place-ships.board > .ship-hover {\n  background-color: gray;\n}\n\n.place-ships.board > .ship-hover.invalid {\n  background-color: maroon;\n}\n\n.transparent {\n  opacity: 0.5;\n}\n\n.hidden {\n  display: none;\n}\n\nbutton.start,\nbutton.toggle-direction,\nbutton.play-again {\n  padding: 5px 12px;\n}\n\n.menu-screen,\n.place-ships-screen,\n.game-screen,\n.winner-screen {\n  max-width: 1000px;\n}\n\nfooter {\n  align-self: flex-end;\n  font-size: 14px;\n  color: gray;\n  a {\n    color: inherit;\n  }\n}\n"],"sourceRoot":""}]);
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ }),

/***/ "./node_modules/css-loader/dist/runtime/api.js":
/*!*****************************************************!*\
  !*** ./node_modules/css-loader/dist/runtime/api.js ***!
  \*****************************************************/
/***/ ((module) => {

"use strict";


/*
  MIT License http://www.opensource.org/licenses/mit-license.php
  Author Tobias Koppers @sokra
*/
module.exports = function (cssWithMappingToString) {
  var list = [];

  // return the list of modules as css string
  list.toString = function toString() {
    return this.map(function (item) {
      var content = "";
      var needLayer = typeof item[5] !== "undefined";
      if (item[4]) {
        content += "@supports (".concat(item[4], ") {");
      }
      if (item[2]) {
        content += "@media ".concat(item[2], " {");
      }
      if (needLayer) {
        content += "@layer".concat(item[5].length > 0 ? " ".concat(item[5]) : "", " {");
      }
      content += cssWithMappingToString(item);
      if (needLayer) {
        content += "}";
      }
      if (item[2]) {
        content += "}";
      }
      if (item[4]) {
        content += "}";
      }
      return content;
    }).join("");
  };

  // import a list of modules into the list
  list.i = function i(modules, media, dedupe, supports, layer) {
    if (typeof modules === "string") {
      modules = [[null, modules, undefined]];
    }
    var alreadyImportedModules = {};
    if (dedupe) {
      for (var k = 0; k < this.length; k++) {
        var id = this[k][0];
        if (id != null) {
          alreadyImportedModules[id] = true;
        }
      }
    }
    for (var _k = 0; _k < modules.length; _k++) {
      var item = [].concat(modules[_k]);
      if (dedupe && alreadyImportedModules[item[0]]) {
        continue;
      }
      if (typeof layer !== "undefined") {
        if (typeof item[5] === "undefined") {
          item[5] = layer;
        } else {
          item[1] = "@layer".concat(item[5].length > 0 ? " ".concat(item[5]) : "", " {").concat(item[1], "}");
          item[5] = layer;
        }
      }
      if (media) {
        if (!item[2]) {
          item[2] = media;
        } else {
          item[1] = "@media ".concat(item[2], " {").concat(item[1], "}");
          item[2] = media;
        }
      }
      if (supports) {
        if (!item[4]) {
          item[4] = "".concat(supports);
        } else {
          item[1] = "@supports (".concat(item[4], ") {").concat(item[1], "}");
          item[4] = supports;
        }
      }
      list.push(item);
    }
  };
  return list;
};

/***/ }),

/***/ "./node_modules/css-loader/dist/runtime/getUrl.js":
/*!********************************************************!*\
  !*** ./node_modules/css-loader/dist/runtime/getUrl.js ***!
  \********************************************************/
/***/ ((module) => {

"use strict";


module.exports = function (url, options) {
  if (!options) {
    options = {};
  }
  if (!url) {
    return url;
  }
  url = String(url.__esModule ? url.default : url);

  // If url is already wrapped in quotes, remove them
  if (/^['"].*['"]$/.test(url)) {
    url = url.slice(1, -1);
  }
  if (options.hash) {
    url += options.hash;
  }

  // Should url be wrapped?
  // See https://drafts.csswg.org/css-values-3/#urls
  if (/["'() \t\n]|(%20)/.test(url) || options.needQuotes) {
    return "\"".concat(url.replace(/"/g, '\\"').replace(/\n/g, "\\n"), "\"");
  }
  return url;
};

/***/ }),

/***/ "./node_modules/css-loader/dist/runtime/sourceMaps.js":
/*!************************************************************!*\
  !*** ./node_modules/css-loader/dist/runtime/sourceMaps.js ***!
  \************************************************************/
/***/ ((module) => {

"use strict";


module.exports = function (item) {
  var content = item[1];
  var cssMapping = item[3];
  if (!cssMapping) {
    return content;
  }
  if (typeof btoa === "function") {
    var base64 = btoa(unescape(encodeURIComponent(JSON.stringify(cssMapping))));
    var data = "sourceMappingURL=data:application/json;charset=utf-8;base64,".concat(base64);
    var sourceMapping = "/*# ".concat(data, " */");
    return [content].concat([sourceMapping]).join("\n");
  }
  return [content].join("\n");
};

/***/ }),

/***/ "./src/styles.css":
/*!************************!*\
  !*** ./src/styles.css ***!
  \************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! !../node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js */ "./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! !../node_modules/style-loader/dist/runtime/styleDomAPI.js */ "./node_modules/style-loader/dist/runtime/styleDomAPI.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! !../node_modules/style-loader/dist/runtime/insertBySelector.js */ "./node_modules/style-loader/dist/runtime/insertBySelector.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! !../node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js */ "./node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! !../node_modules/style-loader/dist/runtime/insertStyleElement.js */ "./node_modules/style-loader/dist/runtime/insertStyleElement.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! !../node_modules/style-loader/dist/runtime/styleTagTransform.js */ "./node_modules/style-loader/dist/runtime/styleTagTransform.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var _node_modules_css_loader_dist_cjs_js_styles_css__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! !!../node_modules/css-loader/dist/cjs.js!./styles.css */ "./node_modules/css-loader/dist/cjs.js!./src/styles.css");

      
      
      
      
      
      
      
      
      

var options = {};

options.styleTagTransform = (_node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5___default());
options.setAttributes = (_node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3___default());

      options.insert = _node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2___default().bind(null, "head");
    
options.domAPI = (_node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1___default());
options.insertStyleElement = (_node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4___default());

var update = _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default()(_node_modules_css_loader_dist_cjs_js_styles_css__WEBPACK_IMPORTED_MODULE_6__["default"], options);




       /* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_css_loader_dist_cjs_js_styles_css__WEBPACK_IMPORTED_MODULE_6__["default"] && _node_modules_css_loader_dist_cjs_js_styles_css__WEBPACK_IMPORTED_MODULE_6__["default"].locals ? _node_modules_css_loader_dist_cjs_js_styles_css__WEBPACK_IMPORTED_MODULE_6__["default"].locals : undefined);


/***/ }),

/***/ "./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js":
/*!****************************************************************************!*\
  !*** ./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js ***!
  \****************************************************************************/
/***/ ((module) => {

"use strict";


var stylesInDOM = [];
function getIndexByIdentifier(identifier) {
  var result = -1;
  for (var i = 0; i < stylesInDOM.length; i++) {
    if (stylesInDOM[i].identifier === identifier) {
      result = i;
      break;
    }
  }
  return result;
}
function modulesToDom(list, options) {
  var idCountMap = {};
  var identifiers = [];
  for (var i = 0; i < list.length; i++) {
    var item = list[i];
    var id = options.base ? item[0] + options.base : item[0];
    var count = idCountMap[id] || 0;
    var identifier = "".concat(id, " ").concat(count);
    idCountMap[id] = count + 1;
    var indexByIdentifier = getIndexByIdentifier(identifier);
    var obj = {
      css: item[1],
      media: item[2],
      sourceMap: item[3],
      supports: item[4],
      layer: item[5]
    };
    if (indexByIdentifier !== -1) {
      stylesInDOM[indexByIdentifier].references++;
      stylesInDOM[indexByIdentifier].updater(obj);
    } else {
      var updater = addElementStyle(obj, options);
      options.byIndex = i;
      stylesInDOM.splice(i, 0, {
        identifier: identifier,
        updater: updater,
        references: 1
      });
    }
    identifiers.push(identifier);
  }
  return identifiers;
}
function addElementStyle(obj, options) {
  var api = options.domAPI(options);
  api.update(obj);
  var updater = function updater(newObj) {
    if (newObj) {
      if (newObj.css === obj.css && newObj.media === obj.media && newObj.sourceMap === obj.sourceMap && newObj.supports === obj.supports && newObj.layer === obj.layer) {
        return;
      }
      api.update(obj = newObj);
    } else {
      api.remove();
    }
  };
  return updater;
}
module.exports = function (list, options) {
  options = options || {};
  list = list || [];
  var lastIdentifiers = modulesToDom(list, options);
  return function update(newList) {
    newList = newList || [];
    for (var i = 0; i < lastIdentifiers.length; i++) {
      var identifier = lastIdentifiers[i];
      var index = getIndexByIdentifier(identifier);
      stylesInDOM[index].references--;
    }
    var newLastIdentifiers = modulesToDom(newList, options);
    for (var _i = 0; _i < lastIdentifiers.length; _i++) {
      var _identifier = lastIdentifiers[_i];
      var _index = getIndexByIdentifier(_identifier);
      if (stylesInDOM[_index].references === 0) {
        stylesInDOM[_index].updater();
        stylesInDOM.splice(_index, 1);
      }
    }
    lastIdentifiers = newLastIdentifiers;
  };
};

/***/ }),

/***/ "./node_modules/style-loader/dist/runtime/insertBySelector.js":
/*!********************************************************************!*\
  !*** ./node_modules/style-loader/dist/runtime/insertBySelector.js ***!
  \********************************************************************/
/***/ ((module) => {

"use strict";


var memo = {};

/* istanbul ignore next  */
function getTarget(target) {
  if (typeof memo[target] === "undefined") {
    var styleTarget = document.querySelector(target);

    // Special case to return head of iframe instead of iframe itself
    if (window.HTMLIFrameElement && styleTarget instanceof window.HTMLIFrameElement) {
      try {
        // This will throw an exception if access to iframe is blocked
        // due to cross-origin restrictions
        styleTarget = styleTarget.contentDocument.head;
      } catch (e) {
        // istanbul ignore next
        styleTarget = null;
      }
    }
    memo[target] = styleTarget;
  }
  return memo[target];
}

/* istanbul ignore next  */
function insertBySelector(insert, style) {
  var target = getTarget(insert);
  if (!target) {
    throw new Error("Couldn't find a style target. This probably means that the value for the 'insert' parameter is invalid.");
  }
  target.appendChild(style);
}
module.exports = insertBySelector;

/***/ }),

/***/ "./node_modules/style-loader/dist/runtime/insertStyleElement.js":
/*!**********************************************************************!*\
  !*** ./node_modules/style-loader/dist/runtime/insertStyleElement.js ***!
  \**********************************************************************/
/***/ ((module) => {

"use strict";


/* istanbul ignore next  */
function insertStyleElement(options) {
  var element = document.createElement("style");
  options.setAttributes(element, options.attributes);
  options.insert(element, options.options);
  return element;
}
module.exports = insertStyleElement;

/***/ }),

/***/ "./node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js":
/*!**********************************************************************************!*\
  !*** ./node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js ***!
  \**********************************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


/* istanbul ignore next  */
function setAttributesWithoutAttributes(styleElement) {
  var nonce =  true ? __webpack_require__.nc : 0;
  if (nonce) {
    styleElement.setAttribute("nonce", nonce);
  }
}
module.exports = setAttributesWithoutAttributes;

/***/ }),

/***/ "./node_modules/style-loader/dist/runtime/styleDomAPI.js":
/*!***************************************************************!*\
  !*** ./node_modules/style-loader/dist/runtime/styleDomAPI.js ***!
  \***************************************************************/
/***/ ((module) => {

"use strict";


/* istanbul ignore next  */
function apply(styleElement, options, obj) {
  var css = "";
  if (obj.supports) {
    css += "@supports (".concat(obj.supports, ") {");
  }
  if (obj.media) {
    css += "@media ".concat(obj.media, " {");
  }
  var needLayer = typeof obj.layer !== "undefined";
  if (needLayer) {
    css += "@layer".concat(obj.layer.length > 0 ? " ".concat(obj.layer) : "", " {");
  }
  css += obj.css;
  if (needLayer) {
    css += "}";
  }
  if (obj.media) {
    css += "}";
  }
  if (obj.supports) {
    css += "}";
  }
  var sourceMap = obj.sourceMap;
  if (sourceMap && typeof btoa !== "undefined") {
    css += "\n/*# sourceMappingURL=data:application/json;base64,".concat(btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))), " */");
  }

  // For old IE
  /* istanbul ignore if  */
  options.styleTagTransform(css, styleElement, options.options);
}
function removeStyleElement(styleElement) {
  // istanbul ignore if
  if (styleElement.parentNode === null) {
    return false;
  }
  styleElement.parentNode.removeChild(styleElement);
}

/* istanbul ignore next  */
function domAPI(options) {
  if (typeof document === "undefined") {
    return {
      update: function update() {},
      remove: function remove() {}
    };
  }
  var styleElement = options.insertStyleElement(options);
  return {
    update: function update(obj) {
      apply(styleElement, options, obj);
    },
    remove: function remove() {
      removeStyleElement(styleElement);
    }
  };
}
module.exports = domAPI;

/***/ }),

/***/ "./node_modules/style-loader/dist/runtime/styleTagTransform.js":
/*!*********************************************************************!*\
  !*** ./node_modules/style-loader/dist/runtime/styleTagTransform.js ***!
  \*********************************************************************/
/***/ ((module) => {

"use strict";


/* istanbul ignore next  */
function styleTagTransform(css, styleElement) {
  if (styleElement.styleSheet) {
    styleElement.styleSheet.cssText = css;
  } else {
    while (styleElement.firstChild) {
      styleElement.removeChild(styleElement.firstChild);
    }
    styleElement.appendChild(document.createTextNode(css));
  }
}
module.exports = styleTagTransform;

/***/ }),

/***/ "./src/assets/KeaniaOne-Regular.ttf":
/*!******************************************!*\
  !*** ./src/assets/KeaniaOne-Regular.ttf ***!
  \******************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
module.exports = __webpack_require__.p + "61aeb697b2632c95517a.ttf";

/***/ }),

/***/ "./src/assets/SpaceMono-Regular.ttf":
/*!******************************************!*\
  !*** ./src/assets/SpaceMono-Regular.ttf ***!
  \******************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
module.exports = __webpack_require__.p + "8a2aa304d0bd5e41d186.ttf";

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			id: moduleId,
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = __webpack_modules__;
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/global */
/******/ 	(() => {
/******/ 		__webpack_require__.g = (function() {
/******/ 			if (typeof globalThis === 'object') return globalThis;
/******/ 			try {
/******/ 				return this || new Function('return this')();
/******/ 			} catch (e) {
/******/ 				if (typeof window === 'object') return window;
/******/ 			}
/******/ 		})();
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/publicPath */
/******/ 	(() => {
/******/ 		var scriptUrl;
/******/ 		if (__webpack_require__.g.importScripts) scriptUrl = __webpack_require__.g.location + "";
/******/ 		var document = __webpack_require__.g.document;
/******/ 		if (!scriptUrl && document) {
/******/ 			if (document.currentScript)
/******/ 				scriptUrl = document.currentScript.src;
/******/ 			if (!scriptUrl) {
/******/ 				var scripts = document.getElementsByTagName("script");
/******/ 				if(scripts.length) {
/******/ 					var i = scripts.length - 1;
/******/ 					while (i > -1 && !scriptUrl) scriptUrl = scripts[i--].src;
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 		// When supporting browsers where an automatic publicPath is not supported you must specify an output.publicPath manually via configuration
/******/ 		// or pass an empty string ("") and set the __webpack_public_path__ variable from your code to use your own logic.
/******/ 		if (!scriptUrl) throw new Error("Automatic publicPath is not supported in this browser");
/******/ 		scriptUrl = scriptUrl.replace(/#.*$/, "").replace(/\?.*$/, "").replace(/\/[^\/]+$/, "/");
/******/ 		__webpack_require__.p = scriptUrl;
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/jsonp chunk loading */
/******/ 	(() => {
/******/ 		__webpack_require__.b = document.baseURI || self.location.href;
/******/ 		
/******/ 		// object to store loaded and loading chunks
/******/ 		// undefined = chunk not loaded, null = chunk preloaded/prefetched
/******/ 		// [resolve, reject, Promise] = chunk loading, 0 = chunk loaded
/******/ 		var installedChunks = {
/******/ 			"main": 0
/******/ 		};
/******/ 		
/******/ 		// no chunk on demand loading
/******/ 		
/******/ 		// no prefetching
/******/ 		
/******/ 		// no preloaded
/******/ 		
/******/ 		// no HMR
/******/ 		
/******/ 		// no HMR manifest
/******/ 		
/******/ 		// no on chunks loaded
/******/ 		
/******/ 		// no jsonp function
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/nonce */
/******/ 	(() => {
/******/ 		__webpack_require__.nc = undefined;
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be in strict mode.
(() => {
"use strict";
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _styles_css__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./styles.css */ "./src/styles.css");
/* harmony import */ var _modules_GameScreen__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./modules/GameScreen */ "./src/modules/GameScreen.js");
/* harmony import */ var _modules_PlaceShipsScreen__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./modules/PlaceShipsScreen */ "./src/modules/PlaceShipsScreen.js");
/* harmony import */ var _modules_WinnerScreen__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./modules/WinnerScreen */ "./src/modules/WinnerScreen.js");
/* harmony import */ var _modules_WinnerScreen__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_modules_WinnerScreen__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _modules_MenuScreen__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./modules/MenuScreen */ "./src/modules/MenuScreen.js");





})();

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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O0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsT0FBTyxpRkFBaUYsWUFBWSxhQUFhLE1BQU0sS0FBSyxZQUFZLGFBQWEsTUFBTSxLQUFLLFVBQVUsVUFBVSxZQUFZLGFBQWEsTUFBTSxLQUFLLFlBQVksYUFBYSxhQUFhLE9BQU8sS0FBSyxZQUFZLFdBQVcsVUFBVSxVQUFVLFVBQVUsVUFBVSxZQUFZLGNBQWMsV0FBVyxZQUFZLFdBQVcsWUFBWSxhQUFhLE9BQU8sS0FBSyxZQUFZLFdBQVcsWUFBWSxPQUFPLEtBQUssVUFBVSxVQUFVLFlBQVksYUFBYSxXQUFXLFlBQVksYUFBYSxPQUFPLEtBQUssVUFBVSxVQUFVLFlBQVksT0FBTyxLQUFLLFVBQVUsVUFBVSxNQUFNLEtBQUssWUFBWSxPQUFPLEtBQUssWUFBWSxPQUFPLEtBQUssVUFBVSxhQUFhLFdBQVcsWUFBWSxhQUFhLGFBQWEsT0FBTyxLQUFLLFdBQVcsVUFBVSxZQUFZLGFBQWEsYUFBYSxhQUFhLGFBQWEsT0FBTyxLQUFLLFlBQVksT0FBTyxLQUFLLFVBQVUsWUFBWSxXQUFXLFlBQVksT0FBTyxLQUFLLFlBQVksV0FBVyxZQUFZLGFBQWEsT0FBTyxLQUFLLFlBQVksV0FBVyxVQUFVLFlBQVksV0FBVyxNQUFNLEtBQUssWUFBWSxPQUFPLEtBQUssWUFBWSxPQUFPLEtBQUssWUFBWSxPQUFPLEtBQUssWUFBWSxPQUFPLEtBQUssWUFBWSxPQUFPLEtBQUssWUFBWSxPQUFPLEtBQUssVUFBVSxVQUFVLFlBQVksV0FBVyxPQUFPLEtBQUssVUFBVSxVQUFVLFlBQVksV0FBVyxPQUFPLEtBQUssV0FBVyxZQUFZLFdBQVcsTUFBTSxLQUFLLFVBQVUsVUFBVSxVQUFVLFVBQVUsTUFBTSxLQUFLLFVBQVUsWUFBWSxhQUFhLFlBQVksVUFBVSxVQUFVLFVBQVUsTUFBTSxLQUFLLFVBQVUsTUFBTSxTQUFTLFVBQVUsVUFBVSxhQUFhLFdBQVcsWUFBWSxhQUFhLE9BQU8sS0FBSyxZQUFZLE9BQU8sS0FBSyxZQUFZLE9BQU8sS0FBSyxVQUFVLE1BQU0sS0FBSyxVQUFV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Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7Ozs7Ozs7QUM1RGE7O0FBRWI7QUFDQTtBQUNBO0FBQ0E7QUFDQSxJQUFJO0FBQ0o7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7VUNiQTtVQUNBOztVQUVBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBOztVQUVBO1VBQ0E7O1VBRUE7VUFDQTtVQUNBOztVQUVBO1VBQ0E7Ozs7O1dDekJBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQSxpQ0FBaUMsV0FBVztXQUM1QztXQUNBOzs7OztXQ1BBO1dBQ0E7V0FDQTtXQUNBO1dBQ0EseUNBQXlDLHdDQUF3QztXQUNqRjtXQUNBO1dBQ0E7Ozs7O1dDUEE7V0FDQTtXQUNBO1dBQ0E7V0FDQSxHQUFHO1dBQ0g7V0FDQTtXQUNBLENBQUM7Ozs7O1dDUEQ7Ozs7O1dDQUE7V0FDQTtXQUNBO1dBQ0EsdURBQXVELGlCQUFpQjtXQUN4RTtXQUNBLGdEQUFnRCxhQUFhO1dBQzdEOzs7OztXQ05BO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBOzs7OztXQ2xCQTs7V0FFQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7O1dBRUE7O1dBRUE7O1dBRUE7O1dBRUE7O1dBRUE7O1dBRUE7O1dBRUE7Ozs7O1dDckJBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7QUNBc0I7QUFDUTtBQUNNO0FBQ0oiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vc3JjL2NsYXNzZXMvR2FtZWJvYXJkLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9zcmMvY2xhc3Nlcy9QbGF5ZXIuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL3NyYy9jbGFzc2VzL1NoaXAuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL3NyYy9tb2R1bGVzL0RPTXNjcmVlbnMuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL3NyYy9tb2R1bGVzL0dhbWVDb250cm9sbGVyLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9zcmMvbW9kdWxlcy9HYW1lU2NyZWVuLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9zcmMvbW9kdWxlcy9NZW51U2NyZWVuLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9zcmMvbW9kdWxlcy9QbGFjZVNoaXBzU2NyZWVuLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9zcmMvbW9kdWxlcy9XaW5uZXJTY3JlZW4uanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL3NyYy9zdHlsZXMuY3NzIiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9kaXN0L3J1bnRpbWUvYXBpLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9kaXN0L3J1bnRpbWUvZ2V0VXJsLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9kaXN0L3J1bnRpbWUvc291cmNlTWFwcy5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vc3JjL3N0eWxlcy5jc3M/NDRiMiIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvaW5qZWN0U3R5bGVzSW50b1N0eWxlVGFnLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9pbnNlcnRCeVNlbGVjdG9yLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9pbnNlcnRTdHlsZUVsZW1lbnQuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL3NldEF0dHJpYnV0ZXNXaXRob3V0QXR0cmlidXRlcy5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvc3R5bGVEb21BUEkuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL3N0eWxlVGFnVHJhbnNmb3JtLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAvd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC93ZWJwYWNrL3J1bnRpbWUvY29tcGF0IGdldCBkZWZhdWx0IGV4cG9ydCIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwL3dlYnBhY2svcnVudGltZS9kZWZpbmUgcHJvcGVydHkgZ2V0dGVycyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwL3dlYnBhY2svcnVudGltZS9nbG9iYWwiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC93ZWJwYWNrL3J1bnRpbWUvaGFzT3duUHJvcGVydHkgc2hvcnRoYW5kIiwid2VicGFjazovL2JhdHRsZXNoaXAvd2VicGFjay9ydW50aW1lL21ha2UgbmFtZXNwYWNlIG9iamVjdCIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwL3dlYnBhY2svcnVudGltZS9wdWJsaWNQYXRoIiwid2VicGFjazovL2JhdHRsZXNoaXAvd2VicGFjay9ydW50aW1lL2pzb25wIGNodW5rIGxvYWRpbmciLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC93ZWJwYWNrL3J1bnRpbWUvbm9uY2UiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL3NyYy9pbmRleC5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyJleHBvcnQgZGVmYXVsdCBjbGFzcyBHYW1lYm9hcmQge1xuICAjY29tcHV0ZXJzUHJldkF0dGFja0Nvb3JkID0gbnVsbDtcblxuICBjb25zdHJ1Y3RvcigpIHtcbiAgICAvLyBjcmVhdGVzIDEweDEwIGdyaWQgd2l0aCBvcmlnaW4gYmVpbmcgdGhlIHRvcCBsZWZ0LlxuICAgIC8vIHBvc2l0aW9uIHNlbGVjdGVkIGJ5IFt5LCB4XSBjb29yZGluYXRlcyB3aGVyZVxuICAgIC8vIHkgPSByb3cgbnVtYmVyIGFuZCB4ID0gY29sdW1uIG51bWJlci5cbiAgICB0aGlzLmJvYXJkID0gR2FtZWJvYXJkLiNnZXROZXdCb2FyZCgpO1xuICAgIHRoaXMuc2hpcHMgPSBbXTtcbiAgfVxuXG4gIHN0YXRpYyAjZ2V0TmV3Qm9hcmQoKSB7XG4gICAgcmV0dXJuIEFycmF5KDEwKVxuICAgICAgLmZpbGwobnVsbClcbiAgICAgIC5tYXAoKCkgPT4gQXJyYXkoMTApLmZpbGwobnVsbCkpO1xuICB9XG5cbiAgc3RhdGljIGdldFNoaXBDb29yZGluYXRlcyhjbGlja2VkQ29vcmQsIHNoaXBJbnN0YW5jZSwgZGlyZWN0aW9uKSB7XG4gICAgY29uc3QgW3ksIHhdID0gY2xpY2tlZENvb3JkO1xuICAgIGNvbnN0IGxlbmd0aCA9IHNoaXBJbnN0YW5jZS5nZXRMZW5ndGgoKTtcbiAgICBjb25zdCBjb29yZHMgPSBbXTtcbiAgICBpZiAoZGlyZWN0aW9uID09PSAnaG9yaXpvbnRhbCcpIHtcbiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbGVuZ3RoOyBpICs9IDEpIHtcbiAgICAgICAgY29vcmRzLnB1c2goW3ksIHggKyBpXSk7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbGVuZ3RoOyBpICs9IDEpIHtcbiAgICAgICAgY29vcmRzLnB1c2goW3kgKyBpLCB4XSk7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBjb29yZHM7XG4gIH1cblxuICByZXNldEJvYXJkKCkge1xuICAgIHRoaXMuYm9hcmQgPSBHYW1lYm9hcmQuI2dldE5ld0JvYXJkKCk7XG4gICAgdGhpcy5zaGlwcyA9IFtdO1xuICB9XG5cbiAgcGxhY2VTaGlwKGNsaWNrZWRDb29yZCwgc2hpcEluc3RhbmNlKSB7XG4gICAgY29uc3QgW3ksIHhdID0gY2xpY2tlZENvb3JkO1xuICAgIGNvbnN0IGxlbmd0aCA9IHNoaXBJbnN0YW5jZS5nZXRMZW5ndGgoKTtcbiAgICBjb25zdCB7IGRpcmVjdGlvbiB9ID0gc2hpcEluc3RhbmNlO1xuXG4gICAgLy8gaWYgdmFsaWQgc3BvdCwgcGxhY2Ugc2hpcCBvbiBib2FyZCBob3Jpem9udGFsbHkgb3IgdmVydGljYWxseVxuICAgIGlmICh0aGlzLmlzVmFsaWRQb3NpdGlvbihbeSwgeF0sIHNoaXBJbnN0YW5jZSkpIHtcbiAgICAgIGxldCB5Q291bnQgPSAwO1xuICAgICAgbGV0IHhDb3VudCA9IDA7XG4gICAgICB0aGlzLnNoaXBzLnB1c2goc2hpcEluc3RhbmNlKTtcbiAgICAgIHdoaWxlIChcbiAgICAgICAgKHlDb3VudCA9PT0gMCAmJiB4Q291bnQgPCBsZW5ndGgpIHx8XG4gICAgICAgICh5Q291bnQgPCBsZW5ndGggJiYgeENvdW50ID09PSAwKVxuICAgICAgKSB7XG4gICAgICAgIHRoaXMuYm9hcmRbeSArIHlDb3VudF1beCArIHhDb3VudF0gPSB7IHNoaXA6IHNoaXBJbnN0YW5jZSB9O1xuICAgICAgICBpZiAoZGlyZWN0aW9uID09PSAnaG9yaXpvbnRhbCcpIHhDb3VudCArPSAxO1xuICAgICAgICBlbHNlIHlDb3VudCArPSAxO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIGlzVmFsaWRQb3NpdGlvbihjbGlja2VkQ29vcmQsIHNoaXBJbnN0YW5jZSkge1xuICAgIGNvbnN0IFt5LCB4XSA9IGNsaWNrZWRDb29yZDtcbiAgICBjb25zdCBsZW5ndGggPSBzaGlwSW5zdGFuY2UuZ2V0TGVuZ3RoKCk7XG4gICAgY29uc3QgeyBkaXJlY3Rpb24gfSA9IHNoaXBJbnN0YW5jZTtcblxuICAgIC8vIGRvIG5vdCBwbGFjZSBzaGlwIG9mZiB0aGUgYm9hcmRcbiAgICBjb25zdCBzdGVyblBvc2l0b24gPSAoZGlyZWN0aW9uID09PSAnaG9yaXpvbnRhbCcgPyB4IDogeSkgKyAobGVuZ3RoIC0gMSk7XG4gICAgaWYgKHN0ZXJuUG9zaXRvbiA+IDkpIHJldHVybiBmYWxzZTtcblxuICAgIC8vIGRvIG5vdCBvdmVybGFwIHNoaXBzXG4gICAgY29uc3QgcHJvcG9zZWRTaGlwQ29vcmRpbmF0ZXMgPSBHYW1lYm9hcmQuZ2V0U2hpcENvb3JkaW5hdGVzKFxuICAgICAgY2xpY2tlZENvb3JkLFxuICAgICAgc2hpcEluc3RhbmNlLFxuICAgICAgZGlyZWN0aW9uLFxuICAgICk7XG4gICAgY29uc3QgY29vcmRpbmF0ZXNWYWNhbmN5ID0gcHJvcG9zZWRTaGlwQ29vcmRpbmF0ZXMubWFwKChjb29yZCkgPT5cbiAgICAgIEJvb2xlYW4odGhpcy5ib2FyZFtjb29yZFswXV1bY29vcmRbMV1dKSxcbiAgICApO1xuICAgIGlmIChjb29yZGluYXRlc1ZhY2FuY3kuc29tZSgob2NjdXBpZWQpID0+IG9jY3VwaWVkKSkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIHJldHVybiB0cnVlO1xuICB9XG5cbiAgcmVjZWl2ZUF0dGFjayhjb29yZCkge1xuICAgIGNvbnN0IFt5LCB4XSA9IGNvb3JkO1xuICAgIGNvbnN0IHNxdWFyZSA9IHRoaXMuYm9hcmRbeV1beF07XG4gICAgaWYgKHNxdWFyZSA9PT0gbnVsbCkge1xuICAgICAgdGhpcy5ib2FyZFt5XVt4XSA9IHsgYXR0YWNrU3RhdHVzOiAnbWlzcycgfTtcbiAgICB9IGVsc2UgaWYgKE9iamVjdC5oYXNPd24oc3F1YXJlLCAnc2hpcCcpKSB7XG4gICAgICBzcXVhcmUuc2hpcC5oaXQoKTtcbiAgICAgIHNxdWFyZS5hdHRhY2tTdGF0dXMgPSAnaGl0JztcbiAgICB9XG4gIH1cblxuICBnZXRBdHRhY2tTdGF0dXMoY29vcmQpIHtcbiAgICBjb25zdCBbeSwgeF0gPSBjb29yZDtcbiAgICBjb25zdCBzcXVhcmUgPSB0aGlzLmJvYXJkW3ldW3hdO1xuICAgIGlmIChzcXVhcmUpIHJldHVybiBzcXVhcmUuYXR0YWNrU3RhdHVzO1xuICAgIHJldHVybiBzcXVhcmU7XG4gIH1cblxuICBhbGxTaGlwc0Rvd24oKSB7XG4gICAgY29uc3QgYWxsRG93biA9IHRoaXMuc2hpcHNcbiAgICAgIC5tYXAoKHNoaXApID0+IHNoaXAuaXNTdW5rKCkpXG4gICAgICAuZXZlcnkoKHN0YXR1cykgPT4gc3RhdHVzID09PSB0cnVlKTtcbiAgICBpZiAoYWxsRG93bikgcmV0dXJuIHRydWU7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgZ2V0Q29tcHV0ZXJBdHRhY2tSYW5kb20oKSB7XG4gICAgLy8gZ2V0IHJhbmRvbSwgb3BlbiBwb3NpdGlvbiB0aGF0IGRvZXMgbm90IGhhdmUgYXR0YWNrU3RhdHVzXG4gICAgbGV0IGNvb3JkO1xuICAgIGxldCBpc1Bvc2l0aW9uT3BlbiA9IGZhbHNlO1xuICAgIHdoaWxlICghaXNQb3NpdGlvbk9wZW4pIHtcbiAgICAgIGNvb3JkID0gW251bGwsIG51bGxdLm1hcCgoKSA9PiBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiAxMCkpO1xuICAgICAgY29uc3QgaGFzT2JqID0gdGhpcy5ib2FyZFtjb29yZFswXV1bY29vcmRbMV1dO1xuICAgICAgaWYgKGhhc09iaiAmJiBPYmplY3QuaGFzT3duKGhhc09iaiwgJ2F0dGFja1N0YXR1cycpKSB7XG4gICAgICAgIGlzUG9zaXRpb25PcGVuID0gZmFsc2U7XG4gICAgICB9IGVsc2UgaXNQb3NpdGlvbk9wZW4gPSB0cnVlO1xuICAgIH1cblxuICAgIC8vIHNlbmQgY29tcHV0ZXIncyBhdHRhY2tcbiAgICB0aGlzLnJlY2VpdmVBdHRhY2soY29vcmQpO1xuICAgIHJldHVybiBjb29yZDtcbiAgfVxuXG4gIHNldENvbXB1dGVyc1ByZXZpb3VzQXR0YWNrQ29vcmQoY29vcmQpIHtcbiAgICB0aGlzLiNjb21wdXRlcnNQcmV2QXR0YWNrQ29vcmQgPSBjb29yZDtcbiAgfVxuXG4gIGdldENvbXB1dGVyQXR0YWNrTWVkaXVtKCkge1xuICAgIC8qKlxuICAgICAqIFRoaXMgbWV0aG9kIGNoZWNrcyB0aGUgYXR0YWNrIHN0YXR1cyBvZiB0aGUgY29tcHV0ZXIncyBwcmV2aW91cyBhdHRhY2suXG4gICAgICogSWYgaXQgd2FzIGEgbWlzcywgaXQnbGwgYXR0YWNrIGEgcmFuZG9tIGNlbGwgb24gdGhlIGJvYXJkLlxuICAgICAqIEl0IGl0IHdhcyBhIGhpdCwgaXQnbGwgYXR0YWNrIGEgcmFuZG9tIG5laWdoYm9yIGNlbGwuXG4gICAgICovXG5cbiAgICAvLyBpZiBubyBwcmV2aW91cyBjb21wdXRlciBhdHRhY2sgb3IgaWYgaXQgYXR0YWNrZWQgYW5kIHdhcyBhIG1pc3MsIGF0dGFjayByYW5kb20gY2VsbFxuICAgIGlmIChcbiAgICAgICF0aGlzLiNjb21wdXRlcnNQcmV2QXR0YWNrQ29vcmQgfHxcbiAgICAgIHRoaXMuYm9hcmRbdGhpcy4jY29tcHV0ZXJzUHJldkF0dGFja0Nvb3JkWzBdXVtcbiAgICAgICAgdGhpcy4jY29tcHV0ZXJzUHJldkF0dGFja0Nvb3JkWzFdXG4gICAgICBdLmF0dGFja1N0YXR1cyA9PT0gJ21pc3MnXG4gICAgKSB7XG4gICAgICB0aGlzLiNjb21wdXRlcnNQcmV2QXR0YWNrQ29vcmQgPSB0aGlzLmdldENvbXB1dGVyQXR0YWNrUmFuZG9tKCk7XG4gICAgICByZXR1cm4gdGhpcy4jY29tcHV0ZXJzUHJldkF0dGFja0Nvb3JkO1xuICAgIH1cblxuICAgIC8vIGVsc2UgcHJldiBhdHRhY2sgd2FzIGEgaGl0LCBzbyBhdHRhY2sgYSBuZWlnaGJvciBjZWxsXG4gICAgY29uc3QgW3JlZlksIHJlZlhdID0gdGhpcy4jY29tcHV0ZXJzUHJldkF0dGFja0Nvb3JkO1xuICAgIGNvbnN0IGNvb3JkQ2hhbmdlcyA9IFtcbiAgICAgIFstMSwgMF0sXG4gICAgICBbMCwgMV0sXG4gICAgICBbMSwgMF0sXG4gICAgICBbMCwgLTFdLFxuICAgIF07XG4gICAgY29uc3QgYWxsTmVpZ2hib3JDb29yZHMgPSBbXTtcbiAgICBjb29yZENoYW5nZXMuZm9yRWFjaCgoW2NoYW5nZVksIGNoYW5nZVhdKSA9PiB7XG4gICAgICBjb25zdCBbbmVpZ2hib3JZLCBuZWlnaGJvclhdID0gW3JlZlkgKyBjaGFuZ2VZLCByZWZYICsgY2hhbmdlWF07XG4gICAgICBpZiAobmVpZ2hib3JZID49IDAgJiYgbmVpZ2hib3JZIDw9IDkgJiYgbmVpZ2hib3JYID49IDAgJiYgbmVpZ2hib3JYIDw9IDkpXG4gICAgICAgIGFsbE5laWdoYm9yQ29vcmRzLnB1c2goW25laWdoYm9yWSwgbmVpZ2hib3JYXSk7XG4gICAgfSk7XG5cbiAgICAvLyBmaW5kIG9wZW4gbmVpZ2hib3IgY2VsbHMgdGhhdCBoYXZlbid0IGJlZW4gYXR0YWNrZWRcbiAgICBjb25zdCBvcGVuTmVpZ2hib3JDb29yZHMgPSBhbGxOZWlnaGJvckNvb3Jkcy5maWx0ZXIoXG4gICAgICAoW3ksIHhdKSA9PiAhdGhpcy5ib2FyZFt5XVt4XT8uYXR0YWNrU3RhdHVzLFxuICAgICk7XG5cbiAgICAvLyBpZiBubyBvcGVuIG5laWdoYm9yIGNlbGxzLCBhdHRhY2sgYW55IG90aGVyIHJhbmRvbSBjZWxsXG4gICAgaWYgKG9wZW5OZWlnaGJvckNvb3Jkcy5sZW5ndGggPT09IDApIHtcbiAgICAgIHRoaXMuI2NvbXB1dGVyc1ByZXZBdHRhY2tDb29yZCA9IHRoaXMuZ2V0Q29tcHV0ZXJBdHRhY2tSYW5kb20oKTtcbiAgICAgIHJldHVybiB0aGlzLiNjb21wdXRlcnNQcmV2QXR0YWNrQ29vcmQ7XG4gICAgfVxuXG4gICAgLy8gaWYgYW55IG5laWdoYm9yIGNlbGxzIHdlcmUgaGl0LCBhdHRhY2sgdGhlIG5laWdoYm9yIGRpcmVjdGx5IG9wcG9zaXRlIGl0XG4gICAgY29uc3QgcHJldmlvdXNseUhpdE5laWdoYm9ycyA9IGFsbE5laWdoYm9yQ29vcmRzLmZpbHRlcigoW3ksIHhdKSA9PiB7XG4gICAgICBjb25zdCBoYXNBdHRhY2tTdGF0dXMgPSB0aGlzLmJvYXJkW3ldW3hdPy5hdHRhY2tTdGF0dXM7XG4gICAgICByZXR1cm4gaGFzQXR0YWNrU3RhdHVzID09PSAnaGl0JztcbiAgICB9KTtcbiAgICBsZXQgaW5kZXhDb3VudGVyID0gMDtcbiAgICB3aGlsZSAoaW5kZXhDb3VudGVyIDwgcHJldmlvdXNseUhpdE5laWdoYm9ycy5sZW5ndGgpIHtcbiAgICAgIGNvbnN0IGN1ckhpdE5laWdoYm9yID0gcHJldmlvdXNseUhpdE5laWdoYm9yc1tpbmRleENvdW50ZXJdO1xuXG4gICAgICBjb25zdCBjaGFuZ2VZRnJvbVJlZmVyZW5jZSA9XG4gICAgICAgIHRoaXMuI2NvbXB1dGVyc1ByZXZBdHRhY2tDb29yZFswXSAtIGN1ckhpdE5laWdoYm9yWzBdO1xuICAgICAgY29uc3QgY2hhbmdlWEZyb21SZWZlcmVuY2UgPVxuICAgICAgICB0aGlzLiNjb21wdXRlcnNQcmV2QXR0YWNrQ29vcmRbMV0gLSBjdXJIaXROZWlnaGJvclsxXTtcbiAgICAgIGNvbnN0IG9wcG9zaXRlTmVpZ2hib3IgPVxuICAgICAgICBjaGFuZ2VZRnJvbVJlZmVyZW5jZSA9PT0gMFxuICAgICAgICAgID8gW1xuICAgICAgICAgICAgICB0aGlzLiNjb21wdXRlcnNQcmV2QXR0YWNrQ29vcmRbMF0sXG4gICAgICAgICAgICAgIHRoaXMuI2NvbXB1dGVyc1ByZXZBdHRhY2tDb29yZFsxXSArIGNoYW5nZVhGcm9tUmVmZXJlbmNlLFxuICAgICAgICAgICAgXVxuICAgICAgICAgIDogW1xuICAgICAgICAgICAgICB0aGlzLiNjb21wdXRlcnNQcmV2QXR0YWNrQ29vcmRbMF0gKyBjaGFuZ2VZRnJvbVJlZmVyZW5jZSxcbiAgICAgICAgICAgICAgdGhpcy4jY29tcHV0ZXJzUHJldkF0dGFja0Nvb3JkWzFdLFxuICAgICAgICAgICAgXTtcblxuICAgICAgY29uc3Qgb3BwTmVpZ2hib3JDYW5CZUF0dGFja2VkID1cbiAgICAgICAgIXRoaXMuYm9hcmRbb3Bwb3NpdGVOZWlnaGJvclswXV1bb3Bwb3NpdGVOZWlnaGJvclsxXV0/LmF0dGFja1N0YXR1cztcbiAgICAgIGlmIChvcHBOZWlnaGJvckNhbkJlQXR0YWNrZWQpIHtcbiAgICAgICAgdGhpcy5yZWNlaXZlQXR0YWNrKG9wcG9zaXRlTmVpZ2hib3IpO1xuICAgICAgICB0aGlzLiNjb21wdXRlcnNQcmV2QXR0YWNrQ29vcmQgPSBvcHBvc2l0ZU5laWdoYm9yO1xuICAgICAgICByZXR1cm4gdGhpcy4jY29tcHV0ZXJzUHJldkF0dGFja0Nvb3JkO1xuICAgICAgfVxuICAgICAgaW5kZXhDb3VudGVyICs9IDE7XG4gICAgfVxuXG4gICAgLy8gZWxzZSBhdHRhY2sgcmFuZG9tIG9wZW4gbmVpZ2hib3IgY2VsbFxuICAgIGNvbnN0IHJhbmRvbU5laWdoYm9yQ29vcmQgPVxuICAgICAgb3Blbk5laWdoYm9yQ29vcmRzW01hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIG9wZW5OZWlnaGJvckNvb3Jkcy5sZW5ndGgpXTtcbiAgICB0aGlzLnJlY2VpdmVBdHRhY2socmFuZG9tTmVpZ2hib3JDb29yZCk7XG4gICAgdGhpcy4jY29tcHV0ZXJzUHJldkF0dGFja0Nvb3JkID0gcmFuZG9tTmVpZ2hib3JDb29yZDtcbiAgICByZXR1cm4gdGhpcy4jY29tcHV0ZXJzUHJldkF0dGFja0Nvb3JkO1xuICB9XG59XG4iLCJleHBvcnQgZGVmYXVsdCBjbGFzcyBQbGF5ZXIge1xuICBjb25zdHJ1Y3RvcihuYW1lKSB7XG4gICAgdGhpcy5uYW1lID0gbmFtZTtcbiAgfVxufVxuIiwiZXhwb3J0IGRlZmF1bHQgY2xhc3MgU2hpcCB7XG4gICNsZW5ndGg7XG5cbiAgI2hpdHM7XG5cbiAgI25hbWU7XG5cbiAgY29uc3RydWN0b3IobmFtZSkge1xuICAgIHRoaXMuI25hbWUgPSBuYW1lO1xuICAgIHRoaXMuI2hpdHMgPSAwO1xuICAgIHRoaXMuI3NldExlbmd0aCgpO1xuICAgIHRoaXMuZGlyZWN0aW9uID0gJ2hvcml6b250YWwnO1xuICB9XG5cbiAgI3NldExlbmd0aCgpIHtcbiAgICBpZiAodGhpcy4jbmFtZSA9PT0gJ2NhcnJpZXInKSB0aGlzLiNsZW5ndGggPSA1O1xuICAgIGVsc2UgaWYgKHRoaXMuI25hbWUgPT09ICdiYXR0bGVzaGlwJykgdGhpcy4jbGVuZ3RoID0gNDtcbiAgICBlbHNlIGlmICh0aGlzLiNuYW1lID09PSAnY3J1aXNlcicpIHRoaXMuI2xlbmd0aCA9IDM7XG4gICAgZWxzZSBpZiAodGhpcy4jbmFtZSA9PT0gJ3N1Ym1hcmluZScpIHRoaXMuI2xlbmd0aCA9IDM7XG4gICAgZWxzZSBpZiAodGhpcy4jbmFtZSA9PT0gJ2Rlc3Ryb3llcicpIHRoaXMuI2xlbmd0aCA9IDI7XG4gIH1cblxuICBnZXRMZW5ndGgoKSB7XG4gICAgcmV0dXJuIHRoaXMuI2xlbmd0aDtcbiAgfVxuXG4gIGdldEhpdHMoKSB7XG4gICAgcmV0dXJuIHRoaXMuI2hpdHM7XG4gIH1cblxuICBnZXROYW1lKCkge1xuICAgIHJldHVybiB0aGlzLiNuYW1lO1xuICB9XG5cbiAgaGl0KCkge1xuICAgIHRoaXMuI2hpdHMgKz0gMTtcbiAgfVxuXG4gIGlzU3VuaygpIHtcbiAgICBpZiAodGhpcy4jbGVuZ3RoID09PSB0aGlzLiNoaXRzKSByZXR1cm4gdHJ1ZTtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICBzZXREaXJlY3Rpb24oZGlyZWN0aW9uU3RyaW5nKSB7XG4gICAgdGhpcy5kaXJlY3Rpb24gPSBkaXJlY3Rpb25TdHJpbmc7XG4gIH1cbn1cbiIsImNvbnN0IHBsYWNlU2hpcHNTY3JlZW4gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcucGxhY2Utc2hpcHMtc2NyZWVuJyk7XG5cbmNvbnN0IGdhbWVTY3JlZW4gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuZ2FtZS1zY3JlZW4nKTtcblxuY29uc3Qgd2lubmVyU2NyZWVuID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLndpbm5lci1zY3JlZW4nKTtcblxuY29uc3QgbWVudVNjcmVlbiA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5tZW51LXNjcmVlbicpO1xuXG5leHBvcnQgeyBwbGFjZVNoaXBzU2NyZWVuLCBnYW1lU2NyZWVuLCB3aW5uZXJTY3JlZW4sIG1lbnVTY3JlZW4gfTtcbiIsImltcG9ydCBHYW1lYm9hcmQgZnJvbSAnLi4vY2xhc3Nlcy9HYW1lYm9hcmQnO1xuaW1wb3J0IFBsYXllciBmcm9tICcuLi9jbGFzc2VzL1BsYXllcic7XG5pbXBvcnQgU2hpcCBmcm9tICcuLi9jbGFzc2VzL1NoaXAnO1xuaW1wb3J0IHtcbiAgZ2FtZVNjcmVlbixcbiAgbWVudVNjcmVlbixcbiAgcGxhY2VTaGlwc1NjcmVlbixcbiAgd2lubmVyU2NyZWVuLFxufSBmcm9tICcuL0RPTXNjcmVlbnMnO1xuXG5jb25zdCBwbGF5ZXJzID0gW1xuICB7XG4gICAgcGxheWVyOiBuZXcgUGxheWVyKCdMZWFoJyksXG4gICAgZ2FtZWJvYXJkOiBuZXcgR2FtZWJvYXJkKCksXG4gIH0sXG4gIHtcbiAgICBwbGF5ZXI6IG5ldyBQbGF5ZXIoJ0NvbXB1dGVyJyksXG4gICAgZ2FtZWJvYXJkOiBuZXcgR2FtZWJvYXJkKCksXG4gIH0sXG5dO1xuXG5sZXQgZW5lbXkgPSBwbGF5ZXJzWzFdO1xuXG5jb25zdCBnZXRFbmVteSA9ICgpID0+IGVuZW15O1xuXG5jb25zdCBzd2l0Y2hFbmVteSA9ICgpID0+IHtcbiAgZW5lbXkgPSBlbmVteSA9PT0gcGxheWVyc1swXSA/IHBsYXllcnNbMV0gOiBwbGF5ZXJzWzBdO1xufTtcblxubGV0IGdhbWVEaWZmaWN1bHR5ID0gJ2Vhc3knO1xuXG5jb25zdCBzZXRHYW1lRGlmZmljdWx0eSA9IChzdHJpbmcpID0+IHtcbiAgZ2FtZURpZmZpY3VsdHkgPSBzdHJpbmc7XG59O1xuXG5jb25zdCBwbGF5UGxheWVyQXR0YWNrID0gKGNvb3JkKSA9PiBwbGF5ZXJzWzFdLmdhbWVib2FyZC5yZWNlaXZlQXR0YWNrKGNvb3JkKTtcblxubGV0IGNvbXB1dGVyc0F0dGFja0Nvb3JkID0gW251bGwsIG51bGxdO1xuY29uc3QgcGxheUNvbXB1dGVyQXR0YWNrID0gKCkgPT4ge1xuICBpZiAoZ2FtZURpZmZpY3VsdHkgPT09ICdlYXN5JylcbiAgICBjb21wdXRlcnNBdHRhY2tDb29yZCA9IHBsYXllcnNbMF0uZ2FtZWJvYXJkLmdldENvbXB1dGVyQXR0YWNrUmFuZG9tKCk7XG4gIGVsc2UgY29tcHV0ZXJzQXR0YWNrQ29vcmQgPSBwbGF5ZXJzWzBdLmdhbWVib2FyZC5nZXRDb21wdXRlckF0dGFja01lZGl1bSgpO1xufTtcblxuY29uc3QgZ2V0R2FtZUFubm91bmNlbWVudCA9IGZ1bmN0aW9uIGdldFN0cmluZ0ZvckdhbWVBbm5vdW5jZW1lbnQoXG4gIGF0dGFja2VkQ29vcmQgPSBjb21wdXRlcnNBdHRhY2tDb29yZCxcbikge1xuICAvLyBmaW5kIGF0dGFja2VkIHNxdWFyZSB3aXRoIGl0J3MgZGF0YSBvYmplY3RcbiAgY29uc3QgW3ksIHhdID0gYXR0YWNrZWRDb29yZDtcbiAgY29uc3QgYXR0YWNrZWRTcXVhcmUgPSBnZXRFbmVteSgpLmdhbWVib2FyZC5ib2FyZFt5XVt4XTtcblxuICAvLyBnZXQgbm91bnMgZm9yIHN0cmluZyBpbnRlcnBvbGF0aW9uXG4gIGNvbnN0IGF0dGFja2VyID0gYXJndW1lbnRzLmxlbmd0aCA9PT0gMCA/ICdDb21wdXRlcicgOiAnWW91JztcbiAgY29uc3QgcmVjZWl2ZXIgPSBhdHRhY2tlciA9PT0gJ0NvbXB1dGVyJyA/ICd5b3VyJyA6IFwiQ29tcHV0ZXInc1wiO1xuXG4gIC8vIGlmIGF0dGFjayBzdW5rIGVuZW15J3MgbGFzdCBzaGlwXG4gIGNvbnN0IGhhc1NoaXAgPVxuICAgIGF0dGFja2VkU3F1YXJlID09PSBudWxsID8gZmFsc2UgOiBPYmplY3QuaGFzT3duKGF0dGFja2VkU3F1YXJlLCAnc2hpcCcpO1xuICBpZiAoaGFzU2hpcCAmJiBnZXRFbmVteSgpLmdhbWVib2FyZC5hbGxTaGlwc0Rvd24oKSkge1xuICAgIHJldHVybiBgJHthdHRhY2tlcn0gd2luJHthdHRhY2tlciA9PT0gJ0NvbXB1dGVyJyA/IFwiJ3NcIiA6ICcnfSFgO1xuICB9XG5cbiAgLy8gaWYgYXR0YWNrIHN1bmsgZW5lbXkncyBzaGlwXG4gIGlmIChoYXNTaGlwKSB7XG4gICAgY29uc3QgeyBzaGlwIH0gPSBhdHRhY2tlZFNxdWFyZTtcbiAgICBjb25zdCBzaGlwTmFtZSA9IHNoaXAuZ2V0TmFtZSgpO1xuICAgIGlmIChzaGlwLmlzU3VuaygpKSByZXR1cm4gYCR7YXR0YWNrZXJ9IHN1bmsgJHtyZWNlaXZlcn0gJHtzaGlwTmFtZX1gO1xuICB9XG5cbiAgcmV0dXJuICcnO1xufTtcblxuY29uc3QgZ2V0UmFuZG9tQ29vcmQgPSAoKSA9PlxuICBbbnVsbCwgbnVsbF0ubWFwKChfKSA9PiBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiAxMCkpO1xuXG5jb25zdCBhZGRSYW5kb21TaGlwUGxhY2VtZW50ID0gKGdhbWVib2FyZCkgPT4ge1xuICBjb25zdCBzaGlwTmFtZXMgPSBbXG4gICAgJ2NhcnJpZXInLFxuICAgICdiYXR0bGVzaGlwJyxcbiAgICAnY3J1aXNlcicsXG4gICAgJ3N1Ym1hcmluZScsXG4gICAgJ2Rlc3Ryb3llcicsXG4gIF07XG4gIGNvbnN0IHNoaXBEaXJlY3Rpb25PcHRpb25zID0gWydob3Jpem9udGFsJywgJ3ZlcnRpY2FsJ107XG4gIHdoaWxlIChzaGlwTmFtZXMubGVuZ3RoID4gMCkge1xuICAgIGNvbnN0IHJhbmRvbUNvb3JkID0gZ2V0UmFuZG9tQ29vcmQoKTtcbiAgICBjb25zdCBzaGlwID0gbmV3IFNoaXAoc2hpcE5hbWVzLmF0KC0xKSk7XG4gICAgc2hpcC5zZXREaXJlY3Rpb24oc2hpcERpcmVjdGlvbk9wdGlvbnNbTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogMildKTtcbiAgICBjb25zdCBpc1ZhbGlkU2hpcFBsYWNlbWVudCA9IGdhbWVib2FyZC5wbGFjZVNoaXAocmFuZG9tQ29vcmQsIHNoaXApO1xuICAgIGlmIChpc1ZhbGlkU2hpcFBsYWNlbWVudCkgc2hpcE5hbWVzLnBvcCgpO1xuICB9XG59O1xuXG5jb25zdCBkZWxheSA9IChtc2VjKSA9PiBuZXcgUHJvbWlzZSgocmVzKSA9PiBzZXRUaW1lb3V0KHJlcywgbXNlYykpO1xuXG5jb25zdCBhbm5vdW5jZW1lbnREaXYgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuYW5ub3VuY2VtZW50Jyk7XG5jb25zdCBzaG93U2VsZWN0U2NyZWVuID0gKHN0cmluZykgPT4ge1xuICBpZiAoc3RyaW5nID09PSAnZ2FtZScpIHtcbiAgICBwbGFjZVNoaXBzU2NyZWVuLmNsYXNzTGlzdC5hZGQoJ2hpZGRlbicpO1xuICAgIGdhbWVTY3JlZW4uY2xhc3NMaXN0LnJlbW92ZSgnaGlkZGVuJyk7XG4gIH0gZWxzZSBpZiAoc3RyaW5nID09PSAnd2lubmVyJykge1xuICAgIGdhbWVTY3JlZW4uY2xhc3NMaXN0LmFkZCgnaGlkZGVuJyk7XG4gICAgd2lubmVyU2NyZWVuLmNsYXNzTGlzdC5yZW1vdmUoJ2hpZGRlbicpO1xuICB9IGVsc2UgaWYgKHN0cmluZyA9PT0gJ21lbnUnKSB7XG4gICAgYW5ub3VuY2VtZW50RGl2LmNsYXNzTGlzdC5hZGQoJ2hpZGRlbicpO1xuICAgIHdpbm5lclNjcmVlbi5jbGFzc0xpc3QuYWRkKCdoaWRkZW4nKTtcbiAgICBtZW51U2NyZWVuLmNsYXNzTGlzdC5yZW1vdmUoJ2hpZGRlbicpO1xuICB9IGVsc2UgaWYgKHN0cmluZyA9PT0gJ3BsYWNlIHNoaXBzJykge1xuICAgIG1lbnVTY3JlZW4uY2xhc3NMaXN0LmFkZCgnaGlkZGVuJyk7XG4gICAgYW5ub3VuY2VtZW50RGl2LmNsYXNzTGlzdC5yZW1vdmUoJ2hpZGRlbicpO1xuICAgIHBsYWNlU2hpcHNTY3JlZW4uY2xhc3NMaXN0LnJlbW92ZSgnaGlkZGVuJyk7XG4gIH1cbn07XG5cbmNvbnN0IHVwZGF0ZUFubm91bmNlbWVudCA9IChzdHJpbmcpID0+IHtcbiAgYW5ub3VuY2VtZW50RGl2LnRleHRDb250ZW50ID0gc3RyaW5nO1xufTtcblxuZXhwb3J0IHtcbiAgcGxheWVycyxcbiAgZ2V0RW5lbXksXG4gIHBsYXlQbGF5ZXJBdHRhY2ssXG4gIHBsYXlDb21wdXRlckF0dGFjayxcbiAgZ2V0R2FtZUFubm91bmNlbWVudCxcbiAgc3dpdGNoRW5lbXksXG4gIGFkZFJhbmRvbVNoaXBQbGFjZW1lbnQsXG4gIGRlbGF5LFxuICBzaG93U2VsZWN0U2NyZWVuLFxuICB1cGRhdGVBbm5vdW5jZW1lbnQsXG4gIHNldEdhbWVEaWZmaWN1bHR5LFxufTtcbiIsImltcG9ydCB7XG4gIGFkZFJhbmRvbVNoaXBQbGFjZW1lbnQsXG4gIGdldEdhbWVBbm5vdW5jZW1lbnQsXG4gIHBsYXlDb21wdXRlckF0dGFjayxcbiAgcGxheWVycyxcbiAgcGxheVBsYXllckF0dGFjayxcbiAgc3dpdGNoRW5lbXksXG4gIGRlbGF5LFxuICB1cGRhdGVBbm5vdW5jZW1lbnQsXG4gIHNob3dTZWxlY3RTY3JlZW4sXG59IGZyb20gJy4vR2FtZUNvbnRyb2xsZXInO1xuXG5jb25zdCBzaGlwc0JvYXJkRGl2ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLnNoaXBzLmJvYXJkJyk7XG5jb25zdCBhdHRhY2tzQm9hcmREaXYgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuYXR0YWNrcy5ib2FyZCcpO1xuXG5jb25zdCB1cGRhdGVTaGlwc0JvYXJkID0gKCkgPT4ge1xuICAvLyBjbGVhciBib2FyZFxuICBzaGlwc0JvYXJkRGl2LnRleHRDb250ZW50ID0gJyc7XG5cbiAgLy8gbG9hZCBlYWNoIHNxdWFyZVxuICBjb25zdCBwbGF5ZXJCb2FyZCA9IHBsYXllcnNbMF0uZ2FtZWJvYXJkLmJvYXJkO1xuICBwbGF5ZXJCb2FyZC5mb3JFYWNoKChyb3csIHJvd0luZGV4KSA9PiB7XG4gICAgcm93LmZvckVhY2goKF8sIGNvbHVtbkluZGV4KSA9PiB7XG4gICAgICBjb25zdCBzcXVhcmUgPSBwbGF5ZXJCb2FyZFtyb3dJbmRleF1bY29sdW1uSW5kZXhdO1xuICAgICAgY29uc3QgYnV0dG9uID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYnV0dG9uJyk7XG5cbiAgICAgIC8vIHJlbmRlciBwbGF5ZXIncyBzaGlwc1xuICAgICAgY29uc3QgaGFzU2hpcCA9IHNxdWFyZSA9PT0gbnVsbCA/IGZhbHNlIDogT2JqZWN0Lmhhc093bihzcXVhcmUsICdzaGlwJyk7XG4gICAgICBpZiAoaGFzU2hpcCkge1xuICAgICAgICBidXR0b24uY2xhc3NMaXN0LmFkZCgnc2hpcCcpO1xuICAgICAgfVxuXG4gICAgICAvLyByZW5kZXIgYXR0YWNrcyBvbiBwbGF5ZXIncyBzaGlwc1xuICAgICAgY29uc3QgaGFzQXR0YWNrU3RhdHVzID1cbiAgICAgICAgc3F1YXJlID09PSBudWxsID8gZmFsc2UgOiBPYmplY3QuaGFzT3duKHNxdWFyZSwgJ2F0dGFja1N0YXR1cycpO1xuICAgICAgaWYgKGhhc0F0dGFja1N0YXR1cykge1xuICAgICAgICBjb25zdCB7IGF0dGFja1N0YXR1cyB9ID0gc3F1YXJlO1xuICAgICAgICBidXR0b24uY2xhc3NMaXN0LmFkZChhdHRhY2tTdGF0dXMpO1xuICAgICAgfVxuXG4gICAgICBzaGlwc0JvYXJkRGl2LmFwcGVuZENoaWxkKGJ1dHRvbik7XG4gICAgfSk7XG4gIH0pO1xufTtcblxuY29uc3QgdXBkYXRlQXR0YWNrc0JvYXJkID0gKCkgPT4ge1xuICAvLyBjbGVhciBib2FyZFxuICBhdHRhY2tzQm9hcmREaXYudGV4dENvbnRlbnQgPSAnJztcblxuICAvLyBsb2FkIGVhY2ggc3F1YXJlXG4gIGNvbnN0IGNvbXB1dGVyQm9hcmQgPSBwbGF5ZXJzWzFdLmdhbWVib2FyZC5ib2FyZDtcbiAgY29tcHV0ZXJCb2FyZC5mb3JFYWNoKChyb3csIHJvd0luZGV4KSA9PiB7XG4gICAgcm93LmZvckVhY2goKF8sIGNvbHVtbkluZGV4KSA9PiB7XG4gICAgICBjb25zdCBzcXVhcmUgPSBjb21wdXRlckJvYXJkW3Jvd0luZGV4XVtjb2x1bW5JbmRleF07XG4gICAgICBjb25zdCBidXR0b24gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdidXR0b24nKTtcblxuICAgICAgLy8gcmV2ZWFsIGVuZW15J3Mgc3Vua2VuIHNoaXBzXG4gICAgICBjb25zdCBoYXNTaGlwID0gc3F1YXJlID09PSBudWxsID8gZmFsc2UgOiBPYmplY3QuaGFzT3duKHNxdWFyZSwgJ3NoaXAnKTtcbiAgICAgIGlmIChoYXNTaGlwICYmIHNxdWFyZS5zaGlwLmlzU3VuaygpKSB7XG4gICAgICAgIGJ1dHRvbi5jbGFzc0xpc3QuYWRkKCdzaGlwJyk7XG4gICAgICB9XG5cbiAgICAgIC8vIHJlbmRlciBhdHRhY2tzIHRvIGNvbXB1dGVyJ3Mgc2hpcHNcbiAgICAgIGNvbnN0IGhhc0F0dGFja1N0YXR1cyA9XG4gICAgICAgIHNxdWFyZSA9PT0gbnVsbCA/IGZhbHNlIDogT2JqZWN0Lmhhc093bihzcXVhcmUsICdhdHRhY2tTdGF0dXMnKTtcbiAgICAgIGlmIChoYXNBdHRhY2tTdGF0dXMpIHtcbiAgICAgICAgY29uc3QgeyBhdHRhY2tTdGF0dXMgfSA9IHNxdWFyZTtcbiAgICAgICAgYnV0dG9uLmNsYXNzTGlzdC5hZGQoYXR0YWNrU3RhdHVzKTtcbiAgICAgICAgYnV0dG9uLmNsYXNzTGlzdC5hZGQoJ2Rpc2FibGUnKTtcbiAgICAgICAgYnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKGUpID0+IGUuc3RvcFByb3BhZ2F0aW9uKCkpO1xuICAgICAgfVxuXG4gICAgICAvLyBhZGQgZGF0YSBhdHRyaWJ1dGVzIGZvciBjb29yZGluYXRlc1xuICAgICAgYnV0dG9uLmRhdGFzZXQueSA9IHJvd0luZGV4O1xuICAgICAgYnV0dG9uLmRhdGFzZXQueCA9IGNvbHVtbkluZGV4O1xuXG4gICAgICBhdHRhY2tzQm9hcmREaXYuYXBwZW5kQ2hpbGQoYnV0dG9uKTtcbiAgICB9KTtcbiAgfSk7XG59O1xuXG5jb25zdCBkaXNhYmxlQXR0YWNrc0JvYXJkID0gKCkgPT4ge1xuICBhdHRhY2tzQm9hcmREaXYuY2xhc3NMaXN0LmFkZCgnZGlzYWJsZS1wb2ludGVyJyk7XG59O1xuXG5jb25zdCBlbmFibGVBdHRhY2tzQm9hcmQgPSAoKSA9PiB7XG4gIGF0dGFja3NCb2FyZERpdi5jbGFzc0xpc3QucmVtb3ZlKCdkaXNhYmxlLXBvaW50ZXInKTtcbn07XG5cbmNvbnN0IGhhbmRsZUF0dGFja3NCb2FyZENsaWNrID0gYXN5bmMgKHRhcmdldFNxdWFyZSkgPT4ge1xuICBkaXNhYmxlQXR0YWNrc0JvYXJkKCk7XG5cbiAgLy8gcnVuIHBsYXllcidzIGF0dGFja1xuICBjb25zdCB7IHksIHggfSA9IHRhcmdldFNxdWFyZS5kYXRhc2V0O1xuICBwbGF5UGxheWVyQXR0YWNrKFt5LCB4XSk7XG4gIHVwZGF0ZUF0dGFja3NCb2FyZCgpO1xuXG4gIC8vIGFubm91bmNlIGlmIHBsYXllciBzdW5rIGNvbXB1dGVyJ3Mgc2hpcCBvciB3aW5zXG4gIGNvbnN0IGZpcnN0QW5ub3VuY2VtZW50ID0gZ2V0R2FtZUFubm91bmNlbWVudChbeSwgeF0pO1xuICBpZiAoZmlyc3RBbm5vdW5jZW1lbnQpIHtcbiAgICB1cGRhdGVBbm5vdW5jZW1lbnQoZmlyc3RBbm5vdW5jZW1lbnQpO1xuICAgIGlmIChmaXJzdEFubm91bmNlbWVudC5pbmNsdWRlcygnd2luJykpIHtcbiAgICAgIHVwZGF0ZUFubm91bmNlbWVudChmaXJzdEFubm91bmNlbWVudCk7XG4gICAgICBzaG93U2VsZWN0U2NyZWVuKCd3aW5uZXInKTtcbiAgICB9XG4gICAgYXdhaXQgZGVsYXkoMTAwMCk7XG4gIH1cbiAgc3dpdGNoRW5lbXkoKTtcblxuICAvLyBlbmQgZ2FtZSBpZiBwbGF5ZXIgaXMgd2lubmVyXG4gIGlmIChwbGF5ZXJzWzFdLmdhbWVib2FyZC5hbGxTaGlwc0Rvd24oKSkgcmV0dXJuO1xuXG4gIC8vIGFubm91bmNlIHdhaXRpbmcgZm9yIGNvbXB1dGVyJ3MgYXR0YWNrXG4gIHVwZGF0ZUFubm91bmNlbWVudCgnV2FpdGluZyBmb3IgQ29tcHV0ZXIuLi4nKTtcbiAgYXdhaXQgZGVsYXkoMTAwMCk7XG5cbiAgLy8gcnVuIGNvbXB1dGVyJ3MgYXR0YWNrXG4gIHBsYXlDb21wdXRlckF0dGFjaygpO1xuICB1cGRhdGVTaGlwc0JvYXJkKCk7XG5cbiAgLy8gYW5ub3VuY2UgaWYgY29tcHV0ZXIgc3VuayBwbGF5ZXIncyBzaGlwIG9yIHdpbnNcbiAgY29uc3Qgc2Vjb25kQW5ub3VuY2VtZW50ID0gZ2V0R2FtZUFubm91bmNlbWVudCgpO1xuICBpZiAoc2Vjb25kQW5ub3VuY2VtZW50KSB7XG4gICAgdXBkYXRlQW5ub3VuY2VtZW50KHNlY29uZEFubm91bmNlbWVudCk7XG4gICAgaWYgKHNlY29uZEFubm91bmNlbWVudC5pbmNsdWRlcygnd2luJykpIHtcbiAgICAgIHVwZGF0ZUFubm91bmNlbWVudChzZWNvbmRBbm5vdW5jZW1lbnQpO1xuICAgICAgc2hvd1NlbGVjdFNjcmVlbignd2lubmVyJyk7XG4gICAgfVxuICAgIGF3YWl0IGRlbGF5KDEwMDApO1xuICB9XG4gIHN3aXRjaEVuZW15KCk7XG5cbiAgLy8gZW5kIGdhbWUgaWYgY29tcHV0ZXIgaXMgd2lubmVyXG4gIGlmIChwbGF5ZXJzWzBdLmdhbWVib2FyZC5hbGxTaGlwc0Rvd24oKSkgcmV0dXJuO1xuXG4gIC8vIGFubm91bmNlIHBsYXllcidzIHR1cm4gdG8gYXR0YWNrXG4gIHVwZGF0ZUFubm91bmNlbWVudCgnU2VuZCB5b3VyIGF0dGFjaycpO1xuXG4gIGVuYWJsZUF0dGFja3NCb2FyZCgpO1xufTtcbmF0dGFja3NCb2FyZERpdi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIChlKSA9PiB7XG4gIGhhbmRsZUF0dGFja3NCb2FyZENsaWNrKGUudGFyZ2V0KTtcbn0pO1xuXG5jb25zdCBpbml0aWFsaXplR2FtZVNjcmVlbkJvYXJkcyA9ICgpID0+IHtcbiAgLy8gcmFuZG9tbHkgcGxhY2UgYWxsIHNoaXBzIHRvIGNvbXB1dGVyJ3MgYm9hcmRcbiAgYWRkUmFuZG9tU2hpcFBsYWNlbWVudChwbGF5ZXJzWzFdLmdhbWVib2FyZCk7XG5cbiAgdXBkYXRlU2hpcHNCb2FyZCgpO1xuICB1cGRhdGVBdHRhY2tzQm9hcmQoKTtcbiAgdXBkYXRlQW5ub3VuY2VtZW50KCdTZW5kIHlvdXIgYXR0YWNrJyk7XG59O1xuXG5leHBvcnQgeyBpbml0aWFsaXplR2FtZVNjcmVlbkJvYXJkcyB9O1xuIiwiaW1wb3J0IHsgbWVudVNjcmVlbiB9IGZyb20gJy4vRE9Nc2NyZWVucyc7XG5pbXBvcnQge1xuICBwbGF5ZXJzLFxuICBzZXRHYW1lRGlmZmljdWx0eSxcbiAgc2hvd1NlbGVjdFNjcmVlbixcbiAgdXBkYXRlQW5ub3VuY2VtZW50LFxufSBmcm9tICcuL0dhbWVDb250cm9sbGVyJztcblxuY29uc3QgbmFtZUlucHV0ID0gbWVudVNjcmVlbi5xdWVyeVNlbGVjdG9yKCcjbmFtZScpO1xuY29uc3QgZGlmZmljdWx0eUlucHV0ID0gbWVudVNjcmVlbi5xdWVyeVNlbGVjdG9yKCcjZGlmZmljdWx0eScpO1xuY29uc3Qgc3RhcnRCdXR0b24gPSBtZW51U2NyZWVuLnF1ZXJ5U2VsZWN0b3IoJy5zdGFydCcpO1xuXG5jb25zdCBoYW5kbGVTdGFydEJ1dHRvbkNsaWNrID0gKGUpID0+IHtcbiAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuXG4gIC8vIHNldCBnYW1lIGRhdGFcbiAgY29uc3QgbmFtZSA9IG5hbWVJbnB1dC52YWx1ZTtcbiAgcGxheWVyc1swXS5wbGF5ZXIubmFtZSA9IG5hbWU7XG4gIHNldEdhbWVEaWZmaWN1bHR5KGRpZmZpY3VsdHlJbnB1dC52YWx1ZSk7XG5cbiAgLy8gY2hhbmdlIHNjcmVlblxuICBzaG93U2VsZWN0U2NyZWVuKCdwbGFjZSBzaGlwcycpO1xuICB1cGRhdGVBbm5vdW5jZW1lbnQoXG4gICAgYCR7bmFtZS5jaGFyQXQoMCkudG9VcHBlckNhc2UoKSArIG5hbWUuc2xpY2UoMSl9LCBwbGFjZSB5b3VyIHNoaXBzYCxcbiAgKTtcbn07XG5zdGFydEJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIChlKSA9PiBoYW5kbGVTdGFydEJ1dHRvbkNsaWNrKGUpKTtcbiIsImltcG9ydCBTaGlwIGZyb20gJy4uL2NsYXNzZXMvU2hpcCc7XG5pbXBvcnQgeyBwbGFjZVNoaXBzU2NyZWVuIH0gZnJvbSAnLi9ET01zY3JlZW5zJztcbmltcG9ydCB7IGluaXRpYWxpemVHYW1lU2NyZWVuQm9hcmRzIH0gZnJvbSAnLi9HYW1lU2NyZWVuJztcbmltcG9ydCB7XG4gIHBsYXllcnMsXG4gIHNob3dTZWxlY3RTY3JlZW4sXG4gIHVwZGF0ZUFubm91bmNlbWVudCxcbn0gZnJvbSAnLi9HYW1lQ29udHJvbGxlcic7XG5cbmNvbnN0IHRvZ2dsZURpcmVjdGlvbkJ1dHRvbiA9XG4gIHBsYWNlU2hpcHNTY3JlZW4ucXVlcnlTZWxlY3RvcignLnRvZ2dsZS1kaXJlY3Rpb24nKTtcbmNvbnN0IGRyYWdnYWJsZVNoaXBzQ29udGFpbmVyID0gcGxhY2VTaGlwc1NjcmVlbi5xdWVyeVNlbGVjdG9yKFxuICAnLmRyYWdnYWJsZS1zaGlwcy1jb250YWluZXInLFxuKTtcbmNvbnN0IG9yaWdpbmFsRHJhZ2dhYmxlU2hpcHMgPVxuICBwbGFjZVNoaXBzU2NyZWVuLnF1ZXJ5U2VsZWN0b3JBbGwoJ1tkcmFnZ2FibGU9XCJ0cnVlXCJdJyk7XG5jb25zdCBib2FyZEJvcmRlckRpdiA9IHBsYWNlU2hpcHNTY3JlZW4ucXVlcnlTZWxlY3RvcignLmJvYXJkLWJvcmRlcicpO1xuY29uc3QgcGxhY2VTaGlwc0JvYXJkRGl2ID0gcGxhY2VTaGlwc1NjcmVlbi5xdWVyeVNlbGVjdG9yKCcucGxhY2Utc2hpcHMuYm9hcmQnKTtcblxuY29uc3QgcGxhY2VTaGlwQm9hcmRJbnN0YW5jZSA9IHBsYXllcnNbMF0uZ2FtZWJvYXJkO1xuXG5jb25zdCB1cGRhdGVCb2FyZCA9ICgpID0+IHtcbiAgcGxhY2VTaGlwc0JvYXJkRGl2LnRleHRDb250ZW50ID0gJyc7XG5cbiAgLy8gbG9hZCBlYWNoIGNlbGxcbiAgY29uc3QgeyBib2FyZCB9ID0gcGxhY2VTaGlwQm9hcmRJbnN0YW5jZTtcbiAgYm9hcmQuZm9yRWFjaCgocm93LCByb3dJbmRleCkgPT4ge1xuICAgIHJvdy5mb3JFYWNoKChfLCBjb2x1bW5JbmRleCkgPT4ge1xuICAgICAgY29uc3QgY2VsbCA9IGJvYXJkW3Jvd0luZGV4XVtjb2x1bW5JbmRleF07XG4gICAgICBjb25zdCBidXR0b24gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdidXR0b24nKTtcblxuICAgICAgLy8gcmVuZGVyIHByZXZpb3VzbHktcGxhY2VkIHNoaXBzIGFzIGRyYWdnYWJsZSBlbGVtZW50XG4gICAgICBjb25zdCBoYXNTaGlwID0gISFjZWxsO1xuICAgICAgaWYgKGhhc1NoaXApIHtcbiAgICAgICAgY29uc3QgeyBzaGlwIH0gPSBjZWxsO1xuICAgICAgICBidXR0b24uaWQgPSBzaGlwLmdldE5hbWUoKTtcbiAgICAgICAgYnV0dG9uLmNsYXNzTGlzdC5hZGQoJ3NoaXAnKTtcbiAgICAgIH1cblxuICAgICAgLy8gYWRkIGRhdGEtY29vcmRpbmF0ZSBhdHRyaWJ1dGVcbiAgICAgIGJ1dHRvbi5kYXRhc2V0LnkgPSByb3dJbmRleDtcbiAgICAgIGJ1dHRvbi5kYXRhc2V0LnggPSBjb2x1bW5JbmRleDtcblxuICAgICAgcGxhY2VTaGlwc0JvYXJkRGl2LmFwcGVuZENoaWxkKGJ1dHRvbik7XG4gICAgfSk7XG4gIH0pO1xufTtcblxuY29uc3QgcmVtb3ZlQWxsU2hpcEhvdmVyID0gKCkgPT4ge1xuICBjb25zdCBjZWxscyA9IHBsYWNlU2hpcHNCb2FyZERpdi5xdWVyeVNlbGVjdG9yQWxsKCdidXR0b24nKTtcbiAgY2VsbHMuZm9yRWFjaCgoY2VsbCkgPT4gY2VsbC5jbGFzc0xpc3QucmVtb3ZlKCdzaGlwLWhvdmVyJywgJ2ludmFsaWQnKSk7XG59O1xuXG5sZXQgY3VyU2hpcERpcmVjdGlvbiA9ICdob3Jpem9udGFsJztcbmNvbnN0IGhhbmRsZVRvZ2dsZURpcmVjdGlvbkNsaWNrID0gKCkgPT4ge1xuICAvLyB2aXN1YWxseSByb3RhdGUgc2hpcHNcbiAgb3JpZ2luYWxEcmFnZ2FibGVTaGlwcy5mb3JFYWNoKChub2RlKSA9PiB7XG4gICAgY29uc3QgeyB3aWR0aCwgaGVpZ2h0IH0gPSBub2RlLnN0eWxlO1xuICAgIG5vZGUuc2V0QXR0cmlidXRlKCdzdHlsZScsIGB3aWR0aDogJHtoZWlnaHR9OyBoZWlnaHQ6ICR7d2lkdGh9O2ApO1xuICB9KTtcblxuICAvLyB1cGRhdGUgZGlyZWN0aW9uIHZhcmlhYmxlXG4gIGN1clNoaXBEaXJlY3Rpb24gPVxuICAgIGN1clNoaXBEaXJlY3Rpb24gPT09ICdob3Jpem9udGFsJyA/ICd2ZXJ0aWNhbCcgOiAnaG9yaXpvbnRhbCc7XG59O1xuXG5sZXQgY3VyRHJhZ2dlZFNoaXBMZW5ndGg7XG5jb25zdCBoYW5kbGVEcmFnU3RhcnQgPSAoZSkgPT4ge1xuICBjdXJEcmFnZ2VkU2hpcExlbmd0aCA9ICtlLnRhcmdldC5kYXRhc2V0Lmxlbmd0aDtcblxuICAvLyBzdG9yZSBkYXRhIGluIGRhdGFUcmFuc2Zlcjogc2hpcCBuYW1lIGFuZCBkaXJlY3Rpb24gYXR0cmlidXRlXG4gIGNvbnN0IG9iaiA9IHtcbiAgICBzaGlwTmFtZTogZS50YXJnZXQuaWQsXG4gIH07XG4gIGUuZGF0YVRyYW5zZmVyLnNldERhdGEoJ3RleHQvcGxhaW4nLCBKU09OLnN0cmluZ2lmeShvYmopKTtcblxuICAvLyBwb3NpdGlvbiBjdXJzb3IgZ3JhYmJpbmcgc2hpcFxuICBlLmRhdGFUcmFuc2Zlci5zZXREcmFnSW1hZ2UoZS50YXJnZXQsIDEwLCAxMCk7XG5cbiAgLy8gbWFrZSBzaGlwIHRyYW5zcGFyZW50IHdoZW4gYWN0aXZlbHkgZHJhZ2dnaW5nXG4gIGUudGFyZ2V0LmNsYXNzTGlzdC5hZGQoJ3RyYW5zcGFyZW50Jyk7XG59O1xuXG5jb25zdCBnZXRIb3Zlck5vZGVzID0gKGUpID0+IHtcbiAgLy8gZmluZCBhbGwgY2VsbCBub2RlcyBkaXJlY3RseSB1bmRlciBzaGlwXG4gIGNvbnN0IGFsbENlbGxzID0gcGxhY2VTaGlwc0JvYXJkRGl2LnF1ZXJ5U2VsZWN0b3JBbGwoJ2J1dHRvbicpO1xuICBjb25zdCBjZWxsTm9kZXMgPSBbZS50YXJnZXRdO1xuICBpZiAoY3VyU2hpcERpcmVjdGlvbiA9PT0gJ2hvcml6b250YWwnKSB7XG4gICAgY29uc3QgZmlyc3RDZWxsWCA9ICtlLnRhcmdldC5kYXRhc2V0Lng7XG4gICAgY29uc3QgY29uc3RhbnRZID0gK2UudGFyZ2V0LmRhdGFzZXQueTtcbiAgICBjb25zdCBsYXN0Q2VsbFggPSBmaXJzdENlbGxYICsgKGN1ckRyYWdnZWRTaGlwTGVuZ3RoIC0gMSk7XG4gICAgYWxsQ2VsbHMuZm9yRWFjaCgoY2VsbCkgPT4ge1xuICAgICAgY29uc3QgeSA9ICtjZWxsLmRhdGFzZXQueTtcbiAgICAgIGNvbnN0IHggPSArY2VsbC5kYXRhc2V0Lng7XG4gICAgICBpZiAoeCA+IGZpcnN0Q2VsbFggJiYgeCA8PSBsYXN0Q2VsbFggJiYgeSA9PT0gY29uc3RhbnRZKVxuICAgICAgICBjZWxsTm9kZXMucHVzaChjZWxsKTtcbiAgICB9KTtcbiAgfSBlbHNlIHtcbiAgICBjb25zdCBmaXJzdENlbGxZID0gK2UudGFyZ2V0LmRhdGFzZXQueTtcbiAgICBjb25zdCBjb25zdGFudFggPSArZS50YXJnZXQuZGF0YXNldC54O1xuICAgIGNvbnN0IGxhc3RDZWxsWSA9IGZpcnN0Q2VsbFkgKyAoY3VyRHJhZ2dlZFNoaXBMZW5ndGggLSAxKTtcbiAgICBhbGxDZWxscy5mb3JFYWNoKChjZWxsKSA9PiB7XG4gICAgICBjb25zdCB5ID0gK2NlbGwuZGF0YXNldC55O1xuICAgICAgY29uc3QgeCA9ICtjZWxsLmRhdGFzZXQueDtcbiAgICAgIGlmICh5ID4gZmlyc3RDZWxsWSAmJiB5IDw9IGxhc3RDZWxsWSAmJiB4ID09PSBjb25zdGFudFgpXG4gICAgICAgIGNlbGxOb2Rlcy5wdXNoKGNlbGwpO1xuICAgIH0pO1xuICB9XG4gIHJldHVybiBjZWxsTm9kZXM7XG59O1xuXG5jb25zdCBoYW5kbGVEcmFnRW5kID0gKGUpID0+IHtcbiAgLy8gcmVtb3ZlIHRyYW5zcGFyZW50IGVmZmVjdCB3aGVuIHN0b3AgZHJhZ2dpbmcgc2hpcFxuICBlLnRhcmdldC5jbGFzc0xpc3QucmVtb3ZlKCd0cmFuc3BhcmVudCcpO1xuXG4gIHJlbW92ZUFsbFNoaXBIb3ZlcigpO1xufTtcblxuY29uc3QgaGFuZGxlRHJhZ092ZXIgPSAoZSkgPT4ge1xuICBlLnByZXZlbnREZWZhdWx0KCk7XG4gIC8vIHNob3cgbW92ZS1jdXJzb3Igd2hlbiBzaGlwIGhvdmVycyBvdmVyIHBvdGVudGlhbCBkcm9wIHRhcmdldFxuICBlLmRhdGFUcmFuc2Zlci5kcm9wRWZmZWN0ID0gJ21vdmUnO1xufTtcblxuY29uc3QgaGFuZGxlRHJvcCA9IGFzeW5jIChlKSA9PiB7XG4gIGNvbnN0IHsgc2hpcE5hbWUgfSA9IEpTT04ucGFyc2UoZS5kYXRhVHJhbnNmZXIuZ2V0RGF0YSgndGV4dCcpKTtcbiAgY29uc3QgeyB5LCB4IH0gPSBlLnRhcmdldC5kYXRhc2V0O1xuICBjb25zdCBzaGlwSW5zdGFuY2UgPSBuZXcgU2hpcChzaGlwTmFtZSk7XG5cbiAgc2hpcEluc3RhbmNlLnNldERpcmVjdGlvbihjdXJTaGlwRGlyZWN0aW9uKTtcblxuICBpZiAocGxhY2VTaGlwQm9hcmRJbnN0YW5jZS5pc1ZhbGlkUG9zaXRpb24oWyt5LCAreF0sIHNoaXBJbnN0YW5jZSkpIHtcbiAgICBwbGFjZVNoaXBCb2FyZEluc3RhbmNlLnBsYWNlU2hpcChbK3ksICt4XSwgc2hpcEluc3RhbmNlKTtcblxuICAgIC8vIGlmIG9yaWdpbmFsIGRyYWdnYWJsZSBzaGlwIGlzIGluIGRyYWdnYWJsZS1zaGlwcy1jb250YWluZXIsIHJlbW92ZSBpdFxuICAgIGNvbnN0IG9yaWdpbmFsU2hpcE5vZGUgPSBBcnJheS5mcm9tKG9yaWdpbmFsRHJhZ2dhYmxlU2hpcHMpLmZpbmQoXG4gICAgICAobm9kZSkgPT4gbm9kZS5pZCA9PT0gc2hpcE5hbWUsXG4gICAgKTtcbiAgICBpZiAob3JpZ2luYWxTaGlwTm9kZSkgZHJhZ2dhYmxlU2hpcHNDb250YWluZXIucmVtb3ZlQ2hpbGQob3JpZ2luYWxTaGlwTm9kZSk7XG4gIH1cblxuICAvLyByZW1vdmUgaG92ZXIgZWZmZWN0XG4gIGUudGFyZ2V0LmNsYXNzTGlzdC5yZW1vdmUoJ3NoaXAtaG92ZXInKTtcblxuICB1cGRhdGVCb2FyZCgpO1xuXG4gIC8vIGlmIHBsYWNlZCBsYXN0IHNoaXAsIG9wZW4gZ2FtZSBzY3JlZW5cbiAgaWYgKGRyYWdnYWJsZVNoaXBzQ29udGFpbmVyLmNoaWxkcmVuLmxlbmd0aCA9PT0gMCkge1xuICAgIGluaXRpYWxpemVHYW1lU2NyZWVuQm9hcmRzKCk7XG4gICAgc2hvd1NlbGVjdFNjcmVlbignZ2FtZScpO1xuICB9XG59O1xuXG5jb25zdCBoYW5kbGVEcmFnRW50ZXIgPSAoZSkgPT4ge1xuICByZW1vdmVBbGxTaGlwSG92ZXIoKTtcbiAgY29uc3QgY2VsbE5vZGVzID0gZ2V0SG92ZXJOb2RlcyhlKTtcbiAgY2VsbE5vZGVzLmZvckVhY2goKGNlbGwpID0+IGNlbGwuY2xhc3NMaXN0LmFkZCgnc2hpcC1ob3ZlcicpKTtcbiAgaWYgKGNlbGxOb2Rlcy5sZW5ndGggIT09IGN1ckRyYWdnZWRTaGlwTGVuZ3RoKVxuICAgIGNlbGxOb2Rlcy5mb3JFYWNoKChjZWxsKSA9PiBjZWxsLmNsYXNzTGlzdC5hZGQoJ2ludmFsaWQnKSk7XG59O1xuXG5jb25zdCBoYW5kbGVEcmFnRW50ZXJCb2FyZEJvcmRlciA9IChlKSA9PiB7XG4gIGlmIChlLnRhcmdldCA9PT0gYm9hcmRCb3JkZXJEaXYpIHJlbW92ZUFsbFNoaXBIb3ZlcigpO1xufTtcblxuY29uc3QgYWRkU2hpcHNEcmFnRXZlbnRIYW5kbGVycyA9ICgpID0+IHtcbiAgb3JpZ2luYWxEcmFnZ2FibGVTaGlwcy5mb3JFYWNoKChzaGlwKSA9PiB7XG4gICAgc2hpcC5hZGRFdmVudExpc3RlbmVyKCdkcmFnc3RhcnQnLCAoZSkgPT4gaGFuZGxlRHJhZ1N0YXJ0KGUpKTtcbiAgICBzaGlwLmFkZEV2ZW50TGlzdGVuZXIoJ2RyYWdlbmQnLCAoZSkgPT4gaGFuZGxlRHJhZ0VuZChlKSk7XG4gIH0pO1xuXG4gIHRvZ2dsZURpcmVjdGlvbkJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+XG4gICAgaGFuZGxlVG9nZ2xlRGlyZWN0aW9uQ2xpY2soKSxcbiAgKTtcbn07XG5cbmNvbnN0IGFkZEJvYXJkRHJhZ0V2ZW50SGFuZGxlcnMgPSAoKSA9PiB7XG4gIGJvYXJkQm9yZGVyRGl2LmFkZEV2ZW50TGlzdGVuZXIoJ2RyYWdlbnRlcicsIChlKSA9PlxuICAgIGhhbmRsZURyYWdFbnRlckJvYXJkQm9yZGVyKGUpLFxuICApO1xuICBwbGFjZVNoaXBzQm9hcmREaXYuYWRkRXZlbnRMaXN0ZW5lcignZHJhZ292ZXInLCAoZSkgPT4gaGFuZGxlRHJhZ092ZXIoZSkpO1xuICBwbGFjZVNoaXBzQm9hcmREaXYuYWRkRXZlbnRMaXN0ZW5lcignZHJvcCcsIChlKSA9PiBoYW5kbGVEcm9wKGUpKTtcbiAgcGxhY2VTaGlwc0JvYXJkRGl2LmFkZEV2ZW50TGlzdGVuZXIoJ2RyYWdlbnRlcicsIChlKSA9PiBoYW5kbGVEcmFnRW50ZXIoZSkpO1xufTtcblxuLy8gc2V0dXAgaW5pdGlhbCByZW5kZXJcbnVwZGF0ZUFubm91bmNlbWVudCgnUGxhY2UgeW91ciBzaGlwcycpO1xudXBkYXRlQm9hcmQoKTtcbmFkZFNoaXBzRHJhZ0V2ZW50SGFuZGxlcnMoKTtcbmFkZEJvYXJkRHJhZ0V2ZW50SGFuZGxlcnMoKTtcbiIsImNvbnN0IHBsYXlBZ2FpbkJ1dHRvbiA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5wbGF5LWFnYWluJyk7XG5cbnBsYXlBZ2FpbkJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHdpbmRvdy5sb2NhdGlvbi5yZWxvYWQoKSk7XG4iLCIvLyBJbXBvcnRzXG5pbXBvcnQgX19fQ1NTX0xPQURFUl9BUElfU09VUkNFTUFQX0lNUE9SVF9fXyBmcm9tIFwiLi4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvZGlzdC9ydW50aW1lL3NvdXJjZU1hcHMuanNcIjtcbmltcG9ydCBfX19DU1NfTE9BREVSX0FQSV9JTVBPUlRfX18gZnJvbSBcIi4uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2Rpc3QvcnVudGltZS9hcGkuanNcIjtcbmltcG9ydCBfX19DU1NfTE9BREVSX0dFVF9VUkxfSU1QT1JUX19fIGZyb20gXCIuLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9kaXN0L3J1bnRpbWUvZ2V0VXJsLmpzXCI7XG52YXIgX19fQ1NTX0xPQURFUl9VUkxfSU1QT1JUXzBfX18gPSBuZXcgVVJMKFwiLi9hc3NldHMvS2VhbmlhT25lLVJlZ3VsYXIudHRmXCIsIGltcG9ydC5tZXRhLnVybCk7XG52YXIgX19fQ1NTX0xPQURFUl9VUkxfSU1QT1JUXzFfX18gPSBuZXcgVVJMKFwiLi9hc3NldHMvU3BhY2VNb25vLVJlZ3VsYXIudHRmXCIsIGltcG9ydC5tZXRhLnVybCk7XG52YXIgX19fQ1NTX0xPQURFUl9FWFBPUlRfX18gPSBfX19DU1NfTE9BREVSX0FQSV9JTVBPUlRfX18oX19fQ1NTX0xPQURFUl9BUElfU09VUkNFTUFQX0lNUE9SVF9fXyk7XG52YXIgX19fQ1NTX0xPQURFUl9VUkxfUkVQTEFDRU1FTlRfMF9fXyA9IF9fX0NTU19MT0FERVJfR0VUX1VSTF9JTVBPUlRfX18oX19fQ1NTX0xPQURFUl9VUkxfSU1QT1JUXzBfX18pO1xudmFyIF9fX0NTU19MT0FERVJfVVJMX1JFUExBQ0VNRU5UXzFfX18gPSBfX19DU1NfTE9BREVSX0dFVF9VUkxfSU1QT1JUX19fKF9fX0NTU19MT0FERVJfVVJMX0lNUE9SVF8xX19fKTtcbi8vIE1vZHVsZVxuX19fQ1NTX0xPQURFUl9FWFBPUlRfX18ucHVzaChbbW9kdWxlLmlkLCBgQGZvbnQtZmFjZSB7XG4gIGZvbnQtZmFtaWx5OiAnS2VhbmlhJztcbiAgc3JjOiB1cmwoJHtfX19DU1NfTE9BREVSX1VSTF9SRVBMQUNFTUVOVF8wX19ffSkgZm9ybWF0KCd0cnVldHlwZScpO1xufVxuQGZvbnQtZmFjZSB7XG4gIGZvbnQtZmFtaWx5OiAnU3BhY2VNb25vJztcbiAgc3JjOiB1cmwoJHtfX19DU1NfTE9BREVSX1VSTF9SRVBMQUNFTUVOVF8xX19ffSkgZm9ybWF0KCd0cnVldHlwZScpO1xufVxuKiB7XG4gIG1hcmdpbjogMDtcbiAgcGFkZGluZzogMDtcbiAgYm94LXNpemluZzogYm9yZGVyLWJveDtcbiAgZm9udC1mYW1pbHk6ICdTcGFjZU1vbm8nLCBzYW5zLXNlcmlmO1xufVxuOnJvb3Qge1xuICAtLWJsYWNrOiByZ2IoMTYsIDE3LCAxNik7XG4gIC0tZ3JleTogcmdiKDIxOSwgMjE5LCAyMTkpO1xuICAtLXllbGxvdzogcmdiKDI1NSwgMjQ2LCAxOTIpO1xufVxuXG5ib2R5IHtcbiAgcG9zaXRpb246IGFic29sdXRlO1xuICBib3R0b206IDA7XG4gIHRvcDogMDtcbiAgbGVmdDogMDtcbiAgcmlnaHQ6IDA7XG4gIG1hcmdpbjogMzBweDtcbiAgYmFja2dyb3VuZC1jb2xvcjogdmFyKC0tZ3JleSk7XG4gIGNvbG9yOiB2YXIoLS1ibGFjayk7XG5cbiAgZGlzcGxheTogZ3JpZDtcbiAgZ3JpZC10ZW1wbGF0ZS1yb3dzOiBtaW4tY29udGVudCBtaW4tY29udGVudDtcbiAgcm93LWdhcDogMzBweDtcbiAganVzdGlmeS1pdGVtczogY2VudGVyO1xuICB0ZXh0LWFsaWduOiBjZW50ZXI7XG59XG5cbi50aXRsZSB7XG4gIGZvbnQtZmFtaWx5OiAnS2VhbmlhJztcbiAgZm9udC1zaXplOiA2MHB4O1xuICBmb250LXN0cmV0Y2g6IGV4dHJhLWV4cGFuZGVkO1xufVxuXG4ubWVudS1zY3JlZW4gPiBmb3JtIHtcbiAgbWFyZ2luOiAzMHB4O1xuICBkaXNwbGF5OiBncmlkO1xuICBhbGlnbi1pdGVtczogY2VudGVyO1xuICBncmlkLXRlbXBsYXRlLXJvd3M6IHJlcGVhdCgzLCBtaW4tY29udGVudCk7XG4gIGdhcDogNTBweDtcbiAgYWxpZ24tY29udGVudDogY2VudGVyO1xuICBqdXN0aWZ5LWl0ZW1zOiBjZW50ZXI7XG59XG5cbmZvcm0gPiBkaXYge1xuICBkaXNwbGF5OiBncmlkO1xuICBnYXA6IDEwcHg7XG4gIGp1c3RpZnktY29udGVudDogY2VudGVyO1xufVxuXG5mb3JtID4gZGl2Om50aC1jaGlsZCgyKSB7XG4gIGRpc3BsYXk6IGZsZXg7XG4gIHdpZHRoOiAxMDAlO1xufVxuXG5mb3JtIGJ1dHRvbiB7XG4gIHdpZHRoOiBtaW4tY29udGVudDtcbn1cblxuaW5wdXQge1xuICBwYWRkaW5nOiA1cHggMTBweDtcbn1cblxuLmdhbWUtc2NyZWVuIHtcbiAgd2lkdGg6IDEwMCU7XG4gIGhlaWdodDogbWluLWNvbnRlbnQ7XG5cbiAgZGlzcGxheTogZ3JpZDtcbiAgZ3JpZC10ZW1wbGF0ZS1jb2x1bW5zOiAxZnIgMWZyO1xuICBjb2x1bW4tZ2FwOiA1MHB4O1xuICBqdXN0aWZ5LWl0ZW1zOiBjZW50ZXI7XG59XG5cbi5wbGFjZS1zaGlwcy1zY3JlZW4ge1xuICB3aWR0aDogMTAwJTtcblxuICBkaXNwbGF5OiBncmlkO1xuICBncmlkLXRlbXBsYXRlLWNvbHVtbnM6IDFmciAxZnI7XG4gIGdyaWQtdGVtcGxhdGUtcm93czogbWluLWNvbnRlbnQgbWluLWNvbnRlbnQ7XG4gIGFsaWduLWl0ZW1zOiBjZW50ZXI7XG4gIGNvbHVtbi1nYXA6IDUwcHg7XG4gIGp1c3RpZnktaXRlbXM6IGNlbnRlcjtcbn1cblxuLnRvZ2dsZS1kaXJlY3Rpb24ge1xuICBoZWlnaHQ6IG1pbi1jb250ZW50O1xufVxuXG4uYW5ub3VuY2VtZW50IHtcbiAgcGFkZGluZzogMjBweDtcbiAgd2lkdGg6IGNsYW1wKDMwMHB4LCA1MCUsIDQwMHB4KTtcbiAgaGVpZ2h0OiAxMDAlO1xuICB0ZXh0LWFsaWduOiBjZW50ZXI7XG59XG5cbi5ib2FyZCB7XG4gIGJhY2tncm91bmQtY29sb3I6IHdoaXRlc21va2U7XG4gIGRpc3BsYXk6IGdyaWQ7XG4gIGdyaWQtdGVtcGxhdGUtY29sdW1uczogcmVwZWF0KDEwLCA0MHB4KTtcbiAgZ3JpZC10ZW1wbGF0ZS1yb3dzOiByZXBlYXQoMTAsIDQwcHgpO1xufVxuXG4uYm9hcmQgPiBidXR0b24ge1xuICBvdXRsaW5lOiAxcHggc29saWQgZGFya2dyZXk7XG4gIGhlaWdodDogNDBweDtcbiAgbWluLXdpZHRoOiA0MHB4O1xuICBiYWNrZ3JvdW5kLWNvbG9yOiBpbmhlcml0O1xuICBib3JkZXI6IG5vbmU7XG59XG5cbi5hdHRhY2tzLmJvYXJkID4gYnV0dG9uOmhvdmVyIHtcbiAgYmFja2dyb3VuZC1jb2xvcjogbGlnaHRncmF5O1xufVxuXG4uYXR0YWNrcy5ib2FyZCA+IGJ1dHRvbjphY3RpdmUge1xuICBiYWNrZ3JvdW5kLWNvbG9yOiB3aGl0ZXNtb2tlO1xufVxuXG4uYXR0YWNrcy5ib2FyZCA+IGJ1dHRvbi5zaGlwLmRpc2FibGU6aG92ZXIge1xuICBiYWNrZ3JvdW5kLWNvbG9yOiByZWJlY2NhcHVycGxlO1xufVxuXG4uYXR0YWNrcy5ib2FyZCA+IGJ1dHRvbi5kaXNhYmxlOmhvdmVyIHtcbiAgYmFja2dyb3VuZC1jb2xvcjogaW5oZXJpdDtcbn1cblxuLmRpc2FibGUtcG9pbnRlciB7XG4gIHBvaW50ZXItZXZlbnRzOiBub25lO1xufVxuXG5idXR0b24uc2hpcCB7XG4gIGJhY2tncm91bmQtY29sb3I6IHJlYmVjY2FwdXJwbGU7XG59XG5cbmJ1dHRvbi5oaXQ6OmJlZm9yZSB7XG4gIGNvbnRlbnQ6ICdYJztcbiAgY29sb3I6IHJlZDtcbiAgZm9udC13ZWlnaHQ6IGJvbGRlcjtcbiAgZm9udC1zaXplOiAyNHB4O1xufVxuXG5idXR0b24ubWlzczo6YmVmb3JlIHtcbiAgY29udGVudDogJ08nO1xuICBjb2xvcjogZ3JheTtcbiAgZm9udC13ZWlnaHQ6IGJvbGRlcjtcbiAgZm9udC1zaXplOiAyNHB4O1xufVxuXG4uYm9hcmQtYm9yZGVyIHtcbiAgcGFkZGluZzogNXB4O1xuXG4gIGdyaWQtY29sdW1uOiAyLzM7XG4gIGdyaWQtcm93OiAxLzM7XG59XG5cbi5wbGFjZS1zaGlwcy5ib2FyZCB7XG4gIGRpc3BsYXk6IGZsZXg7XG4gIGZsZXgtd3JhcDogd3JhcDtcbiAgd2lkdGg6IDQwMHB4O1xuICBoZWlnaHQ6IDQwMHB4O1xufVxuXG4uZHJhZ2dhYmxlLXNoaXBzLWNvbnRhaW5lciB7XG4gIHdpZHRoOiAzNTBweDtcbiAgbWluLWhlaWdodDogMzAwcHg7XG4gIGJhY2tncm91bmQtY29sb3I6IHdoaXRlc21va2U7XG4gIHBhZGRpbmc6IDMwcHg7XG5cbiAgZGlzcGxheTogZmxleDtcbiAgZmxleC13cmFwOiB3cmFwO1xuICBnYXA6IDIwcHg7XG59XG5cbi5kcmFnZ2FibGUtc2hpcHMtY29udGFpbmVyID4gKiB7XG4gIGN1cnNvcjogZ3JhYjtcbn1cblxuI2JhdHRsZXNoaXAsXG4jY3J1aXNlcixcbiNzdWJtYXJpbmUsXG4jZGVzdHJveWVyLFxuI2NhcnJpZXIge1xuICB3aWR0aDogNDBweDtcbiAgaGVpZ2h0OiA0MHB4O1xuICBiYWNrZ3JvdW5kLWNvbG9yOiByZWJlY2NhcHVycGxlO1xuXG4gIGRpc3BsYXk6IGZsZXg7XG4gIGFsaWduLWl0ZW1zOiBjZW50ZXI7XG4gIGp1c3RpZnktY29udGVudDogY2VudGVyO1xufVxuXG4ucGxhY2Utc2hpcHMuYm9hcmQgPiAuc2hpcC1ob3ZlciB7XG4gIGJhY2tncm91bmQtY29sb3I6IGdyYXk7XG59XG5cbi5wbGFjZS1zaGlwcy5ib2FyZCA+IC5zaGlwLWhvdmVyLmludmFsaWQge1xuICBiYWNrZ3JvdW5kLWNvbG9yOiBtYXJvb247XG59XG5cbi50cmFuc3BhcmVudCB7XG4gIG9wYWNpdHk6IDAuNTtcbn1cblxuLmhpZGRlbiB7XG4gIGRpc3BsYXk6IG5vbmU7XG59XG5cbmJ1dHRvbi5zdGFydCxcbmJ1dHRvbi50b2dnbGUtZGlyZWN0aW9uLFxuYnV0dG9uLnBsYXktYWdhaW4ge1xuICBwYWRkaW5nOiA1cHggMTJweDtcbn1cblxuLm1lbnUtc2NyZWVuLFxuLnBsYWNlLXNoaXBzLXNjcmVlbixcbi5nYW1lLXNjcmVlbixcbi53aW5uZXItc2NyZWVuIHtcbiAgbWF4LXdpZHRoOiAxMDAwcHg7XG59XG5cbmZvb3RlciB7XG4gIGFsaWduLXNlbGY6IGZsZXgtZW5kO1xuICBmb250LXNpemU6IDE0cHg7XG4gIGNvbG9yOiBncmF5O1xuICBhIHtcbiAgICBjb2xvcjogaW5oZXJpdDtcbiAgfVxufVxuYCwgXCJcIix7XCJ2ZXJzaW9uXCI6MyxcInNvdXJjZXNcIjpbXCJ3ZWJwYWNrOi8vLi9zcmMvc3R5bGVzLmNzc1wiXSxcIm5hbWVzXCI6W10sXCJtYXBwaW5nc1wiOlwiQUFBQTtFQUNFLHFCQUFxQjtFQUNyQiwrREFBNkQ7QUFDL0Q7QUFDQTtFQUNFLHdCQUF3QjtFQUN4QiwrREFBNkQ7QUFDL0Q7QUFDQTtFQUNFLFNBQVM7RUFDVCxVQUFVO0VBQ1Ysc0JBQXNCO0VBQ3RCLG9DQUFvQztBQUN0QztBQUNBO0VBQ0Usd0JBQXdCO0VBQ3hCLDBCQUEwQjtFQUMxQiw0QkFBNEI7QUFDOUI7O0FBRUE7RUFDRSxrQkFBa0I7RUFDbEIsU0FBUztFQUNULE1BQU07RUFDTixPQUFPO0VBQ1AsUUFBUTtFQUNSLFlBQVk7RUFDWiw2QkFBNkI7RUFDN0IsbUJBQW1COztFQUVuQixhQUFhO0VBQ2IsMkNBQTJDO0VBQzNDLGFBQWE7RUFDYixxQkFBcUI7RUFDckIsa0JBQWtCO0FBQ3BCOztBQUVBO0VBQ0UscUJBQXFCO0VBQ3JCLGVBQWU7RUFDZiw0QkFBNEI7QUFDOUI7O0FBRUE7RUFDRSxZQUFZO0VBQ1osYUFBYTtFQUNiLG1CQUFtQjtFQUNuQiwwQ0FBMEM7RUFDMUMsU0FBUztFQUNULHFCQUFxQjtFQUNyQixxQkFBcUI7QUFDdkI7O0FBRUE7RUFDRSxhQUFhO0VBQ2IsU0FBUztFQUNULHVCQUF1QjtBQUN6Qjs7QUFFQTtFQUNFLGFBQWE7RUFDYixXQUFXO0FBQ2I7O0FBRUE7RUFDRSxrQkFBa0I7QUFDcEI7O0FBRUE7RUFDRSxpQkFBaUI7QUFDbkI7O0FBRUE7RUFDRSxXQUFXO0VBQ1gsbUJBQW1COztFQUVuQixhQUFhO0VBQ2IsOEJBQThCO0VBQzlCLGdCQUFnQjtFQUNoQixxQkFBcUI7QUFDdkI7O0FBRUE7RUFDRSxXQUFXOztFQUVYLGFBQWE7RUFDYiw4QkFBOEI7RUFDOUIsMkNBQTJDO0VBQzNDLG1CQUFtQjtFQUNuQixnQkFBZ0I7RUFDaEIscUJBQXFCO0FBQ3ZCOztBQUVBO0VBQ0UsbUJBQW1CO0FBQ3JCOztBQUVBO0VBQ0UsYUFBYTtFQUNiLCtCQUErQjtFQUMvQixZQUFZO0VBQ1osa0JBQWtCO0FBQ3BCOztBQUVBO0VBQ0UsNEJBQTRCO0VBQzVCLGFBQWE7RUFDYix1Q0FBdUM7RUFDdkMsb0NBQW9DO0FBQ3RDOztBQUVBO0VBQ0UsMkJBQTJCO0VBQzNCLFlBQVk7RUFDWixlQUFlO0VBQ2YseUJBQXlCO0VBQ3pCLFlBQVk7QUFDZDs7QUFFQTtFQUNFLDJCQUEyQjtBQUM3Qjs7QUFFQTtFQUNFLDRCQUE0QjtBQUM5Qjs7QUFFQTtFQUNFLCtCQUErQjtBQUNqQzs7QUFFQTtFQUNFLHlCQUF5QjtBQUMzQjs7QUFFQTtFQUNFLG9CQUFvQjtBQUN0Qjs7QUFFQTtFQUNFLCtCQUErQjtBQUNqQzs7QUFFQTtFQUNFLFlBQVk7RUFDWixVQUFVO0VBQ1YsbUJBQW1CO0VBQ25CLGVBQWU7QUFDakI7O0FBRUE7RUFDRSxZQUFZO0VBQ1osV0FBVztFQUNYLG1CQUFtQjtFQUNuQixlQUFlO0FBQ2pCOztBQUVBO0VBQ0UsWUFBWTs7RUFFWixnQkFBZ0I7RUFDaEIsYUFBYTtBQUNmOztBQUVBO0VBQ0UsYUFBYTtFQUNiLGVBQWU7RUFDZixZQUFZO0VBQ1osYUFBYTtBQUNmOztBQUVBO0VBQ0UsWUFBWTtFQUNaLGlCQUFpQjtFQUNqQiw0QkFBNEI7RUFDNUIsYUFBYTs7RUFFYixhQUFhO0VBQ2IsZUFBZTtFQUNmLFNBQVM7QUFDWDs7QUFFQTtFQUNFLFlBQVk7QUFDZDs7QUFFQTs7Ozs7RUFLRSxXQUFXO0VBQ1gsWUFBWTtFQUNaLCtCQUErQjs7RUFFL0IsYUFBYTtFQUNiLG1CQUFtQjtFQUNuQix1QkFBdUI7QUFDekI7O0FBRUE7RUFDRSxzQkFBc0I7QUFDeEI7O0FBRUE7RUFDRSx3QkFBd0I7QUFDMUI7O0FBRUE7RUFDRSxZQUFZO0FBQ2Q7O0FBRUE7RUFDRSxhQUFhO0FBQ2Y7O0FBRUE7OztFQUdFLGlCQUFpQjtBQUNuQjs7QUFFQTs7OztFQUlFLGlCQUFpQjtBQUNuQjs7QUFFQTtFQUNFLG9CQUFvQjtFQUNwQixlQUFlO0VBQ2YsV0FBVztFQUNYO0lBQ0UsY0FBYztFQUNoQjtBQUNGXCIsXCJzb3VyY2VzQ29udGVudFwiOltcIkBmb250LWZhY2Uge1xcbiAgZm9udC1mYW1pbHk6ICdLZWFuaWEnO1xcbiAgc3JjOiB1cmwoJy4vYXNzZXRzL0tlYW5pYU9uZS1SZWd1bGFyLnR0ZicpIGZvcm1hdCgndHJ1ZXR5cGUnKTtcXG59XFxuQGZvbnQtZmFjZSB7XFxuICBmb250LWZhbWlseTogJ1NwYWNlTW9ubyc7XFxuICBzcmM6IHVybCgnLi9hc3NldHMvU3BhY2VNb25vLVJlZ3VsYXIudHRmJykgZm9ybWF0KCd0cnVldHlwZScpO1xcbn1cXG4qIHtcXG4gIG1hcmdpbjogMDtcXG4gIHBhZGRpbmc6IDA7XFxuICBib3gtc2l6aW5nOiBib3JkZXItYm94O1xcbiAgZm9udC1mYW1pbHk6ICdTcGFjZU1vbm8nLCBzYW5zLXNlcmlmO1xcbn1cXG46cm9vdCB7XFxuICAtLWJsYWNrOiByZ2IoMTYsIDE3LCAxNik7XFxuICAtLWdyZXk6IHJnYigyMTksIDIxOSwgMjE5KTtcXG4gIC0teWVsbG93OiByZ2IoMjU1LCAyNDYsIDE5Mik7XFxufVxcblxcbmJvZHkge1xcbiAgcG9zaXRpb246IGFic29sdXRlO1xcbiAgYm90dG9tOiAwO1xcbiAgdG9wOiAwO1xcbiAgbGVmdDogMDtcXG4gIHJpZ2h0OiAwO1xcbiAgbWFyZ2luOiAzMHB4O1xcbiAgYmFja2dyb3VuZC1jb2xvcjogdmFyKC0tZ3JleSk7XFxuICBjb2xvcjogdmFyKC0tYmxhY2spO1xcblxcbiAgZGlzcGxheTogZ3JpZDtcXG4gIGdyaWQtdGVtcGxhdGUtcm93czogbWluLWNvbnRlbnQgbWluLWNvbnRlbnQ7XFxuICByb3ctZ2FwOiAzMHB4O1xcbiAganVzdGlmeS1pdGVtczogY2VudGVyO1xcbiAgdGV4dC1hbGlnbjogY2VudGVyO1xcbn1cXG5cXG4udGl0bGUge1xcbiAgZm9udC1mYW1pbHk6ICdLZWFuaWEnO1xcbiAgZm9udC1zaXplOiA2MHB4O1xcbiAgZm9udC1zdHJldGNoOiBleHRyYS1leHBhbmRlZDtcXG59XFxuXFxuLm1lbnUtc2NyZWVuID4gZm9ybSB7XFxuICBtYXJnaW46IDMwcHg7XFxuICBkaXNwbGF5OiBncmlkO1xcbiAgYWxpZ24taXRlbXM6IGNlbnRlcjtcXG4gIGdyaWQtdGVtcGxhdGUtcm93czogcmVwZWF0KDMsIG1pbi1jb250ZW50KTtcXG4gIGdhcDogNTBweDtcXG4gIGFsaWduLWNvbnRlbnQ6IGNlbnRlcjtcXG4gIGp1c3RpZnktaXRlbXM6IGNlbnRlcjtcXG59XFxuXFxuZm9ybSA+IGRpdiB7XFxuICBkaXNwbGF5OiBncmlkO1xcbiAgZ2FwOiAxMHB4O1xcbiAganVzdGlmeS1jb250ZW50OiBjZW50ZXI7XFxufVxcblxcbmZvcm0gPiBkaXY6bnRoLWNoaWxkKDIpIHtcXG4gIGRpc3BsYXk6IGZsZXg7XFxuICB3aWR0aDogMTAwJTtcXG59XFxuXFxuZm9ybSBidXR0b24ge1xcbiAgd2lkdGg6IG1pbi1jb250ZW50O1xcbn1cXG5cXG5pbnB1dCB7XFxuICBwYWRkaW5nOiA1cHggMTBweDtcXG59XFxuXFxuLmdhbWUtc2NyZWVuIHtcXG4gIHdpZHRoOiAxMDAlO1xcbiAgaGVpZ2h0OiBtaW4tY29udGVudDtcXG5cXG4gIGRpc3BsYXk6IGdyaWQ7XFxuICBncmlkLXRlbXBsYXRlLWNvbHVtbnM6IDFmciAxZnI7XFxuICBjb2x1bW4tZ2FwOiA1MHB4O1xcbiAganVzdGlmeS1pdGVtczogY2VudGVyO1xcbn1cXG5cXG4ucGxhY2Utc2hpcHMtc2NyZWVuIHtcXG4gIHdpZHRoOiAxMDAlO1xcblxcbiAgZGlzcGxheTogZ3JpZDtcXG4gIGdyaWQtdGVtcGxhdGUtY29sdW1uczogMWZyIDFmcjtcXG4gIGdyaWQtdGVtcGxhdGUtcm93czogbWluLWNvbnRlbnQgbWluLWNvbnRlbnQ7XFxuICBhbGlnbi1pdGVtczogY2VudGVyO1xcbiAgY29sdW1uLWdhcDogNTBweDtcXG4gIGp1c3RpZnktaXRlbXM6IGNlbnRlcjtcXG59XFxuXFxuLnRvZ2dsZS1kaXJlY3Rpb24ge1xcbiAgaGVpZ2h0OiBtaW4tY29udGVudDtcXG59XFxuXFxuLmFubm91bmNlbWVudCB7XFxuICBwYWRkaW5nOiAyMHB4O1xcbiAgd2lkdGg6IGNsYW1wKDMwMHB4LCA1MCUsIDQwMHB4KTtcXG4gIGhlaWdodDogMTAwJTtcXG4gIHRleHQtYWxpZ246IGNlbnRlcjtcXG59XFxuXFxuLmJvYXJkIHtcXG4gIGJhY2tncm91bmQtY29sb3I6IHdoaXRlc21va2U7XFxuICBkaXNwbGF5OiBncmlkO1xcbiAgZ3JpZC10ZW1wbGF0ZS1jb2x1bW5zOiByZXBlYXQoMTAsIDQwcHgpO1xcbiAgZ3JpZC10ZW1wbGF0ZS1yb3dzOiByZXBlYXQoMTAsIDQwcHgpO1xcbn1cXG5cXG4uYm9hcmQgPiBidXR0b24ge1xcbiAgb3V0bGluZTogMXB4IHNvbGlkIGRhcmtncmV5O1xcbiAgaGVpZ2h0OiA0MHB4O1xcbiAgbWluLXdpZHRoOiA0MHB4O1xcbiAgYmFja2dyb3VuZC1jb2xvcjogaW5oZXJpdDtcXG4gIGJvcmRlcjogbm9uZTtcXG59XFxuXFxuLmF0dGFja3MuYm9hcmQgPiBidXR0b246aG92ZXIge1xcbiAgYmFja2dyb3VuZC1jb2xvcjogbGlnaHRncmF5O1xcbn1cXG5cXG4uYXR0YWNrcy5ib2FyZCA+IGJ1dHRvbjphY3RpdmUge1xcbiAgYmFja2dyb3VuZC1jb2xvcjogd2hpdGVzbW9rZTtcXG59XFxuXFxuLmF0dGFja3MuYm9hcmQgPiBidXR0b24uc2hpcC5kaXNhYmxlOmhvdmVyIHtcXG4gIGJhY2tncm91bmQtY29sb3I6IHJlYmVjY2FwdXJwbGU7XFxufVxcblxcbi5hdHRhY2tzLmJvYXJkID4gYnV0dG9uLmRpc2FibGU6aG92ZXIge1xcbiAgYmFja2dyb3VuZC1jb2xvcjogaW5oZXJpdDtcXG59XFxuXFxuLmRpc2FibGUtcG9pbnRlciB7XFxuICBwb2ludGVyLWV2ZW50czogbm9uZTtcXG59XFxuXFxuYnV0dG9uLnNoaXAge1xcbiAgYmFja2dyb3VuZC1jb2xvcjogcmViZWNjYXB1cnBsZTtcXG59XFxuXFxuYnV0dG9uLmhpdDo6YmVmb3JlIHtcXG4gIGNvbnRlbnQ6ICdYJztcXG4gIGNvbG9yOiByZWQ7XFxuICBmb250LXdlaWdodDogYm9sZGVyO1xcbiAgZm9udC1zaXplOiAyNHB4O1xcbn1cXG5cXG5idXR0b24ubWlzczo6YmVmb3JlIHtcXG4gIGNvbnRlbnQ6ICdPJztcXG4gIGNvbG9yOiBncmF5O1xcbiAgZm9udC13ZWlnaHQ6IGJvbGRlcjtcXG4gIGZvbnQtc2l6ZTogMjRweDtcXG59XFxuXFxuLmJvYXJkLWJvcmRlciB7XFxuICBwYWRkaW5nOiA1cHg7XFxuXFxuICBncmlkLWNvbHVtbjogMi8zO1xcbiAgZ3JpZC1yb3c6IDEvMztcXG59XFxuXFxuLnBsYWNlLXNoaXBzLmJvYXJkIHtcXG4gIGRpc3BsYXk6IGZsZXg7XFxuICBmbGV4LXdyYXA6IHdyYXA7XFxuICB3aWR0aDogNDAwcHg7XFxuICBoZWlnaHQ6IDQwMHB4O1xcbn1cXG5cXG4uZHJhZ2dhYmxlLXNoaXBzLWNvbnRhaW5lciB7XFxuICB3aWR0aDogMzUwcHg7XFxuICBtaW4taGVpZ2h0OiAzMDBweDtcXG4gIGJhY2tncm91bmQtY29sb3I6IHdoaXRlc21va2U7XFxuICBwYWRkaW5nOiAzMHB4O1xcblxcbiAgZGlzcGxheTogZmxleDtcXG4gIGZsZXgtd3JhcDogd3JhcDtcXG4gIGdhcDogMjBweDtcXG59XFxuXFxuLmRyYWdnYWJsZS1zaGlwcy1jb250YWluZXIgPiAqIHtcXG4gIGN1cnNvcjogZ3JhYjtcXG59XFxuXFxuI2JhdHRsZXNoaXAsXFxuI2NydWlzZXIsXFxuI3N1Ym1hcmluZSxcXG4jZGVzdHJveWVyLFxcbiNjYXJyaWVyIHtcXG4gIHdpZHRoOiA0MHB4O1xcbiAgaGVpZ2h0OiA0MHB4O1xcbiAgYmFja2dyb3VuZC1jb2xvcjogcmViZWNjYXB1cnBsZTtcXG5cXG4gIGRpc3BsYXk6IGZsZXg7XFxuICBhbGlnbi1pdGVtczogY2VudGVyO1xcbiAganVzdGlmeS1jb250ZW50OiBjZW50ZXI7XFxufVxcblxcbi5wbGFjZS1zaGlwcy5ib2FyZCA+IC5zaGlwLWhvdmVyIHtcXG4gIGJhY2tncm91bmQtY29sb3I6IGdyYXk7XFxufVxcblxcbi5wbGFjZS1zaGlwcy5ib2FyZCA+IC5zaGlwLWhvdmVyLmludmFsaWQge1xcbiAgYmFja2dyb3VuZC1jb2xvcjogbWFyb29uO1xcbn1cXG5cXG4udHJhbnNwYXJlbnQge1xcbiAgb3BhY2l0eTogMC41O1xcbn1cXG5cXG4uaGlkZGVuIHtcXG4gIGRpc3BsYXk6IG5vbmU7XFxufVxcblxcbmJ1dHRvbi5zdGFydCxcXG5idXR0b24udG9nZ2xlLWRpcmVjdGlvbixcXG5idXR0b24ucGxheS1hZ2FpbiB7XFxuICBwYWRkaW5nOiA1cHggMTJweDtcXG59XFxuXFxuLm1lbnUtc2NyZWVuLFxcbi5wbGFjZS1zaGlwcy1zY3JlZW4sXFxuLmdhbWUtc2NyZWVuLFxcbi53aW5uZXItc2NyZWVuIHtcXG4gIG1heC13aWR0aDogMTAwMHB4O1xcbn1cXG5cXG5mb290ZXIge1xcbiAgYWxpZ24tc2VsZjogZmxleC1lbmQ7XFxuICBmb250LXNpemU6IDE0cHg7XFxuICBjb2xvcjogZ3JheTtcXG4gIGEge1xcbiAgICBjb2xvcjogaW5oZXJpdDtcXG4gIH1cXG59XFxuXCJdLFwic291cmNlUm9vdFwiOlwiXCJ9XSk7XG4vLyBFeHBvcnRzXG5leHBvcnQgZGVmYXVsdCBfX19DU1NfTE9BREVSX0VYUE9SVF9fXztcbiIsIlwidXNlIHN0cmljdFwiO1xuXG4vKlxuICBNSVQgTGljZW5zZSBodHRwOi8vd3d3Lm9wZW5zb3VyY2Uub3JnL2xpY2Vuc2VzL21pdC1saWNlbnNlLnBocFxuICBBdXRob3IgVG9iaWFzIEtvcHBlcnMgQHNva3JhXG4qL1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoY3NzV2l0aE1hcHBpbmdUb1N0cmluZykge1xuICB2YXIgbGlzdCA9IFtdO1xuXG4gIC8vIHJldHVybiB0aGUgbGlzdCBvZiBtb2R1bGVzIGFzIGNzcyBzdHJpbmdcbiAgbGlzdC50b1N0cmluZyA9IGZ1bmN0aW9uIHRvU3RyaW5nKCkge1xuICAgIHJldHVybiB0aGlzLm1hcChmdW5jdGlvbiAoaXRlbSkge1xuICAgICAgdmFyIGNvbnRlbnQgPSBcIlwiO1xuICAgICAgdmFyIG5lZWRMYXllciA9IHR5cGVvZiBpdGVtWzVdICE9PSBcInVuZGVmaW5lZFwiO1xuICAgICAgaWYgKGl0ZW1bNF0pIHtcbiAgICAgICAgY29udGVudCArPSBcIkBzdXBwb3J0cyAoXCIuY29uY2F0KGl0ZW1bNF0sIFwiKSB7XCIpO1xuICAgICAgfVxuICAgICAgaWYgKGl0ZW1bMl0pIHtcbiAgICAgICAgY29udGVudCArPSBcIkBtZWRpYSBcIi5jb25jYXQoaXRlbVsyXSwgXCIge1wiKTtcbiAgICAgIH1cbiAgICAgIGlmIChuZWVkTGF5ZXIpIHtcbiAgICAgICAgY29udGVudCArPSBcIkBsYXllclwiLmNvbmNhdChpdGVtWzVdLmxlbmd0aCA+IDAgPyBcIiBcIi5jb25jYXQoaXRlbVs1XSkgOiBcIlwiLCBcIiB7XCIpO1xuICAgICAgfVxuICAgICAgY29udGVudCArPSBjc3NXaXRoTWFwcGluZ1RvU3RyaW5nKGl0ZW0pO1xuICAgICAgaWYgKG5lZWRMYXllcikge1xuICAgICAgICBjb250ZW50ICs9IFwifVwiO1xuICAgICAgfVxuICAgICAgaWYgKGl0ZW1bMl0pIHtcbiAgICAgICAgY29udGVudCArPSBcIn1cIjtcbiAgICAgIH1cbiAgICAgIGlmIChpdGVtWzRdKSB7XG4gICAgICAgIGNvbnRlbnQgKz0gXCJ9XCI7XG4gICAgICB9XG4gICAgICByZXR1cm4gY29udGVudDtcbiAgICB9KS5qb2luKFwiXCIpO1xuICB9O1xuXG4gIC8vIGltcG9ydCBhIGxpc3Qgb2YgbW9kdWxlcyBpbnRvIHRoZSBsaXN0XG4gIGxpc3QuaSA9IGZ1bmN0aW9uIGkobW9kdWxlcywgbWVkaWEsIGRlZHVwZSwgc3VwcG9ydHMsIGxheWVyKSB7XG4gICAgaWYgKHR5cGVvZiBtb2R1bGVzID09PSBcInN0cmluZ1wiKSB7XG4gICAgICBtb2R1bGVzID0gW1tudWxsLCBtb2R1bGVzLCB1bmRlZmluZWRdXTtcbiAgICB9XG4gICAgdmFyIGFscmVhZHlJbXBvcnRlZE1vZHVsZXMgPSB7fTtcbiAgICBpZiAoZGVkdXBlKSB7XG4gICAgICBmb3IgKHZhciBrID0gMDsgayA8IHRoaXMubGVuZ3RoOyBrKyspIHtcbiAgICAgICAgdmFyIGlkID0gdGhpc1trXVswXTtcbiAgICAgICAgaWYgKGlkICE9IG51bGwpIHtcbiAgICAgICAgICBhbHJlYWR5SW1wb3J0ZWRNb2R1bGVzW2lkXSA9IHRydWU7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgZm9yICh2YXIgX2sgPSAwOyBfayA8IG1vZHVsZXMubGVuZ3RoOyBfaysrKSB7XG4gICAgICB2YXIgaXRlbSA9IFtdLmNvbmNhdChtb2R1bGVzW19rXSk7XG4gICAgICBpZiAoZGVkdXBlICYmIGFscmVhZHlJbXBvcnRlZE1vZHVsZXNbaXRlbVswXV0pIHtcbiAgICAgICAgY29udGludWU7XG4gICAgICB9XG4gICAgICBpZiAodHlwZW9mIGxheWVyICE9PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgICAgIGlmICh0eXBlb2YgaXRlbVs1XSA9PT0gXCJ1bmRlZmluZWRcIikge1xuICAgICAgICAgIGl0ZW1bNV0gPSBsYXllcjtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBpdGVtWzFdID0gXCJAbGF5ZXJcIi5jb25jYXQoaXRlbVs1XS5sZW5ndGggPiAwID8gXCIgXCIuY29uY2F0KGl0ZW1bNV0pIDogXCJcIiwgXCIge1wiKS5jb25jYXQoaXRlbVsxXSwgXCJ9XCIpO1xuICAgICAgICAgIGl0ZW1bNV0gPSBsYXllcjtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgaWYgKG1lZGlhKSB7XG4gICAgICAgIGlmICghaXRlbVsyXSkge1xuICAgICAgICAgIGl0ZW1bMl0gPSBtZWRpYTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBpdGVtWzFdID0gXCJAbWVkaWEgXCIuY29uY2F0KGl0ZW1bMl0sIFwiIHtcIikuY29uY2F0KGl0ZW1bMV0sIFwifVwiKTtcbiAgICAgICAgICBpdGVtWzJdID0gbWVkaWE7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGlmIChzdXBwb3J0cykge1xuICAgICAgICBpZiAoIWl0ZW1bNF0pIHtcbiAgICAgICAgICBpdGVtWzRdID0gXCJcIi5jb25jYXQoc3VwcG9ydHMpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGl0ZW1bMV0gPSBcIkBzdXBwb3J0cyAoXCIuY29uY2F0KGl0ZW1bNF0sIFwiKSB7XCIpLmNvbmNhdChpdGVtWzFdLCBcIn1cIik7XG4gICAgICAgICAgaXRlbVs0XSA9IHN1cHBvcnRzO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBsaXN0LnB1c2goaXRlbSk7XG4gICAgfVxuICB9O1xuICByZXR1cm4gbGlzdDtcbn07IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKHVybCwgb3B0aW9ucykge1xuICBpZiAoIW9wdGlvbnMpIHtcbiAgICBvcHRpb25zID0ge307XG4gIH1cbiAgaWYgKCF1cmwpIHtcbiAgICByZXR1cm4gdXJsO1xuICB9XG4gIHVybCA9IFN0cmluZyh1cmwuX19lc01vZHVsZSA/IHVybC5kZWZhdWx0IDogdXJsKTtcblxuICAvLyBJZiB1cmwgaXMgYWxyZWFkeSB3cmFwcGVkIGluIHF1b3RlcywgcmVtb3ZlIHRoZW1cbiAgaWYgKC9eWydcIl0uKlsnXCJdJC8udGVzdCh1cmwpKSB7XG4gICAgdXJsID0gdXJsLnNsaWNlKDEsIC0xKTtcbiAgfVxuICBpZiAob3B0aW9ucy5oYXNoKSB7XG4gICAgdXJsICs9IG9wdGlvbnMuaGFzaDtcbiAgfVxuXG4gIC8vIFNob3VsZCB1cmwgYmUgd3JhcHBlZD9cbiAgLy8gU2VlIGh0dHBzOi8vZHJhZnRzLmNzc3dnLm9yZy9jc3MtdmFsdWVzLTMvI3VybHNcbiAgaWYgKC9bXCInKCkgXFx0XFxuXXwoJTIwKS8udGVzdCh1cmwpIHx8IG9wdGlvbnMubmVlZFF1b3Rlcykge1xuICAgIHJldHVybiBcIlxcXCJcIi5jb25jYXQodXJsLnJlcGxhY2UoL1wiL2csICdcXFxcXCInKS5yZXBsYWNlKC9cXG4vZywgXCJcXFxcblwiKSwgXCJcXFwiXCIpO1xuICB9XG4gIHJldHVybiB1cmw7XG59OyIsIlwidXNlIHN0cmljdFwiO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChpdGVtKSB7XG4gIHZhciBjb250ZW50ID0gaXRlbVsxXTtcbiAgdmFyIGNzc01hcHBpbmcgPSBpdGVtWzNdO1xuICBpZiAoIWNzc01hcHBpbmcpIHtcbiAgICByZXR1cm4gY29udGVudDtcbiAgfVxuICBpZiAodHlwZW9mIGJ0b2EgPT09IFwiZnVuY3Rpb25cIikge1xuICAgIHZhciBiYXNlNjQgPSBidG9hKHVuZXNjYXBlKGVuY29kZVVSSUNvbXBvbmVudChKU09OLnN0cmluZ2lmeShjc3NNYXBwaW5nKSkpKTtcbiAgICB2YXIgZGF0YSA9IFwic291cmNlTWFwcGluZ1VSTD1kYXRhOmFwcGxpY2F0aW9uL2pzb247Y2hhcnNldD11dGYtODtiYXNlNjQsXCIuY29uY2F0KGJhc2U2NCk7XG4gICAgdmFyIHNvdXJjZU1hcHBpbmcgPSBcIi8qIyBcIi5jb25jYXQoZGF0YSwgXCIgKi9cIik7XG4gICAgcmV0dXJuIFtjb250ZW50XS5jb25jYXQoW3NvdXJjZU1hcHBpbmddKS5qb2luKFwiXFxuXCIpO1xuICB9XG4gIHJldHVybiBbY29udGVudF0uam9pbihcIlxcblwiKTtcbn07IiwiXG4gICAgICBpbXBvcnQgQVBJIGZyb20gXCIhLi4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvaW5qZWN0U3R5bGVzSW50b1N0eWxlVGFnLmpzXCI7XG4gICAgICBpbXBvcnQgZG9tQVBJIGZyb20gXCIhLi4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvc3R5bGVEb21BUEkuanNcIjtcbiAgICAgIGltcG9ydCBpbnNlcnRGbiBmcm9tIFwiIS4uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL2luc2VydEJ5U2VsZWN0b3IuanNcIjtcbiAgICAgIGltcG9ydCBzZXRBdHRyaWJ1dGVzIGZyb20gXCIhLi4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvc2V0QXR0cmlidXRlc1dpdGhvdXRBdHRyaWJ1dGVzLmpzXCI7XG4gICAgICBpbXBvcnQgaW5zZXJ0U3R5bGVFbGVtZW50IGZyb20gXCIhLi4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvaW5zZXJ0U3R5bGVFbGVtZW50LmpzXCI7XG4gICAgICBpbXBvcnQgc3R5bGVUYWdUcmFuc2Zvcm1GbiBmcm9tIFwiIS4uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL3N0eWxlVGFnVHJhbnNmb3JtLmpzXCI7XG4gICAgICBpbXBvcnQgY29udGVudCwgKiBhcyBuYW1lZEV4cG9ydCBmcm9tIFwiISEuLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9kaXN0L2Nqcy5qcyEuL3N0eWxlcy5jc3NcIjtcbiAgICAgIFxuICAgICAgXG5cbnZhciBvcHRpb25zID0ge307XG5cbm9wdGlvbnMuc3R5bGVUYWdUcmFuc2Zvcm0gPSBzdHlsZVRhZ1RyYW5zZm9ybUZuO1xub3B0aW9ucy5zZXRBdHRyaWJ1dGVzID0gc2V0QXR0cmlidXRlcztcblxuICAgICAgb3B0aW9ucy5pbnNlcnQgPSBpbnNlcnRGbi5iaW5kKG51bGwsIFwiaGVhZFwiKTtcbiAgICBcbm9wdGlvbnMuZG9tQVBJID0gZG9tQVBJO1xub3B0aW9ucy5pbnNlcnRTdHlsZUVsZW1lbnQgPSBpbnNlcnRTdHlsZUVsZW1lbnQ7XG5cbnZhciB1cGRhdGUgPSBBUEkoY29udGVudCwgb3B0aW9ucyk7XG5cblxuXG5leHBvcnQgKiBmcm9tIFwiISEuLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9kaXN0L2Nqcy5qcyEuL3N0eWxlcy5jc3NcIjtcbiAgICAgICBleHBvcnQgZGVmYXVsdCBjb250ZW50ICYmIGNvbnRlbnQubG9jYWxzID8gY29udGVudC5sb2NhbHMgOiB1bmRlZmluZWQ7XG4iLCJcInVzZSBzdHJpY3RcIjtcblxudmFyIHN0eWxlc0luRE9NID0gW107XG5mdW5jdGlvbiBnZXRJbmRleEJ5SWRlbnRpZmllcihpZGVudGlmaWVyKSB7XG4gIHZhciByZXN1bHQgPSAtMTtcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBzdHlsZXNJbkRPTS5sZW5ndGg7IGkrKykge1xuICAgIGlmIChzdHlsZXNJbkRPTVtpXS5pZGVudGlmaWVyID09PSBpZGVudGlmaWVyKSB7XG4gICAgICByZXN1bHQgPSBpO1xuICAgICAgYnJlYWs7XG4gICAgfVxuICB9XG4gIHJldHVybiByZXN1bHQ7XG59XG5mdW5jdGlvbiBtb2R1bGVzVG9Eb20obGlzdCwgb3B0aW9ucykge1xuICB2YXIgaWRDb3VudE1hcCA9IHt9O1xuICB2YXIgaWRlbnRpZmllcnMgPSBbXTtcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBsaXN0Lmxlbmd0aDsgaSsrKSB7XG4gICAgdmFyIGl0ZW0gPSBsaXN0W2ldO1xuICAgIHZhciBpZCA9IG9wdGlvbnMuYmFzZSA/IGl0ZW1bMF0gKyBvcHRpb25zLmJhc2UgOiBpdGVtWzBdO1xuICAgIHZhciBjb3VudCA9IGlkQ291bnRNYXBbaWRdIHx8IDA7XG4gICAgdmFyIGlkZW50aWZpZXIgPSBcIlwiLmNvbmNhdChpZCwgXCIgXCIpLmNvbmNhdChjb3VudCk7XG4gICAgaWRDb3VudE1hcFtpZF0gPSBjb3VudCArIDE7XG4gICAgdmFyIGluZGV4QnlJZGVudGlmaWVyID0gZ2V0SW5kZXhCeUlkZW50aWZpZXIoaWRlbnRpZmllcik7XG4gICAgdmFyIG9iaiA9IHtcbiAgICAgIGNzczogaXRlbVsxXSxcbiAgICAgIG1lZGlhOiBpdGVtWzJdLFxuICAgICAgc291cmNlTWFwOiBpdGVtWzNdLFxuICAgICAgc3VwcG9ydHM6IGl0ZW1bNF0sXG4gICAgICBsYXllcjogaXRlbVs1XVxuICAgIH07XG4gICAgaWYgKGluZGV4QnlJZGVudGlmaWVyICE9PSAtMSkge1xuICAgICAgc3R5bGVzSW5ET01baW5kZXhCeUlkZW50aWZpZXJdLnJlZmVyZW5jZXMrKztcbiAgICAgIHN0eWxlc0luRE9NW2luZGV4QnlJZGVudGlmaWVyXS51cGRhdGVyKG9iaik7XG4gICAgfSBlbHNlIHtcbiAgICAgIHZhciB1cGRhdGVyID0gYWRkRWxlbWVudFN0eWxlKG9iaiwgb3B0aW9ucyk7XG4gICAgICBvcHRpb25zLmJ5SW5kZXggPSBpO1xuICAgICAgc3R5bGVzSW5ET00uc3BsaWNlKGksIDAsIHtcbiAgICAgICAgaWRlbnRpZmllcjogaWRlbnRpZmllcixcbiAgICAgICAgdXBkYXRlcjogdXBkYXRlcixcbiAgICAgICAgcmVmZXJlbmNlczogMVxuICAgICAgfSk7XG4gICAgfVxuICAgIGlkZW50aWZpZXJzLnB1c2goaWRlbnRpZmllcik7XG4gIH1cbiAgcmV0dXJuIGlkZW50aWZpZXJzO1xufVxuZnVuY3Rpb24gYWRkRWxlbWVudFN0eWxlKG9iaiwgb3B0aW9ucykge1xuICB2YXIgYXBpID0gb3B0aW9ucy5kb21BUEkob3B0aW9ucyk7XG4gIGFwaS51cGRhdGUob2JqKTtcbiAgdmFyIHVwZGF0ZXIgPSBmdW5jdGlvbiB1cGRhdGVyKG5ld09iaikge1xuICAgIGlmIChuZXdPYmopIHtcbiAgICAgIGlmIChuZXdPYmouY3NzID09PSBvYmouY3NzICYmIG5ld09iai5tZWRpYSA9PT0gb2JqLm1lZGlhICYmIG5ld09iai5zb3VyY2VNYXAgPT09IG9iai5zb3VyY2VNYXAgJiYgbmV3T2JqLnN1cHBvcnRzID09PSBvYmouc3VwcG9ydHMgJiYgbmV3T2JqLmxheWVyID09PSBvYmoubGF5ZXIpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgYXBpLnVwZGF0ZShvYmogPSBuZXdPYmopO1xuICAgIH0gZWxzZSB7XG4gICAgICBhcGkucmVtb3ZlKCk7XG4gICAgfVxuICB9O1xuICByZXR1cm4gdXBkYXRlcjtcbn1cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGxpc3QsIG9wdGlvbnMpIHtcbiAgb3B0aW9ucyA9IG9wdGlvbnMgfHwge307XG4gIGxpc3QgPSBsaXN0IHx8IFtdO1xuICB2YXIgbGFzdElkZW50aWZpZXJzID0gbW9kdWxlc1RvRG9tKGxpc3QsIG9wdGlvbnMpO1xuICByZXR1cm4gZnVuY3Rpb24gdXBkYXRlKG5ld0xpc3QpIHtcbiAgICBuZXdMaXN0ID0gbmV3TGlzdCB8fCBbXTtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGxhc3RJZGVudGlmaWVycy5sZW5ndGg7IGkrKykge1xuICAgICAgdmFyIGlkZW50aWZpZXIgPSBsYXN0SWRlbnRpZmllcnNbaV07XG4gICAgICB2YXIgaW5kZXggPSBnZXRJbmRleEJ5SWRlbnRpZmllcihpZGVudGlmaWVyKTtcbiAgICAgIHN0eWxlc0luRE9NW2luZGV4XS5yZWZlcmVuY2VzLS07XG4gICAgfVxuICAgIHZhciBuZXdMYXN0SWRlbnRpZmllcnMgPSBtb2R1bGVzVG9Eb20obmV3TGlzdCwgb3B0aW9ucyk7XG4gICAgZm9yICh2YXIgX2kgPSAwOyBfaSA8IGxhc3RJZGVudGlmaWVycy5sZW5ndGg7IF9pKyspIHtcbiAgICAgIHZhciBfaWRlbnRpZmllciA9IGxhc3RJZGVudGlmaWVyc1tfaV07XG4gICAgICB2YXIgX2luZGV4ID0gZ2V0SW5kZXhCeUlkZW50aWZpZXIoX2lkZW50aWZpZXIpO1xuICAgICAgaWYgKHN0eWxlc0luRE9NW19pbmRleF0ucmVmZXJlbmNlcyA9PT0gMCkge1xuICAgICAgICBzdHlsZXNJbkRPTVtfaW5kZXhdLnVwZGF0ZXIoKTtcbiAgICAgICAgc3R5bGVzSW5ET00uc3BsaWNlKF9pbmRleCwgMSk7XG4gICAgICB9XG4gICAgfVxuICAgIGxhc3RJZGVudGlmaWVycyA9IG5ld0xhc3RJZGVudGlmaWVycztcbiAgfTtcbn07IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbnZhciBtZW1vID0ge307XG5cbi8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICAqL1xuZnVuY3Rpb24gZ2V0VGFyZ2V0KHRhcmdldCkge1xuICBpZiAodHlwZW9mIG1lbW9bdGFyZ2V0XSA9PT0gXCJ1bmRlZmluZWRcIikge1xuICAgIHZhciBzdHlsZVRhcmdldCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IodGFyZ2V0KTtcblxuICAgIC8vIFNwZWNpYWwgY2FzZSB0byByZXR1cm4gaGVhZCBvZiBpZnJhbWUgaW5zdGVhZCBvZiBpZnJhbWUgaXRzZWxmXG4gICAgaWYgKHdpbmRvdy5IVE1MSUZyYW1lRWxlbWVudCAmJiBzdHlsZVRhcmdldCBpbnN0YW5jZW9mIHdpbmRvdy5IVE1MSUZyYW1lRWxlbWVudCkge1xuICAgICAgdHJ5IHtcbiAgICAgICAgLy8gVGhpcyB3aWxsIHRocm93IGFuIGV4Y2VwdGlvbiBpZiBhY2Nlc3MgdG8gaWZyYW1lIGlzIGJsb2NrZWRcbiAgICAgICAgLy8gZHVlIHRvIGNyb3NzLW9yaWdpbiByZXN0cmljdGlvbnNcbiAgICAgICAgc3R5bGVUYXJnZXQgPSBzdHlsZVRhcmdldC5jb250ZW50RG9jdW1lbnQuaGVhZDtcbiAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgLy8gaXN0YW5idWwgaWdub3JlIG5leHRcbiAgICAgICAgc3R5bGVUYXJnZXQgPSBudWxsO1xuICAgICAgfVxuICAgIH1cbiAgICBtZW1vW3RhcmdldF0gPSBzdHlsZVRhcmdldDtcbiAgfVxuICByZXR1cm4gbWVtb1t0YXJnZXRdO1xufVxuXG4vKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAgKi9cbmZ1bmN0aW9uIGluc2VydEJ5U2VsZWN0b3IoaW5zZXJ0LCBzdHlsZSkge1xuICB2YXIgdGFyZ2V0ID0gZ2V0VGFyZ2V0KGluc2VydCk7XG4gIGlmICghdGFyZ2V0KSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKFwiQ291bGRuJ3QgZmluZCBhIHN0eWxlIHRhcmdldC4gVGhpcyBwcm9iYWJseSBtZWFucyB0aGF0IHRoZSB2YWx1ZSBmb3IgdGhlICdpbnNlcnQnIHBhcmFtZXRlciBpcyBpbnZhbGlkLlwiKTtcbiAgfVxuICB0YXJnZXQuYXBwZW5kQ2hpbGQoc3R5bGUpO1xufVxubW9kdWxlLmV4cG9ydHMgPSBpbnNlcnRCeVNlbGVjdG9yOyIsIlwidXNlIHN0cmljdFwiO1xuXG4vKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAgKi9cbmZ1bmN0aW9uIGluc2VydFN0eWxlRWxlbWVudChvcHRpb25zKSB7XG4gIHZhciBlbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInN0eWxlXCIpO1xuICBvcHRpb25zLnNldEF0dHJpYnV0ZXMoZWxlbWVudCwgb3B0aW9ucy5hdHRyaWJ1dGVzKTtcbiAgb3B0aW9ucy5pbnNlcnQoZWxlbWVudCwgb3B0aW9ucy5vcHRpb25zKTtcbiAgcmV0dXJuIGVsZW1lbnQ7XG59XG5tb2R1bGUuZXhwb3J0cyA9IGluc2VydFN0eWxlRWxlbWVudDsiLCJcInVzZSBzdHJpY3RcIjtcblxuLyogaXN0YW5idWwgaWdub3JlIG5leHQgICovXG5mdW5jdGlvbiBzZXRBdHRyaWJ1dGVzV2l0aG91dEF0dHJpYnV0ZXMoc3R5bGVFbGVtZW50KSB7XG4gIHZhciBub25jZSA9IHR5cGVvZiBfX3dlYnBhY2tfbm9uY2VfXyAhPT0gXCJ1bmRlZmluZWRcIiA/IF9fd2VicGFja19ub25jZV9fIDogbnVsbDtcbiAgaWYgKG5vbmNlKSB7XG4gICAgc3R5bGVFbGVtZW50LnNldEF0dHJpYnV0ZShcIm5vbmNlXCIsIG5vbmNlKTtcbiAgfVxufVxubW9kdWxlLmV4cG9ydHMgPSBzZXRBdHRyaWJ1dGVzV2l0aG91dEF0dHJpYnV0ZXM7IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbi8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICAqL1xuZnVuY3Rpb24gYXBwbHkoc3R5bGVFbGVtZW50LCBvcHRpb25zLCBvYmopIHtcbiAgdmFyIGNzcyA9IFwiXCI7XG4gIGlmIChvYmouc3VwcG9ydHMpIHtcbiAgICBjc3MgKz0gXCJAc3VwcG9ydHMgKFwiLmNvbmNhdChvYmouc3VwcG9ydHMsIFwiKSB7XCIpO1xuICB9XG4gIGlmIChvYmoubWVkaWEpIHtcbiAgICBjc3MgKz0gXCJAbWVkaWEgXCIuY29uY2F0KG9iai5tZWRpYSwgXCIge1wiKTtcbiAgfVxuICB2YXIgbmVlZExheWVyID0gdHlwZW9mIG9iai5sYXllciAhPT0gXCJ1bmRlZmluZWRcIjtcbiAgaWYgKG5lZWRMYXllcikge1xuICAgIGNzcyArPSBcIkBsYXllclwiLmNvbmNhdChvYmoubGF5ZXIubGVuZ3RoID4gMCA/IFwiIFwiLmNvbmNhdChvYmoubGF5ZXIpIDogXCJcIiwgXCIge1wiKTtcbiAgfVxuICBjc3MgKz0gb2JqLmNzcztcbiAgaWYgKG5lZWRMYXllcikge1xuICAgIGNzcyArPSBcIn1cIjtcbiAgfVxuICBpZiAob2JqLm1lZGlhKSB7XG4gICAgY3NzICs9IFwifVwiO1xuICB9XG4gIGlmIChvYmouc3VwcG9ydHMpIHtcbiAgICBjc3MgKz0gXCJ9XCI7XG4gIH1cbiAgdmFyIHNvdXJjZU1hcCA9IG9iai5zb3VyY2VNYXA7XG4gIGlmIChzb3VyY2VNYXAgJiYgdHlwZW9mIGJ0b2EgIT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICBjc3MgKz0gXCJcXG4vKiMgc291cmNlTWFwcGluZ1VSTD1kYXRhOmFwcGxpY2F0aW9uL2pzb247YmFzZTY0LFwiLmNvbmNhdChidG9hKHVuZXNjYXBlKGVuY29kZVVSSUNvbXBvbmVudChKU09OLnN0cmluZ2lmeShzb3VyY2VNYXApKSkpLCBcIiAqL1wiKTtcbiAgfVxuXG4gIC8vIEZvciBvbGQgSUVcbiAgLyogaXN0YW5idWwgaWdub3JlIGlmICAqL1xuICBvcHRpb25zLnN0eWxlVGFnVHJhbnNmb3JtKGNzcywgc3R5bGVFbGVtZW50LCBvcHRpb25zLm9wdGlvbnMpO1xufVxuZnVuY3Rpb24gcmVtb3ZlU3R5bGVFbGVtZW50KHN0eWxlRWxlbWVudCkge1xuICAvLyBpc3RhbmJ1bCBpZ25vcmUgaWZcbiAgaWYgKHN0eWxlRWxlbWVudC5wYXJlbnROb2RlID09PSBudWxsKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG4gIHN0eWxlRWxlbWVudC5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKHN0eWxlRWxlbWVudCk7XG59XG5cbi8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICAqL1xuZnVuY3Rpb24gZG9tQVBJKG9wdGlvbnMpIHtcbiAgaWYgKHR5cGVvZiBkb2N1bWVudCA9PT0gXCJ1bmRlZmluZWRcIikge1xuICAgIHJldHVybiB7XG4gICAgICB1cGRhdGU6IGZ1bmN0aW9uIHVwZGF0ZSgpIHt9LFxuICAgICAgcmVtb3ZlOiBmdW5jdGlvbiByZW1vdmUoKSB7fVxuICAgIH07XG4gIH1cbiAgdmFyIHN0eWxlRWxlbWVudCA9IG9wdGlvbnMuaW5zZXJ0U3R5bGVFbGVtZW50KG9wdGlvbnMpO1xuICByZXR1cm4ge1xuICAgIHVwZGF0ZTogZnVuY3Rpb24gdXBkYXRlKG9iaikge1xuICAgICAgYXBwbHkoc3R5bGVFbGVtZW50LCBvcHRpb25zLCBvYmopO1xuICAgIH0sXG4gICAgcmVtb3ZlOiBmdW5jdGlvbiByZW1vdmUoKSB7XG4gICAgICByZW1vdmVTdHlsZUVsZW1lbnQoc3R5bGVFbGVtZW50KTtcbiAgICB9XG4gIH07XG59XG5tb2R1bGUuZXhwb3J0cyA9IGRvbUFQSTsiLCJcInVzZSBzdHJpY3RcIjtcblxuLyogaXN0YW5idWwgaWdub3JlIG5leHQgICovXG5mdW5jdGlvbiBzdHlsZVRhZ1RyYW5zZm9ybShjc3MsIHN0eWxlRWxlbWVudCkge1xuICBpZiAoc3R5bGVFbGVtZW50LnN0eWxlU2hlZXQpIHtcbiAgICBzdHlsZUVsZW1lbnQuc3R5bGVTaGVldC5jc3NUZXh0ID0gY3NzO1xuICB9IGVsc2Uge1xuICAgIHdoaWxlIChzdHlsZUVsZW1lbnQuZmlyc3RDaGlsZCkge1xuICAgICAgc3R5bGVFbGVtZW50LnJlbW92ZUNoaWxkKHN0eWxlRWxlbWVudC5maXJzdENoaWxkKTtcbiAgICB9XG4gICAgc3R5bGVFbGVtZW50LmFwcGVuZENoaWxkKGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKGNzcykpO1xuICB9XG59XG5tb2R1bGUuZXhwb3J0cyA9IHN0eWxlVGFnVHJhbnNmb3JtOyIsIi8vIFRoZSBtb2R1bGUgY2FjaGVcbnZhciBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX18gPSB7fTtcblxuLy8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbmZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG5cdHZhciBjYWNoZWRNb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdO1xuXHRpZiAoY2FjaGVkTW9kdWxlICE9PSB1bmRlZmluZWQpIHtcblx0XHRyZXR1cm4gY2FjaGVkTW9kdWxlLmV4cG9ydHM7XG5cdH1cblx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcblx0dmFyIG1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0gPSB7XG5cdFx0aWQ6IG1vZHVsZUlkLFxuXHRcdC8vIG5vIG1vZHVsZS5sb2FkZWQgbmVlZGVkXG5cdFx0ZXhwb3J0czoge31cblx0fTtcblxuXHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cblx0X193ZWJwYWNrX21vZHVsZXNfX1ttb2R1bGVJZF0obW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cblx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcblx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xufVxuXG4vLyBleHBvc2UgdGhlIG1vZHVsZXMgb2JqZWN0IChfX3dlYnBhY2tfbW9kdWxlc19fKVxuX193ZWJwYWNrX3JlcXVpcmVfXy5tID0gX193ZWJwYWNrX21vZHVsZXNfXztcblxuIiwiLy8gZ2V0RGVmYXVsdEV4cG9ydCBmdW5jdGlvbiBmb3IgY29tcGF0aWJpbGl0eSB3aXRoIG5vbi1oYXJtb255IG1vZHVsZXNcbl9fd2VicGFja19yZXF1aXJlX18ubiA9IChtb2R1bGUpID0+IHtcblx0dmFyIGdldHRlciA9IG1vZHVsZSAmJiBtb2R1bGUuX19lc01vZHVsZSA/XG5cdFx0KCkgPT4gKG1vZHVsZVsnZGVmYXVsdCddKSA6XG5cdFx0KCkgPT4gKG1vZHVsZSk7XG5cdF9fd2VicGFja19yZXF1aXJlX18uZChnZXR0ZXIsIHsgYTogZ2V0dGVyIH0pO1xuXHRyZXR1cm4gZ2V0dGVyO1xufTsiLCIvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9ucyBmb3IgaGFybW9ueSBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSAoZXhwb3J0cywgZGVmaW5pdGlvbikgPT4ge1xuXHRmb3IodmFyIGtleSBpbiBkZWZpbml0aW9uKSB7XG5cdFx0aWYoX193ZWJwYWNrX3JlcXVpcmVfXy5vKGRlZmluaXRpb24sIGtleSkgJiYgIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBrZXkpKSB7XG5cdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywga2V5LCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZGVmaW5pdGlvbltrZXldIH0pO1xuXHRcdH1cblx0fVxufTsiLCJfX3dlYnBhY2tfcmVxdWlyZV9fLmcgPSAoZnVuY3Rpb24oKSB7XG5cdGlmICh0eXBlb2YgZ2xvYmFsVGhpcyA9PT0gJ29iamVjdCcpIHJldHVybiBnbG9iYWxUaGlzO1xuXHR0cnkge1xuXHRcdHJldHVybiB0aGlzIHx8IG5ldyBGdW5jdGlvbigncmV0dXJuIHRoaXMnKSgpO1xuXHR9IGNhdGNoIChlKSB7XG5cdFx0aWYgKHR5cGVvZiB3aW5kb3cgPT09ICdvYmplY3QnKSByZXR1cm4gd2luZG93O1xuXHR9XG59KSgpOyIsIl9fd2VicGFja19yZXF1aXJlX18ubyA9IChvYmosIHByb3ApID0+IChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBwcm9wKSkiLCIvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSAoZXhwb3J0cykgPT4ge1xuXHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcblx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcblx0fVxuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xufTsiLCJ2YXIgc2NyaXB0VXJsO1xuaWYgKF9fd2VicGFja19yZXF1aXJlX18uZy5pbXBvcnRTY3JpcHRzKSBzY3JpcHRVcmwgPSBfX3dlYnBhY2tfcmVxdWlyZV9fLmcubG9jYXRpb24gKyBcIlwiO1xudmFyIGRvY3VtZW50ID0gX193ZWJwYWNrX3JlcXVpcmVfXy5nLmRvY3VtZW50O1xuaWYgKCFzY3JpcHRVcmwgJiYgZG9jdW1lbnQpIHtcblx0aWYgKGRvY3VtZW50LmN1cnJlbnRTY3JpcHQpXG5cdFx0c2NyaXB0VXJsID0gZG9jdW1lbnQuY3VycmVudFNjcmlwdC5zcmM7XG5cdGlmICghc2NyaXB0VXJsKSB7XG5cdFx0dmFyIHNjcmlwdHMgPSBkb2N1bWVudC5nZXRFbGVtZW50c0J5VGFnTmFtZShcInNjcmlwdFwiKTtcblx0XHRpZihzY3JpcHRzLmxlbmd0aCkge1xuXHRcdFx0dmFyIGkgPSBzY3JpcHRzLmxlbmd0aCAtIDE7XG5cdFx0XHR3aGlsZSAoaSA+IC0xICYmICFzY3JpcHRVcmwpIHNjcmlwdFVybCA9IHNjcmlwdHNbaS0tXS5zcmM7XG5cdFx0fVxuXHR9XG59XG4vLyBXaGVuIHN1cHBvcnRpbmcgYnJvd3NlcnMgd2hlcmUgYW4gYXV0b21hdGljIHB1YmxpY1BhdGggaXMgbm90IHN1cHBvcnRlZCB5b3UgbXVzdCBzcGVjaWZ5IGFuIG91dHB1dC5wdWJsaWNQYXRoIG1hbnVhbGx5IHZpYSBjb25maWd1cmF0aW9uXG4vLyBvciBwYXNzIGFuIGVtcHR5IHN0cmluZyAoXCJcIikgYW5kIHNldCB0aGUgX193ZWJwYWNrX3B1YmxpY19wYXRoX18gdmFyaWFibGUgZnJvbSB5b3VyIGNvZGUgdG8gdXNlIHlvdXIgb3duIGxvZ2ljLlxuaWYgKCFzY3JpcHRVcmwpIHRocm93IG5ldyBFcnJvcihcIkF1dG9tYXRpYyBwdWJsaWNQYXRoIGlzIG5vdCBzdXBwb3J0ZWQgaW4gdGhpcyBicm93c2VyXCIpO1xuc2NyaXB0VXJsID0gc2NyaXB0VXJsLnJlcGxhY2UoLyMuKiQvLCBcIlwiKS5yZXBsYWNlKC9cXD8uKiQvLCBcIlwiKS5yZXBsYWNlKC9cXC9bXlxcL10rJC8sIFwiL1wiKTtcbl9fd2VicGFja19yZXF1aXJlX18ucCA9IHNjcmlwdFVybDsiLCJfX3dlYnBhY2tfcmVxdWlyZV9fLmIgPSBkb2N1bWVudC5iYXNlVVJJIHx8IHNlbGYubG9jYXRpb24uaHJlZjtcblxuLy8gb2JqZWN0IHRvIHN0b3JlIGxvYWRlZCBhbmQgbG9hZGluZyBjaHVua3Ncbi8vIHVuZGVmaW5lZCA9IGNodW5rIG5vdCBsb2FkZWQsIG51bGwgPSBjaHVuayBwcmVsb2FkZWQvcHJlZmV0Y2hlZFxuLy8gW3Jlc29sdmUsIHJlamVjdCwgUHJvbWlzZV0gPSBjaHVuayBsb2FkaW5nLCAwID0gY2h1bmsgbG9hZGVkXG52YXIgaW5zdGFsbGVkQ2h1bmtzID0ge1xuXHRcIm1haW5cIjogMFxufTtcblxuLy8gbm8gY2h1bmsgb24gZGVtYW5kIGxvYWRpbmdcblxuLy8gbm8gcHJlZmV0Y2hpbmdcblxuLy8gbm8gcHJlbG9hZGVkXG5cbi8vIG5vIEhNUlxuXG4vLyBubyBITVIgbWFuaWZlc3RcblxuLy8gbm8gb24gY2h1bmtzIGxvYWRlZFxuXG4vLyBubyBqc29ucCBmdW5jdGlvbiIsIl9fd2VicGFja19yZXF1aXJlX18ubmMgPSB1bmRlZmluZWQ7IiwiaW1wb3J0ICcuL3N0eWxlcy5jc3MnO1xuaW1wb3J0ICcuL21vZHVsZXMvR2FtZVNjcmVlbic7XG5pbXBvcnQgJy4vbW9kdWxlcy9QbGFjZVNoaXBzU2NyZWVuJztcbmltcG9ydCAnLi9tb2R1bGVzL1dpbm5lclNjcmVlbic7XG5pbXBvcnQgJy4vbW9kdWxlcy9NZW51U2NyZWVuJztcbiJdLCJuYW1lcyI6WyJHYW1lYm9hcmQiLCJjb21wdXRlcnNQcmV2QXR0YWNrQ29vcmQiLCJjb25zdHJ1Y3RvciIsImJvYXJkIiwiZ2V0TmV3Qm9hcmQiLCJzaGlwcyIsIiNnZXROZXdCb2FyZCIsIkFycmF5IiwiZmlsbCIsIm1hcCIsImdldFNoaXBDb29yZGluYXRlcyIsImNsaWNrZWRDb29yZCIsInNoaXBJbnN0YW5jZSIsImRpcmVjdGlvbiIsInkiLCJ4IiwibGVuZ3RoIiwiZ2V0TGVuZ3RoIiwiY29vcmRzIiwiaSIsInB1c2giLCJyZXNldEJvYXJkIiwicGxhY2VTaGlwIiwiaXNWYWxpZFBvc2l0aW9uIiwieUNvdW50IiwieENvdW50Iiwic2hpcCIsInN0ZXJuUG9zaXRvbiIsInByb3Bvc2VkU2hpcENvb3JkaW5hdGVzIiwiY29vcmRpbmF0ZXNWYWNhbmN5IiwiY29vcmQiLCJCb29sZWFuIiwic29tZSIsIm9jY3VwaWVkIiwicmVjZWl2ZUF0dGFjayIsInNxdWFyZSIsImF0dGFja1N0YXR1cyIsIk9iamVjdCIsImhhc093biIsImhpdCIsImdldEF0dGFja1N0YXR1cyIsImFsbFNoaXBzRG93biIsImFsbERvd24iLCJpc1N1bmsiLCJldmVyeSIsInN0YXR1cyIsImdldENvbXB1dGVyQXR0YWNrUmFuZG9tIiwiaXNQb3NpdGlvbk9wZW4iLCJNYXRoIiwiZmxvb3IiLCJyYW5kb20iLCJoYXNPYmoiLCJzZXRDb21wdXRlcnNQcmV2aW91c0F0dGFja0Nvb3JkIiwiZ2V0Q29tcHV0ZXJBdHRhY2tNZWRpdW0iLCJyZWZZIiwicmVmWCIsImNvb3JkQ2hhbmdlcyIsImFsbE5laWdoYm9yQ29vcmRzIiwiZm9yRWFjaCIsIl9yZWYiLCJjaGFuZ2VZIiwiY2hhbmdlWCIsIm5laWdoYm9yWSIsIm5laWdoYm9yWCIsIm9wZW5OZWlnaGJvckNvb3JkcyIsImZpbHRlciIsIl9yZWYyIiwicHJldmlvdXNseUhpdE5laWdoYm9ycyIsIl9yZWYzIiwiaGFzQXR0YWNrU3RhdHVzIiwiaW5kZXhDb3VudGVyIiwiY3VySGl0TmVpZ2hib3IiLCJjaGFuZ2VZRnJvbVJlZmVyZW5jZSIsImNoYW5nZVhGcm9tUmVmZXJlbmNlIiwib3Bwb3NpdGVOZWlnaGJvciIsIm9wcE5laWdoYm9yQ2FuQmVBdHRhY2tlZCIsInJhbmRvbU5laWdoYm9yQ29vcmQiLCJQbGF5ZXIiLCJuYW1lIiwiU2hpcCIsImhpdHMiLCJzZXRMZW5ndGgiLCIjc2V0TGVuZ3RoIiwiZ2V0SGl0cyIsImdldE5hbWUiLCJzZXREaXJlY3Rpb24iLCJkaXJlY3Rpb25TdHJpbmciLCJwbGFjZVNoaXBzU2NyZWVuIiwiZG9jdW1lbnQiLCJxdWVyeVNlbGVjdG9yIiwiZ2FtZVNjcmVlbiIsIndpbm5lclNjcmVlbiIsIm1lbnVTY3JlZW4iLCJwbGF5ZXJzIiwicGxheWVyIiwiZ2FtZWJvYXJkIiwiZW5lbXkiLCJnZXRFbmVteSIsInN3aXRjaEVuZW15IiwiZ2FtZURpZmZpY3VsdHkiLCJzZXRHYW1lRGlmZmljdWx0eSIsInN0cmluZyIsInBsYXlQbGF5ZXJBdHRhY2siLCJjb21wdXRlcnNBdHRhY2tDb29yZCIsInBsYXlDb21wdXRlckF0dGFjayIsImdldEdhbWVBbm5vdW5jZW1lbnQiLCJnZXRTdHJpbmdGb3JHYW1lQW5ub3VuY2VtZW50IiwiYXR0YWNrZWRDb29yZCIsImFyZ3VtZW50cyIsInVuZGVmaW5lZCIsImF0dGFja2VkU3F1YXJlIiwiYXR0YWNrZXIiLCJyZWNlaXZlciIsImhhc1NoaXAiLCJzaGlwTmFtZSIsImdldFJhbmRvbUNvb3JkIiwiXyIsImFkZFJhbmRvbVNoaXBQbGFjZW1lbnQiLCJzaGlwTmFtZXMiLCJzaGlwRGlyZWN0aW9uT3B0aW9ucyIsInJhbmRvbUNvb3JkIiwiYXQiLCJpc1ZhbGlkU2hpcFBsYWNlbWVudCIsInBvcCIsImRlbGF5IiwibXNlYyIsIlByb21pc2UiLCJyZXMiLCJzZXRUaW1lb3V0IiwiYW5ub3VuY2VtZW50RGl2Iiwic2hvd1NlbGVjdFNjcmVlbiIsImNsYXNzTGlzdCIsImFkZCIsInJlbW92ZSIsInVwZGF0ZUFubm91bmNlbWVudCIsInRleHRDb250ZW50Iiwic2hpcHNCb2FyZERpdiIsImF0dGFja3NCb2FyZERpdiIsInVwZGF0ZVNoaXBzQm9hcmQiLCJwbGF5ZXJCb2FyZCIsInJvdyIsInJvd0luZGV4IiwiY29sdW1uSW5kZXgiLCJidXR0b24iLCJjcmVhdGVFbGVtZW50IiwiYXBwZW5kQ2hpbGQiLCJ1cGRhdGVBdHRhY2tzQm9hcmQiLCJjb21wdXRlckJvYXJkIiwiYWRkRXZlbnRMaXN0ZW5lciIsImUiLCJzdG9wUHJvcGFnYXRpb24iLCJkYXRhc2V0IiwiZGlzYWJsZUF0dGFja3NCb2FyZCIsImVuYWJsZUF0dGFja3NCb2FyZCIsImhhbmRsZUF0dGFja3NCb2FyZENsaWNrIiwidGFyZ2V0U3F1YXJlIiwiZmlyc3RBbm5vdW5jZW1lbnQiLCJpbmNsdWRlcyIsInNlY29uZEFubm91bmNlbWVudCIsInRhcmdldCIsImluaXRpYWxpemVHYW1lU2NyZWVuQm9hcmRzIiwibmFtZUlucHV0IiwiZGlmZmljdWx0eUlucHV0Iiwic3RhcnRCdXR0b24iLCJoYW5kbGVTdGFydEJ1dHRvbkNsaWNrIiwicHJldmVudERlZmF1bHQiLCJ2YWx1ZSIsImNoYXJBdCIsInRvVXBwZXJDYXNlIiwic2xpY2UiLCJ0b2dnbGVEaXJlY3Rpb25CdXR0b24iLCJkcmFnZ2FibGVTaGlwc0NvbnRhaW5lciIsIm9yaWdpbmFsRHJhZ2dhYmxlU2hpcHMiLCJxdWVyeVNlbGVjdG9yQWxsIiwiYm9hcmRCb3JkZXJEaXYiLCJwbGFjZVNoaXBzQm9hcmREaXYiLCJwbGFjZVNoaXBCb2FyZEluc3RhbmNlIiwidXBkYXRlQm9hcmQiLCJjZWxsIiwiaWQiLCJyZW1vdmVBbGxTaGlwSG92ZXIiLCJjZWxscyIsImN1clNoaXBEaXJlY3Rpb24iLCJoYW5kbGVUb2dnbGVEaXJlY3Rpb25DbGljayIsIm5vZGUiLCJ3aWR0aCIsImhlaWdodCIsInN0eWxlIiwic2V0QXR0cmlidXRlIiwiY3VyRHJhZ2dlZFNoaXBMZW5ndGgiLCJoYW5kbGVEcmFnU3RhcnQiLCJvYmoiLCJkYXRhVHJhbnNmZXIiLCJzZXREYXRhIiwiSlNPTiIsInN0cmluZ2lmeSIsInNldERyYWdJbWFnZSIsImdldEhvdmVyTm9kZXMiLCJhbGxDZWxscyIsImNlbGxOb2RlcyIsImZpcnN0Q2VsbFgiLCJjb25zdGFudFkiLCJsYXN0Q2VsbFgiLCJmaXJzdENlbGxZIiwiY29uc3RhbnRYIiwibGFzdENlbGxZIiwiaGFuZGxlRHJhZ0VuZCIsImhhbmRsZURyYWdPdmVyIiwiZHJvcEVmZmVjdCIsImhhbmRsZURyb3AiLCJwYXJzZSIsImdldERhdGEiLCJvcmlnaW5hbFNoaXBOb2RlIiwiZnJvbSIsImZpbmQiLCJyZW1vdmVDaGlsZCIsImNoaWxkcmVuIiwiaGFuZGxlRHJhZ0VudGVyIiwiaGFuZGxlRHJhZ0VudGVyQm9hcmRCb3JkZXIiLCJhZGRTaGlwc0RyYWdFdmVudEhhbmRsZXJzIiwiYWRkQm9hcmREcmFnRXZlbnRIYW5kbGVycyIsInBsYXlBZ2FpbkJ1dHRvbiIsIndpbmRvdyIsImxvY2F0aW9uIiwicmVsb2FkIl0sInNvdXJjZVJvb3QiOiIifQ==