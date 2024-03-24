<script setup lang="ts">
import {useLayoutStore} from "@/store/layout";
import {routes} from "~/utils/apiRoutes";
import genericFunctionality from "~/composables/genericFunctionality";
import {ref} from "vue";
import commonCode from "~/composables/common";
import { useTranslatedColumns, useTranslatedBreadCrumbs, useTitle } from "~/composables/useTranslated";

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
        text: "Fuel Monitoring",
        active: true,
      },
    ],
    optionalItems = {
      searchBar: true,
      isBtnShow: true,
      btnText: "Add Fuel Receipt",
      path: "/fleet-management/fuel-monitoring/create",
    },
    columnConfig = [
      {
        label: "Licence Plate",
        field: "licenceNumber",
        sortable: true,
      },
      {
        label: "Vim",
        field: "vim",
        sortable: true,
      },
      {
        label: "Driver",
        field: "driverId",
        sortable: true,
      },
      {
        label: "Actual Mileage",
        field: "actualMileage",
        sortable: true,
      },
      {
        label: "Total Fuel",
        field: "totalFuel",
        sortable: true,
      },
      {
        label: "AVG Consume / 100KM",
        field: "consumeAverage",
        sortable: true,
      },
      {
        label: "AVG Euro / 100KM",
        field: "euroAverage",
        sortable: true,
      },
      {
        label: "Total EUR",
        field: "totalEuro",
        sortable: true,
      },
        {
            label: "",
            field: "action",
            sortable: true,
        }
    ],
    rows = ref([]);

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
const { items } = useTranslatedBreadCrumbs(breadCrumbsConfig),
    { columns } = useTranslatedColumns(columnConfig),
    { title } = useTitle("Fuel Monitoring");
useHead({
    title: title,
    });
apiRoute.value = routes.FUEL_MONITORING;
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
            :isCustomBody="true"
            @onSortChange="onSortChange"
    >
      <tr v-if="data?.length > 0" v-for="row in data" :key="row.id">
        <td v-if="row.id"> {{ row.id }}</td> <!-- to show serial no -->
        <td
                v-for="col in columns"
                :key="col.field"

        >
          <span v-if="col.field === 'action'">
            <NuxtLink title="'Show'">
                                    <ElementsIcon v-bind:icon="'visibleIcon'" />
                                </NuxtLink>
          </span>
          <span v-else>
              {{ row[col.field] }}
          </span>
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
    <Pagination
        :data="data"
        @change="refresh"
    />
  </div>
</template>
