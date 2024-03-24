<script setup lang="ts">
import { ref, reactive } from "vue";
import commonCode from "~/composables/common";
import { useVuelidate } from "@vuelidate/core";
import { required } from "@vuelidate/validators";
import genericFeatures from "~/composables/generic";
import genericFunctionality from "~/composables/genericFunctionality";
import { routes } from "~/utils/apiRoutes";
import { specificPostRequest } from "~/utils/apiRequests";
import Group from "~/pages/settings/administration/permissions/components/group.vue";
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
  triggered = ref(false),
  group = ref(""),
  state = reactive({
    title: "",
    needs_permission: "",
    can_be_assigned: false,
    active: false,
    scope: "",
    value: "",
    grouping: "",
    description: "",
    tenant_id: "",
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
      text: "Permission",
      to: "/settings/administration/permissions",
    },
    {
      text: "Create",
      active: true,
    },
  ],

  { title } = useTitle("Create Permissions"),
  { items } = useTranslatedBreadCrumbs(breadCrumbsConfig),

  permissions = ref([]),
  groupings = ref([]),
  companies = ref([]),
  validationRules = {
    title: { required },
    scope: { required },
    value: { required },
  },
  v$ = useVuelidate(validationRules, state),
  store = () => {
    triggered.value = true;
    submitted.value = true;
    //stop here if form is invalid
    v$.value.$touch();
    if (v$.value.$invalid) {
      submitted.value = false;
      return false;
    } else {
      const layout = useLayoutStore();
      layout.changeLoaderValue(true);
      specificPostRequest("create-permission", {
        title: state.title,
        needs_permission: state.needs_permission,
        scope: state.scope,
        value: state.value,
        can_be_assigned: state.can_be_assigned ? 1 : 0,
        active: state.active ? 1 : 0,
        grouping: state.grouping ?? getGroupPath(group.value),
      })
        .then((title) => {
          state.title = "";
          state.needs_permission = "";
          state.scope = "";
          state.value = state.can_be_assigned = "";
          state.active = "";
          state.grouping = "";
          state.tenant_id = "";

           // set allPermissions List in pinia
          administration.setAllPermissions();

          layout.changeLoaderValue(false);
          Toast.fire({
            icon: "success",
            title: "Record created successfully!",
          });
          navigateTo("/settings/administration/permissions");
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
  /**
   * adds a group
   */
  addGroup = () => {
    group.value = {
      name: "",
      child: null,
    };
  },
  /**
   * reccursively checks if a group has an empty display name or value if yes then return true
   * @param {group} the group that we want to check error for
   * @returns boolean
   */
  checkForGroupError = (group: { name: any; child: any }) => {
    if (!group) return false;
    let hasError = false;
    if (!group.name) {
      hasError = true;
    } else {
      if (group.child) {
        hasError = checkForGroupError(group.child);
      }
    }
    return hasError;
  },
  /**
   * makes a group path string and returns it
   * this method is called recursively since we can have child and sub childs and so on
   * we traverse through all the sub groups to create a group path
   * @param {group} group object that has a 'name' and 'child' in it
   */
  getGroupPath = (group: { name: string; child: any }) => {
    if (!group) return "";
    let groupPath = "";
    groupPath += group.name;
    if (group.child) {
      groupPath += "/" + getGroupPath(group.child);
    }
    return groupPath;
  },
  refresh = async () => {
    // check if permissions exist in pinia, if not then call setPermission Api in pinia
    if (administration.permissions && administration.permissions.length === 0) {
      administration.setAllPermissions();
    } 

    let permissionGroupingListing = await showSpecificGenericListing(
      routes.PERMISSION_GROUPS
    );
    if (!!permissionGroupingListing.data) {
      groupings.value = permissionGroupingListing.data.map((ts: any) => {
        return { value: ts.grouping, name: ts.grouping };
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
    <page-header :title="title" :items="items" />
    <form @submit.prevent="store">
      <div class="">
        <div class="row">
          <div class="col-lg-12">
            <div class="card">
              <div class="card-header d-flex align-items-center">
                <h3 class="card-title me-2">
                  {{ $t("Fill Permission Details") }}
                </h3>
                <ElementsTooltip />
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
                          v-model="state.title"
                          :label="$t('Name')"
                          :required="true"
                          id="group-name"
                          :disabled="submitted"
                          :class="{ 'is-invalid': v$.title.$error }"
                        />
                      </div>
                    </div>
                    <div v-if="v$.title.$error" class="invalid-feedback">
                      <span class="text-danger" v-if="v$.title.required">{{
                        $t("This value is required")
                      }}</span
                      ><br />
                    </div>
                  </div>
                  <div class="col-lg-4">
                    <div class="form-group">
                      <elements-multiselect
                        v-model="state.needs_permission"
                        :options="administration.permissions"
                        label="name"
                        track-by="value"
                        :textLabel="$t('Need Permission')"
                      />
                    </div>
                  </div>
                  <div class="col-lg-4 col-md-6 col-sm-12">
                    <div class="form-group">
                      <elements-input
                        v-model="state.scope"
                        :label="$t('Scope')"
                        :required="true"
                        id="scope"
                        :disabled="submitted"
                        :class="{ 'is-invalid': v$.scope.$error }"
                      />
                    </div>
                    <div v-if="v$.scope.$error" class="invalid-feedback">
                      <span class="text-danger" v-if="v$.scope.required">{{
                        $t("This value is required")
                      }}</span
                      ><br />
                    </div>
                  </div>
                  <div class="col-lg-4 col-md-6 col-sm-12">
                    <div class="form-group">
                      <elements-input
                        v-model="state.value"
                        :label="$t('Value')"
                        :required="true"
                        id="value"
                        :disabled="submitted"
                        :class="{ 'is-invalid': v$.value.$error }"
                      />
                    </div>
                    <div v-if="v$.value.$error" class="invalid-feedback">
                      <span class="text-danger" v-if="v$.value.required">{{
                        $t("This value is required")
                      }}</span
                      ><br />
                    </div>
                  </div>
                </div>
                <div class="row">
                  <div class="col-lg-2">
                    <div
                      class="form-group checkbox-group d-flex align-items-center"
                    >
                      <input
                        class="checkbox-input"
                        id="can_be_assigned"
                        v-model="state.can_be_assigned"
                        type="checkbox"
                      />
                      <label for="can_be_assigned" class="checkbox-label"
                        >  {{$t("Can Be Assigned")}} </label
                      >
                    </div>
                  </div>
                  <div class="col-lg-2">
                    <div
                      class="form-group checkbox-group d-flex align-items-center"
                    >
                      <input
                        id="active"
                        v-model="state.active"
                        type="checkbox"
                        class="checkbox-input"
                      />
                      <label for="active" class="checkbox-label"> {{$t("Active")}} </label>
                    </div>
                  </div>
                </div>
                <div class="row">
                  <div class="col-lg-4">
                    <div class="form-group">
                      <elements-multiselect
                        v-model="state.grouping"
                        :options="groupings"
                        label="name"
                        track-by="value"
                        :textLabel="$t('Groups')"
                      />
                    </div>
                    <div class="d-flex align-items-center justify-content-end">
                      <button
                        v-if="!group && !state.grouping"
                        @click="addGroup"
                        class="secondary-btn"
                      >
                        <ElementsIcon v-bind:icon="'addIcon'" class="me-2" />
                        {{ $t("Add Group") }}
                      </button>
                    </div>

                    <Group
                      v-if="group && !state.grouping"
                      @deleteParentGroup="group = null"
                      :isOriginal="true"
                      :triggered="triggered"
                      :group="group"
                    />
                  </div>
                  <div class="col-lg-8 col-md-6 col-sm-12">
                    <div class="form-group textarea">
                      <textarea
                        v-model="state.description"
                        placeholder="."
                        class="form-control"
                      ></textarea>
                      <label for="" class="input-label"> {{$t("Description")}} </label>
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
          </div>
        </div>
        <div class="mt-3 d-flex align-items-center justify-content-end">
          <button
            class="primary-btn me-3"
            @click="navigateTo('/settings/administration/permissions')"
          >
            <elements-icon v-bind:icon="'cancelIcon'" class="me-2" />
            <span>{{ $t("Cancel") }}</span>
          </button>
          <submittal-button
            :isLoading="state.submitted"
            :iconName="'saveIcon'"
            :buttonName="$t('Save and Proceed')"
          />
        </div>
      </div>
    </form>
  </div>
</template>
