<script setup lang="ts">
import { ref, reactive, watch } from "vue";
import { routes } from "~/utils/apiRoutes";
import commonCode from "~/composables/common";
import genericFeatures from "~/composables/generic";
import {
  documentAndContractCreateRequest,
  documentAndContractRequest,
  documentAndContractDeleteRequest,
} from "~/utils/apiRequests";
import { useVuelidate } from "@vuelidate/core";
import { required, email } from "@vuelidate/validators";
import genericFunctionality from "~/composables/genericFunctionality";

const { router, Toast, deleteAlert } = commonCode();
const { showGenericListing } = genericFeatures(),
  { submitted, isLoading, apiRoute, storeFunc } = genericFunctionality(),
  { t } = useI18n(),
  state = reactive({
    isLoading: false,
    submitted: false,
    file: null,
  }),
  store = () => {
    emit("documentDone");
  },
  emit = defineEmits(["backToAssets", "documentDone"]),
  validationRules = {
    file: { required },
  },
  v$ = useVuelidate(validationRules, state);
const rows = ref([]);
const props = defineProps({
  userProfileId: {
    type: String,
    default: "",
  },
});

async function popRow(id) {
  if (!!id) {
    await deleteAlert().then((result: { isConfirmed: any }) => {
      if (result.isConfirmed) {
        documentAndContractDeleteRequest(id)
          .then((response) => {
            Toast.fire({
              icon: "success",
              title: t("Record deleted successfully!"),
            });
            showCustomer();
          })
          .catch((error) => {
            Toast.fire({ icon: "error", title: t("Something went wrong") });
          });
      }
    });
  }
}

const prev = () => {
  emit("backToAssets");
};

const fileUpload = (e: any) => {
  state.file = e.target.files[0];
};

const addDocument = () => {
  state.submitted = true;
  v$.value.$touch();
  if (v$.value.$invalid) {
    return false;
  } else {
    state.isLoading = true;
    const formData = new FormData(); // pass data as a form

    formData.append("file", state.file);

    formData.append("employeeId", props.userProfileId);
    documentAndContractCreateRequest(formData)
      .then((response) => {
        Toast.fire({
          icon: "success",
          title: t("Document uploaded successfully!"),
        });
        state.file = null;
        state.isLoading = false;
        state.submitted = false;
        showCustomer();
      })
      .catch((error) => {
        state.isLoading = false;
        state.submitted = false;
        Toast.fire({ icon: "error", title: t("something went wrong!") });
      });
  }
};

const showCustomer = () => {
  documentAndContractRequest({
    employeeId: props.userProfileId,
  }).then((response) => {
    rows.value = response?.data;
  });
};
const refresh = () => {
  if (router.params.id) {
    showCustomer();
  }
};
refresh();
</script>
<template>
  <div>
    <div class="card mt-3">
      <div class="card-header d-flex align-items-center">
        <h3 class="card-title me-2">{{ $t('Upload File') }}</h3>
        <elements-tooltip />
      </div>
      <div class="card-body">
        <div class="row mt-3">
          <div class="col-md-12 mb-3">
            <div class="form-group">
              <input class="form-control" @change="fileUpload" type="file" :class="{
                'is-invalid': v$.file.$error && state.submitted,
              }" />
              <div v-if="v$.file.$error && state.submitted" class="invalid-feedback">
                <span class="text-danger" v-if="v$.file.required && state.submitted">{{ $t("This value is required")
                }}</span><br />
              </div>
            </div>
          </div>
          <div class="col-md-12">
            <submittal-button @click.prevent="addDocument()" :isLoading="state.isLoading" :buttonName="$t('Upload')" />
          </div>
        </div>
        <div v-if="rows.length > 0" class="row">
          <div class="col-12">
            <div class="table-responsive mt-3">
              <table class="doc-table table">
                <thead>
                  <tr>
                    <th>{{ $t("File Name") }}</th>
                    <th>{{ $t("Size") }}</th>
                    <th>{{ $t("Action") }}</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(item, index) in rows" :key="index">
                    <td>
                      {{ item?.fileName }}
                    </td>
                    <td>{{ item?.size }}</td>
                    <td>
                      <i class="mdi mdi-delete edit-icon" @click.prevent="popRow(item?.id)"></i>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="form-group text-right mt-3 d-flex align-items-center justify-content-end">
      <button class="link_text primary-btn me-3" @click.prevent="prev()">
        <elements-icon v-bind:icon="`backIcon`" class="me-2" />
        {{ $t("Previous") }}
      </button>
      <submittal-button @click.prevent="store()" :buttonName="$t('Save and Proceed')" :iconName="'saveIcon'" />
    </div>
  </div>
</template>
