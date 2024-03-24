<script setup lang="ts">
import { routes } from "~/utils/apiRoutes";
import { ref } from "vue";
import genericFunctionality from "~/composables/genericFunctionality";
import { useTranslatedColumns, useTranslatedBreadCrumbs, useTitle } from "~/composables/useTranslated";

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
      text: t("Cloud"),
      active: true,
    },
  ],
  optionalItems = {
    searchBar: true,
    isBtnShow: true,
    btnText: t("Create Cloud"),
    path: "/system/cloud/create",
  },
  columnConfig = [
    {
      label: "System Number",
      field: "CloudSystem.cloudSystem.number",
      sortable: true,
    },
    {
      label: "Tennant Name",
      field: "Customer.customer.name",
      sortable: true,
    },
    {
      label: "Sub Type",
      field: "CloudSystem.cloudSystem.subType",
      sortable: true,
    },
    {
      label: "URL",
      field: "url",
      sortable: true,
    },
    {
      label: "Instance Type",
      field: "CloudSystem.cloudSystem.instanceType",
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
  { title } = useTitle("Cloud"),
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
apiRoute.value = routes.SYSTEM_CLOUD;
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
      :key="data[0]?.systems?.length"
      :columns="columns"
      :rows="data[0]?.systems"
      editPath="/system/cloud/edit-"
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
