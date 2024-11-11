<template>
  <q-page class="q-pa-md flex flex-center">
    <div style="width: 80%" class="row q-col-gutter-md">
      <div class="col-12">
        <div class="text-center">
          <q-img
            v-if="src"
            :src="src"
            spinner-color="primary"
            style="max-width: 400px"
            :style="round ? 'border-radius: 50%' : ''"
          />
        </div>
      </div>
      <div class="col-12">
        <q-file
          filled
          v-model="file"
          label="上傳圖片"
          accept=".jpg, .pdf, image/*"
          clearable
          @update:model-value="fileUpload"
        >
          <template v-slot:prepend>
            <q-icon name="attach_file" />
          </template>
        </q-file>
        <q-toggle v-model="round" color="yellow" label="圓角" size="lg" />
      </div>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { ref } from 'vue';
const file = ref(null);
const src = ref('');
const round = ref(false);
const fileUpload = () => {
  if (!file.value) {
    src.value = '';
    return;
  }
  const img = URL.createObjectURL(file.value);
  src.value = img;
};
</script>

<style scoped></style>
