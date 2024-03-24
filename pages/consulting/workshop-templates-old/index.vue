<script setup lang="ts">
import { useLayoutStore } from "@/store/layout";
import { routes } from "~/utils/apiRoutes";
import genericFunctionality from "~/composables/genericFunctionality";
import { ref } from "vue";
import commonCode from "~/composables/common";
useHead({
  title: `Workshop Templates`,
});
const store = useLayoutStore();
const title = ref("Workshop Templates");
const { t } = useI18n();
const {
    apiRoute,
    currentPerPage,
    currentPage,
    orderDirection,
    orderColumn,
    data,
    listingFunc,
    onSortChange,
    handleSearch,
    destroy,
  } = genericFunctionality(),
  { router, Toast, deleteAlert } = commonCode();
const items = [
  {
    text: "Admin portal",
    to: "/",
  },
  {
    text: "Workshop Templates",
    active: true,
  },
];
const optionalItems = {
  searchBar: true,
  isBtnShow: true,
  btnText: "Create Workshop Template",
  path: "/consulting/workshop-templates/create",
};

const columns = ref([
  {
    label: "Template Name",
    field: "name",
    sortable: true,
  },
  {
    label: "Template Version",
    field: "version",
    sortable: true,
  },
  {
    label: "Status",
    field: "status",
    sortable: true,
  },
  {
    label: "Action",
    field: "action",
    sortable: false,
  },
]);
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

apiRoute.value = routes.WORKSHOP_TEMPLATE;
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
      :key="data?.workshopTemplates?.length"
      :columns="columns"
      :rows="data?.workshopTemplates"
      editPath="/consulting/workshop-templates/edit-"
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
