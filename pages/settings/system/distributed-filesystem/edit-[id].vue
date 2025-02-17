<script setup lang="ts">
import { ref, reactive } from "vue";
import {
  distributedFilesystemUpdateRequest,
  distributedFilesystemShowRequest,
} from "~/utils/apiRequests";
import commonCode from "~/composables/common";
import { useVuelidate } from "@vuelidate/core";
import { required } from "@vuelidate/validators";
import { useLayoutStore } from "~/store/layout";

import {
  useTranslatedBreadCrumbs,
  useTitle,
} from "~/composables/useTranslated";


const { router, Toast } = commonCode(),
  { t } = useI18n(),
  state = reactive({
    isLoading: false,
    submitted: false,
    subType: "",
    instanceType: "",
    name: "",
  }),
  distributedFilesystemId = router.params.id,
  state2 = reactive({
    submitted: false,
    serverIp: "",
    port: "",
    userAddress: "",
    password: "",
  }),
  validationRules = {
    subType: { required },
    instanceType: { required },
    name: { required },
  },
  validationRules2 = {
    serverIp: { required },
    port: { required },
    userAddress: { required },
    password: { required },
  },
  v$ = useVuelidate(validationRules, state),
  v2$ = useVuelidate(validationRules2, state2),
  breadCrumbsConfig = [
    {
      text: "Global Settings",
      to: "/",
    },
    {
      text: "System",
      to: "/",
    },
    {
      text: "Distributed Filesystems",
      to: "/settings/system/distributed-filesystem",
    },
    {
      text: "Edit",
      active: true,
    },
  ],

  { title } = useTitle("Edit Distributed Filesystems"),
  { items } = useTranslatedBreadCrumbs(breadCrumbsConfig);

const rows = ref([]);
const isMaster = ref(false);
const subTypes = ref([
  {
    value: "private",
    text: "Private",
  },
  {
    value: "public",
    text: "Public",
  },
]);
const instanceTypes = ref([
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
]);
function refresh() {
  const layout = useLayoutStore();
  layout.changeLoaderValue(true);
  distributedFilesystemShowRequest(distributedFilesystemId).then((response) => {
    layout.changeLoaderValue(false);
    state.name = response.data?.name;
    (state.subType = response.data?.subType),
      (state.instanceType = response.data?.instanceType),
      (rows.value = response.data?.cloudServers);
  }).catch((error) => {
    layout.changeLoaderValue(false);
  });
}
refresh();
const update = () => {
  state.submitted = true;
  v$.value.$touch();
  if (v$.value.$invalid) {
    state.submitted = false;
    return false;
  } else {
    try {
      const layout = useLayoutStore();
      layout.changeLoaderValue(true);
      state.isLoading = true;
      distributedFilesystemUpdateRequest(
        {
          name: state.name,
          subType: state.subType,
          instanceType: state.instanceType,
          cloudServers: rows.value,
        },
        distributedFilesystemId
      )
        .then((response) => {
          layout.changeLoaderValue(false);
          Toast.fire({
            icon: "success",
            title: t("Record updated successfully!"),
          });
          state.isLoading = false;
          state.submitted = false;
          navigateTo("/settings/system/distributed-filesystem");
        })
        .catch((error) => {
          layout.changeLoaderValue(false);
          state.isLoading = false;
          state.submitted = false;
          Toast.fire({ icon: "error", title: t("something went wrong!") });
        });
    } catch (e) {
      const layout = useLayoutStore();
      layout.changeLoaderValue(false);
      Toast.fire({ title: t("Error!"), text: t("Error"), icon: "error" });
      state.isLoading = false;
      state.submitted = false;
    }
  }
};

const addServer = () => {
  state2.submitted = true;
  v2$.value.$touch();
  if (v2$.value.$invalid) {
    return false;
  } else {
    const obj = {
      serverIp: state2.serverIp,
      port: state2.port,
      userAddress: state2.userAddress,
      password: state2.password,
      isMaster: isMaster,
    };
    rows.value.push(obj);
    state2.submitted = false;
    state2.serverIp = "";
    state2.port = "";
    state2.userAddress = "";
    state2.password = "";
    isMaster.value = false;
  }
};

useHead({
  title: title,
});

const popRow = (index) => {
  rows.value.splice(index, 1);
};
</script>

<template>
  <div>
    <page-header :title="title" :items="items" />
    <div class="row">
      <div class="col-12">
        <div class="card">
          <div class="card-header">
            <h3 class="card-title">{{ $t("Fill Distributed Filesystem Details") }}</h3>
          </div>
          <div class="card-body">
            <div class="row">
              <div class="col-md-4">
                <div class="form-group">
                  <elements-input
                    v-model="state.name"
                    :label="$t('Name')"
                    :required="true"
                    id="name"
                    :disabled="state.submitted"
                    :class="{ 'is-invalid': v$.name.$error }"
                  />
                  <div v-if="v$.name.$error" class="invalid-feedback">
                    <span class="text-danger" v-if="v$.name.required">{{
                      $t("This value is required")
                    }}</span
                    ><br />
                  </div>
                </div>
              </div>
              <div class="col-md-4">
                <div class="form-group">
                  <!-- <label for="">Sub Type</label> -->
                  <select
                    class="form-control"
                    v-model="state.subType"
                    :class="{ 'is-invalid': v$.subType.$error }"
                  >
                    <option
                      v-for="option in subTypes"
                      :value="option?.value"
                      :key="option?.value"
                    >
                      {{ option?.text }}
                    </option>
                  </select>
                  <label for="" class="input-label"
                    >{{ $t("Sub Type")
                    }}<span style="color: red">*</span></label
                  >
                  <div v-if="v$.subType.$error" class="invalid-feedback">
                    <span class="text-danger" v-if="v$.subType.required">{{
                      $t("This value is required")
                    }}</span
                    ><br />
                  </div>
                </div>
              </div>
            </div>
            <div class="row">
              <div class="col-md-4">
                <div class="form-group">
                  <!-- <label for="">Instance Type</label> -->
                  <select
                    class="form-control"
                    v-model="state.instanceType"
                    :class="{ 'is-invalid': v$.instanceType.$error }"
                  >
                    <option
                      v-for="option in instanceTypes"
                      :value="option?.value"
                      :key="option?.value"
                    >
                      {{ option?.text }}
                    </option>
                  </select>
                  <label for="" class="input-label"
                    >{{ $t("Instance Type")
                    }}<span style="color: red">*</span></label
                  >
                  <div v-if="v$.instanceType.$error" class="invalid-feedback">
                    <span class="text-danger" v-if="v$.instanceType.required">{{
                      $t("This value is required")
                    }}</span
                    ><br />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="">
      <div class="row">
        <div class="col-12">
          <div class="card">
            <div class="card-header">
              <h3 class="card-title">{{ $t("Add Multiple Servers") }}</h3>
            </div>
            <div class="card-body">
              <div class="row">
                <div class="col-md-4">
                  <div class="form-group">
                    <elements-input
                      v-model="state2.serverIp"
                      :label="$t('IP Address')"
                      :required="true"
                      id="ip-address"
                      :class="{
                        'is-invalid': v2$.serverIp.$error && state2.submitted,
                      }"
                    />
                    <div
                      v-if="v2$.serverIp.$error && state2.submitted"
                      class="invalid-feedback"
                    >
                      <span
                        class="text-danger"
                        v-if="v2$.serverIp.required && state2.submitted"
                        >{{ $t("This value is required") }}</span
                      ><br />
                    </div>
                  </div>
                </div>
                <div class="col-md-4">
                  <div class="form-group">
                    <elements-input
                      v-model="state2.port"
                      :label="$t('Port')"
                      :required="true"
                      id="port"
                      :class="{
                        'is-invalid': v2$.port.$error && state2.submitted,
                      }"
                    />
                    <div
                      v-if="v2$.port.$error && state2.submitted"
                      class="invalid-feedback"
                    >
                      <span
                        class="text-danger"
                        v-if="v2$.port.required && state2.submitted"
                        >{{ $t("This value is required") }}</span
                      ><br />
                    </div>
                  </div>
                </div>
              </div>
              <div class="row">
                <div class="col-md-4">
                  <div class="form-group">
                    <elements-input
                      v-model="state2.userAddress"
                      :label="$t('User Address')"
                      :required="true"
                      id="user-address"
                      :class="{
                        'is-invalid':
                          v2$.userAddress.$error && state2.submitted,
                      }"
                    />
                    <div
                      v-if="v2$.userAddress.$error && state2.submitted"
                      class="invalid-feedback"
                    >
                      <span
                        class="text-danger"
                        v-if="v2$.userAddress.required && state2.submitted"
                        >{{ $t("This value is required") }}</span
                      ><br />
                    </div>
                  </div>
                </div>
                <div class="col-md-4">
                  <div class="form-group">
                    <elements-input
                      v-model="state2.password"
                      :label="$t('Password For Servers')"
                      :required="true"
                      :type="'password'"
                      id="password"
                      :class="{
                        'is-invalid': v2$.password.$error && state2.submitted,
                      }"
                    />
                    <div
                      v-if="v2$.password.$error && state2.submitted"
                      class="invalid-feedback"
                    >
                      <span
                        class="text-danger"
                        v-if="v2$.password.required && state2.submitted"
                        >{{ $t("This value is required") }}</span
                      ><br />
                    </div>
                  </div>
                </div>
                <div class="col-md-4">
                  <div class="form-group d-flex align-items-center">
                    <label class="me-2" for="">{{ $t("Is Master") }}</label>
                    <input type="checkbox" id="checkbox" v-model="isMaster" />
                  </div>
                </div>
              </div>
              <div class="row mt-3">
                <div class="col-8">
                  <button
                    @click="addServer()"
                    class="secondary-btn float-right"
                  >
                   {{ $t("Add Server") }}
                  </button>
                </div>
              </div>
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
                <th>{{ $t("IP Address") }}</th>
            <th>{{ $t("Port") }}</th>
            <th>{{ $t("Address") }}</th>
            <th>{{ $t("Password") }}</th>
            <th>{{ $t("Actions") }}</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(item, index) in rows" :key="index">
                  <td>{{ item?.serverIp }}</td>
                  <td>{{ item?.port }}</td>
                  <td>{{ item?.userAddress }}</td>
                  <td style="text-security: disc">{{ item?.password }}</td>
                  <td>
                    <i
                      class="mdi mdi-delete edit-icon"
                      @click="popRow(index)"
                    ></i>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <div class="mt-3 d-flex align-items-center justify-content-end">
        <button
          class="primary-btn me-3"
          @click="navigateTo('/settings/system/distributed-filesystem')"
        >
          <elements-icon v-bind:icon="'cancelIcon'" class="me-2" />
          <span>{{ $t("Cancel") }}</span>
        </button>
        <submittal-button
          :isLoading="state.submitted"
          @click="update()"
          :iconName="'updateIcon'"
          :buttonName="$t('Update')"
        />
      </div>
    </div>
  </div>
</template>
