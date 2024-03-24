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
      text: "Global Settings",
      to: "/",
    },
    {
      text: "Affected Groups",
      active: true,
    },
  ],
  optionalItems = {
    searchBar: true,
    isBtnShow: true,
    btnText: "Create Affected Groups",
    path: "/settings/global-settings/affected-groups/create",
  },
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
  { title } = useTitle("Affected Groups"),
  { items } = useTranslatedBreadCrumbs(breadCrumbsConfig),
  { columns } = useTranslatedColumns(columnConfig),
  refresh = (
    page = currentPage.value,
    perPage = currentPerPage.value,
    column = "id",
    order = "asc",
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
apiRoute.value = routes.AFFECTED_GROUP;
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
      :orderColumn="orderColumn"
      :orderDirection="orderDirection"
      :key="data?.affectedGroups?.length"
      :columns="columns"
      :rows="data?.affectedGroups"
      editPath="/settings/global-settings/affected-groups/edit-"
      @onSortChange="onSortChange"
      @destroy="destroy"
    />
    <div class="mt-3">
      <Pagination :data="data" @change="refresh" />
    </div>
  </div>
</template>
