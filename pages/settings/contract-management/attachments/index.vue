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
      text: "Contract Management",
      to: "/",
    },
    {
      text: "Attachments",
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
      label: "Software",
      field: "ProductSoftware.software.name",
      sortable: true,
    },
    {
      label: "Contract Type",
      field: "ContractType.contractType.name",
      sortable: true,
    },
    {
      label: "Template",
      field: "templateId",
      sortable: true,
    },
    {
      label: "Prefix",
      field: "prefix",
      sortable: true,
    },
    {
      label: "Version",
      field: "version",
      sortable: true,
    },
    {
      label: "Created At",
      field: "createdAt",
      sortable: true,
    },
    {
      label: "Actions",
      field: "action",
      sortable: false,
    },
  ],
  { title } = useTitle("Attachments"),
  { items } = useTranslatedBreadCrumbs(breadCrumbsConfig),
  { columns } = useTranslatedColumns(columnConfig),
  optionalItems = {
    searchBar: true,
    isBtnShow: true,
    btnText: "Create Attachment",
    path: "/settings/contract-management/attachments/create",
  };

const refresh = (
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
apiRoute.value = routes.CONTRACT_ATTACHMENT;
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
        :key="data?.attachments?.length"
        :columns="columns"
        :rows="data?.attachments"
        :orderColumn="orderColumn"
        :orderDirection="orderDirection"
        editPath="/settings/contract-management/attachments/edit-"
        @onSortChange="onSortChange"
        @destroy="destroy"
      />
    </div>
    <div class="mt-3">
      <Pagination :data="data" @change="refresh" />
    </div>
  </div>
</template>
