import { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      // {
      //   name: 'timer',
      //   path: '',
      //   component: () => import('pages/offwork/IndexPage.vue'),
      // },
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
