<script setup lang="ts">
import { reactive } from "vue";
import commonCode from "~/composables/common";
import { useVuelidate } from "@vuelidate/core";
import { required } from "@vuelidate/validators";
import { routes } from "~/utils/apiRoutes";
import genericFunctionality from "~/composables/genericFunctionality";

import {
  useTranslatedBreadCrumbs,
  useTitle,
} from "~/composables/useTranslated";

const { submitted, isLoading, apiRoute, storeFunc } = genericFunctionality(),
  { router, Toast } = commonCode(),
  { t } = useI18n(),
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
      to: "/settings/personal-management/highest-education-levels",
    },
    {
      text: "Create",
      active: true,
    },
  ],
  { title } = useTitle("Create Highest Education Levels"),
  { items } = useTranslatedBreadCrumbs(breadCrumbsConfig),
  validationRules = {
    education: { required },
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
      apiRoute.value = routes.EDUCATION_LEVEL;
      const payload = {
        name: state.education,
      };
      storeFunc(
        payload,
        "/settings/personal-management/highest-education-levels"
      );
    }
  };

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
          <div class="col-lg-6">
            <div class="card">
              <div class="card-header d-flex align-items-center">
                <h3 class="card-title me-2">
                  {{ $t("Fill Highest education level Details") }}
                </h3>
                <ElementsTooltip />
              </div>
              <div class="card-body">
                <div class="row">
                  <div class="col-lg-12 col-md-12 col-sm-12">
                    <div class="form-group">
                      <elements-input
                        v-model="state.education"
                        :label="$t('Name')"
                        :required="true"
                        id="name"
                        :disabled="submitted"
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
            <div class="d-flex align-items-center justify-content-end mt-3">
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
                :icon-name="'saveIcon'"
                :buttonName="$t('Save and proceed')"
              />
            </div>
          </div>
        </div>
      </div>
    </form>
  </div>
</template>
