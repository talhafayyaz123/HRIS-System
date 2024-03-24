<script setup lang="ts">
import { ref, reactive, watch } from "vue";
import commonCode from "~/composables/common";
import { useVuelidate } from "@vuelidate/core";
import { required } from "@vuelidate/validators";
import { MdEditor } from "md-editor-v3";
import "md-editor-v3/lib/style.css";
import { routes } from "~/utils/apiRoutes";
import genericFeatures from "~/composables/generic";
import genericFunctionality from "~/composables/genericFunctionality";
import {
  createEmployeeRequest,
  specificPostRequest,
} from "~/utils/apiRequests";
import { useLayoutStore } from "~/store/layout";

import {
  useTranslatedBreadCrumbs,
  useTitle,
} from "~/composables/useTranslated";


const { showSpecificGenericListing, showGenericListing } = genericFeatures(),
  { submitted, isLoading, apiRoute, storeFunc } = genericFunctionality(),
  { router, Toast } = commonCode(),
  { t } = useI18n(),
  companies = ref([]),
  roles = ref([]),
  state = reactive({
    name: "",
    company_id: "",
    tenant_id: "",
    roles: [],
    status: 0,
  }),
  breadCrumbsConfig = [
    {
      text: "Global Setting",
      to: "/",
    },
    {
      text: "Administration",
      to: "/",
    },
    {
      text: "Api Keys",
      to: "/settings/administration/api-keys",
    },
    {
      text: "Create",
      active: true,
    },
  ],

  { title } = useTitle("Create Api Key"),
  { items } = useTranslatedBreadCrumbs(breadCrumbsConfig),

  validationRules = {
    name: { required },
    company_id: { required },
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
      const layout = useLayoutStore();
      layout.changeLoaderValue(true);
      specificPostRequest("create-api-token", state)
        .then((response) => {
          layout.changeLoaderValue(false);
          Toast.fire({
            icon: "success",
            title: "Record created successfully!",
          });
          navigateTo("/settings/administration/api-keys");
        })
        .catch((error) => {
          Toast.fire({ icon: "error", title: t("Something went wrong") });
        })
        .finally(() => {
          layout.changeLoaderValue(false);
          isLoading.value = false;
          submitted.value = false;
        });
    }
  },
  refresh = async () => {
    let rolesListing = await showSpecificGenericListing(routes.LIST_ROLES);
    if (!!rolesListing.data) {
      roles.value = rolesListing.data.map((ts: any) => {
        return { value: ts.id, name: ts.title };
      });
    }

    let companyListing = await showGenericListing(routes.COMPANY);
    if (!!companyListing.data.customers) {
      companies.value = companyListing.data.customers.map((ts: any) => {
        return { value: ts.id, name: ts.name };
      });
    }
  };

refresh();

useHead({
  title: title,
});
</script>

<template>
  <div>
    <form @submit.prevent="store">
      <page-header :title="title" :items="items" />
      <div class="card">
        <div class="card-header d-flex align-items-center">
          <h3 class="card-title me-2">{{ $t("Fill API Key Details") }}</h3>
          <elements-Tooltip />
        </div>
        <div class="card-body">
          <div class="row">
            <div class="col-lg-4 col-md-4 col-sm-12">
              <div class="form-group">
                <div class="input-group">
                  <div class="input-group-prepend">
                    <span class="input-group-text">
                      <elements-icon v-bind:icon="'userIcon'" />
                    </span>
                  </div>
                  <elements-input
                    v-model="state.name"
                    :label="$t('Name')"
                    :required="true"
                    id="group-name"
                    :disabled="submitted"
                    :class="{ 'is-invalid': v$.name.$error }"
                  />
                </div>
              </div>
              <div v-if="v$.name.$error" class="invalid-feedback">
                <span class="text-danger" v-if="v$.name.required">{{
                  $t("This value is required")
                }}</span>
                <br />
              </div>
            </div>
            <div class="col-lg-4 col-md-4 col-sm-12">
              <div class="form-group">
                <elements-multiselect
                  v-model="state.company_id"
                  :options="companies"
                  label="name"
                  track-by="value"
                  :textLabel="$t('Company')"
                  :required="true"
                  :class="{ 'is-invalid': v$.company_id.$error }"
                />
              </div>
              <div v-if="v$.company_id.$error" class="invalid-feedback">
                <span class="text-danger" v-if="v$.company_id.required">{{
                  $t("This value is required")
                }}</span>
                <br />
              </div>
            </div>
            <div class="col-lg-4 col-md-4 col-sm-12">
              <div class="form-group">
                <elements-multiselect
                  v-model="state.tenant_id"
                  :options="companies"
                  label="name"
                  track-by="value"
                  :textLabel="$t('Tenant')"
                />
              </div>
            </div>
            <div class="col-lg-4 col-md-4 col-sm-12">
              <div class="form-group">
                <elements-multiselect
                  v-model="state.roles"
                  :options="roles"
                  label="name"
                  track-by="value"
                  :multiple="true"
                  :textLabel="$t('Roles')"
                />
              </div>
            </div>
            <div class="col-lg-4 col-md-4 col-sm-12">
              <div class="form-group">
                <elements-select v-model="state.status" :label="$t('Status')">
                  <option :value="0">{{ $t("Inactive") }}</option>
                  <option :value="1">{{ $t("Active") }}</option>
                </elements-select>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="mt-3 d-flex align-items-center justify-content-end">
        <button
          class="primary-btn me-3"
          @click="navigateTo('/settings/administration/api-keys')"
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
    </form>
  </div>
</template>
