<script setup lang="ts">
import { ref, reactive, watch } from "vue";
import commonCode from "~/composables/common";
import { useVuelidate } from "@vuelidate/core";
import { required } from "@vuelidate/validators";
import { MdEditor } from "md-editor-v3";
import "md-editor-v3/lib/style.css";
import {
  mailServiceUpdateRequest,
  mailServiceShowRequest,
} from "~/utils/apiRequests";
import genericFeatures from "~/composables/generic";
import genericFunctionality from "~/composables/genericFunctionality";
import { routes } from "~/utils/apiRoutes";
import { useLayoutStore } from "~/store/layout";

import {
  useTranslatedBreadCrumbs,
  useTitle,
} from "~/composables/useTranslated";

const { showSpecificGenericListing, showGenericListing } = genericFeatures(),
  { submitted, isLoading, apiRoute, storeFunc } = genericFunctionality(),
  { router, Toast } = commonCode(),
  templateId = router.params.id,
  { t } = useI18n(),
  state = reactive({
    id: "",
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
      text: "Edit",
      active: true,
    },
  ],

  { title } = useTitle("Edit Mail Template"),
  { items } = useTranslatedBreadCrumbs(breadCrumbsConfig),

  validationRules = {
    subject: { required },
    active: { required },
    body: { required },
  },
  v$ = useVuelidate(validationRules, state),
  update = () => {
    submitted.value = true;
    //stop here if form is invalid
    v$.value.$touch();
    if (v$.value.$invalid) {
      submitted.value = false;
      return false;
    } else {
      const layout = useLayoutStore();
      layout.changeLoaderValue(true);
      mailServiceUpdateRequest("mail-service/update-mail-template", state)
        .then((response) => {
          layout.changeLoaderValue(false);
          Toast.fire({
            icon: "success",
            title: "Record updated successfully!",
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
  },
  refresh = async () => {
    const layout = useLayoutStore();
    layout.changeLoaderValue(true);
    await mailServiceShowRequest(
      "mail-service/list-mail-template-by-id?id=" + templateId
    )
      .then((response) => {
        state.id = response?.id;
        state.subject = response?.subject;
        state.body = response?.body;
        state.active = response?.active;
        layout.changeLoaderValue(false);
      })
      .finally(() => {
        layout.changeLoaderValue(false);
      });
  };
refresh();
useHead({
  title: title,
});
</script>

<template>
  <div>
    <form @submit.prevent="update">
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
                  id="group-name"
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
                  :key="state.active"
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
          :iconName="'updateIcon'"
          :buttonName="$t('Update')"
        />
      </div>
    </form>
  </div>
</template>
