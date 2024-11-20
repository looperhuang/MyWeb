<template>
  <q-layout view="lHh Lpr lFf">
    <q-header>
      <q-bar class="q-electron-drag bg-black">
        <div>My Little Web</div>
        <q-icon name="public" />
        <q-btn label="Source" icon="source">
          <q-menu>
            <q-list>
              <q-item
                v-for="m in menus"
                :key="m.label"
                clickable
                v-ripple
                :to="m.to"
              >
                <q-item-section avatar>
                  <q-icon :name="m.icon"></q-icon>
                </q-item-section>
                <q-item-section> {{ m.label }} </q-item-section>
              </q-item>
            </q-list>
          </q-menu>
        </q-btn>
        <q-btn label="OuterLink" icon="link">
          <q-menu>
            <q-list>
              <q-item
                v-for="os in outers"
                :key="os.label"
                clickable
                v-ripple
                :href="os.link"
                target="_blank"
              >
                <q-item-section avatar>
                  <q-icon :name="os.icon" />
                </q-item-section>
                <q-item-section>{{ os.label }}</q-item-section>
              </q-item>
            </q-list>
          </q-menu>
        </q-btn>
        <q-space />
        <!-- <q-btn dense flat icon="minimize" @click="minimize" />
        <q-btn dense flat icon="crop_square" @click="maxmize" />
        <q-btn dense flat icon="close" @click="closeApp" /> -->
      </q-bar>
      <MarqueeBar />
    </q-header>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import MarqueeBar from 'src/components/MarqueeBar.vue';

// const closeApp = () => {
//   window.close();
// };

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
  {
    label: '輪盤',
    icon: 'casino',
    to: 'luckywheel',
  },
  {
    label: '圖片預覽',
    icon: 'image',
    to: 'imgpreview',
  },
  {
    label: '氣象預報',
    icon: 'cloud',
    to: 'pre36',
  },
];

const outers = [
  {
    label: 'TinyMind',
    icon: 'psychology',
    link: 'https://tinymind.me/looperhuang',
  },
  {
    label: 'fre321',
    icon: 'article',
    link: 'https://www.fre321.com/',
  },
];
</script>
