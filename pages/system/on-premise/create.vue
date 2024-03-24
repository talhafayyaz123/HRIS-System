<script setup lang="ts">
import { ref, reactive } from "vue";
import {
  ProductVersionBySoftwareRequest,
  onPremiseCreateRequest
} from "~/utils/apiRequests";
import { useLayoutStore } from "~/store/layout";
import commonCode from "~/composables/common";
import { useVuelidate } from "@vuelidate/core";
import { required } from "@vuelidate/validators";
import { routes } from "~/utils/apiRoutes";
import genericFunctionality from "~/composables/genericFunctionality";
import genericFeatures from "~/composables/generic";
import { useTranslatedColumns, useTranslatedBreadCrumbs, useTitle } from "~/composables/useTranslated";

const { router, Toast } = commonCode(),
  { showGenericListing } = genericFeatures(),
  { submitted, isLoading, apiRoute, storeFunc } = genericFunctionality(),
  { t } = useI18n(),
  breadCrumbsConfig = [
    {
      text: "Admin portal",
      to: "/",
    },
    {
      text: "System",
    },
    {
      text: "On Premise",
      to: "/system/on-premise",
    },
    {
      text: "Create",
      active: true,
    },
  ],
  instanceTypes = [
    {
      value: "database",
      text: "Database System",
    },
    {
      value: "development",
      text: "Development System",
    },
    {
      value: "test",
      text: "Test System",
    },
    {
      value: "productive",
      text: "Productive System",
    },
  ],
  currentPage = ref(1),
  order = ref("asc"),
  column = ref("id"),
  operatingSystems = ref([]),
  versions = ref([]),
  softwares = ref([]),
  customers = ref([]),
  state = reactive({
    isLoading: false,
    submitted: false,
    customerId: "",
    instanceType: "",
    operatingSystem: "",
    systemName: "",
    serverIp: "",
    softwareId: "",
    versionId: "",
    serverPort: "",
    userName: "",
    password: "",
  }),
  validationRules = {
    customerId: { required },
    instanceType: { required },
    operatingSystem: { required },
    systemName: { required },
    serverIp: { required },
    softwareId: { required },
    versionId: { required },
    serverPort: { required },
    password: { required },
    userName: { required },
  },
  v$ = useVuelidate(validationRules, state),
  { items } = useTranslatedBreadCrumbs(breadCrumbsConfig),
  { title } = useTitle("On-Premise create");

const store = () => {
  v$.value.$touch();
  if (v$.value.$invalid) {
    state.submitted = false;
    return false;
  } else {
    try {
      state.isLoading = true;
      createOnPremise();
    } catch (e) {
      Toast.fire({ title: t("Error!"), text: t("Error"), icon: "error" });
      state.isLoading = false;
      state.submitted = false;
    }
  }
};

const createOnPremise = () => {
  const layout = useLayoutStore();
  layout.changeLoaderValue(true);
  onPremiseCreateRequest({
    customerId: state.customerId,
    instanceType: state.instanceType,
    operatingSystemId: state.operatingSystem,
    systemName: state.systemName,
    serverIp: state.serverIp,
    softwareId: state.softwareId,
    softwareVersionId: state.versionId,
    serverPort: state.serverPort,
    username: state.userName,
    password: state.password,
  })
    .then((response) => {
      layout.changeLoaderValue(false);
      Toast.fire({
        icon: "success",
        title: t("Record created successfully!"),
      });
      state.isLoading = false;
      state.submitted = false;
      navigateTo("/system/on-premise");
    })
    .catch((error) => {
      layout.changeLoaderValue(false);
      state.isLoading = false;
      state.submitted = false;
      Toast.fire({ icon: "error", title: t("something went wrong!") });
    });
};

const getVersions = (val) => {
  state.versionId = "";
  versions.value = [];
  versionsList(val);
};

const versionsList = (id) => {
  ProductVersionBySoftwareRequest({
    softwareId: id,
  }).then((response) => {
    versions.value = response?.data.map((version: any) => {
      return {
        text: version.name,
        value: version.id,
      };
    });
  });
};

async function refresh() {
  const layout = useLayoutStore();
  layout.changeLoaderValue(true);
  let customerListing = await showGenericListing(routes.COMPANY);
  if (!!customerListing?.data?.customers) {
    customers.value = customerListing.data.customers.map(
      (ts: any) => {
        return { value: ts.id, text: ts.name };
      }
    );
  }
  let operatingSystemListing = await showGenericListing(routes.OPERATING_SYSTEM);
  if (!!operatingSystemListing?.data?.operatingSystems) {
    operatingSystems.value = operatingSystemListing.data.operatingSystems.map(
      (ts: any) => {
        return { value: ts.id, text: ts.name };
      }
    );
  }
  let softwaresListing = await showGenericListing(routes.PRODUCT_SOFTWARE);
  if (!!softwaresListing?.data?.productSoftware) {
    softwares.value = softwaresListing.data.productSoftware.map((ts: any) => {
      return { value: ts.id, text: ts.name };
    });
  }
  layout.changeLoaderValue(false);
}

refresh();
useHead({
  title: title,
});
</script>

<template>
  <div>
    <page-header :title="title" :items="items" />

    <div>
      <div id="supplier">
        <div class="wizard-tab">
          <ul class="" id="myTab" role="tablist">
            <li class="nav-item" role="presentation">
              <button class="nav-link active" type="button">
                {{ $t("Systems") }}
              </button>
            </li>
          </ul>
        </div>
        <div class="card mt-4">
          <div class="card-header d-flex align-items-center">
            <h3 class="card-title me-2">
              {{ $t("Fill System Details") }}
            </h3>
            <elements-tooltip />
          </div>
          <div class="card-body">
            <div class="row">
              <div class="col-lg-6 col-md-6">
                <div class="form-group">
                  <elements-multiselect
                    v-model="state.customerId"
                    :options="customers"
                    label="text"
                    track-by="value"
                    :textLabel="$t('Customer')"
                    :required="true"
                    :class="{ 'is-invalid': v$.customerId.$error }"
                  />
                  <div v-if="v$.customerId.$error" class="invalid-feedback">
                    <span class="text-danger" v-if="v$.customerId.required">{{
                      $t("This value is required")
                    }}</span
                    ><br />
                  </div>
                </div>
              </div>
              <div class="col-lg-6 col-md-6">
                <div class="form-group">
                  <elements-multiselect
                    v-model="state.instanceType"
                    :options="instanceTypes"
                    label="text"
                    track-by="value"
                    :textLabel="$t('Instance Type')"
                    :required="true"
                    :class="{ 'is-invalid': v$.instanceType.$error }"
                  />
                  <div v-if="v$.instanceType.$error" class="invalid-feedback">
                    <span class="text-danger" v-if="v$.instanceType.required">{{
                      $t("This value is required")
                    }}</span
                    ><br />
                  </div>
                </div>
              </div>
              <div class="col-lg-6 col-md-6">
                <div class="form-group">
                  <elements-multiselect
                    v-model="state.operatingSystem"
                    :options="operatingSystems"
                    label="text"
                    track-by="value"
                    :textLabel="$t('Operating System')"
                    :required="true"
                    :class="{ 'is-invalid': v$.operatingSystem.$error }"
                  />
                  <div
                    v-if="v$.operatingSystem.$error"
                    class="invalid-feedback"
                  >
                    <span
                      class="text-danger"
                      v-if="v$.operatingSystem.required"
                      >{{ $t("This value is required") }}</span
                    ><br />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="card mt-4">
          <div class="card-header d-flex align-items-center">
            <h3 class="card-title me-2">
              {{ $t("Fill Premise Details") }}
            </h3>
            <elements-tooltip />
          </div>
          <div class="card-body">
            <div class="row">
              <div class="col-md-6">
                <div class="form-group">
                  <elements-input
                    v-model="state.systemName"
                    :label="$t('System Name')"
                    :required="true"
                    id="systemName"
                    :disabled="state.submitted"
                    :class="{ 'is-invalid': v$.systemName.$error }"
                  />
                  <div v-if="v$.systemName.$error" class="invalid-feedback">
                    <span class="text-danger" v-if="v$.systemName.required">{{
                      $t("This value is required")
                    }}</span
                    ><br />
                  </div>
                </div>
              </div>
              <div class="col-md-6">
                <div class="form-group">
                  <elements-input
                    v-model="state.serverIp"
                    :label="$t('Server IP')"
                    :required="true"
                    id="serverIp"
                    :disabled="state.submitted"
                    :class="{ 'is-invalid': v$.serverIp.$error }"
                  />
                  <div v-if="v$.serverIp.$error" class="invalid-feedback">
                    <span class="text-danger" v-if="v$.serverIp.required">{{
                      $t("This value is required")
                    }}</span
                    ><br />
                  </div>
                </div>
              </div>
              <div class="col-lg-6 col-md-6">
                <div class="form-group">
                  <elements-multiselect
                    v-model="state.softwareId"
                    :options="softwares"
                    label="text"
                    track-by="value"
                    @select="getVersions"
                    :textLabel="$t('Software')"
                    :required="true"
                    :class="{ 'is-invalid': v$.softwareId.$error }"
                  />
                  <div v-if="v$.softwareId.$error" class="invalid-feedback">
                    <span class="text-danger" v-if="v$.softwareId.required">{{
                      $t("This value is required")
                    }}</span
                    ><br />
                  </div>
                </div>
              </div>
              <div class="col-lg-6 col-md-6">
                <div class="form-group">
                  <elements-multiselect
                    v-model="state.versionId"
                    :key="state.versionId"
                    :options="versions"
                    label="text"
                    track-by="value"
                    :textLabel="$t('Version')"
                    :required="true"
                    :class="{ 'is-invalid': v$.versionId.$error }"
                  />
                  <div v-if="v$.versionId.$error" class="invalid-feedback">
                    <span class="text-danger" v-if="v$.versionId.required">{{
                      $t("This value is required")
                    }}</span
                    ><br />
                  </div>
                </div>
              </div>
              <div class="col-md-6">
                <div class="form-group">
                  <elements-input
                    v-model="state.serverPort"
                    :label="$t('Server Port')"
                    :required="true"
                    id="serverPort"
                    :type="'number'"
                    :disabled="state.submitted"
                    :class="{ 'is-invalid': v$.serverPort.$error }"
                  />
                  <div v-if="v$.serverPort.$error" class="invalid-feedback">
                    <span class="text-danger" v-if="v$.serverPort.required">{{
                      $t("This value is required")
                    }}</span
                    ><br />
                  </div>
                </div>
              </div>
              <div class="col-md-6">
                <div class="form-group">
                  <elements-input
                    v-model="state.userName"
                    :label="$t('Username')"
                    :required="true"
                    id="userName"
                    :disabled="state.submitted"
                    :class="{ 'is-invalid': v$.userName.$error }"
                  />
                  <div v-if="v$.userName.$error" class="invalid-feedback">
                    <span class="text-danger" v-if="v$.userName.required">{{
                      $t("This value is required")
                    }}</span
                    ><br />
                  </div>
                </div>
              </div>
              <div class="col-md-6">
                <div class="form-group">
                  <div class="input-group">
                    <div class="input-group-prepend">
                      <div class="input-group-text">
                        <elements-icon v-bind:icon="'eyeIcon'" />
                      </div>
                    </div>
                    <elements-input
                      v-model="state.password"
                      :label="$t('Password')"
                      :required="true"
                      id="password"
                      :type="'password'"
                      :disabled="state.submitted"
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
            </div>
          </div>
        </div>
        <div class="mt-3 d-flex align-items-center justify-content-end">
          <button class="primary-btn me-3">
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
