<script setup lang="ts">
import { ref, reactive, watch } from "vue";
import commonCode from "~/composables/common";
import { useVuelidate } from "@vuelidate/core";
import { required } from "@vuelidate/validators";
import { MdEditor } from "md-editor-v3";
import "md-editor-v3/lib/style.css";
import { mailServiceCreateRequest } from "~/utils/apiRequests";
import genericFeatures from "~/composables/generic";
import genericFunctionality from "~/composables/genericFunctionality";
import { useLayoutStore } from "~/store/layout";

import {
  useTranslatedBreadCrumbs,
  useTitle,
} from "~/composables/useTranslated";

const { showGenericListing } = genericFeatures(),
  { submitted, isLoading, apiRoute, storeFunc } = genericFunctionality(),
  { router, Toast } = commonCode(),
  { t } = useI18n(),
  state = reactive({
    subject: "",
    active: "",
    body: "",
  }),
  breadCrumbsConfig = [
    {
      text: "Global Setting",
      to: "/",
    },
    {
      text: "Administration",
      to: "/",
    },
    {
      text: "Mail Templates",
      to: "/settings/administration/mail-templates",
    },
    {
      text: "Create",
      active: true,
    },
  ],
  { title } = useTitle("Create Mail Template"),
  { items } = useTranslatedBreadCrumbs(breadCrumbsConfig),
  validationRules = {
    subject: { required },
    active: { required },
    body: { required },
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
      mailServiceCreateRequest("mail-service/create-mail-template", state)
        .then((response) => {
          layout.changeLoaderValue(false);
          state.subject = "";
          state.body = "";
          state.active = "";
          Toast.fire({
            icon: "success",
            title: "Record created successfully!",
          });
          navigateTo("/settings/administration/mail-templates");
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
  };

useHead({
  title: title,
});
</script>

<template>
  <div>
    <form @submit.prevent="store">
      <page-header :title="title" :items="items" />
      <div class="card">
        <div class="card-header d-flex align-items-center">
          <h3 class="card-title me-2">
            {{ $t("Fill Mail Template Details") }}
          </h3>
          <elements-Tooltip />
        </div>
        <div class="card-body">
          <div class="row">
            <div class="col-lg-6 col-md-6 col-sm-12">
              <div class="form-group">
                <elements-input
                  v-model="state.subject"
                  :label="$t('Subject')"
                  :required="true"
                  id="subject"
                  :disabled="submitted"
                  :class="{ 'is-invalid': v$.subject.$error }"
                />
              </div>
              <div v-if="v$.subject.$error" class="invalid-feedback">
                <span class="text-danger" v-if="v$.subject.required">{{
                  $t("This value is required")
                }}</span>
                <br />
              </div>
            </div>
            <div class="col-lg-6 col-md-6 col-sm-12">
              <div class="form-group">
                <elements-select
                  :required="true"
                  v-model="state.active"
                  :label="$t('Status')"
                  :error="v$.active.$error ? 'is-invalid' : ''"
                >
                  <option :value="0">{{ $t("Inactive") }}</option>
                  <option :value="1">{{ $t("Active") }}</option>
                </elements-select>
              </div>
            </div>
            <div class="col-lg-12 col-md-12 col-sm-12">
              <div class="form-group">
                <MdEditor
                  :preview="false"
                  :style="'height:300px;'"
                  :language="'en-US'"
                  v-model="state.body"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="mt-3 d-flex align-items-center justify-content-end">
        <button
          class="primary-btn me-3"
          @click="navigateTo('/settings/administration/mail-templates')"
        >
          <elements-icon v-bind:icon="'cancelIcon'" class="me-2" />
          <span>{{ $t("Cancel") }}</span>
        </button>
        <submittal-button
          :isLoading="submitted"
          :iconName="'saveIcon'"
          :buttonName="$t('Save and Proceed')"
        />
      </div>
    </form>
  </div>
</template>
