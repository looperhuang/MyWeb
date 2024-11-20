<template>
  <q-page class="q-pa-md q-gutter-md">
    <div class="text-h4 text-bold text-center">
      {{ data?.datasetDescription }}
    </div>
    <CitySelect @update:model-value="updateCity" />
    <LocationPage :location="location" />
  </q-page>
</template>

<script setup lang="ts">
import { onMounted, ref, computed } from 'vue';
import { GetPre36hr, Pre36Record } from 'src/services/weather';
import CitySelect from './CitySelect.vue';
import LocationPage from './LocationPage.vue';

const data = ref<Pre36Record | null>();
const selectedLocation = ref<string>('臺中市');
const location = computed(() => {
  if (!data.value) return null;
  return data.value.location.find(
    (item) => item.locationName === selectedLocation.value
  );
});
onMounted(async () => {
  data.value = await GetPre36hr();
});

const updateCity = async (city: string) => {
  selectedLocation.value = city;
};
</script>

<style scoped></style>
