<script setup lang="ts">
import { ref, reactive } from "vue";
import commonCode from "~/composables/common";
import { useVuelidate } from "@vuelidate/core";
import { required } from "@vuelidate/validators";
import genericFeatures from "~/composables/generic";
import genericFunctionality from "~/composables/genericFunctionality";
import { routes } from "~/utils/apiRoutes";
import { specificPostRequest, specificShowRequest } from "~/utils/apiRequests";
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
    val: "",
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
      text: "Edit",
      active: true,
    },
  ],

  { title } = useTitle("Edit Permisssions"),
  { items } = useTranslatedBreadCrumbs(breadCrumbsConfig),

  groupings = ref([]),
  companies = ref([]),
  validationRules = {
    title: { required },
    scope: { required },
    val: { required },
  },
  v$ = useVuelidate(validationRules, state),
  update = () => {
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
      specificPostRequest("update-permission", {
        id: router.params.id,
        title: state.title,
        needs_permission: state.needs_permission,
        scope: state.scope,
        value: state.val,
        can_be_assigned: state.can_be_assigned ? 1 : 0,
        active: state.active ? 1 : 0,
        grouping: state.grouping ?? getGroupPath(group.value),
      })
        .then((title) => {
          state.title = "";
          state.needs_permission = "";
          state.scope = "";
          state.val = "";
          state.can_be_assigned = false;
          state.active = false;
          state.grouping = "";
          state.tenant_id = "";

          // set allPermissions List in pinia
          administration.setAllPermissions();

          layout.changeLoaderValue(false);
          Toast.fire({
            icon: "success",
            title: "Record updated successfully!",
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
  showPermissions = async () => {
    const layout = useLayoutStore();
    let url = `/list-permission-by-id?id=${router.params.id}`;
    await specificShowRequest(url)
      .then((response) => {
        state.title = response?.title;
        state.needs_permission = response?.permissions;
        state.can_be_assigned = !!response?.can_be_assigned;
        state.scope = response?.scope;
        state.val = response?.value;
        state.grouping = response?.grouping;
        state.active = !!response?.active;
        state.description = response?.description;
        state.tenant_id = response?.tenant_id;
      })
      .finally(() => {
        layout.changeLoaderValue(false);
        isLoading.value = false;
        submitted.value = false;
      });
  },
  refresh = async () => {
    const layout = useLayoutStore();
    layout.changeLoaderValue(true);

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
    await showPermissions();
  };

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
          <div class="col-lg-12">
            <div class="card">
              <div class="card-header">
                <h3 class="card-title">{{ $t("Fill Permission Details") }}</h3>
              </div>
              <div class="card-body">
                <div class="row">
                  <div class="col-lg-6 col-md-6 col-sm-12">
                    <div class="form-group">
                      <elements-input
                        v-model="state.title"
                        :label="$t('Name')"
                        :required="true"
                        id="group-name"
                        :disabled="submitted"
                        :class="{ 'is-invalid': v$.title.$error }"
                      />
                      <div v-if="v$.title.$error" class="invalid-feedback">
                        <span class="text-danger" v-if="v$.title.required">{{
                          $t("This value is required")
                        }}</span
                        ><br />
                      </div>
                    </div>
                  </div>
                  <div class="col-lg-6">
                    <div class="form-group">
                      <elements-multiselect
                        :key="state.needs_permission"
                        v-model="state.needs_permission"
                        :options="administration.permissions "
                        label="name"
                        track-by="value"
                        :textLabel="$t('Need Permission')"
                      />
                    </div>
                  </div>
                  <div class="col-lg-6 col-md-6 col-sm-12">
                    <div class="form-group">
                      <elements-input
                        v-model="state.scope"
                        :label="$t('Scope')"
                        :required="true"
                        id="scope"
                        :disabled="submitted"
                        :class="{ 'is-invalid': v$.scope.$error }"
                      />
                      <div v-if="v$.scope.$error" class="invalid-feedback">
                        <span class="text-danger" v-if="v$.scope.required">{{
                          $t("This value is required")
                        }}</span
                        ><br />
                      </div>
                    </div>
                  </div>
                  <div class="col-lg-6 col-md-6 col-sm-12">
                    <div class="form-group">
                      <elements-input
                        v-model="state.val"
                        :label="$t('Value')"
                        :required="true"
                        id="value"
                        :disabled="submitted"
                        :class="{ 'is-invalid': v$.val.$error }"
                      />
                      <div v-if="v$.val.$error" class="invalid-feedback">
                        <span class="text-danger" v-if="v$.val.required">{{
                          $t("This value is required")
                        }}</span
                        ><br />
                      </div>
                    </div>
                  </div>
                  <div class="col-lg-6">
                    <div class="form-group d-flex align-items-center">
                      <label for="" class="me-2">{{ $t("Can Be Assigned") }}</label>
                      <input
                        id="can_be_assigned"
                        v-model="state.can_be_assigned"
                        type="checkbox"
                      />
                    </div>
                  </div>
                  <div class="col-lg-6">
                    <div class="form-group d-flex align-items-center">
                      <label for="" class="me-2">{{ $t("Active") }}</label>
                      <input
                        id="active"
                        v-model="state.active"
                        type="checkbox"
                      />
                    </div>
                  </div>
                  <div class="col-lg-6">
                    <div class="form-group">
                      <elements-multiselect
                        :key="state.grouping"
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
                  <div class="col-lg-6 col-md-6 col-sm-12">
                    <div class="form-group textarea">
                      <textarea
                        v-model="state.description"
                        placeholder="."
                        class="form-control"
                      ></textarea>
                      <label for="" class="input-label">{{ $t("Description") }}</label>
                    </div>
                  </div>
                  <div class="col-lg-6">
                    <div class="form-group">
                      <elements-multiselect
                        :key="state.tenant_id"
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
            :isLoading="submitted"
            :iconName="'updateIcon'"
            :buttonName="$t('Update')"
          />
        </div>
      </div>
    </form>
  </div>
</template>
