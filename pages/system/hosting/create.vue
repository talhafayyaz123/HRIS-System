<script setup lang="ts">
import { ref, reactive } from "vue";
import { routes } from "~/utils/apiRoutes";
import commonCode from "~/composables/common";
import genericFeatures from "~/composables/generic";
import { ProductVersionBySoftwareRequest } from "~/utils/apiRequests";
import { useVuelidate } from "@vuelidate/core";
import { required } from "@vuelidate/validators";
import { useLayoutStore } from "~/store/layout";
import genericFunctionality from "~/composables/genericFunctionality";
import { useTranslatedColumns, useTranslatedBreadCrumbs, useTitle } from "~/composables/useTranslated";

const { router, Toast, deleteAlert } = commonCode();
const { showGenericListing } = genericFeatures(),
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
      text: "Hosting",
      to: "/system/hosting",
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
  sizes = [
    {
      value: "small",
      text: "Small",
    },
    {
      value: "medium",
      text: "Medium",
    },
    {
      value: "big",
      text: "Big",
    },
    {
      value: "huge",
      text: "Huge",
    },
  ],
  hostingTypes = [
    {
      value: "vm",
      text: "VM",
    },
    {
      value: "docker",
      text: "Docker",
    },
  ],
  hosts = ref([]),
  versions = ref([]),
  softwares = ref([]),
  operatingSystems = ref([]),
  databaseClouds = ref([]),
  filesystems = ref([]),
  customers = ref([]),
  state = reactive({
    isLoading: false,
    submitted: false,
    customerId: "",
    instanceType: "",
    operatingSystem: "",
    filesystem: [],
    databaseCloud: [],
    host: "",
    hostingType: "",
    systemName: "",
  }),
  stateVm = reactive({
    isLoading: false,
    submitted: false,
    host: "",
    serverPort: "",
    software: "",
    version: "",
    username: "",
    password: "",
  }),
  stateDocker = reactive({
    isLoading: false,
    submitted: false,
    databaseDiskSize: "",
    language: "",
    size: "",
    url: "",
  }),
  store = () => {
    submitted.value = true;
    //stop here if form is invalid
    v$.value.$touch();
    if (v$.value.$invalid) {
      submitted.value = false;
      return false;
    } else {
      if (state.hostingType == "vm") {
        vm$.value.$touch();
        if (vm$.value.$invalid) {
          submitted.value = false;
          return false;
        }
      }
      if (state.hostingType == "docker") {
        vDocker$.value.$touch();
        if (vDocker$.value.$invalid) {
          submitted.value = false;
          return false;
        }
      }
      apiRoute.value = routes.HOST_SYSTEM;
      const payload = {
        customerId: state.customerId,
        instanceType: state.instanceType,
        operatingSystemId: state.operatingSystem,
        systemHostId: state.host,
        hostingType: state.hostingType,
        systemName: state.systemName,
        distributedFilesystems: state.filesystem,
        databaseClouds: state.databaseCloud,
      };
      if (state.hostingType == "docker") {
        payload.diskSize = stateDocker.databaseDiskSize;
        payload.systemLanguage = stateDocker.language;
        payload.systemSize = stateDocker.size;
        payload.url = stateDocker.url;
      }
      if (state.hostingType == "vm") {
        payload.host = stateVm.host;
        payload.serverPort = stateVm.serverPort;
        payload.softwareId = stateVm.software;
        payload.softwareVersionId = stateVm.version;
        payload.username = stateVm.username;
        payload.password = stateVm.password;
      }
      storeFunc(payload, "/system/hosting");
    }
  },
  validationRules = {
    customerId: { required },
    instanceType: { required },
    operatingSystem: { required },
    host: { required },
    hostingType: { required },
    systemName: { required },
  },
  validationRulesVm = {
    host: { required },
    serverPort: { required },
    software: { required },
    version: { required },
    username: { required },
    password: { required },
  },
  validationRulesDocker = {
    databaseDiskSize: { required },
    language: { required },
    size: { required },
    url: { required },
  },
  v$ = useVuelidate(validationRules, state),
  vm$ = useVuelidate(validationRulesVm, stateVm),
  vDocker$ = useVuelidate(validationRulesDocker, stateDocker),
  { items } = useTranslatedBreadCrumbs(breadCrumbsConfig),
  { title } = useTitle("Hosting create");

const customerList = () => {
  showGenericListing(routes.COMPANY).then((response: any) => {
    customers.value = response?.data?.customers.map((customer: any) => {
      return {
        text: customer.name,
        value: customer.id,
      };
    });
  });
};

const databaseCloudList = () => {
  showGenericListing(routes.DATABASE_CLOUD).then((response: any) => {
    databaseClouds.value = response?.data?.DatabaseClouds.map(
      (databaseCloud: any) => {
        return {
          text: databaseCloud.name,
          value: databaseCloud.id,
        };
      }
    );
  });
};

const productSoftwaresList = () => {
  showGenericListing(routes.PRODUCT_SOFTWARE).then((response: any) => {
    softwares.value = response?.data?.productSoftware.map((software: any) => {
      return {
        text: software.name,
        value: software.id,
      };
    });
  });
};

const fileSystemList = () => {
  showGenericListing(routes.DISTRIBUTED_FILESYSTEM).then((response: any) => {
    filesystems.value = response?.data?.DistributedFileSystems.map(
      (filesystem: any) => {
        return {
          text: filesystem.name,
          value: filesystem.id,
        };
      }
    );
  });
};

const operatingSystemsList = () => {
  showGenericListing(routes.OPERATING_SYSTEM).then((response: any) => {
    operatingSystems.value = response?.data?.operatingSystems.map(
      (operatingSystem: any) => {
        return {
          text: operatingSystem.name,
          value: operatingSystem.id,
        };
      }
    );
  });
};

const hostsList = () => {
  showGenericListing(routes.SYSTEM_HOST).then((response: any) => {
    hosts.value = response?.data?.SystemHosts.map((host: any) => {
      return {
        text: host.serverIp,
        value: host.id,
      };
    });
  });
};

const getVersions = (val) => {
  stateVm.version = "";
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

function refresh() {
  customerList();
  databaseCloudList();
  fileSystemList();
  operatingSystemsList();
  hostsList();
  productSoftwaresList();
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
                <elements-tooltip/>
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
                    :textLabel="$t('System Type')"
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
              <div class="col-md-6">
                <div class="form-group">
                  <elements-multiselect
                    v-model="state.databaseCloud"
                    :options="databaseClouds"
                    label="text"
                    track-by="value"
                    :textLabel="$t('Database Cloud')"
                    :multiple="true"
                  />
                </div>
              </div>
              <div class="col-md-6">
                <div class="form-group">
                  <elements-multiselect
                    v-model="state.filesystem"
                    :options="filesystems"
                    label="text"
                    track-by="value"
                    :textLabel="$t('Filesystem')"
                    :multiple="true"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="card mt-4">
          <div class="card-header d-flex align-items-center">
                <h3 class="card-title me-2">
                  {{ $t("Host System Details") }}
                </h3>
                <elements-tooltip/>
              </div>
          <div class="card-body">
            <div class="row">
              <div class="col-md-6">
                <div class="form-group">
                  <elements-multiselect
                    v-model="state.host"
                    :options="hosts"
                    label="text"
                    track-by="value"
                    :textLabel="$t('Hosts')"
                    :required="true"
                    :class="{ 'is-invalid': v$.host.$error }"
                  />
                  <div v-if="v$.host.$error" class="invalid-feedback">
                    <span class="text-danger" v-if="v$.host.required">{{
                      $t("This value is required")
                    }}</span
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
                  {{ $t("Fill Hosting Details") }}
                </h3>
                <elements-tooltip/>
              </div>
          <div class="card-body">
            <div class="row">
              <div class="col-md-6">
                <div class="form-group">
                  <elements-multiselect
                    v-model="state.hostingType"
                    :options="hostingTypes"
                    label="text"
                    track-by="value"
                    :key="state.hostingType"
                    :textLabel="$t('Hosting Type')"
                    :required="true"
                    :class="{ 'is-invalid': v$.hostingType.$error }"
                  />
                  <div v-if="v$.hostingType.$error" class="invalid-feedback">
                    <span class="text-danger" v-if="v$.hostingType.required">{{
                      $t("This value is required")
                    }}</span
                    ><br />
                  </div>
                </div>
              </div>
              <div class="col-md-6">
                <div class="form-group">
                  <elements-input
                    v-model="state.systemName"
                    :label="$t('System Name')"
                    :required="true"
                    id="serverIp"
                    :disabled="state.submitted"
                    :class="{ 'is-invalid': v$.systemName.$error }"
                  />
                  
                </div>
                <div v-if="v$.systemName.$error" class="invalid-feedback">
                    <span class="text-danger" v-if="v$.systemName.required">{{
                      $t("This value is required")
                    }}</span
                    ><br />
                  </div>
              </div>
            </div>
            <div class="row" v-if="state.hostingType == 'vm'">
              <div class="col-md-6">
                <div class="form-group">
                  <elements-input
                    v-model="stateVm.host"
                    :label="$t('Host')"
                    :required="true"
                    id="serverIp"
                    :disabled="stateVm.submitted"
                    :class="{ 'is-invalid': vm$.host.$error }"
                  />
                  
                </div>
                <div v-if="vm$.host.$error" class="invalid-feedback">
                    <span class="text-danger" v-if="vm$.host.required">{{
                      $t("This value is required")
                    }}</span
                    ><br />
                  </div>
              </div>
              <div class="col-md-6">
                <div class="form-group">
                  <elements-input
                    v-model="stateVm.serverPort"
                    :label="$t('Port')"
                    :required="true"
                    id="port"
                    :disabled="stateVm.submitted"
                    :class="{ 'is-invalid': vm$.serverPort.$error }"
                  />
                  
                </div>
                <div v-if="vm$.serverPort.$error" class="invalid-feedback">
                    <span class="text-danger" v-if="vm$.serverPort.required">{{
                      $t("This value is required")
                    }}</span
                    ><br />
                  </div>
              </div>
              <div class="col-lg-6 col-md-6">
                <div class="form-group">
                  <elements-multiselect
                    v-model="stateVm.software"
                    :options="softwares"
                    label="text"
                    track-by="value"
                    @select="getVersions"
                    :textLabel="$t('Software')"
                    :required="true"
                    :class="{ 'is-invalid': vm$.software.$error }"
                  />
                  
                </div>
                <div v-if="vm$.software.$error" class="invalid-feedback">
                    <span class="text-danger" v-if="vm$.software.required">{{
                      $t("This value is required")
                    }}</span
                    ><br />
                  </div>
              </div>
              <div class="col-lg-6 col-md-6">
                <div class="form-group">
                  <elements-multiselect
                    v-model="stateVm.version"
                    :key="stateVm.version"
                    :options="versions"
                    label="text"
                    track-by="value"
                    :textLabel="$t('Version')"
                    :required="true"
                    :class="{ 'is-invalid': vm$.version.$error }"
                  />
                  
                </div>
                <div v-if="vm$.version.$error" class="invalid-feedback">
                    <span class="text-danger" v-if="vm$.version.required">{{
                      $t("This value is required")
                    }}</span
                    ><br />
                  </div>
              </div>
              <div class="col-md-6">
                <div class="form-group">
                  <div class="input-group">
                    <div class="input-group-prepend">
                        <div class="input-group-text"><elements-icon v-bind:icon="'userIcon'"/></div>
                    </div>
                  <elements-input
                    v-model="stateVm.username"
                    :label="$t('Username')"
                    :required="true"
                    id="userName"
                    :disabled="stateVm.submitted"
                    :class="{ 'is-invalid': vm$.username.$error }"
                  />
                  </div>
                  
                </div>
                <div v-if="vm$.username.$error" class="invalid-feedback">
                    <span class="text-danger" v-if="vm$.username.required">{{
                      $t("This value is required")
                    }}</span
                    ><br />
                  </div>
              </div>
              <div class="col-md-6">
                <div class="form-group">
                  <div class="input-group">
                    <div class="input-group-prepend">
                        <div class="input-group-text"><elements-icon v-bind:icon="'eyeIcon'"/></div>
                    </div>
                  <elements-input
                    v-model="stateVm.password"
                    :label="$t('Password')"
                    :required="true"
                    id="password"
                    :type="'password'"
                    :disabled="stateVm.submitted"
                    :class="{ 'is-invalid': vm$.password.$error }"
                  />
                  </div>
                  
                </div>
                <div v-if="vm$.password.$error" class="invalid-feedback">
                    <span class="text-danger" v-if="vm$.password.required">{{
                      $t("This value is required")
                    }}</span
                    ><br />
                  </div>
              </div>
            </div>
            <div class="row" v-if="state.hostingType == 'docker'">
              <div class="col-md-6">
                <div class="form-group">
                  <elements-input
                    v-model="stateDocker.databaseDiskSize"
                    :label="$t('Database Disk Size')"
                    :required="true"
                    id="databaseDiskSize"
                    :disabled="stateDocker.submitted"
                    :class="{ 'is-invalid': vDocker$.databaseDiskSize.$error }"
                  />
                  
                </div>
                <div
                    v-if="vDocker$.databaseDiskSize.$error"
                    class="invalid-feedback"
                  >
                    <span
                      class="text-danger"
                      v-if="vDocker$.databaseDiskSize.required"
                      >{{ $t("This value is required") }}</span
                    ><br />
                  </div>
              </div>
              <div class="col-md-6">
                <div class="form-group">
                  <elements-input
                    v-model="stateDocker.language"
                    :label="$t('System Language')"
                    :required="true"
                    id="port"
                    :disabled="stateDocker.submitted"
                    :class="{ 'is-invalid': vDocker$.language.$error }"
                  />
                  
                </div>
                <div v-if="vDocker$.language.$error" class="invalid-feedback">
                    <span
                      class="text-danger"
                      v-if="vDocker$.language.required"
                      >{{ $t("This value is required") }}</span
                    ><br />
                  </div>
              </div>
              <div class="col-lg-6 col-md-6">
                <div class="form-group">
                  <elements-multiselect
                    v-model="stateDocker.size"
                    :options="sizes"
                    label="text"
                    track-by="value"
                    :textLabel="$t('System Size')"
                    :required="true"
                    :class="{ 'is-invalid': vDocker$.size.$error }"
                  />
                  
                </div>
                <div v-if="vDocker$.size.$error" class="invalid-feedback">
                    <span class="text-danger" v-if="vDocker$.size.required">{{
                      $t("This value is required")
                    }}</span
                    ><br />
                  </div>
              </div>
              <div class="col-md-6">
                <div class="form-group">
                  <div class="input-group">
                    <div class="input-group-prepend">
                        <div class="input-group-text"><elements-icon v-bind:icon="'urlIcon'"/></div>
                    </div>
                  <elements-input
                    v-model="stateDocker.url"
                    :label="$t('URL')"
                    :required="true"
                    id="port"
                    :disabled="stateDocker.submitted"
                    :class="{ 'is-invalid': vDocker$.url.$error }"
                  />
                  </div>
                  
                </div>
                <div v-if="vDocker$.url.$error" class="invalid-feedback">
                    <span class="text-danger" v-if="vDocker$.url.required">{{
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
          <submittal-button @click.prevent="store" :isLoading="submitted" :icon-name="'saveIcon'" :buttonName="$t('Save and Proceed')" />
        </div>
      </div>
    </div>
  </div>
</template>
