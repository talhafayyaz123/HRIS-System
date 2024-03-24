<script setup lang="ts">
import { ref, reactive, inject, watch } from "vue";
import commonCode from "~/composables/common";
import { useVuelidate } from "@vuelidate/core";
import { required } from "@vuelidate/validators";
import { useProductStore } from "~/store/product";
import { useLayoutStore } from "~/store/layout";

import {
  addProductUninstallRoutinesRequest,
  getProductUninstallRoutinesRequest,
} from "~/utils/apiRequests";

const layout = useLayoutStore();
const { router, Toast } = commonCode();
const productId = router.params.id;
const product = useProductStore();
const { t } = useI18n();
const state = reactive({
  productVersionId: null,
  windowsUninstallRoutine: {
    premise: "",
    public: "",
    private: "",
  },
  linuxUninstallRoutine: {
    premise: "",
    public: "",
    private: "",
  },
  macUninstallRoutine: {
    premise: "",
    public: "",
    private: "",
  },
});
const isLoading = ref(false);
const productVersionsOptions = ref([]);

watch(
  () => product.productVersion,
  (prod) => {
    productVersionsOptions.value = prod;
    state.productVersionId = productVersionsOptions.value[0]?.value
  }
);
const validationRules = {
  productVersionId: { required }
};
const v$ = useVuelidate(validationRules, state);
const { nextStep, prevStep }: any = inject("nextPrevSteps");

// in update case, get values when version got selected
if (productId) {
  watch(
    () => state.productVersionId,
    async (selectedVersion) => {
      try {
        layout.changeLoaderValue(true);
        const res = await getProductUninstallRoutinesRequest(selectedVersion);
        state.windowsUninstallRoutine = { ...res.data.windowsUninstallRoutine };
        state.linuxUninstallRoutine = { ...res.data.linuxUninstallRoutine };
        state.macUninstallRoutine = { ...res.data.macUninstallRoutine };
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
async function saveUnInstallRoutinesHandler() {
  // stop here if form is invalid
  v$.value.$touch();
  if (v$.value.$invalid) {
    return;
  } else {
    try {
      isLoading.value = true;
      await addProductUninstallRoutinesRequest({ ...state });
      Toast.fire({
        title: productId ? "Record updated successfully!" : "Record created successfully!",
        icon: "success",
      });
      isLoading.value = false;
      nextStep();
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
</script>

<template>
  <div>
    <div class="card">
      <div
        class="card-header d-flex align-items-center justify-content-between"
      >
      <div class="d-flex align-items-center">
        <h3 class="card-title me-2">{{ $t('Fill Uninstall Routines') }}</h3>
        <elements-tooltip />
        </div>
       
        <div class="form-group mb-0 w-25">
          <elements-multiselect
            v-model="state.productVersionId"
            :options="productVersionsOptions"
            :key="state.productVersionId"
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
        <div class="accordion mt-3 product-accordian" id="accordionExample">
          <div class="accordion-item">
            <h2 class="accordion-header" id="headingOne">
              <button
                class="accordion-button collapsed"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#collapseOne"
                aria-expanded="true"
                aria-controls="collapseOne"
              >
              {{ $t('Textarea for windows uninstall routines') }}
              <elements-icon v-bind:icon="'downArowIcon'" class="arrow" />
              </button>
            </h2>
            <div
              id="collapseOne"
              class="accordion-collapse collapse"
              aria-labelledby="headingOne"
              data-bs-parent="#accordionExample"
            >
              <div class="accordion-body">
                <div class="row">
                  <div class="col-md-6">
                    <div class="form-group textarea">
                      <textarea
                        class="form-control"
                        v-model="state.windowsUninstallRoutine.premise"
                        rows="5"
                        placeholder="."
                      ></textarea>
                      <label for="" class="input-label"
                        >{{ $t('Windows premise uninstall routine') }}</label
                      >
                    </div>
                  </div>
                  <div class="col-md-6">
                    <div class="form-group textarea">
                      <textarea
                        class="form-control"
                        v-model="state.windowsUninstallRoutine.public"
                        rows="5"
                        placeholder="."
                      ></textarea>
                      <label for="" class="input-label"
                        >{{ $t('Windows public uninstall routine') }}</label
                      >
                    </div>
                  </div>
                  <div class="col-md-6">
                    <div class="form-group textarea">
                      <textarea
                        class="form-control"
                        v-model="state.windowsUninstallRoutine.private"
                        rows="5"
                        placeholder="."
                      ></textarea>
                      <label for="" class="input-label"
                        >{{ $t('Windows private install routine') }}</label
                      >
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="accordion-item">
            <h2 class="accordion-header" id="headingTwo">
              <button
                class="accordion-button collapsed"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#collapseTwo"
                aria-expanded="false"
                aria-controls="collapseTwo"
              >
              {{ $t('Textarea for linux uninstall routines') }}
              <elements-icon v-bind:icon="'downArowIcon'" class="arrow" />
              </button>
            </h2>
            <div
              id="collapseTwo"
              class="accordion-collapse collapse"
              aria-labelledby="headingTwo"
              data-bs-parent="#accordionExample"
            >
              <div class="accordion-body">
                <div class="row">
                  <div class="col-md-6">
                    <div class="form-group textarea">
                      <textarea
                        class="form-control"
                        v-model="state.linuxUninstallRoutine.premise"
                        rows="5"
                        placeholder="."
                      ></textarea>
                      <label for="" class="input-label"
                        >{{ $t('Linux premise uninstall routine') }}</label
                      >
                    </div>
                  </div>
                  <div class="col-md-6">
                    <div class="form-group textarea">
                      <textarea
                        class="form-control"
                        v-model="state.linuxUninstallRoutine.public"
                        rows="5"
                        placeholder="."
                      ></textarea>
                      <label for="" class="input-label"
                        >{{ $t('Linux public uninstall routine') }}</label
                      >
                    </div>
                  </div>
                  <div class="col-md-6">
                    <div class="form-group textarea">
                      <textarea
                        class="form-control"
                        v-model="state.linuxUninstallRoutine.private"
                        rows="5"
                        placeholder="."
                      ></textarea>
                      <label for="" class="input-label"
                        >{{ $t('Linux private uninstall routine') }}</label
                      >
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="accordion-item">
            <h2 class="accordion-header" id="headingThree">
              <button
                class="accordion-button collapsed"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#collapseThree"
                aria-expanded="false"
                aria-controls="collapseThree"
              >
              {{ $t('Textarea for mac uninstall routines') }}
              <elements-icon v-bind:icon="'downArowIcon'" class="arrow" />
              </button>
            </h2>
            <div
              id="collapseThree"
              class="accordion-collapse collapse"
              aria-labelledby="headingThree"
              data-bs-parent="#accordionExample"
            >
              <div class="accordion-body">
                <div class="row">
                  <div class="col-md-6">
                    <div class="form-group textarea">
                      <textarea
                        class="form-control"
                        v-model="state.macUninstallRoutine.premise"
                        rows="5"
                        placeholder="."
                      ></textarea>
                      <label for="" class="input-label"
                        >{{ $t('Mac premise uninstall routine') }}</label
                      >
                    </div>
                  </div>
                  <div class="col-md-6">
                    <div class="form-group textarea">
                      <textarea
                        class="form-control"
                        v-model="state.macUninstallRoutine.public"
                        rows="5"
                        placeholder="."
                      ></textarea>
                      <label for="" class="input-label"
                        >{{ $t('Mac public uninstall routine') }}</label
                      >
                    </div>
                  </div>
                  <div class="col-md-6">
                    <div class="form-group textarea">
                      <textarea
                        class="form-control"
                        v-model="state.macUninstallRoutine.private"
                        rows="5"
                        placeholder="."
                      ></textarea>
                      <label for="" class="input-label"
                        >{{ $t('Mac private uninstall routine') }}</label
                      >
                    </div>
                  </div>
                </div>
              </div>
            </div>
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
        @click="saveUnInstallRoutinesHandler"
        :isLoading="isLoading.value"
        :iconName="('saveIcon')"
        :buttonName="$t('Save and Proceed')"
      />
    </div>
  </div>
</template>
