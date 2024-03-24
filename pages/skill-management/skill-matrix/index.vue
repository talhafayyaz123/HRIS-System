<script setup lang="ts">
import { useLayoutStore } from "@/store/layout";
import { routes } from "~/utils/apiRoutes";
import genericFunctionality from "~/composables/genericFunctionality";
import { ref } from "vue";
import { useTranslatedColumns, useTranslatedBreadCrumbs, useTitle } from "~/composables/useTranslated";

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
    store = useLayoutStore(),
    { t } = useI18n(),
   breadCrumbsConfig = [
      {
        text: "Admin portal",
        to: "/",
      },
      {
        text: "Skills Matrix",
        active: true,
      },
  ],
   optionalItems = {
      searchBar: true,
      isBtnShow: true,
      btnText: "Create Skills Matrix",
      path: "/skill-management/skill-matrix/create",
  },

  columnConfig = [
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
  rows = ref([]),
   { items } = useTranslatedBreadCrumbs(breadCrumbsConfig),
   { columns } = useTranslatedColumns(columnConfig),
   { title } = useTitle("Skills Matrix");

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
apiRoute.value = routes.SM_MATRIX;
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
      :key="data?.SkillMatrices?.length"
      :columns="columns"
      :rows="data?.SkillMatrices"
      editPath="/skill-management/skill-matrix/edit-"
      showPath="/skill-management/skill-matrix/show-"
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
