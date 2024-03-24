<script setup lang="ts">
import { useLayoutStore } from "@/store/layout";
import { routes } from "~/utils/apiRoutes";
// import { supplierRequest, supplierDeleteRequest } from "~/utils/apiRequests";
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
    text: "Customers",
    active: true,
  },
];
const optionalItems = {
  searchBar: true,
  isBtnShow: true,
  btnText: "Create Customer",
  path: "/customers/create",
  downloadCsvBtn: true,
  downloadCsvBtnText: t("Export CSV"),
  downloadCsvBtnIcon: '',
};

const columnConfig = [
  {
    label: "Customer Name",
    field: "name",
    sortable: true,
  },
  {
    label: "Customer Number",
    field: "number",
    sortable: true,
  },
  {
    label: "Vat",
    field: "vatId",
    sortable: true,
  },
  {
    label: "URL",
    field: "url",
    sortable: true,
  },
  {
    label: "Type",
    field: "productType",
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
  { title } = useTitle("Customers");
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
function callBackSorting(column: any, order: any) {
  if (column === 'id')
    onSortChange('serialNo', order)
  else
    onSortChange(column, order)
}

apiRoute.value = routes.COMPANY;
refresh();

useHead({
  title: title,
});
</script>

<template>
  <div>
    <page-header :title="title" :items="items" :optionalItems="optionalItems" @watchEvent="handleSearch" />
    <Table class="doc-table" :key="data?.customers?.length" :columns="columns" @onSortChange="callBackSorting"
      :orderColumn="orderColumn" :orderDirection="orderDirection" :is-custom-body="true">
      <tr v-if="data?.customers?.length > 0" v-for="row in data?.customers" :key="row.id">
        <td>
          {{ row?.serialNo }}
        </td>
        <td v-for="col in columns" :key="col.field" v-show="col.field !== 'action'">

          <span class="d-flex align-items-center" v-if="col.field === 'name'">
            <ElementsIcon v-bind:icon="'elloIcon'" class="me-2" />
            {{ row[col.field] }}
          </span>
          <span class="d-flex align-items-center" v-else-if="col.field === 'url'">
            <ElementsIcon v-bind:icon="'urlIcon'" class="me-2" />
            {{ row[col.field] }}
          </span>
          <span v-else-if="col.field === 'productType'">
            <span class="d-flex align-items-center" v-if="row.productType === 'premise'">
              <ElementsIcon v-bind:icon="'OnpermiseIcon'" class="me-2" />
              {{ row[col.field] }}
            </span>
            <span class="d-flex align-items-center" v-if="row.productType === 'private'">
              <ElementsIcon v-bind:icon="'privateIcon'" class="me-2" />
              {{ row[col.field] }}
            </span>
            <span class="d-flex align-items-center" v-if="row.productType === 'public'">
              <ElementsIcon v-bind:icon="'publicIcon'" class="me-2" />
              {{ row[col.field] }}
            </span>
            <span class="d-flex align-items-center" v-if="row.productType === 'hosting'">
              <ElementsIcon v-bind:icon="'hostingIcon'" class="me-2" />
              {{ row[col.field] }}
            </span>
            <span class="d-flex align-items-center" v-if="row.productType === 'other'">
              <ElementsIcon v-bind:icon="'othersIcon'" class="me-2" />
              {{ row[col.field] }}
            </span>
          </span>
          <span v-else>
            {{ row[col.field] }}
          </span>
        </td>
        <td>
          <ul class="list-inline table-action m-0">
            <li class="list-inline-item ms-1">
              <NuxtLink :title="'View'" to="customers/show-1">
                <ElementsIcon v-bind:icon="'visibleIcon'" />
              </NuxtLink>
            </li>
            <li class="list-inline-item ms-1">
              <NuxtLink :title="'Edit'" :to="'customers/edit-' + row.id">
                <ElementsIcon v-bind:icon="'editIcon'" />
              </NuxtLink>
            </li>
            <li class="list-inline-item ml-1 cursor-pointer">
              <NuxtLink :title="'Delete'" @click="destroy(row.id)">
                <ElementsIcon v-bind:icon="'deleteIcon'" />
              </NuxtLink>
            </li>
          </ul>
        </td>
        <td></td>
      </tr>
      <tr v-else>
        <td :colspan="columns ? (columns.length + 2) : 1" class="text-sm text-center">
          {{ $t("No Records Added") }}
        </td>
      </tr>
    </Table>
  </div>
  <div class="mt-3">
    <Pagination :data="data" @change="refresh" />
  </div>
</template>
