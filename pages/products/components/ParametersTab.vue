<script setup lang="ts">
import { ref, reactive, computed, inject, watch } from "vue";
import commonCode from "~/composables/common";
import { useVuelidate } from "@vuelidate/core";
import { minLength, required } from "@vuelidate/validators";
import { ValidateEach } from "@vuelidate/components";
import { useLayoutStore } from "~/store/layout";
import { useProductStore } from "~/store/product";
import {
  getProductParametersRequest,
  addProductParametersRequest,
  convertFileToBaseRequest,
} from "~/utils/apiRequests";

const layout = useLayoutStore();
const product = useProductStore();
const { router, Toast } = commonCode();
const productId = router.params.id;
const { t } = useI18n();
const parametersState = reactive([
  {
    id: null,
    type: "text",
    key: "",
    value: null,
    fileName: "",
    file: null,
  },
]);
const isLoading = ref(false);
const productVersionId = reactive({
  versionId: null,
});
const productVersionsOptions = ref([]);
const parametersTypeOptions = [
  { value: "text", name: "Text" },
  { value: "number", name: "Number" },
  { value: "file", name: "File" },
];

const parametersValidation = {
  id: {
    minLength: minLength(parametersState.length),
  },
  type: {
    required,
    minLength: minLength(parametersState.length),
  },
  key: {
    required,
    minLength: minLength(parametersState.length),
  },
  value: {
    required,
    minLength: minLength(parametersState.length),
  },
  fileName: {
    required,
    minLength: minLength(parametersState.length),
  },
  file: {
    required,
    minLength: minLength(parametersState.length),
  },
};
const versionIdValidation = {
  versionId: { required },
};

const paramValid = useVuelidate(parametersValidation, parametersState as any);
const versionValid = useVuelidate(versionIdValidation, productVersionId);
const { nextStep, prevStep }: any = inject("nextPrevSteps");

// set product versions when product created in 1st step
watch(
  () => product.productVersion,
  (prod) => {
    productVersionsOptions.value = prod;
    productVersionId.versionId = productVersionsOptions.value[0]?.value;
  }
);

async function checkFileUpload(e, index) {
  try {
    isLoading.value = true;
    const formData = new FormData();
    formData.append("file", e.target.files[0]);
    const res = await convertFileToBaseRequest(formData);
    parametersState[index].file = res?.data?.base64;
    parametersState[index].fileName = res?.data?.name;
    isLoading.value = false;
  } catch (e) {
    console.log(e);
    isLoading.value = false;
  }
}

// in update case, get values when version got selected
if (productId) {
  watch(
    () => productVersionId.versionId,
    async (selectedVersion) => {
      try {
        layout.changeLoaderValue(true);
        const res = await getProductParametersRequest({
          versionId: selectedVersion,
        });
        if (res?.data?.length > 0) {
          const requiredRes = res?.data.map((res: any) => {
            return res.type === "file"
              ? {
                  id: res?.id,
                  type: res?.type,
                  key: res?.key,
                  fileName: res?.fileName,
                  file: res?.value,
                }
              : res;
          });
          parametersState.length = 0; // clear
          parametersState.push(...requiredRes);
        } else {
          // initial state
          parametersState.length = 0;
          parametersState.push({
            id: null,
            type: "text",
            key: "",
            value: null,
            fileName: "",
            file: null,
          });
        }
        layout.changeLoaderValue(false);
      } catch (e) {
        console.log(e);
        layout.changeLoaderValue(false);
      }
    }
  );
}
function skipStep() {
  nextStep();
}
async function saveProductParametersHandler() {
  paramValid.value.$touch();
  versionValid.value.$touch();
  // TODO
  // if (paramValid.value.$invalid || versionValid.value.$invalid ) {
  if (false) {
    return;
  } else {
    try {
      isLoading.value = true;
      await addProductParametersRequest({
        productVersionId: productVersionId.versionId,
        data: parametersState,
      });
      Toast.fire({
        title: productId
          ? "Parameters updated successfully"
          : "Parameters created successfully",
        icon: "success",
      });
      isLoading.value = false;
      nextStep();
    } catch (error) {
      if (error && error.response && error.response.data) {
        Toast.fire({
          icon: "error",
          title: error.response.data.message,
        });
      }
      isLoading.value = false;
    }
  }
}
</script>

<template>
  <div>
    <div class="card">
      <div
        class="card-header d-flex align-items-center justify-content-between"
      >
        <div class="d-flex align-items-center">
          <h3 class="card-title me-2">{{ $t('Add Setup Parameters') }}</h3>
          <elements-tooltip />
        </div>
        <div class="form-group m-0 w-25">
          <elements-multiselect
            v-model="productVersionId.versionId"
            :options="productVersionsOptions"
            :key="productVersionId.versionId"
            label="name"
            track-by="value"
            :textLabel="$t('Version')"
            :required="true"
            :class="{ 'is-invalid': versionValid.versionId.$error }"
          />
          <div v-if="versionValid.versionId.$error" class="invalid-feedback">
            <span class="text-danger" v-if="versionValid.versionId.required">{{
              $t("This value is required")
            }}</span>
          </div>
        </div>
      </div>
      <div class="card-body">
        <ValidateEach
          v-for="(parameter, index) in parametersState"
          :key="index"
          :state="parameter"
          :rules="parametersValidation"
        >
          <template #default="{ v }">
            <div class="row align-items-center mt-4">
              <div class="col-lg-4">
                <div class="form-group mb-0 mt-0">
                  <elements-multiselect
                    v-model="v.type.$model"
                    :options="parametersTypeOptions"
                    :key="v.type.$model"
                    label="name"
                    track-by="value"
                    :textLabel="$t('Type')"
                    :required="true"
                    :class="{ 'is-invalid': v.type.$error }"
                  />
                  <div
                    v-for="(error, errorIndex) in v.type.$errors"
                    :key="errorIndex"
                    class="invalid-feedback"
                  >
                    <span class="text-danger" v-if="error.$message"
                      >{{ error.$message }}
                    </span>
                  </div>
                </div>
              </div>
              <div class="col-lg-4">
                <div class="form-group mb-0 mt-0">
                  <elements-input
                    v-model="v.key.$model"
                    :label="$t('Key')"
                    :required="true"
                    id="name"
                    :class="{ 'is-invalid': v.key.$error }"
                  />
                  <div
                    v-for="(error, errorIndex) in v.key.$errors"
                    :key="errorIndex"
                    class="invalid-feedback"
                  >
                    <span class="text-danger" v-if="error.$message"
                      >{{ error.$message }}
                    </span>
                  </div>
                </div>
              </div>
              <div class="col-lg-3">
                <div
                  class="form-group mb-0 mt-0"
                  v-if="parameter.type == 'file'"
                >
                  <div :style="{ position: 'relative' }">
                    <elements-input
                      v-model="v.fileName.$model"
                      :label="$t('File')"
                      :required="true"
                      id="name"
                      :type="text"
                      :class="{ 'is-invalid': v.fileName.$error }"
                    />
                    <input
                      class="form-control"
                      @change="checkFileUpload($event, index)"
                      type="file"
                      :style="{ opacity: 0, position: 'absolute', top: 0 }"
                    />
                  </div>
                  <div
                    v-for="(error, errorIndex) in v.fileName.$errors"
                    :key="errorIndex"
                    class="invalid-feedback"
                  >
                    <span class="text-danger" v-if="error.$message"
                      >{{ error.$message }}
                    </span>
                  </div>
                </div>

                <div class="form-group mb-0 mt-0" v-else>
                  <elements-input
                    v-model="v.value.$model"
                    :label="$t('Value')"
                    :required="true"
                    id="name"
                    :type="parameter.type"
                    :class="{ 'is-invalid': v.value.$error }"
                  />
                  <div
                    v-for="(error, errorIndex) in v.value.$errors"
                    :key="errorIndex"
                    class="invalid-feedback"
                  >
                    <span class="text-danger" v-if="error.$message"
                      >{{ error.$message }}
                    </span>
                  </div>
                </div>
              </div>
              <div class="col-lg-1">
                <div
                  class="delete-parameter"
                  @click="parametersState.splice(index, 1)"
                >
                  <elements-icon v-bind:icon="'deleteIcon'" />
                </div>
              </div>
            </div>
          </template>
        </ValidateEach>
        <div class="row mt-3">
          <div class="col-lg-12">
            <button
              class="blue-btn"
              @click="
                parametersState.push({
                  id: null,
                  type: 'text',
                  key: '',
                  value: '',
                  fileName: '',
                  file: null,
                })
              "
            >
              <ElementsIcon v-bind:icon="'addIcon'" class="me-2" /> {{ "Add" }}
            </button>
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
        {{ $t("Previous") }}
      </button>
      <submittal-button
        @click="saveProductParametersHandler"
        :isLoading="isLoading.value"
        :iconName="'saveIcon'"
        :buttonName="$t('Save and Proceed')"
      />
    </div>
  </div>
</template>
