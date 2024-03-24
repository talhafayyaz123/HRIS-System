<script setup lang="ts">
import { useLayoutStore } from "~/store/layout";
import { ref, watch } from "vue";
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
  rows = ref([]),
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
      text: "Software Version",
      active: true,
    },
  ],
  optionalItems = {
    searchBar: true,
    isBtnShow: true,
    btnText: t("Create Software version"),
    path: "/settings/products/version/create",
  },
  columnConfig = [
    {
      label: "Name",
      field: "name",
      sortable: true,
    },
    {
      label: "Type",
      field: "type",
      sortable: true,
    },
    {
      label: "Software",
      field: "productSoftware",
      sortable: true,
    },
    {
      label: "Created at",
      field: "createdat",
      sortable: true,
    },
    {
      label: "Actions",
      field: "action",
      sortable: false,
    },
  ],
  { title } = useTitle("Software Version"),

  { items } = useTranslatedBreadCrumbs(breadCrumbsConfig),
  { columns } = useTranslatedColumns(columnConfig),

  refresh = async (
    page = currentPage.value,
    perPage = currentPerPage.value,
    column = "id",
    order = "desc",
    search = ""
  ) => {
    await listingFunc({
      page: page,
      perPage: perPage,
      sortBy: column,
      sortOrder: order,
      search: search,
    });
  };

// define api url of this crud that's we define in apiRoutes file.
apiRoute.value = routes.PRODUCT_VERSION;
// after page load call this function
refresh();
useHead({
  title: title,
});

watch(
  () => data.value,
  () => {
    rows.value = [];
    if (!!data.value.productSoftwareVersions) {
      let rowsData = data.value.productSoftwareVersions.map((r: any) => {
        return {
          ...r,
          productSoftware: r.productSoftware.name,
        };
      });
      rows.value = rowsData;
    }
  }
);
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
      :key="data?.productSoftwareVersions?.length"
      :columns="columns"
      :rows="rows"
      editPath="/settings/products/version/edit-"
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
