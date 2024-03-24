<script setup lang="ts">
import { reactive, ref } from "vue";
import commonCode from "~/composables/common";
import { useVuelidate } from "@vuelidate/core";
import { required } from "@vuelidate/validators";
import { routes } from "~/utils/apiRoutes";
import genericFunctionality from "~/composables/genericFunctionality";
import genericFeatures from "~/composables/generic";

import {
  useTranslatedBreadCrumbs,
  useTitle,
} from "~/composables/useTranslated";

const { router, Toast } = commonCode(),
  { showGenericListing } = genericFeatures(),
  { submitted, isLoading, apiRoute, storeFunc } = genericFunctionality(),
  { t } = useI18n(),
  softwares = ref([]),
  state = reactive({
    softwareId: "",
    versionName: "",
    type: "",
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
      text: "Software version",
      to: "/settings/products/version",
    },
    {
      text: "Create",
      active: true,
    },
  ],
  options = [
    {
      value: "LTS",
      text: "LTS (Long Term Support)",
    },
    {
      value: "FR",
      text: "FR (Feature Release)",
    },
    {
      value: "HF",
      text: "HF (Hot Fix)",
    },
    {
      value: "MR",
      text: "MR (Master Release)",
    },
  ],
  { title } = useTitle("Create Version"),
  { items } = useTranslatedBreadCrumbs(breadCrumbsConfig),

  validationRules = {
    softwareId: { required },
    versionName: { required },
    type: { required },
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
      apiRoute.value = routes.PRODUCT_VERSION;
      const payload = {
        name: state.versionName,
        type: state.type,
        productSoftwareId: state.softwareId,
      };
      storeFunc(payload, "/settings/products/version");
    }
  },
  refresh = async () => {
    let softwareListing = await showGenericListing(routes.PRODUCT_SOFTWARE);
    if (!!softwareListing.data.productSoftware) {
      softwares.value = softwareListing.data.productSoftware.map((ts: any) => {
        return { value: ts.id, label: ts.name };
      });
    }
  };
refresh();
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
          <div class="col-lg-12">
            <div class="card">
              <div class="card-header d-flex align-items-center">
                <h3 class="card-title me-2">
                  {{ $t("Fill Software Version Details") }}
                </h3>
                <elements-tooltip />
              </div>
              <div class="card-body">
                <div class="row">
                  <div class="col-lg-4 col-md-6 col-sm-12">
                    <div class="form-group">
                      <elements-input
                        v-model="state.versionName"
                        :label="$t('Name')"
                        :required="true"
                        id="group-name"
                        :disabled="submitted"
                        :class="{ 'is-invalid': v$.versionName.$error }"
                      />
                      <div
                        v-if="v$.versionName.$error"
                        class="invalid-feedback"
                      >
                        <span
                          class="text-danger"
                          v-if="v$.versionName.required"
                          >{{ $t("This value is required") }}</span
                        ><br />
                      </div>
                    </div>
                  </div>
                  <div class="col-lg-4 col-md-6 col-sm-12">
                    <div class="form-group">
                      <elements-multiselect
                        :key="options?.length"
                        v-model="state.type"
                        :options="options"
                        label="text"
                        track-by="value"
                        :textLabel="$t('Type')"
                        :required="true"
                      />
                      <div v-if="v$.type.$error" class="invalid-feedback">
                        <span class="text-danger" v-if="v$.type.required">{{
                          $t("This value is required")
                        }}</span
                        ><br />
                      </div>
                    </div>
                  </div>
                  <div class="col-lg-4 col-md-6 col-sm-12">
                    <div class="form-group">
                      <elements-multiselect
                        :key="softwares?.length"
                        v-model="state.softwareId"
                        :options="softwares"
                        label="label"
                        track-by="value"
                        :textLabel="$t('Product Software')"
                        :required="true"
                      />
                      <div v-if="v$.softwareId.$error" class="invalid-feedback">
                        <span
                          class="text-danger"
                          v-if="v$.softwareId.required"
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
            @click="navigateTo('/settings/products/version')"
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
    </form>
  </div>
</template>
