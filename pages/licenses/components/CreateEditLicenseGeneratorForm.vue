<script setup lang="ts">
import { ref, reactive, watch, onMounted, computed } from "vue";
import commonCode from "~/composables/common";
import offerAndConfirmOffer from "~/composables/offerAndConfirmOffer";
import { useVuelidate } from "@vuelidate/core";
import { required } from "@vuelidate/validators";
import { useLayoutStore } from "~/store/layout";
import {
  genericListingRequest,
  createLicenseGeneratorRequest,
  updateLicenseGeneratorRequest,
  getLicenseGeneratorRequest,
} from "~/utils/apiRequests";
import { routes } from "~/utils/apiRoutes";
import AddLicensesProduct from "./AddLicensesProduct.vue";
import LicensesTable from "./LicensesTable.vue";

const props = defineProps(["recordId"]);

const { router, Toast } = commonCode(),
  { t } = useI18n(),
  state = reactive({
    name: "",
    company_id: "",
    tenant_id: "",
    status: "",
    config: "",
  }),
  productTableData = ref([]),
  files = reactive({
    files: [],
  }),
  filesConvertedToBase64 = ref([]),
  isLoading = ref(false),
  isModalOpen = ref(false),
  validationRules = {
    name: { required },
    company_id: { required },
  },
  v$ = useVuelidate(validationRules, state),
  statusOptions = [
    { value: "1", name: "Active" },
    { value: "0", name: "Inactive" },
  ],
  companyOptions = ref([]),
  tenantOptions = ref([]);

function hideModal() {
  isModalOpen.value = false;
}
function showModal() {
  isModalOpen.value = true;
}
function addProduct() {
  showModal();
}
function productAdded(product) {
  product.map((prod) => {
    productTableData.value?.push(prod);
  });
}
const calculateProductValue = (event: any, index: any) => {
  productTableData.value[index].quantity = event.target.value;
};

onMounted(async function () {
  try {
    const layout = useLayoutStore();
    layout.changeLoaderValue(true);
    const resCompany = await genericListingRequest(routes.COMPANY, {
      all: true,
    });

    companyOptions.value = resCompany?.data?.customers?.map((ms: any) => {
      return { value: ms.id, name: ms.name };
    });

    tenantOptions.value = resCompany?.data?.customers?.map((ms: any) => {
      return { value: ms.id, name: ms.name };
    });
    layout.changeLoaderValue(false);
    if (props.recordId) {
      const resLicense = await getLicenseGeneratorRequest(props.recordId);
      const { name, company, tenant, status, products, config } =
        resLicense.data;
      state.name = name;
      state.company_id = company;
      state.tenant_id = tenant;
      state.status = status;
      productTableData.value = products ?? [];
      state.config = JSON.stringify(config?.data) ?? state.config;
      files.files = config?.files ?? [];
      filesConvertedToBase64.value = config?.files;
    }
  } catch (e) {
    const layout = useLayoutStore();
    layout.changeLoaderValue(false);
    console.log(e);
  }
});

async function createLicenseGeneratorHandler() {
  v$.value.$touch();
  if (v$.value.$invalid) {
    return;
  } else {
    try {
      isLoading.value = true;

      const formData = {
        ...(state.name && { name: state.name }),
        ...(state.company_id && { company_id: state.company_id }),
        ...(state.tenant_id && { tenant_id: state.tenant_id }),
        ...(state.status && { status: state.status }),
        ...(productTableData.value &&
          productTableData.value.length > 0 && {
          product_info: productTableData.value.map((pt) => {
            return {
              id: pt.productId,
              quantity: pt.quantity,
            };
          }),
        }),
        config: {
          ...(state.config && { data: state.config }),
          ...(filesConvertedToBase64.value && {
            files: filesConvertedToBase64.value,
          }),
        },
        ...(props.recordId && { id: props.recordId }), // for update case
        // rules: [],
      };
      const layout = useLayoutStore();
      layout.changeLoaderValue(true);
      const res = props.recordId
        ? await updateLicenseGeneratorRequest(formData)
        : await createLicenseGeneratorRequest(formData);
      Toast.fire({
        title: props.recordId ? "Updated" : "Created",
        icon: "success",
      });
      isLoading.value = false;
      layout.changeLoaderValue(false);

      navigateTo("/licenses");
    } catch (e) {
      const layout = useLayoutStore();
      layout.changeLoaderValue(false);
      console.log(e);
      Toast.fire({ title: t("Error!"), text: t("Error"), icon: "error" });
      isLoading.value = false;
    }
  }
}

function addFiles(files) {
  filesConvertedToBase64.value = [];
  files.forEach((file: any) => {
    // only convert to base64 if the file is of type Blob
    if (file instanceof Blob) {
      let reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        filesConvertedToBase64.value.push({
          name: file.name,
          content: reader.result,
        });
      };
      reader.onerror = (error) => {
        console.log(error);
      };
    } else {
      filesConvertedToBase64.value.push({
        ...file,
      });
    }
  });
}
</script>

<template>
  <div>
    <div class="card">
      <div class="card-header d-flex align-items-center">
        <h3 class="card-title me-2">{{ $t("Fill License Details") }}</h3>
        <elements-tooltip />
      </div>
      <div class="card-body">
        <div class="row">
          <div class="col-lg-4">
            <div class="form-group">
              <elements-input v-model="state.name" :label="$t('Name')" :required="true" id="name"
                :class="{ 'is-invalid': v$.name.$error }" />

            </div>
            <div v-if="v$.name.$error" class="invalid-feedback">
              <span class="text-danger" v-if="v$.name.required">{{
                $t("This value is required")
              }}</span>
            </div>
          </div>

          <div class="col-lg-4">
            <div class="form-group">
              <elements-multiselect v-model="state.company_id" :options="companyOptions" :key="state.company_id"
                label="name" track-by="value" :textLabel="$t('Company')" :required="true"
                :class="{ 'is-invalid': v$.company_id.$error }" />

            </div>
            <div v-if="v$.company_id.$error" class="invalid-feedback">
              <span class="text-danger" v-if="v$.company_id.required">{{
                $t("This value is required")
              }}</span>
            </div>
          </div>

          <div class="col-lg-4">
            <div class="form-group">
              <elements-multiselect v-model="state.tenant_id" :options="tenantOptions" :key="state.tenant_id" label="name"
                track-by="value" :textLabel="$t('Tenant')" />
            </div>
          </div>

          <div class="col-lg-4">
            <div class="form-group">
              <elements-multiselect v-model="state.status" :options="statusOptions" :key="state.status" label="name"
                track-by="value" :textLabel="$t('Status')" />
            </div>
          </div>
        </div>
      </div>
    </div>

    <div>
      <licenses-table :productTableData="productTableData" @addProduct="addProduct" />
    </div>

    <div class="card no-header mt-4">
      <div class="card-body">
        <div class="row">
          <div class="col-lg-12">
            <div class="form-group textarea">
              <textarea v-model="state.config" cols="30" rows="10" class="form-control" placeholder="."></textarea>
              <label for="" class="input-label">{{ $t("Config") }}</label>
            </div>
          </div>
          <div class="col-lg-12 mt-3">
            <file-inputs class="w-100" @file-changed="addFiles" :productFiles="files" />
          </div>

        </div>
      </div>
    </div>

    <add-licenses-product v-if="isModalOpen" :showModal="isModalOpen" :hideModal="hideModal"
      @productAdded="productAdded" />

    <div v-else class="mt-4 d-flex align-items-center justify-content-end">
      <button class="primary-btn me-3" @click="navigateTo('/licenses')">
        <elements-icon v-bind:icon="'cancelIcon'" class="me-2" />
        <span>{{ $t("Cancel") }}</span>
      </button>
      <submittal-button @click="createLicenseGeneratorHandler()" :isLoading="isLoading" :icon-name="'saveIcon'"
        :buttonName="$t('Save and Proceed')" />
    </div>
  </div>
</template>
