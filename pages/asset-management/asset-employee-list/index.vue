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
    orderColumn,
    orderDirection,
    data,
    listingFunc,
    onSortChange,
    handleSearch,
    destroy,
  } = genericFunctionality(),
  { router, Toast, deleteAlert } = commonCode(),
  isModalOpen = ref(false),
  store = useLayoutStore(),
  { t } = useI18n(),
  breadCrumbsConfig = [
    {
      text: "Admin Portal",
      to: "/",
    },
    {
      text: "Asset List",
      to: "/asset-management/asset-employee-list",
      active: true,
    },
  ],
  optionalItems = {
    searchBar: true,
    isBtnShow: true,
    btnText: t("Create Asset List"),
    path: "/asset-management/asset-employee-list/create",
  },
  columnConfig = [
    {
      label: "Name",
      field: "name",
      sortable: true,
    },
    {
      label: "Asset List Number",
      field: "assetListNumber",
      sortable: true,
    },
    {
      label: "Asset Type",
      field: "assetType",
      sortable: true,
    },
    {
      label: "personalNumber",
      field: "Personal Number",
      sortable: true,
    },
    {
      label: "location",
      field: "Location",
      sortable: true,
    },
    {
      label: "Actions",
      field: "action",
      sortable: false,
    },
  ],
  { items } = useTranslatedBreadCrumbs(breadCrumbsConfig),
  { columns } = useTranslatedColumns(columnConfig),
  { title } = useTitle("Asset List Create"),
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
apiRoute.value = routes.SALE_OFFER;
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
        :key="data?.confirmationAndOffers?.length"
        :columns="columns"
        :rows="data?.confirmationAndOffers"
        editPath="/offers/edit-"
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
