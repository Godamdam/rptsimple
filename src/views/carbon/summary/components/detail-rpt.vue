<!-- eslint-disable vue/require-prop-types -->
<template>
  <a-spin style="width: 100%">
    <a-card :bordered="false">
      <Chart style="height: 350px; margin-bottom: 10px" :option="chartOption" />
      <a-table
        :columns="columns"
        :data="emissionDayDetail"
        :pagination="false"
        :bordered="false"
        :stripe="true"
      >
        <template #productor="{ record }">
          {{ $t(`server.global.productor.${record.productor}`) }}
        </template>
      </a-table>
    </a-card>
  </a-spin>
</template>

<script lang="ts" setup>
  import { reactive, ref, toRefs } from 'vue';
  import useChartOption from '@/hooks/chart-option';
  import { ToolTipFormatterParams } from '@/types/echarts';

  const props = defineProps({
    emissionDayData: {
      type: Array,
      default: () => [],
    },
    emissionDayDetail: {
      type: Array,
      default: () => [],
    },
  });
  const { emissionDayData, emissionDayDetail } = toRefs(props);
  const tooltipItemsHtmlString = (items: ToolTipFormatterParams[]) => {
    return items
      .filter((item) => typeof item.value === 'number' && item.value > 0)
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
      .join('');
  };

  const { chartOption } = useChartOption((isDark) => {
    return ref({
      tooltip: {
        show: true,
        trigger: 'axis',
        formatter(params) {
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
      grid: {
        left: '3%',
        right: '4%',
        top: 20,
        bottom: 50,
        containLabel: true,
      },
      xAxis: {
        type: 'value',
      },
      yAxis: {
        type: 'category',
        data: [
          '德安公司',
          '乐平公司',
          '于都公司',
          '瑞金公司',
          '玉山公司',
          '万年厂',
        ],
      },
      series: [
        {
          name: '排放强度',
          type: 'bar',
          stack: 'total',
          color: '#009A29',
          barWidth: 30,
          data: emissionDayData,
        },
      ],
    }).value;
  });
  const columns = [
    {
      title: '生产单位',
      dataIndex: 'productor',
      slotName: 'productor',
    },
    {
      title: '生产线',
      dataIndex: 'line',
    },
    {
      title: '产量',
      dataIndex: 'output',
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
  ];

  // const data = reactive([
  //   {
  //     key: '1',
  //     name: '万年厂',
  //     salary: '7#',
  //     address: Math.ceil(Math.random() * 1000),
  //     email: Math.ceil(Math.random() * 1000),
  //   },
  //   {
  //     key: '2',
  //     name: '万年厂',
  //     salary: '8#',
  //     address: Math.ceil(Math.random() * 1000),
  //     email: Math.ceil(Math.random() * 1000),
  //   },
  //   {
  //     key: '3',
  //     name: '玉山公司',
  //     salary: '1#',
  //     address: Math.ceil(Math.random() * 1000),
  //     email: Math.ceil(Math.random() * 1000),
  //   },
  //   {
  //     key: '4',
  //     name: '玉山公司',
  //     salary: '2#',
  //     address: Math.ceil(Math.random() * 1000),
  //     email: Math.ceil(Math.random() * 1000),
  //   },
  //   {
  //     key: '5',
  //     name: '瑞金公司',
  //     salary: '1#',
  //     address: Math.ceil(Math.random() * 1000),
  //     email: Math.ceil(Math.random() * 1000),
  //   },
  //   {
  //     key: '6',
  //     name: '瑞金公司',
  //     salary: '2#',
  //     address: Math.ceil(Math.random() * 1000),
  //     email: Math.ceil(Math.random() * 1000),
  //   },
  //   {
  //     key: '7',
  //     name: '于都公司',
  //     salary: '1#',
  //     address: Math.ceil(Math.random() * 1000),
  //     email: Math.ceil(Math.random() * 1000),
  //   },
  //   {
  //     key: '8',
  //     name: '乐平公司',
  //     salary: '1#',
  //     address: Math.ceil(Math.random() * 1000),
  //     email: Math.ceil(Math.random() * 1000),
  //   },
  //   {
  //     key: '9',
  //     name: '乐平公司',
  //     salary: '2#',
  //     address: Math.ceil(Math.random() * 1000),
  //     email: Math.ceil(Math.random() * 1000),
  //   },
  //   {
  //     key: '10',
  //     name: '德安公司',
  //     salary: '1#',
  //     address: Math.ceil(Math.random() * 1000),
  //     email: Math.ceil(Math.random() * 1000),
  //   },
  // ]);
</script>

<style scoped lang="less"></style>
