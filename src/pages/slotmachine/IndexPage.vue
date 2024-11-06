<template>
  <q-page class="q-pa-md">
    <q-card flat>
      <q-card-section>
        <div class="text-h4 text-center">抽午餐</div>
      </q-card-section>

      <q-card-section>
        <div class="result-display text-h5 text-center">
          {{ displayedResult }}
        </div>
      </q-card-section>

      <q-card-actions align="right">
        <q-btn label="開始" icon="play_circle" @click="spin" />
      </q-card-actions>
    </q-card>
  </q-page>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { items } from './itemInput';
const result = ref<string>();
const displayedResult = ref<string>('');
const isSpinning = ref<boolean>(false);
const spin = () => {
  if (isSpinning.value) return;
  isSpinning.value = true;

  let currentItemIndex = 0;

  const intervalId = setInterval(() => {
    displayedResult.value = items[currentItemIndex];
    currentItemIndex = (currentItemIndex + 1) % items.length;
  }, 50);

  setTimeout(() => {
    clearInterval(intervalId);
    const finalIndex = Math.floor(Math.random() * items.length);
    result.value = items[finalIndex];
    displayedResult.value = result.value; // Display the final result
    isSpinning.value = false;
  }, 2000);
};
</script>

<style scoped>
.result-display {
  height: 40px;
  font-size: 24px;
  transition: transform 0.1s ease;
  overflow: hidden;
}
</style>
