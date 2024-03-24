<script setup lang="ts">
import { ref, reactive } from "vue";
import commonCode from "~/composables/common";
import { useVuelidate } from "@vuelidate/core";
import { required } from "@vuelidate/validators";
import { routes } from "~/utils/apiRoutes";
import genericFeatures from "~/composables/generic";
import genericFunctionality from "~/composables/genericFunctionality";
import {
  specificPostRequest,
  specificShowRequest,
  specificUpdateRequest,
} from "~/utils/apiRequests";
import { useLayoutStore } from "~/store/layout";
import { useAdministrationStore } from "~/store/administration";

import {
  useTranslatedBreadCrumbs,
  useTitle,
} from "~/composables/useTranslated";

useHead({
  title: `Edit Roles`,
});

const administration = useAdministrationStore();

const { showSpecificGenericListing, showGenericListing } = genericFeatures(),
  { submitted, isLoading, apiRoute, storeFunc } = genericFunctionality(),
  { router, Toast } = commonCode(),
  { t } = useI18n(),
  companies = ref([]),
  state = reactive({
    name: "",
    permissions: [],
    tenant_id: "",
    can_register: false,
    active: false,
  }),
  breadCrumbsConfig = [
    {
      text: "Global Settings",
      to: "/",
    },
    {
      text: "Administration",
      to: "/",
    },
    {
      text: "Roles",
      to: "/settings/administration/roles",
    },
    {
      text: "Edit",
      active: true,
    },
  ],
  { title } = useTitle("Edit Roles"),
  { items } = useTranslatedBreadCrumbs(breadCrumbsConfig),

  validationRules = {
    name: { required },
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
      specificPostRequest("/update-role", {
        id: router.params.id,
        title: state.name,
        permissions: state.permissions,
        tenant_id: state.tenant_id,
        active: state.active ? 1 : 0,
        can_register: state.can_register ? 1 : 0,
      })
        .then((response) => {

          // set allRoles List in pinia
          administration.setAllRoles();

          state.name = "";
          state.permissions = [];
          state.tenant_id = "";
          state.active = false;
          state.can_register = false;
          layout.changeLoaderValue(false);
          Toast.fire({ icon: "success", title: "Record Update successfully!" });
          navigateTo("/settings/administration/roles");
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
  showRoles = async () => {
    const layout = useLayoutStore();
    layout.changeLoaderValue(false);
    let url = `/list-role-by-id?id=${router.params.id}`;
    await specificShowRequest(url).then((response) => {
      state.name = response?.title;
      state.permissions = response?.permissions;
      state.tenant_id = response?.tenant_id;
      state.can_register = !!response?.can_register;
      state.active = !!response?.active;
    });
  },
  refresh = async () => {
    const layout = useLayoutStore();
    layout.changeLoaderValue(true);

    // check if permissions exist in pinia, if not then call setPermission Api in pinia
    if (administration.permissions && administration.permissions.length === 0) {
      administration.setAllPermissions();
    } 
    let companyListing = await showGenericListing(routes.COMPANY);
    if (!!companyListing?.data?.customers) {
      companies.value = companyListing.data.customers.map((ts: any) => {
        return { value: ts.id, name: ts.name };
      });
    }
    await showRoles();
  };

refresh();
</script>

<template>
  <div>
    <page-header :title="title" :items="items" />
    <form @submit.prevent="store">
      <div class="">
        <div class="row">
          <div class="col-lg-12">
            <div class="card">
              <div class="card-header">
                <h3 class="card-title">{{ $t("Fill Roles Details") }}</h3>
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
                      }}</span
                      ><br />
                    </div>
                  </div>
                  <div class="col-lg-4">
                    <div class="form-group">
                      <elements-multiselect
                        v-model="state.permissions"
                        :options="administration.permissions"
                        :multiple="true"
                        label="name"
                        track-by="value"
                        :textLabel="$t('Permissions')"
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
                  <div class="col-lg-2">
                    <div
                      class="form-group checkbox-group d-flex align-items-center"
                    >
                      <input
                        type="checkbox"
                        class="checkbox-input"
                        id="can_register"
                        v-model="state.can_register"
                      />
                      <label for="can_register" class="ms-2 checkbox-label"
                        > {{$t("Can Register")}}</label>
                    </div>
                  </div>
                  <div class="col-lg-2">
                    <div
                      class="form-group d-flex align-items-center checkbox-group"
                    >
                      <input
                        type="checkbox"
                        class="checkbox-input"
                        id="active"
                        v-model="state.active"
                      />
                      <label for="active" class="ms-2 checkbox-label"
                        >{{$t("Active")}}</label
                      >
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
            @click="navigateTo('/settings/administration/roles')"
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
      </div>
    </form>
  </div>
</template>
