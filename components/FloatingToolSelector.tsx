const FloatingToolSelector = () => {
  const { currentTool, setCurrentTool } = useToolStore();
  const { isVisible, autoMode, show, hide } = useToolbarVisibilityStore();

  const toggleCurrentTool = () => {
    if (currentTool == "DIG") {
      setCurrentTool(toolOptionsEnum.FLAG);
      return;
    }
    if (currentTool == "FLAG") {
      setCurrentTool(toolOptionsEnum.DIG);
      return;
    }
  };

  useEffect(() => {
    if (!autoMode) return;
    show();
    const clear = setTimeout(() => {
      hide();
    }, 3000);
    return () => {
      clearTimeout(clear);
    };
  }, [currentTool, autoMode]);

  useKeyboardShortcut(["x"], toggleCurrentTool, {
    overrideSystem: true,
    repeatOnHold: false,
  });

  return (
    <RadioGroup
      onValueChange={(value: Tool) => {
        setCurrentTool(value);
      }}
      css={{
        visibility: isVisible ? "visible" : "hidden",
      }}
      value={currentTool}
      aria-label="Tool selector"
    >
      <RadioGroupItem
        selected={currentTool === "DIG"}
        value={toolOptionsEnum.DIG}
        aria-label="Dig tool"
      >
        <Crosshair2Icon />
      </RadioGroupItem>
      <RadioGroupItem
        selected={currentTool === "FLAG"}
        value={toolOptionsEnum.FLAG}
        aria-label="Flag tool"
      >
        <BookmarkIcon />
      </RadioGroupItem>
    </RadioGroup>
  );
};

const StyledRadioGroup = styled(RadioGroupPrimitive.Root, {
  position: "absolute",
  zIndex: "10",
  bottom: "1rem",
  left: "50%",
  transform: "translate(-50%)",

  display: "inline-flex",
  padding: "0.5rem",
  gap: "0.5rem",
  justifyContent: "center",
  alignItems: "center",

  backgroundColor: "$mauve3",
  borderWidth: "1px",
  borderRadius: "3px",
  borderStyle: "solid",
  borderColor: "$mauve6",
});

const StyledItem = styled(RadioGroupPrimitive.Item, {
  all: "unset",
  outline: "none",
  cursor: "pointer",

  color: "$mauve11",

  backgroundColor: "$mauve3",

  $$borderColor: "$colors$mauve7",
  $$borderWidth: "1px",
  boxShadow: `0 0 0 $$borderWidth $$borderColor`,

  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  borderRadius: "2px",
  height: "3rem",
  width: "3rem",

  "@motion": {
    transitionDuration: "150ms",
    transitionTimingFunction: "cubic-bezier(0.4, 0.14, 0.3, 1)",
  },

  "&:hover": {
    $$borderColor: "$colors$mauve8",
    backgroundColor: "$mauve4",
  },
  "&:focus": {
    $$borderColor: "$colors$crimson8",
    backgroundColor: "$mauve5",
    outline: "none",
  },

  variants: {
    selected: {
      true: {
        color: "$crimson12",

        $$borderColor: "$colors$crimson7",
        $$borderWidth: "2px",
        backgroundColor: "$mauve5",

        "&:hover": { $$borderColor: "$colors$crimson8" },
      },
    },
  },
});

const RadioGroup = StyledRadioGroup;
const RadioGroupItem = StyledItem;

export default FloatingToolSelector;

import * as RadioGroupPrimitive from "@radix-ui/react-radio-group";
import { styled } from "stitches.config";
import {
  Tool,
  toolOptionsEnum,
  useToolbarVisibilityStore,
  useToolStore,
} from "../lib/store";
import { Crosshair2Icon, BookmarkIcon } from "@radix-ui/react-icons";
import useKeyboardShortcut from "lib/hooks/useKeyboardShortcut";
import { useEffect } from "react";
