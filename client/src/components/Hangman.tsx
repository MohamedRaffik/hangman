import React from 'react';

interface HangmanProps {
  errors: number;
}

export const Hangman = (props: HangmanProps) => {
  const visibleParts = React.useMemo(() => {
    const bodyParts = [
      <line key={1} x1={'45%'} y1={'15%'} x2={'45%'} y2={'5%'} stroke={'black'}></line>,
      <line key={2} x1={'45%'} y1={'5%'} x2={'60%'} y2={'5%'} stroke={'black'}></line>,
      <line key={3} x1={'60%'} y1={'5%'} x2={'60%'} y2={'95%'} stroke={'black'}></line>,
      <line key={4} x1={'50%'} y1={'95%'} x2={'70%'} y2={'95%'} stroke={'black'}></line>,
      <circle key={5} className="part" cx={'45%'} cy={'20%'} r={'5%'} fill={'white'} stroke={'black'}></circle>,
      <line key={6} className="part" x1={'45%'} y1={'28%'} x2={'45%'} y2={'70%'} stroke={'black'}></line>,
      <line key={7} className="part" x1={'45%'} y1={'40%'} x2={'50%'} y2={'45%'} stroke={'black'}></line>,
      <line key={8} className="part" x1={'45%'} y1={'40%'} x2={'40%'} y2={'45%'} stroke={'black'}></line>,
      <line key={9} className="part" x1={'45%'} y1={'70%'} x2={'40%'} y2={'85%'} stroke={'black'}></line>,
      <line key={10} className="part" x1={'45%'} y1={'70%'} x2={'50%'} y2={'85%'} stroke={'black'}></line>,
    ];
    return bodyParts.slice(0, 4 + props.errors)
  }, [props.errors]);

  return (
    <svg width={'42em'} height={'22em'}>
      {visibleParts}
    </svg>
  );
};