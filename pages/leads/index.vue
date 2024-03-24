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
    text: "Leads",
    active: true,
  },
];
const optionalItems = {
  searchBar: true,
  isBtnShow: true,
  btnText: "Create Lead",
  path: "/leads/create",
  downloadCsvBtn: true,
  downloadCsvBtnText: t("Export CSV"),
  downloadCsvBtnIcon: '',
};

const columnConfig = [
  {
    label: "Lead Number",
    field: "number",
    sortable: true,
  },
  {
    label: "Name",
    field: "name",
    sortable: true,
  },
  {
    label: "Type",
    field: "productType",
    sortable: true,
  },
  {
    label: "URL",
    field: "url",
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
  { title } = useTitle("Leads");
const rows = ref([]);
function refresh(
  page = 1,
  perPage = 10,
  column = "id",
  order = "desc",
  search = ""
) {
  
  orderColumn.value = 'serialNo'
  listingFunc({
    page: page,
    perPage: perPage,
    sortBy: column,
    sortOrder: order,
    search: search,
  });
}
function callBackSorting(column: any, order: any){
    if(column === 'id')
        onSortChange('serialNo', order)
    else
        onSortChange(column, order)
}
apiRoute.value = routes.LEAD;
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
      :key="data?.leads?.length"
      :columns="columns"
      :rows="data?.leads"
      editPath="/leads/edit-"
      :orderColumn="orderColumn"
      :orderDirection="orderDirection"
      :is-serial-no-custom-column="true"
      @onSortChange="callBackSorting"
      @destroy="destroy"
    />
  </div>
  <div class="mt-3">
        <Pagination :data="data" @change="refresh" />
    </div>
</template>
