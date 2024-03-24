<script setup lang="ts">

import {ref, reactive} from "vue";
import {required} from "@vuelidate/validators";
import {useVuelidate} from "@vuelidate/core";
import {useDropzone} from "vue3-dropzone";
import commonCode from "~/composables/common";
import {invoiceListRequest, travelExpenseBillCreateRequest} from "~/utils/apiRequests";

const {getRootProps, getInputProps, isDragActive, ...rest} = useDropzone({onDrop});
const {router, Toast} = commonCode(), {t} = useI18n();
const props = defineProps({
  travelExpenseId: {
    type: Number,
    default: 0,
  },
});

const files = reactive({
  dropzoneFiles: [],
});

const invoiceTypes = ref([]);
const state = reactive({
  isLoading: false,
  submitted: false,
  invoiceTypeId: '',
  location: '',
  fromDate: '',
  toDate: '',
  description: '',
});
const validationRules = {
  invoiceTypeId: {required},
  location: {required},
  fromDate: {required},
  toDate: {required},
  description: {required},
};

const v$ = useVuelidate(validationRules, state);

function handleClickDeleteFile(index) {
  files.dropzoneFiles.splice(index, 1);
}

function onDrop(acceptFiles, rejectReasons) {
  files.dropzoneFiles = acceptFiles;
}

const store = () => {
  v$.value.$touch();
  if (v$.value.$invalid) {
    state.submitted = false;
    return false;
  } else {
    try {
      state.isLoading = true;
      addBill();
    } catch (e) {
      Toast.fire({title: t("Error!"), text: t("Error"), icon: "error"});
      state.isLoading = false;
      state.submitted = false;
    }
  }
};

const addBill = () => {
  travelExpenseBillCreateRequest({
    travelExpenseId: props.travelExpenseId,
    invoiceTypeId: state.invoiceTypeId,
    location: state.location,
    fromDate: state.fromDate,
    toDate: state.toDate,
    description: state.description,
    attachments: files.dropzoneFiles
  }).then((response) => {
    Toast.fire({
      icon: "success",
      title: t("Record created successfully!"),
    });
    state.isLoading = false;
    state.submitted = false;
    navigateTo("/self-service/travel-expenses");
  }).catch((error) => {
    state.isLoading = false;
    state.submitted = false;
    Toast.fire({icon: "error", title: t("something went wrong!")});
  });
};


async function refresh(page = 1, perPage = 100, column = "id", order = "asc", search = "") {
  try {
    const response = await invoiceListRequest({
      page: page,
      perPage: perPage,
      search: search,
      sortBy: column,
      order: order,
    });

    invoiceTypes.value = response?.data?.data.map((invoice: any) => {
      return {
        text: invoice.name,
        value: invoice.id,
      };
    });
  } catch (e) {
    Toast.fire({icon: "error", title: t("something went wrong!")});
  }
}

refresh();
</script>

<template>
  <div class="">
    <div class="card card-body">
      <div class="row pt-4">
        <div class="col-xl-3 col-md-6">
          <div class="form-group">
            <elements-multiselect
                v-model="state.invoiceTypeId"
                :options="invoiceTypes"
                label="text"
                track-by="value"
                :textLabel="$t('Invoice Type')"
                :required="true"
                :class="{ 'is-invalid': v$.invoiceTypeId.$error }"
            />
            <div v-if="v$.invoiceTypeId.$error" class="invalid-feedback">
              <span class="text-danger" v-if="v$.invoiceTypeId.required">{{ $t("This value is required") }}</span><br/>
            </div>
          </div>
        </div>
        <div class="col-xl-3 col-md-6">
          <div class="form-group">
            <elements-input
                v-model="state.location"
                :label="$t('Location')"
                :required="true"
                :disabled="state.submitted"
                :class="{ 'is-invalid': v$.location.$error }"
            />
            <div v-if="v$.location.$error" class="invalid-feedback">
              <span class="text-danger" v-if="v$.location.required">{{ $t("This value is required") }}</span><br/>
            </div>
          </div>
        </div>
        <div class="col-xl-3 col-md-6">
          <div class="form-group">
            <elements-input
                type="date"
                v-model="state.fromDate"
                :label="$t('From')"
                :required="true"
                :disabled="state.submitted"
                :class="{ 'is-invalid': v$.fromDate.$error }"
            />
            <div v-if="v$.fromDate.$error" class="invalid-feedback">
              <span class="text-danger" v-if="v$.fromDate.required">{{ $t("This value is required") }}</span><br/>
            </div>
          </div>
        </div>
        <div class="col-xl-3 col-md-6">
          <div class="form-group">
            <elements-input
                type="date"
                v-model="state.toDate"
                :label="$t('To')"
                :required="true"
                :disabled="state.submitted"
                :class="{ 'is-invalid': v$.toDate.$error }"
            />
            <div v-if="v$.toDate.$error" class="invalid-feedback">
              <span class="text-danger" v-if="v$.toDate.required">{{ $t("This value is required") }}</span><br/>
            </div>
          </div>
        </div>
      </div>
      <div class="row pt-4">
        <div class="col-lg-6">
          <div class="drop_box">
            <div v-if="files.dropzoneFiles.length > 0" class="files">
              <div class="file-item" v-for="(file, index) in files.dropzoneFiles" :key="index">
                <span>{{ file.name }} </span>
                <span class="delete-file" style="color: red" @click="handleClickDeleteFile(index)">
                Delete</span>
              </div>
            </div>
            <div v-else class="dropzone" v-bind="getRootProps()">
              <div class="border" :class="{
              isDragActive,
            }">
                <input v-bind="getInputProps()"/>
                <p v-if="isDragActive">Drop the files here ...</p>
                <p v-else>Drag and drop files here, or Click to select files</p>
              </div>
            </div>
          </div>
        </div>
        <div class="col-lg-6">
          <div class="form-group textarea h-100 pb-5">
              <textarea
                  v-model="state.description"
                  class="form-control h-100"
                  placeholder="."
                  :class="{ 'is-invalid': v$.description.$error }"
              ></textarea>
            <div v-if="v$.description.$error" class="invalid-feedback">
              <span class="text-danger" v-if="v$.description.required">{{ $t("This value is required") }}</span><br/>
            </div>
            <label for="" class="input-label">Description</label>
          </div>
        </div>
      </div>
    </div>
    <div class="form-group text-right mt-3">
      <submittal-button
          @click="store()"
          :isLoading="state.isLoading"
          :buttonName="$t('Add Bill')"
      />
    </div>
  </div>
</template>
