<script setup lang="ts">
import { routes } from "~/utils/apiRoutes";
import { ref } from "vue";
import commonCode from "~/composables/common";
import genericFunctionality from "~/composables/genericFunctionality";

import {
  useTranslatedColumns,
  useTranslatedBreadCrumbs,
  useTitle,
} from "~/composables/useTranslated";

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
  { router, Toast, deleteAlert } = commonCode(),
  { t } = useI18n(),
  breadCrumbsConfig = [
    {
      text: "Global Settings",
      to: "/",
    },
    {
      text: "Contract Management",
      to: "/",
    },
    {
      text: "Contract Types",
      active: true,
    },
  ],
  columnConfig = [
    {
      label: "Name",
      field: "name",
      sortable: true,
    },
    {
      label: "Actions",
      field: "action",
      sortable: false,
    },
  ],

  { title } = useTitle("Contract Types"),
  { items } = useTranslatedBreadCrumbs(breadCrumbsConfig),
  { columns } = useTranslatedColumns(columnConfig),

  optionalItems = {
    searchBar: true,
    isBtnShow: true,
    btnText: "Create Contract Type",
    path: "/settings/contract-management/contract-types/create",
  };

const refresh = (
  page = currentPage.value,
  perPage = currentPerPage.value,
  column = "id",
  order = "desc",
  search = ""
) => {
  listingFunc({
    page: page,
    perPage: perPage,
    sortBy: column,
    sortOrder: order,
    search: search,
  });
};
apiRoute.value = routes.CONTRACT_TYPES;
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
    <div class="table-responsive">
      <Table
        class="doc-table"
        :key="data?.contractTypes?.length"
        :columns="columns"
        :rows="data?.contractTypes"
        :orderColumn="orderColumn"
        :orderDirection="orderDirection"
        editPath="/settings/contract-management/contract-types/edit-"
        @onSortChange="onSortChange"
        @destroy="destroy"
      />
    </div>
    <div class="mt-3">
      <Pagination :data="data" @change="refresh" />
    </div>
  </div>
</template>
