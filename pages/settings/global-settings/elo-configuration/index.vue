<script setup lang="ts">
import { useVuelidate } from "@vuelidate/core";
import { required } from "@vuelidate/validators";
import { reactive, onMounted } from "vue";
import { eloConfigRequest, saveEloConfigRequest } from "@/utils/apiRequests";
import commonCode from "~/composables/common";
import { useLayoutStore } from "~/store/layout";

import {
  useTranslatedBreadCrumbs,
  useTitle,
} from "~/composables/useTranslated";

const { router, Toast } = commonCode();
const { t } = useI18n();

const state = reactive({
    isLoading: false,
    username: "",
    password: "",
    eloUrl: "",
  }),
  breadCrumbsConfig = [
    {
      text: "Global Settings",
      to: "/",
    },
    {
      text: "Global Settings",
      to: "/",
    },
    {
      text: "Elo Configuration",
      to: "/settings/global-settings/elo-configuration",
    },
  ],
  optionalItems = {
    searchBar: false,
    isBtnShow: false,
    btnText: "",
    path: "",
  },
  { title } = useTitle("Elo Configuration"),
  { items } = useTranslatedBreadCrumbs(breadCrumbsConfig);

const validationRules = {
  username: { required },
  password: { required },
  eloUrl: { required },
};

useHead({
  title: title,
});

const v$ = useVuelidate(validationRules, state);

onMounted(async function () {
  try {
    const layout = useLayoutStore();
    layout.changeLoaderValue(true);
    const res = await eloConfigRequest();
    layout.changeLoaderValue(false);
    state.username = res?.data?.value?.username;
    state.password = res?.data?.value?.password;
    state.eloUrl = res?.data?.value?.url;
  } catch (e) {
    const layout = useLayoutStore();
    layout.changeLoaderValue(false);
    console.log(e);
  }
});

async function eloConfigHandler() {
  // stop here if form is invalid
  v$.value.$touch();
  if (v$.value.$invalid) {
    return;
  } else {
    try {
      const layout = useLayoutStore();
      layout.changeLoaderValue(true);
      state.isLoading = true;
      const formData = {
        username: state.username,
        password: state.password,
        url: state.eloUrl,
      };
      const res = await saveEloConfigRequest(formData);
      layout.changeLoaderValue(false);
      Toast.fire({
        title: "Success",
        text: "Elo Configuration record saved",
        icon: "success",
      });
      state.isLoading = false;
    } catch (e) {
      const layout = useLayoutStore();
      layout.changeLoaderValue(false);
      console.log(e);
      Toast.fire({ title: t("Error!"), text: t("Error"), icon: "error" });
      state.isLoading = false;
    }
  }
}
</script>

<template>
  <div>
    <page-header
      :title="title"
      :items="items"
      :optionalItems="optionalItems"
      @watchEvent="handleSearch"
    />
    <form @submit.prevent="eloConfigHandler">
      <div class="card">
        <div class="card-header d-flex align-items-center">
          <h3 class="card-title me-2">{{ $t("Save Elo Configuration") }}</h3>
          <elements-tooltip />
        </div>
        <div class="card-body">
          <div class="row">
            <div class="col-lg-8">
              <div class="form-group">
                <div class="input-group">
                  <div class="input-group-prepend">
                    <span class="input-group-text"
                      ><elements-icon v-bind:icon="'urlIcon'"
                    /></span>
                  </div>
                  <elements-input
                    v-model="state.eloUrl"
                    :label="$t('ELO URL')"
                    :required="true"
                    :disabled="state.isLoading"
                    id="eloUrl"
                    :class="{ 'is-invalid': v$.eloUrl.$error }"
                  />
                </div>
              </div>
              <div v-if="v$.eloUrl.$error" class="invalid-feedback">
                <span class="text-danger" v-if="v$.eloUrl.required">{{
                  $t("This value is required")
                }}</span>
              </div>
            </div>
          </div>
          <div class="row">
            <div class="col-lg-4">
              <div class="form-group">
                <div class="input-group">
                  <div class="input-group-prepend">
                    <span class="input-group-text"
                      ><elements-icon v-bind:icon="'userIcon'"
                    /></span>
                  </div>
                  <elements-input
                    v-model="state.username"
                    :label="$t('Username')"
                    :required="true"
                    :disabled="state.isLoading"
                    id="userName"
                    :class="{ 'is-invalid': v$.username.$error }"
                  />
                </div>
              </div>
              <div v-if="v$.username.$error" class="invalid-feedback">
                <span class="text-danger" v-if="v$.username.required">{{
                  $t("This value is required")
                }}</span>
              </div>
            </div>
            <div class="col-lg-4">
              <div class="form-group">
                <div class="input-group">
                  <div class="input-group-prepend">
                    <span class="input-group-text"
                      ><elements-icon v-bind:icon="'eyeIcon'"
                    /></span>
                  </div>
                  <elements-input
                    v-model="state.password"
                    :label="$t('Password')"
                    :required="true"
                    :disabled="state.isLoading"
                    id="password"
                    :class="{ 'is-invalid': v$.password.$error }"
                  />
                </div>
              </div>
              <div v-if="v$.password.$error" class="invalid-feedback">
                <span class="text-danger" v-if="v$.password.required">{{
                  $t("This value is required")
                }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="d-flex align-items-center justify-content-end mt-4">
        <button class="primary-btn me-3">
          <elements-icon v-bind:icon="'cancelIcon'" class="me-2" />
          <span>{{ $t("Cancel") }}</span>
        </button>
        <submittal-button
          :isLoading="state.isLoading"
          :iconName="'saveIcon'"
          :buttonName="$t('Save and Proceed')"
        />
      </div>
    </form>
  </div>
</template>
