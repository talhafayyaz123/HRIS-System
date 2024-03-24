<script setup lang="ts">
import {ref, reactive} from "vue";
import {
  fleetListUpdateRequest,
  fleetListShowRequest, fleetDocumentCreateRequest
} from "~/utils/apiRequests";
import commonCode from "~/composables/common";
import { useLayoutStore } from "~/store/layout";
import {integer} from "vscode-languageserver-types";
import { useTranslatedColumns, useTranslatedBreadCrumbs, useTitle } from "~/composables/useTranslated";


const {router, Toast} = commonCode(),
    {t} = useI18n(),
    fleetCarId = ref(""),
    fleetCar = reactive({}),
    state = reactive({
      isLoading: false,
      submitted: false,
    }),
    isUpdate = ref(true),
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
  Object.assign(fleetCar, data.fields)
  step.value = data.step + 1;
  if (step.value > 3) {
    updateFleetList(data.files);
    step.value = 1;
  }
  isUpdate.value = true;
};

const updateFleetList = (files: any) => {
  
  fleetListUpdateRequest({
    ...fleetCar
  }, fleetCarId.value)
      .then((response) => {
        updateFleetDocuments(response.data.id, files)
        Toast.fire({
          icon: "success",
          title: t("Record updated successfully!"),
        });
      })
      .catch((response) => {
        Toast.fire({icon: "error", title: t("something went wrong!")});
      });
};

const updateFleetDocuments = (fleetCarId: any, files: any) => {
  const formData = new FormData(); // pass data as a form
  for (let x = 0; x < files.length; x++) {
    formData.append("files[]", files[x]);
  }
  formData.append("fleetCarId", fleetCarId);

  fleetDocumentCreateRequest(formData)
      .then((response) => {
        Toast.fire({
          icon: "success",
          title: t("Record updated successfully!"),
        });
      })
      .catch((response) => {
        Toast.fire({icon: "error", title: t("something went wrong!")});
      });
  navigateTo("/fleet-management/fleet-list");
};

const getFleetCar = (id) => {
  const layout = useLayoutStore();
  layout.changeLoaderValue(true);

  fleetListShowRequest(id)
      .then((response) => {
        Object.assign(fleetCar, response.data);
      })
      .catch((response) => {
        Toast.fire({icon: "error", title: t("something went wrong!")});
      }).finally(() => {
      layout.changeLoaderValue(false);
    });
};

const locationsDone = () => {
  step.value = 3;
};

const store = () => {
  step.value += 1;
};

function refresh() {
  fleetCarId.value = router.params.id;
  getFleetCar(fleetCarId.value);
}
const { items } = useTranslatedBreadCrumbs(breadCrumbsConfig),
    { title } = useTitle("Create Fleet Car");

useHead({
    title: title,
    });
refresh();
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
            :fleetCar="fleetCar"
            @nextStep="nextStep"
            :isUpdate="isUpdate"
        />
      </div>
      <!--=======================================================-->
      <!--=======================================================-->
      <div class="" v-show="step === 2">
        <fleet-management-conract-details-form
            :fleetCar="fleetCar"
            @nextStep="nextStep"
            :isUpdate="isUpdate"
        />
      </div>
      <!--=======================================================-->
      <!--=======================================================-->
      <div class="" v-show="step === 3">
        <fleet-management-documents-form
            :fleetCarId="fleetCarId"
            @nextStep="nextStep"
            :isUpdate="isUpdate"
        />
      </div>
    </div>
  </div>
</template>
