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
                    style="--el-switch-on-color: #13ce66; --el-switch-off-color: #ff4949"
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
              <el-input v-model="data.tree">
                <template #append>
                  <el-button style="background-color: orange; color: white"
                    >...</el-button
                  >
                </template>
              </el-input>
            </el-col>
            <el-col :span="8">
              <div>
                <el-text>按鈕文字樣板</el-text>
              </div>
              <el-select v-model="data.button_temp">
                <el-option
                  v-for="item in options"
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
                v-model="data.accept"
                label="流程已成立後可再送單"
                size="large"
              />
              <el-checkbox
                v-model="data.reject"
                label="流程已否決/抽單後可再送單"
                size="large"
              />
            </el-col>
          </el-row>
        </el-col>

        <el-col :span="4">
          <el-space direction="vertical">
            <el-button type="warning" class="myButton" :icon="Tools">
              場景參數設定
            </el-button>

            <el-button type="warning" class="myButton" :icon="EditPen">
              流程繪製
            </el-button>

            <el-button type="warning" class="myButton" :icon="VideoPlay">
              流程模擬器
            </el-button>
          </el-space>
        </el-col>
      </el-row>

      <RequestSetting
        v-model:requestEnable="data.requestEnable"
        v-model:requestList="data.requestList"
        v-model:requestOther="data.requestOther"
      />

      <NotificationSetting
        v-model:notify-type="data.notifyType"
        v-model:notify-detail="data.notifyDetail"
      />
    </el-card>

    {{ data }}
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { Plus, Tools, VideoPlay, EditPen, Calendar } from "@element-plus/icons-vue";
import RequestSetting from "./RequestSetting.vue";
import NotificationSetting from "./NotificationSetting.vue";
import type { Form } from "./models/Form";
import { fake } from "./fakeData";

const data = ref<Form>(fake);

const options = [
  {
    value: "Option1",
    label: "Option1",
  },
  {
    value: "Option2",
    label: "Option2",
  },
  {
    value: "Option3",
    label: "Option3",
  },
  {
    value: "Option4",
    label: "Option4",
  },
  {
    value: "Option5",
    label: "Option5",
  },
];
</script>

<style scoped>
.ButtonSide {
  margin-bottom: 20px;
}
.myButton {
  text-align: left;
  width: 150px;
  height: 50px;
}
</style>
