import React from 'react';
import { Hangman } from './Hangman';

interface GameProps {
  players: number;
  guesser: [number, number];
  restart: (status: boolean) => void;
}

export const Game = (props: GameProps) => {
  const [ErrorCount, updateErrorCount] = React.useState(0);
  const [Word, updateWord] = React.useState('');
  const [SelectedLetters, updateSelectedLetters] = React.useState<{ [letter: string]: boolean }>({});
  const [StatusMessage, updateStatusMessage] = React.useState('');
  const [GameOver, updateGameOver] = React.useState(false);

  const AllLetters = React.useMemo(() => {
    const a = [];
    for (let i = 0; i < 26; i++) {
      a.push(String.fromCharCode('A'.charCodeAt(0) + i));
    }
    return a;
  }, []);

  const Letters = React.useMemo(() => {
    const a = [];
    for (const letter of Word) {
      a.push(letter);
    }
    return a;
  }, [Word]);

  const setWord = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const word = String((e.currentTarget.elements[0] as HTMLInputElement).value).toUpperCase();
    if (word.length === 0) {
      return;
    }
    updateWord(word);
  };

  const selectLetter = (letter: string) => {
    if (Word.indexOf(letter) === -1) {
      updateErrorCount(ErrorCount + 1);
      updateStatusMessage(`${letter} is not in the phrase !`);
    } else {
      updateStatusMessage(`${letter} is in the phrase !`)
    }
    updateSelectedLetters({ ...SelectedLetters, [letter]: true });
  }

  const getWord = async () => {
    try {
      const response = await fetch('/randomword');
      if (response.status !== 200) {
        updateWord('SORRY WAS NOT ABLE TO GET RANDOM PHRASE');
      }
      const data = await response.json();
      updateWord(data.word.toUpperCase());  
    } catch (err) {
      console.log(err);
      updateWord('SORRY WAS NOT ABLE TO GET RANDOM PHRASE');
    }
  }

  React.useEffect(() => {
    if (props.players === 1) {
      getWord();
    }
  }, []);

  React.useEffect(() => {
    if (ErrorCount === 6) {
      updateStatusMessage(props.players === 1 ? 'You Lost !' : `Player ${props.guesser[1]} Lost !`);
      updateGameOver(true);
      return;
    }
    if (Word.length !== 0) {
      for (const letter of Word) {
        if (!SelectedLetters[letter] && ('A'.charCodeAt(0) <= letter.charCodeAt(0) && letter.charCodeAt(0) <= 'Z'.charCodeAt(0))) return;
      }
      updateStatusMessage(props.players === 1 ? 'You Won !' : `Player ${props.guesser[1]} Won !`);
      updateGameOver(true);  
    }
  }, [ErrorCount, props.players, props.guesser, SelectedLetters, Word])

  const WordSelect = React.useCallback(() => (
    <div>
      <div style={{ display: 'flex', flexDirection: 'row', alignContent: 'center' }}>
        <div style={{ margin: '1em', marginRight: '4em' }}>
          <h2>Player {props.guesser[0]}</h2> 
          <h2>Enter in a Word: </h2>
          <form onSubmit={setWord} style={{ display: 'flex', flexDirection: 'row' }}>
            <input style={{ height: '2em', width: '20em' }}></input>  
            <button>Enter</button>
          </form>
        </div>  
        <div style={{ margin: '1em', marginLeft: '4em' }}>
          <h2>Player {props.guesser[1]}</h2>
          <h2>LOOK AWAY FROM THE SCREEN !!!</h2>  
        </div>
      </div>
    </div>
  ), [props.guesser]);

  const SingleWord = (word: string[]) => {
    const DisplayLetter = (letter: string) => {
      if (SelectedLetters[letter] && ('A'.charCodeAt(0) <= letter.charCodeAt(0) && letter.charCodeAt(0) <= 'Z'.charCodeAt(0))) {
        return true;
      } else if (!('A'.charCodeAt(0) <= letter.charCodeAt(0) && letter.charCodeAt(0) <= 'Z'.charCodeAt(0))) {
        return true;
      } else if (GameOver) {
        return true;
      }
      return false;
    };

    return word.map((letter, index) => (
      <h2 
        className="word-display" 
        key={'X' + index} 
        style={{ 
          color: DisplayLetter(letter) ? 'black' : 'white', 
          borderBottom: letter === ' ' ? 'white 1px solid' : 'black 1px solid' 
        }}
      >
        { DisplayLetter(letter) ? letter : 'X' }
      </h2>
    ));
  };

  const WordDisplay = React.useCallback(() => {
    const Words = [];
    let last_empty = -1;
    for (let i = 0; i < Letters.length; i++) {
      const letter = Letters[i];
      if (letter === ' ') {
        Words.push([...Letters.slice(last_empty + 1, i), ' ']);
        last_empty = i;
      }
    }
    Words.push([...Letters.slice(last_empty + 1, Letters.length), ' ']);
    console.log(Words);
    return (
      <div className="word-display-container">
        {
          Words.map((word, index) => (
            <div key={'S' + index} style={{ display: 'flex', flexDirection: 'row' }}>
              { SingleWord(word) }
            </div>
          ))
        }
      </div>
    );
  }, [SelectedLetters, Letters, GameOver]);

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
        className="letter-select" 
        key={'select' + letter}
        style={{ textDecoration: SelectedLetters[letter] ? 'line-through' : '', color: color(letter) }} 
        onMouseOver={(e) => {
          if (color(letter) === 'black') {
            e.currentTarget.style.color = 'grey';
          }
        }}
        onMouseLeave={(e) => {
          if (color(letter) === 'black') {
            e.currentTarget.style.color = 'black';
          }
        }}
        onClick={() => SelectedLetters[letter] || GameOver ? null : selectLetter(letter)}
      >
        {letter}
      </h3>
    ));
    return (
      <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center' }}>
        {e}
      </div>
    );
  };

  return (
    <div className="menu" onClick={() => GameOver ? props.restart(false) : null }>
      <h1 className="menu-heading">Hangman</h1>
      <p style={{ height: '0.5em' }}>{ StatusMessage }</p>
      <p style={{ height: '0.5em' }}>{ GameOver ? 'Click Anywhere to Return to the Menu' : '' }</p>
      <Hangman errors={ErrorCount} />
      {
        Word.length === 0  && props.players !== 1 ? 
        <WordSelect /> 
        :
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <WordDisplay />
          <LetterSelector />
        </div>
      }
    </div>
  )
};