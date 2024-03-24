<script setup lang="ts">
import commonCode from "~/composables/common";
import { reactive } from "vue";
import { useVuelidate } from "@vuelidate/core";
import { required } from "@vuelidate/validators";
import genericFunctionality from "~/composables/genericFunctionality";
import { routes } from "~/utils/apiRoutes";
import { useLayoutStore } from "~/store/layout";
import {
  useTranslatedBreadCrumbs,
  useTitle,
} from "~/composables/useTranslated";

const { router, Toast } = commonCode(),
  { submitted, isLoading, apiRoute, updateFunc, showFunc } =
    genericFunctionality(),
  { t } = useI18n(),
  softwareId = router.params.id,
  state = reactive({
    isLoading: false,
    submitted: false,
    softwareName: "",
  }),
  breadCrumbsConfig = [
    {
      text: t("Global Settings"),
      to: "/",
    },
    {
      text: t("Products"),
      to: "/",
    },
    {
      text: "Software",
      to: "/settings/products/software",
    },
    {
      text: "Edit",
      active: true,
    },
  ],
  { title } = useTitle("Edit Software"),
  { items } = useTranslatedBreadCrumbs(breadCrumbsConfig),
  validationRules = {
    softwareName: { required },
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
        name: state.softwareName,
      };
      apiRoute.value = routes.PRODUCT_SOFTWARE;
      updateFunc(payload, softwareId, "/settings/products/software");
    }
  },
  refresh = async () => {
    const layout = useLayoutStore();
    layout.changeLoaderValue(true);
    let response = await showFunc(softwareId);
    if (!!response?.success) {
      state.softwareName = response?.data?.name;
    }
    layout.changeLoaderValue(false);
  };
// define api url of this crud that's we define in apiRoutes file.
apiRoute.value = routes.PRODUCT_SOFTWARE;

refresh();

useHead({
  title: title,
});
</script>

<template>
  <div>
    <page-header :title="title" :items="items" />
    <form @submit.prevent="update">
      <div class="row">
        <div class="col-lg-6">
          <div class="card">
            <div class="card-header">
              <h3 class="card-title">{{ $t("Edit Software Details") }}</h3>
            </div>
            <div class="card-body">
              <div class="row">
                <div class="col-lg-12">
                  <div class="form-group">
                    <elements-input
                      v-model="state.softwareName"
                      :label="$t('Software Name')"
                      :required="true"
                      :disabled="state.submitted"
                      id="group-name"
                      :class="{ 'is-invalid': v$.softwareName.$error }"
                    />
                    <div v-if="v$.softwareName.$error" class="invalid-feedback">
                      <span
                        class="text-danger"
                        v-if="v$.softwareName.required"
                        >{{ $t("This value is required") }}</span
                      ><br />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="mt-3 d-flex align-items-center justify-content-end">
            <button
              class="primary-btn me-3"
              @click="navigateTo('/settings/products/software')"
            >
              <elements-icon v-bind:icon="'cancelIcon'" class="me-2" />
              <span>{{ $t("Cancel") }}</span>
            </button>
            <submittal-button
              :isLoading="state.submitted"
              :iconName="'updateIcon'"
              :buttonName="$t('Update')"
            />
          </div>
        </div>
      </div>
    </form>
  </div>
</template>
