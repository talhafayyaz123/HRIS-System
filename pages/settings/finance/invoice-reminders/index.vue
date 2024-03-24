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
      text: "Finance",
      to: "/",
    },
    {
      text: "Invoice Reminder",
      active: true,
    },
  ],
  columnConfig = [
    {
      label: "Level Name",
      field: "name",
      sortable: true,
    },
    {
      label: "Period Days",
      field: "periodDay",
      sortable: true,
    },
    {
      label: "Reminder Fee",
      field: "reminderFee",
      sortable: true,
    },
    {
      label: "Actions",
      field: "action",
      sortable: false,
    },
  ],

    { title } = useTitle("Invoice Reminder"),
  { items } = useTranslatedBreadCrumbs(breadCrumbsConfig),
  { columns } = useTranslatedColumns(columnConfig),

  optionalItems = {
    searchBar: true,
    isBtnShow: true,
    btnText: "Create Invoice Reminder",
    path: "/settings/finance/invoice-reminders/create",
  },
    refresh = (page = currentPage.value, perPage = currentPerPage.value, column = 'id', order = 'desc', search = '') => {

        listingFunc({page: page, perPage: perPage, sortBy: column, sortOrder: order, search: search})
    }
// define api url of this crud that's we define in apiRoutes file.
apiRoute.value =  routes.REMINDER_LEVEL
// after page load call this function
refresh();

useHead({
  title: title,
});
</script>

<template>
  <div>
    <page-header :title="title" :items="items" :optionalItems="optionalItems" @watchEvent="handleSearch" />
    <div class="table-responsive">
      <Table
              class="doc-table"
              :key="data?.reminderLevels?.length"
              :columns="columns"
              :rows="data?.reminderLevels"
              :orderColumn="orderColumn"
              :orderDirection="orderDirection"
              editPath="/settings/finance/invoice-reminders/edit-"
              @onSortChange="onSortChange" @destroy="destroy" />
    </div>
    <div class="mt-3">
      <Pagination :data="data" @change="refresh" />
    </div>
  </div>
</template>
