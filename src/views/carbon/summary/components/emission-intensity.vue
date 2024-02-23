<template>
  <div>
    <a-spin style="width: 100%">
      <div
        style="margin-top: 0px; display: flex; justify-content: space-between"
      >
        <div>
          <a-range-picker
            style="width: 254px; margin-left: 0px; margin-right: 5px"
          />

          <a-radio-group
            v-model="range"
            type="button"
            default-value="year"
            @change="changeTimeRange"
          >
            <a-radio value="year">本年</a-radio>
            <a-radio value="month">本月</a-radio>
            <a-radio value="day">本日</a-radio>
          </a-radio-group>
        </div>
      </div>
      <Chart
        style="height: 428px; margin-top: 10px; padding-right: 10px"
        :option="chartOption"
        @click="handleClick"
      />
    </a-spin>
    <a-drawer
      :width="680"
      :footer="false"
      :visible="visible"
      unmount-on-close
      @ok="handleOk"
      @cancel="handleCancel"
    >
      <template #title> {{ title }}排放强度 </template>
      <DetailRpt :title="title" /> </a-drawer
  ></div>
</template>

<script lang="ts" setup>
  import { computed, ref } from 'vue';
  import useLoading from '@/hooks/loading';
  import { ToolTipFormatterParams } from '@/types/echarts';
  import { useCarbonStore } from '@/store';
  import dayjs from 'dayjs';
  import { useI18n } from 'vue-i18n';

  import { productorOptions } from '@/api/dataSummary';
  import DetailRpt from './detail-rpt2.vue';

  const visible = ref(false);
  const title = ref('');
  const range = ref('year');
  const carbonStore = useCarbonStore();
  const { t } = useI18n();

  const getRange = (isCurrent: boolean) => {
    const now = new Date();
    let start;
    let end;
    let a = 0;
    let b = 0;
    // eslint-disable-next-line no-unused-expressions
    isCurrent ? (b = 1) : (a = -1);
    switch (range.value) {
      case 'year':
        start = new Date(now.getFullYear() + a, 0, 1); // 当年的开始时间
        end = new Date(now.getFullYear() + b, 0, 1); // 下一年的开始时间
        break;
      case 'month':
        start = new Date(now.getFullYear(), now.getMonth() + a, 1); // 当月的开始时间
        end = new Date(now.getFullYear(), now.getMonth() + b, 1); // 下一月的开始时间
        break;
      case 'day':
        start = new Date(now.getFullYear(), now.getMonth(), now.getDate() + a); // 当天的开始时间
        end = new Date(now.getFullYear(), now.getMonth(), now.getDate() + b); // 下一天的开始时间
        break;
      default:
        throw new Error("Invalid parameter. Use 'year', 'month', or 'day'.");
    }
    // 返回时间范围的数组
    // console.log("rangeTime",[start.toLocaleString(), end.toLocaleString()]);
    return [start.toLocaleString(), end.toLocaleString()];
  };
  const getRangeName = (timeD: string[]) => {
    let startName = 'startTime';
    let endName = 'endTime';
    console.log('startTime:', timeD[0], 'endTime', timeD[1]);

    const startTime = dayjs(timeD[0]);
    const endTime = dayjs(timeD[1]);

    switch (range.value) {
      case 'year':
        startName = startTime.format('YYYY'); // 当年的开始时间
        endName = endTime.format('YYYY'); // 下一年的开始时间
        break;
      case 'month':
        startName = startTime.format('YYYY/MM'); // 当年的开始时间
        endName = endTime.format('YYYY/MM'); // 下一年的开始时间
        break;
      case 'day':
        startName = startTime.format('YYYY/MM/DD'); // 当年的开始时间
        endName = endTime.format('YYYY/MM/DD'); // 下一年的开始时间
        break;
      default:
        throw new Error("Invalid parameter. Use 'year', 'month', or 'day'.");
    }

    return [startName, endName];
  };

  const currentEmission = computed(() => {
    const crange = getRange(true);
    return carbonStore.getEmissionIntensity(crange[0], crange[1]);
  });
  const preventEmission = computed(() => {
    const crange = getRange(false);
    return carbonStore.getEmissionIntensity(crange[0], crange[1]);
  });

  // watch(range, () => {
  //   const crange = getRange(false);
  //   // console.log('start getrange name',crange);
  //   return getRangeName(crange);
  // });
  const rangeName = computed(() => {
    const crange = getRange(false);
    // console.log('start getrange name',crange);
    return getRangeName(crange);
  });

  // 注册监听器
  // const unsubscribe = carbonStore.$subscribe((mutation) => {
  //   console.log('mutiation', mutation);
  // });
  const changeTimeRange = () => {
    // console.log(range.value);
  };
  const handleClick = (e: object) => {
    // console.log('eeee', e);
    title.value = e.name.toLocaleString();
    visible.value = true;
  };
  const handleOk = () => {
    visible.value = false;
  };
  const handleCancel = () => {
    visible.value = false;
  };

  const tooltipItemsHtmlString = (items: ToolTipFormatterParams[]) => {
    return items
      .filter((item) => item.value > 0)
      .map((el) => {
        return `<div class="content-panel">
        <p>
          <span style="background-color: ${
            el.color
          }" class="tooltip-item-icon"></span><span>${el.seriesName}</span>
        </p>
        <span class="tooltip-value">${el.value.toLocaleString()}</span>
      </div>`;
      })
      .reverse()
      .join('');
  };
  const chartOption = ref({
    grid: {
      left: '4.6%',
      right: '4',
      top: '20',
      bottom: '40',
    },
    tooltip: {
      show: true,
      trigger: 'axis',
      formatter(params: ToolTipFormatterParams[]) {
        const [firstElement] = params as ToolTipFormatterParams[];
        return `<div>
            <p class="tooltip-title">${
              firstElement.axisValueLabel
            }[单位:tCO₂/t]</p>
            ${tooltipItemsHtmlString(params as ToolTipFormatterParams[])}
          </div>`;
      },
      className: 'echarts-tooltip-diy',
    },
    xAxis: {
      type: 'category',
      data: productorOptions,
      axisLabel: {
        formatter(value: any) {
          // 在这里使用 t 函数进行翻译
          return t(`server.global.productor.${value}`);
        },
      },
    },
    yAxis: {
      type: 'value',
    },
    series: [
      {
        data: currentEmission,
        type: 'bar',
        barWidth: 30,
        color: '#76da91', // todo ref更新不修改
        name: rangeName.value[0],
        markLine: {
          name: 'aa',
          data: [
            {
              name: '目标值',
              yAxis: 90,
              lineStyle: { color: 'rgb(0, 109, 51)', width: 1.5 },
            },
          ],
          symbol: 'none',
          label: {
            show: true,
            position: 'insideStartTop',
            formatter: '目标线',
          },
        },
      },
      {
        data: preventEmission,
        type: 'bar',
        barWidth: 30,
        color: '#0780cf',
        name: rangeName.value[1],
        markLine: {
          name: 'aa',
          data: [
            {
              name: '目标值',
              yAxis: 110,
              lineStyle: { color: 'red', width: 1.5 },
            },
          ],
          symbol: 'none',
          label: {
            show: true,
            position: 'insideStartTop',
            formatter: '控制线',
          },
        },
      },
    ],
  });
  const { loading } = useLoading(false);
</script>

<style scoped lang="less"></style>
