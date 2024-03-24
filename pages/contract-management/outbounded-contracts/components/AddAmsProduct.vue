<script setup lang="ts">
import { ref, reactive, onMounted, watch, computed } from "vue";
import commonCode from "~/composables/common";
import genericFunctionality from "~/composables/genericFunctionality";
import { genericListingRequest } from "@/utils/apiRequests";
import { routes } from "~/utils/apiRoutes";
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
    isLoading,
    priceListId,
    type,
    status,
    categoryId,
    softwareId,
  } = genericFunctionality(),
  { router, Toast, deleteAlert } = commonCode(),
  { t } = useI18n();

const props = defineProps([
  "categoryId",
  "showModal",
  "hideModal",
  "attachmentIndex"
]);
const emits = defineEmits(["productAdded"]);
// const emits = defineEmits([
//   "addProduct",
//   "additiontalDescToggle",
//   "calculateProductValue",
// ]);
const addedProducts = ref([]);
const columnConfig = [
    {
      label: "Article Number",
      field: "articleNumber",
      sortable: false,
    },
    {
      label: "name",
      field: "name",
      sortable: false,
    },
    {
      label: "Status",
      field: "status",
      sortable: false,
    },
    {
      label: "Sale Price",
      field: "salePrice",
      sortable: false,
    },
    {
      label: "Unit",
      field: "productUnit",
      sortable: false,
    },
    {
      label: "Hourly Rate",
      field: "hourlyRate",
      sortable: false,
    },
    {
      label: "Daily Rate",
      field: "dailyRate",
      sortable: false,
    },
    {
      label: "Software",
      field: "productSoftware",
      sortable: false,
    },
    {
      label: "Payemnt Period",
      field: "payemntPeriod",
      sortable: false,
    },
    {
      label: "Service Hours",
      field: "serviceHours",
      sortable: false,
    },
    {
      label: "Service Days",
      field: "serviceDays",
      sortable: false,
    },
    {
      label: "Type",
      field: "type",
      sortable: false,
    },
    {
      label: "Product Group",
      field: "ProductGroup.productGroup.name",
      sortable: false,
    },
  ],
  { columns } = useTranslatedColumns(columnConfig),
  refresh = (
    page = currentPage.value,
    perPage = currentPerPage.value,
    column = "id",
    order = "desc",
    search = "",

    // productPriceListId = priceListId.value,
    // productType = type.value,
    // productStatus = status.value,
    productCategoryId = props.categoryId,
    // productSoftwareId = softwareId.value
  ) => {
     categoryId.value = props.categoryId,
    listingFunc({
      page: page,
      perPage: perPage,
      sortBy: column,
      sortOrder: order,
      search: search,
      // priceListId: productPriceListId,
      // type: productType,
      // status: productStatus,
      categoryId: productCategoryId,
      // softwareId: productSoftwareId,
    });
  };
// define api url of this crud that's we define in apiRoutes file.
apiRoute.value = routes.PRODUCT;
// after page load call this function
refresh();

const rowData = computed(() => {
  return data.value?.products?.map((prod) => {
    return {
      ...prod,
      quantity: prod?.quantity ?? 1,
      productUnit: prod?.productUnit.name,
      productSoftware: prod?.productSoftware.name,
    };
  });
});

function addProduct(e, product, productId) {
  if (e.target.checked) {
    const singleProd = {
      productId: product.id,
      productCategoryId: props.categoryId,
      articleNumber: product.articleNumber,
      name: product.name,
      productSoftware: product.productSoftware,
      quantity: product.quantity,
      productUnit: product.productUnit,
      // hourlyRate: product.hourlyRate,
       hourlyRate: 2,
      discount: product.discount,
      // paymentPeriodId: product.paymentPeriodId, // Period
      paymentPeriodId : 5,
      totalNetto:
        product.quantity * product.salePrice -
        (product.discount / 100) * (product.quantity * product.salePrice),
  
      additionDescription: "",
      descriptionToggle: false,
    };
    addedProducts.value.push(singleProd);
  } else {
    addedProducts.value = addedProducts.value.filter(
      (addedProd) => addedProd.productId !== productId
    );
  }
}

function addSoftwareProduct() {
  emits(
    "productAdded",
    addedProducts.value,
    props.attachmentIndex,
    null,
    "attachmentFieldProd"
  );
  props.hideModal();
}
</script>

<template>

  <Modal
    :showModal="props.showModal"
    @hideModal="props.hideModal"
    :title="`Add Products`"
    class="table-modal"
  >
  {{ props.categoryId }}
    <div>
      <div>
        <Table
          class="doc-table"
          :key="rowData?.length"
          :columns="columns"
          :isCustomBody="true"
          :removeSerialAble="true"
          :orderColumn="orderColumn"
          :orderDirection="orderDirection"
          @onSortChange="onSortChange"
        >
          <tr v-if="rowData?.length > 0" v-for="row in rowData" :key="row.id">
            <td v-for="col in columns" :key="col.field">
              <span
                class="d-flex align-items-center"
                v-if="col.field === 'articleNumber'"
              >
                <div class="me-2">
                  <input
                    type="checkbox"
                    name="license"
                    @change="addProduct($event, row, row?.id)"
                  />
                </div>
                {{ row[col.field] }}
              </span>
              <span v-else>
                {{ row[col.field] }}
              </span>
            </td>
            <td> </td>
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
      <submittal-button
        :buttonName="$t('Add Product')"
        @click="addSoftwareProduct()"
      />
    </div>
  </Modal>
</template>
