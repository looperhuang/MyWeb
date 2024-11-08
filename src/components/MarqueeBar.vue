<template>
  <Vue3Marquee class="bg-grey-8">
    <span class="q-px-sm">
      Network status :
      <strong>{{ isOnline ? 'Online' : 'Offline' }}</strong>
      <q-icon
        :name="isOnline ? 'wifi' : 'wifi_off'"
        :color="isOnline ? 'green' : 'red'"
      />
      <span v-if="!isOnline" class="text-red">
        You are currently offline. Some features may not be available.
      </span>
    </span>

    <span class="q-px-sm">Now Time : {{ nowTime.toLocaleString() }}</span>
  </Vue3Marquee>
</template>

<script setup lang="ts">
import { Vue3Marquee } from 'vue3-marquee';
import { ref, onMounted, onBeforeUnmount } from 'vue';

const isOnline = ref(navigator.onLine);
const nowTime = ref(new Date());

const updateNetworkStatus = () => {
  isOnline.value = navigator.onLine;
};

onMounted(() => {
  window.setInterval(() => {
    nowTime.value = new Date();
  }, 1000);
  window.addEventListener('online', updateNetworkStatus);
  window.addEventListener('offline', updateNetworkStatus);
});

onBeforeUnmount(() => {
  window.removeEventListener('online', updateNetworkStatus);
  window.removeEventListener('offline', updateNetworkStatus);
});
</script>

<style scoped></style>
