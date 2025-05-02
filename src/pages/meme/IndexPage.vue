<template>
  <q-page class="q-pa-md">
    <div class="row q-col-gutter-md text-h4 text-center">
      <div class="col-12">
        <!-- <q-btn v-if="page != 1" label="第一頁" @click="pageChange('first')" /> -->
        <q-btn v-if="page != 1" label="上一頁" @click="pageChange('prev')" />
        Memes
        <q-btn label="下一頁" @click="pageChange('next')" />
        <!-- <q-btn label="最後一頁" @click="pageChange('last')" /> -->
      </div>
      <div
        class="col-lg-3 col-md-4 col-sm-6 col-xs-12"
        v-for="m in memes"
        :key="m.id"
      >
        <q-card flat>
          <q-img :src="m.src" @click="fetchSource(m.url)" />

          <q-card-section class="text-body1">
            <a
              :href="m.src"
              target="_blank"
              rel="noreferrer noopener"
              style="color: white"
            >
              {{ m.title }}
            </a>
          </q-card-section>
        </q-card>
        <div></div>
      </div>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { getHotMeme, Meme } from 'src/services/meme';
import { onMounted, ref } from 'vue';

const memes = ref<Meme[]>([]);
const page = ref(1);

onMounted(async () => {
  await getMemeData(page.value);
});

const fetchSource = (url: string) => {
  if (!url) return;
  window.open(url);
};

const pageChange = async (mode: string) => {
  switch (mode) {
    case 'first':
      page.value = 1;
      break;
    case 'last':
      page.value = 100;
      break;
    case 'next':
      page.value++;
      break;
    case 'prev':
      page.value--;
      break;
    default:
      return;
  }
  await getMemeData(page.value);
};

const getMemeData = async (page: number | 'first' | 'last') => {
  try {
    memes.value = await getHotMeme(page);
  } catch (e) {
    console.log(e);
  }
};
</script>

<style scoped></style>
