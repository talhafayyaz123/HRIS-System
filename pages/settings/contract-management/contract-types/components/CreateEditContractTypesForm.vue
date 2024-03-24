<script setup lang="ts">
import { useVuelidate } from "@vuelidate/core";
import { required } from "@vuelidate/validators";
import commonCode from "~/composables/common";
import { useLayoutStore } from "~/store/layout";
import { routes } from "~/utils/apiRoutes";
import { reactive, onMounted } from "vue";
import genericFunctionality from "~/composables/genericFunctionality";

const layout = useLayoutStore();
const { isLoading, apiRoute, storeFunc, updateFunc, showFunc } =
  genericFunctionality();
const { router, Toast } = commonCode();
const { t } = useI18n();

const props = defineProps(["id"]);
const contractTypeId = props.id;

const state = reactive({
  name: "",
});

const validationRules = {
    name: { required },
  },
  v$ = useVuelidate(validationRules, state);

// In case of edit, populate country
onMounted(async function () {
  try {
    if (!contractTypeId) {
      return;
    }
    layout.changeLoaderValue(true);
    apiRoute.value = routes.CONTRACT_TYPES;
    let response = await showFunc(contractTypeId);
    if (!!response?.success) {
      state.name = response?.data?.name;
    }
    layout.changeLoaderValue(false);
  } catch (e) {
    layout.changeLoaderValue(true);
  }
});

async function contractTypesHandler() {
  // stop here if form is invalid
  v$.value.$touch();
  if (v$.value.$invalid) {
    return;
  } else {
    apiRoute.value = routes.CONTRACT_TYPES;
    const payload = {
      name: state.name,
    };
    contractTypeId
      ? updateFunc(
          payload,
          contractTypeId,
          "/settings/contract-management/contract-types"
        )
      : storeFunc(payload, "/settings/contract-management/contract-types");
  }
}
</script>

<template>
  <div>
    <div class="row">
      <div class="col-lg-6">
        <div class="card h-auto">
          <div class="card-header d-flex align-items-center">
            <h3 class="card-title me-2">
              {{ $t("Fill Contract Type Details") }}
            </h3>
            <elements-tooltip />
          </div>
          <div class="card-body">
            <div class="row">
              <div class="col-lg-12">
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
            </div>
          </div>
        </div>
        <div class="mt-3 d-flex align-items-center justify-content-end">
          <button
            class="primary-btn me-3"
            @click="navigateTo('/settings/contract-management/contract-types')"
          >
            <elements-icon v-bind:icon="'cancelIcon'" class="me-2" />
            <span>{{ $t("Cancel") }}</span>
          </button>
          <submittal-button
            :isLoading="isLoading"
            @click="contractTypesHandler"
            :iconName="'saveIcon'"
            :buttonName="$t('Save and Proceed')"
          />
        </div>
      </div>
    </div>
  </div>
</template>
