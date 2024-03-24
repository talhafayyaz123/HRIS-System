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
    text: "Teams",
    active: true,
  },
];
const optionalItems = {
  searchBar: true,
  isBtnShow: true,
  btnText: "Create Team",
  path: "/personal-management/teams/create",
};

const columnConfig = [
  {
    label: "Name",
    field: "name",
    sortable: true,
  },
  {
    label: "Lead Name",
    field: "Employee.teamLead.firstName",
    sortable: true,
  },
  {
    label: "Department",
    field: "Department.department.name",
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

apiRoute.value = routes.TEAM;
refresh();

const { items } = useTranslatedBreadCrumbs(breadCrumbsConfig),
    { columns } = useTranslatedColumns(columnConfig),
    { title } = useTitle("Teams");

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
      :key="data?.teams?.length"
      :columns="columns"
      :rows="data?.teams"
      editPath="/personal-management/teams/edit-"
      :orderColumn="orderColumn"
      :orderDirection="orderDirection"
      @onSortChange="onSortChange"
      @destroy="destroy"
    />
  </div>
  <div class="mt-3">
    <Pagination
      @change="refresh"
      :data="data"
    />
  </div>
</template>
