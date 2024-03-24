<script setup lang="ts">
import { ref, reactive, computed, inject, watch } from "vue";
import commonCode from "~/composables/common";
import { useVuelidate } from "@vuelidate/core";
import { ValidateEach } from "@vuelidate/components";
import { minLength, required } from "@vuelidate/validators";
import { useProductStore } from "~/store/product";
import { useLayoutStore } from "~/store/layout";

import {
  addProductAdditionalServicesRequest,
  getProductAdditionalServicesRequest,
} from "~/utils/apiRequests";

const product = useProductStore();
const layout = useLayoutStore();
const { router, Toast } = commonCode();
const { t } = useI18n();
const productId = router.params.id;

const installationState = reactive([
  {
    type: "Installation",
    subject: "",
    workingDays: null,
    detail: "",
  },
]);
const configurationState = reactive([
  {
    type: "Configuration",
    subject: "",
    workingDays: null,
    detail: "",
  },
]);
const isLoading = ref(false);
const productVersionId = reactive({
  versionId: null,
});
const productVersionsOptions = ref([]);

const installationValidation = {
  type: {
    required,
    minLength: minLength(installationState.length),
  },
  subject: {
    required,
    minLength: minLength(installationState.length),
  },
  workingDays: {
    required,
    minLength: minLength(installationState.length),
  },
  detail: {},
};

const configurationValidation = {
  type: {
    required,
    minLength: minLength(configurationState.length),
  },
  subject: {
    required,
    minLength: minLength(configurationState.length),
  },
  workingDays: {
    required,
    minLength: minLength(configurationState.length),
  },
  detail: {},
};
const versionIdValidation = {
  versionId: { required },
};

const installValid = useVuelidate(
  installationValidation,
  installationState as any
);
const configValid = useVuelidate(
  configurationValidation,
  configurationState as any
);
const versionValid = useVuelidate(versionIdValidation, productVersionId);

const { nextStep, prevStep }: any = inject("nextPrevSteps");

// set product versions when product created in 1st step
watch(
  () => product.productVersion,
  (prod) => {
    productVersionsOptions.value = prod;
    productVersionId.versionId = productVersionsOptions.value[0]?.value
  }
);
// in update case, get values when version got selected
const requiredFormat = (res: any, type: any) => {
  // helper function
  return {
    type: type,
    subject: res?.subject,
    workingDays: res?.workingDays,
    detail: res?.detail,
    id: res?.id,
  };
};
if (productId) {
  watch(
    () => productVersionId.versionId,
    async (selectedVersion) => {
      try {
        layout.changeLoaderValue(true);
        const res = await getProductAdditionalServicesRequest({
          versionId: selectedVersion,
        });
        if (res?.data?.configurations?.length > 0) {
          const requiredRes = res?.data?.configurations.map((res: any) =>
            requiredFormat(res, "Configuration")
          );
          configurationState.length = 0; // clear
          configurationState.push(...requiredRes);
        }
        if (res?.data?.installations?.length > 0) {
          const requiredRes = res?.data?.installations.map((res: any) =>
            requiredFormat(res, "Installation")
          );
          installationState.length = 0; // clear
          installationState.push(...requiredRes);
        } else {
          // initial state
          configurationState.length = 0;
          installationState.length = 0;
          configurationState.push({
            type: "Configuration",
            subject: "",
            workingDays: null,
            detail: "",
          });
          installationState.push({
            type: "Installation",
            subject: "",
            workingDays: null,
            detail: "",
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
function skipStep(){
  nextStep(); 
}
async function saveAdditionalServicesHandler() {
  installValid.value.$touch();
  configValid.value.$touch();
  versionValid.value.$touch();
  if (
    false
    // installValid.value.$invalid ||
    // configValid.value.$invalid ||
    // versionValid.value.$invalid
  ) {
    // TODO: always returning, need to fix
    // return;
  } else {
    try {
      isLoading.value = true;
      await addProductAdditionalServicesRequest({
        productVersionId: productVersionId.versionId,
        data: [...installationState, ...configurationState],
      });
      Toast.fire({
        title: productId ? "Record updated successfully" : "Record created successfully!",
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
          <h3 class="card-title me-2">{{ $t('Add Additional Services') }}</h3>
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
      <div class="card-header">
        
        <div class="d-flex align-items-center">
          <h3 class="card-title me-2">{{ $t('Installations') }}</h3>
        <elements-tooltip />
        </div>
      </div>
      <div class="card-body">
        <ValidateEach
          v-for="(install, index) in installationState"
          :key="index"
          :state="install"
          :rules="installationValidation"
        >
          <template #default="{ v }">
            <div class="row align-items-center mb-4 mt-4">
              <div class="col-lg-4">
                <div class="form-group mb-0 mt-0">
                  <elements-input
                    v-model="v.subject.$model"
                    :label="$t('Subject')"
                    :required="true"
                    id="name"
                    :class="{ 'is-invalid': v.subject.$error }"
                  />
                  <div
                    v-for="(error, errorIndex) in v.subject.$errors"
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
                    v-model="v.workingDays.$model"
                    :label="$t('Time needed (working days)')"
                    :required="true"
                    id="name"
                    :class="{ 'is-invalid': v.workingDays.$error }"
                  />
                  <div
                    v-for="(error, errorIndex) in v.workingDays.$errors"
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
                <div class="form-group mb-0 mt-0">
                  <elements-input
                    v-model="v.detail.$model"
                    :label="$t('Details')"
                    id="name"
                  />
                </div>
              </div>
              <div class="col-lg-1">
                <div
                  class="delete-parameter"
                  @click="installationState.splice(index, 1)"
                >
                <ElementsIcon v-bind:icon="'deleteIcon'" class="" />
                </div>
              </div>
            </div>
          </template>
        </ValidateEach>

        <div class="row mt-3">
          <div class="col-lg-12">
            <button class="blue-btn"
              @click="
                installationState.push({
                  type: 'Installation',
                  subject: '',
                  workingDays: null,
                  detail: '',
                })
              "
            ><ElementsIcon v-bind:icon="'addIcon'" class="me-2" />
              {{$t('Add')}}</button>
          </div>
        </div>
      </div>
    </div>

    <div class="card mt-4">
      <div class="card-header">
        
        <div class="d-flex align-items-center">
          <h3 class="card-title me-2">{{ $t('Configurations') }}</h3>
        <elements-tooltip />
        </div>
      </div>
      
      <div class="card-body">
        <ValidateEach
          v-for="(config, index) in configurationState"
          :key="index"
          :state="config"
          :rules="configurationValidation"
        >
          <template #default="{ v }">
            <div class="row align-items-center mb-4 mt-4">
              <div class="col-lg-4">
                <div class="form-group mb-0 mt-0">
                  <elements-input
                    v-model="v.subject.$model"
                    :label="$t('Subject')"
                    :required="true"
                    id="subject"
                    :class="{ 'is-invalid': v.subject.$error }"
                  />
                  <div
                    v-for="(error, errorIndex) in v.subject.$errors"
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
                    v-model="v.workingDays.$model"
                    :label="$t('Time needed (working days)')"
                    :required="true"
                    id="days"
                    :class="{ 'is-invalid': v.workingDays.$error }"
                  />
                  <div
                    v-for="(error, errorIndex) in v.workingDays.$errors"
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
                <div class="form-group mb-0 mt-0">
                  <elements-input
                    v-model="v.detail.$model"
                    :label="$t('Details')"
                    id="detail"
                  />
                </div>
              </div>
              <div class="col-lg-1">
                <div
                  class="delete-parameter"
                  @click="configurationState.splice(index, 1)"
                >
                  <ElementsIcon v-bind:icon="'deleteIcon'" />
                </div>
              </div>
            </div>
          </template>
        </ValidateEach>

        <div class="row mt-3">
          <div class="col-lg-12">
            <button class="blue-btn"
              @click="
                configurationState.push({
                  type: 'Configuration',
                  subject: '',
                  workingDays: null,
                  detail: '',
                })
              "
            ><ElementsIcon v-bind:icon="'addIcon'" class="me-2" />
              {{$t('Add')}}</button>
          </div>
        </div>
      </div>
    </div>
    <div
      class="form-group text-right mt-4 d-flex align-items-center justify-content-end"
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
        @click="saveAdditionalServicesHandler"
        :isLoading="isLoading.value"
        :iconName="('saveIcon')"
        :buttonName="$t('Save and Proceed')"
      />
    </div>
  </div>
</template>
