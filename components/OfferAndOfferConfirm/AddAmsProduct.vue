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
      type: "ams",
    });
    data.value = prodRes?.data;
  } catch (e) {
    console.log(e);
  }
}
refresh();

function addProduct(e, product, productId) {
  if (e.target.checked) {
    const singleProd = {
      type: "application",
      productId: product?.id,
      articleNumber: product?.articleNumber,
      name: product?.name,
      productSoftware: product?.productSoftware?.name,
      quantity: product?.quantity ?? 1,
      productUnit: product?.productUnit,
      hourlyRate: product?.hourlyRate,
      discount: product?.discount,
      paymentPeriodId: product?.paymentPeriod?.id,
      tax: product?.tax,
      totalNetto: (1 * product?.hourlyRate) - ((product?.discount / 100) * (1 * product?.hourlyRate)),
      additionDescription: "",
      descriptionToggle: false,
      slaToggle: false,
      slaInfrastructureId: null,
      slaServiceTimeId: null,
      slaLevelIncidentId: null,
      slaLevelChangeId: null,
      salePrice: product?.salePrice // for generate docx
    };
    addedProducts.value.push(singleProd);
  } else {
    addedProducts.value = addedProducts.value.filter(
      (addedProd) => addedProd.productId !== productId
    );
  }
}

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
                <th class="">{{ $t("ARTICLE NUMBER") }}</th>
                <th class="">{{ $t("NAME") }}</th>
                <th class="">{{ $t("STATUS") }}</th>
                <th class="">{{ $t("SALE PRICE") }}</th>
                <th class="">{{ $t("UNIT") }}</th>
                <th class="">{{ $t("HOURLY RATE") }}</th>
                <th class="">{{ $t("DAILY RATE") }}</th>
                <th class="">{{ $t("SOFTWARE") }}</th>
                <th class="">{{ $t("PAYMENT PERIOD") }}</th>
                <th class="">{{ $t("SERVICE HOURS") }}</th>
                <th class="">{{ $t("SERVICE DAYS") }}</th>
                <th class="">{{ $t("TYPE") }}</th>
                <th class="">{{ $t("CATEGORY") }}</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(product, index) in data.products" :key="index">
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
                <td>{{ product?.status ? "active" : "inactive" }}</td>
                <td>{{ product?.salePrice }}</td>
                <td>{{ product?.productUnit.name }}</td>
                <td>{{ product?.hourlyRate }}</td>
                <td>{{ product?.dailyRate }}</td>
                <td>{{ product?.productSoftware.name }}</td>
                <td>{{ product?.paymentPeriod.name }}</td>
                <td>{{ product?.serviceHours }}</td>
                <td>{{ product?.serviceDays }}</td>
                <td>{{ product?.type }}</td>
                <td>{{ product?.productCategory?.name }}</td>
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
