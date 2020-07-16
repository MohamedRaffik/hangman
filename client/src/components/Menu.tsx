import React from 'react';
import { Hangman } from './Hangman';

interface MenuProps {
  updatePlayers: React.Dispatch<React.SetStateAction<number>>;
  updateStartGame: React.Dispatch<React.SetStateAction<boolean>>;
};

export const Menu = (props: MenuProps) => {

  const onOptionSelect = (players: number) => {
    props.updatePlayers(players);
    props.updateStartGame(true);
  }

  return (
    <div id="menu">
      <h1 id="menu-heading">Hangman</h1>
      <Hangman errors={6} />
      <div id="menu-options">
        <h2 id="menu-option" onClick={() => onOptionSelect(1)}>One Player</h2>
        <h2 id="menu-option" onClick={() => onOptionSelect(2)}>Two Players</h2>
      </div>
    </div>
  );
};