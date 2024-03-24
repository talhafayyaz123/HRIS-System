<script setup lang="ts">
import { useLayoutStore } from "~/store/layout";
import { ref } from "vue";
import commonCode from "~/composables/common";
import { routes } from "~/utils/apiRoutes";
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
  store = useLayoutStore(),
  { t } = useI18n(),
  { router, Toast, deleteAlert } = commonCode(),
  breadCrumbsConfig = [
    {
      text: "Global Settings",
      to: "/",
    },
    {
      text: "Products",
      to: "/",
    },
    {
      text: "Software",
      active: true,
    },
  ],
  optionalItems = {
    searchBar: true,
    isBtnShow: true,
    btnText: "Create Software",
    path: "/settings/products/software/create",
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
  { title } = useTitle("Product Software"),
  { items } = useTranslatedBreadCrumbs(breadCrumbsConfig),
  // Use the composable function to get translated columns
  { columns } = useTranslatedColumns(columnConfig),
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
apiRoute.value = routes.PRODUCT_SOFTWARE;
// after page load call this function
refresh();

useHead({
  title: title,
});
</script>

<template>
  <div>
    <div>
      <page-header
        :title="title"
        :items="items"
        :optionalItems="optionalItems"
        @watchEvent="handleSearch"
      />
      <Table
        class="doc-table"
        :key="data?.productSoftware?.length"
        :columns="columns"
        :rows="data?.productSoftware"
        editPath="/settings/products/software/edit-"
        :orderColumn="orderColumn"
        :orderDirection="orderDirection"
        @onSortChange="onSortChange"
        @destroy="destroy"
      />
    </div>
    <div class="mt-3">
      <Pagination :data="data" @change="refresh" />
    </div>
  </div>
</template>
