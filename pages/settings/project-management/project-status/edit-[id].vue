<script setup lang="ts">
import { useLayoutStore } from "@/store/layout";
import {
  projectStatusShowRequest,
  projectStatusUpdateRequest,
} from "~/utils/apiRequests";
import commonCode from "~/composables/common";
import { reactive } from "vue";
import { useVuelidate } from "@vuelidate/core";
import { required } from "@vuelidate/validators";

import {
  useTranslatedBreadCrumbs,
  useTitle,
} from "~/composables/useTranslated";

const { router, Toast } = commonCode(),
  { t } = useI18n(),
  projectStatusId = router.params.id,
  state = reactive({
    isLoading: false,
    submitted: false,
    name: "",
  }),
  breadCrumbsConfig = [
    {
      text: "Global Settings",
      to: "/",
    },
    {
      text: "Project Management",
      to: "/",
    },
    {
      text: "Project Status",
      to: "/settings/project-management/project-status",
    },
    {
      text: "Edit",
      active: true,
    },
  ],
  { title } = useTitle("Edit Project Status"),
  { items } = useTranslatedBreadCrumbs(breadCrumbsConfig),
  validationRules = {
    name: { required },
  },
  v$ = useVuelidate(validationRules, state);
const update = () => {
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
      const { name } = state;
      projectStatusUpdateRequest({ name: name }, projectStatusId)
        .then((response) => {
          layout.changeLoaderValue(false);
          Toast.fire({
            icon: "success",
            title: t("Record updated successfully!"),
          });
          state.isLoading = false;
          state.submitted = false;
          navigateTo("/settings/project-management/project-status");
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

function refresh() {
  const layout = useLayoutStore();
  layout.changeLoaderValue(true);
  projectStatusShowRequest(projectStatusId)
    .then((response) => {
      layout.changeLoaderValue(false);
      state.name = response.data?.name;
    })
    .catch((error) => {
      layout.changeLoaderValue(false);
    });
}

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
                  {{ $t("Edit Project Status Details") }}
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
                        :disabled="state.submitted"
                        id="name"
                        :class="{ 'is-invalid': v$.name.$error }"
                      />
                    </div>
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
            <div class="mt-3 d-flex align-items-center justify-content-end">
              <button
                class="primary-btn me-3"
                @click="
                  navigateTo('/settings/project-management/project-status')
                "
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
      </div>
    </form>
  </div>
</template>
