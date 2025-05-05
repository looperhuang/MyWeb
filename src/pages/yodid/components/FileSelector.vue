<template>
  <div>
    <el-input :model-value="fileData?.name || ''" readonly>
      <template #append>
        <el-button @click="openFileDialog" class="upload_btn">...</el-button>
      </template>
    </el-input>

    <!-- 隱藏的原生 file input -->
    <input
      ref="uploadRef"
      type="file"
      class="hidden"
      @change="handleFileChange"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
type Prop = {
  modelValue: File | null;
};
const props = withDefaults(defineProps<Prop>(), {
  modelValue: null,
});
const emit = defineEmits(['update:modelValue']);
const fileData = computed({
  get: () => props.modelValue,
  set: (v) => emit('update:modelValue', v),
});
const uploadRef = ref<HTMLInputElement | null>();
const openFileDialog = () => {
  uploadRef.value?.click();
};
const handleFileChange = (event: Event) => {
  const target = event.target as HTMLInputElement;
  const files = target.files;
  if (files && files.length > 0) {
    fileData.value = files[0];
  }
};
</script>

<style scoped>
.upload_btn {
  background-color: orange !important;
  color: white !important;
}
.hidden {
  display: none;
}
</style>
