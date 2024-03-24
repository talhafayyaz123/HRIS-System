<script setup lang="ts">
import { ref, reactive } from "vue";
import commonCode from "~/composables/common";
import { jobLevelCreateRequest } from "~/utils/apiRequests";
import { useVuelidate } from "@vuelidate/core";
import { useLayoutStore } from "~/store/layout";
import { required } from "@vuelidate/validators";

import {
  useTranslatedBreadCrumbs,
  useTitle,
} from "~/composables/useTranslated";

const { router, Toast } = commonCode(),
  { t } = useI18n(),
  state = reactive({
    isLoading: false,
    submitted: false,
    levelName: "",
    experienceStart: "",
    experienceEnd: "",
    targetSalary: "",
    limitSalary: "",
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
      text: "Job Level",
      to: "/settings/personal-management/job-level",
    },
    {
      text: "Create",
      active: true,
    },
  ],
  { title } = useTitle("Create Job Level"),
  { items } = useTranslatedBreadCrumbs(breadCrumbsConfig),
  validationRules = {
    levelName: { required },
    experienceStart: { required },
    experienceEnd: { required },
    targetSalary: { required },
    limitSalary: { required },
  },
  v$ = useVuelidate(validationRules, state);
const store = () => {
  state.submitted = true;
  v$.value.$touch();
  if (v$.value.$invalid) {
    state.submitted = false;
    return false;
  } else {
    try {
      const layout = useLayoutStore();
      layout.changeLoaderValue(true);
      state.isLoading = true;
      jobLevelCreateRequest({
        levelName: state.levelName,
        experienceStart: state.experienceStart,
        experienceEnd: state.experienceEnd,
        targetSalary: state.targetSalary,
        limitSalary: state.limitSalary,
      })
        .then((response) => {
          layout.changeLoaderValue(false);

          Toast.fire({
            icon: "success",
            title: t("Record created successfully!"),
          });
          state.isLoading = false;
          state.submitted = false;
          navigateTo("/settings/personal-management/job-level");
        })
        .catch((error) => {
          layout.changeLoaderValue(false);

          state.isLoading = false;
          state.submitted = false;
          Toast.fire({ icon: "error", title: t("something went wrong!") });
        });
    } catch (e) {
      const layout = useLayoutStore();
      layout.changeLoaderValue(false);
      Toast.fire({ title: t("Error!"), text: t("Error"), icon: "error" });
      state.isLoading = false;
      state.submitted = false;
    }
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
          <div class="col-lg-12">
            <div class="card">
              <div class="card-header d-flex align-items-center">
                <h3 class="card-title me-2">
                  {{ $t("Fill Job Level Details") }}
                </h3>
                <ElementsTooltip />
              </div>
              <div class="card-body">
                <div class="row">
                  <div class="col-lg-6 col-md-6 col-sm-12">
                    <div class="form-group">
                      <elements-input
                        v-model="state.levelName"
                        :label="$t('Name')"
                        :required="true"
                        id="name"
                        :disabled="state.submitted"
                        :class="{ 'is-invalid': v$.levelName.$error }"
                      />
                    </div>
                    <div v-if="v$.levelName.$error" class="invalid-feedback">
                      <span class="text-danger" v-if="v$.levelName.required">{{
                        $t("This value is required")
                      }}</span
                      ><br />
                    </div>
                  </div>
                  <div class="col-lg-6"></div>
                  <div class="col-lg-6 col-md-6 col-sm-12">
                    <div class="form-group">
                      <elements-input
                        v-model="state.experienceStart"
                        :label="$t('Experience Start')"
                        :required="true"
                        id="experience-start"
                        min="1"
                        :disabled="state.submitted"
                        :class="{ 'is-invalid': v$.experienceStart.$error }"
                        type="number"
                      />
                    </div>
                    <div
                      v-if="v$.experienceStart.$error"
                      class="invalid-feedback"
                    >
                      <span
                        class="text-danger"
                        v-if="v$.experienceStart.required"
                        >{{ $t("This value is required") }}</span
                      ><br />
                    </div>
                  </div>
                  <div class="col-lg-6 col-md-6 col-sm-12">
                    <div class="form-group">
                      <elements-input
                        v-model="state.experienceEnd"
                        :label="$t('Experience End')"
                        :required="true"
                        min="1"
                        id="experience-end"
                        :disabled="state.submitted"
                        :class="{ 'is-invalid': v$.experienceEnd.$error }"
                        type="number"
                      />
                    </div>
                    <div
                      v-if="v$.experienceEnd.$error"
                      class="invalid-feedback"
                    >
                      <span
                        class="text-danger"
                        v-if="v$.experienceEnd.required"
                        >{{ $t("This value is required") }}</span
                      ><br />
                    </div>
                  </div>
                  <div class="col-lg-6 col-md-6 col-sm-12">
                    <div class="form-group">
                      <elements-input
                        v-model="state.targetSalary"
                        :label="$t('Target Salary')"
                        :required="true"
                        id="target-salary"
                        :type="'number'"
                        :disabled="state.submitted"
                        :class="{ 'is-invalid': v$.targetSalary.$error }"
                      />
                    </div>
                    <div v-if="v$.targetSalary.$error" class="invalid-feedback">
                      <span
                        class="text-danger"
                        v-if="v$.targetSalary.required"
                        >{{ $t("This value is required") }}</span
                      ><br />
                    </div>
                  </div>
                  <div class="col-lg-6 col-md-6 col-sm-12">
                    <div class="form-group">
                      <elements-input
                        v-model="state.limitSalary"
                        :label="$t('Limit Salary')"
                        :required="true"
                        id="limit-salary"
                        :type="'number'"
                        :disabled="state.submitted"
                        :class="{ 'is-invalid': v$.limitSalary.$error }"
                      />
                    </div>
                    <div v-if="v$.limitSalary.$error" class="invalid-feedback">
                      <span
                        class="text-danger"
                        v-if="v$.limitSalary.required"
                        >{{ $t("This value is required") }}</span
                      ><br />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="d-flex align-items-center justify-content-end mt-3">
          <button
            class="primary-btn me-3"
            @click="navigateTo('/settings/personal-management/job-level')"
          >
            <ElementsIcon v-bind:icon="'cancelIcon'" />
            {{ $t("Cancel") }}
          </button>
          <submittal-button
            :isLoading="state.submitted"
            :icon-name="'saveIcon'"
            :buttonName="$t('Save and proceed')"
          />
        </div>
      </div>
    </form>
  </div>
</template>
