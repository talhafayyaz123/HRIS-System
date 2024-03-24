<script setup lang="ts">
import { ref, reactive, computed, inject, watch } from "vue";
import commonCode from "~/composables/common";
import { useVuelidate } from "@vuelidate/core";
import { minLength, required, requiredIf } from "@vuelidate/validators";

import { useProductStore } from "~/store/product";
import { useLayoutStore } from "~/store/layout";

import {
  addProductFilesRequest,
  getProductFilesRequest,
} from "~/utils/apiRequests";

const product = useProductStore();
const layout = useLayoutStore();
const { router, Toast } = commonCode();
const { t } = useI18n();

const productId = router.params.id;
const productFilesState = reactive({
  files: [],
});
const existingFilesState = reactive({
  files: [],
});
const productFilesError = ref(false);

const isLoading = ref(false);
const productVersionId = ref(null);
const productVersionsOptions = ref([]);

const validationRules = {
  productFilesState: {
    files: {
      required: requiredIf(function () {
        return (
          productFilesState.files.length === 0 &&
          existingFilesState.files.length === 0
        );
      }),
    },
  },
  productVersionId: { required },
};
const v$ = useVuelidate(validationRules, {
  productFilesState,
  productVersionId,
});
const { nextStep, prevStep }: any = inject("nextPrevSteps");

// set product versions when product created in 1st step
watch(
  () => product.productVersion,
  (prod) => {
    productVersionsOptions.value = prod;
    productVersionId.value = productVersionsOptions.value[0]?.value
  }
);

// in update case, get values when version got selected
if (productId) {
  watch(
    () => productVersionId.value,
    async (selectedVersion) => {
      try {
        layout.changeLoaderValue(true);
        existingFilesState.files.length = 0;
        const res = await getProductFilesRequest({
          versionId: selectedVersion,
        });
        existingFilesState.files = res?.data;
        layout.changeLoaderValue(false);
      } catch (e) {
        console.log(e);
        layout.changeLoaderValue(false);
      }
    }
  );
}
async function saveFilesHandler() {
  v$.value.$touch();
  if (v$.value.$invalid) {
    productFilesError.value = true;
    return;
  } else {
    try {
      productFilesError.value = false;
      isLoading.value = true;
      const formData = new FormData();
      formData.append("productVersionId", productVersionId.value);
      if (existingFilesState.files.length > 0) {
        existingFilesState.files.forEach((file) => {
          formData.append("fileIds[]", file.id);
        });
      }
      productFilesState.files.forEach((file) => {
        formData.append("files[]", file ?? null);
      });
      await addProductFilesRequest(formData);
      Toast.fire({
        title: productId ? "Record updated successfully!" : "Record created successfully!",
        icon: "success",
      });
      isLoading.value = false;
      navigateTo("/products");
    } catch (error) {
      if (error && error?.response && error?.response?.data) {
        Toast.fire({
          icon: "error",
          title: error?.response?.data?.message,
        });
      }
      isLoading.value = false;
    }
  }
}

function setFiles(event) {
  const file = event.target.files;
  if (file.length === 0) {
    return false;
  }
  for (var i = 0; i < file.length; i++) {
    //check if array already has the file so no duplication occurs
    if (
      productFilesState.files.filter((e) => e.name === file[i].name).length > 0
    ) {
      continue;
    }
    let getFile = file[i];
    productFilesState.files.push(getFile);
    if (productFilesState.files.length > 0) {
      // to handle error state
      productFilesError.value = false;
    }
  }
}

function dropHandler(event) {
  event.preventDefault();
  if (event.dataTransfer.items) {
    // Use DataTransferItemList interface to access the file(s)
    for (var i = 0; i < event.dataTransfer.items.length; i++) {
      const item = event.dataTransfer.items[i];
      // If dropped items aren't files, reject them
      if (item.kind === "file") {
        const file = item.getAsFile();
        //check if array already has the file so no duplication occurs
        if (
          productFilesState.files.filter((e) => e.name === file.name).length > 0
        ) {
          continue;
        }
        let getFile = file;
        productFilesState.files.push(getFile);
      }
    }
  }
};

function skipStep() {
  navigateTo("/products");
}
</script>

<template>
  <div>
    <div class="card">
      <div
        class="card-header d-flex align-items-center justify-content-between"
      >
        
        <div class="d-flex align-items-center">
          <h3 class="card-title me-2">{{ $t('Fill Product Files') }}</h3>
        <elements-tooltip />
        </div>
        <div class="form-group m-0 w-25">
          <elements-multiselect
            v-model="productVersionId"
            :options="productVersionsOptions"
            :key="productVersionId"
            label="name"
            track-by="value"
            :textLabel="$t('Version')"
            :required="true"
            :class="{ 'is-invalid': v$.productVersionId.$error }"
          />
          <div v-if="v$.productVersionId.$error" class="invalid-feedback">
            <span class="text-danger" v-if="v$.productVersionId.required">{{
              $t("This value is required")
            }}</span>
          </div>
        </div>
      </div>
      <div class="card-body">
        <div class="row mt-4">
          <div class="col-lg-12">
            <div class="custom-dropzone">
              <div
                class="dropzone"
                @drop="dropHandler"
                @dragover="(event) => event.preventDefault()"
              >
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
                    <input
                      id="hidden-input"
                      type="file"
                      ref="file"
                      @change="setFiles"
                      name="files[]"
                      multiple
                      class="hidden"
                      :accept="accept"
                    />
                    <button
                      @click="$refs.file.click()"
                      id="button"
                      type="button"
                      class="primary-btn"
                    >
                      <i class="fe-upload me-2"></i>
                      {{ $t("SELECT FILE") }}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div v-if="productFilesError">
              <span class="text-danger">{{
                $t("This value is required")
              }}</span>
            </div>
            <div v-else></div>
            <section>
              <div class="dropzone-area mt-3">
                <div class="row">
                  <div
                    class="col-xl-4 my-2"
                    v-for="(file, index) in existingFilesState?.files"
                    :key="index"
                  >
                    <div class="card mb-1 shadow-none border">
                      <div class="p-2">
                        <div class="row align-items-center">
                          <div class="col-auto">
                            <div class="avatar-sm">
                              <span
                                class="avatar-title bg-soft-primary text-primary rounded"
                              >
                                .ZIP
                              </span>
                            </div>
                          </div>
                          <div class="col pl-0">
                            <a
                              href="javascript:void(0);"
                              class="text-muted font-weight-semibold"
                            >
                              {{ file?.viewableName }}</a
                            >

                            <p v-if="file.size" class="mb-0">
                              {{
                                file.size > 1024
                                  ? file.size > 1048576
                                    ? Math.round(file.size / 1048576) + "mb"
                                    : Math.round(file.size / 1024) + "kb"
                                  : file.size + "b"
                              }}
                            </p>
                          </div>
                          <div
                            class="col-auto"
                            @click="
                              () => {
                                existingFilesState.files.splice(index, 1);
                                if (existingFilesState.files.length < 1) {
                                  productFilesError.value = true;
                                }
                              }
                            "
                          >
                            <a
                              href="javascript:void(0);"
                              class="btn btn-link btn-lg text-muted"
                            >
                              <i class="fe-trash"></i>
                            </a>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div
                    class="col-xl-4 my-2"
                    v-for="(file, index) in productFilesState?.files"
                    :key="index"
                  >
                    <div class="card mb-1 shadow-none border">
                      <div class="p-2">
                        <div class="row align-items-center">
                          <div class="col-auto">
                            <div class="avatar-sm">
                              <span
                                class="avatar-title bg-soft-primary text-primary rounded"
                              >
                                <elements-icon v-bind:icon="'uploadFileIcon'" />
                              </span>
                            </div>
                          </div>
                          <div class="col pl-0">
                            <a
                              href="javascript:void(0);"
                              class="text-muted font-weight-semibold"
                            >
                              {{ file.name }}</a
                            >

                            <p v-if="file.size" class="mb-0">
                              {{
                                file.size > 1024
                                  ? file.size > 1048576
                                    ? Math.round(file.size / 1048576) + "mb"
                                    : Math.round(file.size / 1024) + "kb"
                                  : file.size + "b"
                              }}
                            </p>
                          </div>
                          <div
                            class="col-auto"
                            @click="
                              () => {
                                productFilesState.files.splice(index, 1);
                                if (productFilesState.files.length < 1) {
                                  productFilesError.value = true;
                                }
                              }
                            "
                          >
                            <a
                              href="javascript:void(0);"
                              class="btn btn-link btn-lg text-muted"
                            >
                              <i class="fe-trash"></i>
                            </a>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
    <div
      class="form-group text-right mt-3 d-flex align-items-center justify-content-end"
    >
     <button class="primary-btn me-3" @click="skipStep()">
          <!-- <elements-icon v-bind:icon="'cancelIcon'" class="me-2"/> -->
          <span>{{ $t("Skip") }}</span>
      </button>
      <button class="link_text primary-btn me-3" @click.prevent="prevStep()">
        <elements-icon v-bind:icon="'backIcon'" class="me-2" />
        {{$t("Previous")}}
      </button>
      <submittal-button
        @click="saveFilesHandler"
        :isLoading="isLoading.value"
        :iconName="('addIcon')"
        :buttonName="$t('Create')"
      />
    </div>
  </div>
</template>
