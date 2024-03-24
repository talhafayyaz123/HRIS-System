<script setup lang="ts">
import { ref, reactive } from "vue";
import commonCode from "~/composables/common";
import {
  listSlaLevelRequest,
  createSlaLevelRequest,
  deleteSlaLevelRequest,
} from "~/utils/apiRequests";
import { useVuelidate } from "@vuelidate/core";
import { required, minLength } from "@vuelidate/validators";
import { useLayoutStore } from "~/store/layout";

import { useTranslatedColumns } from "~/composables/useTranslated";

const { router, Toast, deleteAlert } = commonCode();
const { t } = useI18n();

// form states
const stateIncident = reactive({
  isLoading: false,
  name: "",
  factor: null,
  urgentReactionTime: null,
  highReactionTime: null,
  lowReactionTime: null,
});

const recordId = ref("");
const isModalOpen = ref(false);

// table state
const isLoading = ref(false);
const rows = ref([]);

// table columns
const columnConfig = [
    {
      label: "Name",
      field: "name",
      sortable: false,
    },
    {
      label: "Factor",
      field: "factor",
      sortable: false,
    },
    {
      label: "Urgent Reaction Time",
      field: "urgentReactionTime",
      sortable: false,
    },
    {
      label: "high Reaction Time",
      field: "highReactionTime",
      sortable: false,
    },
    {
      label: "Low Reaction Time",
      field: "lowReactionTime",
      sortable: false,
    },
    {
      label: "Actions",
      field: "action",
      sortable: false,
    },
  ],
  { columns } = useTranslatedColumns(columnConfig);
// form validation
const validationRules = {
  name: { required },
  factor: { required },
  urgentReactionTime: { required },
  highReactionTime: { required },
  lowReactionTime: { required },
};
const v$ = useVuelidate(validationRules, stateIncident);

function resetState() {
  stateIncident.name = "";
  stateIncident.factor = null;
  stateIncident.urgentReactionTime = null;
  stateIncident.highReactionTime = null;
  stateIncident.lowReactionTime = null;
}

async function createSlaLevelIncidentHandler() {
  v$.value.$touch();
  if (v$.value.$invalid) {
    return;
  } else {
    try {
      const layout = useLayoutStore();
      layout.changeLoaderValue(true);
      stateIncident.isLoading = true;
      const formData = {
        name: stateIncident.name,
        factor: stateIncident.factor,
        urgentReactionTime: stateIncident.urgentReactionTime,
        highReactionTime: stateIncident.highReactionTime,
        lowReactionTime: stateIncident.lowReactionTime,
      };
      await createSlaLevelRequest(formData);
      layout.changeLoaderValue(false);
      Toast.fire({
        title: "Record created successfully!",
        icon: "success",
      });
      refresh();
      stateIncident.isLoading = false;
      // resetting state to initial
      v$.value.$reset();
      resetState();
    } catch (e) {
      const layout = useLayoutStore();
      layout.changeLoaderValue(false);
      Toast.fire({ title: t("Error!"), text: t("Error"), icon: "error" });
      stateIncident.isLoading = false;
    }
  }
}

async function refresh() {
  try {
    isLoading.value = true;
    const res = await listSlaLevelRequest();
    rows.value = res?.data;
    isLoading.value = false;
  } catch (e) {
    console.log(e);
    isLoading.value = false;
  }
}

async function destroy(id: any) {
  if (!!id) {
    await deleteAlert().then((result: { isConfirmed: any }) => {
      if (result.isConfirmed) {
        deleteSlaLevelRequest(id)
          .then((response) => {
            Toast.fire({
              icon: "success",
              title: t("Record deleted successfully!"),
            });
            refresh();
          })
          .catch((error) => {
            Toast.fire({ icon: "error", title: t("Something went wrong") });
          });
      }
    });
  }
}

async function edit(id: any) {
  if (!!id) {
    recordId.value = id;
    isModalOpen.value = true;
  }
}

function hideModal() {
  isModalOpen.value = false;
  recordId.value = null;
}

refresh();
</script>

<template>
  <div>
    <div class="card">
      <div class="card-header d-flex align-items-center">
        <h3 class="card-title me-2">{{ $t("Incidents") }}</h3>
        <ElementsTooltip />
      </div>
      <div class="card-body">
        <div class="row">
          <div class="col-lg-4">
            <div class="form-group">
              <elements-input
                v-model="stateIncident.name"
                :label="$t('Name')"
                :required="true"
                id="name"
                :disabled="stateIncident.isLoading"
                :class="{ 'is-invalid': v$.name.$error }"
              />
              <div v-if="v$.name.$error" class="invalid-feedback">
                <span class="text-danger" v-if="v$.name.required">{{
                  $t("This value is required")
                }}</span>
              </div>
            </div>
          </div>

          <div class="col-lg-4">
            <div class="form-group">
              <elements-input
                v-model="stateIncident.factor"
                :label="$t('Factor')"
                :required="true"
                id="factor"
                :disabled="stateIncident.isLoading"
                :class="{ 'is-invalid': v$.factor.$error }"
                type="number"
              />
              <div v-if="v$.factor.$error" class="invalid-feedback">
                <span class="text-danger" v-if="v$.factor.required">{{
                  $t("This value is required")
                }}</span>
              </div>
            </div>
          </div>
        </div>

        <div class="row">
          <span>{{ $t("Priority: Urgent") }}</span>
          <div class="col-lg-4">
            <div class="form-group">
              <elements-input
                v-model="stateIncident.urgentReactionTime"
                :label="$t('Urgent Reaction Time')"
                :required="true"
                id="urgentReactionTime"
                :disabled="stateIncident.isLoading"
                :class="{ 'is-invalid': v$.urgentReactionTime.$error }"
                type="number"
              />
              <div v-if="v$.urgentReactionTime.$error" class="invalid-feedback">
                <span
                  class="text-danger"
                  v-if="v$.urgentReactionTime.required"
                  >{{ $t("This value is required") }}</span
                >
              </div>
            </div>
          </div>
        </div>

        <div class="row">
          <span>{{ $t("Priority: High") }}</span>
          <div class="col-lg-4">
            <div class="form-group">
              <elements-input
                v-model="stateIncident.highReactionTime"
                :label="$t('High Reaction Time')"
                :required="true"
                id="highReactionTime"
                :disabled="stateIncident.isLoading"
                :class="{ 'is-invalid': v$.highReactionTime.$error }"
                type="number"
              />
              <div v-if="v$.highReactionTime.$error" class="invalid-feedback">
                <span class="text-danger" v-if="v$.highReactionTime.required">{{
                  $t("This value is required")
                }}</span>
              </div>
            </div>
          </div>
        </div>

        <div class="row">
          <span>{{ $t("Priority: Low") }}</span>
          <div class="col-lg-4">
            <div class="form-group">
              <elements-input
                v-model="stateIncident.lowReactionTime"
                :label="$t('Low Reaction Time')"
                :required="true"
                id="lowReactionTime"
                :disabled="stateIncident.isLoading"
                :class="{ 'is-invalid': v$.lowReactionTime.$error }"
                type="number"
              />
              <div v-if="v$.lowReactionTime.$error" class="invalid-feedback">
                <span class="text-danger" v-if="v$.lowReactionTime.required">{{
                  $t("This value is required")
                }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="mt-3 d-flex align-items-center justify-content-end">
      <button class="primary-btn me-3">
        <elements-icon v-bind:icon="'cancelIcon'" class="me-2" />
        <span>{{ $t("Cancel") }}</span>
      </button>
      <submittal-button
        @click="createSlaLevelIncidentHandler"
        :isLoading="stateIncident.isLoading"
        :icon-name="'saveIcon'"
        :buttonName="$t('Save and Proceed')"
      />
    </div>
    <div class="table-responsive mt-4">
      <Table
        class="doc-table"
        :key="rows?.length"
        :columns="columns"
        :rows="rows"
        :not-serial-able="true"
        :remove-serial-able="true"
        @edit="edit"
        @destroy="destroy"
      />
    </div>

    <sla--level-incident-edit
      v-if="recordId"
      :showModal="isModalOpen"
      :hideModal="hideModal"
      :recordId="recordId"
      @refresh="refresh"
    />
  </div>
</template>
