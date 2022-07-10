const Playground = () => {
  return (
    <div>
      <GameHandler gameOptions={{ bombNumber: 10, dimSize: 10 }} />
    </div>
  );
};

const GameHandler = ({
  gameOptions,
}: {
  gameOptions: {
    bombNumber: number;
    dimSize: number;
  };
}) => {
  const gameState = useState("PRISTINE");
  const [board, setBoard] = useState(null);

  useEffect(() => {
    setBoard(
      createBoardWithJustNumbers(gameOptions.dimSize, gameOptions.bombNumber)
    );

    console.table(board);
  }, [gameOptions]);

  return <div></div>;
};

const Cell = () => {
  return <div></div>;
};

// STYLES

const Row = styled("div", {
  display: "flex",
  gap: "2px",

  /* Add bottom border for all boxes except the last row */
  "&:not(:last-child) > *::after": {
    zIndex: "0",
    content: "",
    position: "absolute",
    bottom: "-2px",
    width: "50%",
    left: "25%",
    height: "2px",
    backgroundColor: "$border",
  },

  /* Add right border for all indexed boxes except last one */
  "& > *:not(:last-child):before": {
    zIndex: "0",
    content: "",
    position: "absolute",
    right: "-2px",
    height: "50%",
    top: "25%",
    width: "2px",
    backgroundColor: "$border",
  },
});

export default Playground;

import { createBoardWithJustNumbers } from "lib/utils";
import { useEffect, useState } from "react";
import { styled } from "stitches.config";
