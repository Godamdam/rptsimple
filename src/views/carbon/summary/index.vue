<template>
  <div class="container">
    <Breadcrumb
      :items="['menu.carbon', 'menu.carbon.overviewCarbonEmissions']"
    />
    <a-space direction="vertical" :size="16" fill>
      <a-grid :cols="24" :col-gap="16" :row-gap="16">
        <a-grid-item
          :span="{ xs: 24, sm: 24, md: 24, lg: 18, xl: 18, xxl: 18 }"
        >
          <DataOverview />
        </a-grid-item>
        <a-grid-item :span="{ xs: 24, sm: 24, md: 24, lg: 6, xl: 6, xxl: 6 }">
          <EnterpriseBoundary style="margin-bottom: 16px" />
          <EmissionReductionComparison />
        </a-grid-item>
        <a-grid-item
          :span="{ xs: 24, sm: 24, md: 24, lg: 24, xl: 24, xxl: 24 }"
        >
          <EmissionCalendar />
        </a-grid-item>
      </a-grid>
    </a-space>
  </div>
</template>

<script lang="ts" setup>
  import { onBeforeMount, ref } from 'vue';
  import useLoading from '@/hooks/loading';
  import { useCarbonStore } from '@/store';
  import { CarbonSearchParams } from '@/api/dataSummary';
  import dayjs from 'dayjs';
  import DataOverview from './components/data-overview.vue';
  import EmissionReductionComparison from './components/emission-reduction-comparison.vue';
  import EnterpriseBoundary from './components/enterprise-boundary.vue';
  import EmissionCalendar from './components/emission-calendar.vue';

  const { loading, setLoading } = useLoading(true);

  const carbonStore = useCarbonStore();
  const fetchData = async (
    params: CarbonSearchParams = {
      startTime: '2024-01-01',
      endTime: dayjs().date().toString(),
    }
  ) => {
    setLoading(true);
    try {
      await carbonStore.info(params);
    } catch (error) {
      // handle err
    } finally {
      setLoading(false);
    }
  };

  fetchData();
</script>

<script lang="ts">
  export default {
    name: 'OverviewCarbonEmissions',
  };
</script>

<style scoped lang="less">
  .container {
    padding: 0 20px 20px 20px;
  }

  :deep(.section-title) {
    margin-top: 0;
    margin-bottom: 16px;
    font-size: 16px;
  }

  :deep(.chart-wrap) {
    height: 264px;
  }
</style>
