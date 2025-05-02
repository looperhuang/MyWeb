<template>
  <q-page class="row q-col-gutter-md">
    <div class="col-md-2 col-sm-1 col-xs-0"></div>
    <div class="col-md-8 col-sm-10 col-xs-12">
      <q-card>
        <q-card-section>
          <div class="text-h6">Sudoku</div>
        </q-card-section>
        <q-markup-table separator="cell" bordered flat>
          <tbody>
            <tr v-for="(row, rowIndex) in board" :key="rowIndex">
              <td v-for="(col, colIndex) in row" :key="colIndex">
                <q-input
                  borderless
                  dense
                  v-model.number="board[rowIndex][colIndex]"
                  :disabled="isFixed(rowIndex, colIndex)"
                  @input="handleInput(rowIndex, colIndex)"
                />
              </td>
            </tr>
          </tbody>
        </q-markup-table>
        <q-card-actions>
          <q-btn icon="check" @click="checkBoard" />
        </q-card-actions>
      </q-card>
    </div>
    <div class="col-md-2 col-sm-1 col-xs-0"></div>
  </q-page>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { SudokuBoard, generateSudoku, isValid, solveSudoku } from './sudoku';
import { Notify } from 'quasar';

const initBoard = ref<SudokuBoard>(generateSudoku(30));
const board = ref<SudokuBoard>(initBoard.value);

const isFixed = (row: number, col: number) => {
  return initBoard.value[row][col] !== 0;
};

const handleInput = (row: number, col: number) => {
  const num = board.value[row][col];
  if (num < 1 || num > 9 || !isValid(initBoard.value, row, col, num)) {
    board.value[row][col] = 0;
    Notify.create({
      type: 'negative',
      message: '無效的數字！',
    });
  }
};

const checkBoard = () => {
  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      const num = board.value[row][col];
      if (num !== 0 && !isValid(board.value, row, col, num)) {
        Notify.create({
          type: 'negative',
          message: `數字在位置 (${row + 1}, ${col + 1}) 不正確！`,
        });
        return;
      }
    }
  }
  Notify.create({
    type: 'positive',
    message: '目前所有數字都正確！',
  });
};
</script>

<style scoped>
.sudoku {
  text-align: center;
}
</style>
