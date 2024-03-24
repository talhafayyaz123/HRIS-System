<script setup lang="ts">
import { reactive } from "vue";
import { createLeadStatusRequest } from "~/utils/apiRequests";
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
      text: "Lead Status",
      to: "/settings/sales/lead-status",
    },
    {
      text: "Create",
      active: true,
    },
  ],
  { title } = useTitle("Create Lead Status"),
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
      apiRoute.value = routes.LEAD_STATUS;
      const payload = {
        name: state.name,
      };
      storeFunc(payload, "/settings/sales/lead-status");
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
                  {{ $t("Fill Lead Status Details") }}
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
                    </div>
                    <div v-if="v$.name.$error" class="invalid-feedback">
                      <span class="text-danger" v-if="v$.name.required">{{
                        $t("This value is required")
                      }}</span
                      ><br />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="mt-3 d-flex align-items-center justify-content-end">
              <button
                class="primary-btn me-3"
                @click="navigateTo('/settings/sales/lead-status')"
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
