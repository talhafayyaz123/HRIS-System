<script setup lang="ts">
import { useLayoutStore } from "~/store/layout";
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
    data,
    orderColumn,
    orderDirection,
    listingFunc,
    onSortChange,
    handleSearch,
    destroy,
  } = genericFunctionality(),
  { router, Toast, deleteAlert } = commonCode(),
  store = useLayoutStore(),
  { t } = useI18n(),
  breadCrumbsConfig = [
    {
      text: "Global Settings",
      to: "/",
    },
    {
      text: "Personal management",
      to: "/",
    },
    {
      text: "Highest Education Levels",
      active: true,
    },
  ],
  columnConfig = [
    {
      label: "Product Name",
      field: "name",
      sortable: true,
    },
    {
      label: "Actions",
      field: "action",
      sortable: false,
    },
  ],
  { title } = useTitle("Highest Education Levels"),
  { items } = useTranslatedBreadCrumbs(breadCrumbsConfig),
  { columns } = useTranslatedColumns(columnConfig),
  optionalItems = {
    searchBar: true,
    isBtnShow: true,
    btnText: "Create Highest Education Level",
    path: "/settings/personal-management/highest-education-levels/create",
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
apiRoute.value = routes.EDUCATION_LEVEL;
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
      :key="data?.educationLevels?.length"
      :columns="columns"
      :rows="data?.educationLevels"
      editPath="/settings/personal-management/highest-education-levels/edit-"
      @onSortChange="onSortChange"
      @destroy="destroy"
      :orderColumn="orderColumn"
      :orderDirection="orderDirection"
    />
  </div>
  <div class="mt-3">
    <Pagination @change="refresh" :data="data" />
  </div>
</template>
