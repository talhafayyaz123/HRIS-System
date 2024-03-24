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
    text: "Global Settings",
    to: "/",
  },
  {
    text: "Personal Management",
    to: "/",
  },
  {
    text: "Job Level",
    active: true,
  },
];
const optionalItems = {
  searchBar: true,
  isBtnShow: true,
  btnText: "Create Job Level",
  path: "/settings/personal-management/job-level/create",
};

const columnConfig = [
    {
      label: "Level Name",
      field: "levelName",
      sortable: true,
    },
    {
      label: "Experience Start",
      field: "experienceStart",
      sortable: true,
    },
    {
      label: "Experience End",
      field: "experienceEnd",
      sortable: true,
    },
    {
      label: "Target Salary",
      field: "targetSalary",
      sortable: true,
    },
    {
      label: "Limit Salary",
      field: "limitSalary",
      sortable: true,
    },
    {
      label: "Actions",
      field: "action",
      sortable: false,
    },
  ],
  { title } = useTitle("Job Level"),
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

apiRoute.value = routes.JOB_LEVEL;
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
      :key="data?.JobLevels?.length"
      :columns="columns"
      :rows="data?.JobLevels"
      editPath="/settings/personal-management/job-level/edit-"
      @onSortChange="onSortChange"
      :orderColumn="orderColumn"
      :orderDirection="orderDirection"
      @destroy="destroy"
    />
  </div>
  <div class="mt-3">
    <Pagination :data="data" @change="refresh" />
  </div>
</template>
