<script setup lang="ts">
import {
  genericListingRequest,
  uploadCsvProductRequest,
} from "@/utils/apiRequests";
import genericFeatures from "~/composables/generic";
import { ref, reactive, onMounted, watch } from "vue";
import { routes } from "~/utils/apiRoutes";
import commonCode from "~/composables/common";
import { useVuelidate } from "@vuelidate/core";
import { required } from "@vuelidate/validators";
import { MdEditor } from "md-editor-v3";
import Multiselect from "@vueform/multiselect";
import "md-editor-v3/lib/style.css";

const runtimeConfig = useRuntimeConfig();
const props = defineProps(["showModal", "hideModal"]);
const emits = defineEmits(["csvProductModalData"]);

const { showGenericListing } = genericFeatures();
const { router, Toast } = commonCode(),
  { t } = useI18n(),
  state = reactive({
    type: "",
    priceListId: null,
    paymentPeriodId: null,
    unitId: null,
    softwareId: null,
    versions: [],
  }),
  isLoading = ref(false),
  validationRules = {
    type: { required },
    priceListId: { required },
    paymentPeriodId: { required },
    unitId: { required },
    softwareId: { required },
    versions: { required },
  },
  v$ = useVuelidate(validationRules, state);

const fileInput = ref("");
const file = ref(null as any);
const productData = ref([]);
const productTypeOptions = ref([
  { value: "software", name: "Software" }
  // { value: "service", name: "Service" },
  // { value: "pauschal", name: "Pauschal" },
  // { value: "hosting", name: "Hosting" },
  // { value: "application", name: "Application" },
  // { value: "cloud", name: "Cloud" },
  // { value: "traveling", name: "Traveling" },
]);
const priceListOptions = ref([]);
const paymentPeriodOptions = ref([]);
const unitOptions = ref([]);
const softwareOptions = ref([]);

// populate dropdowns
onMounted(async function () {
  try {
    const priceListReq = await genericListingRequest(routes.PRICE_LIST, {
      all: true,
    });
    const paymentPeriodRes = await genericListingRequest(
      routes.PRODUCT_PAYMENT_PERIOD,
      {
        all: true,
      }
    );
    const unitsRes = await genericListingRequest(routes.PRODUCT_UNIT, {
      all: true,
    });
    const softwareRes = await genericListingRequest(routes.PRODUCT_SOFTWARE, {
      all: true,
    });

    priceListOptions.value = priceListReq?.data?.map((psv: any) => {
      return {
        value: psv.id,
        name: psv.name,
      };
    });

    paymentPeriodOptions.value = paymentPeriodRes?.data?.map((pp: any) => {
      return {
        value: pp.id,
        name: pp.name,
      };
    });
    unitOptions.value = unitsRes?.data?.map((uo: any) => {
      return {
        value: uo.id,
        name: uo.name,
      };
    });
    softwareOptions.value = softwareRes?.data?.map((ps: any) => {
      return {
        value: ps.id,
        name: ps.name,
      };
    });
  } catch (e) {
    console.log(e);
  }
});

async function importProductHandler() {
  v$.value.$touch();
  if (v$.value.$invalid) {
    return;
  } else {
    try {
      isLoading.value = true;
      fileInput.value.click();
      isLoading.value = false;
    } catch (e) {
      console.log(e);
      Toast.fire({ title: t("Error!"), text: t("Error"), icon: "error" });
      isLoading.value = false;
    }
  }
}

// upload csv file
async function uploadFile(e: any) {
  file.value = e.target.files[0];
  try {
    isLoading.value = true;
    const formData = new FormData();
    formData.append("file", file.value);
    const res = await uploadCsvProductRequest(formData);
    productData.value = res?.data;
    emits("csvProductModalData", productData.value, {
      type: state.type,
      priceListId: state.priceListId,
      paymentPeriodId: state.paymentPeriodId,
      unitId: state.unitId,
      softwareId: state.softwareId,
      versions: [state.versions],
    });

    isLoading.value = false;
    props.hideModal();
  } catch (e) {
    isLoading.value = false;
    console.log(e);
    
  }
}

</script>

<template>
  <Modal
    :showModal="props.showModal"
    @hideModal="props.hideModal"
    :title="`Select an option`"
  >
    <div class="row mt-4">
      <div class="row">
        <div class="col-sm-12">
          <div class="form-group">
            <elements-multiselect
              v-model="state.type"
              :options="productTypeOptions"
              :key="state.type"
              label="name"
              track-by="value"
              :textLabel="$t('Select a Product Type')"
              :required="true"
              :class="{ 'is-invalid': v$.type.$error }"
            />
            <div v-if="v$.type.$error" class="invalid-feedback">
              <span class="text-danger" v-if="v$.type.required">{{
                $t("This value is required")
              }}</span>
            </div>
          </div>
        </div>

        <div class="col-sm-12">
          <div class="form-group">
            <elements-multiselect
              v-model="state.priceListId"
              :options="priceListOptions"
              :key="state.priceListId"
              label="name"
              track-by="value"
              :textLabel="$t('Price List')"
              :required="true"
              :class="{ 'is-invalid': v$.priceListId.$error }"
            />
            <div v-if="v$.priceListId.$error" class="invalid-feedback">
              <span class="text-danger" v-if="v$.priceListId.required">{{
                $t("This value is required")
              }}</span>
            </div>
          </div>
        </div>

        <div class="col-sm-12">
          <div class="form-group">
            <elements-multiselect
              v-model="state.paymentPeriodId"
              :options="paymentPeriodOptions"
              :key="state.paymentPeriodId"
              label="name"
              track-by="value"
              :textLabel="$t('Payment Period')"
              :required="true"
              :class="{ 'is-invalid': v$.paymentPeriodId.$error }"
            />
            <div v-if="v$.paymentPeriodId.$error" class="invalid-feedback">
              <span class="text-danger" v-if="v$.paymentPeriodId.required">{{
                $t("This value is required")
              }}</span>
            </div>
          </div>
        </div>

        <div class="col-sm-12">
          <div class="form-group">
            <elements-multiselect
              v-model="state.unitId"
              :options="unitOptions"
              :key="state.unitId"
              label="name"
              track-by="value"
              :textLabel="$t('Unit')"
              :required="true"
              :class="{ 'is-invalid': v$.unitId.$error }"
            />
            <div v-if="v$.unitId.$error" class="invalid-feedback">
              <span class="text-danger" v-if="v$.unitId.required">{{
                $t("This value is required")
              }}</span>
            </div>
          </div>
        </div>

        <div class="col-sm-12">
          <div class="form-group">
            <elements-multiselect
              v-model="state.softwareId"
              :options="softwareOptions"
              :key="state.softwareId"
              label="name"
              track-by="value"
              :textLabel="$t('Software')"
              :required="true"
              :class="{ 'is-invalid': v$.softwareId.$error }"
            />
            <div v-if="v$.softwareId.$error" class="invalid-feedback">
              <span class="text-danger" v-if="v$.softwareId.required">{{
                $t("This value is required")
              }}</span>
            </div>
          </div>
        </div>

        <div class="col-sm-12">
          <div class="form-group">
            <elements-input
              v-model="state.versions"
              :label="$t('Enter version')"
              :required="true"
              id="name"
              :class="{ 'is-invalid': v$.versions.$error }"
            />
          </div>
          <div v-if="v$.versions.$error" class="invalid-feedback">
            <span class="text-danger" v-if="v$.versions.required">{{
              $t("This value is required")
            }}</span>
          </div>
        </div>
      </div>
    </div>

    <input @input="uploadFile" ref="fileInput" class="d-none" type="file" />

    <div class="mt-4 d-flex align-items-center justify-content-end">
      <submittal-button
        type="button"
        class="primary-btn me-2"
        data-bs-dismiss="modal"
        :isLoading="isLoading"
        @click="importProductHandler"
        :buttonName="$t('Import')"
      />
    </div>
  </Modal>
</template>
