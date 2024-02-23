<template>
  <div>
    <a-spin :loading="loading" style="width: 100%">
      <a-card :bordered="false" :style="cardStyle">
        <div class="content-wrap">
          <div class="content">
            <a-statistic
              :value-style="valuestyle"
              :title="title"
              :value="renderData.count"
              :value-from="0"
              animation
              show-group-separator
              @click="handleClick"
            >
              <template #suffix>
                <span :style="{ color: isDark ? '#ffffff' : '#000000' }"
                  >&nbsp;{{ unit }}</span
                >
              </template>
            </a-statistic>
            <div class="desc">
              <a-typography-text type="secondary" class="label">
                {{ $t('dataAnalysis.card.yesterday') }}
              </a-typography-text>
              <a-typography-text type="danger">
                {{ renderData.growth }}
                <icon-arrow-rise />
              </a-typography-text>
            </div>
          </div>
          <div class="chart">
            <Chart v-if="!loading" :option="chartOption" />
          </div>
        </div>

        <div style="padding-left: 16px; padding-right: 16px">
          <a-divider :margin="5" />
          <div style="display: flex; justify-content: space-between">
            <div>
              <a-typography-text
                type="secondary"
                class="label"
                style="padding-right: 0px"
                >年累计 {{ accYear }}{{ unit }}</a-typography-text
              ></div
            >
            <div>
              <a-typography-text
                type="secondary"
                class="label"
                style="padding-right: 0px"
                >月累计 {{ accMonth }}{{ unit }}</a-typography-text
              ></div
            >
          </div>
        </div>
      </a-card>
    </a-spin>
    <a-drawer
      :width="680"
      :footer="false"
      :visible="visible"
      unmount-on-close
      @ok="handleOk"
      @cancel="handleCancel"
    >
      <template #title> {{ title2 }}排放强度 </template>
      <DetailRpt :emission-day-detail="emissionDayDetail" /> </a-drawer
  ></div>
</template>

<script lang="ts" setup>
  import { ref, PropType, CSSProperties } from 'vue';
  import useThemes from '@/hooks/themes';
  import useLoading from '@/hooks/loading';
  import useChartOption from '@/hooks/chart-option';
  import { ToolTipFormatterParams } from '@/types/echarts';
  import { useCarbonStore } from '@/store';
  import dayjs from 'dayjs';
  import {
    PublicOpinionAnalysis,
    PublicOpinionAnalysisRes,
  } from '@/store/modules/carbon';
  import { CarbonRecord } from '@/api/dataManage';
  import DetailRpt from './detail-rpt.vue';

  const carbonStore = useCarbonStore();
  const visible = ref(false);
  const title2 = ref('');
  const accYear = ref(0);
  const accMonth = ref(0);
  const { isDark } = useThemes();

  const emissionDayDetail = ref<any>([]);

  const handleClick = (e: object) => {
    title2.value = dayjs().format('YYYY-MM-DD');
    emissionDayDetail.value = carbonStore.getEmissionDayDetail(
      dayjs().format('YYYYMMDD')
    );
    console.log('emissionDayDetail', emissionDayDetail);

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
  const barChartOptionsFactory = () => {
    const data = ref<any>([]);
    const { chartOption } = useChartOption(() => {
      return {
        grid: {
          left: 0,
          right: 0,
          top: 10,
          bottom: 0,
        },
        xAxis: {
          type: 'category',
          show: false,
        },
        yAxis: {
          show: false,
        },
        tooltip: {
          show: true,
          trigger: 'axis',
          formatter(params) {
            const [firstElement] = params as ToolTipFormatterParams[];
            return `<div>
            <p class="tooltip-title">排放量[单位:万吨]</p>
            <div class="content-panel">
        <p>
          <span style="background-color: ${
            firstElement.color
          }" class="tooltip-item-icon"></span><span>${
              Number(firstElement.name) % 2 === 0 ? '2022年' : '2023年'
            }${Math.floor(Number(firstElement.name) / 2) + 1}月</span>
        </p>
        <span class="tooltip-value">${firstElement.value.toLocaleString()}</span>
      </div>
          </div>`;
          },
          className: 'echarts-tooltip-diy',
        },
        series: {
          name: 'total',
          data,
          type: 'bar',
          barWidth: 7,
          itemStyle: {
            borderRadius: 2,
          },
        },
      };
    });
    return {
      data,
      chartOption,
    };
  };

  const lineChartOptionsFactory = () => {
    const data = ref<number[][]>([[], []]);
    const { chartOption } = useChartOption(() => {
      return {
        grid: {
          left: 0,
          right: 0,
          top: 10,
          bottom: 0,
        },
        xAxis: {
          type: 'category',
          show: false,
        },
        yAxis: {
          show: false,
        },
        tooltip: {
          show: true,
          trigger: 'axis',
          formatter(params) {
            const [firstElement] = params as ToolTipFormatterParams[];
            return `<div>
            <p class="tooltip-title">排放量[单位:万吨]</p>
            <div class="content-panel">
        <p>
          <span style="background-color: ${
            firstElement.color
          }" class="tooltip-item-icon"></span><span>${
              Number(firstElement.name) + 1
            }月</span>
        </p>
        <span class="tooltip-value">${firstElement.value.toLocaleString()}</span>
      </div>
          </div>`;
          },
          className: 'echarts-tooltip-diy',
        },
        series: [
          {
            name: '2022',
            data: data.value[0],
            type: 'line',
            showSymbol: false,
            smooth: true,
            lineStyle: {
              color: '#165DFF',
              width: 3,
            },
          },
          {
            name: '2023',
            data: data.value[1],
            type: 'line',
            showSymbol: false,
            smooth: true,
            lineStyle: {
              color: '#0780cf',
              width: 3,
            },
          },
        ],
      };
    });
    return {
      data,
      chartOption,
    };
  };

  const pieChartOptionsFactory = () => {
    const data = ref<any>([]);
    const { chartOption } = useChartOption(() => {
      return {
        grid: {
          left: 0,
          right: 0,
          top: 0,
          bottom: 0,
        },
        legend: {
          show: true,
          top: 'center',
          right: '0',
          orient: 'vertical',
          icon: 'circle',
          itemWidth: 6,
          itemHeight: 6,
          textStyle: {
            color: '#4E5969',
          },
        },
        tooltip: {
          show: true,
        },
        series: [
          {
            name: '总计',
            type: 'pie',
            radius: ['50%', '70%'],
            label: {
              show: false,
            },
            data,
          },
        ],
      };
    });
    return {
      data,
      chartOption,
    };
  };

  const props = defineProps({
    title: {
      type: String,
      default: '',
    },
    valuestyle: {
      type: Object as PropType<CSSProperties>,
      default: () => {
        return {};
      },
    },
    unit: {
      type: String,
      default: '万吨',
    },
    quota: {
      type: String,
      default: '',
    },
    chartType: {
      type: String,
      default: '',
    },
    cardStyle: {
      type: Object as PropType<CSSProperties>,
      default: () => {
        return {};
      },
    },
  });

  const { loading, setLoading } = useLoading(true);
  const { chartOption: lineChartOption, data: lineData } =
    lineChartOptionsFactory();
  const { chartOption: barChartOption, data: barData } =
    barChartOptionsFactory();
  const { chartOption: pieChartOption, data: pieData } =
    pieChartOptionsFactory();
  const renderData = ref<PublicOpinionAnalysisRes>({
    count: 0,
    growth: 0,
    chartData: [],
    accYear: 0,
    accMonth: 0,
  });
  const chartOption = ref({});
  const fetchData = (params: PublicOpinionAnalysis) => {
    try {
      const currentYear = dayjs().year().toString();
      const data = carbonStore.queryPublicOpinionAnalysis(params);
      renderData.value = data;
      const { chartData } = data;
      if (props.chartType === 'bar') {
        for (let i = 0; i < 12; i += 1) {
          barData.value.push(
            {
              value: chartData[i].y,
              itemStyle: {
                color: i % 2 ? '#76da91' : '#0780cf',
              },
            },
            {
              value: chartData[i + 12].y,
              itemStyle: {
                color: i % 2 ? '#76da91' : '#0780cf',
              },
            }
          );
        }
        chartOption.value = barChartOption.value;
      } else if (props.chartType === 'line') {
        chartData.forEach((el: { name: string; y: number }) => {
          // console.log(el.name, '@@@', currentYear, el.name === currentYear);

          if (el.name === currentYear) {
            lineData.value[0].push(el.y);
          } else {
            lineData.value[1].push(el.y);
          }
        });
        chartOption.value = lineChartOption.value;
      } else {
        chartData.forEach((el: any) => {
          pieData.value.push(el);
        });
        chartOption.value = pieChartOption.value;
      }
      accYear.value = data.accYear;
      accMonth.value = data.accMonth;
    } catch (err) {
      // you can report use errorHandler or other
    } finally {
      setLoading(false);
    }
  };

  // 计算card的值
  const unsubscribe = carbonStore.$subscribe(() => {
    fetchData({ quota: props.quota });
  });

  // end
</script>

<style scoped lang="less">
  :deep(.arco-card) {
    border-radius: 4px;
  }
  :deep(.arco-card-body) {
    width: 100%;
    height: 155px;
    padding: 0;
    display: flex;
    flex-direction: column;
  }
  .content-wrap {
    width: 100%;
    padding-left: 16px;
    padding-right: 16px;
    padding-top: 16px;
    padding-bottom: 5px;
    white-space: nowrap;
    display: flex;
    align-items: flex-end;
  }
  :deep(.content) {
    float: left;
    width: 108px;
    display: flex;
    flex-direction: column;
  }
  :deep(.arco-statistic) {
    .arco-statistic-title {
      font-size: 16px;
      font-weight: bold;
      white-space: nowrap;
    }
    .arco-statistic-content {
      margin-top: 10px;
    }
  }

  .chart {
    float: right;
    width: calc(100% - 108px);
    height: 80px;
    vertical-align: bottom;
  }

  .label {
    padding-right: 8px;
    font-size: 12px;
  }
</style>
