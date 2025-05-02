<template>
  <q-page class="q-pa-md">
    <div class="row q-col-gutter-md">
      <div class="col-md-2 col-sm-1 col-xs-0"></div>
      <div class="col-md-8 col-sm-10 col-xs-12">
        <q-card>
          <q-card-section>
            <div class="text-h5 text-center">Count Down</div>
          </q-card-section>

          <q-card-section>
            <div class="row q-col-gutter-md">
              <div class="col-md-4">
                <q-input filled v-model="setHour" type="number" label="Hour" />
              </div>
              <div class="col-md-4">
                <q-input
                  filled
                  v-model="setMinute"
                  type="number"
                  label="Minute"
                />
              </div>
              <div class="col-md-4">
                <q-input
                  filled
                  v-model="setSecond"
                  type="number"
                  label="Second"
                />
              </div>
            </div>
          </q-card-section>

          <q-card-actions align="center">
            <q-btn
              unelevated
              :icon="counting ? 'pause' : 'play_arrow'"
              @click="counting ? stopCount() : startCount()"
              color="primary"
            />
          </q-card-actions>
        </q-card>
      </div>
      <div class="col-md-2 col-sm-1 col-xs-0"></div>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { ref } from 'vue';
const counting = ref<boolean>(false);
const setHour = ref<number>(0);
const setMinute = ref<number>(0);
const setSecond = ref<number>(0);
const id = ref<number>(0);

const startCount = () => {
  id.value = window.setInterval(() => {
    console.log('counting');
  }, 1000);
  counting.value = true;
};

const stopCount = () => {
  window.clearInterval(id.value);
  counting.value = false;
};
</script>

<style scoped></style>
