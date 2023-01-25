const rows = 4;
const cols = 5;
const bombs = 2;

import { useEffect, useState } from "react";
import {
  createBoardWithJustNumbers,
  singleToMultiDimentionalArray,
} from "../lib/utils";

export const Game = () => {
  const createMirrorBoard = () => {
    return singleToMultiDimentionalArray(
      new Array(rows * cols).fill(false),
      cols
    );
  };
  const [board, setBoard] = useState(null);
  const [flags, setFlags] = useState<boolean[][]>(createMirrorBoard());
  const [revealedCells, setRevealedCells] = useState<boolean[][]>(
    createMirrorBoard()
  );

  useEffect(() => {
    console.table(board);
  }, [board]);

  return (
    <>
      <button
        onClick={() => {
          setBoard(createBoardWithJustNumbers(rows, cols, bombs));
          setFlags(createMirrorBoard());
          setRevealedCells(createMirrorBoard());
        }}
      >
        Play
      </button>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${cols}, 1fr)`,
          gridTemplateRows: `repeat(${rows}, 1fr)`,
          gap: "2px",
        }}
      >
        {board &&
          board.map((row, y) =>
            row.map((cell, x) => (
              <button
                key={`cell-${x}-${y}`}
                // onClick={() => {
                //   console.log("clicked", x, y);
                //   const newRevealedCells = [...revealedCells];
                //   newRevealedCells[y][x] = !newRevealedCells[y][x];
                //   setRevealedCells(newRevealedCells);
                // }}
                onContextMenu={(e) => {
                  e.preventDefault();
                }}
                // Flags should be on press, things that reveal (reveal, chord) should be on release. This allows for 1.5 clicks where you flag a bomb and chord the numbers around it.
                onMouseDown={(e) => {
                  const { buttons, button } = e;
                  // console.log({ buttons, button });

                  // TODO: validate behavior with players; doesn't allow flagging if left click is pressed.
                  if (buttons === 2) {
                    console.log("flag", x, y);
                    const temp = [...flags];
                    temp[y][x] = true;
                    setFlags(temp);
                  }
                }}
                onMouseUp={(e) => {
                  const { buttons, button } = e;
                  // console.log({ buttons, button });
                  if (button == 0 && buttons === 2) {
                    console.log("chord", x, y);
                  }
                  if (button == 0 && buttons === 0) {
                    console.log("reveal", x, y);
                    const temp = [...revealedCells];
                    temp[y][x] = true;
                    setRevealedCells(temp);
                  }
                }}
                style={{
                  width: "100%",
                  height: "100%",
                  backgroundColor: revealedCells[y][x]
                    ? "blueviolet"
                    : "hotpink",
                  borderWidth: "2px",
                  borderStyle: "solid",
                  borderColor: flags[y][x] ? "blueviolet" : "hotpink",
                }}
              >
                {cell === 9 ? "*" : cell > 0 ? cell : null}
              </button>
            ))
          )}
      </div>
    </>
  );
};
