<template>
  <a-card class="general-card" :title="$t('overview.enterpriseboundary')">
    <Chart height="300px" :option="chartOption" />
  </a-card>
</template>

<script lang="ts" setup>
  import useChartOption from '@/hooks/chart-option';
  import { computed, ref } from 'vue';
  import { useCarbonStore } from '@/store';

  const carbonStore = useCarbonStore();
  const carbonBoundary = computed(() => {
    return carbonStore.getCarbonBoundaryTotalThisYear();
  });

  const { chartOption } = useChartOption((isDark) => {
    return ref({
      legend: {
        left: 'center',
        data: ['过程排放', '燃料排放', '电力排放'],
        bottom: 0,
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
        trigger: 'item',
      },
      graphic: {
        elements: [
          {
            type: 'text',
            left: 'center',
            top: '40%',
            style: {
              text: '总排放量',
              textAlign: 'center',
              fill: isDark ? '#ffffffb3' : '#4E5969',
              fontSize: 14,
            },
          },
          {
            type: 'text',
            left: 'center',
            top: '50%',
            style: {
              text: String(
                carbonBoundary.value[0] +
                  carbonBoundary.value[1] +
                  carbonBoundary.value[2]
              ),
              textAlign: 'center',
              fill: isDark ? '#ffffffb3' : '#1D2129',
              fontSize: 16,
              fontWeight: 500,
            },
          },
        ],
      },
      series: [
        {
          type: 'pie',
          radius: ['50%', '70%'],
          center: ['50%', '50%'],
          label: {
            formatter: '{d}%',
            fontSize: 14,
            color: isDark ? 'rgba(255, 255, 255, 0.7)' : '#4E5969',
          },
          itemStyle: {
            borderColor: isDark ? '#232324' : '#fff',
            borderWidth: 1,
          },
          data: [
            {
              value: carbonBoundary.value[0],
              name: '过程排放',
              itemStyle: {
                color: isDark ? '#A079DC' : '#313CA9',
              },
            },
            {
              value: carbonBoundary.value[1],
              name: '电力排放',
              itemStyle: {
                color: isDark ? '#6CAAF5' : '#21CCFF',
              },
            },
            {
              value: carbonBoundary.value[2],
              name: '燃料排放',
              itemStyle: {
                color: isDark ? '#3D72F6' : '#249EFF',
              },
            },
          ],
        },
      ],
    }).value;
  });
</script>

<style scoped lang="less"></style>
