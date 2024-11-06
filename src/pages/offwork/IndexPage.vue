<template>
  <q-page class="q-pa-md q-gutter-sm">
    <div id="clock">
      <p class="text">距離下班倒數</p>
      <p class="time">{{ time }}</p>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { computed, ref, onMounted } from 'vue';

const timeLeft = ref({
  hours: 0,
  minutes: 0,
  seconds: 0,
});

const time = computed(() => {
  const { hours, minutes, seconds } = timeLeft.value;
  return `${hours}:${minutes}:${seconds}`;
});

const calTimeLeft = () => {
  const nowTime = new Date();

  const offTime = new Date();
  offTime.setHours(17, 30, 0);

  let timeDiff = offTime.getTime() - nowTime.getTime();

  const hourLeft = Math.floor(timeDiff / (1000 * 60 * 60));
  const minutesLeft = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
  const secondsLeft = Math.floor((timeDiff % (1000 * 60)) / 1000);

  timeLeft.value = {
    hours: hourLeft,
    minutes: minutesLeft,
    seconds: secondsLeft,
  };
};

onMounted(() => {
  calTimeLeft();
  window.setInterval(() => {
    calTimeLeft();
  }, 1000);
});
</script>

<style scoped>
#clock {
  font-family: 'Share Tech Mono', monospace;
  color: #ffffff;
  text-align: center;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  color: #daf6ff;
  text-shadow: 0 0 20px rgba(10, 175, 230, 1), 0 0 20px rgba(10, 175, 230, 0);
  .time {
    letter-spacing: 0.05em;
    font-size: 80px;
    padding: 5px 0;
  }
  .date {
    letter-spacing: 0.1em;
    font-size: 24px;
  }
  .text {
    letter-spacing: 0.1em;
    font-size: 12px;
    padding: 20px 0 0;
  }
}
</style>
