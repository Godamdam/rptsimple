<template>
  <div>
    <a-row :gutter="16">
      <a-col :span="24">
        <a-card
          class="general-card"
          :title="$t('overview.emissionIntensityCalendar')"
        >
          <template #extra>
            <a-radio-group
              v-model="productor"
              type="button"
              default-value="wnqgf"
              :options="productorOptions"
              @change="changeProductor"
            >
            </a-radio-group>
          </template>
          <Chart
            ref="chartRef"
            height="240px"
            :option="chartOption"
            @click="handleClick"
          />
        </a-card>
      </a-col>
    </a-row>
    <a-drawer
      :width="680"
      :footer="false"
      :visible="visible"
      unmount-on-close
      @ok="handleOk"
      @cancel="handleCancel"
    >
      <template #title>
        {{ title }}{{ $t('overview.emissionIntensity') }}
      </template>
      <DetailRpt
        :emission-day-data="emissionDayData"
        :emission-day-detail="emissionDayDetail"
      />
    </a-drawer>
  </div>
</template>

<script lang="ts" setup>
  import { computed, ref } from 'vue';
  import dayjs from 'dayjs';
  import customParseFormat from 'dayjs/plugin/customParseFormat';
  import { use } from 'echarts/core';
  import { HeatmapChart } from 'echarts/charts';
  import useLoading from '@/hooks/loading';
  import {
    VisualMapComponent,
    CalendarComponent,
    MarkLineComponent,
  } from 'echarts/components';
  import {
    EmissionCalendarRecord,
    queryEmissionCalendarRecord,
  } from '@/api/dataSummary';
  import { useI18n } from 'vue-i18n';
  import { RadioOption } from '@arco-design/web-vue/es/radio/interface';
  import { useCarbonStore } from '@/store';
  import DetailRpt from './detail-rpt.vue';

  const carbonStore = useCarbonStore();
  const { t } = useI18n();
  const { loading, setLoading } = useLoading(true);
  const visible = ref(false);
  const title = ref('');
  const calendar: { productor: string; data: (string | number)[][] }[] = [];
  const calendarData = ref<(string | number)[][]>([]);

  // find
  const findDataForEmission = (
    data: { productor: string; data: (string | number)[][] }[],
    targetDate: string
  ): (string | number)[] => {
    const filteredData = data.filter((item) => item.productor !== 'wnqgf');

    const result: (string | number)[] = [];

    filteredData.forEach((item) => {
      const entry: (string | number)[] =
        item.data.find((dateEntry) => dateEntry[0] === targetDate) || [];
      if (entry) {
        result.push(entry[1]);
      }
    });

    return result;
  };
  const emissionDayData = ref<(string | number)[]>([]);
  const emissionDayDetail = ref<any>([]);
  const productor = ref('wnqgf');
  const productorOptions = computed<RadioOption[]>(() => [
    {
      label: t('server.global.productor.wnqgf'),
      value: 'wnqgf',
    },
    {
      label: t('server.global.productor.wnc'),
      value: 'wnc',
    },
    {
      label: t('server.global.productor.ysgs'),
      value: 'ysgs',
    },
    {
      label: t('server.global.productor.rjgs'),
      value: 'rjgs',
    },
    {
      label: t('server.global.productor.ydgs'),
      value: 'ydgs',
    },
    {
      label: t('server.global.productor.lpgs'),
      value: 'lpgs',
    },
    {
      label: t('server.global.productor.dags'),
      value: 'dags',
    },
  ]);

  use([VisualMapComponent, MarkLineComponent, CalendarComponent, HeatmapChart]);

  const handleClick = (e: object) => {
    title.value = e.data[0].toLocaleString();
    emissionDayDetail.value = carbonStore.getEmissionDayDetail(
      dayjs(title.value).format('YYYYMMDD')
    );
    emissionDayData.value = findDataForEmission(calendar, title.value) || [];
    visible.value = true;
  };
  const handleOk = () => {
    visible.value = false;
  };
  const handleCancel = () => {
    visible.value = false;
  };

  const getEmissionCalendar = async () => {
    setLoading(true);
    try {
      // console.log('params.startTime:', params.startTime);
      const year = dayjs().year().toString();
      const { data } = await queryEmissionCalendarRecord(year);
      // console.log('data',data);
      let emissionCalendar: EmissionCalendarRecord[] = [];
      emissionCalendar = data.list;
      // console.log("emissionCalendar.value",emissionCalendar);
      dayjs.extend(customParseFormat);
      const end = dayjs();
      const dayTime = 3600 * 24 * 1000;
      emissionCalendar.forEach((item) => {
        const edata = [];
        const date = dayjs('2024-01-01', 'YYYY-MM-DD');
        for (
          let time = date, index = 0;
          time < end;
          time += dayTime, index += 1
        ) {
          edata.push([
            dayjs(time).format('YYYY-MM-DD'),
            item.emission[index].value,
          ]);
        }
        calendar.push({ productor: item.productor, data: edata });
      });
      // console.log('calenar', calendar);
    } catch (err) {
      // handle err
      console.log('getEmisssionCalendar err', err);
    } finally {
      setLoading(false);
    }
  };
  function getVirtulData(param: string) {
    const data = calendar.find((item) => item.productor === param)?.data;
    return data || [];
  }
  getEmissionCalendar().then(() => {
    // console.log('calendar', calendar);
    calendarData.value = getVirtulData(productor.value);
    // console.log(calendarData.value);
  });

  const chartOption = ref({
    visualMap: {
      min: 0,
      max: 300,
      type: 'piecewise',
      orient: 'horizontal',
      left: 'center',
      show: true,
      color: ['#AFF0B5', '#4CD263', '#23C343', '#FADC19'].reverse(),
    },
    tooltip: {
      position: 'top',
      formatter(value: any) {
        return `<div>
              <p class="tooltip-title">排放强度[单位:tCO₂/t]</p>
              <div class="content-panel">
          <p>
            <span style="background-color: ${value.color}" class="tooltip-item-icon"></span><span>${value.data[0]}</span>
          </p>
          <span class="tooltip-value">${value.data[1]}</span>
        </div>
            </div>`;
      },
      className: 'echarts-tooltip-diy',
    },
    calendar: [
      {
        left: 30,
        top: 20,
        right: 0,
        cellSize: [20, 'auto'],
        bottom: 40,
        range: '2024',
        yearLabel: { show: true },
        dayLabel: {
          margin: 5,
          nameMap: 'ZH',
        },
        monthLabel: {
          nameMap: 'ZH',
        },
      },
    ],
    series: [
      {
        type: 'heatmap',
        coordinateSystem: 'calendar',
        data: calendarData,
      },
    ],
  });

  const changeProductor = () => {
    calendarData.value = getVirtulData(productor.value);
  };
</script>

<style scoped lang="less"></style>
