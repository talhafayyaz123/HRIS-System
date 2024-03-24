<script setup lang="ts">
import commonCode from "~/composables/common";
import { reactive } from "vue";
import { useVuelidate } from "@vuelidate/core";
import { required } from "@vuelidate/validators";
import { routes } from "~/utils/apiRoutes";
import genericFunctionality from "~/composables/genericFunctionality";
import { useLayoutStore } from "~/store/layout";

import {
  useTranslatedBreadCrumbs,
  useTitle,
} from "~/composables/useTranslated";

const { router, Toast } = commonCode(),
  { submitted, isLoading, apiRoute, updateFunc, showFunc } =
    genericFunctionality(),
  { t } = useI18n(),
  paymentPeriodId = router.params.id,
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
      text: "Edit",
      active: true,
    },
  ],
  { title } = useTitle("Edit Payment Period"),
  { items } = useTranslatedBreadCrumbs(breadCrumbsConfig),
  validationRules = {
    paymentName: { required },
    billingCycle: { required },
  },
  v$ = useVuelidate(validationRules, state),
  update = () => {
    submitted.value = true;
    //stop here if form is invalid
    v$.value.$touch();
    if (v$.value.$invalid) {
      submitted.value = false;
      return false;
    } else {
      const payload = {
        name: state.paymentName,
        billingCycle: state.billingCycle,
      };
      apiRoute.value = routes.PRODUCT_PAYMENT_PERIOD;
      updateFunc(payload, paymentPeriodId, "/settings/products/payment-period");
    }
  },
  refresh = async () => {
    const layout = useLayoutStore();
    layout.changeLoaderValue(true);
    let response = await showFunc(paymentPeriodId);
    if (!!response?.success) {
      state.paymentName = response.data?.name;
      state.billingCycle = response.data?.billingCycle;
    }
    layout.changeLoaderValue(false);
  };
// define api url of this crud that's we define in apiRoutes file.
apiRoute.value = routes.PRODUCT_PAYMENT_PERIOD;

refresh();

useHead({
  title: title,
});
</script>

<template>
  <div>
    <page-header :title="title" :items="items" />
    <form @submit.prevent="update">
      <div class="">
        <div class="row">
          <div class="col-lg-12">
            <div class="card">
              <div class="card-header">
                <h3 class="card-title">
                  {{ $t("Edit Product Group Details") }}
                </h3>
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
                      <div
                        v-if="v$.paymentName.$error"
                        class="invalid-feedback"
                      >
                        <span
                          class="text-danger"
                          v-if="v$.paymentName.required"
                          >{{ $t("This value is required") }}</span
                        ><br />
                      </div>
                    </div>
                  </div>
                  <div class="col-lg-6 col-md-6 col-sm-12">
                    <div class="form-group">
                      <elements-input
                        type="number"
                        v-model="state.billingCycle"
                        :label="$t('Billing Cycle (Days)')"
                        :required="true"
                        id="group-name"
                        :disabled="submitted"
                        :class="{ 'is-invalid': v$.billingCycle.$error }"
                      />
                      <div
                        v-if="v$.billingCycle.$error"
                        class="invalid-feedback"
                      >
                        <span
                          class="text-danger"
                          v-if="v$.billingCycle.required"
                          >{{ $t("This value is required") }}</span
                        ><br />
                      </div>
                    </div>
                  </div>
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
            :iconName="'updateIcon'"
            :buttonName="$t('Update')"
          />
        </div>
      </div>
    </form>
  </div>
</template>
