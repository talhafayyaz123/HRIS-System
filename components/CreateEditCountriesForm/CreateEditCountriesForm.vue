<script setup lang="ts">
import { useVuelidate } from "@vuelidate/core";
import { required } from "@vuelidate/validators";
import commonCode from "~/composables/common";
import { useLayoutStore } from "~/store/layout";

import {
  createCountryRequest,
  getCountryByIdRequest,
  editCountryRequest,
} from "@/utils/apiRequests";
import { reactive, onMounted } from "vue";

const { router, Toast } = commonCode();
const { t } = useI18n();

const state = reactive({
  isLoading: false,
  name: "",
  isoCode: "",
  region: "",
  subRegion: "",
});
const props = defineProps(["id"]);
const countryId = props.id;

const validationRules = {
  name: { required },
  isoCode: { required },
  region: { required },
};
const v$ = useVuelidate(validationRules, state);

// In case of edit, populate country
onMounted(async function () {
  try {
    if (!countryId) {
      // incase of add don't call api
      return;
    }
    state.isLoading = true;
    const layout = useLayoutStore();
    layout.changeLoaderValue(true);
    const res = await getCountryByIdRequest(countryId);
    const { name, isoCode, region, subRegion } = res.data;
    layout.changeLoaderValue(false);
    state.name = name;
    state.isoCode = isoCode;
    state.region = region;
    state.subRegion = subRegion;
    state.isLoading = false;
  } catch (e) {
    console.log(e);
    state.isLoading = false;
  }
});

async function countryHandler() {
  // stop here if form is invalid
  v$.value.$touch();
  if (v$.value.$invalid) {
    return;
  } else {
    try {
      const layout = useLayoutStore();
      layout.changeLoaderValue(true);
      state.isLoading = true;
      const formData = {
        name: state.name,
        isoCode: state.isoCode,
        ...(state.region && { region: state.region }),
        ...(state.subRegion && { subRegion: state.subRegion }),
      };
      // if we have id then edit otherwise add
      const res = countryId
        ? await editCountryRequest(countryId, formData)
        : await createCountryRequest(formData);
      layout.changeLoaderValue(false);
      Toast.fire({
        title: countryId
          ? "Countries updated successfully"
          : "Countries created successfully",
        icon: "success",
      });
      state.isLoading = false;
      navigateTo("/settings/global-settings/countries");
    } catch (error) {
      if (error && error.response && error.response.data) {
        Toast.fire({
          icon: "error",
          title: error.response.data.message,
        });
      }
      const layout = useLayoutStore();
      layout.changeLoaderValue(false);
      state.isLoading = false;
    }
  }
}
</script>

<template>
  <form @submit.prevent="countryHandler">
    <div class="card">
      <div class="card-header d-flex align-items-center">
        <h3 class="card-title me-2">{{ $t("Fill Country Details") }}</h3>
        <elements-tooltip />
      </div>
      <div class="card-body">
        <div class="row">
          <div class="col-lg-4">
            <div class="form-group">
              <elements-input
                v-model="state.name"
                :label="$t('Name')"
                :required="true"
                :disabled="state.isLoading"
                id="name"
                :class="{ 'is-invalid': v$.name.$error }"
              />
            </div>
            <div v-if="v$.name.$error" class="invalid-feedback">
              <span class="text-danger" v-if="v$.name.required">{{
                $t("This value is required")
              }}</span>
            </div>
          </div>
          <div class="col-lg-4">
            <div class="form-group">
              <elements-input
                v-model="state.isoCode"
                :label="$t('Iso Code')"
                :required="true"
                :disabled="state.isLoading"
                id="isoCode"
                :class="{ 'is-invalid': v$.isoCode.$error }"
              />
            </div>
            <div v-if="v$.isoCode.$error" class="invalid-feedback">
              <span class="text-danger" v-if="v$.isoCode.required">{{
                $t("This value is required")
              }}</span>
            </div>
          </div>
          <div class="col-lg-4">
            <div class="form-group">
              <elements-input
                v-model="state.region"
                :label="$t('Region')"
                :disabled="state.isLoading"
                id="region"
                :required="true"
                :class="{ 'is-invalid': v$.region.$error }"
              />
            </div>
            <div v-if="v$.region.$error" class="invalid-feedback">
              <span class="text-danger" v-if="v$.region.required">{{
                $t("This value is required")
              }}</span>
            </div>
          </div>
          <div class="col-lg-4">
            <div class="form-group">
              <elements-input
                v-model="state.subRegion"
                :label="$t('Sub Region')"
                :disabled="state.isLoading"
                id="subRegion"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="mt-3 d-flex align-items-center justify-content-end">
      <button
        class="primary-btn me-3"
        @click="navigateTo('/settings/global-settings/countries')"
      >
        <elements-icon v-bind:icon="'cancelIcon'" class="me-2" />
        <span>{{ $t("Cancel") }}</span>
      </button>
      <submittal-button
        :isLoading="state.isLoading"
        :icon-name="'saveIcon'"
        :buttonName="$t('Save and Proceed')"
      />
    </div>
  </form>
</template>
