import { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        name: 'weather',
        path: 'weather',
        component: () => import('pages/weather/indexPage.vue'),
      },
      // {
      //   name: 'keyword',
      //   path: 'keyword',
      //   component: () => import('pages/keyword/IndexPage.vue'),
      // },
      {
        name: 'offwork',
        path: 'offwork',
        component: () => import('pages/offwork/IndexPage.vue'),
      },
      {
        name: 'news',
        path: 'news',
        component: () => import('pages/news/IndexPage.vue'),
      },
      {
        name: 'meme',
        path: 'meme',
        component: () => import('pages/meme/IndexPage.vue'),
      },
      {
        name: 'slotmachine',
        path: 'slotmachine',
        component: () => import('pages/slotmachine/IndexPage.vue'),
      },
      {
        name: 'luckywheel',
        path: 'luckywheel',
        component: () => import('pages/luckywheel/IndexPage.vue'),
      },
      {
        name: 'imgpreview',
        path: 'imgpreview',
        component: () => import('pages/ImgPreview/IndexPage.vue'),
      },
      {
        name: 'pre36',
        path: 'pre36',
        component: () => import('pages/pre36/IndexPage.vue'),
      },
      {
        name: 'alarm',
        path: 'alarm',
        component: () => import('pages/alarmClock/IndexPage.vue'),
      },
      {
        name: 'countdown',
        path: 'countdown',
        component: () => import('pages/countDown/IndexPage.vue'),
      },
      {
        name: 'sudoku',
        path: 'sudoku',
        component: () => import('pages/sudoku/IndexPage.vue'),
      },
      {
        name: 'yodid',
        path: 'yodid',
        component: () => import('pages/yodid/IndexPage.vue'),
      },
      {
        name: 'hotpotaction',
        path: 'hotpotaction',
        component: () => import('pages/hotpotaction/IndexPage.vue'),
      },
      {
        name: 'workmanager',
        path: 'workmanager',
        component: () => import('pages/WorkManager/IndexPage.vue'),
      },
    ],
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
  },
];

export default routes;
