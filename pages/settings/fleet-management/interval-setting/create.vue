<script setup lang="ts">
import { ref, reactive, computed, watch } from "vue";
import commonCode from "~/composables/common";
import {
  listEmployeesRequest,
  intervalSettingCreateRequest,
  intervalSettingRequest,
} from "~/utils/apiRequests";
import { useVuelidate } from "@vuelidate/core";
import { required } from "@vuelidate/validators";
import { useLayoutStore } from "~/store/layout";

import {
  useTranslatedBreadCrumbs,
  useTitle,
} from "~/composables/useTranslated";

const { router, Toast } = commonCode(),
  { t } = useI18n(),
  state = reactive({
    isLoading: false,
    submitted: false,
    months: "",
    managers: [],
  }),
  managers = ref([]),
  isIntervalSetting = ref(false),
  breadCrumbsConfig = [
    {
      text: "Global Settings",
      to: "/",
    },
    {
      text: "Fleet Management",
      to: "/",
    },
    {
      text: "Interval Settings",
      to: "/settings/fleet-management/interval-setting",
    },
    {
      text: "Create",
      active: true,
    },
  ],
  { title } = useTitle("Create Interval Settings"),
  { items } = useTranslatedBreadCrumbs(breadCrumbsConfig),
  validationRules = {
    months: { required },
    managers: { required },
  },
  v$ = useVuelidate(validationRules, state);

function refresh() {
  const layout = useLayoutStore();
  layout.changeLoaderValue(true);
  listEmployeesRequest({
    limit_start: 0,
    limit_count: 25,
    type: "employee",
    company_id: "",
  }).then((response) => {
    managers.value = response?.data.map((employee: any) => {
      return {
        text: employee.first_name + " " + employee.last_name,
        value: employee.id,
      };
    });
  });

  intervalSettingRequest().then((response) => {
    if (response?.data?.IntervalSettings?.length > 0) {
      isIntervalSetting.value = true;
    }
  });
  layout.changeLoaderValue(false);
}

refresh();

useHead({
  title: title,
});

const store = () => {
  v$.value.$touch();
  if (v$.value.$invalid) {
    return;
  } else {
    if (isIntervalSetting.value == false) createIntervalSetting();
    else {
      Toast.fire({
        icon: "error",
        title: t(
          "A setting already exists! Please edit that or delete it to create a new"
        ),
      });
    }
  }
};
const createIntervalSetting = () => {
  try {
    state.isLoading = true;
    state.submitted = true;
    const layout = useLayoutStore();
    layout.changeLoaderValue(true);
    intervalSettingCreateRequest({
      months: state.months,
      managers: state.managers,
    })
      .then((response) => {
        layout.changeLoaderValue(false);
        Toast.fire({
          icon: "success",
          title: t("Record created successfully!"),
        });

        state.isLoading = false;
        state.submitted = false;

        navigateTo("/settings/fleet-management/interval-setting");
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
};
</script>

<template>
  <div>
    <page-header :title="title" :items="items" />
    <div class="row">
      <div class="col-lg-8">
        <div class="card">
          <div class="card-header d-flex align-items-center">
            <h3 class="card-title me-2">
              {{ $t("Fill Interval Setting Details") }}
            </h3>
            <elements-tooltip />
          </div>
          <div class="card-body">
            <div class="row">
              <div class="col-lg-6">
                <div class="form-group">
                  <elements-input
                    v-model="state.months"
                    :label="$t('Months')"
                    :required="true"
                    id="months"
                    :type="'number'"
                    min="1"
                    :disabled="state.submitted"
                    :class="{ 'is-invalid': v$.months.$error }"
                  />
                </div>

                <div v-if="v$.months.$error" class="invalid-feedback">
                  <span class="text-danger" v-if="v$.months.required">{{
                    $t("This value is required")
                  }}</span>
                </div>
              </div>
              <div class="col-lg-6">
                <div class="form-group">
                  <elements-multiselect
                    v-model="state.managers"
                    :options="managers"
                    label="text"
                    track-by="value"
                    :key="managers.length"
                    :textLabel="$t('Managers')"
                    :required="true"
                    :multiple="true"
                    :class="{ 'is-invalid': v$.managers.$error }"
                  />
                </div>

                <div v-if="v$.managers.$error" class="invalid-feedback">
                  <span class="text-danger" v-if="v$.managers.required">{{
                    $t("This value is required")
                  }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="mt-3 d-flex align-items-center justify-content-end">
          <button
            class="primary-btn me-3"
            @click="navigateTo('/settings/fleet-management/interval-setting')"
          >
            <elements-icon v-bind:icon="'cancelIcon'" class="me-2" />
            <span>{{ $t("Cancel") }}</span>
          </button>
          <submittal-button
            @click="store()"
            :isLoading="state.isLoading"
            :icon-name="'saveIcon'"
            :buttonName="$t('Save and Proceed')"
          />
        </div>
      </div>
    </div>
  </div>
</template>
