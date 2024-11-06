<template>
  <q-page class="q-pa-md q-gutter-sm">
    <Vue3Marquee>
      <span> 這是跑馬燈 </span>
    </Vue3Marquee>

    <q-input filled label="關鍵字搜尋" v-model="keyword" @keyup.enter="search">
      <template v-slot:append>
        <q-icon name="search" />
      </template>
    </q-input>

    <q-table
      title="搜尋結果"
      :loading="loading"
      :rows="data"
      :columns="columns"
      separator="cell"
      :pagination="{
        rowsPerPage: 10,
      }"
    >
    </q-table>
  </q-page>
</template>

<script setup lang="ts">
import { Vue3Marquee } from 'vue3-marquee';
import { ref } from 'vue';
import { keywordSearch, OrderData } from 'src/services/keyword';
import { QTableColumn } from 'quasar';
const keyword = ref<string>('');
const data = ref<OrderData[]>([]);
const loading = ref<boolean>(false);

const search = async () => {
  try {
    loading.value = true;
    const res = await keywordSearch(keyword.value);
    data.value = res;
  } catch (e) {
    console.error(e);
  } finally {
    loading.value = false;
  }
};

const columns: QTableColumn<OrderData>[] = [
  {
    name: 'ordid',
    field: 'ordid',
    label: '醫令碼',
    align: 'left',
  },
  {
    name: 'ordnme',
    field: 'ordnme',
    label: '醫令名稱',
    align: 'left',
  },
  {
    name: 'scitn',
    field: 'scitn',
    label: '學名',
    align: 'left',
  },
];

const showSum = () => {
  console.log('summary');
};
</script>

<style scoped></style>
