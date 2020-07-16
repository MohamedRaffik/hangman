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
    <div className="menu">
      <h1 className="menu-heading">Hangman</h1>
      <Hangman errors={6} />
      <div className="menu-options">
        <h2 className="menu-option" onClick={() => onOptionSelect(1)}>One Player</h2>
        <h2 className="menu-option" onClick={() => onOptionSelect(2)}>Two Players</h2>
      </div>
    </div>
  );
};