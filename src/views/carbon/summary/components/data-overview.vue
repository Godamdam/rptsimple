<template>
  <a-spin :loading="loading" style="width: 100%">
    <a-card class="general-card" :title="$t('overview.clinkerboundary')">
      <LetTarget />

      <a-tabs default-active-key="1" style="margin-top: 10px">
        <a-tab-pane key="1" :title="$t('overview.emissionIntensity')">
          <EmissionIntensity />
        </a-tab-pane>
        <a-tab-pane key="2" :title="$t('overview.emissionTotal')">
          <div
            style="
              margin-top: 0px;
              display: flex;
              justify-content: space-between;
            "
          >
            <div>
              <a-range-picker
                style="width: 254px; margin-left: 0px; margin-right: 5px"
                :default-value="['2023-01-01', '2023-12-13']"
              />
              <a-radio-group type="button" default-value="mini">
                <a-radio value="mini">{{ $t('overview.currentYear') }}</a-radio>
                <a-radio value="small">{{
                  $t('overview.currentMonth')
                }}</a-radio>
                <a-radio value="medium">{{
                  $t('overview.currentDay')
                }}</a-radio>
              </a-radio-group>
            </div>

            <a-space size="mini">
              <a-select
                style="
                  width: 106px;
                  background-color: #ffffff;
                  border: 0px solid #006622;
                  color: #000000;
                "
                :default-value="$t('overview.clinkerboundary')"
              >
                <a-option>{{ $t('overview.clinkerboundary') }}</a-option>
                <a-option>{{ $t('overview.enterpriseboundary') }}</a-option>
              </a-select>

              <a-radio-group type="button" default-value="bj">
                <a-radio value="bj">{{
                  $t('overview.boundaryDischarge')
                }}</a-radio>
                <a-radio value="mini">{{
                  $t('overview.fuelEmission')
                }}</a-radio>
                <a-radio value="small">{{
                  $t('overview.processDischarge')
                }}</a-radio>
                <a-radio value="medium">{{
                  $t('overview.electricPowerEmission')
                }}</a-radio>
              </a-radio-group>
            </a-space>
          </div>
          <Chart
            style="height: 428px; margin-top: 10px; padding-right: 10px"
            :option="chartOption"
          />
        </a-tab-pane>
      </a-tabs>
    </a-card>
  </a-spin>
</template>

<script lang="ts" setup>
  import { computed, ref } from 'vue';
  import { useI18n } from 'vue-i18n';
  import { LineSeriesOption } from 'echarts';
  import { queryDataOverview } from '@/api/visualization';
  import useLoading from '@/hooks/loading';
  import { ToolTipFormatterParams } from '@/types/echarts';
  import useThemes from '@/hooks/themes';
  import useChartOption from '@/hooks/chart-option';
  import LetTarget from './let-target.vue';
  import EmissionIntensity from './emission-intensity.vue';

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
      .join('');
  };

  const generateSeries = (
    name: string,
    lineColor: string,
    itemBorderColor: string,
    data: number[]
  ): LineSeriesOption => {
    return {
      name,
      data,
      stack: 'Total',
      type: 'line',
      smooth: true,
      symbol: 'circle',
      symbolSize: 10,
      itemStyle: {
        color: lineColor,
      },
      emphasis: {
        focus: 'series',
        itemStyle: {
          color: lineColor,
          borderWidth: 2,
          borderColor: itemBorderColor,
        },
      },
      lineStyle: {
        width: 2,
        color: lineColor,
      },
      showSymbol: false,
      areaStyle: {
        opacity: 0.1,
        color: lineColor,
      },
    };
  };
  const { t } = useI18n();
  const { loading, setLoading } = useLoading(true);
  const { isDark } = useThemes();

  const xAxis = ref<string[]>([]);
  const contentProductionData = ref<number[]>([]);
  const contentClickData = ref<number[]>([]);
  const contentExposureData = ref<number[]>([]);
  const activeUsersData = ref<number[]>([]);
  const { chartOption } = useChartOption((dark) => {
    return {
      grid: {
        left: '4.6%',
        right: '4',
        top: '20',
        bottom: '40',
      },
      tooltip: {
        show: true,
        trigger: 'axis',
        formatter(params) {
          const [firstElement] = params as ToolTipFormatterParams[];
          return `<div>
              <p class="tooltip-title">${
                firstElement.axisValueLabel
              }[单位:万吨]</p>
              ${tooltipItemsHtmlString(params as ToolTipFormatterParams[])}
            </div>`;
        },
        className: 'echarts-tooltip-diy',
      },
      yAxis: {
        type: 'value',
      },
      xAxis: {
        type: 'category',
        data: [
          '德安公司',
          '乐平公司',
          '于都公司',
          '瑞金公司',
          '玉山公司',
          '万年厂',
        ].reverse(),
      },
      series: [
        {
          name: '7#',
          stack: 'one',
          type: 'bar',
          barWidth: 30,
          color: '#00994e',
          data: [140, '-', '-', '-', '-', '-'],
        },
        {
          name: '8#',
          stack: 'one',
          type: 'bar',
          color: '#76da91',
          data: [160, '-', '-', '-', '-', '-'],
        },
        {
          name: '1#',
          stack: 'one',
          type: 'bar',
          color: '#00994e',
          data: ['-', 124, 142, 112, 123, 92],
        },
        {
          name: '2#',
          stack: 'one',
          type: 'bar',
          color: '#76da91',
          data: ['-', 191, 142, '-', 193, '-'],
        },
        {
          name: '7#',
          stack: 'two',
          type: 'bar',
          barWidth: 30,
          color: '#0780cf',
          data: [120, '-', '-', '-', '-', '-'],
        },
        {
          name: '8#',
          stack: 'two',
          type: 'bar',
          color: '#63b2ee',
          data: [130, '-', '-', '-', '-', '-'],
        },
        {
          name: '1#',
          stack: 'two',
          type: 'bar',
          color: '#0780cf',
          data: ['-', 120, 132, 101, 134, 90],
        },
        {
          name: '2#',
          stack: 'two',
          type: 'bar',
          color: '#63b2ee',
          data: ['-', 182, 134, '-', 190, '-'],
        },
      ],
    };
  });
  const fetchData = async () => {
    setLoading(true);
    try {
      const { data } = await queryDataOverview();
      xAxis.value = data.xAxis;
      data.data.forEach((el) => {
        if (el.name === '内容生产量') {
          contentProductionData.value = el.value;
        } else if (el.name === '内容点击量') {
          contentClickData.value = el.value;
        } else if (el.name === '内容曝光量') {
          contentExposureData.value = el.value;
        }
        activeUsersData.value = el.value;
      });
    } catch (err) {
      // you can report use errorHandler or other
    } finally {
      setLoading(false);
    }
  };
  fetchData();
</script>

<style scoped lang="less">
  :deep(.arco-statistic) {
    .arco-statistic-title {
      color: rgb(var(--gray-10));
      font-weight: bold;
    }

    .arco-statistic-value {
      display: flex;
      align-items: center;
    }
  }

  .statistic-prefix {
    display: inline-block;
    width: 32px;
    height: 32px;
    margin-right: 8px;
    color: var(--color-white);
    font-size: 16px;
    line-height: 32px;
    text-align: center;
    vertical-align: middle;
    border-radius: 6px;
  }
</style>
