<template>
  <q-page class="q-pa-md">
    <div class="row q-col-gutter-md">
      <div class="text-h4 text-center col-12 q-mb-lg">📰 頭條新聞</div>

      <!-- 載入中狀態 -->
      <div v-if="loading" class="col-12">
        <div class="row q-col-gutter-md">
          <div v-for="n in 6" :key="n" class="col-md-4 col-sm-6 col-xs-12">
            <q-card>
              <q-skeleton height="200px" />
              <q-card-section>
                <q-skeleton type="text" class="text-h6" />
                <q-skeleton type="text" width="60%" />
              </q-card-section>
              <q-separator />
              <q-card-section>
                <q-skeleton type="text" />
                <q-skeleton type="text" />
                <q-skeleton type="text" width="40%" />
              </q-card-section>
            </q-card>
          </div>
        </div>
      </div>

      <!-- 錯誤狀態 -->
      <div v-else-if="error" class="col-12">
        <q-banner class="text-white bg-red">
          <template v-slot:avatar>
            <q-icon name="warning" color="white" />
          </template>
          載入新聞時發生錯誤：{{ error }}
          <template v-slot:action>
            <q-btn flat color="white" label="重試" @click="loadNews" />
          </template>
        </q-banner>
      </div>

      <!-- 無資料狀態 -->
      <div v-else-if="!news?.articles?.length" class="col-12">
        <q-banner class="text-white bg-grey-7">
          <template v-slot:avatar>
            <q-icon name="info" color="white" />
          </template>
          目前沒有可用的新聞資料
        </q-banner>
      </div>

      <!-- 新聞列表 -->
      <div
        v-else
        class="col-md-4 col-sm-6 col-xs-12"
        v-for="(article, index) in news.articles"
        :key="article.source?.id || index"
      >
        <q-card
          class="news-card cursor-pointer transition-all"
          @click="openArticle(article.url)"
        >
          <!-- 圖片區域 -->
          <div class="image-container">
            <q-img
              :src="
                article.urlToImage ||
                'https://placehold.co/600x400?text=Opps!&font=roboto'
              "
              :ratio="16 / 9"
              :alt="article.title"
              class="news-image"
              loading="lazy"
            >
              <template v-slot:error>
                <div class="absolute-full flex flex-center bg-grey-3">
                  <q-icon name="image" size="64px" color="grey-6" />
                </div>
              </template>

              <!-- 來源標籤 -->
              <div class="absolute-top-right q-ma-sm">
                <q-chip
                  :label="article.source?.name || '未知來源'"
                  color="primary"
                  text-color="white"
                  size="sm"
                />
              </div>
            </q-img>
          </div>

          <!-- 標題區域 -->
          <q-card-section class="q-pb-none">
            <div class="text-h6 news-title">
              {{ article.title }}
            </div>

            <!-- 發布時間 -->
            <div class="text-caption text-grey-6 q-mt-xs">
              <q-icon name="schedule" size="16px" class="q-mr-xs" />
              {{ formatDate(article.publishedAt) }}
            </div>
          </q-card-section>

          <q-separator />

          <!-- 描述區域 -->
          <q-card-section class="news-description">
            {{ article.description || '暫無描述' }}
          </q-card-section>

          <!-- 作者資訊 -->
          <q-card-section
            v-if="article.author"
            class="q-pt-none text-caption text-grey-6"
          >
            <q-icon name="person" size="16px" class="q-mr-xs" />
            {{ article.author }}
          </q-card-section>

          <!-- 操作按鈕 -->
          <q-card-actions class="q-px-md q-pb-md">
            <q-btn
              flat
              color="primary"
              label="閱讀全文"
              icon="open_in_new"
              @click.stop="openArticle(article.url)"
            />
            <q-space />
            <q-btn
              flat
              round
              color="grey-6"
              icon="share"
              @click.stop="shareArticle(article)"
            >
              <q-tooltip>分享</q-tooltip>
            </q-btn>
            <q-btn
              flat
              round
              color="grey-6"
              icon="bookmark_border"
              @click.stop="bookmarkArticle(article)"
            >
              <q-tooltip>收藏</q-tooltip>
            </q-btn>
          </q-card-actions>
        </q-card>
      </div>
    </div>

    <!-- 重新整理按鈕 -->
    <q-page-sticky position="bottom-right" :offset="[18, 18]">
      <q-btn
        fab
        icon="refresh"
        color="primary"
        :loading="loading"
        @click="loadNews"
      >
        <q-tooltip>重新整理</q-tooltip>
      </q-btn>
    </q-page-sticky>
  </q-page>
</template>

<script setup lang="ts">
import { getTwHeadlines } from 'src/services/news';
import { onMounted, ref } from 'vue';
import { useQuasar } from 'quasar';
import type { News } from 'src/services/news';

const news = ref<News | null>();
const $q = useQuasar();
const loading = ref(false);
const error = ref<string>('');

const loadNews = async () => {
  loading.value = true;
  error.value = '';

  try {
    news.value = await getTwHeadlines();
  } catch (e) {
    console.error('載入新聞失敗:', e);
    error.value = e instanceof Error ? e.message : '載入新聞時發生未知錯誤';

    $q.notify({
      type: 'negative',
      message: '載入新聞失敗',
      caption: '請檢查網路連線或稍後再試',
      actions: [{ label: '重試', color: 'white', handler: () => loadNews() }],
    });
  } finally {
    loading.value = false;
  }
};

// 格式化日期
const formatDate = (dateString: Date): string => {
  if (!dateString) return '未知時間';

  try {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60 * 60)
    );

    if (diffInHours < 1) {
      return '剛剛';
    } else if (diffInHours < 24) {
      return `${diffInHours} 小時前`;
    } else {
      return date.toLocaleDateString('zh-TW', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    }
  } catch (e) {
    return '未知時間';
  }
};

// 開啟文章
const openArticle = (url: string) => {
  if (url) {
    window.open(url, '_blank', 'noreferrer,noopener');
  }
};

// 分享文章
const shareArticle = async (article: News['articles'][number]) => {
  fallbackShare(article);
  // if (navigator.share) {
  //   try {
  //     await navigator.share({
  //       title: article.title,
  //       text: article.description || '',
  //       url: article.url,
  //     });
  //   } catch (e) {
  //     if ((e as Error).name !== 'AbortError') {
  //       fallbackShare(article);
  //     }
  //   }
  // } else {
  //   fallbackShare(article);
  // }
};

// 備用分享方式
const fallbackShare = (article: News['articles'][number]) => {
  try {
    navigator.clipboard.writeText(article.url);
    $q.notify({
      type: 'positive',
      message: '連結已複製到剪貼簿',
      timeout: 2000,
    });
  } catch (e) {
    $q.notify({
      type: 'negative',
      message: '分享失敗',
      timeout: 2000,
    });
  }
};

// 收藏文章
const bookmarkArticle = (article: News['articles'][number]) => {
  // 這裡可以實作收藏功能，例如存到 localStorage 或發送到後端
  $q.notify({
    type: 'positive',
    message: '已收藏文章',
    caption: article.title,
    timeout: 2000,
  });
};

onMounted(() => {
  loadNews();
});
</script>

<style scoped>
.news-card {
  height: 100%;
  display: flex;
  flex-direction: column;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.news-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
}

.image-container {
  position: relative;
  overflow: hidden;
}

.news-image {
  transition: transform 0.3s ease;
}

.news-card:hover .news-image {
  transform: scale(1.05);
}

.news-title {
  line-height: 1.3;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  min-height: 2.6em;
}

.news-description {
  flex-grow: 1;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  line-height: 1.4;
}

.transition-all {
  transition: all 0.3s ease;
}

@media (max-width: 600px) {
  .news-title {
    font-size: 1.1rem;
  }
}
</style>
