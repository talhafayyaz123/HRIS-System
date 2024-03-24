<script setup lang="ts">
import {ref, reactive} from "vue";
import {
  fleetListCreateRequest,
  fleetDocumentCreateRequest, contactReportFileCreateRequest
} from "~/utils/apiRequests";
import commonCode from "~/composables/common";
import {integer} from "vscode-languageserver-types";
import { useTranslatedColumns, useTranslatedBreadCrumbs, useTitle } from "~/composables/useTranslated";


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
    breadCrumbsConfig = [
      {
        text: "Admin portal",
        to: "/",
      },
      {
        text: "Fleet Cars",
        to: "/fleet-management/fleet-list",
      },
      {
        text: "Create",
        active: true,
      },
    ],
    step = ref(1);
const prev = () => {
  step.value -= 1;
};
const nextStep = (data: any) => {
  Object.assign(payload, data.fields)
  step.value = data.step + 1;
  if (step.value > 3) {
    addFleetList(data.files);
    step.value = 1;
  }
};

const addFleetList = (files: any) => {
  fleetListCreateRequest({
    ...payload
  })
      .then((response) => {
        addFleetDocuments(response.data.id, files)
      })
      .catch((response) => {
        Toast.fire({icon: "error", title: t("something went wrong!")});
      });
};

const uploadFiles = (id) => {
  const formData = new FormData(); // pass data as a form
  for (var x = 0; x < files.dropzoneFiles.length; x++) {
    formData.append("files[]", files.dropzoneFiles[x]);
  }
  formData.append("contactReportId", id);
  contactReportFileCreateRequest(formData);
};
const addFleetDocuments = (fleetCarId: any, files: any) => {

  const formData = new FormData(); // pass data as a form
  for (let x = 0; x < files.length; x++) {
    formData.append("files[]", files[x]);
  }
  formData.append("fleetCarId", fleetCarId);
  fleetDocumentCreateRequest(formData)
      .then((response) => {
        Toast.fire({
          icon: "success",
          title: t("Record created successfully!"),
        });
      })
      .catch((response) => {
        Toast.fire({icon: "error", title: t("something went wrong!")});
      });
  navigateTo("/fleet-management/fleet-list");
};
const store = () => {
  step.value += 1;
};

const { items } = useTranslatedBreadCrumbs(breadCrumbsConfig),
    { title } = useTitle("Create Fleet Car");

useHead({
    title: title,
    });
</script>
<template>
  <div>
    <page-header :title="title" :items="items"/>
    <div class="wizard-tab">
      <ul class="">
        <li class="nav-item" role="presentation">
          <button
              class="nav-link"
              :class="{ active: step === 1, 'step-done': step > 1 }"
          >
          {{ $t('Car Details') }}
          </button>
        </li>
        <li class="nav-item" role="presentation">
          <button
              class="nav-link"
              :class="{ active: step === 2, 'step-done': step > 2 }"
          >
          {{ $t('Contract Details') }}
          </button>
        </li>
        <li class="nav-item" role="presentation">
          <button
              class="nav-link"
              :class="{ active: step === 3, 'step-done': step > 3 }"
          >
          {{ $t('Documents') }}
          </button>
        </li>
      </ul>
    </div>
    <div class="wizard-content">
      <!--=======================================================-->
      <!--=======================================================-->
      <div class="" v-show="step === 1">
        <fleet-management-car-details-form
            @nextStep="nextStep"
            :isUpdate="isUpdate"
        />
      </div>
      <!--=======================================================-->
      <!--=======================================================-->
      <div class="" v-show="step === 2">
        <fleet-management-conract-details-form
            @nextStep="nextStep"
            :isUpdate="isUpdate"
        />
      </div>
      <!--=======================================================-->
      <!--=======================================================-->
      <div class="" v-show="step === 3">
        <fleet-management-documents-form
            @nextStep="nextStep"
            :isUpdate="isUpdate"
        />
      </div>
    </div>
  </div>
</template>
