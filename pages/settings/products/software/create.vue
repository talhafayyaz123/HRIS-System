<script setup lang="ts">
import { reactive } from "vue";
import commonCode from "~/composables/common";
import { useVuelidate } from "@vuelidate/core";
import { required } from "@vuelidate/validators";
import genericFunctionality from "~/composables/genericFunctionality";
import { routes } from "~/utils/apiRoutes";
import {
  useTranslatedBreadCrumbs,
  useTitle,
} from "~/composables/useTranslated";

const { router, Toast } = commonCode(),
  { submitted, isLoading, apiRoute, storeFunc } = genericFunctionality(),
  { t } = useI18n(),
  state = reactive({
    softwareName: "",
  }),
  breadCrumbsConfig = [
    {
      text: "Global Settings",
      to: "/",
    },
    {
      text: "Products",
      to: "/",
    },
    {
      text: "Software",
      to: "/settings/products/software",
    },
    {
      text: "Create",
      active: true,
    },
  ],
  { title } = useTitle("Product software create"),
  { items } = useTranslatedBreadCrumbs(breadCrumbsConfig),
  validationRules = {
    softwareName: { required },
  },
  v$ = useVuelidate(validationRules, state),
  store = () => {
    submitted.value = true;
    //stop here if form is invalid
    v$.value.$touch();
    if (v$.value.$invalid) {
      submitted.value = false;
      return false;
    } else {
      apiRoute.value = routes.PRODUCT_SOFTWARE;
      const payload = {
        name: state.softwareName,
      };
      storeFunc(payload, "/settings/products/software");
    }
  };

useHead({
  title: title,
});
</script>

<template>
  <div>
    <page-header :title="title" :items="items" />
    <form @submit.prevent="store">
      <div class="row">
        <div class="col-lg-6">
          <div class="card">
            <div class="card-header d-flex align-items-center">
              <h3 class="card-title me-2">{{ $t("Fill Software Details") }}</h3>
              <elements-tooltip />
            </div>
            <div class="card-body">
              <div class="row">
                <div class="col-lg-12 col-md-12 col-sm-12">
                  <div class="form-group">
                    <elements-input
                      v-model="state.softwareName"
                      :label="$t('Name')"
                      :required="true"
                      id="group-name"
                      :disabled="state.submitted"
                      :class="{ 'is-invalid': v$.softwareName.$error }"
                    />
                  </div>
                  <div v-if="v$.softwareName.$error" class="invalid-feedback">
                    <span class="text-danger" v-if="v$.softwareName.required">{{
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
              @click="navigateTo('/settings/products/software')"
            >
              <elements-icon v-bind:icon="'cancelIcon'" class="me-2" />
              <span>{{ $t("Cancel") }}</span>
            </button>
            <submittal-button
              :isLoading="state.submitted"
              :iconName="'saveIcon'"
              :buttonName="$t('Save and Proceed')"
            />
          </div>
        </div>
      </div>
    </form>
  </div>
</template>
