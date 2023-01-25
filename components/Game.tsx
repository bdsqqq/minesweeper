const rows = 4;
const cols = 5;
const bombs = 2;

import { GearIcon, BookmarkIcon } from "@radix-ui/react-icons";
import { useEffect, useState } from "react";
import { keyframes, styled } from "stitches.config";
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

  const reveal = (x: number, y: number) => {
    const temp = [...revealedCells];
    temp[y][x] = true;
    setRevealedCells(temp);
  };
  const flag = (x: number, y: number) => {
    const temp = [...flags];
    temp[y][x] = !temp[y][x];
    setFlags(temp);
  };

  const chord = (x: number, y: number) => {
    // checks around, depress unrevealed squares around;

    const value = board[y][x];
    console.log(value);

    const cells: { x: number; y: number }[] = [];

    for (let r = -1; r <= 1; r++) {
      for (let c = -1; c <= 1; c++) {
        if (r == 0 && c == 0) continue;
        let checking_row = y + r;
        let checking_col = x + c;

        if (
          // checking_row and checking_col are inside the board
          checking_row < 0 ||
          checking_row > board.length - 1 ||
          checking_col < 0 ||
          checking_col > board[0].length - 1
        )
          continue;

        cells.push({
          x: checking_col,
          y: checking_row,
        });

        // document.getElementById(
        //   `cell-${checking_col}-${checking_row}`
        // ).style.backgroundColor = "#ccc";
      }
    }

    const unrevealedNeighbors = cells.filter(
      (cell) => !revealedCells[cell.y][cell.x]
    );
    const flaggedNeighbors = cells.filter((cell) => flags[cell.y][cell.x]);

    if (flaggedNeighbors.length === value) {
      // TODO: if a flag is misplaced, this reveals a bomb, look into the rules
      cells.forEach((cell) => {
        if (
          !flaggedNeighbors.includes(cell) ||
          !unrevealedNeighbors.includes(cell)
        ) {
          reveal(cell.x, cell.y);
        }
      });
    }
  };

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
          width: "fit-content",
          display: "grid",
          gridTemplateColumns: `repeat(${cols}, 1fr)`,
          gridTemplateRows: `repeat(${rows}, 1fr)`,
          gap: "2px",
        }}
      >
        {board &&
          board.map((row, y) =>
            row.map((cell, x) => (
              <Box key={`cell-${x}-${y}`}>
                <Cell
                  variant={
                    revealedCells[y][x]
                      ? "revealed"
                      : flags[y][x]
                      ? "flagged"
                      : "hidden"
                  }
                  style={{ WebkitTapHighlightColor: "transparent" }}
                  id={`cell-${x}-${y}`}
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
                      if (revealedCells[y][x]) return;
                      // console.log("flag", x, y);
                      flag(x, y);
                    }
                  }}
                  onMouseUp={(e) => {
                    const { buttons, button } = e;
                    // console.log({ buttons, button });
                    if (button == 0 && buttons === 2) {
                      // console.log("chord", x, y);
                      chord(x, y);
                    }
                    if (button == 0 && buttons === 0) {
                      if (flags[y][x]) return;
                      // console.log("reveal", x, y);
                      reveal(x, y);
                    }
                  }}
                >
                  {revealedCells[y][x] ? (
                    cell === 9 ? (
                      <GearIcon width="30" height="30" />
                    ) : (
                      cell > 0 && cell
                    )
                  ) : flags[y][x] ? (
                    <BookmarkIcon width="30" height="30" />
                  ) : (
                    " "
                  )}
                </Cell>
              </Box>
            ))
          )}
      </div>
    </>
  );
};

const Box = styled("div", {
  position: "relative",
  zIndex: "1",

  width: "3rem",
  height: "3rem",
});

const reveal = keyframes({
  "0%": {
    transform: "scale(1)",
    color: "transparent",
    backgroundColor: "$primary",
  },
  "50%": {
    transform: "scale(1.2)",
    color: "transparent",
    backgroundColor: "$primary",
  },
  "100%": { transform: "scale(.9)", color: "$text" },
});

const Cell = styled("div", {
  //position and zindex so this is displayed above the grid lines
  position: "relative",
  zIndex: "1",
  border: "2px solid transparent",

  borderRadius: "2px",
  width: "100%",
  height: "100%",
  color: "$text",
  userSelect: "none",

  display: "flex",
  alignItems: "center",
  justifyContent: "center",

  "&:focus-visible": {
    outline: "none",
    borderColor: "$mauve12",
    transform: "scale(0.8)",
  },

  "@motion": {
    transitionDuration: "150ms",
    transitionTimingFunction: "cubic-bezier(0.4, 0.14, 0.3, 1)",

    animationTimingFunction: "cubic-bezier(0.4, 0.14, 0.3, 1)",
  },

  variants: {
    variant: {
      revealed: {
        "@motion": {
          animation: `${reveal} 170ms`,
        },
      },
      hidden: {
        cursor: "pointer",
        transform: "scale(1.1)",
        borderRadius: "3px",
        backgroundColor: "$primary",

        "&:focus-visible": {
          transform: "scale(0.8)",
          backgroundColor: "$primaryFocus",
        },
      },
      flagged: {
        transform: "scale(0.8)",
        backgroundColor: "$flagged",
        color: "$flagColor",
      },
    },
    bomb: {
      true: {},
    },
  },

  compoundVariants: [
    {
      variant: "revealed",
      bomb: true,
      css: {
        transform: "scale(0.8)",
        backgroundColor: "$bombBackground",
        borderRadius: "2px",
      },
    },
  ],
});
