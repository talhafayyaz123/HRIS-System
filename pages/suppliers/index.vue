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
const
  {
    apiRoute, currentPerPage, currentPage, data, orderColumn, orderDirection,
    listingFunc, onSortChange, handleSearch, destroy
  } = genericFunctionality(),
  { router, Toast, deleteAlert } = commonCode();
const breadCrumbsConfig = [
  {
    text: "Admin portal",
    to: "/",
  },
  {
    text: "Suppliers",
    active: true,
  },
];
const optionalItems = {
  searchBar: true,
  isBtnShow: true,
  btnText: "Create Supplier",
  path: "/suppliers/create",
  csvBtn: true,
  csvBtnText: "Export CSV",
  csvBtnPath: "/",
};

const columnConfig = [
  {
    label: "Supplier Name",
    field: "name",
    sortable: true,
  },
  {
    label: "Supplier Number",
    field: "number",
    sortable: true,
  },

  {
    label: "URL",
    field: "url",
    sortable: true,
  },
  {
    label: "VAT",
    field: "vatId",
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
{ title } = useTitle("Suppliers"),
rows = ref([]);
function refresh(
  page = 1,
  perPage = 10,
  column = "serialNo",
  order = "desc",
  search = ""
) {
  orderColumn.value = 'serialNo'
  listingFunc({ page: page, perPage: perPage, sortBy: column, sortOrder: order, search: search })

}
function callBackSorting(column: any, order: any) {
  if (column === 'id')
    onSortChange('serialNo', order)
  else
    onSortChange(column, order)
}

apiRoute.value = routes.SUPPLIER
refresh();
useHead({
  title: title,
});
</script>

<template>
  <div>
    <page-header :title="title" :items="items" :optionalItems="optionalItems" @watchEvent="handleSearch" />
    <Table class="doc-table" :key="data?.suppliers?.length" :columns="columns" :orderColumn="orderColumn"
      :orderDirection="orderDirection" @onSortChange="callBackSorting" :is-custom-body="true">
      <tr v-if="data?.suppliers?.length > 0" v-for="row in data?.suppliers" :key="row.id">
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
          <span v-else>
            {{ row[col.field] }}
          </span>
        </td>
        <td>
          <ul class="list-inline table-action m-0">
            <li class="list-inline-item ms-1">
              <NuxtLink :title="'Show'" to="suppliers/show-1">
                <ElementsIcon v-bind:icon="'visibleIcon'" />
              </NuxtLink>
            </li>
            <li class="list-inline-item ms-1">
              <NuxtLink :title="'Edit'" :to="'suppliers/edit-' + row.id">
                <ElementsIcon v-bind:icon="'editIcon'" />
              </NuxtLink>
            </li>
            <li class="list-inline-item ml-1 cursor-pointer">
              <NuxtLink :title="'Delete'"  @click="destroy(row.id)">
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
