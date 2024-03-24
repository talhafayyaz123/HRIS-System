<script setup lang="ts">
import { useLayoutStore } from "@/store/layout";
import { routes } from "~/utils/apiRoutes";
import genericFunctionality from "~/composables/genericFunctionality";
import { ref } from "vue";
import commonCode from "~/composables/common";
import { useTranslatedColumns, useTranslatedBreadCrumbs, useTitle } from "~/composables/useTranslated";

const store = useLayoutStore();
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
    text: "Admin portal",
    to: "/",
  },
  {
    text: "Inbounded Contracts",
    active: true,
  },
];
const optionalItems = {
  searchBar: true,
  isBtnShow: true,
  btnText: "Create Inbounded Contracts",
  path: "/contract-management/inbounded-contracts/create",
};

const columnConfig = [
  {
    label: "Name",
    field: "name",
    sortable: true,
  },
  {
    label: "Document Template",
    field: "doc_template",
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
  { title } = useTitle("Inbounded Contracts");
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
useHead({
  title: title,
});
</script>

<template>
  <div>
    <page-header :title="title" :items="items" :optionalItems="optionalItems" @watchEvent="handleSearch" />
    <Table class="doc-table" :key="data?.leads?.length" :columns="columns" :rows="data?.leads"
      editPath="/contract-management/inbounded-contracts/edit-" :orderColumn="orderColumn"
      :orderDirection="orderDirection" :is-serial-no-custom-column="true" @onSortChange="callBackSorting"
      @destroy="destroy" />
  </div>
  <div class="mt-3">
    <Pagination :data="data" @change="refresh" />
  </div>
</template>
