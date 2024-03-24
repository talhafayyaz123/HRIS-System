<script setup lang="ts">
import { ref, onMounted } from "vue";

import commonCode from "~/composables/common";
import { useVuelidate } from "@vuelidate/core";
import { required } from "@vuelidate/validators";
import {routes} from "~/utils/apiRoutes";
import genericFunctionality from "~/composables/genericFunctionality";
import { docListRequest } from "~/utils/apiRequests";

import {
  useTranslatedBreadCrumbs,
  useTitle,
} from "~/composables/useTranslated";
const
    { router, Toast } = commonCode(),
    { submitted, isLoading, apiRoute, storeFunc } = genericFunctionality(),
    { t } = useI18n(),
    docListOptions = ref([]),
    state = reactive({
        levelName: "",
        name: "",
        documentTemplateId: "",
        periodDay:"",
        reminderFee: "",
        startText: "",
        endText: "",
        mailText: "",
    }),
    breadCrumbsConfig = [
      {
        text: "Global Settings",
        to: "/",
      },
      {
        text: "Finance",
        to: "/",
      },
      {
        text: "Invoice Reminders",
        to: "/settings/finance/invoice-reminders",
      },
      {
        text: "Create",
        active: true,
      },
    ],
    title = t("Create Invoice Reminders"),
  { items } = useTranslatedBreadCrumbs(breadCrumbsConfig),

    validationRules = {
        levelName: { required },
        name: { required },
        documentTemplateId: { required },
        periodDay: { required },
        reminderFee: { required },
        startText: { required },
        endText: { required },
        mailText: { required },
    },
    v$ = useVuelidate(validationRules, state),

    store = () => {
        submitted.value = true;
        //stop here if form is invalid
        v$.value.$touch();
        if (v$.value.$invalid) {
            submitted.value = false;
            return false;
        }else{
            apiRoute.value = routes.REMINDER_LEVEL;

            storeFunc(state, "/settings/finance/invoice-reminders")
        }
    }

onMounted(async function () {
    try {
        const res = await docListRequest({ start: 0, count: 25 });
        docListOptions.value = res?.data?.map((list: any) => {
            return { value: list?.id, text: list?.name };
        });
        // const selectedDocRes = await docSelectedListRequest();
        // selectedDocRes.data.map((doc: any) => selectedDoc(doc));
    } catch (e) {
        console.log(e);
    }
});

useHead({
  title: title,
});

</script>

<template>
  <div>
    <page-header :title="title" :items="items" />
    <form @submit.prevent="store">
      <div class="row">
        <div class="col-lg-12">
          <div class="card h-auto">
            <div class="card-header d-flex align-items-center">
              <h3 class="card-title me-2">
                {{ $t("Fill Invoice Reminder Level Details") }}
              </h3>
              <elements-tooltip />
            </div>
            <div class="card-body">
              <div class="row">
                <div class="col-lg-6">
                  <div class="form-group">
                      <elements-select
                              :required="true"
                              v-model="state.levelName"
                              :label="$t('Level Name')"
                              :disabled="isLoading"
                              :error="v$.levelName.$error  ? 'is-invalid' : ''"
                      >
                          <option value="warning level 1"> {{ $t("warning level 1") }}</option>
                          <option value="warning level 2"> {{ $t("warning level 2") }}</option>
                          <option value="warning level 3">{{ $t("warning level 3") }}</option>
                      </elements-select>
                  </div>
                </div>
                <div class="col-lg-6">
                  <div class="form-group">
                    <elements-input v-model="state.name" :label="$t('Name')" :required="true"
                      :disabled="isLoading" id="category-name" :class="{ 'is-invalid': v$.name.$error }" />
                  </div>
                  <div v-if="v$.name.$error" class="invalid-feedback">
                    <span class="text-danger" v-if="v$.name.required">{{
                      $t("This value is required")
                    }}</span><br />
                  </div>
                </div>
                <div class="col-lg-6">
                  <div class="form-group">
                    <elements-multiselect
                            v-model="state.documentTemplateId"
                            :options="docListOptions"
                            :key="state.orderConfirmationTemplateId"
                            :disabled="isLoading"
                            :textLabel="$t('Document Template')"
                            :required="true"
                            label="text"
                            track-by="value"
                            :class="{ 'is-invalid': v$.documentTemplateId.$error }"
                    />
                  </div>
                  <div v-if="v$.documentTemplateId.$error" class="invalid-feedback">
                    <span class="text-danger" v-if="v$.documentTemplateId.required">{{ $t("This value is required")
                    }}</span><br />
                  </div>
                </div>
                <div class="col-lg-6">
                  <div class="form-group">
                    <elements-input v-model="state.periodDay" :label="$t('Period Days')" :required="true"
                      :disabled="isLoading" :class="{ 'is-invalid': v$.periodDay.$error }"
                      type="number" />
                  </div>
                  <div v-if="v$.periodDay.$error" class="invalid-feedback">
                    <span class="text-danger" v-if="v$.periodDay.required">{{
                      $t("This value is required")
                    }}</span><br />
                  </div>
                </div>
                <div class="col-lg-6">
                  <div class="form-group">
                    <div class="input-group">
                      <div class="input-group-prepend">
                        <span class="input-group-text">
                          <ElementsIcon v-bind:icon="'euroIcon'" />
                        </span>
                      </div>
                      <elements-input v-model="state.reminderFee"  :disabled="isLoading" :required="true" :class="{ 'is-invalid': v$.reminderFee.$error }" :label="$t('Reminder Fee')"  type="number" />
                        <div v-if="v$.reminderFee.$error" class="invalid-feedback">
                        <span class="text-danger" v-if="v$.reminderFee.required">{{
                          $t("This value is required")
                          }}</span><br />
                        </div>
                    </div>
                  </div>
                </div>
                <div class="col-lg-6"></div>
                <div class="col-lg-6">
                  <div class="form-group textarea">
                    <textarea class="form-control" v-model="state.startText"  :class="{ 'is-invalid': v$.startText.$error }" placeholder="." :disabled="isLoading"></textarea>
                    <label for="" class="input-label">{{ $t('Start Text') }} <span>*</span></label>
                      <div v-if="v$.startText.$error" class="invalid-feedback">
                        <span class="text-danger" v-if="v$.startText.required">{{
                            $t("This value is required")
                            }}</span><br />
                      </div>
                  </div>
                </div>
                <div class="col-lg-6">
                  <div class="form-group textarea">
                    <textarea class="form-control" v-model="state.endText"  :class="{ 'is-invalid': v$.endText.$error }" placeholder="." :disabled="isLoading"></textarea>
                    <label for="" class="input-label">{{ $t('End Text') }} <span>*</span></label>
                      <div v-if="v$.endText.$error" class="invalid-feedback">
                        <span class="text-danger" v-if="v$.endText.required">{{
                            $t("This value is required")
                            }}</span><br />
                      </div>
                  </div>
                </div>
                <div class="col-lg-6">
                  <div class="form-group textarea">
                    <textarea class="form-control" v-model="state.mailText"  :class="{ 'is-invalid': v$.mailText.$error }"  placeholder="." :disabled="isLoading"></textarea>
                    <label for="" class="input-label">{{ $t('Mail Text') }} <span>*</span></label>
                      <div v-if="v$.mailText.$error" class="invalid-feedback">
                        <span class="text-danger" v-if="v$.mailText.required">{{
                            $t("This value is required")
                            }}</span><br />
                      </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="mt-3 d-flex align-items-center justify-content-end">
            <button class="primary-btn me-3" @click="navigateTo('/settings/finance/invoice-reminders')">
              <elements-icon v-bind:icon="'cancelIcon'" class="me-2" />
              <span>{{ $t("Cancel") }}</span>
            </button>
            <submittal-button :isLoading="isLoading" :iconName="'saveIcon'" :buttonName="$t('Save and Proceed')" />
          </div>
        </div>
      </div>
    </form>
  </div>
</template>
