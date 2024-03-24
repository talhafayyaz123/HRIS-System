<script setup lang="ts">
import { ref, reactive, watch } from "vue";
import commonCode from "~/composables/common";
import { useVuelidate } from "@vuelidate/core";
import { required } from "@vuelidate/validators";
import { routes } from "~/utils/apiRoutes";
import genericFeatures from "~/composables/generic";
import genericFunctionality from "~/composables/genericFunctionality";
import {
  getEmployeeByIdRequest,
  updateEmployeeRequest,
} from "~/utils/apiRequests";
import { useLayoutStore } from "~/store/layout";
import { useAdministrationStore } from "~/store/administration";

import {
  useTranslatedBreadCrumbs,
  useTitle,
} from "~/composables/useTranslated";

const administration = useAdministrationStore();

const { showSpecificGenericListing, showGenericListing } = genericFeatures(),
  { submitted, isLoading, apiRoute, storeFunc } = genericFunctionality(),
  { router, Toast } = commonCode(),
  { t } = useI18n(),
  state = reactive({
    id: "",
    first_name: "",
    last_name: "",
    mail: "",
    mobile: "",
    phone: "",
    password: "",
    confirmPassword: "",
    city: "",
    roles: [],
    street: "",
    streetNumber: "",
    zipCode: "",
    types: [],
    company_id: "",
    tenant_id: "",
  }),
  typesOptions = [
    { value: "customer_employee", name: "Customer Employee" },
    { value: "employee", name: "Employee" },
    { value: "partner", name: "Partner" },
  ],
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
      text: "Users",
      to: "/settings/administration/users",
    },
    {
      text: "Edit",
      active: true,
    },
  ],
  { title } = useTitle("Users Edit"),
  { items } = useTranslatedBreadCrumbs(breadCrumbsConfig),
  companies = ref([]),
  passwordsMatch = ref(true),
  validationRules = {
    first_name: { required },
    last_name: { required },
    mail: { required },
    password: { required },
    confirmPassword: { required },
    company_id: { required },
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
      const layout = useLayoutStore();
      layout.changeLoaderValue(true);
      updateEmployeeRequest({
        id: state.id,
        first_name: state.first_name,
        last_name: state.last_name,
        mail: state.mail,
        mobile: state.mobile,
        phone: state.phone,
        password: state.password,
        confirmPassword: state.confirmPassword,
        city: state.city,
        roles: state.roles,
        street: state.street,
        streetNumber: state.streetNumber,
        zip: state.zipCode,
        types: state.types,
        companyId: state.company_id,
        tenant_id: state.tenant_id,
      })
        .then((response) => {
          // set allUsers List in pinia
          administration.setAllUsers();

          layout.changeLoaderValue(false);
          Toast.fire({
            icon: "success",
            title: "Record updated successfully!",
          });

          state.first_name = "";
          state.last_name = "";
          state.mail = "";
          state.mobile = "";
          state.phone = "";
          state.password = "";
          state.confirmPassword = "";
          state.city = "";
          (state.roles = []), (state.street = "");
          state.streetNumber = "";
          state.zipCode = "";
          state.types = [];
          state.company_id = "";
          state.tenant_id = "";

          navigateTo("/settings/administration/users");
        })
        .catch((error) => {
          Toast.fire({
            icon: "error",
            title: t("User with mail already exists"),
          });
        })
        .finally(() => {
          layout.changeLoaderValue(false);
          isLoading.value = false;
          submitted.value = false;
        });
    }
  },
  getEmployee = (id: string | string[]) => {
    const layout = useLayoutStore();
    layout.changeLoaderValue(true);
    getEmployeeByIdRequest({
      id: id,
    })
      .then((response) => {
        state.mail = response?.email;
        state.id = response?.id;
        state.first_name = response?.first_name;
        state.last_name = response?.last_name;
        state.mobile = response?.mobile;
        state.phone = response?.phone;
        state.city = response?.city;
        state.roles = response?.roles;
        state.street = response?.street;
        state.streetNumber = response?.streetNumber;
        state.zipCode = response?.zipCode;
        state.types = response?.types;
        state.company_id = response?.company_id;
        state.tenant_id = response?.tenant_id;
        layout.changeLoaderValue(false);
      })
      .catch((error) => {
        layout.changeLoaderValue(false);
        Toast.fire({ icon: "error", title: t("Something went wrong") });
      });
  },
  refresh = async () => {
    // check if roles exist in pinia, if not then call setRoles Api in pinia
    if (administration.roles && administration.roles.length === 0) {
      administration.setAllRoles();
    }

    let companyListing = await showGenericListing(routes.COMPANY);
    if (!!companyListing.data.customers) {
      companies.value = companyListing.data.customers.map((ts: any) => {
        return { value: ts.id, name: ts.name };
      });
    }

    getEmployee(router.params.id);
  };

refresh();

watch(
  () => state.password,
  (password) => {
    passwordsMatch.value = false;
    if (password == state.confirmPassword) passwordsMatch.value = true;
  }
);

watch(
  () => state.confirmPassword,
  (password) => {
    passwordsMatch.value = false;
    if (password == state.password) passwordsMatch.value = true;
  }
);

useHead({
  title: title,
});
</script>

<template>
  <div>
    <form @submit.prevent="update">
      <page-header :title="title" :items="items" />
      <div class="card">
        <div class="card-header d-flex align-items-center">
          <h3 class="card-title me-2">{{ $t("Update User Details") }}</h3>
          <elements-Tooltip :label="'Enter User Details'" />
        </div>
        <div class="card-body">
          <div class="row">
            <div class="col-lg-4 col-md-6 col-sm-12">
              <div class="form-group">
                <div class="input-group">
                  <div class="input-group-prepend">
                    <span class="input-group-text">
                      <ElementsIcon v-bind:icon="'userIcon'" />
                    </span>
                  </div>
                  <elements-input
                    v-model="state.first_name"
                    :label="$t('First Name')"
                    :required="true"
                    id="group-name"
                    :disabled="submitted"
                    :class="{ 'is-invalid': v$.first_name.$error }"
                  />
                </div>
              </div>
              <div v-if="v$.first_name.$error" class="invalid-feedback">
                <span class="text-danger" v-if="v$.first_name.required">{{
                  $t("This value is required")
                }}</span>
                <br />
              </div>
            </div>
            <div class="col-lg-4 col-md-6 col-sm-12">
              <div class="form-group">
                <div class="input-group">
                  <div class="input-group-prepend">
                    <span class="input-group-text">
                      <ElementsIcon v-bind:icon="'userIcon'" />
                    </span>
                  </div>
                  <elements-input
                    v-model="state.last_name"
                    :label="$t('Last Name')"
                    :required="true"
                    id="group-name"
                    :disabled="submitted"
                    :class="{ 'is-invalid': v$.last_name.$error }"
                  />
                </div>
              </div>
              <div v-if="v$.last_name.$error" class="invalid-feedback">
                <span class="text-danger" v-if="v$.last_name.required">{{
                  $t("This value is required")
                }}</span
                ><br />
              </div>
            </div>
            <div class="col-lg-4"></div>

            <div class="col-lg-4 col-md-6 col-sm-12">
              <div class="form-group">
                <elements-input
                  v-model="state.street"
                  :label="$t('Street')"
                  :disabled="submitted"
                />
              </div>
            </div>
            <div class="col-lg-4 col-md-6 col-sm-12">
              <div class="form-group">
                <elements-input
                  v-model="state.streetNumber"
                  :label="$t('Street Number')"
                  :disabled="submitted"
                />
              </div>
            </div>
            <div class="col-lg-4"></div>

            <div class="col-lg-4 col-md-6 col-sm-12">
              <div class="form-group">
                <elements-input
                  v-model="state.zipCode"
                  :label="$t('Zip Code')"
                  :disabled="submitted"
                />
              </div>
            </div>
            <div class="col-lg-4 col-md-6 col-sm-12">
              <div class="form-group">
                <elements-input
                  v-model="state.city"
                  :label="$t('City')"
                  :disabled="submitted"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="card no-header mt-4">
        <div class="card-body">
          <div class="row">
            <div class="col-lg-4 col-md-6 col-sm-12">
              <div class="form-group">
                <div class="input-group">
                  <div class="input-group-prepend">
                    <span class="input-group-text">
                      <ElementsIcon v-bind:icon="'emailIcon'" />
                    </span>
                  </div>
                  <elements-input
                    v-model="state.mail"
                    :label="$t('Email')"
                    :required="true"
                    :disabled="submitted"
                    :class="{ 'is-invalid': v$.mail.$error }"
                  />
                </div>
              </div>
              <div v-if="v$.mail.$error" class="invalid-feedback">
                <span class="text-danger" v-if="v$.mail.required">{{
                  $t("This value is required")
                }}</span
                ><br />
              </div>
            </div>
            <div class="col-lg-4 col-md-6 col-sm-12">
              <div class="form-group">
                <div class="input-group">
                  <div class="input-group-prepend">
                    <span class="input-group-text">
                      <ElementsIcon v-bind:icon="'mobileIcon'" />
                    </span>
                  </div>
                  <elements-input
                    v-model="state.mobile"
                    :label="$t('Mobile')"
                    :disabled="submitted"
                    type="text"
                  />
                </div>
              </div>
            </div>
            <div class="col-lg-4 col-md-6 col-sm-12">
              <div class="form-group">
                <div class="input-group">
                  <div class="input-group-prepend">
                    <span class="input-group-text">
                      <ElementsIcon v-bind:icon="'phoneIcon'" />
                    </span>
                  </div>
                  <elements-input
                    v-model="state.phone"
                    :label="$t('Phone')"
                    :disabled="submitted"
                    type="text"
                  />
                </div>
              </div>
            </div>
            <div class="col-lg-4 col-md-6 col-sm-12">
              <div class="form-group">
                <div class="input-group">
                  <div class="input-group-prepend">
                    <span class="input-group-text">
                      <ElementsIcon v-bind:icon="'userIcon'" />
                    </span>
                  </div>
                  <elements-input
                    type="password"
                    v-model="state.password"
                    :label="$t('Password')"
                    :required="true"
                    id="group-name"
                    :disabled="submitted"
                    :class="{ 'is-invalid': v$.password.$error }"
                  />
                </div>
              </div>
              <div v-if="v$.password.$error" class="invalid-feedback">
                <span class="text-danger" v-if="v$.password.required">{{
                  $t("This value is required")
                }}</span
                ><br />
              </div>
            </div>
            <div class="col-lg-4 col-md-6 col-sm-12">
              <div class="form-group">
                <div class="input-group">
                  <div class="input-group-prepend">
                    <span class="input-group-text">
                      <ElementsIcon v-bind:icon="'eyeIcon'" />
                    </span>
                  </div>
                  <elements-input
                    type="password"
                    v-model="state.confirmPassword"
                    :label="$t('Confirm Password')"
                    :required="true"
                    :disabled="submitted"
                    :class="{
                      'is-invalid': !passwordsMatch && state.password != '',
                    }"
                  />
                </div>
              </div>
              <div
                v-if="!passwordsMatch && state.password != ''"
                class="invalid-feedback"
              >
                <span class="text-danger">{{
                  $t("Both passwords should match")
                }}</span>
              </div>
            </div>
            <div class="col-lg-4">
              <div class="form-group">
                <elements-multiselect
                  v-model="state.company_id"
                  :options="companies"
                  label="name"
                  track-by="value"
                  :textLabel="$t('Company')"
                />
              </div>
              <div v-if="v$.company_id.$error" class="invalid-feedback">
                <span class="text-danger" v-if="v$.company_id.required">{{
                  $t("This value is required")
                }}</span
                ><br />
              </div>
            </div>
            <div class="col-lg-4">
              <div class="form-group">
                <elements-multiselect
                  v-model="state.roles"
                  :options="administration.roles"
                  label="name"
                  track-by="value"
                  :multiple="true"
                  :textLabel="$t('Role')"
                />
              </div>
            </div>
            <div class="col-lg-4">
              <div class="form-group">
                <elements-multiselect
                  v-model="state.types"
                  :options="typesOptions"
                  label="name"
                  track-by="value"
                  :multiple="true"
                  :textLabel="$t('Type')"
                />
              </div>
            </div>

            <div class="col-lg-4">
              <div class="form-group">
                <elements-multiselect
                  v-model="state.tenant_id"
                  :options="companies"
                  label="name"
                  track-by="value"
                  :textLabel="$t('Teanut')"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="mt-3 d-flex align-items-center justify-content-end">
        <button
          class="primary-btn me-3"
          @click="navigateTo('/settings/administration/users')"
        >
          <elements-icon v-bind:icon="'cancelIcon'" class="me-2" />
          <span>{{ $t("Cancel") }}</span>
        </button>
        <submittal-button
          :isLoading="submitted"
          :iconName="'updateIcon'"
          :buttonName="$t('Update')"
        />
      </div>
    </form>
  </div>
</template>
