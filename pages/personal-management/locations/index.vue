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
  } = genericFunctionality();

const breadCrumbsConfig = [
  {
    text: "Admin portal",
    to: "/",
  },
  {
    text: "Locations",
    active: true,
  },
];
const optionalItems = {
  searchBar: true,
  isBtnShow: true,
  btnText: "Create Location",
  path: "/personal-management/locations/create",
};

const columnConfig = [
  {
    label: "Name",
    field: "name",
    sortable: true,
  },
  {
    label: "Street",
    field: "street",
    sortable: true,
  },
  {
    label: "Zip Code",
    field: "zipCode",
    sortable: true,
  },
  {
    label: "City",
    field: "city",
    sortable: true,
  },
  {
    label: "State",
    field: "state",
    sortable: true,
  },
  {
    label: "Country",
    field: "Country.country.name",
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

apiRoute.value = routes.LOCATION;
refresh();
const { items } = useTranslatedBreadCrumbs(breadCrumbsConfig),
    { columns } = useTranslatedColumns(columnConfig),
    { title } = useTitle("Locations");

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
      :key="data?.locations?.length"
      :columns="columns"
      :rows="data?.locations"
      editPath="/personal-management/locations/edit-"
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
