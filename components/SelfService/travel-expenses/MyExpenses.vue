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
      data,
      listingFunc,
      onSortChange,
      handleSearch,
      destroy,
    } = genericFunctionality(),
    {router, Toast, deleteAlert} = commonCode(),
    breadCrumbsConfig = [
      {
        text: "Travel Expenses List",
        active: true,
      },
    ],
    optionalItems = {
      searchBar: true
    },

    columnConfig = [
      {
        label: "Departure City",
        field: "departureCity",
        sortable: true,
      },
      {
        label: "Departure Country",
        field: "departureCountry",
        sortable: true,
      },
      {
        label: "Arrival City",
        field: "arrivalCity",
        sortable: true,
      },
      {
        label: "Arrival Country",
        field: "arrivalCountry",
        sortable: true,
      },
      {
        label: "From Date",
        field: "fromDate",
        sortable: true,
      },
      {
        label: "To Date",
        field: "toDate",
        sortable: true,
      },
      {
        label: "Status",
        field: "status",
        sortable: true,
      },
      {
        label: "Actions",
        field: "action",
        sortable: false,
      },
    ],
    rows = ref([]),
    { items } = useTranslatedBreadCrumbs(breadCrumbsConfig),
    { columns } = useTranslatedColumns(columnConfig),
    { title } = useTitle("My Expenses");
useHead({
  title: title,
});
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

apiRoute.value = routes.TRAVEL_EXPENSE;
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
        :key="data?.travelExpense?.length"
        :columns="columns"
        :rows="data?.travelExpense"
        showPath="/self-service/travel-expenses/show-"
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
