<script setup lang="ts">
import { useLayoutStore } from "@/store/layout";
import { routes } from "~/utils/apiRoutes";
import genericFunctionality from "~/composables/genericFunctionality";
import { ref } from "vue";
import commonCode from "~/composables/common";

import {
  useTranslatedColumns,
  useTranslatedBreadCrumbs,
  useTitle,
} from "~/composables/useTranslated";

const { t } = useI18n();
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
  { router, Toast, deleteAlert } = commonCode();
const breadCrumbsConfig = [
  {
    text: "Global Settings",
    to: "/",
  },
  {
    text: "Personal Management",
    to: "/",
  },
  {
    text: "Form Of Contract",
    active: true,
  },
];
const optionalItems = {
  searchBar: true,
  isBtnShow: true,
  btnText: "Create Form Of Contract",
  path: "/settings/personal-management/form-of-contract/create",
};

const columnConfig = [
    {
      label: "Name",
      field: "name",
      sortable: true,
    },
    {
      label: "Actions",
      field: "action",
      sortable: false,
    },
  ],
  { title } = useTitle("Form Of ContractForm Of Contract"),
  { items } = useTranslatedBreadCrumbs(breadCrumbsConfig),
  { columns } = useTranslatedColumns(columnConfig);

const rows = ref([]);
function refresh(
  page = 1,
  perPage = 10,
  column = "id",
  order = "desc",
  search = ""
) {
  listingFunc({
    page: page,
    perPage: perPage,
    sortBy: column,
    sortOrder: order,
    search: search,
  });
}

apiRoute.value = routes.FORM_OF_CONTRACT;
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
      :key="data?.formOfContracts?.length"
      :columns="columns"
      :rows="data?.formOfContracts"
      editPath="/settings/personal-management/form-of-contract/edit-"
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
