<script setup lang="ts">
import { routes } from "~/utils/apiRoutes";
import { ref, computed, watch } from "vue";
import genericFunctionality from "~/composables/genericFunctionality";

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
  { t } = useI18n();
const props = defineProps({
    customerId: {
      type: String,
      default: "",
    },
    date: {
      type: Array,
      default: new Date().getFullYear(),
    },
    type: {
      type: String,
      default: "yearly",
    },
    isUpdate: {
      type: Boolean,
      default: false,
    },
  }),
  columns = ref([
    {
      label: t("Offer Number"),
      field: "offerNumber",
      sortable: true,
    },
    {
      label: t("Customer/Lead"),
      field: "Customer.customer.name",
      sortable: true,
    },
    {
      label: t("Status"),
      field: "offerStatus",
      sortable: true,
    },
    {
      label: t("Netto Total"),
      field: "totalNetto",
      sortable: true,
    },
  ]),
  refresh = (
    page = currentPage.value,
    perPage = currentPerPage.value,
    column = "id",
    order = "asc",
    customerId = props.customerId,
    type = props.type,
    date = props.date,
    offerType = "offer"
  ) => {
    listingFunc({
      page: page,
      perPage: perPage,
      sortBy: column,
      sortOrder: order,
      customerId: customerId,
      type: type,
      date: date,
      offerType: offerType,
    });
  };
const rowData = computed(() => {
  return data.value?.confirmationAndOffers;
});
watch(
  () => props.isUpdate,
  (val) => {
    if(val==true){
      refresh();
    }
  }
);

// define api url of this crud that's we define in apiRoutes file.
apiRoute.value = routes.SALES_DASHBOARD_TABLE;
// after page load call this function
refresh();
</script>

<template>
  <div>
    <Table
      class="doc-table"
      :key="rowData"
      :columns="columns"
      :isCustomBody="true"
      :orderColumn="orderColumn"
      :orderDirection="orderDirection"
      @onSortChange="onSortChange"
    >
      <tr v-if="rowData?.length > 0" v-for="row in rowData" :key="row.id">
        <td
          v-for="col in columns"
          :key="col.field"
          v-show="col.field !== 'action'"
        >
          <span v-if="col.field === 'totalNetto'">
            <NuxtLink :title="'Edit'" :to="'/offers/edit-' + row.id">
              € {{ row[col.field].toFixed(2) }}
            </NuxtLink>
          </span>
          <span v-else>
            <NuxtLink :title="'Edit'" :to="'/offers/edit-' + row.id">
              {{ row[col.field] }}
            </NuxtLink>
          </span>
        </td>
      </tr>
      <tr v-else>
        <td :colspan="columns?.length" class="text-sm text-center">
          {{ $t("No Records Added") }}
        </td>
      </tr>
    </Table>
  </div>
  <div class="mt-3">
    <Pagination :data="data" @change="refresh" />
  </div>
</template>
