import React from 'react';
import { Menu, Game } from './components';

const App = () => {
  const [StartGame, updateStartGame] = React.useState(false);
  const [Players, updatePlayers] = React.useState(1);
  const [Guesser, updateGuesser] = React.useState<[number, number]>([1, 2]);

  const restart = (status: boolean) => {
    updateStartGame(status);
    if (Players === 1) return;
    updateGuesser([ Guesser[1], Guesser[0] ]);
  };

  return !StartGame ? 
    <Menu updatePlayers={updatePlayers} updateStartGame={updateStartGame} /> 
    : 
    <Game players={Players} guesser={Guesser} restart={restart} />;
}

export default App;
