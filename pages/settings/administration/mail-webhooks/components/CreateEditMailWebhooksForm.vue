<script setup lang="ts">
import { useVuelidate } from "@vuelidate/core";
import { required } from "@vuelidate/validators";
import commonCode from "~/composables/common";
import { useLayoutStore } from "~/store/layout";
import {
  mailServiceCreateRequest,
  mailServiceUpdateRequest,
  mailServiceShowRequest,
} from "~/utils/apiRequests";

import { ref, reactive, onMounted } from "vue";

const { router, Toast } = commonCode();
const { t } = useI18n();

const state = reactive({
  isLoading: false,
  name: "",
  reg_ex_content: "",
  reg_ex_subject: "",
  reg_ex_from_mail: "",
  reg_ex_to_mail: "",
  data_eval: "",
  status: "",
  url: "",
});
const code = ref("");
const props = defineProps(["id"]);
const editMailWebhooksId = props.id;

const validationRules = {
  name: { required },
  data_eval: { required },
  status: { required },
  url: { required },
};
const v$ = useVuelidate(validationRules, state);

const statusOptions = [
  { value: "1", text: "Active" },
  { value: "0", text: "Inactive" },
];

// In case of edit, populate country
onMounted(async function () {
  try {
    if (!editMailWebhooksId) {
      // incase of add don't call api
      return;
    }
    state.isLoading = true;
    const layout = useLayoutStore();
    layout.changeLoaderValue(true);
    const res = await mailServiceShowRequest(
      "/mail-service/list-webhook-by-id?id=" + editMailWebhooksId
    );
    const {
      name,
      reg_ex_content,
      reg_ex_subject,
      reg_ex_from_mail,
      reg_ex_to_mail,
      data_eval,
      active,
      url,
    } = res;

    state.name = name;
    state.reg_ex_content = reg_ex_content;
    state.reg_ex_subject = reg_ex_subject;
    state.reg_ex_from_mail = reg_ex_from_mail;
    state.reg_ex_to_mail = reg_ex_to_mail;
    state.data_eval = data_eval;
    state.status = active;
    state.url = url;

    code.value = state.data_eval;

    state.isLoading = false;
    layout.changeLoaderValue(false);
  } catch (e) {
    const layout = useLayoutStore();
    layout.changeLoaderValue(false);
    console.log(e);
    state.isLoading = false;
  }
});

async function mailWebHookHandler() {
  // stop here if form is invalid
  v$.value.$touch();
  if (v$.value.$invalid) {
    return;
  } else {
    try {
      state.isLoading = true;
      const layout = useLayoutStore();
      layout.changeLoaderValue(true);
      const formData = {
        name: state.name,
        ...(state.reg_ex_content && { reg_ex_content: state.reg_ex_content }),
        ...(state.reg_ex_subject && { reg_ex_subject: state.reg_ex_subject }),
        ...(state.reg_ex_from_mail && {
          reg_ex_from_mail: state.reg_ex_from_mail,
        }),
        ...(state.reg_ex_to_mail && {
          reg_ex_to_mail: state.reg_ex_to_mail,
        }),
        data_eval: state.data_eval,
        ...(state.status === "active" ? { active: 1 } : { active: 0 }),
        url: state.url,
        ...(editMailWebhooksId && {
          // for update
          id: editMailWebhooksId,
        }),
      };

      const res = editMailWebhooksId
        ? mailServiceCreateRequest("/mail-service/update-webhook", formData)
        : mailServiceCreateRequest("/mail-service/create-webhook", formData);
      layout.changeLoaderValue(false);
      Toast.fire({
        title: editMailWebhooksId
          ? "Record updated successfully!"
          : "Record created successfully!",
        icon: "success",
      });
      state.isLoading = false;
      navigateTo("/settings/administration/mail-webhooks");
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
  <form @submit.prevent="mailWebHookHandler">
    <div class="card">
      <div class="card-header d-flex align-items-center">
        <h3 class="card-title me-2">{{ $t("Fill Mail Webhook Details") }}</h3>
        <elements-tooltip />
      </div>
      <div class="card-body">
        <div class="row">
          <div class="col-lg-6">
            <div class="form-group">
              <elements-input
                v-model="state.name"
                :label="$t('Name')"
                :required="true"
                :disabled="state.isLoading"
                id="name"
                :class="{ 'is-invalid': v$.name.$error }"
              />
            </div>
            <div v-if="v$.name.$error" class="invalid-feedback">
              <span class="text-danger" v-if="v$.name.required">{{
                $t("This value is required")
              }}</span>
            </div>
          </div>
          <div class="col-lg-6">
            <div class="form-group">
              <elements-input
                v-model="state.reg_ex_content"
                :label="$t('Regex content')"
                :disabled="state.isLoading"
                id="reg_ex_content"
              />
            </div>
          </div>
          <div class="col-lg-6">
            <div class="form-group">
              <elements-input
                v-model="state.reg_ex_subject"
                :label="$t('Regex Subject')"
                :disabled="state.isLoading"
                id="reg_ex_subject"
              />
            </div>
          </div>
          <div class="col-lg-6">
            <div class="form-group">
              <elements-input
                v-model="state.reg_ex_from_mail"
                :label="$t('Regex From Mail')"
                :disabled="state.isLoading"
                id="reg_ex_from_mail"
              />
            </div>
          </div>
          <div class="col-lg-6">
            <div class="form-group">
              <elements-input
                v-model="state.reg_ex_to_mail"
                :label="$t('Regex To Mail')"
                :disabled="state.isLoading"
                id="reg_ex_to_mail"
              />
            </div>
          </div>

          <div class="col-lg-12">
            <p class="form-label">
              <span class="text-red-500">*&nbsp;</span>{{ $t("Data Eval") }}:
            </p>
            <MonacoEditor
              @contentChange="state.data_eval = $event"
              :readOnly="false"
              :codeString="code"
              :language="'php'"
              height="300px"
            />
          </div>

          <div v-if="v$.data_eval.$error" class="invalid-feedback">
            <span class="text-danger" v-if="v$.data_eval.required">{{
              $t("This value is required")
            }}</span>
          </div>

          <div class="col-lg-6">
            <div class="form-group">
              <elements-multiselect
                v-model="state.status"
                :options="statusOptions"
                :key="state.status"
                label="text"
                track-by="value"
                :textLabel="$t('Status')"
                :required="true"
                :class="{ 'is-invalid': v$.status.$error }"
              />

              <div v-if="v$.status.$error" class="invalid-feedback">
                <span class="text-danger" v-if="v$.status.required">{{
                  $t("This value is required")
                }}</span>
              </div>
            </div>
          </div>

          <div class="col-lg-6">
            <div class="form-group">
              <elements-input
                v-model="state.url"
                :label="$t('Url')"
                :required="true"
                :disabled="state.isLoading"
                id="url"
                :class="{ 'is-invalid': v$.url.$error }"
              />
            </div>
            <div v-if="v$.url.$error" class="invalid-feedback">
              <span class="text-danger" v-if="v$.url.required">{{
                $t("This value is required")
              }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="mt-3 d-flex align-items-center justify-content-end">
      <button
        class="primary-btn me-3"
        @click="navigateTo('/settings/global-settings/countries')"
      >
        <elements-icon v-bind:icon="'cancelIcon'" class="me-2" />
        <span>{{ $t("Cancel") }}</span>
      </button>
      <submittal-button
        :isLoading="state.isLoading"
        :icon-name="'saveIcon'"
        :buttonName="$t('Save and Proceed')"
      />
    </div>
  </form>
</template>
