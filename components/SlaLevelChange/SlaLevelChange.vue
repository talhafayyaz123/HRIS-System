<script setup lang="ts">
import { ref, reactive } from "vue";
import commonCode from "~/composables/common";
import {
  listSlaLevelRequest,
  createSlaLevelRequest,
  deleteSlaLevelRequest,
} from "~/utils/apiRequests";
import slaChangeEdit from "./sla-change-edit.vue";
import { useLayoutStore } from "~/store/layout";

import {
  useTranslatedColumns,
} from "~/composables/useTranslated";

import { useVuelidate } from "@vuelidate/core";
import { required, minLength } from "@vuelidate/validators";

const { router, Toast, deleteAlert } = commonCode();
const { t } = useI18n();

// form states
const stateChange = reactive({
  isLoading: false,
  name: "",
  priority: "",
  reactionTime: null,
  factor: null,
});

const recordId = ref("");
const isModalOpen = ref(false);

const priorityOption = [
  { value: "0", text: "Urgent" },
  { value: "1", text: "High" },
  { value: "2", text: "Middle" },
];
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
    label: "Priority",
    field: "priority",
    sortable: false,
  },
  {
    label: "Reaction Time",
    field: "reactionTime",
    sortable: false,
  },
  {
    label: "Factor",
    field: "factor",
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
  priority: { required },
  reactionTime: { required },
  factor: { required },
};
const v$ = useVuelidate(validationRules, stateChange);

function resetState() {
  stateChange.name = "";
  stateChange.priority = "";
  stateChange.reactionTime = null;
  stateChange.factor = null;
}

async function createSlaLevelChangeHandler() {
  v$.value.$touch();
  if (v$.value.$invalid) {
    return;
  } else {
    try {
      const layout = useLayoutStore();
      layout.changeLoaderValue(true);
      stateChange.isLoading = true;
      const formData = {
        name: stateChange.name,
        priority: stateChange.priority,
        reactionTime: stateChange.reactionTime,
        factor: stateChange.factor,
        type: "change",
      };
      await createSlaLevelRequest(formData);
      layout.changeLoaderValue(false);
      Toast.fire({
        title: "Record created successfully!",
        icon: "success",
      });
      refresh();
      stateChange.isLoading = false;
      // resetting state to initial
      v$.value.$reset();
      resetState();
    } catch (e) {
      const layout = useLayoutStore();
      layout.changeLoaderValue(false);
      Toast.fire({ title: t("Error!"), text: t("Error"), icon: "error" });
      stateChange.isLoading = false;
    }
  }
}

async function refresh() {
  try {
    isLoading.value = true;
    const res = await listSlaLevelRequest();
    rows.value = res?.data?.change;
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
            if (error && error.response && error.response.data) {
              Toast.fire({ icon: "error", title: error.response.data.message });
            }
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
  <div class="mt-4">
      <div class="card">
        <div class="card-header d-flex align-items-center">
          <h3 class="card-title me-2">{{ $t("Change") }}</h3>
          <ElementsTooltip />
        </div>
        <div class="card-body">
          <div class="row">
            <div class="col-lg-4">
              <div class="form-group">
                <elements-input
                  v-model="stateChange.name"
                  :label="$t('Name')"
                  :required="true"
                  id="name"
                  :disabled="stateChange.isLoading"
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
                <elements-multiselect
                  v-model="stateChange.priority"
                  :options="priorityOption"
                  :key="stateChange.priority"
                  label="text"
                  track-by="value"
                  :textLabel="$t('Priority')"
                  :required="true"
                  :class="{ 'is-invalid': v$.priority.$error }"
                />
                <div v-if="v$.priority.$error" class="invalid-feedback">
                  <span class="text-danger" v-if="v$.priority.required">{{
                    $t("This value is required")
                  }}</span
                  ><br />
                </div>
              </div>
            </div>

             <div class="col-lg-4">
              <div class="form-group">
                <elements-input
                  v-model="stateChange.reactionTime"
                  :label="$t('Reaction Time')"
                  :required="true"
                  id="reactionTime"
                  :disabled="stateChange.isLoading"
                  :class="{ 'is-invalid': v$.reactionTime.$error }"
                  type="number"
                />
                <div v-if="v$.reactionTime.$error" class="invalid-feedback">
                  <span class="text-danger" v-if="v$.reactionTime.required">{{
                    $t("This value is required")
                  }}</span>
                </div>
              </div>
            </div>


            <div class="col-lg-4">
              <div class="form-group">
                <elements-input
                  v-model="stateChange.factor"
                  :label="$t('Factor')"
                  :required="true"
                  id="factor"
                  :disabled="stateChange.isLoading"
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
        </div>
      </div>
      <div class="mt-3 d-flex align-items-center justify-content-end">
        <button class="primary-btn me-3">
          <elements-icon v-bind:icon="'cancelIcon'" class="me-2" />
          <span>{{ $t("Cancel") }}</span>
        </button>
        <submittal-button
          @click="createSlaLevelChangeHandler"
          :isLoading="stateChange.isLoading"
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

    <sla-level-change-edit
      v-if="recordId"
      :showModal="isModalOpen"
      :hideModal="hideModal"
      :recordId="recordId"
      @refresh="refresh"
    />
  </div>
</template>
