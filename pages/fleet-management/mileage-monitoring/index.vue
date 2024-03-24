<script setup lang="ts">
import { useLayoutStore } from "@/store/layout";
import { routes } from "~/utils/apiRoutes";
import genericFunctionality from "~/composables/genericFunctionality";
import { ref } from "vue";
import commonCode from "~/composables/common";
import { useTranslatedColumns, useTranslatedBreadCrumbs, useTitle } from "~/composables/useTranslated";

const
  store = useLayoutStore(),
  { t } = useI18n(),
  {
    apiRoute,
    currentPerPage,
    currentPage,
    orderColumn,
    orderDirection,
    data,
    listingFunc,
    onSortChange,
    handleSearch,
    destroy,
  } = genericFunctionality(),
  { router, Toast, deleteAlert } = commonCode(),
  breadCrumbsConfig = [
    {
      text: "Admin portal",
      to: "/",
    },
    {
      text: "Mileage Monitoring",
      active: true,
    },
  ],
  optionalItems = {
    searchBar: true,
    isBtnShow: false,
    btnText: "Create Fleet Car",
    path: "/fleet-management/fleet-list/create",
  },

  columnConfig = [
    {
      label: "Licence Plate",
      field: "licenceNumber",
      sortable: true,
    },
    {
      label: "Vim",
      field: "vim",
      sortable: true,
    },
    {
      label: "Contract",
      field: "contactPeriodMonths",
      sortable: true,
    },
    {
      label: "Total Mileage",
      field: "milesPerYear",
      sortable: true,
    },
    {
      label: "Extrapolation of kilometers",
      field: "totalPotential",
      sortable: true,
    },
    {
      label: "Saving Potential",
      field: "totalPotential",
      sortable: true,
    }
  ],
  rows = ref([]);

function refresh(
  page = 1,
  perPage = 10,
  column = "id",
  order = "asc",
  search = ""
) {
  listingFunc({
    page: page,
    perPage: perPage,
    sortBy: column,
    sortOrder: order,
    search: search,
  });
}

const computeBarStyles = (fleetCar: any) => {
  let totalPotential = fleetCar.totalPotential;
  const graphWidth = Math.abs(totalPotential) + "px";
  const graphOrigin = fleetCar.isGreen
    ? "calc(50% - " + totalPotential + "px)"
    : "calc(50% - 1px)";
  const graphDirection = fleetCar.isGreen ? "left" : "right";

  return {
    background: fleetCar.totalPotential === 0 ? "green" : "red",
    width: fleetCar.totalPotential === 0 ? "20px" : graphWidth,
    left:
      fleetCar.totalPotential === 0
        ? "calc(50% - 1px)"
        : graphOrigin,
    right:
      fleetCar.totalPotential === 0
        ? "calc(50% - 1px)"
        : graphOrigin,
    direction: graphDirection,
  };
};
const { items } = useTranslatedBreadCrumbs(breadCrumbsConfig),
    { columns } = useTranslatedColumns(columnConfig),
    { title } = useTitle("Mileage Monitoring");

useHead({
    title: title,
    });
apiRoute.value = routes.FLEET_MILEAGE_MONITORING;
refresh();
</script>

<template>
  <div>
    <page-header :title="title" :items="items" :optionalItems="optionalItems" @watchEvent="handleSearch" />

    <div class="row mb-3">
      <div class="col-lg-3">
        <div class="card p-3">
          <div class="card-header p-0">
            <h4 class="card-title">
              {{ $t("Vehicles with low mileage") }}
            </h4>
          </div>

          <div class="d-flex align-items-center pt-2">
            <i class="fa-solid fa-arrow-down text-red-500 bg-red-200 rounded-circle"
              style="font-size: 8px; padding: 0.4rem;"></i>
            <span class="custom-span-style pl-5">
              {{ data?.carsWithLessMileage }}
            </span>
          </div>
        </div>
      </div>
      <div class="col-lg-3">
        <div class="card p-3">
          <div class="card-header p-0">
            <h4 class="card-title">
              {{ $t("Vehicles with more kilometers") }}
            </h4>
          </div>

          <div class="d-flex align-items-center pt-2">
            <i class="fa-solid fa-arrow-up text-red-500 bg-red-200 rounded-circle"
              style="font-size: 8px; padding: 0.4rem;"></i>
            <span class="custom-span-style pl-5">
              {{ data?.carsWithMoreKilometers }}
            </span>
          </div>
        </div>
      </div>
      <div class="col-lg-3">
        <div class="card p-3">
          <div class="card-header p-0">
            <h4 class="card-title">
              {{ $t("Vehicles Ok") }}
            </h4>
          </div>

          <div class="d-flex align-items-center pt-2">
            <i class="fa-solid fa-check text-green-800 bg-green-200 rounded-circle"
              style="font-size: 10px; padding: 0.4rem;"></i>
            <span class="custom-span-style pl-5">
              {{ data?.carsWithExactKilometers }}
            </span>
          </div>
        </div>
      </div>
      <div class="col-lg-3">
        <div class="card p-3">
          <div class="card-header p-0">
            <h4 class="card-title">
              {{ $t("Savings potential") }}
            </h4>
          </div>

          <div class="d-flex align-items-center pt-2">
            <span class="custom-span-style pl-5">
              {{ data?.totalSavingPotential }}
            </span>
          </div>
        </div>
      </div>
    </div>


    <Table class="doc-table"  :orderColumn="orderColumn" :orderDirection="orderDirection" :key="data?.data?.length" :columns="columns" :rows="data?.data"
      editPath="/fleet-management/fleet-list/edit-" @onSortChange="onSortChange" @destroy="destroy" />
  </div>
  <div class="mt-3">
    <Pagination :data="data" @change="refresh" />
  </div>
</template>
