<script setup lang="ts">
import { useLayoutStore } from "@/store/layout";
import { routes } from "~/utils/apiRoutes";
import genericFunctionality from "~/composables/genericFunctionality";
import { ref } from "vue";
import commonCode from "~/composables/common";
import { useTranslatedColumns, useTranslatedBreadCrumbs, useTitle } from "~/composables/useTranslated";

const store = useLayoutStore();
const { t } = useI18n();
const {
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
  { router, Toast, deleteAlert } = commonCode();
const breadCrumbsConfig = [
  {
    text: "Admin portal",
    to: "/",
  },
  {
    text: "System",
  },
  {
    text: "On Premise",
    active: true,
  },
];
const optionalItems = {
  searchBar: true,
  isBtnShow: true,
  btnText: "Create System",
  path: "/system/on-premise/create",
};

const columnConfig = [
  {
    label: "System Number",
    field: "number",
    sortable: true,
  },
  {
    label: "System Name",
    field: "SystemPremiseDetail.systemable.systemName",
    sortable: true,
  },
  {
    label: "Customer",
    field: "Customer.customer.name",
    sortable: true,
  },
  {
    label: "Server IP",
    field: "SystemPremiseDetail.systemable.serverIp",
    sortable: true,
  },
  {
    label: "Instance Type",
    field: "instanceType",
    sortable: true,
  },
  {
    label: "Operating System",
    field: "OperatingSystem.operatingSystem.name",
    sortable: true,
  },
  {
    label: "Software",
    field: "software",
    sortable: false,
  },
  {
    label: "Actions",
    field: "action",
    sortable: false,
  },
],
{ items } = useTranslatedBreadCrumbs(breadCrumbsConfig),
{ columns } = useTranslatedColumns(columnConfig),
{ title } = useTitle("On Premise"),
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

apiRoute.value = routes.SYSTEM_ON_PREMISE;
refresh();

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
      :key="data?.systems?.length"
      :columns="columns"
      :rows="data?.systems"
      editPath="/system/on-premise/edit-"
      :orderColumn="orderColumn"
      :orderDirection="orderDirection"
      @onSortChange="onSortChange"
      @destroy="destroy"
    />
  </div>
  <div class="mt-3">
        <Pagination :data="data" @change="refresh" />
    </div>
</template>
