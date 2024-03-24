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

const { router, Toast } = commonCode(),
  { submitted, isLoading, apiRoute, storeFunc } = genericFunctionality(),
  { t } = useI18n(),
  state = reactive({
    groupName: "",
  }),
  breadCrumbsConfig = [
    {
      text: "Global Settings",
      to: "/",
    },
    {
      text: "Products",
      to: "/",
    },
    {
      text: "Group",
      to: "/settings/products/groups",
    },
    {
      text: "Create",
      active: true,
    },
  ],
  { title } = useTitle("Create Group"),
  validationRules = {
    groupName: { required },
  },
  v$ = useVuelidate(validationRules, state),
  { items } = useTranslatedBreadCrumbs(breadCrumbsConfig),
  store = () => {
    submitted.value = true;
    //stop here if form is invalid
    v$.value.$touch();
    if (v$.value.$invalid) {
      submitted.value = false;
      return false;
    } else {
      apiRoute.value = routes.PRODUCT_GROUP;
      const payload = {
        name: state.groupName,
      };
      storeFunc(payload, "/settings/products/groups");
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
              <div class="card-header d-flex">
                <h3 class="card-title me-2">
                  {{ $t("Fill Product Group Details") }}
                </h3>
                <elements-tooltip />
              </div>
              <div class="card-body">
                <div class="row">
                  <div class="col-lg-12 col-sm-12">
                    <div class="form-group">
                      <elements-input
                        v-model="state.groupName"
                        :label="$t('Group Name')"
                        :required="true"
                        id="group-name"
                        :disabled="submitted"
                        :class="{ 'is-invalid': v$.groupName.$error }"
                      />
                    </div>
                    <div v-if="v$.groupName.$error" class="invalid-feedback">
                      <span class="text-danger" v-if="v$.groupName.required">{{
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
                @click="navigateTo('/settings/products/groups')"
              >
                <elements-icon v-bind:icon="'cancelIcon'" class="me-2" />
                <span>{{ $t("Cancel") }}</span>
              </button>
              <submittal-button
                :isLoading="submitted"
                :iconName="'saveIcon'"
                :buttonName="$t('Save and Proceed')"
              />
            </div>
          </div>
        </div>
      </div>
    </form>
  </div>
</template>
