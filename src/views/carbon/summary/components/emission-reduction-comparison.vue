<template>
  <a-card
    class="general-card"
    :title="$t('overview.emissionReductionComparison')"
    :header-style="{ paddingBottom: 0 }"
  >
    <Chart style="height: 467px; margin-top: 10px" :option="chartOption" />
  </a-card>
</template>

<script lang="ts" setup>
  import useChartOption from '@/hooks/chart-option';
  import { ToolTipFormatterParams } from '@/types/echarts';
  import { computed, ref } from 'vue';
  import { useCarbonStore } from '@/store';

  const carbonStore = useCarbonStore();

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

  const powerGenrationArr = computed(() => {
    const filed = 'powerGeneration';
    return carbonStore.getFildTotalThisYear(filed);
  });

  const PVPowerGenerationArr = computed(() => {
    const filed = 'PVPowerGeneration';
    return carbonStore.getFildTotalThisYear(filed);
  });

  const purchasedPowerArr = computed(() => {
    const filed = 'purchasedPower';
    return carbonStore.getFildTotalThisYear(filed);
  });

  const { chartOption } = useChartOption((isDark) => {
    return ref({
      legend: {
        left: 'center',
        bottom: 10,
        icon: 'circle',
        itemWidth: 8,
        textStyle: {
          color: isDark ? 'rgba(255, 255, 255, 0.7)' : '#4E5969',
        },
        itemStyle: {
          borderWidth: 0,
        },
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
          name: '余热发电',
          type: 'bar',
          stack: 'total',
          color: '#6596f9',
          barWidth: 30,
          data: powerGenrationArr,
        },
        {
          name: '光伏发电',
          type: 'bar',
          stack: 'total',
          color: '#63daac',
          data: PVPowerGenerationArr,
        },
        {
          name: '替代燃料',
          type: 'bar',
          stack: 'total',
          color: '#66779a',
          data: purchasedPowerArr,
        },
      ],
    }).value;
  });
</script>

<style scoped lang="less"></style>
