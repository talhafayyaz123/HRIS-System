<script setup lang="ts">
import { computed, ref } from "vue";

const props = defineProps({
  series: {
    type: Array,
    default: () => ({}),
  },
  dates: {
    type: Array,
    default: () => [],
  },
  filterBy: {
    type: String,
    default: "yearly",
  },
});
const monthlyData = ref({
  1: "January",
  2: "February",
  3: "March",
  4: "April",
  5: "May",
  6: "June",
  7: "July",
  8: "August",
  9: "September",
  10: "October",
  11: "November",
  12: "December",
});

const seriesProductProportions = computed(() => {
  return [
    {
      name: "License",
      data: props.series?.license,
    },
    {
      name: "Maintenance",
      data: props.series?.maintenance,
    },
    {
      name: "Service",
      data: props.series?.service,
    },
    {
      name: "Application",
      data: props.series?.application,
    },
    {
      name: "Hosting",
      data: props.series?.hosting,
    },
    {
      name: "Cloud",
      data: props.series?.cloud,
    },
  ];
});

const chartOptionsProductProportions = computed(() => {
              return {
                chart: {
                    type: "bar",
                    height: "100%",
                    stacked: true,
                    toolbar: {
                        show: true,
                    },
                    zoom: {
                        enabled: true,
                    },
                },
                responsive: [
                    {
                        breakpoint: 480,
                        options: {
                            legend: {
                                position: "bottom",
                                offsetX: -10,
                                offsetY: 0,
                            },
                        },
                    },
                ],
                plotOptions: {
                    bar: {
                        horizontal: false,
                        borderRadius: 10,
                        columnWidth: "100%",
                        distrubuted: true,
                        dataLabels: {
                            position: "bottom",
                            total: {
                                enabled: true,
                                style: {
                                    fontSize: "8px",
                                    color: "white",
                                },
                            },
                        },
                    },
                },
                dataLabels: {
                    enabled: true,
                    style: {
                        fontSize: "8px",
                    },
                    background: {
                        enabled: true,
                        foreColor: "black",
                        padding: 4,
                        borderRadius: 2,
                        borderWidth: 1,
                        borderColor: "#fff",
                        opacity: 0.9,
                        dropShadow: {
                            enabled: false,
                            top: 1,
                            left: 1,
                            blur: 1,
                            color: "#000",
                            opacity: 0.45,
                        },
                    },
                    formatter: function (val, opt) {
                        return typeof val === "number" ? val.toFixed(2) : val;
                    },
                    offsetX: 0,
                },
                xaxis: {
                    categories: props.dates.map((date) =>
                        props.filterBy === "monthly"
                            ? date
                            : monthlyData.value[date]
                    ), //map the date,
                },
                yaxis: {
                    forceNiceScale: true,
                    labels: {
                        formatter: (value) => {
                            return value
                        },
                    },
                },
                tooltip: {
                    y: {
                        formatter: (y) => {
                            // if (typeof y !== "undefined" && y !== null) {
                            //     return this.$formatter(
                            //         y.toFixed(0),
                            //         this.globalLanguage,
                            //         "EUR",
                            //         false,
                            //         2,
                            //         2
                            //     );
                            // }
                            return y;
                        },
                    },
                },
                legend: {
                    position: "right",
                    offsetY: 40,
                },
                fill: {
                    opacity: 1,
                },
            };
});
</script>

<template>
  <apexchart
    type="bar"
    class="mt-5 pb-5"
    height="400"
    :options="chartOptionsProductProportions"
    :series="seriesProductProportions"
  ></apexchart>
</template>
