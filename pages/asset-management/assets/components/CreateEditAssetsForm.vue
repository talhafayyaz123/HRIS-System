<script setup lang="ts">
import { useVuelidate } from "@vuelidate/core";
import { required, requiredIf, minLength } from "@vuelidate/validators";
import { ValidateEach } from "@vuelidate/components";

import commonCode from "~/composables/common";
import { useLayoutStore } from "~/store/layout";
import { routes } from "~/utils/apiRoutes";
import { ref, reactive, onMounted } from "vue";
import genericFunctionality from "~/composables/genericFunctionality";
import { genericListingRequest, docListRequest } from "~/utils/apiRequests";

const layout = useLayoutStore();
const { isLoading, apiRoute, storeFunc, updateFunc, showFunc } =
  genericFunctionality();
const { router, Toast } = commonCode();
const { t } = useI18n();

const props = defineProps(["id"]);
const recordId = props.id;

const state = reactive({
  assetName: "",
  customerId: "",
  storeArticle: "",
  assetType: "",
  priceNetto: "",
});

const suppliersOptions = ref([]);

const validationState = {
  assetName: { required },
  customerId: { required },
  storeArticle: { required },
  assetType: { required },
  priceNetto: { required },
};

const v$ = useVuelidate(validationState, state);

// populate dropdowns
onMounted(async function () {
  try {
    layout.changeLoaderValue(true);

    const supplierRes = await genericListingRequest(routes.SUPPLIER);
    suppliersOptions.value = supplierRes?.data?.suppliers?.map((sr: any) => {
      return {
        value: sr.id,
        text: sr.name,
      };
    });

    layout.changeLoaderValue(false);
  } catch (e) {
    console.log(e);
    layout.changeLoaderValue(false);
  }
});

// In case of edit, populate
onMounted(async function () {
  try {
    if (!recordId) {
      return;
    }
    layout.changeLoaderValue(true);
    apiRoute.value = routes.ASSETS;
    let response = await showFunc(recordId);
    if (!!response?.success) {
      const { assetName, customerId, storeArticle, assetType, priceNetto } =
        response?.data;

      state.assetName = assetName;
      state.customerId = customerId;
      state.storeArticle = storeArticle;
      state.assetType = assetType;
      state.priceNetto = priceNetto;
    }
    layout.changeLoaderValue(false);
  } catch (e) {
    layout.changeLoaderValue(true);
  }
});

async function assetstHandler() {
  v$.value.$touch();
  if (v$.value.$invalid) {
    return;
  } else {
    layout.changeLoaderValue(true);
    apiRoute.value = routes.ASSETS;
    const payload = {
      ...state,
    };
    recordId
      ? updateFunc(
          payload,
          recordId,
          "/asset-management/assets"
        )
      : storeFunc(payload, "/asset-management/assets");
    layout.changeLoaderValue(false);
  }
}
</script>

<template>
  <div>
    <div class="row">
      <div class="col-lg-12">
        <div class="card h-auto">
          <div class="card-header d-flex align-items-center">
            <h3 class="card-title me-2">
              {{ $t("Fill Assets Details") }}
            </h3>
            <elements-tooltip />
          </div>
          <div class="card-body">
            <div class="row">
              <div class="col-lg-6">
                <div class="form-group">
                  <elements-input
                    v-model="state.assetName"
                    :label="$t('Asset Name')"
                    :required="true"
                    id="asset-name"
                    :class="{ 'is-invalid': v$.assetName.$error }"
                  />
                </div>
                <div v-if="v$.assetName.$error" class="invalid-feedback">
                  <span class="text-danger" v-if="v$.assetName.required">{{
                    $t("This value is required")
                  }}</span>
                </div>
              </div>

              <div class="col-lg-6">
                <div class="form-group">
                  <elements-multiselect
                    v-model="state.customerId"
                    :options="suppliersOptions"
                    :key="state.customerId"
                    label="text"
                    track-by="value"
                    :textLabel="$t('Suppliers')"
                    :required="true"
                    :class="{ 'is-invalid': v$.customerId.$error }"
                  />
                </div>
                <div v-if="v$.customerId.$error" class="invalid-feedback">
                  <span class="text-danger" v-if="v$.customerId.required">{{
                    $t("This value is required")
                  }}</span>
                </div>
              </div>

              <div class="col-lg-6">
                <div class="form-group">
                  <elements-input
                    v-model="state.storeArticle"
                    :label="$t('Store Article')"
                    :required="true"
                    id="store-article"
                    :class="{ 'is-invalid': v$.storeArticle.$error }"
                  />
                </div>
                <div v-if="v$.storeArticle.$error" class="invalid-feedback">
                  <span class="text-danger" v-if="v$.storeArticle.required">{{
                    $t("This value is required")
                  }}</span>
                </div>
              </div>

              <div class="col-lg-6">
                <div class="form-group">
                  <elements-input
                    v-model="state.assetType"
                    :label="$t('Asset Type')"
                    :required="true"
                    id="asset-type"
                    :class="{ 'is-invalid': v$.assetType.$error }"
                  />
                </div>
                <div v-if="v$.assetType.$error" class="invalid-feedback">
                  <span class="text-danger" v-if="v$.assetType.required">{{
                    $t("This value is required")
                  }}</span>
                </div>
              </div>

              <div class="col-lg-6">
                <div class="form-group">
                  <elements-input
                    v-model="state.priceNetto"
                    :label="$t('Price Netto')"
                    :required="true"
                    id="price-netto"
                    :class="{ 'is-invalid': v$.priceNetto.$error }"
                    type="number"
                  />
                </div>
                <div v-if="v$.priceNetto.$error" class="invalid-feedback">
                  <span class="text-danger" v-if="v$.priceNetto.required">{{
                    $t("This value is required")
                  }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="mt-3 d-flex align-items-center justify-content-end">
          <button
            class="primary-btn me-3"
            @click="navigateTo('/settings/contract-management/attachments')"
          >
            <elements-icon v-bind:icon="'cancelIcon'" class="me-2" />
            <span>{{ $t("Cancel") }}</span>
          </button>
          <submittal-button
            :isLoading="layout.loader"
            @click="assetstHandler"
            :iconName="'saveIcon'"
            :buttonName="$t('Save and Proceed')"
          />
        </div>
      </div>
    </div>
  </div>
</template>
