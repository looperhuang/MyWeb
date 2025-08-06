<template>
  <q-page class="q-pa-md">
    <div class="row q-col-gutter-md text-h4 text-center">
      <!-- Header with Navigation -->
      <div class="col-12">
        <div class="text-h4 text-center q-mb-md">Memes</div>
        <div class="flex justify-center q-gutter-sm">
          <q-btn
            v-if="page > 1"
            label="第一頁"
            @click="pageChange('first')"
            :loading="loading"
            outline
            color="primary"
          />
          <q-btn
            v-if="page > 1"
            label="上一頁"
            @click="pageChange('prev')"
            :loading="loading"
            outline
            color="primary"
          />
          <q-chip
            :label="`第 ${page} 頁`"
            color="primary"
            text-color="white"
            class="q-mx-sm"
          />
          <q-btn
            label="下一頁"
            @click="pageChange('next')"
            :loading="loading"
            :disable="memes.length === 0"
            outline
            color="primary"
          />
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="col-12">
        <div class="row q-col-gutter-md">
          <div
            class="col-lg-3 col-md-4 col-sm-6 col-xs-12"
            v-for="n in 8"
            :key="n"
          >
            <q-card flat>
              <q-skeleton height="200px" />
              <q-card-section>
                <q-skeleton type="text" width="80%" />
              </q-card-section>
            </q-card>
          </div>
        </div>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="col-12">
        <q-banner class="text-white bg-red">
          <template v-slot:avatar>
            <q-icon name="error" color="white" />
          </template>
          載入失敗：{{ error }}
          <template v-slot:action>
            <q-btn flat color="white" label="重試" @click="getMemeData(page)" />
          </template>
        </q-banner>
      </div>

      <!-- Empty State -->
      <div v-else-if="memes.length === 0" class="col-12">
        <div class="text-center q-pa-xl">
          <q-icon name="sentiment_dissatisfied" size="4rem" color="grey" />
          <div class="text-h6 q-mt-md text-grey">沒有找到任何 memes</div>
        </div>
      </div>

      <!-- Meme Cards -->
      <div
        v-else
        class="col-lg-3 col-md-4 col-sm-6 col-xs-12"
        v-for="m in memes"
        :key="m.id"
      >
        <q-card
          flat
          class="meme-card cursor-pointer transition-all"
          @click="fetchSource(m.url)"
        >
          <div class="image-container">
            <q-img
              :src="m.src"
              :alt="m.title"
              loading="lazy"
              :ratio="1"
              class="rounded-borders"
              spinner-color="primary"
              @error="onImageError"
            >
              <template v-slot:error>
                <div class="absolute-full flex flex-center bg-grey-3">
                  <q-icon name="broken_image" color="grey-6" size="3rem" />
                </div>
              </template>

              <!-- Hover Overlay -->
              <div class="absolute-full image-overlay flex flex-center">
                <q-btn
                  round
                  color="primary"
                  icon="open_in_new"
                  size="lg"
                  class="hover-btn"
                />
              </div>
            </q-img>
          </div>

          <q-card-section class="q-pa-sm">
            <div class="text-body2 text-weight-medium line-clamp-2">
              {{ m.title || '無標題' }}
            </div>
          </q-card-section>
        </q-card>
      </div>
    </div>

    <!-- Back to Top Button -->
    <q-page-sticky
      position="bottom-right"
      :offset="[18, 18]"
      v-if="showBackToTop"
    >
      <q-btn
        fab
        icon="keyboard_arrow_up"
        color="primary"
        @click="scrollToTop"
      />
    </q-page-sticky>
  </q-page>
</template>

<script setup lang="ts">
import { useQuasar } from 'quasar';
import { getHotMeme, Meme } from 'src/services/meme';
import { onMounted, ref, onUnmounted, nextTick } from 'vue';

const $q = useQuasar();
const memes = ref<Meme[]>([]);
const page = ref(1);
const loading = ref(false);
const error = ref<string | null>('');
const showBackToTop = ref(false);

let scrollHandler: (() => void) | null = null;

onMounted(async () => {
  await getMemeData(page.value);
  setupScrollListener();
});

onUnmounted(() => {
  if (scrollHandler) {
    window.removeEventListener('scroll', scrollHandler);
  }
});

const setupScrollListener = () => {
  scrollHandler = () => {
    showBackToTop.value = window.scrollY > 300;
  };
  window.addEventListener('scroll', scrollHandler);
};

const scrollToTop = () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth',
  });
};

const fetchSource = (url: string) => {
  if (!url) {
    $q.notify({
      type: 'warning',
      message: '沒有可用的連結',
    });
    return;
  }
  window.open(url, '_blank', 'noopener,noreferrer');
};

const pageChange = async (mode: 'first' | 'last' | 'next' | 'prev') => {
  if (loading.value) return;

  const newPage = calculateNewPage(mode);
  if (newPage === page.value) return;

  page.value = newPage;
  await getMemeData(page.value);

  // Smooth scroll to top after page change
  await nextTick();
  scrollToTop();
};

const calculateNewPage = (mode: 'first' | 'last' | 'next' | 'prev'): number => {
  switch (mode) {
    case 'first':
      return 1;
    case 'last':
      return 100;
    case 'next':
      return page.value + 1;
    case 'prev':
      return Math.max(1, page.value - 1);
    default:
      return page.value;
  }
};

const getMemeData = async (targetPage: number) => {
  if (loading.value) return;

  loading.value = true;
  error.value = null;

  try {
    const data = await getHotMeme(targetPage);
    memes.value = Array.isArray(data) ? data : [];

    if (memes.value.length === 0) {
      $q.notify({
        type: 'info',
        message: '這一頁沒有更多內容了',
      });
    }
  } catch (e) {
    console.error('Failed to fetch memes:', e);
    error.value = e instanceof Error ? e.message : '載入失敗';
    memes.value = [];

    $q.notify({
      type: 'negative',
      message: '載入 memes 失敗，請稍後再試',
      actions: [
        {
          label: '重試',
          color: 'white',
          handler: () => getMemeData(targetPage),
        },
      ],
    });
  } finally {
    loading.value = false;
  }
};

const onImageError = (error: Event) => {
  console.warn('Image failed to load:', error);
};

// Preload next page for better UX
const preloadNextPage = async () => {
  if (!loading.value && memes.value.length > 0) {
    try {
      await getHotMeme(page.value + 1);
    } catch (e) {
      // Silent fail for preloading
    }
  }
};

// Preload after current page is loaded
setTimeout(preloadNextPage, 2000);
</script>

<style scoped>
.meme-card {
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.meme-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
}

.image-container {
  position: relative;
  overflow: hidden;
  border-radius: 4px;
}

.image-overlay {
  background: rgba(0, 0, 0, 0.5);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.meme-card:hover .image-overlay {
  opacity: 1;
}

.hover-btn {
  transform: scale(0.8);
  transition: transform 0.2s ease;
}

.meme-card:hover .hover-btn {
  transform: scale(1);
}

.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  line-height: 1.4;
  max-height: 2.8em;
}

.transition-all {
  transition: all 0.3s ease;
}
</style>
