const MainMenu = ({ startNewGame }: { startNewGame: () => void }) => {
  return (
    <div>
      <DifficultySelector />
      <br />
      <Button outlined onClick={startNewGame}>
        START GAME <PlayIcon />
      </Button>
    </div>
  );
};

export default MainMenu;

import { PlayIcon } from "@radix-ui/react-icons";
import DifficultySelector from "components/DifficultySelector";
import Button from "./Button";
