<script setup lang="ts">
import { routes } from "~/utils/apiRoutes";
import { ref } from "vue";
import commonCode from "~/composables/common";
import genericFunctionality from "~/composables/genericFunctionality";
import { useTranslatedColumns } from "~/composables/useTranslated";

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
  emit = defineEmits(["priceListAdded"]),
  props = defineProps([
    "showModal",
    "hideModal"
  ]),
  priceLists = ref([]),
  columnConfig = [
    {
      label: "Name",
      field: "name",
      sortable: true,
    },
    {
      label: "Status",
      field: "status",
      sortable: true,
    },
    {
      label: "Software",
      field: "productSoftwareName",
      sortable: false,
    },
    {
      label: "Is Default",
      field: "isDefault",
      sortable: true,
    },
  ],
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
apiRoute.value = routes.PRICE_LIST;
// after page load call this function
refresh();

function callBackSorting(column: any, order: any) {
  if (column === "id") onSortChange("id", order);
  else onSortChange(column, order);
}

const addPriceList = () => {
  emit("priceListAdded", {
      priceLists: priceLists.value
    });
    props.hideModal();
};

const checkboxValue = (index, event, row) => {
  const changedValue = event.target.checked;
  
  if (changedValue == true) {
    priceLists.value.push(row);
  } else priceLists.value.splice(index, 1);
};
</script>

<template>
  <div>
    <Modal
      :showModal="props.showModal"
      @hideModal="props.hideModal"
      :title="`Add Price List`"
      class="table-modal"
    >
      <div class="table-responsive">
        <Table
          class="doc-table"
          :key="data?.priceLists?.length"
          :columns="columns"
          @onSortChange="callBackSorting"
          :orderColumn="orderColumn"
          :orderDirection="orderDirection"
          :is-custom-body="true"
        >
          <tr
            v-if="data?.priceLists?.length > 0"
            v-for="(row, index) in data?.priceLists"
            :key="index"
          >
            <td>
              <input
                type="checkbox"
                @change="checkboxValue(index, $event, row)"
                name="license"
              />
              {{ row?.id }}
            </td>
            <td
              v-for="col in columns"
              :key="col.field"
              v-show="col.field !== 'action'"
            >
              <span>
                {{ row[col.field] }}
              </span>
            </td>
            <td></td>
          </tr>
          <tr v-else>
            <td
              :colspan="columns ? columns.length + 2 : 1"
              class="text-sm text-center"
            >
              {{ $t("No Records Added") }}
            </td>
          </tr>
        </Table>
      </div>
      <div class="mt-3">
        <Pagination :data="data" @change="refresh" />
      </div>
      <div class="d-flex align-items-center justify-content-end mt-3">
      <button
        type="button"
        class="primary-btn me-2"
        data-bs-dismiss="modal"
        @click="() => props.hideModal()"
      >
        Close
      </button>
      <submittal-button @click="addPriceList()" :buttonName="$t('Add Price List')" />
    </div>
    </Modal>
  </div>
</template>
