<template>
  <q-page class="q-pa-md">
    <div class="row q-col-gutter-md">
      <div class="col-md-2 col-sm-1 col-xs-0"></div>
      <div class="col-md-8 col-sm-10 col-xs-12">
        <q-card>
          <q-card-section>
            <div class="text-h5 text-bold text-center">Alarm Clock</div>
          </q-card-section>

          <q-card-section v-if="alarmTimes.length != 0">
            <q-list bordered>
              <q-item v-for="at in alarmTimes" :key="at.id" clickable>
                <q-item-section avatar>
                  <q-toggle v-model="at.enabled" />
                </q-item-section>
                <q-item-section class="text-body1">
                  {{ at.time }}
                </q-item-section>
                <q-item-section side>
                  <q-btn flat dense round icon="more_horiz">
                    <q-menu>
                      <q-list>
                        <q-item
                          clickable
                          v-close-popup
                          @click="openEditDialog(at.id)"
                        >
                          <q-item-section>編輯</q-item-section>
                        </q-item>
                        <q-item
                          clickable
                          v-close-popup
                          @click="removeAlarm(at.id)"
                        >
                          <q-item-section>刪除</q-item-section>
                        </q-item>
                      </q-list>
                    </q-menu>
                  </q-btn>
                </q-item-section>
              </q-item>
            </q-list>
          </q-card-section>

          <q-card-actions align="right">
            <q-btn
              color="primary"
              unelevated
              dense
              round
              icon="add"
              @click="openAddDialog()"
            />
          </q-card-actions>
        </q-card>
      </div>
      <div class="col-md-2 col-sm-1 col-xs-0"></div>
    </div>

    <q-dialog v-model="dialog.opened">
      <q-card class="q-pa-md" style="min-width: 350px">
        <q-card-section>
          <div class="text-h6 text-bold">
            {{ dialog.mode === 'add' ? '新增鬧鐘' : '編輯鬧鐘' }}
          </div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          <div class="row q-col-gutter-md">
            <div class="col">
              Hour
              <q-select v-model="alarmHour" filled :options="hourOptions" />
            </div>
            <div class="col">
              Minute
              <q-select v-model="alarmMinute" filled :options="minuteOptions" />
            </div>
          </div>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn
            unelevated
            label="確定"
            color="primary"
            @click="dialog.mode === 'add' ? addAlarm() : editAlarm(dialog.id)"
          />
          <q-btn unelevated label="取消" color="red" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>
    <div></div>
  </q-page>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { Notify } from 'quasar';
type alertTime = {
  id: number;
  time: string;
  active: boolean;
  enabled: boolean;
};

type alarmDialog = {
  id: number;
  opened: boolean;
  mode: 'add' | 'edit';
};

// 當前時間
const now = ref<Date>(new Date());

// 鬧鐘相關
const dialog = ref<alarmDialog>({ id: 0, opened: false, mode: 'add' });
const alarmHour = ref<string>('00');
const alarmMinute = ref<string>('00');
const alarmTimes = ref<alertTime[]>([]);
const alertCount = ref<number>(1);
const alarm = () => new Audio('src/assets/alarm.mp3').play();

// 新增鬧鐘
const openAddDialog = () => {
  alarmHour.value = '00';
  alarmMinute.value = '00';
  dialog.value = { id: 0, opened: true, mode: 'add' };
};
const addAlarm = () => {
  const newAlarmTime = `${alarmHour.value}:${alarmMinute.value}`;
  if (alarmTimes.value.some((alram) => alram.time === newAlarmTime)) {
    Notify.create({ type: 'negative', message: '已設定此時間鬧鐘' });
    return;
  }
  alarmTimes.value.push({
    id: alertCount.value,
    time: newAlarmTime,
    active: true,
    enabled: true,
  });
  alertCount.value++;
  dialog.value.opened = false;
};

// 刪除鬧鐘
const removeAlarm = (id: number) => {
  alarmTimes.value = alarmTimes.value.filter((alarm) => alarm.id !== id);
};

// 編輯鬧鐘
const openEditDialog = (id: number) => {
  const alarmToEdit = alarmTimes.value.find((alarm) => alarm.id === id);
  if (alarmToEdit) {
    alarmHour.value = alarmToEdit.time.slice(0, 2);
    alarmMinute.value = alarmToEdit.time.slice(3, 5);
    dialog.value = { id, opened: true, mode: 'edit' };
  }
};
const editAlarm = (id: number) => {
  const alarmToEdit = alarmTimes.value.find((alarm) => alarm.id === id);
  if (alarmToEdit) {
    const newEditTime = `${alarmHour.value}:${alarmMinute.value}`;
    if (alarmTimes.value.some((alram) => alram.time === newEditTime)) {
      Notify.create({ type: 'negative', message: '已設定此時間鬧鐘' });
      return;
    }
    alarmToEdit.time = newEditTime;
    alarmToEdit.active = true;
    alarmToEdit.enabled = true;
    dialog.value.opened = false;
  }
};

onMounted(() => {
  // 每分鐘檢查
  window.setInterval(() => {
    now.value = new Date();
    const currentTime = now.value.toTimeString().slice(0, 5); // 格式 HH:mm
    alarmTimes.value.forEach((alarmTime) => {
      if (
        alarmTime.enabled &&
        alarmTime.active &&
        alarmTime.time === currentTime
      ) {
        alarm();
        Notify.create({
          type: 'positive',
          message: `🔔 鬧鐘響了！時間為 ${currentTime}`,
        });
        alarmTime.active = false;
        setTimeout(() => {
          // 一分鐘後重置
          alarmTime.active = true;
        }, 60000);
      }
    });
  }, 1000);
});

const hourOptions = Array.from({ length: 24 }, (_, i) =>
  i.toString().padStart(2, '0')
);
const minuteOptions = Array.from({ length: 60 }, (_, i) =>
  i.toString().padStart(2, '0')
);
</script>

<style scoped></style>
