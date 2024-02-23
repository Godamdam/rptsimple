<template>
  <a-grid :cols="24" :col-gap="12" :row-gap="12" style="padding-bottom: 12px">
    <a-grid-item :span="{ xs: 12, sm: 12, md: 12, lg: 12, xl: 6, xxl: 6 }">
      <ChartCard
        title="排放总量"
        quota="totalEmisssion"
        chart-type="bar"
        :card-style="{
          background: isDark
            ? ' linear-gradient(180deg, #3D492E 0%, #263827 100%)'
            : 'linear-gradient(180deg, #F5FEF2 0%, #E6FEEE 100%)',
        }"
      />
    </a-grid-item>
    <a-grid-item :span="{ xs: 12, sm: 12, md: 12, lg: 12, xl: 6, xxl: 6 }">
      <ChartCard
        title="排放强度"
        unit="tCO₂/t"
        quota="emissionIntensity"
        chart-type="line"
        :card-style="{
          background: isDark
            ? ' linear-gradient(180deg, #3D492E 0%, #263827 100%)'
            : 'linear-gradient(180deg, #F5FEF2 0%, #E6FEEE 100%)',
        }"
      />
    </a-grid-item>
    <a-grid-item :span="{ xs: 12, sm: 12, md: 12, lg: 12, xl: 6, xxl: 6 }">
      <ChartCard
        title="过程排放"
        quota="processEmissions"
        chart-type="line"
        :card-style="{
          background: isDark
            ? 'linear-gradient(180deg, #294B94 0%, #0F275C 100%)'
            : 'linear-gradient(180deg, #f2f9fe 0%, #e6f4fe 100%)',
        }"
      />
    </a-grid-item>
    <a-grid-item :span="{ xs: 12, sm: 12, md: 12, lg: 12, xl: 6, xxl: 6 }">
      <ChartCard
        title="燃料排放"
        quota="emissions"
        chart-type="bar"
        :card-style="{
          background: isDark
            ? 'linear-gradient(180deg, #294B94 0%, #0F275C 100%)'
            : 'linear-gradient(180deg, #f2f9fe 0%, #e6f4fe 100%)',
        }"
      />
    </a-grid-item>
  </a-grid>
  <a-grid :cols="24" :col-gap="12" :row-gap="12">
    <a-grid-item :span="{ xs: 12, sm: 12, md: 12, lg: 12, xl: 6, xxl: 6 }">
      <ChartCard
        title="电力排放"
        quota="powerConsumption"
        chart-type="bar"
        :card-style="{
          background: isDark
            ? 'linear-gradient(180deg, #294B94 0%, #0F275C 100%)'
            : 'linear-gradient(180deg, #f2f9fe 0%, #e6f4fe 100%)',
        }"
      />
    </a-grid-item>
    <a-grid-item :span="{ xs: 12, sm: 12, md: 12, lg: 12, xl: 6, xxl: 6 }">
      <ChartCard
        title="余热发电减排"
        quota="powerGeneration"
        chart-type="bar"
        :card-style="{
          background: isDark
            ? 'linear-gradient(180deg, #312565 0%, #201936 100%)'
            : 'linear-gradient(180deg, #F7F7FF 0%, #ECECFF 100%)',
        }"
      />
    </a-grid-item>
    <a-grid-item :span="{ xs: 12, sm: 12, md: 12, lg: 12, xl: 6, xxl: 6 }">
      <ChartCard
        title="光伏发电减排"
        quota="PVPowerGeneration"
        chart-type="line"
        :card-style="{
          background: isDark
            ? 'linear-gradient(180deg, #312565 0%, #201936 100%)'
            : 'linear-gradient(180deg, #F7F7FF 0%, #ECECFF 100%)',
        }"
      />
    </a-grid-item>
    <a-grid-item :span="{ xs: 12, sm: 12, md: 12, lg: 12, xl: 6, xxl: 6 }">
      <ChartCard
        title="替代燃料减排"
        quota="boundaryEmission"
        chart-type="line"
        :card-style="{
          background: isDark
            ? 'linear-gradient(180deg, #312565 0%, #201936 100%)'
            : 'linear-gradient(180deg, #F7F7FF 0%, #ECECFF 100%)',
        }"
      />
    </a-grid-item>
  </a-grid>
</template>

<script lang="ts" setup>
  import useThemes from '@/hooks/themes';
  import ChartCard from './chart-card.vue';

  const { isDark } = useThemes();
</script>
