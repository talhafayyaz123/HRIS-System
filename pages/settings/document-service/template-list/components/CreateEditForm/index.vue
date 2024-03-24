<script setup lang="ts">
import {useVuelidate} from "@vuelidate/core";
import {required} from "@vuelidate/validators";
import commonCode from "~/composables/common";
import {ref, reactive, onMounted} from "vue";
import {useDropzone} from "vue3-dropzone";
import {createorUpdateDocListRequest, docListRequest} from "~/utils/apiRequests";
import {routes} from "~/utils/apiRoutes";
import genericFeatures from "~/composables/generic";
import {getApiResponse, MethodType} from "~/utils/axiosFunctions";

const runtimeConfig = useRuntimeConfig();

const {getRootProps, getInputProps, isDragActive, ...rest} = useDropzone({onDrop}),
    {router, Toast} = commonCode(),
    {t} = useI18n(),
    {showGenericListing} = genericFeatures(),
    props = defineProps(["id", "isEdit"]),
    companies = ref([]),
    fileName = ref(''),
    state = reactive({
      isLoading: false,
      companyId: '',
      tenantId: ''
    }),
    docListId = props.id,
    validationRules = {
      companyId: {required},
      tenantId: {required: false},
    },
    v$ = useVuelidate(validationRules, state),
    files = reactive({
      dropzoneFiles: [],
    });

function onDrop(acceptFiles, rejectReasons) {
  files.dropzoneFiles = acceptFiles;
}

function handleClickDeleteFile(index) {
  files.dropzoneFiles.splice(index, 1);
}

async function downloadOriginalFile() {
  try {
    const url = `${runtimeConfig.public.documentServiceUrl}/files/${docListId}`;
    const result = await getApiResponse(url, true, MethodType.get, null, null, '', 'blob');

    const blob = new Blob([result], {
      type: `application/vnd.openxmlformats-officedocument.wordprocessingml.document`,
    });

    // Create a URL for the file
    const downloadUrl = window.URL.createObjectURL(blob);

    // Create a link element
    const link = document.createElement("a");
    link.href = downloadUrl;
    link.setAttribute("download", fileName.value);

    // Add the link to the DOM and click it to initiate the download
    document.body.appendChild(link);
    link.click();
  } catch (e) {
    Toast.fire({icon: "error", title: t("something went wrong!")})
    console.log(e)
  }
}

async function invoiceHandler() {
  // stop here if form is invalid
  v$.value.$touch();
  if (v$.value.$invalid) {
    return;
  } else {
    try {

      if (!files.dropzoneFiles.length && !docListId) {
        Toast.fire({title: t("Error!"), text: t("Upload a file first"), icon: "error"});
        return;
      }

      state.isLoading = true;

      const formData = new FormData();
      formData.append("upload_files", files.dropzoneFiles[0])

      if (await (docListId)) {
        formData.append(
            "data",
            JSON.stringify({
              company_id: state.companyId,
              tenant_id: state.tenantId,
              id: docListId
            })
        )
      } else {
        formData.append(
            "data",
            JSON.stringify({
              company_id: state.companyId,
              tenant_id: state.tenantId,
            })
        )
      }
      const res = await createorUpdateDocListRequest(formData)
      Toast.fire({
        title: docListId ? "Updated" : "Created",
        icon: "success",
      });
      state.isLoading = false;
      navigateTo("/settings/document-service/template-list");
    } catch (e) {
      Toast.fire({title: t("Error!"), text: t("Error"), icon: "error"});
      state.isLoading = false;
    }
  }
}

onMounted(async function () {
  try {
    await showGenericListing(routes.COMPANY)
        .then((response: any) => {
          companies.value = response?.data?.customers.map((customer: any) => {
            return {
              text: customer.name,
              value: customer.id,
            };
          });
        }).catch((error) => {
          Toast.fire({icon: "error", title: t("something went wrong!")})
        })

    if (!docListId) {
      return;
    }

    state.isLoading = true;
    const res = await docListRequest({start: 0, count: 1000})
    const docObject = res?.data.find(template => template.id === docListId)
    if (docObject) {
      state.companyId = docObject.company_id
      fileName.value = docObject.name
    }
    state.isLoading = false;
  } catch (e) {
    state.isLoading = false;
  }
})

</script>

<template>
  <div>
    <form @submit.prevent="invoiceHandler">
      <Loader :isLoading="state.isLoading"/>
      <div class="row">
        <div class="col-lg-8">
          <div class="card">
            <div class="card-header d-flex align-items-center">
              <h3 class="card-title me-2">{{ $t("Fill Document Service Details") }}</h3>
            </div>

            <div class="card-body pb-0">
              <div class="row">
                <div class="col-lg-6">
                  <div class="form-group">
                    <elements-multiselect
                        v-model="state.companyId"
                        :options="companies"
                        :key="state.companyId"
                        label="text"
                        track-by="value"
                        :textLabel="$t('Company')"
                        :required="true"
                        :class="{ 'is-invalid': v$.companyId.$error }"
                    />
                    <div v-if="v$.companyId.$error" class="invalid-feedback">
                    <span class="text-danger"
                          v-if="v$.companyId.required">{{ $t("This value is required") }}</span><br/>
                    </div>
                  </div>
                </div>
                <div class="col-lg-6">
                  <div class="form-group">
                    <elements-multiselect
                        v-model="state.tenantId"
                        :options="companies"
                        :key="state.tenantId"
                        label="text"
                        track-by="value"
                        :textLabel="$t('Tenant')"
                        :class="{ 'is-invalid': v$.tenantId.$error }"
                    />
                    <div v-if="v$.tenantId.$error" class="invalid-feedback">
                      <span class="text-danger" v-if="v$.tenantId.required">{{
                          $t("This value is required")
                        }}</span><br/>
                    </div>
                  </div>
                </div>
              </div>

              <div class="row mt-4">
                <div class="col-12">
                  <div class="drop_box">
                    <div v-if="files.dropzoneFiles.length > 0" class="files">
                      <div class="file-item" v-for="(file, index) in files.dropzoneFiles" :key="index">
                        <span>{{ file.name }}</span>
                        <span class="delete-file" style="color: red" @click="handleClickDeleteFile(index)">Delete</span>
                      </div>
                    </div>
                    <div v-else class="dropzone" v-bind="getRootProps()">
                      <div class="border" :class="{isDragActive}">
                        <input v-bind="getInputProps()"/>
                        <p v-if="isDragActive"> {{$t("Drop the files here")}}...</p>
                        <p v-else> {{$t("Drag and drop files here, or Click to select files")}} </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>

          <div class="mt-3 d-flex align-items-center justify-content-end">
            <button class="secondary-btn float-right mx-2" @click='navigateTo("/settings/document-service/template-list")'>
              {{ $t("Cancel") }}
            </button>
            <button class="secondary-btn float-right" type="submit">
              <ElementsIcon v-bind:icon="'saveIcon'" class="me-2"/>
              {{ $t("Save & Proceed") }}
            </button>
          </div>
        </div>
      </div>
    </form>

    <div v-if="isEdit" class="mt-3 d-flex align-items-center">
      <button class="secondary-btn float-right"
              @click='navigateTo("/settings/document-service/template-list/show-" + docListId)'>
        {{ $t("View Document") }}
      </button>
      <button class="secondary-btn float-right mx-2" @click='downloadOriginalFile'>
        {{ $t("Download Original") }}
      </button>
    </div>
  </div>
</template>
