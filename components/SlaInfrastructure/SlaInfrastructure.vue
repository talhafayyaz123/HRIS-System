<script setup lang="ts">
import { ref, reactive } from "vue";
import commonCode from "~/composables/common";
import {
  createSlaInfrastructureRequest,
  listSlaInfrastructureRequest,
  deleteSlaInfrastructureRequest,
} from "~/utils/apiRequests";
import { useVuelidate } from "@vuelidate/core";
import { required } from "@vuelidate/validators";
const { router, Toast, deleteAlert } = commonCode();
const { t } = useI18n();

// form states
const state = reactive({
  name: "",
  isAccess: false,
  includedUser: null,
  additionalUser: null,
  isLoading: false,
});
const isModalOpen = ref(false);
const recordId = ref("");
// table state
const isLoading = ref(false);
const rows = ref([]);


// table columns
const columns = ref([
  {
    label: "Name",
    field: "name",
    sortable: false,
  },
  {
    label: "Is Access",
    field: "isAccess",
    sortable: false,
  },
  {
    label: "Included User",
    field: "includedUser",
    sortable: false,
  },
  {
    label: "Additional User",
    field: "additionalUser",
    sortable: false,
  },
  {
    label: "Actions",
    field: "action",
    sortable: false,
  },
]);

// form validation
const validationRules = {
  name: { required },
  isAccess: { required },
  includedUser: { required },
  additionalUser: { required },
};
const v$ = useVuelidate(validationRules, state);

function resetState() {
  state.name = "";
  state.isAccess = false;
  state.includedUser = null;
  state.additionalUser = null;
}

async function createSlaInfrastructureHandler() {
  v$.value.$touch();
  if (v$.value.$invalid) {
    return;
  } else {
    try {
      state.isLoading = true;
      const formData = {
        name: state.name,
        isAccess: state.isAccess,
        includedUser: state.includedUser,
        additionalUser: state.additionalUser,
      };
      await createSlaInfrastructureRequest(formData);

      Toast.fire({
        title: "Created",
        icon: "success",
      });
      refresh();
      state.isLoading = false;
      // resetting state to initial
      v$.value.$reset()
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
    const res = await listSlaInfrastructureRequest();
    rows.value = res?.data;
    isLoading.value = false
    resetState();
  } catch (e) {
    console.log(e);
    isLoading.value = false;
  }
}

async function destroy(id: any) {
  if (!!id) {
    await deleteAlert().then((result: { isConfirmed: any }) => {
      if (result.isConfirmed) {
        deleteSlaInfrastructureRequest(id)
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
    <form @submit.prevent="createSlaInfrastructureHandler">
      <div class="card">
        <div class="card-header d-flex align-items-center">
          <h3 class="card-title me-2">{{ $t("Customer Portal Access") }}</h3>
          <ElementsTooltip />
        </div>
        <div class="card-body">
          <div class="row">
            <div class="col-lg-4">
              <div class="form-group">
                <elements-input v-model="state.name" :label="$t('Name')" :required="true" id="name"
                  :disabled="state.isLoading" :class="{ 'is-invalid': v$.name.$error }" />

              </div>
              <div v-if="v$.name.$error" class="invalid-feedback">
                <span class="text-danger" v-if="v$.name.required">{{
                  $t("This value is required")
                }}</span>
              </div>
            </div>
            <div class="col-lg-4">
              <div class="form-group">
                <elements-input v-model="state.includedUser" :label="$t('Included Users')" :required="true"
                  id="includedUsers" :disabled="state.isLoading" :class="{ 'is-invalid': v$.includedUser.$error }"
                  type="number" />

              </div>
              <div v-if="v$.includedUser.$error" class="invalid-feedback">
                <span class="text-danger" v-if="v$.includedUser.required">{{
                  $t("This value is required")
                }}</span>
              </div>
            </div>
            <div class="col-lg-4">
              <div class="form-group">
                <div class="input-group">
                  <div class="input-group-prepend">
                    <span class="input-group-text">
                      <ElementsIcon v-bind:icon="'dollarIcon'" />
                    </span>
                  </div>
                  <elements-input v-model="state.additionalUser" :label="$t('Additional User')" :required="true"
                    id="additionalUser" :disabled="state.isLoading" :class="{ 'is-invalid': v$.additionalUser.$error }"
                    type="number" />
                </div>
              </div>
              <div v-if="v$.additionalUser.$error" class="invalid-feedback">
                <span class="text-danger" v-if="v$.additionalUser.required">{{
                  $t("This value is required")
                }}</span>
              </div>
            </div>
            <div class="col-lg-4">
              <div class="form-group d-flex align-items-center">
                <input type="checkbox" v-model="state.isAccess" />
                <label for="" class="ms-2">Access</label>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="mt-3  d-flex align-items-center justify-content-end">
        <button class="primary-btn me-3">
              <elements-icon v-bind:icon="'cancelIcon'" class="me-2"/>
              <span>{{ $t("Cancel") }}</span>
          </button>
        <submittal-button :isLoading="state.isLoading" :icon-name="'saveIcon'" :buttonName="$t('Save and Proceed')" />
      </div>
    </form>

    <div>
      <div class="table-responsive mt-4">
        <Table class="doc-table" :key="rows?.length" :columns="columns" :rows="rows" @edit="edit" @destroy="destroy" />
      </div>
    </div>
    <sla-infrastructure-edit v-if="recordId" :showModal="isModalOpen" :hideModal="hideModal" :recordId="recordId"
      @refresh="refresh" />
  </div>
</template>
