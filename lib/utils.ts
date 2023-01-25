export const create_board = (
  height: number,
  width: number,
  bomb_number: number
) => {
  // create an array with the amount of cells the board will have
  let board_array = new Array(height * width).fill(" _h");

  // put the bombs in the board
  board_array.fill("*_h", 0, bomb_number);

  // suffle the board to distribute the bombs
  board_array = fisherYatesShuffle(board_array);

  // create a two dimentional array `board` from the suffled board
  let board = singleToMultiDimentionalArray(board_array, width);

  // evaluate and assign the number of neighboring bombs for each cell
  for (let r = 0; r <= height - 1; r++) {
    for (let c = 0; c <= width - 1; c++) {
      if (
        // don't need to assign neighboringbombs to bomb cells
        !board[r][c].includes("*")
      ) {
        board[r][c] = board[r][c].replace(
          " ",
          getNumOfNeighboringBombs(board, r, c)
        );
      }
    }
  }

  return board;
};

export const createBoardWithJustNumbers = (
  height: number,
  width: number,
  bomb_number: number
) => {
  // create an array with the amount of cells the board will have
  let board_array = new Array(height * width).fill(0);

  // put the bombs in the board
  board_array.fill(9, 0, bomb_number);

  // suffle the board to distribute the bombs
  board_array = fisherYatesShuffle(board_array);

  // create a two dimentional array `board` from the suffled board
  let board = singleToMultiDimentionalArray(board_array, width);

  // evaluate and assign the number of neighboring bombs for each cell
  for (let r = 0; r <= height - 1; r++) {
    for (let c = 0; c <= width - 1; c++) {
      if (
        // don't need to assign neighboringbombs to bomb cells
        !(board[r][c] === 9)
      ) {
        board[r][c] = board[r][c] = getNumOfNeighboringBombsIfBombsAre9(
          board,
          r,
          c
        );
      }
    }
  }

  return board;
};

export const getNumOfNeighboringBombsIfBombsAre9 = (
  board: number[][],
  row: number,
  col: number
) => {
  let bombNum = 0;

  for (let r = -1; r <= 1; r++) {
    for (let c = -1; c <= 1; c++) {
      let checking_row = row + r;
      let checking_col = col + c;
      if (
        // we don't need to check the cell we passed
        !(checking_row == row && checking_col == col)
      ) {
        if (
          // checking_row and checking_col are inside the board
          checking_row >= 0 &&
          checking_row <= board.length - 1 &&
          checking_col >= 0 &&
          checking_col <= board[0].length - 1
        ) {
          if (board[checking_row][checking_col] === 9) {
            bombNum = bombNum + 1;
          }
        }
      }
    }
  }

  return bombNum;
};

/**  Credit:
 * http://bost.ocks.org/mike/shuffle/
 */
export const fisherYatesShuffle = function (array: any[]) {
  let m = array.length,
    t: any,
    i: number;

  // While there remain elements to shuffle…
  while (m) {
    // Pick a remaining element…
    i = Math.floor(Math.random() * m--);

    // And swap it with the current element.
    t = array[m];
    array[m] = array[i];
    array[i] = t;
  }

  return array;
};

export const singleToMultiDimentionalArray = (
  initial_array: any[],
  num_cols: number
): any[][] => {
  let rows = initial_array.length / num_cols;
  let multi_dimentional_array = [];

  for (let i = 0; i < rows; i++) {
    multi_dimentional_array.push(initial_array.splice(0, num_cols));
  }

  return multi_dimentional_array;
};

export const getNumOfNeighboringBombs = (
  board: string[][],
  row: number,
  col: number
) => {
  let num = 0;

  for (let r = -1; r <= 1; r++) {
    for (let c = -1; c <= 1; c++) {
      let checking_row = row + r;
      let checking_col = col + c;
      if (
        // we don't need to check the cell we passed
        !(checking_row == row && checking_col == col)
      ) {
        if (
          // checking_row and checking_col are inside the board
          checking_row >= 0 &&
          checking_row <= board.length - 1 &&
          checking_col >= 0 &&
          checking_col <= board.length - 1
        ) {
          if (board[checking_row][checking_col].includes("*")) {
            num = num + 1;
          }
        }
      }
    }
  }
  if (num > 0) {
    return num;
  } else {
    return " ";
  }
};

/**
 * credit: https://github.com/arthurtyukayev/use-keyboard-shortcut/blob/master/lib/utils.js
 */
export const overrideSystemHandling = (e: KeyboardEvent): void => {
  if (e) {
    if (e.preventDefault) e.preventDefault();
    if (e.stopPropagation) {
      e.stopPropagation();
    } else if (window.event) {
      window.event.cancelBubble = true;
    }
  }
};

// Function stolen from this Stack Overflow answer:
// https: stackoverflow.com/a/9229821
export const uniq_fast = (a: any[]): any[] => {
  var seen = {};
  var out = [];
  var len = a.length;
  var j = 0;
  for (var i = 0; i < len; i++) {
    var item = a[i];
    if (seen[item] !== 1) {
      seen[item] = 1;
      out[j++] = item;
    }
  }
  return out;
};

// The goal for this recursive function is to check to ensure
// that the keys are held down in the correct order of the shortcut.
// I.E if the shortcut array is ["Shift", "E", "A"], this function will ensure
// that "E" is held down before "A", and "Shift" is held down before "E".
export const checkHeldKeysRecursive = (
  shortcutKey: string,
  // Tracks the call interation for the recursive function,
  // based on the previous index;
  shortcutKeyRecursionIndex: number = 0,
  shortcutArray: string[],
  heldKeysArray: string[]
): boolean => {
  const shortcutIndexOfKey = shortcutArray.indexOf(shortcutKey);
  const keyPartOfShortCut = shortcutArray.indexOf(shortcutKey) >= 0;

  // Early exit if they key isn't even in the shortcut combination.
  if (!keyPartOfShortCut) return false;

  // While holding down one of the keys, if another is to be let go, the shortcut
  // should be void. Shortcut keys must be held down in a specifc order.
  // This function is always called before a key is added to held keys on keydown,
  // this will ensure that heldKeys only contains the prefixing keys
  const comparisonIndex = Math.max(heldKeysArray.length - 1, 0);
  if (
    heldKeysArray.length &&
    heldKeysArray[comparisonIndex] !== shortcutArray[comparisonIndex]
  ) {
    return false;
  }

  // Early exit for the first held down key in the shortcut,
  // except if this is a recursive call
  if (shortcutIndexOfKey === 0) {
    // If this isn't the first interation of this recursive function, and we're
    // recursively calling this function, we should always be checking the
    // currently held down keys instead of returning true
    if (shortcutKeyRecursionIndex > 0)
      return heldKeysArray.indexOf(shortcutKey) >= 0;
    return true;
  }

  const previousShortcutKeyIndex = shortcutIndexOfKey - 1;
  const previousShortcutKey = shortcutArray[previousShortcutKeyIndex];
  const previousShortcutKeyHeld =
    heldKeysArray[previousShortcutKeyIndex] === previousShortcutKey;

  // Early exit if the key just before the currently checked shortcut key
  // isn't being held down.
  if (!previousShortcutKeyHeld) return false;

  // Recursively call this function with the previous key as the new shortcut key
  // but the index of the current shortcut key.
  return checkHeldKeysRecursive(
    previousShortcutKey,
    shortcutIndexOfKey,
    shortcutArray,
    heldKeysArray
  );
};
