<script setup lang="ts">
import { useVuelidate } from "@vuelidate/core";
import { required } from "@vuelidate/validators";
import {
  createRequestTypeRequest,
  getRequestTypeByIdRequest,
  editRequestTypeRequest,
} from "@/utils/apiRequests";

import commonCode from "~/composables/common";
import { reactive, ref, onMounted } from "vue";

const { router, Toast } = commonCode();
const { t } = useI18n();

const props = defineProps(["id"]);

const state = reactive({
  isLoading: false,
  name: "",
  approvalLevel1: "",
  approvalLevel2: "",
  approvalLevel3: "",
});
const requestType = ref([]);

const approvalOptions = ref([
  { value: "team_lead", text: "Team Lead" },
  { value: "department_head", text: "Department head" },
  { value: "project_manager", text: "Project Manager" },
]);
const requestId = props.id;

const validationRules = {
  name: { required },
};
const v$ = useVuelidate(validationRules, state);

const approvalLevel1Options = computed(function () {
  return approvalOptions.value;
});
const approvalLevel2Options = computed(function () {
  if (state.approvalLevel1) {
    return filterOptions(approvalOptions.value, state.approvalLevel1);
  } else {
    return [];
  }
});
const approvalLevel3Options = computed(function () {
  if (state.approvalLevel1 && state.approvalLevel2) {
    return filterOptions(approvalOptions.value, [
      state.approvalLevel1,
      state.approvalLevel2,
    ]);
  } else {
    return [];
  }
});

// In case of edit, populate invoices
onMounted(async function () {
  try {
    if (!requestId) {
      // incase of add don't call api
      return;
    }
    state.isLoading = true;
    const res = await getRequestTypeByIdRequest(requestId);
    const {
      name,
      customerSpecific,
      projectSpecific,
      approvalLevel1,
      approvalLevel2,
      approvalLevel3,
    } = res.data;
    state.name = name;
    state.approvalLevel1 = approvalLevel1;
    state.approvalLevel2 = approvalLevel2;
    state.approvalLevel3 = approvalLevel3;
    state.isLoading = false;
    if (customerSpecific) {
      requestType.value.push("customer");
    }
    if (projectSpecific) {
      requestType.value.push("project");
    }
  } catch (e) {
    console.log(e);
    state.isLoading = false;
  }
});

function filterOptions(options: any, selectedValues: any) {
  return options.filter(
    (option: any) => !selectedValues.includes(option.value)
  );
}

async function requestHandler() {
  // stop here if form is invalid
  v$.value.$touch();
  if (v$.value.$invalid) {
    return;
  } else {
    try {
      state.isLoading = true;
      const formData = {
        name: state.name,
        customerSpecific: requestType.value.includes("customer") ?? false,
        projectSpecific: requestType.value.includes("project") ?? false,
        ...(state.approvalLevel1 && { approvalLevel1: state.approvalLevel1 }),
        ...(state.approvalLevel1 && { approvalLevel1: state.approvalLevel1 }),
        ...(state.approvalLevel2 && { approvalLevel2: state.approvalLevel2 }),
        ...(state.approvalLevel3 && {
          approvalLevel3: state.approvalLevel3,
        }),
      };
      // if we have id then edit otherwise add
      const res = (await requestId)
        ? editRequestTypeRequest(requestId, formData)
        : createRequestTypeRequest(formData);

      Toast.fire({
        title: requestId
          ? "Record updated successfully!"
          : "Record created successfully!",
        icon: "success",
      });
      state.isLoading = false;
      navigateTo("/settings/travel-expense/request-type");
    } catch (e) {
      console.log(e);
      state.isLoading = false;
    }
  }
}
</script>

<template>
  <form @submit.prevent="requestHandler">
    <Loader :isLoading="state.isLoading" />
    <div class="row">
      <div class="col-lg-8">
        <div class="card h-auto">
          <div class="card-header d-flex align-items-center">
            <h3 class="card-title me-2">
              {{ $t("Fill Request Types Details") }}
            </h3>
            <elements-tooltip />
          </div>
          <div class="card-body">
            <div class="row">
              <div class="col-lg-6">
                <div>
                  <input
                    class="me-2"
                    type="checkbox"
                    id="customer"
                    value="customer"
                    v-model="requestType"
                  />
                  <label for="customer">{{ $t("Customer Specific") }}</label>
                </div>
              </div>

              <div class="col-lg-6">
                <div>
                  <input
                    class="me-2"
                    type="checkbox"
                    id="project"
                    value="project"
                    v-model="requestType"
                  />
                  <label for="project">{{ $t("Project Specific") }}</label>
                </div>
              </div>

              <div class="col-lg-6">
                <div class="form-group">
                  <elements-input
                    v-model="state.name"
                    :label="$t('Name')"
                    :required="true"
                    id="name"
                    :disabled="state.submitted"
                    :class="{ 'is-invalid': v$.name.$error }"
                  />
                </div>
                <div v-if="v$.name.$error" class="invalid-feedback">
                  <span class="text-danger" v-if="v$.name.required">{{
                    $t("This value is required")
                  }}</span
                  ><br />
                </div>
              </div>

              <div class="col-lg-6">
                <div class="form-group">
                  <elements-multiselect
                    v-model="state.approvalLevel1"
                    :options="approvalLevel1Options"
                    :key="state.approvalLevel1"
                    label="text"
                    track-by="value"
                    :textLabel="$t('Approval Level 1')"
                  />
                </div>
              </div>
            </div>

            <div class="row" v-if="state.approvalLevel1">
              <div class="col-lg-6">
                <div class="form-group">
                  <elements-multiselect
                    v-model="state.approvalLevel2"
                    :options="approvalLevel2Options"
                    :key="state.approvalLevel2"
                    label="text"
                    track-by="value"
                    :textLabel="$t('Approval Level 2')"
                  />
                </div>
              </div>

              <div
                class="col-lg-6"
                v-if="state.approvalLevel1 && state.approvalLevel2"
              >
                <div class="form-group">
                  <elements-multiselect
                    v-model="state.approvalLevel3"
                    :options="approvalLevel3Options"
                    :key="state.approvalLevel3"
                    label="text"
                    track-by="value"
                    :textLabel="$t('Approval Level 3')"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="mt-3 d-flex align-items-center justify-content-end">
          <button
            class="primary-btn me-3"
            @click="navigateTo('/settings/travel-expense/request-type')"
          >
            <elements-icon v-bind:icon="'cancelIcon'" class="me-2" />
            <span>{{ $t("Cancel") }}</span>
          </button>
          <button class="secondary-btn float-right" type="submit">
            <ElementsIcon v-bind:icon="'saveIcon'" class="me-2" />
            {{ $t("Save and Proceed") }}
          </button>
        </div>
      </div>
    </div>
  </form>
</template>
