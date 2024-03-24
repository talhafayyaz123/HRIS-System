<script setup lang="ts">
import { useLayoutStore } from "~/store/layout";
import { useAuthStore } from "~/store/auth";
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
  auth = useAuthStore(),
  { t } = useI18n(),
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
      text: "Group",
      active: true,
    },
  ],
  optionalItems = ref({
    searchBar: true,
    isBtnShow: true,
    btnText: "Create Group",
    path: "/settings/products/groups/create",
  }),
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
  { title } = useTitle("Groups"),
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
apiRoute.value = routes.PRODUCT_GROUP;
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
      :key="data?.productGroups?.length"
      :columns="columns"
      :rows="data?.productGroups"
      :orderColumn="orderColumn"
      :orderDirection="orderDirection"
      editPath="/settings/products/groups/edit-"
      @onSortChange="onSortChange"
      @destroy="destroy"
    />
  </div>
  <div class="mt-3">
    <Pagination :data="data" @change="refresh" />
  </div>
</template>
