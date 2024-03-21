import { menuScreen } from './DOMscreens';
import {
  players,
  showSelectScreen,
  updateAnnouncement,
} from './GameController';

const nameInput = menuScreen.querySelector('#name');
const difficultyInput = menuScreen.querySelector('#difficulty');
const startButton = menuScreen.querySelector('.start');

const handleStartButtonClick = (e) => {
  e.preventDefault();
  const name = nameInput.value;
  players[0].player.name = name;

  // TODO: make difficulty selection functional
  const difficulty = difficultyInput.value;

  showSelectScreen('place ships');
  updateAnnouncement(
    `${name.charAt(0).toUpperCase() + name.slice(1)}, place your ships`,
  );
};
startButton.addEventListener('click', (e) => handleStartButtonClick(e));
