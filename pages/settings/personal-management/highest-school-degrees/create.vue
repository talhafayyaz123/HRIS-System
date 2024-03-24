<script setup lang="ts">
import { reactive } from "vue";

import commonCode from "~/composables/common";
import { useVuelidate } from "@vuelidate/core";
import { required } from "@vuelidate/validators";
import genericFunctionality from "~/composables/genericFunctionality";
import { routes } from "~/utils/apiRoutes";

import {
  useTranslatedBreadCrumbs,
  useTitle,
} from "~/composables/useTranslated";

const { submitted, isLoading, apiRoute, storeFunc } = genericFunctionality(),
  { router, Toast } = commonCode(),
  { t } = useI18n(),
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
      text: "Create",
      active: true,
    },
  ],
  { title } = useTitle("Create Highest School Degree"),
  { items } = useTranslatedBreadCrumbs(breadCrumbsConfig),
  validationRules = {
    degree: { required },
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
      apiRoute.value = routes.DEGREE_DEGREE;
      const payload = {
        name: state.degree,
      };
      storeFunc(
        payload,
        "/settings/personal-management/highest-school-degrees"
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
              <div class="card-header">
                <h3 class="card-title">
                  {{ $t("Fill Highest School Degree Details") }}
                </h3>
              </div>
              <div class="card-body">
                <div class="row">
                  <div class="col-lg-12 col-md-12 col-sm-12">
                    <div class="form-group">
                      <elements-input
                        v-model="state.degree"
                        :label="$t('Name')"
                        :required="true"
                        id="name"
                        :disabled="submitted"
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
            <div class="d-flex align-items-center justify-content-end mt-3">
              <button
                class="primary-btn me-3"
                @click="
                  navigateTo(
                    '/settings/personal-management/highest-school-degrees'
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
