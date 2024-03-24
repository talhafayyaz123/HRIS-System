<script setup lang="ts">
import { useLayoutStore } from "@/store/layout";
import { routes } from "~/utils/apiRoutes";
import genericFunctionality from "~/composables/genericFunctionality";
import { ref } from "vue";
import commonCode from "~/composables/common";

import {
  useTranslatedColumns,
  useTranslatedBreadCrumbs,
  useTitle,
} from "~/composables/useTranslated";

const {
    apiRoute,
    currentPerPage,
    currentPage,
    orderDirection,
    orderColumn,
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
      text: "System",
      to: "/",
    },
    {
      text: "Operating System",
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
  { title } = useTitle("Operating System"),
  { items } = useTranslatedBreadCrumbs(breadCrumbsConfig),
  { columns } = useTranslatedColumns(columnConfig),
  optionalItems = {
    searchBar: true,
    isBtnShow: true,
    btnText: "Create Operating System",
    path: "/settings/system/operating-system/create",
  },
  refresh = (
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
// define api url of this crud that's we define in apiRoutes file.
apiRoute.value = routes.OPERATING_SYSTEM;
// after page load call this function
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
      :key="data?.operatingSystems?.length"
      :columns="columns"
      :rows="data?.operatingSystems"
      editPath="/settings/system/operating-system/edit-"
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
