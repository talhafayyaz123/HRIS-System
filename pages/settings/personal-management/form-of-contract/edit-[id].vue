<script setup lang="ts">
import {
  formOfContractUpdateRequest,
  formOfContractShowRequest,
} from "~/utils/apiRequests";
import commonCode from "~/composables/common";
import { useLayoutStore } from "~/store/layout";
import { reactive } from "vue";
import { useVuelidate } from "@vuelidate/core";
import { required } from "@vuelidate/validators";

import {
  useTranslatedBreadCrumbs,
  useTitle,
} from "~/composables/useTranslated";

const { router, Toast } = commonCode(),
  { t } = useI18n(),
  groupId = router.params.id,
  state = reactive({
    isLoading: false,
    submitted: false,
    contractName: "",
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
      text: "Form Of Contract",
      to: "/settings/personal-management/form-of-contract",
    },
    {
      text: "Edit",
      active: true,
    },
  ],
  { title } = useTitle("Edit Form Of Contract"),
  { items } = useTranslatedBreadCrumbs(breadCrumbsConfig),
  validationRules = {
    contractName: { required },
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
      const { contractName } = state;
      formOfContractUpdateRequest({ name: contractName }, groupId)
        .then((response) => {
          layout.changeLoaderValue(false);
          Toast.fire({
            icon: "success",
            title: t("Record updated successfully!"),
          });
          state.isLoading = false;
          state.submitted = false;
          navigateTo("/settings/personal-management/form-of-contract");
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
  formOfContractShowRequest(groupId)
    .then((response) => {
      layout.changeLoaderValue(false);
      state.contractName = response.data?.name;
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
              <div class="card-header">
                <h3 class="card-title">
                  {{ $t("Edit Form Of Contract Details") }}
                </h3>
              </div>
              <div class="card-body">
                <div class="row">
                  <div class="col-lg-12">
                    <div class="form-group">
                      <elements-input
                        v-model="state.contractName"
                        :label="$t('Name')"
                        :required="true"
                        :disabled="state.submitted"
                        id="name"
                        :class="{ 'is-invalid': v$.contractName.$error }"
                      />
                      <div
                        v-if="v$.contractName.$error"
                        class="invalid-feedback"
                      >
                        <span
                          class="text-danger"
                          v-if="v$.contractName.required"
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
                @click="
                  navigateTo('/settings/personal-management/form-of-contract')
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
        </div>
      </div>
    </form>
  </div>
</template>
