import { menuScreen } from './DOMscreens';
import {
  players,
  setGameDifficulty,
  showSelectScreen,
  updateAnnouncement,
} from './GameController';

const nameInput = menuScreen.querySelector('#name');
const difficultyInput = menuScreen.querySelector('#difficulty');
const startButton = menuScreen.querySelector('.start');

const handleStartButtonClick = (e) => {
  e.preventDefault();

  // set game data
  const name = nameInput.value;
  players[0].player.name = name;
  setGameDifficulty(difficultyInput.value);

  // change screen
  showSelectScreen('place ships');
  updateAnnouncement(
    `${name.charAt(0).toUpperCase() + name.slice(1)}, place your ships`,
  );
};
startButton.addEventListener('click', (e) => handleStartButtonClick(e));
