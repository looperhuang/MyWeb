export type SudokuBoard = number[][];

/**
 * Creates an empty Sudoku board, with all cells set to 0.
 * @returns An empty Sudoku board, represented as a 2D array of numbers.
 */
const createEmptyboard = (): SudokuBoard => {
  return Array.from({ length: 9 }, () => Array(9).fill(0));
};

/**
 * Checks whether placing a number in a specific cell on the Sudoku board is valid.
 *
 * @param board - The current state of the Sudoku board.
 * @param row - The row index of the cell to check.
 * @param col - The column index of the cell to check.
 * @param num - The number to place in the cell.
 * @returns True if the placement is valid, i.e., it does not violate Sudoku rules
 *          in the given row, column, or 3x3 subgrid; otherwise, false.
 */
const isValid = (board: SudokuBoard, row: number, col: number, num: number) => {
  // 檢查行、列
  for (let i = 0; i < 9; i++) {
    if (board[row][i] === num || board[i][col] === num) {
      return false;
    }
  }

  // 檢查九宮格
  const startRow = Math.floor(row / 3) * 3;
  const startCol = Math.floor(col / 3) * 3;
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      if (board[startRow + i][startCol + j] === num) {
        return false;
      }
    }
  }
  return true;
};

const generateSudoku = (diff: number) => {
  const board = createEmptyboard();
  let attempts = diff;

  while (attempts > 0) {
    const row = Math.floor(Math.random() * 9);
    const col = Math.floor(Math.random() * 9);
    const num = Math.floor(Math.random() * 9) + 1;
    if (board[row][col] === 0 && isValid(board, row, col, num)) {
      board[row][col] = num;
      attempts--;
    }
  }

  return board;
};

const solveSudoku = (board: SudokuBoard) => {
  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      if (board[row][col] === 0) {
        for (let num = 1; num <= 9; num++) {
          if (isValid(board, row, col, num)) {
            board[row][col] = num;
            if (solveSudoku(board)) {
              return true;
            }
            board[row][col] = 0;
          }
        }
        return false;
      }
    }
  }
};

export { generateSudoku, isValid, solveSudoku };
