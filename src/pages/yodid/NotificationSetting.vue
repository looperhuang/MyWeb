<template>
  <el-card class="notify-container">
    <div>通知設定</div>
    <div>通知類型</div>
    <div>
      <el-checkbox-group v-model="notify.type">
        <el-checkbox
          v-for="(item, idx) in checkboxes"
          :key="idx"
          :label="item"
          :value="item"
        />
      </el-checkbox-group>
    </div>
    <div>
      <el-row style="margin-bottom: 20px">
        <el-col :span="12"> 發送通知 </el-col>
        <el-col :span="12"> 通知對象(起始關卡) </el-col>
      </el-row>
      <template v-for="item in notify.detail" :key="item.label">
        <el-row>
          <el-col :span="2">
            <el-checkbox
              v-model="item.enabled"
              :label="item.label"
              @change="onChboxChange(item)"
            />
          </el-col>
          <el-col :span="2" style="align-self: center">
            <el-text>通知內容 : </el-text>
          </el-col>
          <el-col :span="8">
            <el-radio-group v-model="item.type" :disabled="!item.enabled">
              <el-radio value="S">公版</el-radio>
              <FileSelect
                v-model="item.template"
                :disable="!(item.type == 'S')"
              />
              <el-radio value="C">表單自訂</el-radio>
            </el-radio-group>
          </el-col>
          <el-col :span="12">
            <template v-if="item.receiver">
              <el-checkbox-group v-model="item.receiver">
                <el-checkbox
                  v-for="(cbx, idx) in receivers"
                  :key="idx"
                  :disabled="!item.enabled"
                  :label="cbx"
                  :value="cbx"
                />
              </el-checkbox-group>
            </template>
          </el-col>
        </el-row>
        <el-divider border-style="dashed" />
      </template>
    </div>
  </el-card>
</template>

<script setup lang="ts">
import { useVModel } from '@vueuse/core';
import type { Notify, NotifyDetail } from './models/Notify';
import FileSelect from './components/FileSelector.vue';
const checkboxes = ['EIP推播', 'E-Mail', '簡訊'];
const receivers = ['填單人', '申請人'];
type Prop = { modelValue: Notify };
const props = withDefaults(defineProps<Prop>(), {
  modelValue: () => ({
    type: [],
    detail: [],
  }),
});
const emit = defineEmits(['update:modelValue']);
const notify = useVModel(props, 'modelValue', emit);
const onChboxChange = (item: NotifyDetail) => {
  if (!item.enabled) {
    item.type = '';
    item.template = null;
    item.receiver = [];
  }
};
</script>

<style scoped>
.notify-container {
  margin-top: 10px;
  margin-bottom: 10px;
}
</style>
