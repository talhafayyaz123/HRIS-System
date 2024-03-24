<script setup lang="ts">
import { useLayoutStore } from "~/store/layout";
import { routes } from "~/utils/apiRoutes";
import { ref } from "vue";
import commonCode from "~/composables/common";
import genericFunctionality from "~/composables/genericFunctionality";
import { deleteLicenseGeneratorRequest } from "~/utils/apiRequests";
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
  } = genericFunctionality(),
  { router, Toast, deleteAlert } = commonCode(),
  store = useLayoutStore(),
  { t } = useI18n(),
  breadCrumbsConfig = [
    {
      text: "Admin Portal",
      to: "/",
    },
    {
      text: "License Generator",
      to: "/licenses",
      active: true,
    },
  ],
  optionalItems = {
    searchBar: true,
    isBtnShow: true,
    btnText: t("Create License Generator"),
    path: "/licenses/create",
  },
  columnConfig = [
    {
      label: "Name",
      field: "name",
      sortable: false,
    },
    {
      label: "Company",
      field: "company",
      sortable: false,
    },
    {
      label: "Tenant",
      field: "tenant",
      sortable: false,
    },
    {
      label: "Creation Date",
      field: "creationDate",
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
    { title } = useTitle("Licenses"),
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
apiRoute.value = routes.LICENSES;
// custom destroy
const destroy = async (id) => {
  if (id) {
    await deleteAlert().then((result) => {
      if (result.isConfirmed) {
        deleteLicenseGeneratorRequest({ id: id })
          .then((response) => {
            Toast.fire({
              icon: "success",
              title: "Record deleted successfully!",
            });
            refresh();
          })
          .catch((error) => {
            if (error && error.response && error.response.data) {
              Toast.fire({ icon: "error", title: error.response.data.message });
            }
          });
      }
    });
  }
};

// after page load call this function
refresh();
useHead({
  title: title
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
      :key="data?.data?.length"
      :columns="columns"
      :rows="data?.data"
      showPath="/licenses/show-"
      editPath="/licenses/edit-"
      :orderColumn="orderColumn"
      :orderDirection="orderDirection"
      @onSortChange="onSortChange"
      @destroy="destroy"
    />
    <div class="mt-3">
      <Pagination :data="data" @change="refresh" />
    </div>
  </div>
</template>
