<script setup lang="ts">
import { ref, reactive } from "vue";
import {
  operatingSystemUpdateRequest,
  operatingSystemShowRequest,
} from "~/utils/apiRequests";
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
      text: "Edit",
      active: true,
    },
  ],

    { title } = useTitle("Edit Operating System"),
  { items } = useTranslatedBreadCrumbs(breadCrumbsConfig);

const state = reactive({
  name: "",
  isLoading: false,
});

const validationRules = {
    name: { required },
  },
  v$ = useVuelidate(validationRules, state);

const updateHandler = () => {
  v$.value.$touch();
  if (v$.value.$invalid) {
    return false;
  } else {
    const layout = useLayoutStore();
    layout.changeLoaderValue(true);
    operatingSystemUpdateRequest({ name: state.name }, osId)
      .then((response) => {
        layout.changeLoaderValue(false);
        Toast.fire({
          icon: "success",
          title: t("Record updated successfully!"),
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

function refresh() {
  const layout = useLayoutStore();
  layout.changeLoaderValue(true);
  operatingSystemShowRequest(osId).then((response) => {
    layout.changeLoaderValue(false);
    state.name = response.data?.name;
  }).catch((error) => {
      layout.changeLoaderValue(false);
    });
}
refresh();

useHead({
  title: title,
});
</script>

<template>
<div>
  <page-header :title="title" :items="items" />
  <form @submit.prevent="updateHandler">
    <div class="row">
      <div class="col-lg-6">
        <div class="card">
          <div class="card-header">
            <h3 class="card-title">
              {{ $t("Edit Operating System Details") }}
            </h3>
          </div>
          <div class="card-body">
            <div class="row">
              <div class="col-lg-6">
                <div class="form-group">
                  <elements-input
                    v-model="state.name"
                    :label="$t('Name')"
                    :required="true"
                    :disabled="state.isLoading"
                    id="name"
                    :class="{ 'is-invalid': v$.name.$error }"
                  />
                  <div v-if="v$.name.$error" class="invalid-feedback">
                    <span class="text-danger" v-if="v$.name.required">{{
                      $t("This value is required")
                    }}</span
                    ><br />
                  </div>
                </div>
              </div>
            </div>
            <div class="mt-3 d-flex align-items-center justify-content-end">
        <button class="primary-btn me-3"  @click="navigateTo('/settings/system/operating-system')">
                                <elements-icon v-bind:icon="'cancelIcon'" class="me-2"/>
                                <span>{{ $t("Cancel") }}</span>
                            </button>
          <submittal-button
            :isLoading="state.isLoading"
            :iconName="'updateIcon'" :buttonName="$t('Update')"
          />
      </div>
          </div>
        </div>
      </div>
    </div>
  </form>
  </div>
</template>
