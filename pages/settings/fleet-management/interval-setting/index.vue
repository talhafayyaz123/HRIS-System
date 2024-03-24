<script setup lang="ts">
import { routes } from "~/utils/apiRoutes";
import { ref } from "vue";
import commonCode from "~/composables/common";
import genericFunctionality from "~/composables/genericFunctionality";
import {
  listEmployeesRequest
} from "~/utils/apiRequests";

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
  { t } = useI18n(),
  breadCrumbsConfig = [
    {
      text: "Global Settings",
      to: "/",
    },
    {
      text: "Fleet Management",
      to: "/",
    },
    {
      text: "Interval Settings",
      active: true,
    },
  ],
  optionalItems = {
    searchBar: true,
    isBtnShow: true,
    btnText: "Interval Settings Create",
    path: "/settings/fleet-management/interval-setting/create",
  };
const users = ref([]);
const columnConfig = [
    {
      label: "Months",
      field: "months",
      sortable: true,
    },
    {
      label: "Actions",
      field: "action",
      sortable: false,
    },
  ],

  { title } = useTitle("Interval Settings"),
  { items } = useTranslatedBreadCrumbs(breadCrumbsConfig),
  { columns } = useTranslatedColumns(columnConfig),


  refresh = (
    page = currentPage.value,
    perPage = currentPerPage.value,
    column = "id",
    order = "asc",
    search = ""
  ) => {
    listEmployeesRequest({
      limit_start: 0,
      limit_count: 25,
      type: "employee",
      company_id: "",
    }).then((response) => {
      users.value = response?.data
    });
    listingFunc({
      page: page,
      perPage: perPage,
      sortBy: column,
      sortOrder: order,
      search: search,
    });
  };
// define api url of this crud that's we define in apiRoutes file.
apiRoute.value = routes.INTERVAL_SETTING;
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
      <div class="table-responsive">
        <Table
          class="doc-table"
          :key="data?.IntervalSettings?.length"
          :count="data?.count"
          :columns="columns"
          :rows="data?.IntervalSettings"
          editPath="/settings/fleet-management/interval-setting/edit-"
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
  </div>
</template>
