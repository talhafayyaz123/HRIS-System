<script setup lang="ts">
import {useLayoutStore} from "@/store/layout";
import {routes} from "~/utils/apiRoutes";
import genericFunctionality from "~/composables/genericFunctionality";
import {ref} from "vue";
import commonCode from "~/composables/common";


const
    store = useLayoutStore(),
    {t} = useI18n(),
    {
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
    {router, Toast, deleteAlert} = commonCode(),
    breadCrumbsConfig = [
      {
        text: "Admin portal",
        to: "/",
      },
      {
        text: "Driver Licence Check",
        active: true,
      },
    ],
    optionalItems = {
      searchBar: true,
      isBtnShow: true,
      btnText: "Create Fleet Drivers",
      path: "/fleet-management/driver-licence-check/fleet-driver/create",
      isBtn2Show: true,
      btn2Text: 'Driver Licence Check',
      btn2Path: '/fleet-management/driver-licence-check/create'
    },
    columnConfig = [
      {
        label: "Driver",
        field: "name",
        sortable: true,
      },
      {
        label: "Status",
        field: "status",
        sortable: true,
      },
      {
        label: "Licence Plate",
        // field: "licencePlate",
        sortable: true,
      },
      {
        label: "Last Checkup",
        field: "lastCheckup",
        sortable: true,
      },
        {
            label: "Next Checkup",
            field: "nextCheckup",
            sortable: true,
        },
      {
        label: "Licence Valid Until",
        field: "licenceValidUntil",
        sortable: true,
      },
      {
        label: "Vehicle Classes",
        field: "vehicleClasses",
        sortable: true,
      }
    ],
    { items } = useTranslatedBreadCrumbs(breadCrumbsConfig),
    { columns } = useTranslatedColumns(columnConfig),
    { title } = useTitle("Driver Licence Check"),
    rows = ref([]);
    useHead({
  title: title,
});
function refresh(
    page = 1,
    perPage = 10,
    column = "id",
    order = "asc",
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
useHead({
  title: title
});
apiRoute.value = routes.FLEET_DRIVER;
refresh();
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
        :key="data?.length"
        :columns="columns"
        :rows="data"
        showPath="/fleet-management/driver-licence-check/show-"
        editPath="/fleet-management/driver-licence-check/fleet-driver/edit-"
        :orderColumn="orderColumn"
        :orderDirection="orderDirection"
        @onSortChange="onSortChange"
        @destroy="destroy"
    />
  </div>
  <div class="mt-3">
    <Pagination
        :data="data"
        @change="refresh"
    />
  </div>
</template>
