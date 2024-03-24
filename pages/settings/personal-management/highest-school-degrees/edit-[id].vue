<script setup lang="ts">
import commonCode from "~/composables/common";
import { reactive } from "vue";
import { useVuelidate } from "@vuelidate/core";
import { required } from "@vuelidate/validators";
import { routes } from "~/utils/apiRoutes";
import genericFunctionality from "~/composables/genericFunctionality";

import {
  useTranslatedBreadCrumbs,
  useTitle,
} from "~/composables/useTranslated";

const { router, Toast } = commonCode(),
  { submitted, isLoading, apiRoute, updateFunc, showFunc } =
    genericFunctionality(),
  { t } = useI18n(),
  degreeId = router.params.id,
  state = reactive({
    degree: "",
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
      text: "Highest School Degree",
      to: "/settings/personal-management/highest-school-degrees",
    },
    {
      text: "Edit",
      active: true,
    },
  ],
  { title } = useTitle("Edit Highest School Degree"),
  { items } = useTranslatedBreadCrumbs(breadCrumbsConfig),
  validationRules = {
    degree: { required },
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
        name: state.degree,
      };
      apiRoute.value = routes.DEGREE_DEGREE;
      updateFunc(
        payload,
        degreeId,
        "/settings/personal-management/highest-school-degrees"
      );
    }
  },
  refresh = async () => {
    let response = await showFunc(degreeId);
    if (!!response?.success) {
      state.degree = response.data?.name;
    }
  };
// define api url of this crud that's we define in apiRoutes file.
apiRoute.value = routes.DEGREE_DEGREE;

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
                  {{ $t("Edit Highest School Degree Details") }}
                </h3>
              </div>
              <div class="card-body">
                <div class="row">
                  <div class="col-lg-12">
                    <div class="form-group">
                      <elements-input
                        v-model="state.degree"
                        :label="$t('Name')"
                        :required="true"
                        :disabled="state.submitted"
                        id="name"
                        :class="{ 'is-invalid': v$.degree.$error }"
                      />
                      <div v-if="v$.degree.$error" class="invalid-feedback">
                        <span class="text-danger" v-if="v$.degree.required">{{
                          $t("This value is required")
                        }}</span
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
            @click="
              navigateTo('/settings/personal-management/highest-school-degrees')
            "
          >
            <ElementsIcon v-bind:icon="'cancelIcon'" />
            {{ $t("Cancel") }}
          </button>
          <submittal-button
            :isLoading="state.submitted"
            :iconName="'updateIcon'"
            :buttonName="$t('Update')"
          />
        </div>
      </div>
    </form>
  </div>
</template>
