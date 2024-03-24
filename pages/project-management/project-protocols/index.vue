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
    text: "Project Protocols",
    active: true,
  },
];
const optionalItems = {
  searchBar: true,
  isBtnShow: true,
  btnText: "Create Project Protocol",
  path: "/project-management/project-protocols/create",
};

const columnConfig = [
  {
    label: "Date",
    field: "date",
    sortable: true,
  },
  {
    label: "Customer",
    field: "Customer",
    sortable: true,
  },
  {
    label: "Protocol Type",
    field: "ProtocolType",
    sortable: true,
  },
  {
    label: "Project Status",
    field: "ProjectStatus",
    sortable: true,
  },
  {
    label: "Project",
    field: "project",
    sortable: true,
  },
  {
    label: "Action",
    field: "action",
    sortable: false,
  },
];
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
const { items } = useTranslatedBreadCrumbs(breadCrumbsConfig),
    { columns } = useTranslatedColumns(columnConfig),
    { title } = useTitle("Project Protocols");

useHead({
    title: title,
    });
apiRoute.value = routes.LEAD;
refresh();
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
      editPath="/project-management/project-protocols/edit-"
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
