<script setup lang="ts">
import { reactive } from "vue";
import { operatingSystemCreateRequest } from "~/utils/apiRequests";

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
  osId = router.params.id,
  breadCrumbsConfig = [
    {
      text: "Global Settings",
      to: "/",
    },
    {
      text: "System",
      to: "/",
    },
    {
      text: "Operating System",
      to: "/settings/system/operating-system",
    },
    {
      text: "create",
      active: true,
    },
  ],
  { title } = useTitle("Create Operating System"),
  { items } = useTranslatedBreadCrumbs(breadCrumbsConfig);

const state = reactive({
  name: "",
  isLoading: false,
});

const validationRules = {
    name: { required },
  },
  v$ = useVuelidate(validationRules, state);

const createHandler = () => {
  v$.value.$touch();
  if (v$.value.$invalid) {
    return false;
  } else {
    const layout = useLayoutStore();
    layout.changeLoaderValue(true);
    operatingSystemCreateRequest({ name: state.name })
      .then((response) => {
        layout.changeLoaderValue(false);
        Toast.fire({
          icon: "success",
          title: "Operating sysytem added successfully!",
        });
        state.isLoading = false;
        navigateTo("/settings/system/operating-system");
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
    <form @submit.prevent="createHandler">
      <div class="row">
        <div class="col-lg-6">
          <div class="card">
            <div class="card-header d-flex align-items-center">
              <h3 class="card-title me-2">
                {{ $t("Fill Operating System Details") }}
              </h3>
              <elements-tooltip />
            </div>
            <div class="card-body">
              <div class="row">
                <div class="col-lg-12">
                  <div class="form-group">
                    <elements-input
                      v-model="state.name"
                      :label="$t('Name')"
                      :required="true"
                      :disabled="state.isLoading"
                      id="name"
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
              @click="navigateTo('/settings/system/operating-system')"
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
