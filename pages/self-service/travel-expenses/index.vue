<script setup lang="ts">
import {ref, reactive} from "vue";
import {
  fleetListCreateRequest,
  fleetDocumentCreateRequest, contactReportFileCreateRequest
} from "~/utils/apiRequests";
import commonCode from "~/composables/common";
import {integer} from "vscode-languageserver-types";
import { useTranslatedBreadCrumbs, useTitle } from "~/composables/useTranslated";
const breadCrumbsConfig = [
  {
    text: "Admin portal",
    to: "/",
  },
  {
    text: "Self Service",
    to: "/self-service",
  },
  {
    text: "Travel Expense",
    active: true,
  },
],

  { items } = useTranslatedBreadCrumbs(breadCrumbsConfig),
  { title } = useTitle("Travel Expenses");
useHead({
  title: title,
});

const {router, Toast} = commonCode(),
    {t} = useI18n(),
    state = reactive({
      isLoading: false,
      submitted: false,
    }),
    payload = {},
    isUpdate = ref(false),
    currentPage = ref(1),
    order = ref("asc"),
    column = ref("id"),
    step = ref(1);

const changeActiveStep = (value: number) => {
  console.log("Event: ", value)
  step.value = value;
}

const store = () => {
  step.value += 1;
};
</script>
<template>
  <div>
    <page-header :title="title" :items="items"/>
    <div class="tab-header">
      <ul class="">
        <li class="nav-item" role="presentation">
          <button
              @click="step = 1"
              class="nav-link"
              :class="{ active: step === 1, 'step-done': step > 1 }"
          >
            {{ $t('My Expenses') }}
          </button>
        </li>
        <li class="nav-item" role="presentation">
          <button
              @click="step = 2"
              class="nav-link"
              :class="{ active: step === 2, 'step-done': step > 2 }"
          >
            {{ $t('New Request') }}
          </button>
        </li>
        <li class="nav-item" role="presentation">
          <button
              @click="step = 3"
              class="nav-link"
              :class="{ active: step === 3, 'step-done': step > 3 }"
          >
            {{ $t('Request for Approval') }}
          </button>
        </li>
      </ul>
    </div>
    <div class="wizard-content">
      <!--=======================================================-->
      <!--=======================================================-->
      <div class="" v-if="step === 1">
        <self-service-travel-expenses-my-expenses :key="step"/>
      </div>
      <!--=======================================================-->
      <!--=======================================================-->
      <div class="" v-else-if="step === 2">
        <self-service-travel-expenses-new-request @change-step="changeActiveStep"/>
      </div>
      <!--=======================================================-->
      <!--=======================================================-->
      <div class="" v-else-if="step === 3">
        <self-service-travel-expenses-request-for-approval :key="step"/>
      </div>
    </div>
  </div>
</template>
