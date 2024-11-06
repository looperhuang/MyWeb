<template>
  <Vue3Marquee>
    <span>
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
  </Vue3Marquee>
</template>

<script setup lang="ts">
import { Vue3Marquee } from 'vue3-marquee';
import { ref, onMounted, onBeforeUnmount } from 'vue';

const isOnline = ref(navigator.onLine);

const updateNetworkStatus = () => {
  isOnline.value = navigator.onLine;
};

onMounted(() => {
  window.addEventListener('online', updateNetworkStatus);
  window.addEventListener('offline', updateNetworkStatus);
});

onBeforeUnmount(() => {
  window.removeEventListener('online', updateNetworkStatus);
  window.removeEventListener('offline', updateNetworkStatus);
});
</script>

<style scoped></style>
