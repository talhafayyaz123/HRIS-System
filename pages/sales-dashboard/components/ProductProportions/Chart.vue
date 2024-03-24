<script setup lang="ts">
import { computed, ref } from "vue";

const props = defineProps({
  series: {
    type: Array,
    default: () => ({}),
  },
});

const seriesProductProportions = computed(() => {
  const series = props.series.map((stat) => +stat.total);
  return series.length ? series : [1];
});

const chartOptionsProductProportions = computed(() => {
  const labels = props.series.map((stat) => stat.type);
  return {
    chart: {
      height: "100%",
      type: "pie",
    },
    dataLabels: {
      enabled: true,
      formatter: (val) => {
        return [val.toFixed(2) + "%"];
      },
    },
    labels: labels.length ? labels : ["No Data"],
    tooltip: {
      y: {
        formatter: (val) => {
          return labels.length ? val : "Empty";
        },
      },
    },
    legend: {
      width: 200,
      position: "bottom",
    },
    xaxis: {
      categories: labels,
    },
    plotOptions: {
      pie: {
        dataLabels: {
          offset: -20,
        },
      },
    },
  };
});
</script>
<template>
  <apexchart
    class="mt-5 pb-5"
    type="pie"
    height="300"
    :options="chartOptionsProductProportions"
    :series="seriesProductProportions"
  ></apexchart>
</template>

<style scoped></style>
