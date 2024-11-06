<template>
  <q-page class="q-pa-md">
    <div class="row q-col-gutter-md">
      <div class="text-h4 text-center col-12">Top HeadLines News</div>

      <div
        class="col-md-4 col-sm-6 col-xs-12"
        v-for="atc in news?.articles"
        :key="atc.source.id"
      >
        <q-img :src="atc.urlToImage" />

        <q-card-section class="text-h6">
          <a :href="atc.url" target="_blank" rel="noreferrer noopener">
            {{ atc.title }}
          </a>
        </q-card-section>

        <q-separator dark inset />

        <q-card-section class="text-body1">
          {{ atc.description }}
        </q-card-section>
      </div>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { getTwHeadlines } from 'src/services/news';
import { onMounted, ref } from 'vue';

const news = ref();

onMounted(async () => {
  try {
    news.value = await getTwHeadlines();
  } catch (e) {
    console.log(e);
  }
});
</script>

<style scoped></style>
