<script setup lang="ts">
import {
  getReportCategoryByIdRequest,
  editReportCategoryRequest,
} from "~/utils/apiRequests";
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
  reportCategoryId = router.params.id,
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
      text: "Report Categories",
      to: "/settings/sales/report-categories",
    },
    {
      text: "Edit",
      active: true,
    },
  ],
  { title } = useTitle("Edit Report Categories"),
  { items } = useTranslatedBreadCrumbs(breadCrumbsConfig),
  validationRules = {
    name: { required },
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
        name: state.name,
      };
      apiRoute.value = routes.REPORT_CATEGORY;
      updateFunc(
        payload,
        reportCategoryId,
        "/settings/sales/report-categories"
      );
    }
  },
  refresh = async () => {
    const layout = useLayoutStore();
    layout.changeLoaderValue(true);
    let response = await showFunc(reportCategoryId);
    if (!!response?.success) {
      state.name = response?.data?.name;
    }
    layout.changeLoaderValue(false);
  };
// define api url of this crud that's we define in apiRoutes file.
apiRoute.value = routes.REPORT_CATEGORY;

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
              <div class="card-header d-flex align-items-center">
                <h3 class="card-title me-2">
                  {{ $t("Edit Report Category Details") }}
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
                        :disabled="submitted"
                        id="group-name"
                        :class="{ 'is-invalid': v$.name.$error }"
                      />
                    </div>
                    <div v-if="v$.name.$error" class="invalid-feedback">
                      <span class="text-danger" v-if="v$.name.required">{{
                        $t("This value is required")
                      }}</span
                      >
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="mt-3 d-flex align-items-center justify-content-end">
              <button
                class="primary-btn me-3"
                @click="navigateTo('/settings/sales/report-categories')"
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
        </div>
      </div>
    </form>
  </div>
</template>
