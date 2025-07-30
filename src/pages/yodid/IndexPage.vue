<template>
  <div class="q-pa-sm">
    <el-card>
      <el-row :gutter="20">
        <el-col :span="20">
          <el-row :gutter="20">
            <el-col :span="8">
              <el-text>場景代碼</el-text>
              <el-input v-model="data.env_code" />
            </el-col>
            <el-col :span="8">
              <el-text>場景名稱</el-text>
              <el-input v-model="data.env_name" />
            </el-col>
            <el-col :span="8">
              <el-row :gutter="20">
                <el-col :span="8">
                  <el-text>版本</el-text>
                  <el-input v-model="data.version" />
                </el-col>
                <el-col :span="8" style="align-self: end">
                  <el-button type="warning" :icon="Plus">新增版本</el-button>
                </el-col>
                <el-col :span="8" style="align-self: end">
                  <el-switch
                    v-model="data.enable"
                    style="
                      --el-switch-on-color: #13ce66;
                      --el-switch-off-color: #ff4949;
                    "
                    active-text="啟用"
                  />
                </el-col>
              </el-row>
            </el-col>
            <el-col :span="8">
              <el-text>生校起訖</el-text>
              <el-input v-model="data.start_date" :suffix-icon="Calendar" />
            </el-col>
            <el-col :span="8" style="align-self: end">
              <el-input v-model="data.end_date" :suffix-icon="Calendar" />
            </el-col>
            <el-col :span="8">
              <el-text>組織樹</el-text>
              <FileSelect v-model="data.tree" />
            </el-col>
            <el-col :span="8">
              <div>
                <el-text>按鈕文字樣板</el-text>
              </div>
              <el-select v-model="data.button_temp">
                <el-option
                  v-for="item in defaultOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-col>
            <el-col :span="16">
              <div>
                <el-text>重啟簽核流程設定</el-text>
              </div>
              <el-checkbox
                v-for="item in signSettings"
                :key="item.label"
                v-model="data[item.field]"
                size="large"
              >
                {{ item.label }}
              </el-checkbox>
            </el-col>
          </el-row>
        </el-col>

        <el-col :span="4">
          <el-space direction="vertical">
            <el-button
              v-for="item in settingBtns"
              :key="item.label"
              :icon="item.icon"
              type="warning"
              class="myButton"
            >
              {{ item.label }}
            </el-button>
          </el-space>
        </el-col>
      </el-row>

      <RequestSetting v-model="data.request" />
      <NotificationSetting v-model="data.notify" />
      <UrgeSetting v-model="data.urge" />

      <el-tabs v-model="activeName" class="demo-tabs">
        <el-tab-pane label="關卡" name="CheckPoint">
          <CheckPoint v-model="data.checkpoints" />
        </el-tab-pane>
        <el-tab-pane label="場景所需參數" name="ParamList">
          <ParamList />
        </el-tab-pane>
      </el-tabs>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import FileSelect from './components/FileSelector.vue';
import {
  Plus,
  Tools,
  VideoPlay,
  EditPen,
  Calendar,
} from '@element-plus/icons-vue';
import RequestSetting from './RequestSetting.vue';
import NotificationSetting from './NotificationSetting.vue';
import UrgeSetting from './UrgeSetting.vue';
import CheckPoint from './CheckPoint.vue';
import ParamList from './ParamList.vue';
import type { Form } from './models/Form';
import { fake } from './fakeData';
import { defaultOptions } from './SelectOptions';

const data = ref<Form>(fake);
const settingBtns = [
  { label: '場景參數設定', icon: Tools },
  { label: '流程繪製', icon: EditPen },
  { label: ' 流程模擬器', icon: VideoPlay },
];
const signSettings: { label: string; field: keyof Form }[] = [
  { label: '流程已成立後可再送單', field: 'accept' },
  { label: '流程已否決/抽單後可再送單', field: 'reject' },
];
const activeName = ref<string>('CheckPoint');
</script>

<style scoped>
.myButton {
  text-align: left;
  width: 150px;
  height: 50px;
}
</style>
