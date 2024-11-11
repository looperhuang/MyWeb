<template>
  <q-page class="q-pa-md flex flex-center">
    <div style="width: 90%">
      <div class="row q-col-gutter-md">
        <div class="col-4">
          <div class="q-gutter-md">
            <div class="text-h6 text-bold">Options</div>
            <q-toggle
              :label="'CursorPosition: ' + cursorPosition"
              false-value="edge"
              true-value="center"
              v-model="cursorPosition"
            />

            <q-input
              type="number"
              filled
              label="CursorAngle"
              v-model="cursorAngle"
            />

            <q-input
              type="number"
              filled
              label="CursorDistance"
              v-model="cursorDistance"
            />

            <q-list bordered separator>
              <q-item v-for="(s, idx) in slices" :key="idx" clickable>
                <q-item-section avatar>
                  <q-icon name="circle" :style="`color: ${s.color}`">
                    <q-popup-proxy
                      cover
                      transition-show="scale"
                      transition-hide="scale"
                    >
                      <q-color v-model="s.color" />
                    </q-popup-proxy>
                  </q-icon>
                </q-item-section>
                <q-item-section>
                  <q-input filled v-model="s.text" />
                </q-item-section>
                <q-item-section side>
                  <q-btn
                    flat
                    round
                    icon="delete"
                    color="negative"
                    @click="removeSlice(idx)"
                  />
                </q-item-section>
              </q-item>
            </q-list>
            <div class="text-right">
              <q-btn label="Add" color="green" @click="addSlice" />
            </div>
          </div>
        </div>
        <div class="col-8" style="justify-items: center; align-self: center">
          <VueWheelSpinner
            style="max-width: 600px"
            ref="spinner"
            :slices="slices"
            :winner-index="defaultWinner"
            :sounds="sounds"
            :cursor-angle="cursorAngle"
            :cursor-position="cursorPosition"
            :cursor-distance="cursorDistance"
            @spin-start="onSpinStart"
            @spin-end="onSpinEnd"
          >
            <template #cursor>
              <img
                class="cursor-img"
                :src="cursorImage"
                alt="Cursor"
                style="rotate: 180deg"
              />
            </template>

            <template #default>
              <q-btn
                round
                class="spin-button"
                :disabled="isSpinning"
                @click="handleSpinButtonClick"
                @mouseover="handleSpinButtonHover"
                @mouseleave="handleSpinButtonLeave"
                color="orange"
                label="Spin"
              />
            </template>
          </VueWheelSpinner>
        </div>
      </div>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import VueWheelSpinner, { Slice, Sounds } from 'src/components/SpinWheel.vue';
import { Dialog } from 'quasar';

const spinner = ref<InstanceType<typeof VueWheelSpinner> | null>(null);
const cursorImage = ref<string>('src/assets/arrow.png');
const slices = ref<Slice[]>([
  { color: '#eb4d4b', text: 'Slice 1' },
  { color: '#f0932b', text: 'Slice 2' },
  { color: '#f9ca24', text: 'Slice 3' },
  { color: '#badc58', text: 'Slice 4' },
  { color: '#7ed6df', text: 'Slice 5' },
  { color: '#e056fd', text: 'Slice 6' },
]);
const defaultWinner = ref<number>(0);
const sounds = <Sounds | null>null;
const cursorAngle = ref<number>(0);
const cursorPosition = ref<'center' | 'edge'>('edge');
const cursorDistance = ref<number>(0);
const winnerResult = ref<Slice | null>(null);
const isSpinning = ref(false);

const addSlice = () => {
  slices.value.push({
    color: '#eb4d4b',
    text: 'New Slice',
  });
};

const removeSlice = (index: number) => {
  slices.value.splice(index, 1);
};

const playAudio = (audio: HTMLAudioElement) => {
  audio.volume = 0.5;
  audio.play();
};

const onSpinStart = () => {
  winnerResult.value = null;
  isSpinning.value = true;
};

const onSpinEnd = (winnerIndex: number) => {
  isSpinning.value = false;
  winnerResult.value = slices.value[winnerIndex];
  Dialog.create({
    title: 'Winner',
    message: `You won ${winnerResult.value.text}!`,
  });
};

const handleSpinButtonClick = () => {
  if (sounds?.spinButtonClick) playAudio(sounds.spinButtonClick);
  if (spinner.value) {
    const randomIndex = Math.floor(Math.random() * slices.value.length);
    spinner.value.spinWheel(randomIndex);
  }
};

function handleSpinButtonHover() {
  if (sounds?.spinButtonHover) playAudio(sounds.spinButtonHover);
}

function handleSpinButtonLeave() {
  if (sounds?.spinButtonLeave) playAudio(sounds.spinButtonLeave);
}
</script>

<style scoped></style>
