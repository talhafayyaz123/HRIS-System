<script setup lang="ts">
import { useVuelidate } from "@vuelidate/core";
import { required, requiredIf, minLength } from "@vuelidate/validators";
import { ValidateEach } from "@vuelidate/components";

import commonCode from "~/composables/common";
import { useLayoutStore } from "~/store/layout";
import { routes } from "~/utils/apiRoutes";
import { ref, reactive, onMounted } from "vue";
import genericFunctionality from "~/composables/genericFunctionality";
import { genericListingRequest, docListRequest } from "~/utils/apiRequests";

const layout = useLayoutStore();
const { isLoading, apiRoute, storeFunc, updateFunc, showFunc } =
  genericFunctionality();
const { router, Toast } = commonCode();
const { t } = useI18n();

const props = defineProps(["id"]);
const attachmentId = props.id;

const state = reactive({
  name: "",
  softwareId: "",
  templateId: "",
  contractTypeId: "",
  prefix: "",
  version: "",
  runtimeIn: "",
  renewalPeriodIn: "",
  contractEndAt: "",
  noticePeriodIn: "",
  renewalPeriod: false,
  rightOfTermination: false,
  allowToAddSla: false,
  selectUser: false,
});

const contractFieldsState = reactive([
  // {
  //   // id: null,
  //   type: "text",
  //   key: "",
  // },
]);

const contractFieldTypeOptions = [
  { value: "text", name: "Text" },
  { value: "number", name: "Number" },
  { value: "date", name: "Date" },
  { value: "time", name: "Time" },
  { value: "customer", name: "Customer" },
  { value: "invoice", name: "Invoice" },
  { value: "offer", name: "Offer" },
  { value: "performance_record", name: "Performance Record" },
  { value: "product", name: "Products" },
];
const softwareOptions = ref([]);
const contractTypesOptions = ref([]);
const templateOptions = ref([]);
const contractFieldsValidation = {
  type: {
    required,
    minLength: minLength(contractFieldsState.length),
  },
  key: {
    required,
    minLength: minLength(contractFieldsState.length),
  },
};

const attachmentDetailsValidation = {
  name: { required },
  softwareId: { required },
  templateId: { required },
  contractTypeId: { required },
  prefix: { required },
  version: { required },
  runtimeIn: { required },
  renewalPeriodIn: {
    required: requiredIf(function () {
      return state.renewalPeriod ? true : false;
    }),
  },
  noticePeriodIn: { required },
};

const contractFieldsValid = useVuelidate(
  contractFieldsValidation,
  contractFieldsState as any
);
const v$ = useVuelidate(attachmentDetailsValidation, state);

// populate dropdowns
onMounted(async function () {
  try {
    layout.changeLoaderValue(true);

    const softwareRes = await genericListingRequest(routes.PRODUCT_SOFTWARE, {
      all: true,
    });
    const contractTypesRes = await genericListingRequest(
      routes.CONTRACT_TYPES,
      {
        all: true,
      }
    );
    const templateRes = await docListRequest({ start: 0, count: 25 });

    softwareOptions.value = softwareRes?.data?.map((ps: any) => {
      return {
        value: ps.id,
        text: ps.name,
      };
    });
    templateOptions.value = templateRes?.data?.map((list: any) => {
      return { value: list?.name, text: list?.name };
    });
    contractTypesOptions.value = contractTypesRes?.data?.contractTypes.map(
      (ps: any) => {
        return {
          value: ps.id,
          text: ps.name,
        };
      }
    );

    layout.changeLoaderValue(false);
  } catch (e) {
    console.log(e);
    layout.changeLoaderValue(false);
  }
});

// In case of edit, populate
onMounted(async function () {
  try {
    if (!attachmentId) {
      return;
    }
    layout.changeLoaderValue(true);
    apiRoute.value = routes.CONTRACT_ATTACHMENT;
    let response = await showFunc(attachmentId);
    if (!!response?.success) {
      const {
        name,
        softwareId,
        templateId,
        contractTypeId,
        prefix,
        version,
        runtimeIn,
        renewalPeriodIn,
        contractEndAt,
        noticePeriodIn,
        renewalPeriod,
        rightOfTermination,
        allowToAddSla,
        selectUser,
        contractFields,
      } = response?.data;

      state.name = name;
      state.softwareId = softwareId;
      state.templateId = templateId;
      state.contractTypeId = contractTypeId;
      state.prefix = prefix;
      state.version = version;
      state.runtimeIn = runtimeIn;
      state.renewalPeriodIn = renewalPeriodIn;
      state.contractEndAt = contractEndAt;
      state.noticePeriodIn = noticePeriodIn;
      state.renewalPeriod = renewalPeriod;
      state.rightOfTermination = rightOfTermination;
      state.allowToAddSla = allowToAddSla;
      state.selectUser = selectUser;
      contractFieldsState.push(...contractFields);
    }
    layout.changeLoaderValue(false);
  } catch (e) {
    layout.changeLoaderValue(true);
  }
});

async function attachmentHandler() {
  v$.value.$touch();
  contractFieldsValid.value.$touch();
  // if (v$.value.$invalid || contractFieldsValid.value.$invalid) {
  if (false) {
    return;
  } else {
    apiRoute.value = routes.CONTRACT_ATTACHMENT;
    const payload = {
      ...state,
      contractFields: contractFieldsState,
    };
    attachmentId
      ? updateFunc(
          payload,
          attachmentId,
          "/settings/contract-management/attachments"
        )
      : storeFunc(payload, "/settings/contract-management/attachments");
  }
}
</script>

<template>
  <div>
    <div class="row">
      <div class="col-lg-12">
        <div class="card h-auto">
          <div class="card-header d-flex align-items-center">
            <h3 class="card-title me-2">
              {{ $t("Fill Attachment Details") }}
            </h3>
            <elements-tooltip />
          </div>
          <div class="card-body">
            <div class="row">
              <div class="col-lg-4">
                <div class="form-group">
                  <elements-input
                    v-model="state.name"
                    :label="$t('Name')"
                    :required="true"
                    id="category-name"
                    :class="{ 'is-invalid': v$.name.$error }"
                  />
                </div>
                <div v-if="v$.name.$error" class="invalid-feedback">
                  <span class="text-danger" v-if="v$.name.required">{{
                    $t("This value is required")
                  }}</span>
                </div>
              </div>
              <div class="col-lg-4">
                <div class="form-group">
                  <elements-multiselect
                    v-model="state.softwareId"
                    :options="softwareOptions"
                    :key="state.softwareId"
                    label="text"
                    track-by="value"
                    :textLabel="$t('Software')"
                    :required="true"
                    :class="{ 'is-invalid': v$.softwareId.$error }"
                  />
                </div>
                <div v-if="v$.softwareId.$error" class="invalid-feedback">
                  <span class="text-danger" v-if="v$.softwareId.required">{{
                    $t("This value is required")
                  }}</span>
                </div>
              </div>
              <div class="col-lg-4">
                <div class="form-group">
                  <elements-multiselect
                    v-model="state.templateId"
                    :options="templateOptions"
                    :key="state.templateId"
                    label="text"
                    track-by="value"
                    :textLabel="$t('Template')"
                    :required="true"
                    :class="{ 'is-invalid': v$.templateId.$error }"
                  />
                </div>
                <div v-if="v$.templateId.$error" class="invalid-feedback">
                  <span class="text-danger" v-if="v$.templateId.required">{{
                    $t("This value is required")
                  }}</span>
                </div>
              </div>
              <div class="col-lg-4">
                <div class="form-group">
                  <elements-multiselect
                    v-model="state.contractTypeId"
                    :options="contractTypesOptions"
                    :key="state.contractTypeId"
                    label="text"
                    track-by="value"
                    :textLabel="$t('Contract Type')"
                    :required="true"
                    :class="{ 'is-invalid': v$.contractTypeId.$error }"
                  />
                </div>
                <div v-if="v$.contractTypeId.$error" class="invalid-feedback">
                  <span class="text-danger" v-if="v$.contractTypeId.required">{{
                    $t("This value is required")
                  }}</span>
                </div>
              </div>
              <div class="col-lg-4">
                <div class="form-group">
                  <elements-input
                    v-model="state.prefix"
                    :label="$t('Prefix')"
                    :required="true"
                    id="category-name"
                    :class="{ 'is-invalid': v$.prefix.$error }"
                  />
                </div>
                <div v-if="v$.prefix.$error" class="invalid-feedback">
                  <span class="text-danger" v-if="v$.prefix.required">{{
                    $t("This value is required")
                  }}</span>
                </div>
              </div>
              <div class="col-lg-4">
                <div class="form-group">
                  <elements-input
                    v-model="state.version"
                    :label="$t('Version')"
                    :required="true"
                    id="category-name"
                    :class="{ 'is-invalid': v$.version.$error }"
                  />
                </div>
                <div v-if="v$.version.$error" class="invalid-feedback">
                  <span class="text-danger" v-if="v$.version.required">{{
                    $t("This value is required")
                  }}</span>
                </div>
              </div>
              <div class="col-lg-4">
                <div class="form-group">
                  <elements-input
                    v-model="state.runtimeIn"
                    :label="$t('Runtime (months)')"
                    :required="true"
                    id="category-name"
                    :class="{ 'is-invalid': v$.runtimeIn.$error }"
                    type="number"
                  />
                </div>
                <div v-if="v$.runtimeIn.$error" class="invalid-feedback">
                  <span class="text-danger" v-if="v$.runtimeIn.required">{{
                    $t("This value is required")
                  }}</span>
                </div>
              </div>

              <div class="col-lg-4" v-if="state.renewalPeriod">
                <div class="form-group">
                  <elements-input
                    v-model="state.renewalPeriodIn"
                    :label="$t('Runewal Period(months)')"
                    :required="true"
                    id="runewalPeriod"
                    :class="{ 'is-invalid': v$.renewalPeriodIn.$error }"
                    type="number"
                  />
                </div>
                <div v-if="v$.renewalPeriodIn.$error" class="invalid-feedback">
                  <span
                    class="text-danger"
                    v-if="v$.renewalPeriodIn.required"
                    >{{ $t("This value is required") }}</span
                  >
                </div>
              </div>
              <div class="col-lg-4">
                <div class="form-group">
                  <div class="input-group">
                    <div class="input-group-prepend">
                      <span class="input-group-text">
                        <ElementsIcon v-bind:icon="'dateIcon'" />
                      </span>
                    </div>
                    <elements-input
                      v-model="state.contractEndAt"
                      :label="$t('Contract End')"
                      id="category-name"
                      type="date"
                    />
                  </div>
                </div>
              </div>
              <div class="col-lg-4">
                <div class="form-group">
                  <elements-input
                    v-model="state.noticePeriodIn"
                    :label="$t('Notice Period (months)')"
                    :required="true"
                    id="category-name"
                    :class="{ 'is-invalid': v$.noticePeriodIn.$error }"
                    type="number"
                  />
                </div>
                <div v-if="v$.noticePeriodIn.$error" class="invalid-feedback">
                  <span class="text-danger" v-if="v$.noticePeriodIn.required">{{
                    $t("This value is required")
                  }}</span>
                </div>
              </div>
              <div class="col-lg-4">
                <div class="form-group checkbox-group">
                  <input
                    type="checkbox"
                    class="checkbox-input"
                    id="Renewal"
                    v-model="state.renewalPeriod"
                  />
                  <label for="Renewal" class="checkbox-label">{{
                    $t("Renewal Period")
                  }}</label>
                </div>
              </div>
              <div class="col-lg-4">
                <div class="form-group checkbox-group">
                  <input
                    type="checkbox"
                    class="checkbox-input"
                    id="termination"
                    v-model="state.rightOfTermination"
                  />
                  <label for="termination" class="checkbox-label">{{
                    $t("Special right of termination")
                  }}</label>
                </div>
              </div>
              <div class="col-lg-4">
                <div class="form-group checkbox-group">
                  <input
                    type="checkbox"
                    class="checkbox-input"
                    id="SLAs"
                    v-model="state.allowToAddSla"
                  />
                  <label for="SLAs" class="checkbox-label">{{
                    $t("Allow To Add SLAs")
                  }}</label>
                </div>
              </div>

              <div class="col-lg-4">
                <div class="form-group checkbox-group">
                  <input
                    type="checkbox"
                    class="checkbox-input"
                    id="selectUser"
                    v-model="state.selectUser"
                  />
                  <label for="selectUser" class="checkbox-label">{{
                    $t("Select User")
                  }}</label>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="card mt-3 h-auto">
          <div class="card-header">
            <h3 class="card-title">{{ $t("Add Contract Fields") }}</h3>
          </div>

          <div class="card-body mt-4">
            <ValidateEach
              v-for="(contractField, index) in contractFieldsState"
              :key="index"
              :state="contractField"
              :rules="contractFieldsValidation"
            >
              <template #default="{ v }">
                <div class="row align-items-center mt-4">
                  <div class="col-lg-4">
                    <div class="form-group mb-0 mt-0">
                      <elements-multiselect
                        v-model="v.type.$model"
                        :options="contractFieldTypeOptions"
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

                  <div class="col-lg-1">
                    <div
                      class="delete-parameter"
                      @click="contractFieldsState.splice(index, 1)"
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
                    contractFieldsState.push({
                      type: 'text',
                      key: '',
                    })
                  "
                >
                  <ElementsIcon v-bind:icon="'addIcon'" class="me-2" />
                  {{ "Add" }}
                </button>
              </div>
            </div>
          </div>
        </div>

        <div class="mt-3 d-flex align-items-center justify-content-end">
          <button
            class="primary-btn me-3"
            @click="navigateTo('/settings/contract-management/attachments')"
          >
            <elements-icon v-bind:icon="'cancelIcon'" class="me-2" />
            <span>{{ $t("Cancel") }}</span>
          </button>
          <submittal-button
            :isLoading="state.isLoading"
            @click="attachmentHandler"
            :iconName="'saveIcon'"
            :buttonName="$t('Save and Proceed')"
          />
        </div>
      </div>
    </div>
  </div>
</template>
