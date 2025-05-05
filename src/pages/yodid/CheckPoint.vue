<template>
  <el-table :data="checkpoints" border style="width: 100%">
    <el-table-column
      v-for="col in columns"
      :key="col.label"
      :prop="col.field"
      :label="col.label"
    />
  </el-table>
</template>

<script setup lang="ts">
import type { CheckPoint } from './models/CheckPoint';
import { useVModel } from '@vueuse/core';
type Prop = { modelValue: CheckPoint[] };
const props = withDefaults(defineProps<Prop>(), {
  modelValue: () => [],
});
const emit = defineEmits(['update:modelValue']);
const checkpoints = useVModel(props, 'modelValue', emit);
const columns = [
  { label: '關號', field: 'id' },
  { label: '關卡名稱', field: 'name' },
  { label: '類別', field: 'type' },
  { label: '關卡簽核者', field: 'checker' },
  { label: '擁有者/規則編號', field: 'owner' },
  { label: '參考表單參數', field: 'referParam' },
  { label: '參考關號', field: 'referId' },
  { label: '關卡狀態代碼', field: 'status' },
  { label: '下一關號(Y)', field: 'nextId_Y' },
  { label: '下一關號(N)', field: 'nextId_N' },
  { label: '按鈕文字樣板', field: 'template' },
];
</script>

<style scoped></style>
