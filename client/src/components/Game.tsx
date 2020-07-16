import React from 'react';
import { Hangman } from './Hangman';

interface GameProps {
  players: number;
  guesser: number;
  restart: (status: boolean) => void;
}

export const Game = (props: GameProps) => {
  const [ErrorCount, updateErrorCount] = React.useState(0);
  const [Word, updateWord] = React.useState('');
  const [SelectedLetters, updateSelectedLetters] = React.useState<{ [letter: string]: boolean }>({});
  const [StatusMessage, updateStatusMessage] = React.useState('');

  React.useEffect(() => {
    if (props.players === 1) {
      updateWord('TESTING');
    }
  }, []);

  React.useEffect(() => {
    if (ErrorCount === 6) {
      updateStatusMessage(props.players === 1 ? 'You Lost' : `Player ${props.guesser + 1 % 2} Lost`);
    }
  }, [ErrorCount, props.players, props.guesser])

  const setWord = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const word = String((e.currentTarget.elements[0] as HTMLInputElement).value).toUpperCase();
    if (word.length === 0) {
      return;
    }
    updateWord(word);
  };

  const selectLetter = (letter: string) => {
    console.log(letter, Word);
    if (Word.indexOf(letter) === -1) {
      updateErrorCount(ErrorCount + 1);
      updateStatusMessage(`${letter} is not in the word !`);
    } else {
      updateStatusMessage(`${letter} is in the word !`)
    }
    updateSelectedLetters({ ...SelectedLetters, [letter]: true });
  }

  const Letters = React.useMemo(() => {
    const a = [];
    for (const letter of Word) {
      a.push(letter);
    }
    return a;
  }, [Word]);

  const AllLetters = React.useMemo(() => {
    const a = [];
    for (let i = 0; i < 26; i++) {
      a.push(String.fromCharCode('A'.charCodeAt(0) + i));
    }
    return a;
  }, []);

  const WordSelect = React.useCallback(() => (
    <div>
      <div style={{ display: 'flex', flexDirection: 'row'}}>
        <div style={{ padding: '5em' }}>
          <h2>Player {props.guesser}</h2> 
          <h2>Enter in a Word: </h2>
          <form onSubmit={setWord}>
            <input name="word" style={{height: '2em', width: '20em'}}></input>  
            <button>Enter</button>
          </form>
        </div>  
        <div style={{ padding: '5em' }}>
          <h2>Player {props.guesser + 1 % 2}</h2>
          <h2>LOOK AWAY FROM THE SCREEN !!!</h2>  
        </div>
      </div>
    </div>
  ), [props.guesser]);

  const WordDisplay = React.useCallback(() => {
    const e = Letters.map((letter, index) => (
      <p className="word-display" key={'X' + index} style={{ color: SelectedLetters[letter] ? 'black' : 'white' }}>
        { SelectedLetters[letter] ? letter : 'X' }
      </p>
    ));
    return (
      <div className="word-display-container">
        {e}
      </div>
    );
  }, [SelectedLetters, Letters]);

  const LetterSelector = () => {
    const color = (letter: string) => {
      if (SelectedLetters[letter] && Word.indexOf(letter) === -1) {
        return 'red';
      } else if (SelectedLetters[letter]) {
        return 'green';
      }
      return 'black'
    };
    const e = AllLetters.map(letter => (
      <h3 
        id="menu-option" 
        key={'select' + letter}
        style={{ textDecoration: SelectedLetters[letter] ? 'line-through' : '', color: color(letter)}} 
        onClick={() => SelectedLetters[letter] ? null : selectLetter(letter)}
      >
        {letter}
      </h3>
    ));
    return (
      <div style={{ display: 'flex', flexDirection: 'row' }}>
        {e}
      </div>
    );
  };

  return (
    <div id="menu" onClick={() => ErrorCount === 6 ? props.restart(false) : null }>
      <h1 id="menu-heading">Hangman</h1>
      <p style={{ height: '1em' }}>{ StatusMessage }</p>
      <Hangman errors={ErrorCount} />
      {
        Word.length === 0 ? 
        <WordSelect /> 
        :
        <div>
          <WordDisplay />
          <LetterSelector />
        </div>
      }
    </div>
  )
};