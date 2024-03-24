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

const { submitted, isLoading, apiRoute, updateFunc, showFunc } =
    genericFunctionality(),
  { router, Toast } = commonCode(),
  { t } = useI18n(),
  educationId = router.params.id,
  state = reactive({
    education: "",
  }),
  breadCrumbsConfig = [
    {
      text: "Global Settings",
      to: "/",
    },
    {
      text: "Personal management",
      to: "/",
    },
    {
      text: "Highest Education Levels",
      to: "settings/personal-management/highest-education-levels",
    },
    {
      text: "Edit",
      active: true,
    },
  ],
  { title } = useTitle("Edit Highest Education Levels"),
  { items } = useTranslatedBreadCrumbs(breadCrumbsConfig),
  validationRules = {
    education: { required },
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
        name: state.education,
      };
      apiRoute.value = routes.EDUCATION_LEVEL;
      updateFunc(
        payload,
        educationId,
        "/settings/personal-management/highest-education-levels"
      );
    }
  },
  refresh = async () => {
    let response = await showFunc(educationId);
    if (!!response?.success) {
      state.education = response?.data?.name;
    }
  };
// define api url of this crud that's we define in apiRoutes file.
apiRoute.value = routes.EDUCATION_LEVEL;

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
                  {{ $t("Edit Highest education level Details") }}
                </h3>
              </div>
              <div class="card-body">
                <div class="row">
                  <div class="col-lg-12">
                    <div class="form-group">
                      <elements-input
                        v-model="state.education"
                        :label="$t('Name')"
                        :required="true"
                        :disabled="submitted"
                        id="name"
                        :class="{ 'is-invalid': v$.education.$error }"
                      />
                      <div v-if="v$.education.$error" class="invalid-feedback">
                        <span
                          class="text-danger"
                          v-if="v$.education.required"
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
            @click="
              navigateTo(
                '/settings/personal-management/highest-education-levels'
              )
            "
          >
            <ElementsIcon v-bind:icon="'cancelIcon'" />
            {{ $t("Cancel") }}
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
