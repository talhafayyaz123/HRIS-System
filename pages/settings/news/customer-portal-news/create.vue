<script setup lang="ts">
import { useLayoutStore } from "@/store/layout";
import { ref, reactive } from "vue";
import {
  customerPortalNewsCreateRequest,
  getEmployeeByIdRequest,
} from "~/utils/apiRequests";
import commonCode from "~/composables/common";
import { useVuelidate } from "@vuelidate/core";
import { required } from "@vuelidate/validators";
import { MdEditor } from "md-editor-v3";
import "md-editor-v3/lib/style.css";

import {
  useTranslatedBreadCrumbs,
  useTitle,
} from "~/composables/useTranslated";

const { router, Toast } = commonCode(),
  { t } = useI18n(),
  state = reactive({
    isLoading: false,
    submitted: false,
    subject: "",
    description: "",
    userName: "",
  }),
  breadCrumbsConfig = [
    {
      text: "Global Settings",
      to: "/",
    },
    {
      text: "Customer Portal",
      to: "/",
    },
    {
      text: "News",
      to: "/settings/news/customer-portal-news",
    },
    {
      text: "Create",
      active: true,
    },
  ],

  { title } = useTitle("Create News"),
  { items } = useTranslatedBreadCrumbs(breadCrumbsConfig),

  validationRules = {
    subject: { required },
    description: { required },
  },
  v$ = useVuelidate(validationRules, state);

const store = () => {
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
      customerPortalNewsCreateRequest({
        subject: state.subject,
        description: state.description,
        userId: localStorage.getItem("user_id"),
      })
        .then((response) => {
          layout.changeLoaderValue(false);
          Toast.fire({
            icon: "success",
            title: t("Record created successfully!"),
          });
          state.isLoading = false;
          state.submitted = false;
          navigateTo("/settings/news/customer-portal-news");
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

const refresh = () => {
  const layout = useLayoutStore();
  layout.changeLoaderValue(true);
  var id = localStorage.getItem("user_id");
  getEmployeeByIdRequest({
    id: id,
  })
    .then((response) => {
      layout.changeLoaderValue(false);
      state.userName = response?.first_name + " " + response?.last_name;
    })
    .catch((error) => {
      layout.changeLoaderValue(false);

      Toast.fire({ icon: "error", title: t("Something went wrong") });
    });
};

refresh();

useHead({
  title: title,
});
</script>

<template>
  <div>
    <page-header :title="title" :items="items" />
    <form @submit.prevent="store">
      <div class="">
        <div class="card">
          <div class="card-header d-flex align-items-center">
            <h3 class="card-title me-2">
              {{ $t("Fill News Details") }}
            </h3>
            <ElementsTooltip />
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
                    :disabled="state.submitted"
                    :class="{ 'is-invalid': v$.subject.$error }"
                  />
                </div>
                <div v-if="v$.subject.$error" class="invalid-feedback">
                  <span class="text-danger" v-if="v$.subject.required">{{
                    $t("This value is required")
                  }}</span
                  ><br />
                </div>
              </div>
              <div class="col-lg-6 col-md-6 col-sm-12">
                <div class="form-group">
                  <elements-input
                    readonly
                    v-model="state.userName"
                    :label="$t('Admin')"
                    id="userName"
                    :disabled="state.submitted"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="card mt-3 no-header">
          <div class="card-body">
            <div class="row">
              <div class="col-lg-12">
                <div class="form-group m-0">
                  <MdEditor
                    :preview="false"
                    :style="'height:300px;'"
                    :language="'en-US'"
                    v-model="state.description"
                    :class="{ 'is-invalid': v$.description.$error }"
                    placeholder="Default Input Label"
                  />
                  <div v-if="v$.description.$error" class="invalid-feedback">
                    <span class="text-danger" v-if="v$.description.required">{{
                      $t("This value is required")
                    }}</span
                    ><br />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="mt-3 d-flex align-items-center justify-content-end">
          <button
            class="primary-btn me-3"
            @click="navigateTo('/settings/news/customer-portal-news')"
          >
            <elements-icon v-bind:icon="'cancelIcon'" class="me-2" />
            <span>{{ $t("Cancel") }}</span>
          </button>
          <submittal-button
            :isLoading="state.submitted"
            :iconName="'saveIcon'"
            :buttonName="$t('Save and Proceed')"
          />
        </div>
      </div>
    </form>
  </div>
</template>
