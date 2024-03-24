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
    orderDirection,
    orderColumn,
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
    text: "Contact Reports",
    active: true,
  },
];
const optionalItems = {
  searchBar: true,
  isBtnShow: true,
  btnText: "Create Contact Report",
  path: "/contact-reports/create",
};

const columnConfig = [
  {
    label: "Report Number",
    field: "number",
    sortable: true,
  },
  {
    label: "Company",
    field: "Customer.customer.name",
    sortable: true,
  },
  {
    label: "Subject",
    field: "subject",
    sortable: true,
  },
  {
    label: "Priority",
    field: "priority",
    sortable: true,
  },
  {
    label: "Category",
    field: "ReportCategory.ReportCategory.name",
    sortable: true,
  },
  {
    label: "Initiated by",
    field: "initiatedBy",
    sortable: true,
  },
  {
    label: "Sources",
    field: "contactReportSources",
    sortable: false,
  },
  
  {
    label: "Actions",
    field: "action",
    sortable: false,
  },
],
  { items } = useTranslatedBreadCrumbs(breadCrumbsConfig),
  { columns } = useTranslatedColumns(columnConfig),
  { title } = useTitle("Contact Reports");
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
function callBackSorting(column: any, order: any) {
  if (column === 'id')
    onSortChange('id', order)
  else
    onSortChange(column, order)
}

apiRoute.value = routes.CONTACT_REPORT;
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
    <!-- <Table
      class="doc-table"
      :key="data?.contactReports?.length"
      :columns="columns"
      :rows="data?.contactReports"
      editPath="/contact-reports/edit-"
      @onSortChange="onSortChange"
      @destroy="destroy"
    /> -->
    <Table class="doc-table" :key="data?.contactReports?.length" :columns="columns" @onSortChange="callBackSorting"
      :orderColumn="orderColumn" :orderDirection="orderDirection" :is-custom-body="true">
      <tr v-if="data?.contactReports?.length > 0" v-for="row in data?.contactReports" :key="row.id">
        <td>
          {{ row?.id }}
        </td>
        <td v-for="col in columns" :key="col.field" v-show="col.field !== 'action'">

          <span v-if="col.field === 'contactReportSources'">
            <span v-for="(source,i) in row[col.field]" :key="i"><span  class="badge"> {{ source }}</span></span>
            <!-- {{ row[col.field] }} -->
          </span>
          <span v-else>
            {{ row[col.field] }}
          </span>
        </td>
        <td>
          <ul class="list-inline table-action m-0">
            <li class="list-inline-item ms-1">
              <NuxtLink :title="'Edit'" :to="'contact-reports/edit-' + row.id">
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

<style scoped>
.badge {
  background-color: green;
  color: white;
  padding: 4px 8px;
  text-align: center;
  border-radius: 5px;
}
</style>