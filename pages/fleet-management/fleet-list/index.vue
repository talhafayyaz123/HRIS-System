<script setup lang="ts">
import {useLayoutStore} from "@/store/layout";
import {routes} from "~/utils/apiRoutes";
import genericFunctionality from "~/composables/genericFunctionality";
import {ref} from "vue";
import commonCode from "~/composables/common";
import { useTranslatedColumns, useTranslatedBreadCrumbs, useTitle } from "~/composables/useTranslated";

const
    store = useLayoutStore(),
    {t} = useI18n(),
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
    {router, Toast, deleteAlert} = commonCode(),
    breadCrumbsConfig = [
      {
        text: "Admin portal",
        to: "/",
      },
      {
        text: "Fleet List",
        active: true,
      },
    ],
    optionalItems = {
      searchBar: true,
      isBtnShow: true,
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
        label: "Brand",
        field: "brand",
        sortable: true,
      },
      {
        label: "Model",
        field: "model",
        sortable: true,
      },
      {
        label: "Fuel Type",
        field: "fuelType",
        sortable: true,
      },
      {
        label: "Leasing Rate",
        field: "leasingRate",
        sortable: true,
      },
      {
        label: "Miles/Year",
        field: "miles",
        sortable: true,
      },
      {
        label: "Mileage",
        field: "totalMileage",
        sortable: true,
      },
      {
        label: "Status",
        field: "status",
        sortable: true,
      },
      {
        label: "Action",
        field: "action",
        sortable: false,
      },
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
const { items } = useTranslatedBreadCrumbs(breadCrumbsConfig),
    { columns } = useTranslatedColumns(columnConfig),
    { title } = useTitle("Fleet List");

useHead({
    title: title,
    });
apiRoute.value = routes.FLEET_LIST;
refresh();
</script>

<template>
  <div>
    <page-header
        :title="title"
        :items="items"
        :optionalItems="optionalItems"
        @watchEvent="handleSearch"
    />
    <Table
        class="doc-table"
        :key="data?.data?.length"
        :columns="columns"
        :rows="data?.data"
        editPath="/fleet-management/fleet-list/edit-"
        :orderColumn="orderColumn"
        :orderDirection="orderDirection"
        @onSortChange="onSortChange"
        @destroy="destroy"
    />
  </div>
  <div class="mt-3">
    <Pagination
        :data="data"
        @change="refresh"
    />
  </div>
</template>
