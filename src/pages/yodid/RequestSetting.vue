<template>
  <el-card class="request-container">
    <div>請示設定</div>

    <el-row :gutter="20">
      <el-col :span="4">
        <el-switch
          v-model="request.enable"
          style="--el-switch-on-color: #13ce66; --el-switch-off-color: #ff4949"
          active-text="啟用"
          @change="onSwitchChange"
        />
      </el-col>
      <el-col :span="20">
        <el-text>於流程結束前加入請示關卡，該關卡可執行動作</el-text>
        <el-checkbox-group v-model="request.list" @change="onCheckboxChange">
          <el-checkbox
            v-for="(item, idx) in checkboxes"
            :key="idx"
            :disabled="!request.enable"
            :label="item"
            :value="item"
          />
        </el-checkbox-group>
        <el-select
          v-model="request.other"
          :disabled="!request.list.includes('退回指定關卡')"
          placeholder="Select"
          style="width: 240px"
        >
          <el-option
            v-for="item in defaultOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-col>
    </el-row>
  </el-card>
</template>

<script setup lang="ts">
import { useVModel } from '@vueuse/core';
import type { Request } from './models/Request';
import { defaultOptions } from './SelectOptions';
type Prop = { modelValue: Request };
const props = withDefaults(defineProps<Prop>(), {
  modelValue: () => ({
    enable: true,
    list: [],
    other: '',
  }),
});
const emit = defineEmits(['update:modelValue']);
const request = useVModel(props, 'modelValue', emit);
const checkboxes = [
  '同意',
  '不同意',
  '否決(終止流程)',
  '填單人抽單',
  '申請人抽單',
  '簽核者抽單',
  '退回任一關卡',
  '退回指定關卡',
];
const onCheckboxChange = () => {
  if (!request.value.list.includes('退回指定關卡')) request.value.other = '';
};
const onSwitchChange = () => {
  request.value.list = [];
  request.value.other = '';
};
</script>

<style scoped>
.request-container {
  margin-top: 10px;
  margin-bottom: 10px;
}
</style>
