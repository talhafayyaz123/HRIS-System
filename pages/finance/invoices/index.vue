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
    text: "Invoices",
    active: true,
  },
];
const optionalItems = {
  searchBar: true,
  isBtnShow: true,
  btnText: "Create Invoice",
  path: "/finance/invoices/create",
};

const columnConfig = [
  {
    label: "Invoice Number",
    field: "number",
    sortable: true,
  },
  {
    label: "Company",
    field: "Customer.customer.name",
    sortable: true,
  },
  {
    label: "Invoice type",
    field: "invoiceType",
    sortable: true,
  },
  {
    label: "Invoice Period",
    field: "PaymentPeriod.paymentPeriod.billingCycle",
    sortable: true,
  },
  {
    label: "Due Date",
    field: "dueDate",
    sortable: true,
  },
  {
    label: "Status",
    field: "status",
    sortable: true,
  },
  {
    label: "Netto",
    field: "amountWithoutTax",
    sortable: true,
  },
  {
    label: "Created At",
    field: "createdAt",
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
  { title } = useTitle("Invoices");
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

apiRoute.value = routes.INVOICE;
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
      :key="data?.invoices?.length"
      :columns="columns"
      :rows="data?.invoices"
      editPath="/finance/invoices/edit-"
      showPath="/finance/invoices/show-"
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
