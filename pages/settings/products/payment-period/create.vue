<script setup lang="ts">
import { reactive } from "vue";
import commonCode from "~/composables/common";
import { useVuelidate } from "@vuelidate/core";
import { required } from "@vuelidate/validators";
import { routes } from "~/utils/apiRoutes";
import genericFunctionality from "~/composables/genericFunctionality";

import {
  useTranslatedBreadCrumbs,
  useTitle,
} from "~/composables/useTranslated";

const { router, Toast } = commonCode(),
  { submitted, isLoading, apiRoute, storeFunc } = genericFunctionality(),
  { t } = useI18n(),
  state = reactive({
    paymentName: "",
    billingCycle: "",
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
      text: "Payment Period",
      to: "/settings/products/payment-period",
    },
    {
      text: "Create",
      active: true,
    },
  ],
  { title } = useTitle("Payment Period"),
  { items } = useTranslatedBreadCrumbs(breadCrumbsConfig),
  validationRules = {
    paymentName: { required },
    billingCycle: { required },
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
      apiRoute.value = routes.PRODUCT_PAYMENT_PERIOD;
      const payload = {
        name: state.paymentName,
        billingCycle: state.billingCycle,
      };
      storeFunc(payload, "/settings/products/payment-period");
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
        <div class="col-md-8">
          <div class="card">
            <div class="card-header d-flex align-items-center">
              <h3 class="card-title me-2">
                {{ $t("Fill Payment Period Details") }}
              </h3>
              <elements-tooltip />
            </div>
            <div class="card-body">
              <div class="row">
                <div class="col-lg-6 col-md-6 col-sm-12">
                  <div class="form-group">
                    <elements-input
                      v-model="state.paymentName"
                      :label="$t('Name')"
                      :required="true"
                      id="group-name"
                      :disabled="submitted"
                      :class="{ 'is-invalid': v$.paymentName.$error }"
                    />
                  </div>
                  <div v-if="v$.paymentName.$error" class="invalid-feedback">
                    <span class="text-danger" v-if="v$.paymentName.required">{{
                      $t("This value is required")
                    }}</span
                    ><br />
                  </div>
                </div>
                <div class="col-lg-6 col-md-6 col-sm-12">
                  <div class="form-group">
                    <elements-input
                      type="number"
                      v-model="state.billingCycle"
                      :label="$t('Billing Cycle (Days)')"
                      id="group-name"
                      :disabled="submitted"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="mt-3 d-flex align-items-center justify-content-end">
            <button
              class="primary-btn me-3"
              @click="navigateTo('/settings/products/payment-period')"
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
    </form>
  </div>
</template>
