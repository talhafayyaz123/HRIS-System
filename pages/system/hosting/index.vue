<script setup lang="ts">
import { routes } from "~/utils/apiRoutes";
import { ref } from "vue";
import genericFunctionality from "~/composables/genericFunctionality";
import { useTranslatedColumns, useTranslatedBreadCrumbs, useTitle } from "~/composables/useTranslated";


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
  { t } = useI18n(),
  breadCrumbsConfig = [
    {
      text: "Admin portal",
      to: "/",
    },
    {
      text: "System",
    },
    {
      text: t("Hosting"),
      active: true,
    },
  ],
  optionalItems = {
    searchBar: true,
    isBtnShow: true,
    btnText: t("Create Hosting"),
    path: "/system/hosting/create",
  },
  columnConfig = [
    {
      label: "System Number",
      field: "number",
      sortable: true,
    },
    {
      label: "Customer",
      field: "Customer.customer.name",
      sortable: true,
    },
    {
      label: "Hosting Type",
      field: "SystemHostingDetail.systemable.hostingType",
      sortable: true,
    },
    {
      label: "Host",
      field: "SystemHostingDetail.systemable.host",
      sortable: true,
    },
    {
      label: "System Name",
      field: "SystemHostingDetail.systemable.systemName",
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
  { title } = useTitle("Hosting"),
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
apiRoute.value = routes.HOST_SYSTEM;
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
      :key="data?.systems?.length"
      :columns="columns"
      :rows="data?.systems"
      editPath="/system/hosting/edit-"
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
