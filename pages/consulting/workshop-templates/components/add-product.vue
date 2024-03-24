<script setup lang="ts">
import { ref, reactive, onMounted } from "vue";
import commonCode from "~/composables/common";
import { routes } from "~/utils/apiRoutes";
import { genericListingRequest } from "~/utils/apiRequests";

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
      type: "software",
    });
    data.value = prodRes?.data;
    productData.value = prodRes.data.products.map((prod: any) => {
      return {
        ...prod,
        quantity: prod?.quantity ?? 1,
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
      id: product.id,
      name: product.name
    };
    addedProducts.value.push(singleProd);
  } else {
    addedProducts.value = addedProducts.value.filter(
      (addedProd) => addedProd.id !== productId
    );
  }
}

function addSoftwareProduct() {
  emits("productAdded", addedProducts.value);
  props.hideModal();
  addedProducts.value = [];
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
              <tr>
                <th>{{ $t("Article Number") }}</th>
                <th>{{ $t("Name") }}</th>
                <th>{{ $t("Product Category") }}</th>
                <th>{{ $t("Status") }}</th>
                <th>{{ $t("Sale Price") }}</th>
                <th>{{ $t("Discount") }}</th>
                <th>{{ $t("Quantity") }}</th>
                <th>{{ $t("Profit") }}</th>
                <th>{{ $t("Listing Price") }}</th>
                <th>{{ $t("Tax") }}</th>
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
                <td>{{ product?.productCategory?.name }}</td>
                <td>{{ product?.status ? "active" : "inactive" }}</td>
                <td>{{ product?.salePrice }}</td>
                <td>{{ product?.discount }}</td>
                <td>
                  {{ product?.quantity }}
                </td>

                <td>{{ product?.profit }}</td>
                <td>{{ product?.listPrice }}</td>
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
        {{ $t('Close') }}
      </button>
      <submittal-button
        :buttonName="$t('Add Product')"
        @click="addSoftwareProduct()"
      />
    </div>
  </Modal>
</template>
