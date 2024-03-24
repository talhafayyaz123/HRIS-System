<script setup lang="ts">
import { ref, reactive } from "vue";
import {
  productUnitUpdateRequest,
  productUnitShowRequest,
} from "~/utils/apiRequests";
import { useLayoutStore } from "~/store/layout";
import commonCode from "~/composables/common";
import { useVuelidate } from "@vuelidate/core";
import { required } from "@vuelidate/validators";

import {
  useTranslatedBreadCrumbs,
  useTitle,
} from "~/composables/useTranslated";

const { router, Toast } = commonCode(),
  { t } = useI18n(),
  unitId = router.params.id,
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
      text: "Unit",
      to: "/settings/products/units",
    },
    {
      text: "Edit",
      active: true,
    },
  ],
  { title } = useTitle("Edit Unit"),
  { items } = useTranslatedBreadCrumbs(breadCrumbsConfig);

useHead({
  title: title,
});

const state = reactive({
  unitName: "",
  shortName: "",
  isLoading: false,
});

const validationRules = {
    unitName: { required },
    shortName: { required },
  },
  v$ = useVuelidate(validationRules, state);

const updateUnitHnadler = () => {
  v$.value.$touch();
  if (v$.value.$invalid) {
    return false;
  } else {
    state.isLoading = true;
    const layout = useLayoutStore();
    layout.changeLoaderValue(true);
    productUnitUpdateRequest(
      { name: state.unitName, shortName: state.shortName },
      unitId
    )
      .then((response) => {
        layout.changeLoaderValue(false);
        Toast.fire({
          icon: "success",
          title: t("Record updated successfully!"),
        });
        state.isLoading = false;
        navigateTo("/settings/products/units");
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
  productUnitShowRequest(unitId)
    .then((response) => {
      state.unitName = response.data?.name;
      state.shortName = response.data?.shortName;
      layout.changeLoaderValue(false);
    })
    .catch((error) => {
      layout.changeLoaderValue(false);
      console.log(error);
    });
}
refresh();
</script>

<template>
  <page-header :title="title" :items="items" />

  <div class="row">
    <div class="col-lg-12">
      <form @submit.prevent="updateUnitHnadler">
        <div class="card">
          <div class="card-header">
            <h3 class="card-title">{{ $t("Edit Unit Details") }}</h3>
          </div>
          <div class="card-body">
            <div class="row">
              <div class="col-lg-6">
                <div class="form-group">
                  <elements-input
                    v-model="state.unitName"
                    :label="$t('Unit Name')"
                    :required="true"
                    :disabled="state.isLoading"
                    id="unit-name"
                    :class="{ 'is-invalid': v$.unitName.$error }"
                  />
                </div>
                <div v-if="v$.unitName.$error" class="invalid-feedback">
                  <span class="text-danger" v-if="v$.unitName.required">{{
                    $t("This value is required")
                  }}</span
                  ><br />
                </div>
              </div>

              <div class="col-lg-6">
                <div class="form-group">
                  <elements-input
                    v-model="state.shortName"
                    :label="$t('Short Name')"
                    :required="true"
                    :disabled="state.isLoading"
                    id="short-name"
                    :class="{ 'is-invalid': v$.shortName.$error }"
                  />
                </div>
                <div v-if="v$.shortName.$error" class="invalid-feedback">
                  <span class="text-danger" v-if="v$.shortName.required">{{
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
            @click="navigateTo('/settings/products/units')"
          >
            <elements-icon v-bind:icon="'cancelIcon'" class="me-2" />
            <span>{{ $t("Cancel") }}</span>
          </button>
          <submittal-button
            :isLoading="state.isLoading"
            :iconName="'updateIcon'"
            :buttonName="$t('Update')"
          />
        </div>
      </form>
    </div>
  </div>
</template>
