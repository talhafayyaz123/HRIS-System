<script setup lang="ts">
import { ref, reactive } from "vue";
import { createReportCategoryRequest } from "~/utils/apiRequests";
import commonCode from "~/composables/common";
import { useVuelidate } from "@vuelidate/core";
import { required } from "@vuelidate/validators";
import genericFunctionality from "~/composables/genericFunctionality";
import { routes } from "~/utils/apiRoutes";

import {
  useTranslatedBreadCrumbs,
  useTitle,
} from "~/composables/useTranslated";

const { submitted, isLoading, apiRoute, storeFunc } = genericFunctionality(),
  { router, Toast } = commonCode(),
  { t } = useI18n(),
  state = reactive({
    name: "",
  }),
  breadCrumbsConfig = [
    {
      text: "Global Settings",
      to: "/",
    },
    {
      text: "Sales",
      to: "/",
    },
    {
      text: "Report Categories",
      to: "/settings/sales/report-categories",
    },
    {
      text: "Create",
      active: true,
    },
  ],
  { title } = useTitle("Create Report Categories"),
  { items } = useTranslatedBreadCrumbs(breadCrumbsConfig),
  validationRules = {
    name: { required },
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
      apiRoute.value = routes.REPORT_CATEGORY;
      const payload = {
        name: state.name,
      };
      storeFunc(payload, "/settings/sales/report-categories");
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
      <div class="">
        <div class="row">
          <div class="col-lg-6">
            <div class="card">
              <div class="card-header d-flex align-items-center">
                <h3 class="card-title me-2">
                  {{ $t("Fill Report Category Details") }}
                </h3>
                <elements-tooltip />
              </div>
              <div class="card-body">
                <div class="row">
                  <div class="col-lg-12 col-md-12 col-sm-12">
                    <div class="form-group">
                      <elements-input
                        v-model="state.name"
                        :label="$t('Name')"
                        :required="true"
                        id="name"
                        :disabled="submitted"
                        :class="{ 'is-invalid': v$.name.$error }"
                      />
                      <div v-if="v$.name.$error" class="invalid-feedback">
                        <span class="text-danger" v-if="v$.name.required">{{
                          $t("This value is required")
                        }}</span
                        >
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="mt-3 d-flex align-items-center justify-content-end">
              <button
                class="primary-btn me-3"
                @click="navigateTo('/settings/sales/report-categories')"
              >
                <elements-icon v-bind:icon="'cancelIcon'" class="me-2" />
                <span>{{ $t("Cancel") }}</span>
              </button>
              <submittal-button
                :isLoading="submitted"
                :iconName="'saveIcon'"
                :buttonName="$t('Save and Proceed')"
              />
            </div>
          </div>
        </div>
      </div>
    </form>
  </div>
</template>
