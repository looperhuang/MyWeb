<template>
  <q-page class="q-pa-md q-gutter-md">
    <div class="text-h4 text-bold text-center">
      {{ data?.datasetDescription }}
    </div>

    <q-select
      filled
      v-model="city"
      :options="cityOptions"
      label="縣市選擇"
      map-options
      emit-value
      clearable
    />

    <WeatherCard :data="filterData" />
  </q-page>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { getWeatherDesc } from 'src/services/weather';
import WeatherCard from './WeatherCard.vue';

import { QSelectOption } from 'quasar';

const data = ref();

const city = ref<string>('');
const cityOptions = computed(() => {
  if (!data.value) return [];
  const { location } = data.value;
  const options: QSelectOption[] = location.map((x: any) => ({
    label: x.locationName,
    value: x.geocode,
  }));
  return options;
});

const filterData = computed(() => {
  if (!data.value) return [];
  if (!city.value) return data.value.location;
  const f = data.value.location.filter((x: any) => x.geocode == city.value);
  return f;
});

onMounted(async () => {
  const result = await getWeatherDesc();
  // console.log(result.records.locations[0]);
  data.value = result.records.locations[0];
});
</script>

<style scoped></style>
