<template>
  <q-page class="q-pa-md">
    <div class="row justify-center">
      <div class="col-12 col-md-6 col-lg-4">
        <q-card class="webhook-card">
          <q-card-section class="text-center bg-primary text-white">
            <div class="text-h4 q-mb-xs">
              <q-icon name="webhook" class="q-mr-sm" size="sm" />
              WebHook 觸發器
            </div>
            <div class="text-subtitle2">發送資料至 Slack WebHook</div>
          </q-card-section>

          <q-card-section class="q-pa-lg">
            <q-form
              @submit="sendWebHook"
              @reset="resetForm"
              class="q-gutter-sm"
              ref="webhookForm"
            >
              <div class="row q-col-gutter-sm">
                <div class="col-6">
                  <q-input
                    v-model="webhookData.user"
                    label="使用者 *"
                    outlined
                    dense
                    :rules="[(val:string) => !!val || '請輸入使用者名稱']"
                  >
                    <template v-slot:prepend>
                      <q-icon name="person" />
                    </template>
                  </q-input>
                </div>

                <div class="col-6">
                  <q-input
                    v-model="webhookData.target"
                    label="目標 *"
                    outlined
                    dense
                    :rules="[(val:string) => !!val || '請輸入目標']"
                  >
                    <template v-slot:prepend>
                      <q-icon name="adjust" />
                    </template>
                  </q-input>
                </div>

                <div class="col-12">
                  <q-select
                    v-model="webhookData.action"
                    :options="actionOptions"
                    label="動作 *"
                    outlined
                    dense
                    :rules="[(val:string) => !!val || '請選擇動作']"
                  >
                    <template v-slot:prepend>
                      <q-icon name="settings" />
                    </template>
                  </q-select>
                </div>

                <div class="col-12">
                  <q-input
                    v-model="webhookData.content"
                    label="內容 *"
                    type="textarea"
                    outlined
                    rows="3"
                    :rules="[(val:string) => !!val || '請輸入內容']"
                  >
                    <template v-slot:prepend>
                      <q-icon name="description" />
                    </template>
                  </q-input>
                </div>
              </div>

              <div class="row q-gutter-sm">
                <q-btn
                  label="發送 Webhook"
                  type="submit"
                  color="primary"
                  icon="send"
                  class="col"
                  :loading="isLoading"
                  :disable="isLoading"
                >
                  <template v-slot:loading>
                    <q-spinner-hourglass />
                  </template>
                </q-btn>

                <q-btn
                  label="重設"
                  type="reset"
                  color="grey-7"
                  icon="refresh"
                  flat
                  :disable="isLoading"
                />
              </div>
            </q-form>
          </q-card-section>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { Notify } from 'quasar';
import { ref, reactive } from 'vue';

interface WebHookData {
  datetime: string;
  user: string;
  target: string;
  action: string;
  content: string;
}
const webHookUrl =
  'https://hooks.slack.com/triggers/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';

const webhookForm = ref();

// 響應式資料
const isLoading = ref(false);

const webhookData = reactive<WebHookData>({
  datetime: '',
  user: '',
  target: '',
  action: '',
  content: '',
});

const actionOptions = ['發動', '使用'];

const sendWebHook = async () => {
  try {
    isLoading.value = true;

    // 設置當下時間
    webhookData.datetime = new Date().toLocaleTimeString('zh-TW', {
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
    });

    const payload: WebHookData = {
      datetime: webhookData.datetime,
      user: webhookData.user,
      target: webhookData.target,
      action: webhookData.action,
      content: webhookData.content,
    };

    console.log('發送 Webhook 資料 : ', payload);

    // 發送 POST 請求到 Slack Webhook
    const response = await fetch(webHookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (response.ok) {
      // 顯示成功通知
      Notify.create({
        type: 'positive',
        message: 'Webhook 發送成功！',
        icon: 'check_circle',
        position: 'top',
        timeout: 3000,
      });

      // 重設表單
      resetForm();
    } else {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
  } catch (e) {
    console.error('Webhook 發送失敗 : ', e);
    Notify.create({
      type: 'negative',
      message: 'Webhook 發送失敗',
      icon: 'error',
      position: 'top',
      timeout: 5000,
    });
  } finally {
    isLoading.value = false;
  }
};

// 重設表單
const resetForm = () => {
  webhookData.user = '';
  webhookData.target = '';
  webhookData.action = '';
  webhookData.content = '';
  webhookForm.value.resetValidation();
};
</script>

<style scoped>
.webhook-card {
  max-width: 100%;
  border-radius: 16px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
  overflow: hidden;
}

.webhook-card .q-card__section--vert {
  padding: 24px;
}
</style>
