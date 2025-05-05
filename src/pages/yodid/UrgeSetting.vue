<template>
  <el-card>
    稽催設定

    <el-row>
      <el-col :span="12">
        <el-checkbox-group v-model="urge.type">
          <el-text>通知類型 : </el-text>
          <el-checkbox
            v-for="item in urgeTypes"
            :key="item"
            :label="item"
            :value="item"
          />
        </el-checkbox-group>
        <el-radio-group v-model="urge.content.type">
          <el-text>通知內容 : </el-text>
          <el-radio value="S">公版</el-radio>
          <FileSelect v-model="urge.content.template" />
          <el-radio value="C">表單自訂</el-radio>
        </el-radio-group>
        <div style="height: 50px"></div>
        <div>
          <el-text>逾時規則</el-text>
          <div>
            <el-text>簽核任務送達後超過</el-text>
            <el-input v-model="urge.rule.timeout.hour" style="width: 50px" />
            <el-text>小時</el-text>
            <el-input v-model="urge.rule.timeout.minute" style="width: 50px" />
            <el-text>分鐘視為逾時</el-text>
          </div>
          <div>
            <el-checkbox v-model="urge.rule.repeat.enable"> 重複通知 </el-checkbox>
            <el-text>每</el-text>
            <el-input v-model="urge.rule.repeat.hour" style="width: 50px" />
            <el-text>小時</el-text>
            <el-input v-model="urge.rule.repeat.minute" style="width: 50px" />
            <el-text>分鐘一次</el-text>
          </div>
          <div>
            <el-checkbox v-model="urge.rule.maxRepeat.enable"> 通知主管 </el-checkbox>
            <el-text>重複通知超過</el-text>
            <el-input v-model="urge.rule.maxRepeat.count" style="width: 50px" />
            <el-text>次後通知主管</el-text>
          </div>
        </div>
      </el-col>
      <el-col :span="12">
        <el-text>逾時時間依據</el-text>
        <div style="height: 20px"></div>
        <div>
          <el-button :icon="Plus" size="large" type="warning"></el-button>
          <el-table :data="urge.according" border style="width: 100%">
            <el-table-column prop="company" label="公司別" width="100px" />
            <el-table-column label="僅上班時間" width="120px">
              <template #default="scope">
                <el-checkbox v-model="scope.row.atWork">僅上班時間</el-checkbox>
              </template>
            </el-table-column>
            <el-table-column label="工作曆" width="150px">
              <template #default="scope">
                <el-select v-model="scope.row.sheet">
                  <el-option
                    v-for="item in defaultOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </template>
            </el-table-column>
            <el-table-column label="上下班起訖">
              <template #default="scope">
                <el-time-select
                  v-model="scope.row.startTime"
                  style="width: 120px"
                  start="08:30"
                  step="00:15"
                  end="18:30"
                  placeholder="Select time"
                />
                ~
                <el-time-select
                  v-model="scope.row.endTime"
                  style="width: 120px"
                  start="08:30"
                  step="00:15"
                  end="18:30"
                  placeholder="Select time"
                />
              </template>
            </el-table-column>
          </el-table>
        </div>
      </el-col>
    </el-row>
  </el-card>
</template>

<script setup lang="ts">
import { useVModel } from "@vueuse/core";
import type { Urge } from "./models/Urge";
import FileSelect from "./components/FileSelector.vue";
import { Plus } from "@element-plus/icons-vue";
import { defaultOptions } from "./SelectOptions";
type Prop = { modelValue: Urge };
const props = withDefaults(defineProps<Prop>(), {
  modelValue: () => ({
    type: [],
    content: { type: "", template: null },
    rule: {
      timeout: { hour: 0, minute: 0 },
      repeat: { enable: false, hour: 0, minute: 0 },
      maxRepeat: { enable: false, count: 0 },
    },
    according: [],
  }),
});
const emit = defineEmits(["update:modelValue"]);
const urge = useVModel(props, "modelValue", emit);
const urgeTypes = ["EIP推播", "E-Mail", "簡訊"];
</script>

<style scoped></style>
