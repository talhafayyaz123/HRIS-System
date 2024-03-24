<script setup lang="ts">
import commonCode from "~/composables/common";
import CreateEditAssetsForm from "./components/CreateEditAssetsForm.vue";
import {
  useTranslatedColumns,
  useTranslatedBreadCrumbs,
  useTitle,
} from "~/composables/useTranslated";
import { routes } from "~/utils/apiRoutes";
import genericFunctionality from "~/composables/genericFunctionality";
import EditVacations from "~/pages/vacation-request/components/edit-vacations-request.vue";
import ShowVacations from "~/pages/vacation-request/components/view-vacations-request.vue";
import AddAssetsArticle from "./components/AddAssetsArticle.vue";
import { ref } from "vue";

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
  { router, Toast } = commonCode();
const { t } = useI18n(),
  breadCrumbsConfig = [
    {
      text: "Admin portal",
      to: "/",
    },
    {
      text: "Asset",
      to: "/asset-management/assets",
    },
    {
      text: "Edit",
      active: true,
    },
  ],
  columnConfig = [
    {
      label: "Name",
      field: "assetName",
      sortable: true,
    },
    {
      label: "Asset Number",
      field: "assetNumber",
      sortable: true,
    },
    {
      label: "Asset Type",
      field: "assetType",
      sortable: true,
    },
    {
      label: "Price Netto",
      field: "priceNetto",
      sortable: true,
    },
    {
      label: "Actions",
      field: "action",
      sortable: false,
    },
  ],
  articleId = ref(''),
  modelTitle = ref(""),
  isEditCase = ref(false),
  isModalOpen = ref(false),
  { items } = useTranslatedBreadCrumbs(breadCrumbsConfig),
  { columns } = useTranslatedColumns(columnConfig),
  { title } = useTitle("Asset Edit"),
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
apiRoute.value = routes.ASSETS;
// after page load call this function
refresh();

const id = router.params.id;
function openModal(module = '', id = '') {

  if (module === 'edit') {
      modelTitle.value = 'Edit Asset Article'
      articleId.value = id
      isEditCase.value = true
  }
  else {
      modelTitle.value = 'Add Asset Article'
    isEditCase.value = false
  }
  isModalOpen.value = true;
}
function hideModal() {
  isModalOpen.value = false
}
useHead({
  title: title,
});
</script>

<template>
  <div>
    <page-header :title="title" :items="items" />
    <create-edit-assets-form :id="id" />

    <div class="mt-4">
      <div class="d-flex align-items-center justify-content-end mb-3">
        <button class="secondary-btn" @click="openModal()">
          <ElementsIcon v-bind:icon="'addIcon'" class="me-2" />
          {{ ('Create Asset Article') }}
        </button>
      </div>
      <div class="table-responsive">
        <Table class="doc-table" :key="data?.assets?.length" :columns="columns" :rows="data?.assets"
          :orderColumn="orderColumn" :orderDirection="orderDirection" editPath="/asset-management/assets/edit-"
          @onSortChange="onSortChange" @destroy="destroy" />
      </div>
      <div class="mt-3">
        <Pagination :data="data" @change="refresh" />
      </div>
    </div>
     <Modal :showModal="isModalOpen" @hideModal="hideModal" :title="modelTitle" class="table-modal">
         <AddAssetsArticle/>
     </Modal>

  </div>
</template>
