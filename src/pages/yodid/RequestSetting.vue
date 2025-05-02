<template>
  <el-card class="request-container">
    <div>請示設定</div>

    <el-row :gutter="20">
      <el-col :span="4">
        <el-switch
          v-model="enable"
          style="--el-switch-on-color: #13ce66; --el-switch-off-color: #ff4949"
          active-text="啟用"
          @change="onSwitchChange"
        />
      </el-col>
      <el-col :span="20">
        <el-text>於流程結束前加入請示關卡，該關卡可執行動作</el-text>
        <el-checkbox-group v-model="list" @change="onCheckboxChange">
          <el-checkbox
            v-for="(item, idx) in checkboxes"
            :key="idx"
            :disabled="!enable"
            :label="item"
            :value="item"
          />
        </el-checkbox-group>
        <el-select
          v-model="other"
          :disabled="!list.includes('退回指定關卡')"
          placeholder="Select"
          style="width: 240px"
        >
          <el-option
            v-for="item in options"
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
import { computed } from 'vue';
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
const options = [
  {
    value: 'Option1',
    label: 'Option1',
  },
  {
    value: 'Option2',
    label: 'Option2',
  },
  {
    value: 'Option3',
    label: 'Option3',
  },
  {
    value: 'Option4',
    label: 'Option4',
  },
  {
    value: 'Option5',
    label: 'Option5',
  },
];
type Prop = {
  requestEnable: boolean;
  requestList: string[];
  requestOther: string;
};
const props = withDefaults(defineProps<Prop>(), {
  requestEnable: true,
  requestList: () => [],
  requestOther: '',
});
const emit = defineEmits<{
  (e: 'update:requestEnable', v: boolean): void;
  (e: 'update:requestList', v: string[]): void;
  (e: 'update:requestOther', v: string): void;
}>();
const enable = computed<boolean>({
  get: () => props.requestEnable,
  set: (v) => emit('update:requestEnable', v),
});
const list = computed<string[]>({
  get: () => props.requestList,
  set: (v) => emit('update:requestList', v),
});
const other = computed<string>({
  get: () => props.requestOther,
  set: (v) => emit('update:requestOther', v),
});
const onCheckboxChange = () => {
  if (!list.value.includes('退回指定關卡')) other.value = '';
};
const onSwitchChange = () => {
  list.value = [];
  other.value = '';
};
</script>

<style scoped>
.request-container {
  margin-top: 10px;
  margin-bottom: 10px;
}
</style>
