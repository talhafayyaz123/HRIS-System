<script setup lang="ts">
import { useLayoutStore } from "@/store/layout";
import { routes } from "~/utils/apiRoutes";
import genericFunctionality from "~/composables/genericFunctionality";
import { ref } from "vue";
import commonCode from "~/composables/common";

const store = useLayoutStore();
const { t } = useI18n();
const {
    apiRoute,
    currentPerPage,
    currentPage,
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
    text: "Surveys",
    active: true,
  },
];
const optionalItems = {
  searchBar: true,
  isBtnShow: true,
  btnText: "Create Survey",
  path: "/surveys/create",
};

const columnConfig = ref([
  {
    label: "Name",
    field: "number",
    sortable: true,
  },
  {
    label: "Questions Amount",
    field: "questionCount",
    sortable: true,
  },
  {
    label: "Action",
    field: "action",
    sortable: false,
  },
]),
  { items } = useTranslatedBreadCrumbs(breadCrumbsConfig),
    { columns } = useTranslatedColumns(columnConfig),
    { title } = useTitle("Surveys");
const rows = ref([]);
function refresh(
  page = 1,
  perPage = 10,
  column = "id",
  order = "asc",
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

apiRoute.value = routes.SURVEYS;
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
      :key="data?.surveys?.length"
      :columns="columns"
      :rows="data?.surveys"
      editPath="/surveys/edit-"
      @onSortChange="onSortChange"
      @destroy="destroy"
    />
  </div>
  <div class="mt-3">
    <Pagination
      @change="refresh"
      :totalPages="data?.totalPages"
      :nextPage="data?.nextPageUrl"
      :firstPageUrl="data?.firstPageUrl"
      :lastPageUrl="data?.lastPageUrl"
      :previousPageUrl="data?.previousPageUrl"
      :currentPage="currentPage"
    />
  </div>
</template>
