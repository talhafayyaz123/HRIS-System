<script setup lang="ts">
import { routes } from "~/utils/apiRoutes";
import { ref } from "vue";
import commonCode from "~/composables/common";
import genericFunctionality from "~/composables/genericFunctionality";

import {
  useTranslatedColumns,
  useTranslatedBreadCrumbs,
  useTitle,
} from "~/composables/useTranslated";

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
  { router, Toast, deleteAlert } = commonCode(),
  { t } = useI18n(),
  breadCrumbsConfig = [
    {
      text: "Global Settings",
      to: "/",
    },
    {
      text: "Global Settings",
      to: "/",
    },
    {
      text: "Terms Of Payment",
      active: true,
    },
  ],
  optionalItems = {
    searchBar: true,
    isBtnShow: true,
    btnText: "Create Terms of Payment",
    path: "/settings/global-settings/terms-of-payment/create",
  },
  columnConfig = [
    {
      label: "Payment Terms",
      field: "paymentTermNo",
      sortable: true,
    },
    {
      label: "Name",
      field: "name",
      sortable: true,
    },
    {
      label: "Percentage (%)",
      field: "percentage",
      sortable: false,
    },
    {
      label: "No of Days",
      field: "noOfDays",
      sortable: false,
    },
    {
      label: "Text On Offers",
      field: "textOnOffer",
      sortable: true,
    },
    {
      label: "Text On Order Confirmation",
      field: "textOnOrderConfirmation",
      sortable: true,
    },
    {
      label: "Text On Invoice",
      field: "textOnInvoice",
      sortable: true,
    },
    {
      label: "Actions",
      field: "action",
      sortable: false,
    },
  ],
  { title } = useTitle("Terms of payment"),
  { items } = useTranslatedBreadCrumbs(breadCrumbsConfig),
  { columns } = useTranslatedColumns(columnConfig),
  refresh = (
    page = currentPage.value,
    perPage = currentPerPage.value,
    column = "id",
    order = "desc",
    search = ""
  ) => {
    listingFunc({
      page: page,
      perPage: perPage,
      sortBy: column,
      sortOrder: order,
      search: search,
    });
  };
// define api url of this crud that's we define in apiRoutes file.
apiRoute.value = routes.TERMS_OF_PAYMENT;
// after page load call this function
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
      :key="data?.termOfPayments?.length"
      :columns="columns"
      :rows="
        data?.termOfPayments?.map((r) => {
          return {
            ...r,
            percentage: JSON.parse(r?.percentages)[0]?.percentage,
            noOfDays: JSON.parse(r?.percentages)[0]?.noOfDays,
          };
        })
      "
      editPath="terms-of-payment/edit-"
      :orderColumn="orderColumn"
      :orderDirection="orderDirection"
      @onSortChange="onSortChange"
      @destroy="destroy"
    />

    <div class="mt-3">
      <Pagination :data="data" @change="refresh" />
    </div>
  </div>
</template>
