<template>
  <q-page class="q-pa-md">
    <div class="row q-col-gutter-md">
      <div class="text-h4 text-center col-12">Hot Memes</div>
      <div class="col-md-4 col-sm-6 col-xs-12" v-for="m in memes" :key="m.id">
        <q-card flat>
          <q-img :src="m.src" @click="fetchSource(m.url)" :ratio="1" />

          <q-card-section class="text-body1">
            <a :href="m.src" target="_blank" rel="noreferrer noopener">
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

onMounted(async () => {
  try {
    const res = await getHotMeme();
    memes.value = res;
  } catch (e) {
    console.log(e);
  }
});

const fetchSource = (url: string) => {
  if (!url) return;
  window.open(url);
};
</script>

<style scoped>
a {
  color: 'white';
}
</style>
