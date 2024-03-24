<script setup lang="ts">
import { ref, reactive, onMounted } from "vue";
import commonCode from "~/composables/common";
import { routes } from "~/utils/apiRoutes";
import {
  customerLicenseCreateRequest,
  genericListingRequest,
} from "~/utils/apiRequests";

const { router, Toast } = commonCode();
const { t } = useI18n();
const currentPerPage = ref(10);
const startPerPage = ref(0);
const currentPage = ref(1);
const data = ref({});
const productData = ref([]);
const props = defineProps(["showModal", "hideModal"]);
const emits = defineEmits(["productAdded"]);
const addedProducts = ref([]);

async function refresh(
  page = currentPage.value,
  perPage = currentPerPage.value
) {
  try {
    const prodRes = await genericListingRequest(routes.PRODUCT, {
      page,
      perPage,
      type: "cloud",
    });
    data.value = prodRes?.data;
    productData.value = prodRes.data.products.map((prod: any) => {
      return {
        ...prod,
        quantity: prod.quantity ?? 1,
        duration: prod.duration ?? 1,
      };
    });
  } catch (e) {
    console.log(e);
  }
}
refresh();

function addProduct(e, product, productId) {
  if (e.target.checked) {
    const singleProd = {
      type: "cloud",
      productId: product.id,
      articleNumber: product.articleNumber,
      name: product.name,
      productSoftware: product.productSoftware,
      quantity: product.quantity,
      duration: product.duration,
      salePrice: product.salePrice,
      totalPrice: product.quantity * product.salePrice,
      discount: product.discount,
      paymentPeriodId: product.paymentPeriod.id,
      tax: product.tax,
      totalNetto:
        product.quantity * product.duration * product.salePrice -
        (product.discount / 100) *
          (product.quantity * product.duration * product.salePrice),
      totalRate: product.quantity * product.duration * product.salePrice, // for child product
      additionDescription: "",
      descriptionToggle: false,
      childComponents: [],
    };
    addedProducts.value.push(singleProd);
  } else {
    addedProducts.value = addedProducts.value.filter(
      (addedProd) => addedProd.productId !== productId
    );
  }
}

const changeDiscount = (event, productId) => {
  const changedDiscount = event.target.value;
  addedProducts.value.map((addedProd, index) => {
    if (addedProd.productId === productId) {
      addedProducts.value[index].discount = changedDiscount;
      const result =
        addedProducts.value[index].quantity *
        addedProducts.value[index].duration *
        addedProducts.value[index].salePrice;
      addedProducts.value[index].totalNetto =
        result - (changedDiscount / 100) * result;
      addedProducts.value[index].totalRate = result; // for child product
      return;
    }
  });
};
function addSoftwareProduct() {
  emits("productAdded", addedProducts.value);
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
    <div class="row mt-4 product-table">
      <div class="col-12 col-lg-12 col-sm-12">
        <div class="table-responsive mt-3">
          <table class="doc-table table">
            <thead>
              <tr class="">
                <th class="">{{ $t("Article Number") }}</th>
                <th class="">{{ $t("NAME") }}</th>
                <th class="">{{ $t("PRODUCT CATEGORY") }}</th>
                <th class="">{{ $t("STATUS") }}</th>
                <th class="">{{ $t("SALE PRICE") }}</th>
                <th class="">{{ $t("PRICE PER PERIOD") }}</th>
                <th class="">{{ $t("DISCOUNT") }}</th>
                <th class="">{{ $t("QUANTITY") }}</th>
                <th class="">{{ $t("PROFIT") }}</th>
                <th class="">{{ $t("LISTING PRICE") }}</th>
                <th class="">{{ $t("TAX") }}</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(product, index) in productData" :key="index">
                <td>
                  <div class="d-flex align-items-center">
                    <div class="me-2">
                      <input
                        type="checkbox"
                        name="license"
                        @change="addProduct($event, product, product?.id)"
                      />
                    </div>
                    <span>{{ product?.articleNumber }}</span>
                  </div>
                </td>
                <td>{{ product?.name }}</td>
                <td>{{ product?.productCategory.name }}</td>
                <td>{{ product?.status ? "active" : "inactive" }}</td>
                <td>{{ product?.salePrice }}</td>
                <td>{{ product?.pricePerPeriod ?? 0 }}</td>

                <td>
                  <div style="width: 100px">
                    <input
                      :value="product?.discount"
                      @change="changeDiscount($event, product.id)"
                      type="number"
                      class="form-control"
                    />
                  </div>
                </td>

                <td>
                  {{ product.quantity }}
                </td>
                <td>{{ product?.profit }}</td>
                <td>{{ product?.listingPrice }}</td>
                <td>{{ product?.tax }}</td>
              </tr>
            </tbody>
          </table>
        </div>
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
