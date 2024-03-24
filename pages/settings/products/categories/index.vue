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
    text: "Products",
    to: "/",
  },
    {
      text: "Categories",
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
      label: "Default Unit",
      field: "ProductUnit.defaultUnit.name",
      sortable: true,
    },
    {
      label: "Is Default On Offers",
      field: "isDefaultOnOffer",
      sortable: true,
    },
    {
      label: "Actions",
      field: "action",
      sortable: false,
    },
  ],
  optionalItems = {
    searchBar: true,
    isBtnShow: true,
    btnText: "Create Categories",
    path: "/settings/products/categories/create",
  },
  { title } = useTitle("Categories"),
  { items } = useTranslatedBreadCrumbs(breadCrumbsConfig),
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
apiRoute.value = routes.PRODUCT_CATEGORY;
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
    <div class="table-responsive">
      <Table
        class="doc-table"
        :key="data?.productCategories?.length"
        :columns="columns"
        :rows="
          data?.productCategories?.map((pc) => {
            return { ...pc, defaultUnit: pc?.defaultUnit?.name };
          })
        "
        :orderColumn="orderColumn"
        :orderDirection="orderDirection"
        editPath="categories/edit-"
        @onSortChange="onSortChange"
        @destroy="destroy"
      />
    </div>
     <div class="mt-3">
        <Pagination :data="data" @change="refresh" />
    </div>
  </div>
</template>
