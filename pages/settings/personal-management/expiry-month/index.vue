<script setup lang="ts">
import { ref, reactive } from "vue";
import {
  expiryMonthCreateRequest,
  expiryMonthRequest,
} from "~/utils/apiRequests";
import commonCode from "~/composables/common";
import { useVuelidate } from "@vuelidate/core";
import { required } from "@vuelidate/validators";

import {
  useTranslatedBreadCrumbs,
  useTitle,
} from "~/composables/useTranslated";

const { router, Toast } = commonCode(),
  { t } = useI18n(),
  state = reactive({
    isLoading: false,
    submitted: false,
    expiryMonth: "",
  }),
  breadCrumbsConfig = [
    {
      text: "Global Settings",
      to: "/",
    },
    {
      text: "Personal Management",
      to: "/",
    },
    {
      text: "Expiry Month",
      active: true,
    },
  ],
  { title } = useTitle("Expiry Month"),
  { items } = useTranslatedBreadCrumbs(breadCrumbsConfig),
  validationRules = {
    expiryMonth: { required },
  },
  v$ = useVuelidate(validationRules, state);
function refresh() {
  expiryMonthRequest().then((response) => {
    console.log(response.data.value);
    state.expiryMonth = response?.data?.value;
  });
}
refresh();
useHead({
  title: title,
});

const store = () => {
  state.submitted = true;
  v$.value.$touch();
  if (v$.value.$invalid) {
    state.submitted = false;
    return false;
  } else {
    try {
      state.isLoading = true;
      expiryMonthCreateRequest({
        expiryMonth: state.expiryMonth,
      })
        .then((response) => {
          Toast.fire({
            icon: "success",
            title: t("Record updated successfully!"),
          });
          state.isLoading = false;
          state.submitted = false;
        })
        .catch((error) => {
          state.isLoading = false;
          state.submitted = false;
          Toast.fire({ icon: "error", title: t("something went wrong!") });
        });
    } catch (e) {
      Toast.fire({ title: t("Error!"), text: t("Error"), icon: "error" });
      state.isLoading = false;
      state.submitted = false;
    }
  }
};
</script>

<template>
  <div>
    <page-header :title="title" :items="items" />
    <form @submit.prevent="store">
      <div class="row">
        <div class="col-lg-6">
          <div class="card h-auto">
            <div class="card-header d-flex align-items-center">
              <h3 class="card-title me-2">{{ $t("Save Expiry Month") }}</h3>
              <elements-tooltip />
            </div>
            <div class="card-body">
              <div class="row">
                <div class="col-lg-12">
                  <div class="form-group">
                    <elements-input
                      v-model="state.expiryMonth"
                      :label="$t('Expiry Month')"
                      :required="true"
                      id="expiry-month"
                      :type="'number'"
                      min="1"
                      max="12"
                      :disabled="state.submitted"
                      :class="{ 'is-invalid': v$.expiryMonth.$error }"
                    />
                  </div>
                  <div v-if="v$.expiryMonth.$error" class="invalid-feedback">
                    <span class="text-danger" v-if="v$.expiryMonth.required">{{
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
              :isLoading="state.submitted"
              :buttonName="$t('Save and Proceed')"
              :iconName="'saveIcon'"
            />
          </div>
        </div>
      </div>
    </form>
  </div>
</template>
