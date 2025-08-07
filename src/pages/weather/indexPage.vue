<template>
  <q-page class="q-pa-md">
    <div class="text-h4 text-center q-mb-lg text-primary">
      <q-icon name="wb_sunny" class="q-mr-sm" />
      天氣預報
    </div>

    <!-- 載入中狀態 -->
    <div v-if="loading" class="text-center q-pa-xl">
      <q-spinner-dots size="50px" color="primary" />
      <div class="q-mt-md">載入天氣資料中...</div>
    </div>

    <!-- 錯誤狀態 -->
    <q-banner v-else-if="error" class="text-white bg-negative q-mb-md" rounded>
      <q-icon name="warning" class="q-mr-sm" />
      {{ error }}
    </q-banner>

    <!-- 天氣資料展示 -->
    <div v-else-if="weatherData && weatherData.success">
      <!-- 地區選擇 -->
      <div class="q-mb-lg">
        <q-select
          v-model="selectedLocation"
          :options="locationOptions"
          label="選擇地區"
          outlined
          emit-value
          map-options
          class="q-mb-md"
        />
      </div>

      <!-- 當前選中地區的天氣 -->
      <div v-if="currentLocation" class="row q-col-gutter-md">
        <div class="col-12">
          <q-card class="location-header">
            <q-card-section>
              <div class="text-h5 text-weight-bold">
                <q-icon name="place" class="q-mr-sm" />
                {{ currentLocation.LocationName }}
              </div>
              <div class="text-subtitle2 text-grey-6">
                座標: {{ currentLocation.Latitude }},
                {{ currentLocation.Longitude }}
              </div>
            </q-card-section>
          </q-card>
        </div>
      </div>

      <!-- 天氣要素卡片 -->
      <div
        class="q-mt-md"
        v-for="(element, index) in currentLocation?.WeatherElement"
        :key="index"
      >
        <q-card class="weather-element-card">
          <q-card-section>
            <div class="row items-center justify-between">
              <div>
                <div class="text-h6 text-weight-bold">
                  {{ element.ElementName }}
                </div>
              </div>
            </div>
          </q-card-section>

          <!-- 時間序列資料 -->
          <q-card-section class="q-pt-none">
            <div>
              <div
                v-for="(timeData, timeIndex) in element.Time.slice(0, 6)"
                :key="timeIndex"
              >
                <q-item>
                  <q-item-section>
                    <q-item-label class="text-weight-bold">
                      {{ formatDateTime(timeData.StartTime) }} 至
                      {{ formatTime(timeData.EndTime) }}
                    </q-item-label>
                  </q-item-section>
                  <q-item-section side>
                    <div class="text-right">
                      <div
                        v-for="(key, index) in getWeatherElementKey(
                          element.ElementName
                        )"
                        :key="index"
                      >
                        {{ (timeData.ElementValue[0] as any)[key] }}
                      </div>
                    </div>
                  </q-item-section>
                </q-item>
                <q-separator
                  v-if="timeIndex < element.Time.slice(0, 6).length - 1"
                />
              </div>
            </div>
          </q-card-section>

          <!-- 展開更多時間資料 -->
          <q-card-actions v-if="element.Time.length > 6">
            <q-btn
              flat
              color="primary"
              :label="`查看全部 ${element.Time.length} 筆資料`"
              @click="showAllTimeData(element)"
            />
          </q-card-actions>
        </q-card>
      </div>
    </div>

    <!-- 資料詳情對話框 -->
    <q-dialog v-model="showDetailDialog" persistent>
      <q-card style="min-width: 80dvw">
        <q-card-section>
          <div class="text-h6">{{ selectedElement?.ElementName }} 詳細資料</div>
        </q-card-section>

        <q-card-section
          class="q-pt-none"
          style="max-height: 400px; overflow-y: auto"
        >
          <div v-if="selectedElement">
            <q-list separator>
              <q-item
                v-for="(timeData, index) in selectedElement.Time"
                :key="index"
                dense
              >
                <q-item-section>
                  <q-item-label class="text-weight-bold">
                    {{ formatDateTime(timeData.StartTime) }} 至
                    {{ formatTime(timeData.EndTime) }}
                  </q-item-label>
                </q-item-section>
                <q-item-section side>
                  <div class="text-right">
                    <div
                      v-for="(key, index) in getWeatherElementKey(
                        selectedElement.ElementName
                      )"
                      :key="index"
                    >
                      {{ (timeData.ElementValue[0] as any)[key] }}
                    </div>
                  </div>
                </q-item-section>
              </q-item>
            </q-list>
          </div>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="關閉" color="primary" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { getWeatherDesc } from 'src/services/weather';
import type { Weather } from 'src/services/weather';
import { date } from 'quasar';

const weatherData = ref<Weather | null>(null);
const loading = ref(false);
const error = ref<string>('');
const selectedLocation = ref<string>('66000000');
const showDetailDialog = ref(false);
const selectedElement = ref<any>(null);

// 計算屬性
const locationOptions = computed(() => {
  if (!weatherData.value?.records.Locations[0]?.Location) return [];

  return weatherData.value.records.Locations[0].Location.map((loc) => ({
    label: loc.LocationName,
    value: loc.Geocode,
  }));
});

const currentLocation = computed(() => {
  return weatherData.value?.records.Locations[0]?.Location.find(
    (x) => x.Geocode === selectedLocation.value
  );
});

// 方法
const loadWeatherData = async () => {
  try {
    loading.value = true;
    weatherData.value = await getWeatherDesc();
  } catch (err) {
    error.value = '載入天氣資料失敗，請稍後再試';
    console.error('載入天氣資料錯誤:', err);
  } finally {
    loading.value = false;
  }
};

const formatDateTime = (dateTime: Date) => {
  return date.formatDate(dateTime, 'MM/DD HH:mm');
};

const formatTime = (dateTime: Date) => {
  return date.formatDate(dateTime, 'HH:mm');
};

const elementMap: { [key: string]: string[] } = {
  平均溫度: ['Temperature'],
  最高溫度: ['MaxTemperature'],
  最低溫度: ['MinTemperature'],
  平均露點溫度: ['DewPoint'],
  平均相對濕度: ['RelativeHumidity'],
  最高體感溫度: ['MaxApparentTemperature'],
  最低體感溫度: ['MinApparentTemperature'],
  最大舒適度指數: ['MaxComfortIndex', 'MaxComfortIndexDescription'],
  最小舒適度指數: ['MinComfortIndex', 'MinComfortIndexDescription'],
  風速: ['WindSpeed', 'BeaufortScale'],
  風向: ['WindDirection'],
  '12小時降雨機率': ['ProbabilityOfPrecipitation'],
  天氣現象: ['Weather', 'WeatherCode'],
  紫外線指數: ['UVIndex', 'UVExposureLevel'],
  天氣預報綜合描述: ['WeatherDescription'],
};

const getWeatherElementKey = (elementName: string) => {
  return elementMap[elementName] || [];
};

const showAllTimeData = (element: any) => {
  selectedElement.value = element;
  showDetailDialog.value = true;
};

// 生命週期
onMounted(() => {
  loadWeatherData();
});
</script>

<style scoped>
.location-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.weather-element-card {
  height: 100%;
  transition: transform 0.2s ease-in-out;
}

.weather-element-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.time-series {
  max-height: 300px;
  overflow-y: auto;
}

.time-item {
  border-radius: 4px;
  transition: background-color 0.2s;
}

.time-item:hover {
  background-color: rgba(0, 0, 0, 0.03);
}

.value-item {
  display: flex;
  align-items: baseline;
  justify-content: flex-end;
}
</style>
