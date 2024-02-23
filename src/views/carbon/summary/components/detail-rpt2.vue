<template>
  <a-card :bordered="false">
    <a-spin :loading="loading" style="width: 100%">
      <Chart style="height: 260px; margin-bottom: 30px" :option="chartOption" />
    </a-spin>
    <a-table
      :columns="columns"
      :data="data"
      :pagination="false"
      :bordered="false"
      :stripe="true"
    >
      <template #optional="{ record }">
        <span style="color: red">{{ record.tb }}</span>
      </template>
    </a-table>
  </a-card>
</template>

<script lang="ts" setup>
  import { ref } from 'vue';

  import { graphic } from 'echarts';
  import useLoading from '@/hooks/loading';
  import useChartOption from '@/hooks/chart-option';
  import { ToolTipFormatterParams } from '@/types/echarts';
  import { AnyObject } from '@/types/global';
  import { useCarbonStore } from '@/store';
  import { EmissionMonthDetail } from '@/store/modules/carbon';
  import dayjs from 'dayjs';
  import { cloneDeep } from 'lodash';

  const props = defineProps({
    title: {
      type: String,
      default: '',
    },
  });

  const carbonStore = useCarbonStore();
  const data = ref<EmissionMonthDetail[]>([]);

  function graphicFactory(side: AnyObject) {
    return {
      type: 'text',
      bottom: '8',
      ...side,
      style: {
        text: '',
        textAlign: 'center',
        fill: '#4E5969',
        fontSize: 12,
      },
    };
  }
  const { loading, setLoading } = useLoading(true);
  const xAxis = ref<string[]>([]);
  const chartsData = ref<number[]>([]);
  const graphicElements = ref([
    graphicFactory({ left: '2.6%' }),
    graphicFactory({ right: 0 }),
  ]);
  const { chartOption } = useChartOption(() => {
    return {
      grid: {
        left: '35',
        right: '0',
        top: '10',
        bottom: '30',
      },

      xAxis: {
        type: 'category',
        offset: 2,
        data: xAxis.value,
        boundaryGap: false,
        axisLabel: {
          color: '#4E5969',
          formatter(value: number, idx: number) {
            if (idx === 0) return '';
            if (idx === xAxis.value.length - 1) return '';
            return `${value}`;
          },
        },
        axisLine: {
          show: false,
        },
        axisTick: {
          show: false,
        },
        splitLine: {
          show: true,
          interval: (idx: number) => {
            if (idx === 0) return false;
            if (idx === xAxis.value.length - 1) return false;
            return true;
          },
          lineStyle: {
            color: '#E5E8EF',
          },
        },
        axisPointer: {
          show: true,
          lineStyle: {
            color: '#004D1C',
            width: 2,
          },
        },
      },
      yAxis: {
        type: 'value',
        splitLine: {
          show: true,
          lineStyle: {
            type: 'dashed',
            color: '#E5E8EF',
          },
        },
      },
      tooltip: {
        trigger: 'axis',
        formatter(params) {
          const [firstElement] = params as ToolTipFormatterParams[];
          return `<div>
              <p class="tooltip-title">${firstElement.axisValueLabel}</p>
              <div class="content-panel"><span>排放强度</span><span class="tooltip-value">${(
                Number(firstElement.value)
              ).toLocaleString()}</span></div>
            </div>`;
        },
        className: 'echarts-tooltip-diy',
      },
      graphic: {
        elements: graphicElements.value,
      },
      series: [
        {
          data: chartsData.value,
          type: 'line',
          smooth: true,
          // symbol: 'circle',
          symbolSize: 12,
          emphasis: {
            focus: 'series',
            itemStyle: {
              borderWidth: 2,
            },
          },
          lineStyle: {
            width: 3,
            color: new graphic.LinearGradient(0, 0, 1, 0, [
              {
                offset: 0,
                color: '#7BE188',
              },
              {
                offset: 0.5,
                color: '#23C343',
              },
              {
                offset: 1,
                color: '#004D1C',
              },
            ]),
          },
          showSymbol: false,
          areaStyle: {
            opacity: 0.8,
            color: new graphic.LinearGradient(0, 0, 0, 1, [
              {
                offset: 0,
                color: '#AFF0B5',
              },
              {
                offset: 1,
                color: '#e8f3ee',
              },
            ]),
          },
        },
      ],
    };
  });
  const fetchData = () => {
    setLoading(true);
    try {
      // console.log('start queryLast12MonthData', props.title);
      const res = carbonStore.queryLast12MonthData(props.title);
      data.value = cloneDeep(res);
      res.reverse().forEach((el: EmissionMonthDetail, idx: number) => {
        xAxis.value.push(dayjs(el.m).format('M月'));
        chartsData.value.push(el.totalEmisssion);
        if (idx === 0) {
          graphicElements.value[0].style.text = dayjs(el.m).format('M月');
        }
        if (idx === res.length - 1) {
          graphicElements.value[1].style.text = dayjs(el.m).format('M月');
        }
      });
    } catch (err) {
      // you can report use errorHandler or other
    } finally {
      setLoading(false);
    }
  };
  fetchData();
  const columns = [
    {
      title: '月份',
      dataIndex: 'm',
    },
    {
      title: '燃料排放',
      dataIndex: 'emissions',
    },
    {
      title: '过程排放',
      dataIndex: 'processEmissions',
    },
    {
      title: '电力排放',
      dataIndex: 'powerConsumption',
    },
    {
      title: '边界排放',
      dataIndex: 'boundaryEmission',
    },
    {
      title: '同比',
      dataIndex: 'tb',
      slotName: 'optional',
    },
  ];
</script>

<style scoped lang="less"></style>
