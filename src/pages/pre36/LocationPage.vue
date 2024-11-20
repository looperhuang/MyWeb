<template>
  <q-card>
    <q-card-section class="text-h5">
      {{ location?.locationName }}
    </q-card-section>

    <q-card-section class="q-gutter-md">
      <q-card flat bordered v-for="d in w" :key="d.timeRange">
        <q-card-section class="text-body1">
          <div v-for="col in columns" :key="col.field">
            {{ col.label }} :
            {{ d[col.field as keyof ConsolidatedWeather] }}
          </div>
        </q-card-section>
      </q-card>
    </q-card-section>
  </q-card>
</template>

<script setup lang="ts">
import { Pre36Location, Pre36Element } from 'src/services/weather';
import { computed } from 'vue';
const props = defineProps<{
  location: Pre36Location | null;
}>();

interface ConsolidatedWeather {
  timeRange: string;
  Wx?: string;
  PoP?: string;
  MinT?: string;
  CI?: string;
  MaxT?: string;
}

const w = computed(() => {
  if (!props.location) return [];
  const temp: { [timeRange: string]: ConsolidatedWeather } = {};
  props.location.weatherElement.forEach((el) => {
    el.time.forEach((t) => {
      const timeRange = `${t.startTime} ~ ${t.endTime}`;

      if (!temp[timeRange]) {
        temp[timeRange] = {
          timeRange,
        };
      }

      switch (el.elementName) {
        case 'Wx':
          temp[timeRange].Wx = t.parameter.parameterName;
          break;
        case 'PoP':
          temp[timeRange].PoP = `${t.parameter.parameterName}%`;
          break;
        case 'MinT':
          temp[timeRange].MinT = `${t.parameter.parameterName}℃`;
          break;
        case 'CI':
          temp[timeRange].CI = t.parameter.parameterName;
          break;
        case 'MaxT':
          temp[timeRange].MaxT = `${t.parameter.parameterName}℃`;
          break;
      }
    });
  });
  return Object.values(temp);
});

const columns = [
  {
    label: '時段',
    field: 'timeRange',
    align: 'left',
  },
  {
    label: '天氣',
    field: 'Wx',
    align: 'left',
  },
  {
    label: '降雨機率',
    field: 'PoP',
    align: 'left',
  },
  {
    label: '最高溫',
    field: 'MaxT',
    align: 'left',
  },
  {
    label: '最低溫',
    field: 'MinT',
    align: 'left',
  },
  {
    label: '體感',
    field: 'CI',
    align: 'left',
  },
];
</script>

<style scoped></style>
