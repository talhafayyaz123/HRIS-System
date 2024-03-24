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
  "showModal",
  "hideModal",
  "attachmentIndex",
  "contractIndex",
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
      label: "Product Group",
      field: "ProductGroup.productGroup.name",
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
      label: "Discount",
      field: "discount",
      sortable: false,
    },
    {
      label: "Quantity",
      field: "quantity",
      sortable: false,
    },
    {
      label: "Profit",
      field: "profit",
      sortable: false,
    },
    {
      label: "Listing Price",
      field: "listPrice",
      sortable: false,
    },
    {
      label: "Tax",
      field: "tax",
      sortable: false,
    },
  ],
  { columns } = useTranslatedColumns(columnConfig),
  refresh = (
    page = currentPage.value,
    perPage = currentPerPage.value,
    column = "id",
    order = "desc",
    search = ""
    // productPriceListId = priceListId.value,
    // productType = type.value,
    // productStatus = status.value,
    // productCategoryId = categoryId.value,
    // productSoftwareId = softwareId.value
  ) => {
    listingFunc({
      page: page,
      perPage: perPage,
      sortBy: column,
      sortOrder: order,
      search: search,
      // priceListId: productPriceListId,
      // type: productType,
      // status: productStatus,
      // categoryId: productCategoryId,
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
    };
  });
});

function addProduct(e, product, productId) {
  if (e.target.checked) {
    const singleProd = {
      type: product.type,
      productId: product.id,
      articleNumber: product.articleNumber,
      name: product.name,
      productSoftware: product.productSoftware,
      quantity: product.quantity,
      productUnit: product.productUnit,
      salePrice: product.salePrice, // produt price
      // hourlyRate: product.hourlyRate ?? 1,
      hourlyRate: 2,
      pricePerPeriod: product.pricePerPeriod,
      duration: product.duration,
      discount: product.discount,
      tax: product.tax,
      taxRate : product.taxRate,
      paymentPeriodId: product.paymentPeriodId, // Period
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

const changeQuantity = (event, productId, changeType?: any) => {
  const changedQuantity = event.target.value;
  if (addedProducts.value && addedProducts.value.length > 0) {
    addedProducts.value.map((addedProd, index) => {
      if (addedProd.productId === productId) {
        // quantity
        addedProducts.value[index].quantity = changedQuantity;
        // totalNetto
        addedProducts.value[index].totalNetto =
          changedQuantity * addedProducts.value[index].salePrice -
          (addedProducts.value[index].discount / 100) *
            (changedQuantity * addedProducts.value[index].salePrice);
        return;
      }
    });
  } else return;
};

function addSoftwareProduct() {
  emits(
    "productAdded",
    addedProducts.value,
    props.attachmentIndex,
    props.contractIndex,
    "contractFieldProd"
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
              <span v-else-if="col.field === 'quantity'">
                <div style="width: 100px">
                  <input
                    v-model="row.quantity"
                    @change="changeQuantity($event, row.id)"
                    type="number"
                    class="form-control"
                  />
                </div>
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
