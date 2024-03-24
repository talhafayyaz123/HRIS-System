<script setup lang="ts">
import { ref, reactive } from "vue";
import { routes } from "~/utils/apiRoutes";
import commonCode from "~/composables/common";
import genericFeatures from "~/composables/generic";
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
      to: "/",
    },
    {
      text: "Cloud",
      to: "/system/cloud",
    },
    {
      text: "Create",
      active: true,
    },
  ],
  repos = ref([]),
  repoError = ref(""),
  tenantNameError = ref(""),
  cloudSystems = ref([]),
  databaseClouds = ref([]),
  filesystems = ref([]),
  customers = ref([]),
  state = reactive({
    isLoading: false,
    submitted: false,
    customerId: "",
    cloudystem: "",
    tenantName: "",
    url: "",
    filesystem: [],
    databaseCloud: [],
  }),
  store = () => {
    repoError.value = "";
    tenantNameError.value = "";
    submitted.value = true;
    //stop here if form is invalid
    v$.value.$touch();
    if (v$.value.$invalid) {
      submitted.value = false;
      return false;
    } else {
      if (repos.value.length == 0) {
        repoError.value = "Please enter atleast one repository";
        submitted.value = false;
      } else {
        const nameRegex = /^[A-Za-z\-_]+$/;
        if (!nameRegex.test(state.tenantName)) {
          submitted.value = false;
          tenantNameError.value =
            "Tenant Name must only contain letters, dashes, and underscores.";
        } else {
          apiRoute.value = routes.SYSTEM_CLOUD;
          const payload = {
            customerId: state.customerId,
            cloudSystemId: state.cloudystem,
            tenantName: state.tenantName,
            url: state.url,
            databaseClouds: state.databaseCloud,
            distributedFilesystems: state.filesystem,
            tenantRepositories: repos.value,
          };
          storeFunc(payload, "/system/cloud");
        }
      }
    }
  },
  validationRules = {
    customerId: { required },
    cloudystem: { required },
    tenantName: { required },
  },
  v$ = useVuelidate(validationRules, state),
  state2 = reactive({
    isLoading: false,
    submitted: false,
    name: "",
    text: "",
  }),
  validationRules2 = {
    name: { required },
    text: { required },
  },
  v2$ = useVuelidate(validationRules2, state2),
  { items } = useTranslatedBreadCrumbs(breadCrumbsConfig),
  { title } = useTitle("Cloud create");

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

const cloudSystemsList = () => {
  const layout = useLayoutStore();
  layout.changeLoaderValue(TextTrackCueList);
  showGenericListing(routes.CLOUD_SYSTEM).then((response: any) => {
    cloudSystems.value = response?.data?.CloudSystems.map(
      (cloudSystem: any) => {
        return {
          text: cloudSystem.name,
          value: cloudSystem.id,
        };
      }
    );
  }).finally(() => {
      layout.changeLoaderValue(false);
    });
};

function refresh() {
  customerList();
  databaseCloudList();
  fileSystemList();
  cloudSystemsList();
}

function valueChanged(val) {
  tenantNameError.value = "";
  const targetCustomer = customers.value.find(
    (customer) => customer.value === val
  );
  state.tenantName = targetCustomer?.text.replace(/ /g, "_");
}

refresh();

async function popRepo(index) {
  await deleteAlert().then((result: { isConfirmed: any }) => {
    if (result.isConfirmed) {
      repos.value.splice(index, 1);
    }
  });
}

function addRepo() {
  state2.submitted = true;
  v2$.value.$touch();
  if (v2$.value.$invalid) {
    return false;
  } else {
    repoError.value = "";
    const obj = {
      name: state2.name,
      text: state2.text,
    };
    repos.value.push(obj);
    state2.submitted = false;
    state2.name = "";
    state2.text = "";
  }
}

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
                {{ $t("Tennant") }}
              </button>
            </li>
          </ul>
        </div>
        <div class="card mt-4">
          <div class="card-header d-flex align-items-center">
            <h3 class="card-title me-2">
              {{ $t("Fill Tenant Details") }}
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
                    @select="valueChanged"
                    :textLabel="$t('Customer')"
                    :required="true"
                    :class="{ 'is-invalid': v$.customerId.$error }"
                  />
                </div>
                <div v-if="v$.customerId.$error" class="invalid-feedback">
                  <span class="text-danger" v-if="v$.customerId.required">{{
                    $t("This value is required")
                  }}</span
                  ><br />
                </div>
              </div>
              <div class="col-lg-6 col-md-6">
                <div class="form-group">
                  <elements-multiselect
                    v-model="state.cloudystem"
                    :options="cloudSystems"
                    label="text"
                    track-by="value"
                    :textLabel="$t('Cloud System')"
                    :required="true"
                    :class="{ 'is-invalid': v$.cloudystem.$error }"
                  />
                </div>
                <div v-if="v$.cloudystem.$error" class="invalid-feedback">
                  <span class="text-danger" v-if="v$.cloudystem.required">{{
                    $t("This value is required")
                  }}</span
                  ><br />
                </div>
              </div>
              <div class="col-md-6">
                <div class="form-group">
                  <elements-input
                    v-model="state.tenantName"
                    :label="$t('Tenant Name')"
                    :required="true"
                    id="tenantName"
                    :disabled="state.submitted"
                    :class="{ 'is-invalid': v$.tenantName.$error }"
                  />
                </div>
                <div v-if="v$.tenantName.$error" class="invalid-feedback">
                  <span class="text-danger" v-if="v$.tenantName.required">{{
                    $t("This value is required")
                  }}</span
                  ><br />
                </div>
                <div>
                  <span>{{
                    $t(
                      "Note:- Tenant Name must only contain letters, dashes, and underscores"
                    )
                  }}</span
                  ><br />
                  <span v-if="tenantNameError" class="text-danger">{{
                    tenantNameError
                  }}</span>
                </div>
              </div>
              <div class="col-md-6">
                <div class="form-group">
                  <div class="input-group">
                    <div class="input-group-prepend">
                      <div class="input-group-text">
                        <elements-icon v-bind:icon="'urlIcon'" />
                      </div>
                    </div>
                    <elements-input
                      v-model="state.url"
                      :label="$t('URL')"
                      id="url"
                      :disabled="state.submitted"
                    />
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
              {{ $t("Add Repositories for Tenant") }}
            </h3>
            <elements-tooltip />
          </div>
          <div class="card-body">
            <div class="row">
              <div class="col-md-12">
                <div class="form-group">
                  <elements-input
                    v-model="state2.name"
                    :label="$t('Name')"
                    id="name"
                    :required="true"
                    :disabled="state.submitted"
                    :class="{
                      'is-invalid': v2$.name.$error && state2.submitted,
                    }"
                  />
                </div>
                <div
                  v-if="v2$.name.$error && state2.submitted"
                  class="invalid-feedback"
                >
                  <span
                    class="text-danger"
                    v-if="v2$.name.required && state2.submitted"
                    >{{ $t("This value is required") }}</span
                  ><br />
                </div>
              </div>
              <div class="col-lg-12">
                <div class="form-group textarea">
                  <textarea
                    v-model="state2.text"
                    cols="30"
                    rows="10"
                    class="form-control"
                    placeholder="."
                    :class="{
                      'is-invalid': v2$.text.$error && state2.submitted,
                    }"
                  ></textarea>

                  <label for="" class="input-label"
                    >Text <span style="color: red">*</span></label
                  >
                </div>
                <div
                  v-if="v2$.text.$error && state2.submitted"
                  class="invalid-feedback"
                >
                  <span
                    class="text-danger"
                    v-if="v2$.text.required && state2.submitted"
                    >{{ $t("This value is required") }}</span
                  ><br />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="mt-3 d-flex align-items-center justify-content-end">
          <submittal-button
            @click="addRepo()"
            :isLoading="state2.isLoading"
            :iconName="'addIcon'"
            :buttonName="$t('Add Repository')"
          />
        </div>
        <div class="row">
          <div class="col-12">
            <div class="table-responsive mt-3">
              <table v-if="repos.length > 0" class="doc-table table">
                <thead>
                  <tr>
                    <th>{{ $t("Name") }}</th>
                    <th>{{ $t("Text") }}</th>
                    <th style="width:130px">{{ $t("Actions") }}</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(item, index) in repos" :key="index">
                    <td>{{ item?.name }}</td>
                    <td>{{ item?.text }}</td>
                    <td>
                      <elements-icon v-bind:icon="'deleteIcon'" class="cursor-pointer"  @click.prevent="popRepo(index)" />
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <span v-if="repoError" class="text-danger">{{ repoError }}</span>
          </div>
        </div>
        <div class="mt-3 d-flex align-items-center justify-content-end">
          <button class="primary-btn me-3">
            <elements-icon v-bind:icon="'cancelIcon'" class="me-2" />
            <span>{{ $t("Cancel") }}</span>
          </button>
          <submittal-button
            @click.prevent="store"
            :isLoading="submitted"
            :icon-name="'saveIcon'"
            :buttonName="$t('Save and Proceed')"
          />
        </div>
      </div>
    </div>
  </div>
</template>
