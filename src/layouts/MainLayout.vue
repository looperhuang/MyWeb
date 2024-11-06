<template>
  <q-layout view="lHh Lpr lFf">
    <q-header>
      <q-bar class="q-electron-drag bg-black">
        <q-btn flat icon="menu" @click="leftDrawerOpen = !leftDrawerOpen" />
        <div>My Little Web</div>
        <q-icon name="public" />
        <q-space />
        <q-btn dense flat icon="close" @click="closeApp" />
      </q-bar>
    </q-header>

    <q-drawer v-model="leftDrawerOpen" show-if-above bordered>
      <q-list>
        <q-item v-for="m in menus" :key="m.label" clickable v-ripple :to="m.to">
          <q-item-section avatar>
            <q-icon :name="m.icon"></q-icon>
          </q-item-section>
          <q-item-section> {{ m.label }} </q-item-section>
        </q-item>
      </q-list>
    </q-drawer>

    <q-page-container>
      <NetworkStatus />
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import NetworkStatus from 'src/components/NetworkStatus.vue';
import { ref } from 'vue';

const leftDrawerOpen = ref(false);

const closeApp = () => {
  window.close();
};

const menus = [
  {
    label: '天氣',
    icon: 'cloud',
    to: 'weather',
  },
  {
    label: '新聞',
    icon: 'newspaper',
    to: 'news',
  },
  {
    label: '迷因',
    icon: 'collections',
    to: 'meme',
  },
  {
    label: '下班',
    icon: 'timer',
    to: 'offwork',
  },
  {
    label: '抽午餐',
    icon: 'support',
    to: 'slotmachine',
  },
];
</script>
