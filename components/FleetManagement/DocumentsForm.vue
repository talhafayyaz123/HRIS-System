<script setup lang="ts">
import {ref, reactive} from "vue";
import commonCode from "~/composables/common";
import {useDropzone} from "vue3-dropzone";
import "md-editor-v3/lib/style.css";

const {getRootProps, getInputProps, isDragActive, ...rest} = useDropzone({
  onDrop,
});

const {router, Toast} = commonCode(),
    {t} = useI18n(),
    state = reactive({
      isLoading: false,
      submitted: false,
      licenceNumber: "",
    }),
    emit = defineEmits(["nextStep"]),
    customerId = ref("");
const files = reactive({
  dropzoneFiles: [],
});
const rows = ref([]);
const props = defineProps({
  countries: {
    type: Array,
    default: [],
  },
  isUpdate: {
    type: Boolean,
    default: false,
  },
});

const popRow = (index) => {
  rows.value.splice(index, 1);
};

function onDrop(acceptFiles, rejectReasons) {
  files.dropzoneFiles = acceptFiles;
}

function handleClickDeleteFile(index) {
  files.dropzoneFiles.splice(index, 1);
}

const store = () => {
  try {
    // state.isLoading = true;
    emit("nextStep", {step: 3, files: files.dropzoneFiles});
  } catch (e) {
    Toast.fire({title: t("Error!"), text: t("Error"), icon: "error"});
    state.isLoading = false;
    state.submitted = false;
  }
};

</script>
<template>
  <div>
    <div class="card product-type">
      <div class="card-header">
        <h3 class="card-title">Documents</h3>
      </div>
      <div class="card-body">
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
        <div class="dropzone">
          <div class="dropzone-select">
            <div class="dropzone-icon">
              <i class="fe-upload-cloud"></i>
            </div>
            <div class="dropzone-text">
              <h4>{{ $t("Select a file or drag and drop here") }}</h4>
              <p>
                {{ $t("JPG, PNG or PDF, file size no more than 10MB") }}
              </p>
            </div>
            <div class="dropzone-btn">
              <input id="hidden-input" type="file" ref="file" @change="setFiles" name="files[]" multiple class="hidden"
                     :accept="accept"/>
              <button @click="$refs.file.click()" id="button" type="button" class="primary-btn">
                <i class="fe-upload me-2"></i>
                {{ $t("SELECT FILE") }}
              </button>
            </div>
          </div>
        </div>
        <div class="dropzone-area mt-3">
          <div class="row">
            <div class="col-lg-4 my-2">
              <div class="card mb-1 shadow-none border">
                <div class="p-2">
                  <div class="row align-items-center">
                    <div class="col-auto">
                      <div class="avatar-sm">
                        <span class="avatar-title bg-soft-primary text-primary rounded">
                          <ElementsIcon v-bind:icon="`imgPrevIcon`"/>
                        </span>
                      </div>
                    </div>
                    <div class="col pl-0">
                      <a href="javascript:void(0);" class="text-muted font-weight-semibold">fileName</a>
                    </div>
                    <div class="col-auto">
                      <a href="javascript:void(0);" class="btn btn-link btn-lg text-muted">
                        <i class="fe-trash"></i>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="form-group text-right mt-3">
      <submittal-button
          @click="store()"
          :isLoading="state.isLoading"
          :buttonName="$t('Next')"
      />
    </div>
  </div>
</template>
