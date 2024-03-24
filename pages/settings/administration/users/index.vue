<script setup lang="ts">
import { computed, ref, watch } from "vue";
import commonCode from "~/composables/common";
import { routes } from "~/utils/apiRoutes";
import genericFunctionality from "~/composables/genericFunctionality";
import { useAdministrationStore } from "~/store/administration";
import { specificGetRequest } from "~/utils/apiRequests";
import Paginate from "vuejs-paginate-next";
import {useLayoutStore} from "~/store/layout";

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
  isLoading = ref(false),
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
      text: "Users",
      active: true,
    },
  ],
  optionalItems = {
    searchBar: false,
    isBtnShow: true,
    btnText: "Create User",
    path: "/settings/administration/users/create",
  },
  breadCrupmBtn =  ref(true),
  columnConfig = [
    {
      label: "Name",
      field: "first_name",
      sortable: false,
    },
    {
      label: "Email",
      field: "email",
      sortable: false,
    },
    {
      label: "City",
      field: "city",
      sortable: false,
    },
    {
      label: "Street",
      field: "street",
      sortable: false,
    },
    {
      label: "Zip",
      field: "zip",
      sortable: false,
    },
    {
      label: "Phone",
      field: "phone",
      sortable: false,
    },
    // {
    //   label: "Roles",
    //   field: "roles",
    //   sortable: false,
    // },
    {
      label: "Actions",
      field: "action",
      sortable: false,
    },
  ],
  
  { title } = useTitle("Users"),
  { items } = useTranslatedBreadCrumbs(breadCrumbsConfig),
  { columns } = useTranslatedColumns(columnConfig),

  callBackFunc = (param: number) => {
    currentPage.value = param
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

  // To get all users and then save it in store
//   getAllUsers = () => {
//     const layout = useLayoutStore();
//     layout.changeLoaderValue(true);
//     specificGetRequest(routes.LIST_USERS, {
//       limit_start: 1,
//       limit_count: 500,
//       type: type.value,
//     }).then((response) => {
//       layout.changeLoaderValue(false);
//       allData.value = response.data;
//     }).catch((error) => {
//       layout.changeLoaderValue(false);
//     });
//   };

//   watch(
//   () => allData.value,
//   (allUserData) => {
//     administration.addUsersData(allUserData);
//   }
// );
// define api url of this crud that's we define in apiRoutes file.
apiRoute.value = routes.LIST_USERS;
// after page load call this function
refresh();

useHead({
  title: title,
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
      :breadCrupmBtn="breadCrupmBtn"
      @watchEvent="handleSearch"
    />
    <div class="table-responsive">
      <Table
        class="doc-table"
        :key="data?.data?.length"
        :columns="columns"
        :rows="data?.data"
        :not-serial-able="true"
        :remove-serial-able="true"
        editPath="/settings/administration/users/edit-"
        @onSortChange="onSortChange"
        @destroy="destroy"
      />
    </div>
  </div>
  <div
    v-if="data?.count > 0"
    class="mt-3 d-flex align-items-center justify-content-center"
  >
    <div class="page-count mx-3">
      <p><span>Page {{currentPage}} </span> out of {{ pageCount }}</p>
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
