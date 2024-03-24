<script setup lang="ts">

import {onMounted, reactive, ref} from "vue";
import {docListRequest, getDocListFilePreviewRequest} from "~/utils/apiRequests";
import genericFeatures from "~/composables/generic";
import commonCode from "~/composables/common";
import {getApiResponse, MethodType} from "~/utils/axiosFunctions";

const {t} = useI18n();
const runtimeConfig = useRuntimeConfig();
const title = ref(t("Document Service Show"));
const items = [
{
        text:  t("Global Settings"),
        to: "/",
    },
{
        text:  t("Global Settings"),
        to: "/",
    },
  {
    text: "Document Service",
    to: "/settings/document-service/template-list",
  },
  {
    text: "Show",
    active: true,
  },
];

const {router, Toast} = commonCode();
const {showGenericListing} = genericFeatures();
const fileName = ref('');
const docListId = router.params.id;
const templateList = ref([]);
const state = reactive({
  isLoading: false,
  id: '',
  name: '',
});

const src = ref('');

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

async function generateDocxOrPDF(documentType) {
  try {
    const url = `${runtimeConfig.public.documentServiceUrl}/process-template`;
    const result = await getApiResponse(url, true, MethodType.post, {
      id: docListId,
      output: documentType
    }, null, '', 'blob');

    const blob = new Blob([result], {
      type: `application/${documentType === "pdf" ? "pdf" : "vnd.openxmlformats-officedocument.wordprocessingml.document"
      }`,
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

onMounted(async function () {
  try {
    state.isLoading = true

    const res = await docListRequest({start: 0, count: 1000})
    const docObject = res?.data.find(template => template.id === docListId)
    if (docObject) {
      state.id = docObject.id
      state.name = docObject.name
      fileName.value = docObject.name
    }

    let filePreview = await getDocListFilePreviewRequest(docListId);
    const reader = new FileReader();
    reader.readAsDataURL(filePreview);
    reader.onload = () => {
      const imageElement = document.getElementById(
          "document-preview-image"
      );
      if (typeof reader.result === "string") {
        imageElement.setAttribute("src", reader.result);
      }
    };

  } catch (e) {
    console.log(e)
    Toast.fire({icon: "error", title: t("Something went wrong")})
  } finally {
    state.isLoading = false;
  }
})

</script>

<template>
  <div>
    <page-header :title="title" :items="items"/>
    <div class="card">
      <Loader :isLoading="state.isLoading"/>
      <div class="row heading-class">
        <div class="col-lg-6 col-md-6">
          <div class="form-group">
            <elements-input
                v-model="state.id"
                :label="$t('ID')"
                :disabled="true"
            />
          </div>
        </div>
        <div class="col-lg-6 col-md-6">
          <div class="form-group">
            <elements-input
                v-model="state.name"
                :label="$t('Name')"
                :disabled="true"
            />
          </div>
        </div>
      </div>
    </div>
    <div class="row mt-4">
      <div class="col-lg-6 col-md-6">
        <div class="card">
          <img id="document-preview-image" alt="">
        </div>
      </div>
    </div>
    <div class="mt-4 d-flex align-items-center">
      <button class="secondary-btn float-right margin-right-10" @click='generateDocxOrPDF(`pdf`)'>
        {{ $t("Generate PDF") }}
      </button>
      <button class="secondary-btn float-right margin-right-10" @click='generateDocxOrPDF(`docx`)'>
        <ElementsIcon v-bind:icon="'saveIcon'" class="me-2"/>
        {{ $t("Generate Docx") }}
      </button>
      <button class="secondary-btn float-right margin-right-10" @click='downloadOriginalFile'>
        <ElementsIcon v-bind:icon="'saveIcon'" class="me-2"/>
        {{ $t("Download Original") }}
      </button>
      <button class="secondary-btn float-right margin-right-10"
              @click='navigateTo("/settings/document-service/template-list/edit-" + docListId)'>
        <ElementsIcon v-bind:icon="'saveIcon'" class="me-2"/>
        {{ $t("Edit Document") }}
      </button>
    </div>
  </div>
</template>

<style>

.heading-class {
  padding: 15px 27px 27px 27px;
}

.margin-right-10 {
  margin-right: 10px !important;
}

</style>
