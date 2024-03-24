<script setup lang="ts">
import { useLayoutStore } from "~/store/layout";
import { routes } from "~/utils/apiRoutes";
import { ref } from "vue";
import commonCode from "~/composables/common";
import genericFunctionality from "~/composables/genericFunctionality";
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
  { router, Toast, deleteAlert } = commonCode(),
  store = useLayoutStore(),
  { t } = useI18n(),
  breadCrumbsConfig = [
    {
      text: "Admin Portal",
      to: "/",
    },
    {
      text: "Order  Confirmation",
      to: "/order-confirmation",
      active: true,
    },
  ],
  optionalItems = {
    searchBar: true,
    isBtnShow: true,
    btnText: t("Create Order Confirmation"),
    path: "/order-confirmation/create",
  },
  columnConfig = [
    {
      label: "Order Confirmation Number",
      field: "offerNumber",
      sortable: true,
    },
    {
      label: "Type",
      field: "offerType",
      sortable: true,
    },
    {
      label: "Customer/Lead",
      field: "Customer.customer.name",
      sortable: true,
    },
    {
      label: "Terms of Payment",
      field: "termOfPaymentName",
      sortable: false,
    },
    {
      label: "Receiver Type",
      field: "receiverType",
      sortable: true,
    },
    {
      label: "Status",
      field: "offerConfirmationStatus",
      sortable: true,
    },
    {
      label: "Project",
      field: "Project.project.name",
      sortable: true,
    },
    {
      label: "Netto Total",
      field: "totalNetto",
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
    { title } = useTitle("Order Confirmation"),
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
apiRoute.value = routes.SALE_OFFER_CONFIRMATION;
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
      :key="data?.confirmationAndOffers?.length"
      :columns="columns"
      :rows="data?.confirmationAndOffers"
      showPath="/order-confirmation/show-"
      editPath="/order-confirmation/edit-"
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
