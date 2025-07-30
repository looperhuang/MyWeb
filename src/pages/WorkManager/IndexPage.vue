<template>
  <q-page class="q-pa-md">
    <q-card class="task-manager-card q-pa-md" flat bordered>
      <!-- 標題列 -->
      <div class="row items-center justify-between q-mb-md">
        <div class="text-h5 text-weight-medium">
          <q-icon name="work" class="q-mr-sm" />
          工作管理
        </div>

        <!-- 黑暗模式切換按鈕 -->
        <q-btn
          flat
          round
          :icon="$q.dark.isActive ? 'nights_stay' : 'wb_sunny'"
          @click="toggleDarkMode"
          class="mode-toggle"
        >
          <q-tooltip>
            {{ $q.dark.isActive ? '切換到明亮模式' : '切換到黑暗模式' }}
          </q-tooltip>
        </q-btn>
      </div>

      <!-- 統計資訊 -->
      <div class="stats-container q-mb-md">
        <q-chip outline color="primary" icon="list_alt" class="stat-chip">
          總計 : {{ tasks.length }} 項工作
        </q-chip>
      </div>

      <!-- 新增工作區域 -->
      <div class="add-task-section q-my-md">
        <div class="row q-col-gutter-sm">
          <div class="col">
            <q-input
              v-model="newTask"
              label="新增工作項目"
              aria-placeholder="輸入工作項目..."
              outlined
              clearable
              class="task-input"
              @keyup.enter="addTask"
            >
              <template v-slot:prepend>
                <q-icon name="add_task" />
              </template>
            </q-input>
          </div>
          <div class="col-auto">
            <q-btn
              label="新增"
              color="primary"
              icon="add"
              @click="addTask"
              :disable="!newTask.trim()"
              class="add-btn"
              unelevated
            />
          </div>
        </div>
      </div>

      <!-- 工作列表 -->
      <div class="task-list-container">
        <q-list bordered separator class="task-list">
          <q-item
            v-for="(task, index) in tasks"
            :key="index"
            class="task-item"
            :class="{ completed: task.completed }"
          >
            <!-- 完成狀態切換 -->
            <q-item-section side>
              <q-checkbox
                v-model="task.completed"
                @update:model-value="saveTasks"
                color="positive"
              />
            </q-item-section>

            <!-- 工作內容 -->
            <q-item-section>
              <q-input
                v-model="task.name"
                @blur="saveTasks"
                dense
                borderless
                :class="{ 'completed-text': task.completed }"
                class="task-name-input"
              />
            </q-item-section>

            <!-- 操作按鈕 -->
            <q-item-section side>
              <div class="row q-gutter-xs">
                <q-btn
                  flat
                  round
                  dense
                  icon="delete"
                  color="negative"
                  size="sm"
                  @click="confirmRemoveTask(index)"
                >
                  <q-tooltip>刪除</q-tooltip>
                </q-btn>
              </div>
            </q-item-section>
          </q-item>
        </q-list>

        <!-- 空狀態 -->
        <div v-if="tasks.length === 0" class="empty-state text-center q-pa-xl">
          <q-icon name="inbox" size="4rem" color="grey-5" />
          <div class="text-h6 text-grey-6 q-mt-md">還沒有工作項目</div>
          <div class="text-body2 text-grey-5">開始新增您的第一個工作吧！</div>
        </div>
      </div>

      <!-- 批量操作 -->
      <div v-if="tasks.length > 0" class="batch-actions q-mt-md">
        <q-separator class="q-mb-md" />
        <div class="row q-gutter-sm justify-center">
          <q-btn
            flat
            label="全部完成"
            icon="done_all"
            color="positive"
            @click="markAllCompleted"
            size="sm"
          />
          <q-btn
            flat
            label="清除已完成"
            icon="clear"
            color="orange"
            @click="clearCompleted"
            size="sm"
            :disable="!hasCompletedTasks"
          />
          <q-btn
            flat
            label="清空全部"
            icon="delete_sweep"
            color="negative"
            @click="confirmClearAll"
            size="sm"
          />
        </div>
      </div>
    </q-card>

    <!-- 刪除確認對話框 -->
    <q-dialog v-model="showDeleteDialog" persistent>
      <q-card>
        <q-card-section class="row items-center">
          <q-avatar icon="delete" color="negative" text-color="white" />
          <span class="q-ml-sm">確定要刪除這個工作項目嗎？</span>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="取消" color="primary" v-close-popup />
          <q-btn
            flat
            label="確定刪除"
            color="negative"
            @click="removeTask(taskToDelete)"
            v-close-popup
          />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- 清空全部確認對話框 -->
    <q-dialog v-model="showClearAllDialog" persistent>
      <q-card>
        <q-card-section class="row items-center">
          <q-avatar icon="warning" color="orange" text-color="white" />
          <span class="q-ml-sm"
            >確定要清空所有工作項目嗎？此操作無法復原。</span
          >
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="取消" color="primary" v-close-popup />
          <q-btn
            flat
            label="確定清空"
            color="negative"
            @click="clearAllTasks"
            v-close-popup
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import CryptoJS from 'crypto-js';
import { useQuasar } from 'quasar';

interface Task {
  name: string;
  completed: boolean;
  createdAt: Date;
}

const $q = useQuasar();
const newTask = ref('');
const tasks = ref<Task[]>([]);
const showDeleteDialog = ref(false);
const showClearAllDialog = ref(false);
const taskToDelete = ref<number | null>(null);

// 計算屬性
const hasCompletedTasks = computed(() => {
  return tasks.value.some((task) => task.completed);
});

const STORAGE_KEY = 'taskData';
const SECRET_KEY = import.meta.env.VITE_WORK_SECRETKEY;

const encryptData = (data: string) => {
  return CryptoJS.AES.encrypt(data, SECRET_KEY).toString();
};

const decryptData = (cipherText: string) => {
  const bytes = CryptoJS.AES.decrypt(cipherText, SECRET_KEY);
  return bytes.toString(CryptoJS.enc.Utf8);
};

const toggleDarkMode = () => {
  $q.dark.toggle();
  localStorage.setItem('darkMode', $q.dark.isActive ? 'true' : 'false');

  $q.notify({
    type: 'info',
    message: $q.dark.isActive ? '已切換到黑暗模式' : '已切換到明亮模式',
    position: 'top',
  });
};

// 保存工作到本地存儲
const saveTasks = () => {
  const data = JSON.stringify(tasks.value);
  const encryptedData = encryptData(data);
  localStorage.setItem(STORAGE_KEY, encryptedData);
};

// 從本地存儲載入工作
const loadTasks = () => {
  const encryptedData = localStorage.getItem(STORAGE_KEY);
  if (encryptedData) {
    try {
      const decryptedData = decryptData(encryptedData);
      tasks.value = JSON.parse(decryptedData);
    } catch (e) {
      console.error('解密失敗', e);
      tasks.value = [];
    }
  }
};

// 新增工作
const addTask = () => {
  if (newTask.value.trim()) {
    tasks.value.push({
      name: newTask.value.trim(),
      completed: false,
      createdAt: new Date(),
    });
    newTask.value = '';
    saveTasks();

    $q.notify({
      type: 'positive',
      message: '工作項目已新增',
      position: 'top',
    });
  }
};

// 確認刪除工作
const confirmRemoveTask = (index: number) => {
  taskToDelete.value = index;
  showDeleteDialog.value = true;
};

// 刪除工作
const removeTask = (index: number | null) => {
  if (index === null) return;
  tasks.value.splice(index, 1);
  saveTasks();

  $q.notify({
    type: 'negative',
    message: '工作項目已刪除',
    position: 'top',
  });
};

// 標記所有工作為完成
const markAllCompleted = () => {
  tasks.value.forEach((task) => {
    task.completed = true;
  });
  saveTasks();

  $q.notify({
    type: 'positive',
    message: '所有工作已標記為完成',
    position: 'top',
  });
};

// 清除已完成的工作
const clearCompleted = () => {
  const completedCount = tasks.value.filter((task) => task.completed).length;
  tasks.value = tasks.value.filter((task) => !task.completed);
  saveTasks();

  $q.notify({
    type: 'info',
    message: `已清除 ${completedCount} 個已完成的工作`,
    position: 'top',
  });
};

// 確認清空所有工作
const confirmClearAll = () => {
  showClearAllDialog.value = true;
};

// 清空所有工作
const clearAllTasks = () => {
  tasks.value = [];
  saveTasks();

  $q.notify({
    type: 'warning',
    message: '所有工作項目已清空',
    position: 'top',
  });
};
// 初始化
onMounted(() => {
  loadTasks();

  // 載入黑暗模式設定
  const savedDarkMode = localStorage.getItem('darkMode');
  if (savedDarkMode === 'true') {
    $q.dark.set(true);
  }
});
</script>

<style scoped>
.task-manager-card {
  max-width: 800px;
  margin: 0 auto;
  background: var(--q-card-background);
  transition: all 0.3s ease;
}

.mode-toggle {
  transition: all 0.3s ease;
}

.mode-toggle:hover {
  transform: scale(1.1);
}

.stats-container {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.stat-chip {
  font-weight: 500;
}

.add-task-section {
  background: rgba(var(--q-primary-rgb), 0.05);
  border-radius: 8px;
  padding: 16px;
  border: 1px solid rgba(var(--q-primary-rgb), 0.1);
}

.task-input {
  transition: all 0.3s ease;
}

.add-btn {
  height: 56px;
  min-width: 100px;
  font-weight: 500;
}
</style>
