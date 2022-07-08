import React, { useEffect, useState } from 'react';

export type Cell = {
  color: string;
  checked: boolean;
  skipped: boolean;
  correct: boolean;
};

export type Board = Cell[][];

function App() {
  const [board, setBoard] = useState<Board>([]);
  const [horizontalHints, setHorizontalHints] = useState<number[][]>([]);
  const [verticalHints, setVerticalHints] = useState<number[][]>([]);
  const [size, setSize] = useState(50);

  useEffect(() => {
    let hints: number[][] = [];
    for (let i = 0; i < board.length; i++) {
      let run = 0;
      let hint: number[] = [];
      for (let j = 0; j < board[i].length; j++) {
        if (board[i][j].correct) {
          run++;
        } else if (run !== 0) {
          hint.push(run);
          run = 0;
        }
      }
      if (run !== 0) hint.push(run);
      hints.push(hint.length === 0 ? [0] : hint);
    }
    setHorizontalHints(hints);

    hints = [];
    if (board.length > 0) {
      for (let i = 0; i < board[0].length; i++) {
        let run = 0;
        let hint: number[] = [];
        for (let j = 0; j < board.length; j++) {
          if (board[j][i].correct) {
            run++;
          } else if (run !== 0) {
            hint.push(run);
            run = 0;
          }
        }
        if (run !== 0) hint.push(run);
        hints.push(hint.length === 0 ? [0] : hint);
      }
    }
    setVerticalHints(hints);
  }, [board]);

  const setColors = (colors: string[][]) => {
    const b: Board = [];
    for (let i = 0; i < colors.length; i++) {
      b.push([]);
      for (let j = 0; j < colors[i].length; j++) {
        b[i].push({
          color: colors[i][j],
          checked: false,
          skipped: false,
          correct: colors[i][j] !== '#00000000',
        });
      }
    }
    setBoard(b);
  };

  useEffect(() => {
    //'#eb7221' '#3685cf' '#6babeb'
    // prettier-ignore
    const colors = [
      ['#00000000','#00000000','#00000000','#00000000','#6babeb','#00000000','#00000000','#00000000','#00000000','#00000000'],
      ['#00000000','#00000000','#00000000','#00000000','#6babeb','#00000000','#00000000','#00000000','#00000000','#00000000'],
      ['#00000000','#00000000','#00000000','#00000000','#6babeb','#00000000','#00000000','#00000000','#00000000','#00000000'],
      ['#00000000','#eb7221','#00000000','#3685cf','#3685cf','#3685cf','#00000000','#eb7221','#00000000','#00000000'],
      ['#00000000','#00000000','#eb7221','#3685cf','#3685cf','#3685cf','#eb7221','#00000000','#00000000','#00000000'],
      ['#00000000','#eb7221','#00000000','#3685cf','#3685cf','#3685cf','#00000000','#eb7221','#00000000','#00000000'],
      ['#00000000','#00000000','#00000000','#00000000','#6babeb','#00000000','#00000000','#00000000','#00000000','#00000000'],
      ['#00000000','#00000000','#00000000','#6babeb','#6babeb','#6babeb','#00000000','#00000000','#00000000','#00000000'],
      ['#00000000','#00000000','#3685cf','#6babeb','#6babeb','#6babeb','#3685cf','#00000000','#00000000','#00000000'],
      ['#00000000','#00000000','#3685cf','#3685cf','#00000000','#3685cf','#3685cf','#00000000','#00000000','#00000000']];
    setColors(colors);
  }, []);

  return (
    <div
      style={{
        height: '100vh',
        width: '100vw',
        backgroundColor: '#76a1cc',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <div style={{ marginLeft: -size * 10, marginTop: -size * 10 }}>
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'flex-end',
            marginLeft: size * 10,
          }}
        >
          {verticalHints.map((hints, j) => (
            <div
              style={{
                width: size,
                height: size * 10,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'flex-end',
              }}
            >
              {verticalHints[j].map((hint, i) => (
                <div
                  key={`vhint-${i}-${j}`}
                  style={{
                    width: size,
                    marginBottom: 10,
                    textAlign: 'center',
                  }}
                >
                  {hint}
                </div>
              ))}
            </div>
          ))}
        </div>
        {board.map((row, i) => (
          <div
            key={i}
            style={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <div
              style={{
                width: size * 10,
                height: size,
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'flex-end',
              }}
            >
              {horizontalHints[i] &&
                horizontalHints[i].map((hint, j) => (
                  <div key={`hhint-${i}-${j}`} style={{ marginRight: 10 }}>
                    {hint}
                  </div>
                ))}
            </div>
            {row.map((cell, j) => (
              <div
                onClick={(e) => {
                  e.preventDefault();
                  let newBoard: Board = [];
                  Object.assign(newBoard, board);
                  newBoard[i][j].checked = !newBoard[i][j].checked;
                  newBoard[i][j].skipped = false;
                  setBoard(newBoard);
                }}
                onContextMenu={(e) => {
                  e.preventDefault();
                  let newBoard: Board = [];
                  Object.assign(newBoard, board);
                  newBoard[i][j].skipped = !newBoard[i][j].skipped;
                  newBoard[i][j].checked = false;
                  setBoard(newBoard);
                }}
                key={`${i}-${j}`}
                style={{
                  width: size - 2,
                  height: size - 2,
                  backgroundColor: cell.checked
                    ? cell.correct
                      ? cell.color
                      : '#ff0000'
                    : cell.skipped
                    ? '#00000000'
                    : '#00000044',
                  border: '1px solid #00000088',
                }}
              ></div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
