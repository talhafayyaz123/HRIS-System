<script setup lang="ts">
import { useLayoutStore } from "@/store/layout";
import { ref, reactive, computed, watch } from "vue";
import DatePicker from "@vuepic/vue-datepicker";
import "@vuepic/vue-datepicker/dist/main.css";
import genericFunctionality from "~/composables/genericFunctionality";
import genericFeatures from "~/composables/generic";
import { routes } from "~/utils/apiRoutes";
import Chart from "./components/StackedProportions/Chart.vue";
import ProductChart from "./components/ProductProportions/Chart.vue";
import OfferTable from "./components/Tables/Offer.vue";
import OrderTable from "./components/Tables/Order.vue";
import { salesDashboardStatisticsRequest } from "~/utils/apiRequests";
import { useTranslatedColumns, useTranslatedBreadCrumbs, useTitle } from "~/composables/useTranslated";

const store = useLayoutStore();
const { t } = useI18n(),
  { showGenericListing } = genericFeatures(),
  { submitted, isLoading, apiRoute, storeFunc } = genericFunctionality();
const breadCrumbsConfig = [
  {
    text: "Admin portal",
    to: "/",
  },
  {
    text: "Sales Dashboard",
    active: true,
  },
],
  { items } = useTranslatedBreadCrumbs(breadCrumbsConfig),
  { title } = useTitle("Sales Dashboard");
const isUpdate = ref(false);
const seriesOffers = computed(() => {
  return [
    {
      name: "Offers",
      type: "area",
      data: Object.values(offersStatistics.value).map((item) =>
        item?.nettoTotalOffers.toFixed(0)
      ),
    },
    {
      name: "Orders",
      type: "line",
      data: Object.values(offersStatistics.value).map((item) =>
        item?.nettoTotalOrders.toFixed(0)
      ),
    },
  ];
});

// lead channel series for chart
const seriesLeadChannels = computed(() => {
  return [
    {
      data: leadChannelsStatistics.value.map((item) => item.total),
    },
  ];
});

// lead channel chart options
const chartOptionsLeadChannels = computed(() => {
  return {
    chart: {
      type: "bar",
      height: 350,
    },
    dataLabels: {
      enabled: true,
      offsetX: 0,
    },
    plotOptions: {
      bar: {
        borderRadius: 4,
        horizontal: true,
      },
    },
    yaxis: {
      forceNiceScale: true,
    },
    xaxis: {
      categories: leadChannelsStatistics.value.map((item) => item.name),
    },
  };
});

const chartOptionsOffers = computed(() => {
  return {
    chart: {
      height: 350,
      type: "line",
    },
    fill: {
      type: "solid",
    },
    colors: ["#1297fb", "#00e396"],
    labels: Object.keys(offersStatistics.value).map((date) =>
      state.filterBy === "monthly" ? date : monthlyData.value[date]
    ), //map the date
    markers: {
      size: 0,
    },
    xaxis: {
      labels: {
        show: true,
        rotate: 0,
      },
    },
    yaxis: {
      forceNiceScale: true,
      title: {
        text: "€ Euro",
      },
      labels: {
        // formatter: (value) => {
        //   return this.$formatter(value, this.globalLanguage);
        // },
      },
    },
    stroke: {
      width: [5, 5],
      colors: ["#1297fb", "#00e396"],
      curve: "straight",
    },
    tooltip: {
      shared: true,
      intersect: false,
      y: {
        formatter: (y) => {
          // if (typeof y !== "undefined" && y !== null) {
          //   return this.$formatter(y.toFixed(0), this.globalLanguage);
          // }
          return y;
        },
      },
    },
  };
});

const productProportionsOffers = ref([]); // product proportion statistics for offers
const productProportionsOrders = ref([]); // product proportion statistics for orders
const leadChannelsStatistics = ref([]); // product proportion statistics for orders

const customers = ref([]);
const shouldShowOffers = ref(false);
// toggles orders chart
const shouldShowOrders = ref(false);
const offersData = ref({
  license: [],
  maintenance: [],
  service: [],
  application: [],
  hosting: [],
  cloud: [],
});
const ordersData = ref({
  license: [],
  maintenance: [],
  service: [],
  application: [],
  hosting: [],
  cloud: [],
});
// offer dates used in x-axis
const offersDates = ref([]);
// order dates used in x-axis
const ordersDates = ref([]);

const state = reactive({
  filterBy: "yearly",
  month: {
    month: new Date().getMonth(),
    year: new Date().getFullYear(),
  },
  year: new Date().getFullYear(),
  customer: "",
});
const date = ref(new Date().getFullYear());
const offersStatistics = ref({});
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
const optionalItems = {
  searchBar: false,
  isBtnShow: false,
  btnText: "Create Project",
  path: "/project-management/projects/create",
};

watch(
  () => state.filterBy,
  (val) => {
    if (val == "monthly") {
      date.value = `${state.month.year}-${state.month.month + 1}-01`;
    } else {
      date.value = state.year
    }
    // date.value = `${
    //   state.filterBy === "monthly" ? state.month.year : state.year
    // }-${state.month.month + 1}-01`;
    getStatistics();
  }
);

watch(
  () => state.month,
  (val) => {
    date.value = `${state.month.year}-${state.month.month + 1}-01`;
    getStatistics();
  }
);

watch(
  () => state.year,
  (val) => {
    date.value = `${state.year}-01-01`;
    getStatistics();
  }
);

watch(
  () => state.customer,
  (val) => {
    getStatistics();
  }
);

function getStatistics() {
  isUpdate.value = true;
  const layout = useLayoutStore();
  layout.changeLoaderValue(true);
  salesDashboardStatisticsRequest({
    customerId: state.customer ?? "",
    type: state.filterBy,
    date: `${state.filterBy === "monthly" ? state.month.year : state.year}-${state.month.month + 1
      }-01`,
  })
    .then((response) => {
      offersStatistics.value = response?.data?.offerStats;

      shouldShowOffers.value = false;
      // toggle off the orders chart
      shouldShowOrders.value = false;
      // reset the offers data
      offersData.value = {
        license: [],
        maintenance: [],
        service: [],
        application: [],
        hosting: [],
        cloud: [],
      };
      // reset the orders data
      ordersData.value = {
        license: [],
        maintenance: [],
        service: [],
        application: [],
        hosting: [],
        cloud: [],
      };

      productProportionsOffers.value =
        response?.data?.productsStats?.offerProportions ?? [];
      productProportionsOrders.value =
        response?.data?.productsStats?.orderProportions ?? [];
      leadChannelsStatistics.value = response?.data?.leadStatistics ?? [];
      // set the x-axis dates
      offersDates.value = ordersDates.value = Object.keys(
        response?.data?.offerStats
      );
      // loop over the values from offer statistics
      Object.values(response?.data?.offerStats).forEach((item) => {
        // set the offersData after adding a check
        let offerData =
          item.nettoTotalOffersDetails instanceof Array
            ? {}
            : item.nettoTotalOffersDetails;
        // set the ordersData after adding a check
        let orderData =
          item.nettoTotalOrdersDetails instanceof Array
            ? {}
            : item.nettoTotalOrdersDetails;
        // set the chart data based on category of products
        offersData.value.license.push((offerData.license ?? 0).toFixed(2));

        ordersData.value.license.push((orderData.license ?? 0).toFixed(2));
        offersData.value.maintenance.push(
          (offerData.maintenance ?? 0).toFixed(2)
        );
        ordersData.value.maintenance.push(
          (orderData.maintenance ?? 0).toFixed(2)
        );
        offersData.value.service.push((offerData.service ?? 0).toFixed(2));
        ordersData.value.service.push((orderData.service ?? 0).toFixed(2));
        offersData.value.application.push(
          (offerData.application ?? 0).toFixed(2)
        );
        ordersData.value.application.push(
          (orderData.application ?? 0).toFixed(2)
        );
        offersData.value.hosting.push((offerData.hosting ?? 0).toFixed(2));
        ordersData.value.hosting.push((orderData.hosting ?? 0).toFixed(2));
        offersData.value.cloud.push((offerData.cloud ?? 0).toFixed(2));
        ordersData.value.cloud.push((orderData.cloud ?? 0).toFixed(2));
      });

      // toggle on the offers chart
      shouldShowOffers.value = true;
      // toggle on the orders chart
      shouldShowOrders.value = true;
    })
    .finally(() => {
      isUpdate.value = false;
      layout.changeLoaderValue(false);
    });
}

async function refresh() {
  let customerListing = await showGenericListing(routes.COMPANY);
  if (!!customerListing?.data?.customers) {
    customers.value = customerListing.data.customers.map((ts: any) => {
      return { value: ts.id, text: ts.name };
    });
  }
  getStatistics();
}

refresh();
useHead({
  title: title,
});
</script>

<template>
  <div>
    <page-header :title="title" :items="items" :optionalItems="optionalItems" />
    <div class="">
      <div class="card">
        <div class="card-header d-flex">
          <h3 class="card-title me-2">
            {{ $t("Dashboard") }}
          </h3>
        </div>
        <div class="card-body">
          <div class="row align-items-center">
            <div class="col-lg-2 col-sm-3">
              <div class="form-group">
                <input v-model="state.filterBy" type="radio" class="me-2" name="filterBy" value="yearly" id="yearly" />
                <label for="">{{ $t('Yearly') }}</label>
              </div>
            </div>
            <div class="col-lg-2 col-sm-3">
              <div class="form-group">
                <input v-model="state.filterBy" type="radio" class="me-2" name="filterBy" id="monthly" value="monthly" />
                <label for="">{{ $t('Monthly') }}</label>
              </div>
            </div>
            <div class="col-lg-4 col-sm-3">
              <div v-if="state.filterBy == 'monthly'">
                <label for="">{{ $t('Month') }}</label>
                <DatePicker :clearable="false" :enable-time-picker="false" auto-apply :close-on-auto-apply="false"
                  v-model="state.month" month-picker />
              </div>
              <div v-else class="form-group">
                <DatePicker :clearable="false" :enable-time-picker="false" auto-apply :close-on-auto-apply="false"
                  v-model="state.year" year-picker />
              </div>
            </div>
            <div class="col-lg-4 col-sm-3">
              <div class="form-group">
                <elements-multiselect v-model="state.customer" :options="customers" label="text" track-by="value"
                  :key="state.customer" :textLabel="$t('Customer')" />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="card mt-3">
        <div class="card-header d-flex align-items-center">
          <h3 class="card-title me-2">
            {{ $t("Offers/Incoming Orders") }}
          </h3>
          <ElementsTooltip/>
        </div>
        <div class="card-body">
          <div class="row">
            <div class="col-lg-12 col-sm-12">
              <div style="height: 400px">
                <apexchart class="mt-5 pb-5" type="line" height="100%" :options="chartOptionsOffers"
                  :series="seriesOffers"></apexchart>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="card mt-3">
        <div class="card-header d-flex align-items-center">
          <h3 class="card-title me-2">
            {{ $t("Offers") }}
          </h3>
          <ElementsTooltip/>
        </div>
        <div class="card-body">
          <div class="row">
            <div class="col-lg-7 col-sm-7">
              <div style="height: 400px">
                <Chart v-if="shouldShowOffers" :series="offersData" :dates="offersDates" :filterBy="state.filterBy" />
              </div>
            </div>
            <div class="col-lg-12 col-sm-5">
              <OfferTable :customerId="state.customer ?? ''" :type="state.filterBy" :date="date" :isUpdate="isUpdate" />
            </div>
          </div>
        </div>
      </div>
      <div class="card mt-3">
        <div class="card-header d-flex">
          <h3 class="card-title me-2">
            {{ $t("Incoming Orders") }}
          </h3>
        </div>
        <div class="card-body">
          <div class="row">
            <div class="col-lg-7 col-sm-7">
              <div style="height: 400px">
                <Chart v-if="shouldShowOffers" :series="ordersData" :dates="ordersDates" :filterBy="state.filterBy" />
              </div>
            </div>
            <div class="col-lg-12 col-sm-5">
              <OrderTable :customerId="state.customer ?? ''" :type="state.filterBy" :date="date" :isUpdate="isUpdate" />
            </div>
          </div>
        </div>
      </div>
      <div class="card mt-3">
        <div class="card-body">
          <div class="row">
            <div class="col-lg-6 col-sm-6">
              <div class="card-header ps-0 d-flex">
                <h3 class="card-title me-2">
                  {{ $t("Product Proportions Offers") }}
                </h3>
              </div>
              <div style="height: 300px">
                <ProductChart :key="1" :series="productProportionsOffers" />
              </div>
            </div>
            <div class="col-lg-6 col-sm-6">
              <div class="card-header ps-0 d-flex">
                <h3 class="card-title me-2">
                  {{ $t("Product Proportions Orders") }}
                </h3>
              </div>
              <div style="height: 300px">
                <ProductChart :key="2" :series="productProportionsOrders" />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="card mt-3">
        <div class="card-header d-flex">
          <h3 class="card-title me-2">
            {{ $t("Lead Channel Statistics") }}
          </h3>
        </div>
        <div class="card-body">
          <div class="row">
            <div class="col-lg-12 col-sm-12">
              <div style="height: 300px">
                <apexchart class="mt-5 pb-5" type="bar" height="100%" :options="chartOptionsLeadChannels"
                  :series="seriesLeadChannels"></apexchart>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
