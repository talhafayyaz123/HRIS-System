<script setup lang="ts">
import { reactive } from "vue";
import { affectedGroupCreateRequest } from "~/utils/apiRequests";
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
    name: "",
  }),
  breadCrumbsConfig = [
    {
      text: "Global Settings",
      to: "/",
    },
    {
      text: "Global Settings",
      to: "/",
    },
    {
      text: "Affected Groups",
      to: "/settings/global-settings/affected-groups",
    },
    {
      text: "Create",
      active: true,
    },
  ],
  { title } = useTitle("Create Affected Groups"),
  { items } = useTranslatedBreadCrumbs(breadCrumbsConfig),
  validationRules = {
    name: { required },
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
      const { name } = state;
      affectedGroupCreateRequest({ name: name })
        .then((response) => {
          layout.changeLoaderValue(false);
          Toast.fire({
            icon: "success",
            title: t("Record created successfully!"),
          });

          state.isLoading = false;
          state.submitted = false;
          navigateTo("/settings/global-settings/affected-groups");
        })
        .catch((error) => {
          layout.changeLoaderValue(false);
          state.isLoading = false;
          state.submitted = false;
          Toast.fire({ icon: "error", title: t("something went wrong!") });
        });
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
            <div class="card">
              <div class="card-header d-flex align-items-center">
                <h3 class="card-title me-2">
                  {{ $t("Fill Affected Groups Details") }}
                </h3>
                <elements-tooltip />
              </div>
              <div class="card-body">
                <div class="row">
                  <div class="col-lg-12 col-md-12 col-sm-12">
                    <div class="form-group mb-0">
                      <elements-input
                        v-model="state.name"
                        :label="$t('Name')"
                        :required="true"
                        id="name"
                        :disabled="state.submitted"
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
                @click="navigateTo('/settings/global-settings/affected-groups')"
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
      </div>
    </form>
  </div>
</template>
