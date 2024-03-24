<script setup lang="ts">
import {
  downloadOfferCsvRequest,
  downloadOfferLatestCsvRequest,
} from "@/utils/apiRequests";

import GenerateEmailModal from "./components/GenerateEmailModal.vue";

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
  isModalOpen = ref(false),
  store = useLayoutStore(),
  { t } = useI18n(),
  breadCrumbsConfig = [
    {
      text: "Admin Portal",
      to: "/",
    },
    {
      text: "Offers",
      to: "/offers",
      active: true,
    },
  ],
  optionalItems = {
    searchBar: true,
    isBtnShow: true,
    btnText: t("Create Offers"),
    path: "/offers/create",
  },
  columnConfig = [
    {
      label: "Offer Number",
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
      label: "Status",
      field: "offerStatus",
      sortable: true,
    },
    {
      label: "Identifier",
      field: "identifier",
      sortable: true,
    },
    {
      label: "Receiver Type",
      field: "receiverType",
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
    { title } = useTitle("Offers"),
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
apiRoute.value = routes.SALE_OFFER;
// after page load call this function
refresh();


// download csv template file
async function downloadCsvHandler(latest : boolean) {
  try {
    const res = latest ? await downloadOfferLatestCsvRequest() : await downloadOfferCsvRequest();
    const url = window.URL.createObjectURL(new Blob([res as any]));
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "offers.csv");
    document.body.appendChild(link);
    link.click();
  } catch (e) {
    console.log(e);
  }
};

async function generateEmail(id: any) {
  if (!!id) {
    isModalOpen.value = true;
  }
}

function hideModal() {
  isModalOpen.value = false;
}

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
    <div class="table-responsive  country-table">
        <div class="countries-csv">
          <div class="dropdown">
            <a
              href="#"
              data-bs-toggle="dropdown"
              aria-expanded="false"
              class="dropdownicon"
            >
              <i class="fe-settings"></i>
            </a>
            <ul class="dropdown-menu">
              <li>
                <nuxt-link class="dropdown-item" @click="downloadCsvHandler(false)"
                  ><i class="fas fa-file-import me-2"></i> {{ $t('Export CSV') }} </nuxt-link
                >
                <nuxt-link class="dropdown-item" @click="downloadCsvHandler(true)"
                  ><i class="fas fa-file-import me-2"></i> {{ $t('Export Latest CSV') }} </nuxt-link
                >
              </li>
            </ul>
          </div>
        </div>
    <Table
      class="doc-table"
      :key="data?.confirmationAndOffers?.length"
      :columns="columns"
      :rows="data?.confirmationAndOffers"
      showPath="/offers/show-"
      editPath="/offers/edit-"
      :generateEmail="true"
      :generateDocs="true"
      :orderColumn="orderColumn"
      :orderDirection="orderDirection"
      @onSortChange="onSortChange"
      @destroy="destroy"
      @generateEmail="generateEmail"
    />
     </div>
    <div class="mt-3">
      <Pagination :data="data" @change="refresh" />
    </div>

    <generate-email-modal
        :showModal="isModalOpen"
        :hideModal="hideModal"
      />
  </div>
</template>
