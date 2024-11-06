<template>
  <q-card v-for="d in data" :key="d.geocode">
    <q-card-section>
      <div class="text-h5">{{ d.locationName }}</div>
    </q-card-section>

    <q-separator dark />

    <template v-for="wd in d.weatherElement" :key="wd.elementName">
      <q-markup-table separator="cell">
        <thead>
          <tr>
            <th>區間</th>
            <th>狀態</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(twd, ind) in wd.time" :key="ind">
            <td>{{ twd.startTime }} ~ {{ twd.endTime }}</td>
            <td>
              <span v-for="(el, eind) in twd.elementValue" :key="eind">
                {{ el.value }}{{ el.measures }}
              </span>
            </td>
          </tr>
        </tbody>
      </q-markup-table>
    </template>
  </q-card>
</template>

<script setup lang="ts">
// import { QTableColumn } from 'quasar';
withDefaults(
  defineProps<{
    data: any;
  }>(),
  {
    data: () => [],
  }
);

// const columns: QTableColumn[] = [
//   {
//     name: 'startTime',
//     field: 'startTime',
//     align: 'left',
//     label: '開始',
//   },
// ];
</script>

<style scoped></style>
