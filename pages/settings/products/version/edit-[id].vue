<script setup lang="ts">
import commonCode from "~/composables/common";
import { reactive, ref } from "vue";
import { useVuelidate } from "@vuelidate/core";
import { required } from "@vuelidate/validators";
import genericFeatures from "~/composables/generic";
import genericFunctionality from "~/composables/genericFunctionality";
import { routes } from "~/utils/apiRoutes";
import { useLayoutStore } from "~/store/layout";

import {
  useTranslatedBreadCrumbs,
  useTitle,
} from "~/composables/useTranslated";

const { showGenericListing } = genericFeatures(),
  { submitted, isLoading, apiRoute, updateFunc, showFunc } =
    genericFunctionality(),
  { router, Toast } = commonCode(),
  { t } = useI18n(),
  softwares = ref([]),
  versionId = router.params.id,
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
      text: "Edit",
      active: true,
    },
  ],
  options = ref([
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
  ]),

  { title } = useTitle("Edit version"),
  { items } = useTranslatedBreadCrumbs(breadCrumbsConfig),
  validationRules = {
    softwareId: { required },
    versionName: { required },
    type: { required },
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
        name: state.versionName,
        type: state.type,
        productSoftwareId: state.softwareId,
      };
      apiRoute.value = routes.PRODUCT_VERSION;
      updateFunc(payload, versionId, "/settings/products/version");
    }
  },
  refresh = async () => {
    const layout = useLayoutStore();
    layout.changeLoaderValue(true);
    // show software licnces
    let softwareListing = await showGenericListing(routes.PRODUCT_SOFTWARE);
    if (!!softwareListing.data.productSoftware) {
      softwares.value = softwareListing.data.productSoftware.map((ts: any) => {
        return { value: ts.id, label: ts.name };
      });
    }
    //get response by id
    let response = await showFunc(versionId);
    if (!!response?.success) {
      state.versionName = response.data?.name;
      state.type = response.data?.type;
      state.softwareId = response.data?.productSoftware?.id;
    }
    layout.changeLoaderValue(false);
  };
// define api url of this crud that's we define in apiRoutes file.
apiRoute.value = routes.PRODUCT_VERSION;

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
          <div class="col-lg-6">
            <div class="card">
              <div class="card-header">
                <h3 class="card-title">
                  {{ $t("Edit Software Version Details") }}
                </h3>
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
                        :key="state.type"
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
                        :key="state.softwareId"
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
            :iconName="'updateIcon'"
            :buttonName="$t('Update')"
          />
        </div>
      </div>
    </form>
  </div>
</template>
