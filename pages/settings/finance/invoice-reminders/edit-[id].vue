<script setup lang="ts">
import { ref, onMounted } from "vue";

import commonCode from "~/composables/common";
import { useVuelidate } from "@vuelidate/core";
import { required } from "@vuelidate/validators";
import { useLayoutStore } from "~/store/layout";
import {routes} from "~/utils/apiRoutes";
import genericFunctionality from "~/composables/genericFunctionality";
import {docListRequest} from "~/utils/apiRequests";

import {
  useTranslatedBreadCrumbs,
  useTitle,
} from "~/composables/useTranslated";

useHead({
  title: `Edit Invoice Reminders`,
});
const
    { router, Toast } = commonCode(),
    { submitted, isLoading, apiRoute, updateFunc, showFunc } = genericFunctionality(),
    { t } = useI18n(),
    invoiceId = router.params.id,
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
      text: "Edit",
      active: true,
    },
  ],

   title = t("Edit Invoice Reminders"),
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
    update = () => {
        submitted.value = true;
        //stop here if form is invalid
        v$.value.$touch();
        if (v$.value.$invalid) {
            submitted.value = false;
            return false;
        } else {
            apiRoute.value = routes.REMINDER_LEVEL;
            updateFunc(state, invoiceId, "/settings/finance/invoice-reminders");
        }
    },
    refresh = async () => {
        const layout = useLayoutStore();
        layout.changeLoaderValue(true);
        let response = await showFunc(invoiceId);
        if (!!response?.success) {
            const res  = response?.data;
            state.levelName = res?.levelName;
            state.name = res?.name;
            state.documentTemplateId = res?.documentTemplateId;
            state.periodDay = res?.periodDay;
            state.reminderFee = res?.reminderFee;
            state.startText = res?.startText;
            state.endText = res?.endText;
            state.mailText = res?.mailText;
        }
        layout.changeLoaderValue(false);
    };
// define api url of this crud that's we define in apiRoutes file.
apiRoute.value = routes.REMINDER_LEVEL;

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
    await refresh();
});


</script>

<template>
  <div>
    <page-header :title="title" :items="items" />
      <form @submit.prevent="update">
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
                                              :key="state.levelName"
                                              v-model="state.levelName"
                                              :label="$t('Level Name')"
                                              :disabled="true"
                                              :error="v$.levelName.$error  ? 'is-invalid' : ''"
                                      >
                                          <option value="warning level 1"> {{ $t("warning level 1") }}</option>
                                          <option value="warning level 2"> {{ $t("warning level 2") }}</option>
                                          <option value="warning level 3">{{ $t("warning level 3") }}</option>
                                      </elements-select>
                                  </div>
                                  <div v-if="v$.levelName.$error" class="invalid-feedback">
                                      <span class="text-danger" v-if="v$.levelName.required">{{ $t("This value is required") }}</span><br />
                                  </div>
                              </div>
                              <div class="col-lg-6">
                                  <div class="form-group">
                                      <elements-input v-model="state.name" :label="$t('Name')" :required="true"
                                                      :disabled="isLoading" id="category-name" :class="{ 'is-invalid': v$.name.$error }" />
                                  </div>
                                  <div v-if="v$.name.$error" class="invalid-feedback">
                                      <span class="text-danger" v-if="v$.name.required">{{$t("This value is required") }}</span><br />
                                  </div>
                              </div>
                              <div class="col-lg-6">
                                  <div class="form-group">
                                      <elements-multiselect
                                              :key="state.documentTemplateId"
                                              v-model="state.documentTemplateId"
                                              :options="docListOptions"
                                              :disabled="isLoading"
                                              :textLabel="$t('Document Template')"
                                              :required="true"
                                              label="text"
                                              track-by="value"
                                              :class="{ 'is-invalid': v$.documentTemplateId.$error }"
                                      />
                                  </div>
                                  <div v-if="v$.documentTemplateId.$error" class="invalid-feedback">
                                    <span class="text-danger" v-if="v$.documentTemplateId.required">{{ $t("This value is required") }}</span><br />
                                  </div>
                              </div>
                              <div class="col-lg-6">
                                  <div class="form-group">
                                      <elements-input v-model="state.periodDay" :label="$t('Period Days')" :required="true"
                                                      :disabled="isLoading" :class="{ 'is-invalid': v$.periodDay.$error }"
                                                      type="number" />
                                  </div>
                                  <div v-if="v$.periodDay.$error" class="invalid-feedback">
                                      <span class="text-danger" v-if="v$.periodDay.required">{{$t("This value is required") }}</span><br/>
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
                                          <elements-input v-model="state.reminderFee" :required="true" :class="{ 'is-invalid': v$.reminderFee.$error }"  :disabled="isLoading" :label="$t('Reminder Fee')"  type="number" />
                                          <div v-if="v$.reminderFee.$error" class="invalid-feedback">
                                                <span class="text-danger" v-if="v$.reminderFee.required">{{$t("This value is required") }}</span><br />
                                          </div>
                                      </div>
                                  </div>
                              </div>
                              <div class="col-lg-6"></div>
                              <div class="col-lg-6">
                                  <div class="form-group textarea">
                                      <textarea class="form-control" v-model="state.startText" :class="{ 'is-invalid': v$.startText.$error }" placeholder="." :disabled="isLoading"></textarea>
                                      <label for="" class="input-label">{{ $t('Start Text') }}</label>
                                      <div v-if="v$.startText.$error" class="invalid-feedback">
                                            <span class="text-danger" v-if="v$.startText.required">{{$t("This value is required") }}</span><br />
                                      </div>
                                  </div>
                              </div>
                              <div class="col-lg-6">
                                  <div class="form-group textarea">
                                      <textarea class="form-control" v-model="state.endText"  :class="{ 'is-invalid': v$.endText.$error }" placeholder="." :disabled="isLoading"></textarea>
                                      <label for="" class="input-label">{{ $t('End Text') }}</label>
                                      <div v-if="v$.endText.$error" class="invalid-feedback">
                        <span class="text-danger" v-if="v$.endText.required">{{
                                $t("This value is required")
                            }}</span><br />
                                      </div>
                                  </div>
                              </div>
                              <div class="col-lg-6">
                                  <div class="form-group textarea">
                                      <textarea class="form-control" v-model="state.mailText" :class="{ 'is-invalid': v$.mailText.$error }"  placeholder="." :disabled="isLoading"></textarea>
                                      <label for="" class="input-label">{{ $t('Mail Text') }}</label>
                                      <div v-if="v$.mailText.$error" class="invalid-feedback">
                                            <span class="text-danger" v-if="v$.mailText.required">{{$t("This value is required") }}</span><br />
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
                      <submittal-button :isLoading="isLoading" :iconName="'updateIcon'" :buttonName="$t('Update')" />
                  </div>
              </div>
          </div>
      </form>
  </div>
</template>
