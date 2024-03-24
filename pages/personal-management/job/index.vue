<script setup lang="ts">
import { useLayoutStore } from "@/store/layout";
import { routes } from "~/utils/apiRoutes";
import genericFunctionality from "~/composables/genericFunctionality";
import { ref } from "vue";

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
  } = genericFunctionality();

const breadCrumbsConfig = [
  {
    text: "Admin portal",
    to: "/",
  },
  {
    text: "Jobs",
    active: true,
  },
];
const optionalItems = {
  searchBar: true,
  isBtnShow: true,
  btnText: "Create Job",
  path: "/personal-management/job/create",
};

const columnConfig = [
  {
    label: "Job Number",
    field: "number",
    sortable: true,
  },
  {
    label: "Job Title",
    field: "title",
    sortable: true,
  },
  {
    label: "Contract Type",
    field: "FormOfContract.contractType.name",
    sortable: true,
  },
  {
    label: "Job Level",
    field: "JobLevel.jobLevel.levelName",
    sortable: true,
  },
  {
    label: "Actions",
    field: "action",
    sortable: false,
  },
];
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

apiRoute.value = routes.JOB;
refresh();

const { items } = useTranslatedBreadCrumbs(breadCrumbsConfig),
    { columns } = useTranslatedColumns(columnConfig),
    { title } = useTitle("Jobs");

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
      :key="data?.jobs?.length"
      :columns="columns"
      :rows="data?.jobs"
      editPath="/personal-management/job/edit-"
      :orderColumn="orderColumn"
      :orderDirection="orderDirection"
      @onSortChange="onSortChange"
      @destroy="destroy"
      isUUid=1
    />
  </div>
  <div class="mt-3">
    <Pagination
      @change="refresh"
      :data="data"
    />
  </div>
</template>
