<script setup lang="ts">
import { ref, reactive } from "vue";
import {
  systemHostUpdateRequest,
  systemHostShowRequest,
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
    serverIp: "",
    serverPort: "",
    userName: "",
    password: "",
    machineName: "",
  }),
  systemHostId = router.params.id,
  validationRules = {
    serverIp: { required },
    serverPort: { required },
    userName: { required },
    password: { required },
    machineName: { required },
  },
  v$ = useVuelidate(validationRules, state),
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
      text: "System Hosts",
      to: "/settings/system/hosting-system",
    },
    {
      text: "Create",
      active: true,
    },
  ],
  { title } = useTitle("Edit System Hosts"),
  { items } = useTranslatedBreadCrumbs(breadCrumbsConfig);

function refresh() {
  const layout = useLayoutStore();
  layout.changeLoaderValue(true);
  systemHostShowRequest(systemHostId)
    .then((response) => {
      layout.changeLoaderValue(false);
      state.serverIp = response.data?.serverIp;
      (state.serverPort = response.data?.serverPort),
        (state.userName = response.data?.userName),
        (state.password = response.data?.password),
        (state.machineName = response.data?.machineName);
    })
    .catch((error) => {
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
      systemHostUpdateRequest(
        {
          serverIp: state.serverIp,
          serverPort: state.serverPort,
          userName: state.userName,
          password: state.password,
          machineName: state.machineName,
        },
        systemHostId
      )
        .then((response) => {
          layout.changeLoaderValue(false);

          Toast.fire({
            icon: "success",
            title: t("Record created successfully!"),
          });
          state.isLoading = false;
          state.submitted = false;
          navigateTo("/settings/system/hosting-system");
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

useHead({
  title: title,
});
</script>

<template>
  <div>
    <page-header :title="title" :items="items" />

    <div class="card">
      <div class="card-header">
        <h3 class="card-title">{{ $t("Fill System Host Details") }}</h3>
      </div>
      <div class="card-body">
        <div class="row">
          <div class="col-lg-6">
            <div class="form-group">
              <elements-input
                v-model="state.machineName"
                :label="$t('Virtual Machine Name')"
                :required="true"
                id="machine-name"
                :disabled="state.submitted"
                :class="{ 'is-invalid': v$.machineName.$error }"
              />
            </div>
            <div v-if="v$.machineName.$error" class="invalid-feedback">
              <span class="text-danger" v-if="v$.machineName.required">{{
                $t("This value is required")
              }}</span
              ><br />
            </div>
          </div>
        </div>
        <div class="row">
          <div class="col-lg-6">
            <div class="form-group">
              <elements-input
                v-model="state.serverIp"
                :label="$t('Server IP Address')"
                :required="true"
                id="ip-address"
                :disabled="state.submitted"
                :class="{ 'is-invalid': v$.serverIp.$error }"
              />
            </div>
            <div v-if="v$.serverIp.$error" class="invalid-feedback">
              <span class="text-danger" v-if="v$.serverIp.required">{{
                $t("This value is required")
              }}</span
              ><br />
            </div>
          </div>
          <div class="col-lg-6">
            <div class="form-group">
              <elements-input
                v-model="state.serverPort"
                :label="$t('Server Port')"
                :required="true"
                id="port"
                :disabled="state.submitted"
                :class="{ 'is-invalid': v$.serverPort.$error }"
              />
            </div>
            <div v-if="v$.serverPort.$error" class="invalid-feedback">
              <span class="text-danger" v-if="v$.serverPort.required">{{
                $t("This value is required")
              }}</span
              ><br />
            </div>
          </div>
          <div class="col-lg-6">
            <div class="form-group">
              <div class="input-group">
                <div class="input-group-prepend">
                  <span class="input-group-text"
                    ><elements-icon v-bind:icon="`userIcon`"
                  /></span>
                </div>
                <elements-input
                  v-model="state.userName"
                  :label="$t('Username')"
                  :required="true"
                  id="username"
                  :disabled="state.submitted"
                  :class="{ 'is-invalid': v$.userName.$error }"
                />
              </div>
            </div>
            <div v-if="v$.userName.$error" class="invalid-feedback">
              <span class="text-danger" v-if="v$.userName.required">{{
                $t("This value is required")
              }}</span
              ><br />
            </div>
          </div>
          <div class="col-lg-6">
            <div class="form-group">
              <div class="input-group">
                <div class="input-group-prepend">
                  <span class="input-group-text"
                    ><elements-icon v-bind:icon="`eyeIcon`"
                  /></span>
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
      <button
        class="primary-btn me-3"
        @click="navigateTo('/settings/system/hosting-system')"
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
</template>
