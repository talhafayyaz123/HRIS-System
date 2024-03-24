<script setup lang="ts">
import { ref, reactive } from "vue";
import { productUnitCreateRequest } from "~/utils/apiRequests";
import commonCode from "~/composables/common";
import { useVuelidate } from "@vuelidate/core";
import { required } from "@vuelidate/validators";
import { useLayoutStore } from "~/store/layout";

import {
  useTranslatedBreadCrumbs,
  useTitle,
} from "~/composables/useTranslated";

const { router, Toast } = commonCode();
const { t } = useI18n();

const state = reactive({
  unitName: "",
  shortName: "",
  isLoading: false,
});

const breadCrumbsConfig = [
    {
      text: "Global Settings",
      to: "/",
    },
    {
      text: "Products",
      to: "/",
    },
    {
      text: "Units",
      to: "/settings/products/units",
    },
    {
      text: "Create",
      active: true,
    },
  ],
  { title } = useTitle("Create Units"),
  { items } = useTranslatedBreadCrumbs(breadCrumbsConfig);

const validationRules = {
    unitName: { required },
    shortName: { required },
  },
  v$ = useVuelidate(validationRules, state);

const createUnitHandler = () => {
  v$.value.$touch();
  if (v$.value.$invalid) {
    return false;
  } else {
    const layout = useLayoutStore();
    layout.changeLoaderValue(true);
    productUnitCreateRequest({
      name: state.unitName,
      shortName: state.shortName,
    })
      .then((response) => {
        layout.changeLoaderValue(false);
        Toast.fire({
          icon: "success",
          title: "Record created successfully!",
        });
        state.isLoading = false;
        navigateTo("/settings/products/units");
      })
      .catch((error) => {
        layout.changeLoaderValue(false);
        Toast.fire({ icon: "error", title: t("something went wrong!") });
        state.isLoading = false;
      });
  }
};
useHead({
  title: title,
});
</script>

<template>
  <div>
    <page-header :title="title" :items="items" />
    <form @submit.prevent="createUnitHandler">
      <div class="row">
        <div class="col-lg-8">
          <div class="card">
            <div class="card-header d-flex align-items-center">
              <h3 class="card-title me-2">{{ $t("Create Unit Details") }}</h3>
              <elements-tooltip />
            </div>
            <div class="card-body">
              <div class="row">
                <div class="col-lg-6">
                  <div class="form-group">
                    <elements-input
                      v-model="state.unitName"
                      :label="$t('Unit Name')"
                      :required="true"
                      :disabled="state.isLoading"
                      id="unit-name"
                      :class="{ 'is-invalid': v$.unitName.$error }"
                    />
                    <div v-if="v$.unitName.$error" class="invalid-feedback">
                      <span class="text-danger" v-if="v$.unitName.required">{{
                        $t("This value is required")
                      }}</span
                      ><br />
                    </div>
                  </div>
                </div>

                <div class="col-lg-6">
                  <div class="form-group">
                    <elements-input
                      v-model="state.shortName"
                      :label="$t('Short Name')"
                      :required="true"
                      :disabled="state.isLoading"
                      id="short-name"
                      :class="{ 'is-invalid': v$.shortName.$error }"
                    />
                    <div v-if="v$.shortName.$error" class="invalid-feedback">
                      <span class="text-danger" v-if="v$.shortName.required">{{
                        $t("This value is required")
                      }}</span
                      ><br />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="mt-3 d-flex align-items-center justify-content-end">
            <button
              class="primary-btn me-3"
              @click="navigateTo('/settings/products/units')"
            >
              <elements-icon v-bind:icon="'cancelIcon'" class="me-2" />
              <span>{{ $t("Cancel") }}</span>
            </button>
            <submittal-button
              :isLoading="state.isLoading"
              :iconName="'saveIcon'"
              :buttonName="$t('Save and Proceed')"
            />
          </div>
        </div>
      </div>
    </form>
  </div>
</template>
