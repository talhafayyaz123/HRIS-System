<script setup lang="ts">
import { ref, reactive } from "vue";
import commonCode from "~/composables/common";
import { useVuelidate } from "@vuelidate/core";
import { required } from "@vuelidate/validators";
import genericFunctionality from "~/composables/genericFunctionality";
import { routes } from "~/utils/apiRoutes";
import { useLayoutStore } from "~/store/layout";
import genericFeatures from "~/composables/generic";
import { useTranslatedColumns, useTranslatedBreadCrumbs, useTitle } from "~/composables/useTranslated";


const { router, Toast } = commonCode(),
  { showGenericListing } = genericFeatures(),
  { submitted, isLoading, apiRoute, storeFunc } = genericFunctionality(),
  { t } = useI18n(),
  customers = ref([]),
  state = reactive({
    customerId: "",
    serviceHoursYear: "0.00",
    remainingHours: "0.00",
    hourlyRate: "0.00",
    monthlyAmount: "0.00",
  }),
  breadCrumbsConfig = [
    {
      text: "Admin portal",
      to: "/",
    },
    {
      text: t("Support"),
      to: "/",
    },
    {
      text: "Application Management Services",
      active: true,
    },
    {
      text: "Create",
      active: true,
    },
  ],
  validationRules = {
    customerId: { required },
    serviceHoursYear: { required },
    remainingHours: { required },
    hourlyRate: { required },
    monthlyAmount: { required },
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
      apiRoute.value = routes.SUPPORT_AMS;
      storeFunc(state, "/support/ams");
    }
  },
  refresh = async () => {
    const layout = useLayoutStore();
    layout.changeLoaderValue(true);
    let customersListing = await showGenericListing(routes.COMPANY);
    if (!!customersListing?.data?.customers) {
      customers.value = customersListing.data.customers.map((ts: any) => {
        return { value: ts.id, name: ts.name };
      });
    }
    layout.changeLoaderValue(false);
  };
const { items } = useTranslatedBreadCrumbs(breadCrumbsConfig),
    { title } = useTitle("Application Management Services");

useHead({
    title: title,
    });
refresh();
</script>

<template>
  <div>
    <page-header :title="title" :items="items" />
    <form @submit.prevent="store">
      <div class="card">
        <div class="card-header">
          <h3 class="card-title">{{ $t("Fill Project Protocols Details") }}</h3>
        </div>
        <div class="card-body">
          <div class="row">
            <div class="col-lg-4">
              <div class="form-group">
                <elements-multiselect
                  v-model="state.customerId"
                  :options="customers"
                  label="name"
                  :class="v$.customerId.$error ? 'is-invalid' : ''"
                  track-by="value"
                  :textLabel="$t('Customer')"
                  :required="true"
                />
              </div>
              <div v-if="v$.customerId.$error" class="invalid-feedback">
                <span class="text-danger" v-if="v$.customerId.required">{{
                  $t("This value is required")
                }}</span
                ><br />
              </div>
            </div>
            <div class="col-lg-4">
              <div class="form-group">
                <elements-input
                  v-model="state.serviceHoursYear"
                  :label="$t('Service Hours Year')"
                  :required="true"
                  :disabled="submitted"
                  :class="{ 'is-invalid': v$.serviceHoursYear.$error }"
                  type="number"
                />
              </div>
              <div v-if="v$.serviceHoursYear.$error" class="invalid-feedback">
                <span class="text-danger" v-if="v$.serviceHoursYear.required">{{
                  $t("This value is required")
                }}</span
                ><br />
              </div>
            </div>
            <div class="col-lg-4">
              <div class="form-group">
                <elements-input
                  v-model="state.remainingHours"
                  :label="$t('Remaining Hours')"
                  :required="true"
                  :disabled="submitted"
                  :class="{ 'is-invalid': v$.remainingHours.$error }"
                  type="number"
                />
              </div>
              <div v-if="v$.remainingHours.$error" class="invalid-feedback">
                <span class="text-danger" v-if="v$.remainingHours.required">{{
                  $t("This value is required")
                }}</span
                ><br />
              </div>
            </div>
            <div class="col-lg-4">
              <div class="form-group">
                <elements-input
                  v-model="state.hourlyRate"
                  :label="$t('Hourly Rate')"
                  :required="true"
                  :disabled="submitted"
                  :class="{ 'is-invalid': v$.hourlyRate.$error }"
                  type="number"
                />
              </div>
              <div v-if="v$.hourlyRate.$error" class="invalid-feedback">
                <span class="text-danger" v-if="v$.hourlyRate.required">{{
                  $t("This value is required")
                }}</span
                ><br />
              </div>
            </div>
            <div class="col-lg-4">
              <div class="form-group">
                <div class="form-group">
                  <elements-input
                    v-model="state.monthlyAmount"
                    :label="$t('Monthly Amount')"
                    :required="true"
                    id="group-name"
                    :disabled="submitted"
                    :class="{ 'is-invalid': v$.monthlyAmount.$error }"
                    type="number"
                  />
                </div>
              </div>
              <div v-if="v$.monthlyAmount.$error" class="invalid-feedback">
                <span class="text-danger" v-if="v$.monthlyAmount.required">{{
                  $t("This value is required")
                }}</span
                ><br />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="mt-3 d-flex align-items-center justify-content-end">
        <submittal-button
          :isLoading="submitted"
          :iconName="'saveIcon'"
          :buttonName="$t('Save and Proceed')"
        />
      </div>
    </form>
  </div>
</template>
