<script setup lang="ts">
import { useLayoutStore } from "@/store/layout";
import { routes } from "~/utils/apiRoutes";
import genericFunctionality from "~/composables/genericFunctionality";
import { ref } from "vue";
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
  } = genericFunctionality();

const breadCrumbsConfig = [
  {
    text: "Admin portal",
    to: "/",
  },
  {
    text: "Skills",
    active: true,
  },
];
const optionalItems = {
  searchBar: true,
  isBtnShow: true,
  btnText: "Create Skill",
  path: "/skill-management/skill/create",
};

const columnConfig = [
  {
    label: "Name",
    field: "name",
    sortable: true,
  },
  {
    label: "Level out of 4",
    field: "level",
    sortable: true,
  },
  {
    label: "is required	",
    field: "isRequired",
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
const { items } = useTranslatedBreadCrumbs(breadCrumbsConfig),
    { columns } = useTranslatedColumns(columnConfig),
    { title } = useTitle("Skills");

useHead({
    title: title,
    });
apiRoute.value = routes.SKILL;
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
      :key="data?.skills?.length"
      :columns="columns"
      :rows="data?.skills"
      editPath="/skill-management/skill/edit-"
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
