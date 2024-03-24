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
  rows = ref([]),
  breadCrumbsConfig = [
  {
    text: "Admin portal",
    to: "/",
  },
  {
      text: "Support",
      to: "/",
  },
  {
    text: "Application Management Services",
    active: true,
  },
  ],
  optionalItems = {
  searchBar: true,
  isBtnShow: true,
  btnText: "Create Application Management Services",
  path: "/support/ams/create",
  },
  columnConfig = [
  {
    label: "AMS Number",
    field: "amsNumber",
    sortable: true,
  },
  {
    label: "Customer",
    field: "customerId",
    sortable: true,
  },
  {
    label: "Service Hours Year",
    field: "serviceHoursYear",
    sortable: true,
  },
  {
    label: "Remaining Hours",
    field: "usedHours",
    sortable: true,
  },
  {
    label: "Hourly Rate",
    field: "hourlyRate",
    sortable: true,
  },
  {
      label: "Monthly Amount",
      field: "monthlyAmount",
      sortable: true,
  },
  {
    label: "Action",
    field: "action",
    sortable: false,
  },
  ];
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

apiRoute.value = routes.SUPPORT_AMS;
refresh();

watch(
    () => data.value,
    () => {
        rows.value= []
        if(!!data.value?.ams){
            let rowsData = data.value.ams.map((r: any) => {
                return {
                    ...r,
                    customerId: r.customerId.name
                };
            })
            rows.value= rowsData
        }
    }
)

const { items } = useTranslatedBreadCrumbs(breadCrumbsConfig),
    { columns } = useTranslatedColumns(columnConfig),
    { title } = useTitle("Application Management Services");

useHead({
    title: title,
    });
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
      :key="data?.leads?.length"
      :columns="columns"
      :rows="rows"
      editPath="/support/ams/edit-"
      :orderColumn="orderColumn"
      :orderDirection="orderDirection"
      @onSortChange="onSortChange"
      @destroy="destroy"
    />
  </div>
  <div class="mt-3">
    <Pagination
      @change="refresh"
      :data="data"
    />
  </div>
</template>
