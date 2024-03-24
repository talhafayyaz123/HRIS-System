<script setup lang="ts">
import commonCode from "~/composables/common";
import { reactive } from "vue";
import { useVuelidate } from "@vuelidate/core";
import { required } from "@vuelidate/validators";
import { routes } from "~/utils/apiRoutes";
import genericFunctionality from "~/composables/genericFunctionality";
import { useLayoutStore } from "~/store/layout";

import {
  useTranslatedBreadCrumbs,
  useTitle,
} from "~/composables/useTranslated";

const { router, Toast } = commonCode(),
  { submitted, isLoading, apiRoute, updateFunc, showFunc } =
    genericFunctionality(),
  { t } = useI18n(),
  leadStatusId = router.params.id,
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
      text: "Lead Status",
      to: "/settings/products/lead-status",
    },
    {
      text: "Edit",
      active: true,
    },
  ],
  { title } = useTitle("Edit Lead Status"),
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
      apiRoute.value = routes.LEAD_STATUS;
      updateFunc(payload, leadStatusId, "/settings/sales/lead-status");
    }
  },
  refresh = async () => {
    const layout = useLayoutStore();
    layout.changeLoaderValue(true);
    let response = await showFunc(leadStatusId);
    if (!!response?.success) {
      state.name = response?.data?.name;
    }
    layout.changeLoaderValue(false);
  };
// define api url of this crud that's we define in apiRoutes file.
apiRoute.value = routes.LEAD_STATUS;

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
                <h3 class="card-title">{{ $t("Edit Lead Status Details") }}</h3>
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
            </div>
            <div class="mt-3 d-flex align-items-center justify-content-end">
              <button
                class="primary-btn me-3"
                @click="navigateTo('/settings/sales/lead-status')"
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
