<script setup lang="ts">
import { ref, reactive } from "vue";
import commonCode from "~/composables/common";
import {
  createSlaServiceTimesRequest,
  listSlaServiceTimesRequest,
  deleteSlaServiceTimesRequest,
} from "~/utils/apiRequests";
import { useVuelidate } from "@vuelidate/core";
import { required, minLength } from "@vuelidate/validators";
import genericFunctionality from "~/composables/genericFunctionality";

import {
  useTranslatedColumns,
  useTitle,
} from "~/composables/useTranslated";

const {
    apiRoute,
    currentPerPage,
    currentPage,
    orderColumn,
    orderDirection,
    data,
    listingFunc,
    onSortChange,
    handleSearch,
    destroy
  } = genericFunctionality();
const { router, Toast, deleteAlert } = commonCode();
const { t } = useI18n();

// form states
const state = reactive({
  isLoading: false,
  name: "",
  from: "",
  days: [],
  to: "",
  factor: null
});
const isModalOpen = ref(false);
const recordId = ref("");

const daysOption = [
  { value: "monday", text: "Monday" },
  { value: "tuesday", text: "Tuesday" },
  { value: "wednesday", text: "Wednesday" },
  { value: "thursday", text: "Thursday" },
  { value: "friday", text: "Friday" },
  { value: "saturday", text: "Saturday" },
  { value: "sunday", text: "Sunday" },
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
    label: "Days",
    field: "days",
    sortable: false,
  },
  {
    label: "From",
    field: "from",
    sortable: false,
  },
  {
    label: "To",
    field: "to",
    sortable: false,
  },
  {
    label: "Factor/Service Hour",
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
  days: { required, minLength: minLength(1) },
  from: { required },
  to: { required },
  factor: { required }
};
const v$ = useVuelidate(validationRules, state);

function resetState() {
  state.name = "";
  state.days = [];
  state.from = "";
  state.to = "";
  state.factor = "";
}

async function createSlaTimesHandler() {
  v$.value.$touch();
  if (v$.value.$invalid) {
    return;
  } else {
    try {
      state.isLoading = true;
      const formData = {
        name: state.name,
        days: state.days,
        from: state.from,
        to: state.to,
        factor: state.factor
      };
      await createSlaServiceTimesRequest(formData);
      Toast.fire({
        title: "Record created successfully!",
        icon: "success",
      });
      refresh();
      state.isLoading = false;
      // resetting state to initial
      v$.value.$reset();
      resetState();
    } catch (e) {
      console.log(e);
      Toast.fire({ title: t("Error!"), text: t("Error"), icon: "error" });
      state.isLoading = false;
    }
  }
}

async function refresh() {
  try {
    isLoading.value = true;
    const res = await listSlaServiceTimesRequest();
    const requiredRes = res?.data.map((slaRes: any) => {
      return {
        ...slaRes,
        days: slaRes.days.join(", "),
      };
    });
    rows.value = requiredRes;
    isLoading.value = false;
  } catch (e) {
    console.log(e);
    isLoading.value = false;
  }
}

// async function destroy(id: any) {
//   if (!!id) {
//     await deleteAlert().then((result: { isConfirmed: any }) => {
//       if (result.isConfirmed) {
//         deleteSlaServiceTimesRequest(id)
//           .then((response) => {
//             Toast.fire({
//               icon: "success",
//               title: t("Record deleted successfully!"),
//             });
//             refresh();
//           })
//           .catch((error) => {
//             Toast.fire({ icon: "error", title: t("Something went wrong") });
//           });
//       }
//     });
//   }
// }

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
    <form @submit.prevent="createSlaTimesHandler">
      <div class="card">
        <div class="card-header d-flex align-items-center">
          <h3 class="card-title me-2">{{ $t("Fill Details") }}</h3>
          <ElementsTooltip />
        </div>
        <div class="card-body">
          <div class="row">
            <div class="col-lg-3">
              <div class="form-group">
                <elements-input
                  v-model="state.name"
                  :label="$t('Name')"
                  :required="true"
                  id="name"
                  :disabled="state.isLoading"
                  :class="{ 'is-invalid': v$.name.$error }"
                />
                <div v-if="v$.name.$error" class="invalid-feedback">
                  <span class="text-danger" v-if="v$.name.required">{{
                    $t("This value is required")
                  }}</span>
                </div>
              </div>
            </div>

            <div class="col-lg-3">
              <div class="form-group">
                <elements-multiselect
                  v-model="state.days"
                  :options="daysOption"
                  :key="state.days"
                  label="text"
                  track-by="value"
                  :textLabel="$t('Days')"
                  :required="true"
                  :multiple="true"
                  :class="{ 'is-invalid': v$.days.$error }"
                />
                <div v-if="v$.days.$error" class="invalid-feedback">
                  <span class="text-danger" v-if="v$.days.minLength">{{
                    $t("This value is required")
                  }}</span>
                </div>
              </div>
            </div>

            <div class="col-lg-3">
              <div class="form-group">
                <div class="input-group">
                  <div class="input-group-prepend">
                    <span class="input-group-text">
                      <ElementsIcon v-bind:icon="'clockIcon'" />
                    </span>
                  </div>
                  <elements-input
                    v-model="state.from"
                    :label="$t('From')"
                    :required="true"
                    id="from"
                    :disabled="state.isLoading"
                    :class="{ 'is-invalid': v$.from.$error }"
                    type="time"
                  />
                </div>
              </div>
              <div v-if="v$.from.$error" class="invalid-feedback">
                <span class="text-danger" v-if="v$.from.required">{{
                  $t("This value is required")
                }}</span
                ><br />
              </div>
            </div>
            <div class="col-lg-3">
              <div class="form-group">
                <div class="input-group">
                  <div class="input-group-prepend">
                    <span class="input-group-text">
                      <ElementsIcon v-bind:icon="'clockIcon'" />
                    </span>
                  </div>
                  <elements-input
                    v-model="state.to"
                    :label="$t('To')"
                    :required="true"
                    id="to"
                    :disabled="state.isLoading"
                    :class="{ 'is-invalid': v$.to.$error }"
                    type="time"
                  />
                </div>
              </div>
              <div v-if="v$.to.$error" class="invalid-feedback">
                <span class="text-danger" v-if="v$.to.required">{{
                  $t("This value is required")
                }}</span>
              </div>
            </div>

             <div class="col-lg-3">
              <div class="form-group">
                <elements-input
                  v-model="state.factor"
                  :label="$t('Factor')"
                  :required="true"
                  id="name"
                  :disabled="state.isLoading"
                  type="number"
                  :class="{ 'is-invalid': v$.factor.$error }"
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
        <submittal-button
          :isLoading="state.isLoading"
          :icon-name="'saveIcon'"
          :buttonName="$t('Save and Proceed')"
        />
      </div>
    </form>

    <div>
      <div class="table-responsive mt-4">
        <Table
          class="doc-table"
          :key="rows?.length"
          :columns="columns"
          :rows="rows"
          :not-serial-able="true"
          :remove-serial-able="true"
          @edit="edit"
          :orderColumn="orderColumn"
          :orderDirection="orderDirection"
          @onSortChange="onSortChange"
          @destroy="destroy"
        />
      </div>
      <sla-service-times-edit
        v-if="recordId"
        :showModal="isModalOpen"
        :hideModal="hideModal"
        :recordId="recordId"
        @refresh="refresh"
      />
    </div>
  </div>
</template>
