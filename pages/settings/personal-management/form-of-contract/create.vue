<script setup lang="ts">
import { ref, reactive } from "vue";
import { formOfContractCreateRequest } from "~/utils/apiRequests";
import commonCode from "~/composables/common";
import { useVuelidate } from "@vuelidate/core";
import { required } from "@vuelidate/validators";
import { useLayoutStore } from "~/store/layout";

import {
  useTranslatedBreadCrumbs,
  useTitle,
} from "~/composables/useTranslated";

const { router, Toast } = commonCode(),
  { t } = useI18n(),
  state = reactive({
    isLoading: false,
    submitted: false,
    contractName: "",
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
      text: "Form Of Contract",
      to: "/settings/personal-management/form-of-contract",
    },
    {
      text: "Create",
      active: true,
    },
  ],
  { title } = useTitle("Create Form Of Contract"),
  { items } = useTranslatedBreadCrumbs(breadCrumbsConfig),
  validationRules = {
    contractName: { required },
  },
  v$ = useVuelidate(validationRules, state);

const store = () => {
  state.submitted = true;
  //stop here if form is invalid
  v$.value.$touch();
  if (v$.value.$invalid) {
    state.submitted = false;
    return false;
  } else {
    try {
      const layout = useLayoutStore();
      layout.changeLoaderValue(true);
      state.isLoading = true;
      const { contractName } = state;
      formOfContractCreateRequest({ name: contractName })
        .then((response) => {
          Toast.fire({
            icon: "success",
            title: t("Record created successfully!"),
          });
          layout.changeLoaderValue(false);
          state.isLoading = false;
          state.submitted = false;
          navigateTo("/settings/personal-management/form-of-contract");
        })
        .catch((error) => {
          layout.changeLoaderValue(false);
          state.isLoading = false;
          state.submitted = false;
          Toast.fire({ icon: "error", title: t("something went wrong!") });
        });
    } catch (e) {
      const layout = useLayoutStore();
      layout.changeLoaderValue(false);
      Toast.fire({ title: t("Error!"), text: t("Error"), icon: "error" });
      state.isLoading = false;
      state.submitted = false;
    }
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
            <div class="card h-auto">
              <div class="card-header d-flex align-items-center">
                <h3 class="card-title me-2">
                  {{ $t("Fill Form Of Contract Details") }}
                </h3>
                <ElementsTooltip />
              </div>
              <div class="card-body">
                <div class="row">
                  <div class="col-lg-12 col-md-12 col-sm-12">
                    <div class="form-group">
                      <elements-input
                        v-model="state.contractName"
                        :label="$t('Name')"
                        :required="true"
                        id="name"
                        :disabled="state.submitted"
                        :class="{ 'is-invalid': v$.contractName.$error }"
                      />
                    </div>
                    <div v-if="v$.contractName.$error" class="invalid-feedback">
                      <span
                        class="text-danger"
                        v-if="v$.contractName.required"
                        >{{ $t("This value is required") }}</span
                      ><br />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="d-flex align-items-center justify-content-end mt-3">
              <button
                class="primary-btn me-3"
                @click="
                  navigateTo('/settings/personal-management/form-of-contract')
                "
              >
                <ElementsIcon v-bind:icon="'cancelIcon'" />
                {{ $t("Cancel") }}
              </button>
              <submittal-button
                :isLoading="state.submitted"
                :icon-name="'saveIcon'"
                :buttonName="$t('Save and Proceed')"
              />
            </div>
          </div>
        </div>
      </div>
    </form>
  </div>
</template>
