<template>
  <q-page class="q-pa-sm">
    <q-card>
      <q-card-section @click="show">
        <div class="text-h3">{{ welcomeText }}</div>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script setup lang="ts">
import { Notify } from 'quasar';
import { ref } from 'vue';
const welcomeText = ref<string>('歡迎來到我的網頁');
const show = () => {
  Notify.create({
    type: 'positive',
    message: '觸發點擊事件',
  });
};
</script>
