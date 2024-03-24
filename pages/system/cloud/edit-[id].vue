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
  { submitted, isLoading, apiRoute, updateFunc, showFunc } =
    genericFunctionality(),
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
      text: "Cloud",
      to: "/system/cloud",
    },
    {
      text: "Edit",
      active: true,
    },
  ],
  repoError = ref(""),
  tenantNameError = ref(""),
  cloudId = router.params.id,
  repos = ref([]),
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
          const payload = {
            customerId: state.customerId,
            cloudSystemId: state.cloudystem,
            tenantName: state.tenantName,
            url: state.url,
            databaseClouds: state.databaseCloud,
            distributedFilesystems: state.filesystem,
            tenantRepositories: repos.value,
          };
          updateFunc(payload, cloudId, "/system/cloud");
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
  { title } = useTitle("Cloud Edit");

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
apiRoute.value = routes.SYSTEM_CLOUD;

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
  showGenericListing(routes.CLOUD_SYSTEM).then((response: any) => {
    cloudSystems.value = response?.data?.CloudSystems.map(
      (cloudSystem: any) => {
        return {
          text: cloudSystem.name,
          value: cloudSystem.id,
        };
      }
    );
  });
};

async function getCloud() {
  const layout = useLayoutStore();
  layout.changeLoaderValue(true);
  let response = await showFunc(cloudId);
  if (!!response?.success) {
    state.customerId = response?.data?.customerId;
    state.cloudystem = response?.data?.cloudSystemId;
    state.tenantName = response?.data?.tenantName;
    repos.value = response?.data?.tenantRepositories;
    state.url = response?.data?.url;
    for (const item of response?.data?.databaseClouds) {
      state.databaseCloud.push(item);
    }
    for (const item of response?.data?.distributedFilesystems) {
      state.filesystem.push(item);
    }
  }
  layout.changeLoaderValue(false);
}

function valueChanged(val) {
  tenantNameError.value = "";
  const targetCustomer = customers.value.find(
    (customer) => customer.value === val
  );
  state.tenantName = targetCustomer?.text.replace(/ /g, "_");
}

function refresh() {
  customerList();
  databaseCloudList();
  fileSystemList();
  cloudSystemsList();
  getCloud();
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
        <div class="card">
          <div class="card-header">
            <h3 class="card-title">{{ $t('Tenant') }}</h3>
          </div>
          <div class="card-body">
            <div class="row">
              <div class="col-lg-6 col-md-6">
                <div class="form-group">
                  <elements-multiselect
                    v-model="state.customerId"
                    :options="customers"
                    @select="valueChanged"
                    :key="state.customerId"
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
                    v-model="state.cloudystem"
                    :options="cloudSystems"
                    label="text"
                    :key="state.cloudystem"
                    track-by="value"
                    :textLabel="$t('Cloud System')"
                    :required="true"
                    :class="{ 'is-invalid': v$.cloudystem.$error }"
                  />
                  <div v-if="v$.cloudystem.$error" class="invalid-feedback">
                    <span class="text-danger" v-if="v$.cloudystem.required">{{
                      $t("This value is required")
                    }}</span
                    ><br />
                  </div>
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
                  <div v-if="v$.tenantName.$error" class="invalid-feedback">
                    <span class="text-danger" v-if="v$.tenantName.required">{{
                      $t("This value is required")
                    }}</span
                    ><br />
                  </div>
                  <div>
                    <span>{{
                      $t(
                        "Tenant Name must only contain letters, dashes, and underscores"
                      )
                    }}</span
                    ><br />
                    <span v-if="tenantNameError" class="text-danger">{{
                      tenantNameError
                    }}</span>
                  </div>
                </div>
              </div>
              <div class="col-md-6">
                <div class="form-group">
                  <elements-input
                    v-model="state.url"
                    :label="$t('URL')"
                    id="url"
                    :disabled="state.submitted"
                  />
                </div>
              </div>
              <div class="col-md-6">
                <div class="form-group">
                  <elements-multiselect
                    :key="state.databaseCloud"
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
                  <elements-multiselect' :key="state.filesystem"
                  v-model="state.filesystem" :options="filesystems" label="text"
                  track-by="value" :textLabel="$t('Filesystem')"
                  :multiple="true" />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="card mt-3">
          <div class="card-header">
            <h3 class="card-title">{{ $t('Add Repositories for Tenant') }}</h3>
          </div>
          <div class="card-body">
            <div class="row">
              <div class="col-md-6">
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
              </div>
              <div class="col-lg-6 col-md-6">
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
                  <label for="" class="input-label"
                    >Text <span style="color: red">*</span></label
                  >
                </div>
              </div>
              <div class="col-lg-12">
                <submittal-button
                  @click="addRepo()"
                  :isLoading="state2.isLoading"
                  :buttonName="$t('Add Repository')"
                />
              </div>
            </div>
          </div>
        </div>
        <div class="row">
          <div class="col-12">
            <div class="table-responsive mt-3">
              <table class="doc-table table">
                <thead>
                  <tr>
                    <th>{{ $t("Name") }}</th>
                    <th>{{ $t("Text") }}</th>
                    <th>{{ $t("Action") }}</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(item, index) in repos" :key="index">
                    <td>{{ item?.name }}</td>
                    <td>{{ item?.text }}</td>
                    <td>
                      <i
                        class="mdi mdi-delete edit-icon"
                        @click.prevent="popRepo(index)"
                      ></i>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <span v-if="repoError" class="text-danger">{{ repoError }}</span>
          </div>
        </div>
        <div class="form-group text-right mt-3">
          <submittal-button
            @click.prevent="store"
            :isLoading="submitted"
            :buttonName="$t('Edit System')"
          />
        </div>
      </div>
    </div>
  </div>
</template>
