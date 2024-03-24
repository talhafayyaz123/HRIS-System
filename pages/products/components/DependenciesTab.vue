<script setup lang="ts">
import { ref, reactive, computed, inject, onMounted, watch } from "vue";
import commonCode from "~/composables/common";
import { useVuelidate } from "@vuelidate/core";
import { required, minLength } from "@vuelidate/validators";
import { useProductStore } from "~/store/product";
import { useLayoutStore } from "~/store/layout";

import {
  getProductVersionDependency,
  addProductDependenciesRequest,
} from "~/utils/apiRequests";

import Treeselect from "@tkmam1x/vue3-treeselect";
import "@tkmam1x/vue3-treeselect/dist/vue3-treeselect.css";

const layout = useLayoutStore();
const { router, Toast } = commonCode();
const productId = router.params.id;

const { t } = useI18n();
const product = useProductStore();
const state = reactive({
  isLoading: false,
  productVersionId: null,
  showField: true,
  productDependencies: [],
});

const productVersionsOptions = ref([]);
const productDependenciesOptions = ref([]);

const validationRules = {
  productVersionId: { required },
  productDependencies: { required, minLength: minLength(1) },
};
const v$ = useVuelidate(validationRules, state);

const { nextStep, prevStep }: any = inject("nextPrevSteps");


const dependenciesOptions = computed(function () {
  return createDependencyTree(productDependenciesOptions.value);
});
function createDependencyTree(dependencies) {
  const dependencyTree = [];
  if (dependencies instanceof Array) {
    dependencies.forEach((dependency) => {
      if (dependency.selected) {
        state.productDependencies.push(dependency.versionId);
      }
      dependencyTree.push({
        id: dependency.versionId,
        label: dependency.value,
      });
    });
  } else {
    for (let key in dependencies) {
      dependencyTree.push({
        id: Math.random(),
        label: key,
        children: createDependencyTree(dependencies[key]),
      });
    }
  }
  return dependencyTree;
}
function skipStep(){
  nextStep(); 
}
// when product type is service or pauschal, fetch version tree on basic of product Id
watch(
  () => product.productVersion,
  (prod) => {
    productVersionsOptions.value = prod;
    state.productVersionId = productVersionsOptions.value[0]?.value
  }
);
onMounted(async function () {
  try {
    layout.changeLoaderValue(true);
    const res = await getProductVersionDependency();
    productDependenciesOptions.value = res?.data;
    layout.changeLoaderValue(false);
  } catch (e) {
    layout.changeLoaderValue(false);
    console.log(e);
  }
});

// in update case, populate the selected values from dependency tree when version got selected
if (productId) {
  watch(
    () => state.productVersionId,
    async (selectedVersion) => {
      try {
        layout.changeLoaderValue(true);
        state.showField = false
        const res = await getProductVersionDependency({
          productVersionId: selectedVersion,
        });
        state.productDependencies.length = 0
        createDependencyTree(res?.data)
        layout.changeLoaderValue(false);
        state.showField = true
      } catch (e) {
        layout.changeLoaderValue(false);
        console.log(e);
      }
    }
  );
}

async function saveProductDependenciesHandler() {
  // stop here if form is invalid
  v$.value.$touch();
  if (v$.value.$invalid) {
    return;
  } else {
    try {
      state.isLoading = true;
      const formData = {
        productVersionId: state.productVersionId,
        productVersions: state.productDependencies,
      };
      await addProductDependenciesRequest(formData);
      Toast.fire({
        title: productId ? "record updated successfully!" : "Record created successfully!",
        icon: "success",
      });
      state.isLoading = false;
      nextStep();
    } catch (error) {
      if (error && error?.response && error?.response?.data) {
        Toast.fire({
          icon: "error",
          title: error?.response?.data?.message,
        });
      }
      state.isLoading = false;
    }
  }
}
</script>

<template>
  <div>
    <div class="card">
      <div class="card-header d-flex align-items-center justify-content-between">
        <div class="d-flex align-items-center">
          <h3 class="card-title me-2">{{ $t('Add Products Dependencies') }}</h3>
          <elements-tooltip />
        </div>
        <div class="form-group m-0 w-25">
          <div class="form-group">
            <elements-multiselect v-model="state.productVersionId" :options="productVersionsOptions"
              :key="state.productVersionId" label="name" track-by="value" :textLabel="$t('Version')" :required="true"
              :class="{ 'is-invalid': v$.productVersionId.$error }" />
            <div v-if="v$.productVersionId.$error" class="invalid-feedback">
              <span class="text-danger" v-if="v$.productVersionId.required">{{
                $t("This value is required")
              }}</span>
            </div>
          </div>
        </div>
      </div>
      <div class="card-body">
        <div class="row">
          <div class="col-lg-6">
            <div class="form-group">
              <treeselect v-if="state.showField" v-model="state.productDependencies" :multiple="true"
                :valueConsistsOf="'LEAF_PRIORITY'" :options="dependenciesOptions"
                :class="{ 'is-invalid': v$.productDependencies.$error }">
              </treeselect>
              <div v-if="v$.productDependencies.$error" class="invalid-feedback">
                <span class="text-danger" v-if="v$.productDependencies.required">{{ $t("This value is required") }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="form-group text-right mt-3 d-flex align-items-center justify-content-end">
      <button class="primary-btn me-3" @click="skipStep()">
          <!-- <elements-icon v-bind:icon="'cancelIcon'" class="me-2"/> -->
          <span>{{ $t("Skip") }}</span>
      </button>
      <button class="link_text primary-btn me-3" @click.prevent="prevStep()">
        <elements-icon v-bind:icon="'backIcon'" class="me-2" />
        {{$t("Previous")}}
      </button>
      
      <submittal-button @click="saveProductDependenciesHandler" :isLoading="state.isLoading" :iconName="('saveIcon')" :buttonName="$t('Save and Proceed')" />
    </div>
  </div>
</template>
