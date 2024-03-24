<script setup lang="ts">
import { computed, ref, watch } from "vue";
import commonCode from "~/composables/common";
import genericFunctionality from "~/composables/genericFunctionality";
import { routes } from "~/utils/apiRoutes";
import { useAdministrationStore } from "~/store/administration";
import { specificGetRequest } from "~/utils/apiRequests";
import Paginate from "vuejs-paginate-next";

import {
  useTranslatedColumns,
  useTranslatedBreadCrumbs,
  useTitle,
} from "~/composables/useTranslated";

const administration = useAdministrationStore();

const {
    apiRoute,
    currentPerPage,
    currentPage,
    data,
    startPerPage,
    specificListingRequest,
    onSortChange,
    handleSearch,
    destroy,
  } = genericFunctionality(),
  { router, Toast, deleteAlert } = commonCode(),
  perPage = ref(10),
  limitStart = ref(1),
  type = ref(0),
  { t } = useI18n(),
  breadCrumbsConfig = [
    {
      text: "Global Settings",
      to: "/",
    },
    {
      text: "Administration",
      to: "/",
    },
    {
      text: "Permissions",
      active: true,
    },
  ],
  columnConfig = [
    {
      label: "Name",
      field: "title",
      sortable: false,
    },
    {
      label: "Grouping",
      field: "grouping",
      sortable: false,
    },
    {
      label: "Actions",
      field: "action",
      sortable: false,
    },
  ],
  optionalItems = {
    searchBar: false,
    isBtnShow: true,
    btnText: "Create Permissions",
    path: "/settings/administration/permissions/create",
  },
  { title } = useTitle("Permissions"),
  { items } = useTranslatedBreadCrumbs(breadCrumbsConfig),
  { columns } = useTranslatedColumns(columnConfig),

  callBackFunc = (param) => {
    limitStart.value = param * perPage.value;
    specificListingRequest({
      limit_start: limitStart.value,
      limit_count: perPage.value,
      type: type.value,
    });
  },
  refresh = () => {
    specificListingRequest({
      limit_start: limitStart.value,
      limit_count: perPage.value,
      type: type.value,
    });
  };

// define api url of this crud that's we define in apiRoutes file.
apiRoute.value = routes.LIST_PERMISSIONS;
// after page load call this function
refresh();
useHead({
  title: `Permissions`,
});

const pageCount = computed(() => {
  const totalRecord = data.value?.count;
  return Math.floor(totalRecord / perPage.value);
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
      :key="data?.data?.length"
      :columns="columns"
      :rows="data?.data"
      :not-serial-able="true"
      :remove-serial-able="true"
      editPath="/settings/administration/permissions/edit-"
      @destroy="destroy"
    />
  </div>
  <div
    v-if="data?.count > 0"
    class="mt-3 d-flex align-items-center justify-content-center"
  >
    <div class="page-count mx-3">
      <p><span>Page 1 </span>out of {{ data?.count }}</p>
    </div>
    <paginate
      :page-count="pageCount"
      :container-class="'pagination'"
      :prev-text="'<'"
      :next-text="'>'"
      :click-handler="callBackFunc"
    >
    </paginate>
  </div>
</template>
